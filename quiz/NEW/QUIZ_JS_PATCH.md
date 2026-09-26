# Патч `quiz.js`: переход с `GoogleSheetsAPI` на `SupabaseAPI`

Ищите блоки по названию функции (Ctrl+F по имени) — точные номера строк могли
немного сместиться с момента аудита. Каждый блок: «Найти» (что убрать) →
«Заменить на» (что вставить вместо).

---

## 1. Весь sync-движок (самый большой блок)

**Найти и удалить целиком** блок, начинающийся с `function mergeCloudAndLocalData(...)`
и заканчивающийся на `window.addEventListener('beforeunload', ...)` перед
`/* RPG PROGRESSION ... */`. Это функции: `mergeCloudAndLocalData`,
`updateQuizStatsUI` (**эту оставить**, просто вырезать остальные вокруг неё),
`fetchAndSyncUserData` (мёртвый код — просто исчезает), `initGoogleSheetsAccountSync`,
`loadLocalUserData`, `setSyncStatus` (**оставить**), `_saveFavorites`/`_savePlaylists`/
`_saveSessionHistory`, `setUserFavorites`/`setUserPlaylists`, `addSessionHistoryRecord`,
`schedulePush`/`pushToSheets`/`pullFromSheets`/`startAutoSync`, `enqueueCloudSync`/
`syncCloudUserData`/`processSyncQueue`, `testSheetsConn`/`forcePushToSheets`/
`forcePullFromSheets`/`manualCloudSync`, и три `window.addEventListener`
(`online`, `visibilitychange`, `beforeunload`) про `pending sync`.

**Заменить на:**

```js
/**
 * Recalculate Quiz Stats & Update UI Displays — UNCHANGED, keep the
 * original updateQuizStatsUI() function exactly as it was.
 */
// (leave updateQuizStatsUI() where it was)

/**
 * Initialize Supabase Account Sync — runs once auth.js has resolved a
 * session (see 'starley-auth-ready' listener at the bottom of this block).
 * Loads favorites/playlists/history from Supabase (source of truth) and
 * opens a realtime subscription so other devices' changes arrive live,
 * instead of a 30s polling loop.
 */
async function initSupabaseAccountSync() {
    const user = window.AuthSystem ? window.AuthSystem.getCurrentUser() : null;
    const syncBadge = document.getElementById('quiz-sync-status-badge');
    const cabinetBadge = document.getElementById('cabinet-sync-indicator');
    const nameDisplay = document.getElementById('profile-nickname-display');
    const adminBtn = document.getElementById('btn-open-admin-modal');

    if (!user) return;

    const reqAccountBtn = document.getElementById('btn-request-account');
    if (reqAccountBtn) reqAccountBtn.style.display = (user && !user.isGuest) ? 'none' : 'inline-flex';
    if (nameDisplay) nameDisplay.textContent = user.nickname || user.username || 'Doctor User';
    if (user.role === 'admin' && adminBtn) adminBtn.style.display = 'inline-block';

    if (user.isGuest) {
        setSyncStatus('off');
        if (cabinetBadge) cabinetBadge.textContent = '👤 Guest Mode (No Cloud Sync)';
        // Guest still works fully offline/local-only:
        state.userFavorites = sanitizeFavoritesList(JSON.parse(localStorage.getItem('starley_user_favorites') || '[]'));
        state.userPlaylists = sanitizePlaylistsList(JSON.parse(localStorage.getItem('starley_user_playlists') || '[]'));
        ensureTenPlaylists();
        state.sessionHistory = JSON.parse(localStorage.getItem('starley_session_history') || '[]');
        updateQuizStatsUI();
        return;
    }

    setSyncStatus('syncing');
    try {
        const [favRes, plRes, histRes] = await Promise.all([
            window.SupabaseAPI.getFavorites(),
            window.SupabaseAPI.getPlaylists(),
            window.SupabaseAPI.getSessionHistory(100)
        ]);

        state.userFavorites = sanitizeFavoritesList(favRes.data || []);
        state.userPlaylists = sanitizePlaylistsList(plRes.data || []);
        ensureTenPlaylists();
        state.sessionHistory = (histRes.data || []).map(mapSupabaseSessionToLocal);

        updateQuizStatsUI();
        if (typeof window.renderCabinetPlaylists === 'function') window.renderCabinetPlaylists();
        if (typeof window.renderFavoritesList === 'function') window.renderFavoritesList();
        if (typeof window.renderSessionHistoryTable === 'function') window.renderSessionHistoryTable();

        setSyncStatus('ok', 'Cloud Synchronized');
    } catch (err) {
        console.warn('[Sync] initial load failed:', err);
        setSyncStatus('err', 'Sync Error');
    }

    // Realtime: apply targeted changes instead of ever re-pulling everything.
    window.SupabaseAPI.subscribeToOwnChanges(user.id, {
        favorites: () => window.SupabaseAPI.getFavorites().then(r => {
            state.userFavorites = sanitizeFavoritesList(r.data || []);
            updateQuizStatsUI();
            if (typeof window.renderFavoritesList === 'function') window.renderFavoritesList();
        }),
        playlists: () => window.SupabaseAPI.getPlaylists().then(r => {
            state.userPlaylists = sanitizePlaylistsList(r.data || []);
            if (typeof window.renderCabinetPlaylists === 'function') window.renderCabinetPlaylists();
        }),
        playlist_items: () => window.SupabaseAPI.getPlaylists().then(r => {
            state.userPlaylists = sanitizePlaylistsList(r.data || []);
            if (typeof window.renderCabinetPlaylists === 'function') window.renderCabinetPlaylists();
        }),
        quiz_sessions: () => window.SupabaseAPI.getSessionHistory(100).then(r => {
            state.sessionHistory = (r.data || []).map(mapSupabaseSessionToLocal);
            updateQuizStatsUI();
            if (typeof window.renderSessionHistoryTable === 'function') window.renderSessionHistoryTable();
        })
    });
}

// Maps a Supabase quiz_sessions row back to the shape the rest of quiz.js
// (RPG stats, history table renderer) already expects.
function mapSupabaseSessionToLocal(row) {
    return {
        sessionId: row.session_id,
        date: row.date,
        setTitle: row.set_title,
        mode: row.mode,
        lang: row.lang,
        totalQ: row.total_q,
        correctQ: row.correct_q,
        scorePct: row.score_pct,
        timeSpentSec: row.time_spent_sec,
        expGained: row.exp_gained,
        topics: row.topics || [],
        detailString: row.detail_summary || ''
    };
}

/**
 * Favorites / Playlists mutators — write straight through to Supabase.
 * No debounce, no queue: each is a single small row-level request, so
 * there is nothing to batch and nothing that can silently get lost.
 */
function setUserFavorites(favs) {
    // kept for any legacy call sites that still pass a full array —
    // prefer addFavoriteQuestion()/removeFavoriteQuestion() below instead.
    state.userFavorites = sanitizeFavoritesList(favs);
    updateQuizStatsUI();
}

function setUserPlaylists(pls) {
    state.userPlaylists = sanitizePlaylistsList(pls);
    ensureTenPlaylists();
    updateQuizStatsUI();
}
```

