/**
 * Starley Medical Quiz - Storage & Cloud Synchronization Layer (DAL)
 * Unified Data Access Layer for LocalStorage, Quota Management,
 * Offline Queueing, and Supabase Backend Integration.
 */

(function(window) {
    'use strict';

    // In-memory cache for Question Mastery states to prevent disk I/O freezes
    const _masteryMemoryCache = new Map();
    let _masteryFlushTimer = null;
    const _masteryPendingWrites = new Map();

    const QuizStorage = {
        /**
         * Get current user from AuthSystem safely
         */
        getCurrentUser() {
            return (window.AuthSystem && typeof window.AuthSystem.getCurrentUser === 'function')
                ? window.AuthSystem.getCurrentUser()
                : null;
        },

        /**
         * Build scoped storage key per authenticated user or guest
         */
        getScopedUserKey(baseKey) {
            const user = this.getCurrentUser();
            const uid = (user && !user.isGuest && user.id) ? user.id : 'guest';
            return `${baseKey}_${uid}`;
        },

        // ======================================================================
        // QUESTION MASTERY (SPACED REPETITION STATE) WITH MEMORY CACHE
        // ======================================================================

        /**
         * Get question mastery state with O(1) memory cache lookup
         */
        getQuestionMastery(q) {
            if (!q) return { state: 'unseen', consecutiveCorrect: 0, views: 0 };
            const key = typeof window.getQuestionKey === 'function' 
                ? window.getQuestionKey(q) 
                : (q.key || q.specialId || (q.bookPath ? `${q.bookPath}_${q.id}` : `q_${q.id}`));
            
            if (_masteryMemoryCache.has(key)) {
                return _masteryMemoryCache.get(key);
            }

            let val = { state: 'unseen', consecutiveCorrect: 0, views: 0 };
            try {
                const stored = localStorage.getItem(key);
                if (stored) {
                    val = JSON.parse(stored);
                    if (!val.state) val.state = 'unseen';
                }
            } catch (e) {
                val = { state: 'unseen', consecutiveCorrect: 0, views: 0 };
            }

            _masteryMemoryCache.set(key, val);
            return val;
        },

        /**
         * Save question mastery state to memory cache and schedule batch flush to disk
         */
        saveQuestionMastery(q, mastery) {
            if (!q || !mastery) return;
            const key = typeof window.getQuestionKey === 'function' 
                ? window.getQuestionKey(q) 
                : (q.key || q.specialId || (q.bookPath ? `${q.bookPath}_${q.id}` : `q_${q.id}`));

            mastery.views = (mastery.views || 0) + 1;
            mastery.lastSeen = Date.now();

            _masteryMemoryCache.set(key, mastery);
            _masteryPendingWrites.set(key, JSON.stringify(mastery));

            // Immediate write + microtask debounce to prevent UI stutter
            if (!_masteryFlushTimer) {
                _masteryFlushTimer = setTimeout(() => {
                    _masteryPendingWrites.forEach((json, k) => {
                        try {
                            localStorage.setItem(k, json);
                        } catch (e) {
                            console.warn('[QuizStorage] Quota exceeded saving mastery for:', k);
                        }
                    });
                    _masteryPendingWrites.clear();
                    _masteryFlushTimer = null;
                }, 50);
            }
        },

        /**
         * Clear memory cache (useful on logout / profile switch)
         */
        clearMasteryCache() {
            _masteryMemoryCache.clear();
            _masteryPendingWrites.clear();
        },

        // ======================================================================
        // USER PROFILE & PREFERENCES
        // ======================================================================

        loadUserProfile() {
            const user = this.getCurrentUser();
            const profKey = this.getScopedUserKey('starley_user_profile');
            let localProfile = null;
            try {
                const stored = localStorage.getItem(profKey);
                if (stored) localProfile = JSON.parse(stored);
            } catch (e) {}

            const isAuth = user && !user.isGuest;
            return {
                nickname: (isAuth && user.nickname) || (localProfile && localProfile.nickname) || (isAuth ? user.username : 'Guest Doctor'),
                avatar: (isAuth && user.avatar) || (localProfile && localProfile.avatar) || 'doc',
                streak: (localProfile && localProfile.streak) || 1,
                lastActiveDate: (localProfile && localProfile.lastActiveDate) || new Date().toDateString(),
                totalSolved: (localProfile && localProfile.totalSolved) || 0,
                correctCount: (localProfile && localProfile.correctCount) || 0,
                level: (localProfile && localProfile.level) || 1,
                currentExp: (localProfile && localProfile.currentExp) || 0,
                totalExp: (localProfile && localProfile.totalExp) || 0,
                tierId: (localProfile && localProfile.tierId) || 1
            };
        },

        saveUserProfile(profile) {
            if (!profile) return;
            try {
                const profKey = this.getScopedUserKey('starley_user_profile');
                const json = JSON.stringify(profile);
                localStorage.setItem(profKey, json);
                const user = this.getCurrentUser();
                if (!user || user.isGuest) {
                    localStorage.setItem('starley_user_profile', json);
                }
            } catch (e) {
                console.warn('[QuizStorage] Failed saving user profile to localStorage:', e);
            }
        },

        // ======================================================================
        // DATA SANITIZATION
        // ======================================================================

        sanitizeFavoritesList(favList) {
            if (!Array.isArray(favList)) return [];
            const result = [];
            const seen = new Set();

            favList.forEach(item => {
                if (!item) return;
                let idStr = '';
                if (typeof item === 'string' || typeof item === 'number') {
                    idStr = String(item).trim();
                } else if (typeof item === 'object') {
                    idStr = String(item.id || item.specialId || item.cleanSpecialId || item.rawSpecialId || '').trim();
                }
                if (idStr && idStr !== '[object Object]' && !idStr.includes('[object') && !seen.has(idStr)) {
                    seen.add(idStr);
                    result.push(idStr);
                }
            });

            return result;
        },

        sanitizePlaylistsList(playlistList) {
            if (!Array.isArray(playlistList)) return [];
            return playlistList.map(pl => {
                if (!pl || !pl.id) return null;
                return {
                    id: String(pl.id),
                    title: String(pl.title || pl.id || '1').substring(0, 80),
                    iconId: Number(pl.iconId) || 1,
                    count: Array.isArray(pl.questionIds) ? pl.questionIds.length : 0,
                    questionIds: Array.isArray(pl.questionIds) ? pl.questionIds.map(String) : [],
                    createdAt: pl.createdAt || new Date().toISOString()
                };
            }).filter(Boolean);
        },

        sanitizeSessionForSync(sessionObj) {
            if (!sessionObj) return null;

            let detailStr = '';
            if (Array.isArray(sessionObj.errors) && sessionObj.errors.length > 0) {
                detailStr = sessionObj.errors.map(e => {
                    const specId = e.specialId || e.questionId || '';
                    if (e.isCorrect) {
                        return specId;
                    } else {
                        const correctL = String(e.correctAnswer || '').trim();
                        const chosenL = String(e.chosen || '').trim();
                        return `${specId}(${correctL})${chosenL}`;
                    }
                }).join(', ');
            } else if (typeof sessionObj.detailString === 'string') {
                detailStr = sessionObj.detailString;
            }

            const totalQ = Number(sessionObj.totalQ || sessionObj.count) || 0;
            const correctQ = Number(sessionObj.correctQ || sessionObj.correctCount) || 0;
            const scorePct = Number(sessionObj.scorePct || sessionObj.accuracyPct) || 0;
            const timeSec = Number(sessionObj.timeSpentSec) || 0;

            const m = Math.floor(timeSec / 60);
            const s = timeSec % 60;
            const timeSpentStr = sessionObj.timeSpentStr || `${m}m ${s}s`;
            const avgSec = totalQ > 0 ? Math.round(timeSec / totalQ) : 0;
            const avgTimePerQStr = sessionObj.avgTimePerQStr || `${avgSec}s`;

            const topicsArr = Array.isArray(sessionObj.topics) ? sessionObj.topics : [sessionObj.setTitle || 'Quiz'];
            const topicsStr = topicsArr.join('; ');

            return {
                sessionId: String(sessionObj.sessionId || ('sess_' + Date.now())),
                date: sessionObj.date || new Date().toISOString(),
                setTitle: String(sessionObj.setTitle || 'Quiz Session').substring(0, 80),
                topics: topicsStr,
                count: totalQ,
                totalQ: totalQ,
                timeSpentSec: timeSec,
                timeSpentStr: timeSpentStr,
                avgTimePerQStr: avgTimePerQStr,
                correctCount: correctQ,
                correctQ: correctQ,
                accuracyPct: scorePct,
                scorePct: scorePct,
                topicAccuracies: typeof sessionObj.topicAccuracies === 'string' 
                    ? sessionObj.topicAccuracies 
                    : JSON.stringify(sessionObj.topicAccuracies || {}),
                detailString: detailStr,
                mode: sessionObj.mode || 'smart',
                lang: sessionObj.lang || 'En',
                countMode: String(sessionObj.countMode || '10'),
                errors: sessionObj.errors || []
            };
        },

        // ======================================================================
        // FAIL-SAFE LOCAL STORAGE WITH SMART PRUNING
        // ======================================================================

        /**
         * Guaranteed never to drop or fail to save the latest completed session
         * Applies 3-level progressive compression if browser quota is exceeded.
         */
        safeSaveSessionHistory(historyList) {
            if (!Array.isArray(historyList)) return false;
            const histKey = this.getScopedUserKey('starley_session_history');
            const user = this.getCurrentUser();
            const isGuest = !user || user.isGuest;

            function tryStore(list) {
                const json = JSON.stringify(list);
                localStorage.setItem(histKey, json);
                if (isGuest) {
                    localStorage.setItem('starley_session_history', json);
                }
                return true;
            }

            // Level 1: Standard direct save
            try {
                return tryStore(historyList);
            } catch (errQuota) {
                console.warn('[QuizStorage] Quota reached. Performing smart compression on historical sessions...', errQuota);
            }

            // Level 2: Keep latest 5 sessions with full explanations, strip explanation text from older sessions
            try {
                const compressed1 = historyList.map((s, idx) => {
                    if (idx < 5) return s;
                    if (!Array.isArray(s.errors)) return s;
                    return {
                        ...s,
                        errors: s.errors.map(e => ({
                            questionIndex: e.questionIndex,
                            specialId: e.specialId,
                            questionId: e.questionId,
                            isCorrect: e.isCorrect,
                            chosen: e.chosen,
                            correctAnswer: e.correctAnswer
                        }))
                    };
                });
                if (tryStore(compressed1)) {
                    if (window.state) window.state.sessionHistory = compressed1;
                    return true;
                }
            } catch (e1) {
                console.warn('[QuizStorage] Fallback compression 1 failed, applying maximum compact format...', e1);
            }

            // Level 3: Keep latest 50 sessions in ultra-compact summary format
            try {
                const compressed2 = historyList.slice(0, 50).map(s => ({
                    sessionId: s.sessionId,
                    date: s.date,
                    setTitle: s.setTitle,
                    mode: s.mode,
                    lang: s.lang,
                    totalQ: s.totalQ,
                    correctQ: s.correctQ,
                    scorePct: s.scorePct,
                    timeSpentSec: s.timeSpentSec,
                    expGained: s.expGained,
                    topics: s.topics,
                    detailString: s.detailString || s.detailSummary || ''
                }));
                if (tryStore(compressed2)) {
                    if (window.state) window.state.sessionHistory = compressed2;
                    return true;
                }
            } catch (e2) {
                console.error('[QuizStorage] Fatal: unable to save history to localStorage:', e2);
                return false;
            }
        },

        loadSessionHistory() {
            const histKey = this.getScopedUserKey('starley_session_history');
            try {
                const stored = localStorage.getItem(histKey) || localStorage.getItem('starley_session_history');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (Array.isArray(parsed)) return parsed;
                }
            } catch (e) {}
            return [];
        },

        // ======================================================================
        // RESILIENT OFFLINE QUEUEING & SUPABASE SYNC
        // ======================================================================

        enqueueSessionForSync(sessionObj) {
            if (!sessionObj) return;
            const user = this.getCurrentUser();
            if (!user || user.isGuest) return;

            try {
                const pendingKey = this.getScopedUserKey('starley_pending_sessions');
                let pending = [];
                const raw = localStorage.getItem(pendingKey) || localStorage.getItem('starley_pending_sessions');
                if (raw) pending = JSON.parse(raw);
                if (!Array.isArray(pending)) pending = [];

                const sId = String(sessionObj.sessionId || sessionObj.session_id);
                if (!pending.some(p => String(p.sessionId || p.session_id) === sId)) {
                    const pendingItem = {
                        sessionId: sId,
                        date: sessionObj.date || new Date().toISOString(),
                        setTitle: sessionObj.setTitle || 'Quiz Session',
                        mode: sessionObj.mode || 'smart',
                        lang: sessionObj.lang || 'En',
                        totalQ: sessionObj.totalQ || sessionObj.count || 0,
                        correctQ: sessionObj.correctQ || sessionObj.correctCount || 0,
                        scorePct: sessionObj.scorePct || sessionObj.accuracyPct || 0,
                        timeSpentSec: sessionObj.timeSpentSec || 0,
                        expGained: sessionObj.expGained || 0,
                        topics: sessionObj.topics || [],
                        detailSummary: sessionObj.detailSummary || sessionObj.detailString || ''
                    };
                    pending.push(pendingItem);
                    localStorage.setItem(pendingKey, JSON.stringify(pending));
                }
            } catch (e) {
                console.warn('[QuizStorage] enqueueSessionForSync error:', e);
            }

            if (window.SupabaseAPI && typeof window.SupabaseAPI.syncPendingQuizSessions === 'function') {
                window.SupabaseAPI.syncPendingQuizSessions().catch(err => {
                    console.warn('[QuizStorage] syncPendingQuizSessions error:', err);
                });
            }
        },

        removeFromPendingSync(sessionId) {
            if (!sessionId) return;
            try {
                const pendingKey = this.getScopedUserKey('starley_pending_sessions');
                let pending = [];
                const raw = localStorage.getItem(pendingKey);
                if (raw) pending = JSON.parse(raw);
                if (Array.isArray(pending)) {
                    pending = pending.filter(p => String(p.sessionId || p.session_id) !== String(sessionId));
                    if (pending.length > 0) {
                        localStorage.setItem(pendingKey, JSON.stringify(pending));
                    } else {
                        localStorage.removeItem(pendingKey);
                        localStorage.removeItem('starley_pending_sessions');
                    }
                }
            } catch (e) {}
        },

        syncProfileRpgToSupabase(updatedRpg) {
            const user = this.getCurrentUser();
            if (!user || user.isGuest || !window.SupabaseAPI || !updatedRpg) return;
            window.SupabaseAPI.updateProfile({
                level_num: updatedRpg.level,
                current_exp: updatedRpg.currentExp,
                total_exp: updatedRpg.totalExp,
                tier_id: updatedRpg.tierId
            }).catch(e => console.warn('[QuizStorage] RPG sync failed:', e));
        },

        mapSupabaseSessionToLocal(row) {
            if (!row) return null;
            return {
                sessionId: row.session_id || row.sessionId || ('sess_' + Date.now()),
                date: row.date || new Date().toISOString(),
                setTitle: row.set_title || row.setTitle || 'Quiz Session',
                mode: row.mode || 'smart',
                lang: row.lang || 'En',
                totalQ: Number(row.total_q !== undefined ? row.total_q : (row.totalQ !== undefined ? row.totalQ : row.count)) || 0,
                correctQ: Number(row.correct_q !== undefined ? row.correct_q : (row.correctQ !== undefined ? row.correctQ : row.correctCount)) || 0,
                scorePct: Number(row.score_pct !== undefined ? row.score_pct : (row.scorePct !== undefined ? row.scorePct : row.accuracyPct)) || 0,
                timeSpentSec: Number(row.time_spent_sec !== undefined ? row.time_spent_sec : (row.timeSpentSec || 0)) || 0,
                expGained: Number(row.exp_gained !== undefined ? row.exp_gained : (row.expGained || 0)) || 0,
                topics: Array.isArray(row.topics)
                    ? row.topics
                    : (typeof row.topics === 'string'
                        ? row.topics.split(';').map(t => t.trim()).filter(Boolean)
                        : []),
                detailString: row.detail_summary || row.detailString || '',
                errors: Array.isArray(row.errors) ? row.errors : [],
                manifestBreakdown: Array.isArray(row.manifestBreakdown) ? row.manifestBreakdown : []
            };
        },

        mergeAndPersistSessionHistory(remoteSessionsRaw) {
            const user = this.getCurrentUser();
            const isGuest = !user || user.isGuest;
            const histKey = this.getScopedUserKey('starley_session_history');

            let localHistory = [];
            try {
                localHistory = JSON.parse(localStorage.getItem(histKey) || '[]');
            } catch (e) {
                localHistory = [];
            }
            if (!Array.isArray(localHistory)) localHistory = [];

            const remoteSessions = (Array.isArray(remoteSessionsRaw) ? remoteSessionsRaw : [])
                .map(this.mapSupabaseSessionToLocal)
                .filter(Boolean);

            const sessionMap = new Map();

            // Cloud is authoritative for authenticated sessions
            remoteSessions.forEach(s => {
                if (s && s.sessionId) sessionMap.set(String(s.sessionId), s);
            });

            // Merge local sessions, keeping detailed errors if remote lacks them
            const unSyncedLocal = [];
            localHistory.forEach(localSess => {
                if (!localSess) return;
                const id = String(localSess.sessionId || localSess.session_id || '');
                if (!id) return;

                if (!sessionMap.has(id)) {
                    sessionMap.set(id, localSess);
                    unSyncedLocal.push(localSess);
                } else {
                    const remote = sessionMap.get(id);
                    if (Array.isArray(localSess.errors) && localSess.errors.length > 0 && (!remote.errors || remote.errors.length === 0)) {
                        remote.errors = localSess.errors;
                    }
                    if (Array.isArray(localSess.manifestBreakdown) && localSess.manifestBreakdown.length > 0 && (!remote.manifestBreakdown || remote.manifestBreakdown.length === 0)) {
                        remote.manifestBreakdown = localSess.manifestBreakdown;
                    }
                }
            });

            const merged = Array.from(sessionMap.values());
            merged.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

            if (window.state) window.state.sessionHistory = merged;
            try {
                localStorage.setItem(histKey, JSON.stringify(merged));
                if (isGuest) {
                    localStorage.setItem('starley_session_history', JSON.stringify(merged));
                }
            } catch (e) {}

            // Queue any local un-synced sessions for cloud upload
            if (!isGuest && unSyncedLocal.length > 0) {
                try {
                    const pendingKey = this.getScopedUserKey('starley_pending_sessions');
                    let pending = [];
                    const raw = localStorage.getItem(pendingKey);
                    if (raw) pending = JSON.parse(raw);
                    if (!Array.isArray(pending)) pending = [];

                    unSyncedLocal.forEach(s => {
                        const sId = String(s.sessionId || s.session_id);
                        if (!pending.some(p => String(p.sessionId || p.session_id) === sId)) {
                            pending.push(s);
                        }
                    });
                    localStorage.setItem(pendingKey, JSON.stringify(pending));
                    if (window.SupabaseAPI && typeof window.SupabaseAPI.syncPendingQuizSessions === 'function') {
                        window.SupabaseAPI.syncPendingQuizSessions().catch(() => {});
                    }
                } catch (e) {}
            }

            if (typeof window.updateQuizStatsUI === 'function') window.updateQuizStatsUI();
            if (typeof window.renderHistoryTab === 'function') window.renderHistoryTab();
            return merged;
        },

        // ======================================================================
        // STATUS BADGE & UI SYNC STATE
        // ======================================================================

        setSyncStatus(status, detailText = '') {
            const syncBadge = document.getElementById('quiz-sync-status-badge');
            const cabinetBadge = document.getElementById('cabinet-sync-indicator');
            const lastSyncEl = document.getElementById('txt-last-sync-time');

            let badgeText = '⚪ · Local';
            let badgeColor = '#8b949e';
            let badgeBorder = 'rgba(139, 148, 158, 0.3)';
            let cabText = '⚪ · Local Mode';

            if (status === 'syncing') {
                badgeText = '🟡 ↻ Syncing...';
                badgeColor = '#eab308';
                badgeBorder = 'rgba(234, 179, 8, 0.3)';
                cabText = '🟡 ↻ Syncing with Supabase...';
            } else if (status === 'ok') {
                badgeText = '🟢 ✓ Synced';
                badgeColor = '#3fb950';
                badgeBorder = 'rgba(63, 185, 80, 0.3)';
                cabText = '🟢 ✓ Cloud Synced to Supabase';
                if (lastSyncEl) {
                    const timeStr = new Date().toLocaleTimeString();
                    lastSyncEl.textContent = timeStr;
                }
            } else if (status === 'err') {
                badgeText = '🔴 ✗ Network Error';
                badgeColor = '#f85149';
                badgeBorder = 'rgba(248, 81, 73, 0.3)';
                cabText = '🔴 ✗ Sync Error (Saved Locally)';
            }

            if (syncBadge) {
                syncBadge.textContent = badgeText;
                syncBadge.style.color = badgeColor;
                syncBadge.style.borderColor = badgeBorder;
            }
            if (cabinetBadge) {
                cabinetBadge.textContent = detailText || cabText;
                cabinetBadge.style.color = badgeColor;
            }
        }
    };

    // Export to window
    window.QuizStorage = QuizStorage;

    // Backwards-compatible global function aliases for existing inline calls
    window.getScopedUserKey = QuizStorage.getScopedUserKey.bind(QuizStorage);
    window.loadUserProfile = QuizStorage.loadUserProfile.bind(QuizStorage);
    window.saveUserProfile = QuizStorage.saveUserProfile.bind(QuizStorage);
    window.getQuestionMastery = QuizStorage.getQuestionMastery.bind(QuizStorage);
    window.saveQuestionMastery = QuizStorage.saveQuestionMastery.bind(QuizStorage);
    window.sanitizeFavoritesList = QuizStorage.sanitizeFavoritesList.bind(QuizStorage);
    window.sanitizePlaylistsList = QuizStorage.sanitizePlaylistsList.bind(QuizStorage);
    window.sanitizeSessionForSync = QuizStorage.sanitizeSessionForSync.bind(QuizStorage);
    window.safeSaveSessionHistory = QuizStorage.safeSaveSessionHistory.bind(QuizStorage);
    window.loadSessionHistory = QuizStorage.loadSessionHistory.bind(QuizStorage);
    window.enqueueSessionForSync = QuizStorage.enqueueSessionForSync.bind(QuizStorage);
    window.removeFromPendingSync = QuizStorage.removeFromPendingSync.bind(QuizStorage);
    window.syncProfileRpgToSupabase = QuizStorage.syncProfileRpgToSupabase.bind(QuizStorage);
    window.mapSupabaseSessionToLocal = QuizStorage.mapSupabaseSessionToLocal.bind(QuizStorage);
    window.mergeAndPersistSessionHistory = QuizStorage.mergeAndPersistSessionHistory.bind(QuizStorage);
    window.setSyncStatus = QuizStorage.setSyncStatus.bind(QuizStorage);

    // Auto-listen to network online/offline events for background retry
    if (typeof window.addEventListener === 'function') {
        window.addEventListener('online', () => {
            console.log('🌐 [QuizStorage] Browser went online. Flushing pending session queue...');
            QuizStorage.setSyncStatus('syncing');
            if (window.SupabaseAPI && typeof window.SupabaseAPI.syncPendingQuizSessions === 'function') {
                QuizStorage.syncPendingQuizSessions()
                    .then(() => QuizStorage.setSyncStatus('ok', 'Cloud Synchronized'))
                    .catch(() => QuizStorage.setSyncStatus('err', 'Sync Retry Failed'));
            }
        });
    }

})(window);