---

## 2. `toggleFavoriteQuestion`

**Найти:**
```js
    localStorage.setItem('starley_user_favorites', JSON.stringify(state.userFavorites));

    const btnFav = document.getElementById('btn-toggle-favorite');
    if (btnFav) {
        const icon = btnFav.querySelector('i');
        if (icon) icon.className = isFav ? 'fas fa-star' : 'far fa-star';
        btnFav.style.transform = 'scale(1.3)';
        setTimeout(() => btnFav.style.transform = 'scale(1)', 200);
    }

    playSound('click');
    triggerHaptic('click');

    syncCloudUserData();
```

**Заменить на:**
```js
    const user = window.AuthSystem ? window.AuthSystem.getCurrentUser() : null;
    if (user && !user.isGuest && window.SupabaseAPI) {
        (isFav ? window.SupabaseAPI.addFavorite(specId) : window.SupabaseAPI.removeFavorite(specId))
            .catch(err => console.warn('[Favorites] sync failed:', err));
    } else {
        localStorage.setItem('starley_user_favorites', JSON.stringify(state.userFavorites));
    }

    const btnFav = document.getElementById('btn-toggle-favorite');
    if (btnFav) {
        const icon = btnFav.querySelector('i');
        if (icon) icon.className = isFav ? 'fas fa-star' : 'far fa-star';
        btnFav.style.transform = 'scale(1.3)';
        setTimeout(() => btnFav.style.transform = 'scale(1)', 200);
    }

    playSound('click');
    triggerHaptic('click');
```
*(remove the trailing `syncCloudUserData();` call two lines below this block too)*

---

## 3. `window.toggleQuestionInPlaylist`

**Найти:**
```js
    pl.count = pl.questionIds.length;

    syncCloudUserData();
    renderPlaylistsTab();
```

**Заменить на:**
```js
    pl.count = pl.questionIds.length;

    const user = window.AuthSystem ? window.AuthSystem.getCurrentUser() : null;
    const willAdd = pl.questionIds.includes(specId);
    if (user && !user.isGuest && window.SupabaseAPI) {
        window.SupabaseAPI.togglePlaylistItem(pl.id, specId, willAdd)
            .catch(err => console.warn('[Playlist] sync failed:', err));
    }
    renderPlaylistsTab();
```

---

## 4. `window.createNewCustomPlaylist`

**Найти:**
```js
        if (!Array.isArray(state.userPlaylists)) state.userPlaylists = [];
        state.userPlaylists.push(newPl);

        enqueueCloudSync(null);
        renderPlaylistsTab();
```

**Заменить на:**
```js
        const user = window.AuthSystem ? window.AuthSystem.getCurrentUser() : null;
        if (user && !user.isGuest && window.SupabaseAPI) {
            window.SupabaseAPI.createPlaylist(newPl.title).then(res => {
                if (res.ok) {
                    newPl.id = res.data.id; // adopt the server-assigned UUID
                    if (!Array.isArray(state.userPlaylists)) state.userPlaylists = [];
                    state.userPlaylists.push(newPl);
                    renderPlaylistsTab();
                }
            });
        } else {
            if (!Array.isArray(state.userPlaylists)) state.userPlaylists = [];
            state.userPlaylists.push(newPl);
            renderPlaylistsTab();
        }
```

---

## 5. `window.selectAvatarSymbol` and `window.saveUserProfileChanges`

**Найти** (в обеих функциях) хвост вида:
```js
    localStorage.setItem('starley_user_profile', JSON.stringify(state.userProfile));

    updateUserProfileDisplay();
    schedulePush();
```
или (во второй функции) `pushToSheets(true);` вместо `schedulePush();`.

**Заменить на** (в обеих функциях одинаково):
```js
    updateUserProfileDisplay();
    const user = window.AuthSystem ? window.AuthSystem.getCurrentUser() : null;
    if (user && !user.isGuest && window.SupabaseAPI) {
        window.SupabaseAPI.updateProfile({ nickname: state.userProfile.nickname, avatar: state.userProfile.avatar })
            .then(res => { if (res.ok && window.AuthSystem) window.AuthSystem.setAuthenticated(res.data); })
            .catch(err => console.warn('[Profile] sync failed:', err));
    } else {
        localStorage.setItem('starley_user_profile', JSON.stringify(state.userProfile));
    }
```

---

## 6. Завершение теста (конец `finishQuiz`-подобной функции, где строится `newSessionObj`)

**Найти:**
```js
    if (totalQ >= 2 && !state.isSingleQuestionPreview) {
        syncCloudUserData(newSessionObj);
    } else {
        syncCloudUserData(null);
    }
    state.isSingleQuestionPreview = false;
```

**Заменить на:**
```js
    if (totalQ >= 2 && !state.isSingleQuestionPreview) {
        state.sessionHistory.unshift(newSessionObj);
        updateQuizStatsUI();

        const user = window.AuthSystem ? window.AuthSystem.getCurrentUser() : null;
        if (user && !user.isGuest && window.SupabaseAPI) {
            const compact = sanitizeSessionForSync(newSessionObj); // already exists, just finally used
            window.SupabaseAPI.saveSession({
                sessionId: newSessionObj.sessionId,
                date: newSessionObj.date,
                setTitle: newSessionObj.setTitle,
                mode: newSessionObj.mode,
                lang: newSessionObj.lang,
                totalQ: newSessionObj.totalQ,
                correctQ: newSessionObj.correctQ,
                scorePct: newSessionObj.scorePct,
                timeSpentSec: newSessionObj.timeSpentSec,
                expGained: newSessionObj.expGained,
                topics: newSessionObj.topics,
                detailSummary: compact.detailString   // compact string, NOT full bilingual question dump
            }).catch(err => console.warn('[Session] sync failed:', err));
        } else {
            localStorage.setItem('starley_session_history', JSON.stringify(state.sessionHistory));
        }
    }
    state.isSingleQuestionPreview = false;
```

---

## 7. Точка запуска синхронизации

**Найти** (единственное место, где раньше запускался весь пайплайн):
```js
        initGoogleSheetsAccountSync();
```

**Заменить на:**
```js
        // auth.js's boot() is now async, so wait for its ready signal
        // instead of assuming AuthSystem is already populated.
        document.addEventListener('starley-auth-ready', () => initSupabaseAccountSync());
        // Also cover the case where auth.js already finished before this
        // script ran (e.g. fast cache hit):
        if (window.AuthSystem && window.AuthSystem.getCurrentUser()) {
            initSupabaseAccountSync();
        }
```

---

## Что можно НЕ трогать

`state`, `sanitizeFavoritesList`, `sanitizePlaylistsList`, `ensureTenPlaylists`,
`isFavoriteQuestion`, `getQuestionSpecialId`, весь RPG/EXP-движок, рендеринг —
всё это работает с уже загруженным `state.*` и не знает, откуда данные
физически пришли. Трогаем только точки записи/чтения наружу.

## Проверка после патча

1. Открыть `quiz.html` в двух вкладках под одним аккаунтом.
2. Добавить вопрос в избранное в первой вкладке — во второй (без перезагрузки)
   должно появиться живьём через realtime-подписку в течение секунды.
3. Пройти тест из 20+ вопросов, убедиться, что в Supabase Table Editor →
   `quiz_sessions` появилась строка и `detail_summary` — короткая строка вида
   `12🧠5, 12🧠9(A)B`, а не мегабайт HTML.
4. Открыть DevTools → Network — убедиться, что запросов к
   `script.google.com` больше нет вообще.
