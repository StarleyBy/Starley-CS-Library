// assets/js/supabase-api.js
//
// Replacement for google-sheets-api.js. Same job (favorites / playlists /
// sessions / profile sync), completely different mechanics:
//   - Real auth session (JWT) instead of re-sending the raw PIN on every call.
//   - Every favorite / playlist item / session is its own row -> no full-object
//     overwrite, no 50,000-char cell limit, no lost-update race.
//   - Realtime subscription for live cross-device sync instead of 30s polling.
//
// Load order in HTML files:
//   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
//   <script src="assets/js/config.js"></script>
//   <script src="assets/js/supabase-api.js"></script>
//   <script src="assets/js/auth.js"></script>
//   <script src="assets/js/quiz.js"></script>
//
// config.js exposes:
//   window.SUPABASE_URL = 'https://tsqnudichrxbbbryrbrs.supabase.co';
//   window.SUPABASE_ANON_KEY = 'eyJ...';
//   window.SUPABASE_FUNCTIONS_URL = 'https://tsqnudichrxbbbryrbrs.supabase.co/functions/v1';

(function () {
    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
        console.error('[SupabaseAPI] supabase-js UMD bundle not loaded before this file.');
        return;
    }

    const client = window.supabase.createClient(
        window.SUPABASE_URL,
        window.SUPABASE_ANON_KEY,
        { auth: { persistSession: true, autoRefreshToken: true } }
    );

    // -------------------------------------------------------------------
    // Auth — PIN is mapped to a synthetic email so we can reuse Supabase's
    // password auth (hashing, session issuance, abuse protection).
    // -------------------------------------------------------------------
    function pinToEmail(pin) {
        return `pin_${String(pin).trim()}@starley.com`;
    }

    function pinToPassword(pin) {
        return `starley_${String(pin).trim()}`;
    }

    async function loginWithPin(pin) {
        const cleanPin = String(pin).trim();

        // 1. Primary try: pin_<pin>@starley.com / starley_<pin>
        let res = await client.auth.signInWithPassword({
            email: pinToEmail(cleanPin),
            password: pinToPassword(cleanPin)
        });

        // 2. Fallback try: pin_<pin>@starley.com / <pin> (bare PIN)
        if (res.error && res.error.message && res.error.message.toLowerCase().includes('invalid')) {
            const retry1 = await client.auth.signInWithPassword({
                email: pinToEmail(cleanPin),
                password: cleanPin
            });
            if (!retry1.error) res = retry1;
        }

        // 3. Fallback try: pin_<pin>@starley.local / <pin> (Google Sheets migration format)
        if (res.error && res.error.message && res.error.message.toLowerCase().includes('invalid')) {
            const retry2 = await client.auth.signInWithPassword({
                email: `pin_${cleanPin}@starley.local`,
                password: cleanPin
            });
            if (!retry2.error) res = retry2;
        }

        // 4. Fallback try: pin_<pin>@starley.local / starley_<pin>
        if (res.error && res.error.message && res.error.message.toLowerCase().includes('invalid')) {
            const retry3 = await client.auth.signInWithPassword({
                email: `pin_${cleanPin}@starley.local`,
                password: `starley_${cleanPin}`
            });
            if (!retry3.error) res = retry3;
        }

        if (res.error) return { ok: false, success: false, error: res.error.message };

        const data = res.data;
        const profile = await getProfile();
        const fallbackProfile = {
            id: data.user.id,
            username: (data.user.user_metadata && data.user.user_metadata.username) || `user_${cleanPin}`,
            nickname: (data.user.user_metadata && data.user.user_metadata.nickname) || 'Doctor',
            role: 'user',
            avatar: 'doc'
        };
        const resolvedProfile = (profile && profile.ok && profile.data) ? profile.data : fallbackProfile;
        return { ok: true, success: true, user: resolvedProfile, session: data.session };
    }

    async function logout() {
        await client.auth.signOut();
    }

    function getSession() {
        return client.auth.getSession();
    }

    // Fast auth user resolution: checks active cached session first, falls back to getUser()
    async function getAuthUser() {
        try {
            const { data: { session } } = await client.auth.getSession();
            if (session && session.user) return session.user;
        } catch (e) {}
        try {
            const { data: { user } } = await client.auth.getUser();
            return user || null;
        } catch (e) {
            return null;
        }
    }

    // -------------------------------------------------------------------
    // Profile (nickname / avatar / RPG progress)
    // -------------------------------------------------------------------
    async function getProfile() {
        const user = await getAuthUser();
        if (!user) return { ok: false, data: null };
        const { data, error } = await client
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        if (error) return { ok: false, error: error.message, data: null };
        return { ok: true, success: true, data };
    }

    async function updateProfile(patch) {
        const user = await getAuthUser();
        if (!user) return { ok: false, error: 'Not authenticated' };
        const allowed = ['nickname', 'avatar', 'level_num', 'current_exp', 'total_exp', 'tier_id'];
        const safePatch = {};
        allowed.forEach(k => { if (patch[k] !== undefined) safePatch[k] = patch[k]; });

        const { data, error } = await client
            .from('profiles')
            .update(safePatch)
            .eq('id', user.id)
            .select()
            .single();
        if (error) return { ok: false, error: error.message };
        return { ok: true, success: true, data };
    }

    // -------------------------------------------------------------------
    // Favorites — single-row add/remove. No array merge logic needed.
    // -------------------------------------------------------------------
    async function getFavorites() {
        const { data: { user } } = await client.auth.getUser();
        if (!user) return { ok: false, data: [] };
        const { data, error } = await client
            .from('favorites')
            .select('special_id')
            .eq('user_id', user.id);
        if (error) return { ok: false, error: error.message, data: [] };
        return { ok: true, success: true, data: data.map(r => r.special_id) };
    }

    async function addFavorite(specialId) {
        const { data: { user } } = await client.auth.getUser();
        if (!user) return { ok: false, error: 'Not authenticated' };
        const { error } = await client
            .from('favorites')
            .upsert({ user_id: user.id, special_id: specialId }, { onConflict: 'user_id,special_id' });
        if (error) return { ok: false, error: error.message };
        return { ok: true, success: true };
    }

    async function removeFavorite(specialId) {
        const { data: { user } } = await client.auth.getUser();
        if (!user) return { ok: false, error: 'Not authenticated' };
        const { error } = await client
            .from('favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('special_id', specialId);
        if (error) return { ok: false, error: error.message };
        return { ok: true, success: true };
    }

    // -------------------------------------------------------------------
    // Playlists
    // -------------------------------------------------------------------
    async function getPlaylists() {
        const { data: { user } } = await client.auth.getUser();
        if (!user) return { ok: false, data: [] };
        let { data, error } = await client
            .from('playlists')
            .select('id, title, icon_id, playlist_items(special_id)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true });
        if (error) return { ok: false, error: error.message, data: [] };

        // If user has no playlists in Supabase yet, seed the 10 standard slots
        if (data.length === 0) {
            const defaults = [];
            for (let i = 1; i <= 10; i++) {
                defaults.push({ user_id: user.id, title: String(i), icon_id: 1 });
            }
            const seedRes = await client
                .from('playlists')
                .insert(defaults)
                .select('id, title, icon_id, playlist_items(special_id)');
            if (!seedRes.error && seedRes.data) {
                data = seedRes.data;
            }
        }

        const shaped = data.map(pl => ({
            id: pl.id,
            title: pl.title,
            iconId: pl.icon_id,
            questionIds: (pl.playlist_items || []).map(i => i.special_id)
        }));
        return { ok: true, success: true, data: shaped };
    }

    async function createPlaylist(title, iconId = 1) {
        const { data: { user } } = await client.auth.getUser();
        if (!user) return { ok: false, error: 'Not authenticated' };
        const { data, error } = await client
            .from('playlists')
            .insert({ user_id: user.id, title, icon_id: iconId })
            .select()
            .single();
        if (error) return { ok: false, error: error.message };
        return { ok: true, success: true, data };
    }

    async function updatePlaylist(playlistId, patch) {
        const { data: { user } } = await client.auth.getUser();
        if (!user) return { ok: false, error: 'Not authenticated' };
        const safePatch = {};
        if (patch.title !== undefined) safePatch.title = String(patch.title).trim();
        if (patch.iconId !== undefined) safePatch.icon_id = patch.iconId;

        const { data, error } = await client
            .from('playlists')
            .update(safePatch)
            .eq('id', playlistId)
            .eq('user_id', user.id)
            .select()
            .single();
        if (error) return { ok: false, error: error.message };
        return { ok: true, success: true, data };
    }

    async function togglePlaylistItem(playlistId, specialId, add) {
        if (add) {
            const { error } = await client
                .from('playlist_items')
                .upsert({ playlist_id: playlistId, special_id: specialId }, { onConflict: 'playlist_id,special_id' });
            if (error) return { ok: false, error: error.message };
        } else {
            const { error } = await client
                .from('playlist_items')
                .delete()
                .eq('playlist_id', playlistId)
                .eq('special_id', specialId);
            if (error) return { ok: false, error: error.message };
        }
        return { ok: true, success: true };
    }

    async function clearPlaylistItems(playlistId) {
        const { data: { user } } = await client.auth.getUser();
        if (!user) return { ok: false, error: 'Not authenticated' };
        const { error } = await client
            .from('playlist_items')
            .delete()
            .eq('playlist_id', playlistId);
        if (error) return { ok: false, error: error.message };
        return { ok: true, success: true };
    }

    async function deletePlaylist(playlistId) {
        const { data: { user } } = await client.auth.getUser();
        if (!user) return { ok: false, error: 'Not authenticated' };
        const { error } = await client
            .from('playlists')
            .delete()
            .eq('id', playlistId)
            .eq('user_id', user.id);
        if (error) return { ok: false, error: error.message };
        return { ok: true, success: true };
    }

    // -------------------------------------------------------------------
    // Quiz sessions — local-first resilient sync with cloud
    // -------------------------------------------------------------------
    function normalizeSessionRow(sessionSummary, userId) {
        return {
            user_id: userId,
            session_id: String(sessionSummary.sessionId || sessionSummary.session_id || ('sess_' + Date.now())),
            date: sessionSummary.date || new Date().toISOString(),
            set_title: String(sessionSummary.setTitle || sessionSummary.set_title || 'Quiz Session').substring(0, 120),
            mode: sessionSummary.mode || 'smart',
            lang: sessionSummary.lang || 'En',
            total_q: Number(sessionSummary.totalQ !== undefined ? sessionSummary.totalQ : (sessionSummary.total_q !== undefined ? sessionSummary.total_q : sessionSummary.count)) || 0,
            correct_q: Number(sessionSummary.correctQ !== undefined ? sessionSummary.correctQ : (sessionSummary.correct_q !== undefined ? sessionSummary.correct_q : sessionSummary.correctCount)) || 0,
            score_pct: Number(sessionSummary.scorePct !== undefined ? sessionSummary.scorePct : (sessionSummary.score_pct !== undefined ? sessionSummary.score_pct : sessionSummary.accuracyPct)) || 0,
            time_spent_sec: Number(sessionSummary.timeSpentSec !== undefined ? sessionSummary.timeSpentSec : (sessionSummary.time_spent_sec || 0)) || 0,
            exp_gained: Number(sessionSummary.expGained !== undefined ? sessionSummary.expGained : (sessionSummary.exp_gained || 0)) || 0,
            topics: Array.isArray(sessionSummary.topics)
                ? sessionSummary.topics
                : (typeof sessionSummary.topics === 'string'
                    ? sessionSummary.topics.split(';').map(t => t.trim()).filter(Boolean)
                    : []),
            detail_summary: sessionSummary.detailSummary || sessionSummary.detail_summary || sessionSummary.detailString || ''
        };
    }

    async function saveSession(sessionSummary) {
        const user = await getAuthUser();
        if (!user) return { ok: false, error: 'Not authenticated' };

        const row = normalizeSessionRow(sessionSummary, user.id);

        const { error } = await client
            .from('quiz_sessions')
            .upsert(row, { onConflict: 'user_id,session_id' });
        if (error) {
            console.error('[SupabaseAPI] saveSession error:', error);
            return { ok: false, error: error.message };
        }
        return { ok: true, success: true };
    }

    async function batchSaveSessions(sessionsList) {
        if (!Array.isArray(sessionsList) || sessionsList.length === 0) {
            return { ok: true, success: true, count: 0 };
        }
        const user = await getAuthUser();
        if (!user) return { ok: false, error: 'Not authenticated' };

        const rows = sessionsList.map(s => normalizeSessionRow(s, user.id));

        const { error } = await client
            .from('quiz_sessions')
            .upsert(rows, { onConflict: 'user_id,session_id' });
        if (error) {
            console.error('[SupabaseAPI] batchSaveSessions error:', error);
            return { ok: false, error: error.message };
        }
        return { ok: true, success: true, count: rows.length };
    }

    async function syncPendingQuizSessions() {
        const user = await getAuthUser();
        if (!user) return { ok: false, synced: 0, pending: 0 };

        const pendingKey = `starley_pending_sessions_${user.id}`;
        let pending = [];
        try {
            // Read scoped pending queue first, fall back to unscoped legacy queue if present
            const raw = localStorage.getItem(pendingKey) || localStorage.getItem('starley_pending_sessions');
            if (raw) pending = JSON.parse(raw);
        } catch (e) {}

        if (!Array.isArray(pending) || pending.length === 0) {
            return { ok: true, synced: 0, pending: 0 };
        }

        // Try batch upload first
        const batchRes = await batchSaveSessions(pending);
        if (batchRes && (batchRes.ok || batchRes.success)) {
            try {
                localStorage.removeItem(pendingKey);
                localStorage.removeItem('starley_pending_sessions');
            } catch (e) {}
            return { ok: true, synced: pending.length, pending: 0 };
        }

        // Fallback: sequential upload to preserve partial progress
        let syncedCount = 0;
        const remaining = [];
        for (const s of pending) {
            const res = await saveSession(s);
            if (res && (res.ok || res.success)) {
                syncedCount++;
            } else {
                remaining.push(s);
            }
        }
        try {
            localStorage.setItem(pendingKey, JSON.stringify(remaining));
            localStorage.removeItem('starley_pending_sessions');
        } catch (e) {}
        return { ok: remaining.length === 0, synced: syncedCount, pending: remaining.length };
    }

    async function getSessionHistory(limit = 100) {
        const user = await getAuthUser();
        if (!user) return { ok: false, data: [] };
        const { data, error } = await client
            .from('quiz_sessions')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false })
            .limit(limit);
        if (error) return { ok: false, error: error.message, data: [] };
        return { ok: true, success: true, data };
    }

    // -------------------------------------------------------------------
    // Realtime — replaces polling with targeted event notifications.
    // -------------------------------------------------------------------
    function subscribeToOwnChanges(userId, handlers) {
        const channel = client.channel('user-data-' + userId);

        const tableConfigs = [
            { table: 'favorites', filter: `user_id=eq.${userId}` },
            { table: 'playlists', filter: `user_id=eq.${userId}` },
            { table: 'quiz_sessions', filter: `user_id=eq.${userId}` },
            { table: 'profiles', filter: `id=eq.${userId}` },
            { table: 'playlist_items' } // playlist_items does not have a user_id column
        ];

        tableConfigs.forEach(({ table, filter }) => {
            const options = { event: '*', schema: 'public', table };
            if (filter) options.filter = filter;
            channel.on('postgres_changes', options, (payload) => {
                if (handlers && typeof handlers[table] === 'function') {
                    handlers[table](payload);
                }
            });
        });

        channel.subscribe();
        return () => client.removeChannel(channel);
    }

    // -------------------------------------------------------------------
    // Admin operations go through an Edge Function using service-role key.
    // -------------------------------------------------------------------
    async function checkPinExists(pin) {
        if (!pin) return { exists: false };
        const cleanPin = String(pin).trim();
        const targetUsername = 'user_' + cleanPin;
        try {
            const { data, error } = await client
                .from('profiles')
                .select('id, nickname, username, role, created_at')
                .or(`username.eq.${targetUsername},username.eq.${cleanPin}`);
            if (!error && Array.isArray(data) && data.length > 0) {
                return { exists: true, user: data[0] };
            }
        } catch (e) {
            console.warn('[Admin] checkPinExists error:', e);
        }
        return { exists: false };
    }

    async function adminCreateUser(pin, nickname, role = 'user') {
        const { data: { session } } = await client.auth.getSession();
        if (!session) return { ok: false, error: 'Not authenticated' };

        // Verify caller is admin
        const profileRes = await getProfile();
        if (!profileRes.ok || !profileRes.data || profileRes.data.role !== 'admin') {
            return { ok: false, error: 'Forbidden: admin role required' };
        }

        const cleanPin = String(pin).trim();
        const safeRole = 'user'; // Админ только один (Starley), все остальные пользователи всегда стандартные 'user'

        // 0. Pre-check for duplicate PIN/password
        const pinCheck = await checkPinExists(cleanPin);
        if (pinCheck.exists) {
            const u = pinCheck.user;
            return {
                ok: false,
                duplicate: true,
                error: `Пользователь с паролем/PIN "${cleanPin}" уже существует в системе (${u.nickname || u.username || 'Doctor'}, роль: ${u.role}). Пожалуйста, задайте другой уникальный пароль.`
            };
        }

        // 1. Primary: Native Supabase Auth signUp via ephemeral client (ensures full GoTrue schema & auth.identities compatibility)
        try {
            const ephemeralClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY, {
                auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
            });

            const email = pinToEmail(cleanPin);
            const password = pinToPassword(cleanPin);
            const { data: signUpData, error: signUpErr } = await ephemeralClient.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        nickname: nickname || 'Doctor',
                        username: `user_${cleanPin}`
                    }
                }
            });

            if (signUpErr) {
                const msg = String(signUpErr.message || '');
                const code = String(signUpErr.code || signUpErr.error_code || '');
                if (code === 'user_already_exists' || msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('already exists')) {
                    return {
                        ok: false,
                        duplicate: true,
                        error: `Пользователь с паролем/PIN "${cleanPin}" уже существует. Выберите другой пароль.`
                    };
                }
                if (code !== 'signup_disabled' && !msg.toLowerCase().includes('signups not allowed') && !msg.toLowerCase().includes('signup is disabled')) {
                    return {
                        ok: false,
                        error: `Ошибка создания: ${signUpErr.message || msg}`
                    };
                }
                // If signup_disabled, continue to fallback steps below
            } else if (signUpData && signUpData.user) {
                // If special role requested, update profile table directly using admin token
                if (safeRole && safeRole !== 'user') {
                    try {
                        await client.from('profiles').update({ role: safeRole }).eq('id', signUpData.user.id);
                    } catch (e) {}
                }

                return {
                    ok: true,
                    success: true,
                    message: `Пользователь для PIN ${cleanPin} успешно создан!`,
                    user: { id: signUpData.user.id, nickname: nickname || 'Doctor', role: safeRole }
                };
            }
        } catch (signupErr) {
            console.warn('[Admin] Direct signUp failed, trying fallbacks:', signupErr);
        }

        // 2. Fallback: Edge Function if deployed
        const functionBase = window.SUPABASE_FUNCTIONS_URL || `${window.SUPABASE_URL}/functions/v1`;
        try {
            const res = await fetch(`${functionBase}/admin-create-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ pin: cleanPin, nickname, role: safeRole })
            });

            if (res.ok) {
                const data = await res.json();
                return data;
            }
        } catch (fetchErr) {
            console.warn('[Admin] Edge Function fallback failed:', fetchErr);
        }

        // 3. Fallback: Postgres RPC admin_create_user
        try {
            const { data: rpcData, error: rpcErr } = await client.rpc('admin_create_user', {
                pin: cleanPin,
                nickname: nickname || 'Doctor',
                role: safeRole
            });
            if (!rpcErr && rpcData) {
                if (rpcData.ok === false) return rpcData;
                return {
                    ok: true,
                    success: true,
                    message: rpcData.message || `Пользователь для PIN ${cleanPin} успешно создан!`,
                    user: { id: rpcData.id, nickname: nickname || 'Doctor', role: safeRole }
                };
            }
            if (rpcErr && rpcErr.code !== 'PGRST202') {
                return { ok: false, error: rpcErr.message };
            }
        } catch (rpcErr) {
            console.warn('[Admin] RPC create failed:', rpcErr);
        }

        return {
            ok: false,
            error: `Не удалось создать пользователя. Убедитесь, что в Supabase Authentication → Providers → Email включена опция «Allow new users to sign up».`
        };
    }

    async function adminUpdateUser(targetUserId, { nickname, pin } = {}) {
        if (!targetUserId) return { ok: false, error: 'targetUserId is required' };
        const { data: { session } } = await client.auth.getSession();
        if (!session) return { ok: false, error: 'Not authenticated' };

        // Verify caller is admin
        const profileRes = await getProfile();
        if (!profileRes.ok || !profileRes.data || profileRes.data.role !== 'admin') {
            return { ok: false, error: 'Forbidden: admin role required' };
        }

        const cleanNick = nickname !== undefined ? String(nickname).trim() : null;
        const cleanPin = pin ? String(pin).trim() : null;

        // 1. Try RPC admin_update_user (handles both nickname and password/PIN change)
        try {
            const { data: rpcData, error: rpcErr } = await client.rpc('admin_update_user', {
                target_user_id: targetUserId,
                new_nickname: cleanNick,
                new_pin: cleanPin
            });
            if (!rpcErr && rpcData) {
                return rpcData;
            }
            if (rpcErr && rpcErr.code !== 'PGRST202') {
                return { ok: false, error: rpcErr.message };
            }
        } catch (rpcErr) {
            console.warn('[Admin] RPC update failed:', rpcErr);
        }

        // 2. Direct profiles update for nickname if no PIN update was requested
        if (cleanNick && !cleanPin) {
            try {
                const { data, error } = await client
                    .from('profiles')
                    .update({ nickname: cleanNick, updated_at: new Date().toISOString() })
                    .eq('id', targetUserId)
                    .select();
                if (!error && Array.isArray(data) && data.length > 0) {
                    return { ok: true, success: true, message: 'Имя пользователя успешно обновлено!' };
                }
            } catch (updErr) {
                console.warn('[Admin] Direct profile update failed:', updErr);
            }
        }

        if (cleanPin) {
            return {
                ok: false,
                error: 'Для смены пароля/PIN пользователя через приложение выполните скрипт quiz/supabase_admin_setup.sql в Supabase SQL Editor.'
            };
        }

        return {
            ok: false,
            error: 'Не удалось обновить профиль пользователя в Supabase.'
        };
    }

    async function adminDeleteUser(targetUserId) {
        if (!targetUserId) return { ok: false, error: 'targetUserId is required' };
        const { data: { session } } = await client.auth.getSession();
        if (!session) return { ok: false, error: 'Not authenticated' };

        // Verify caller is admin
        const profileRes = await getProfile();
        if (!profileRes.ok || !profileRes.data || profileRes.data.role !== 'admin') {
            return { ok: false, error: 'Forbidden: admin role required' };
        }

        if (session.user && session.user.id === targetUserId) {
            return { ok: false, error: 'Нельзя удалить свой собственный аккаунт администратора.' };
        }

        // 1. Try Postgres RPC delete_user_by_admin (fastest & cleanest)
        try {
            const { data, error } = await client.rpc('delete_user_by_admin', { target_user_id: targetUserId });
            if (!error) {
                return { ok: true, success: true, message: 'Пользователь успешно удален' };
            }
            if (error && error.code !== 'PGRST202') {
                return { ok: false, error: error.message };
            }
        } catch (rpcErr) {
            console.warn('[Admin] RPC delete failed, trying Edge Function:', rpcErr);
        }

        // 2. Try Edge Function
        try {
            const functionBase = window.SUPABASE_FUNCTIONS_URL || `${window.SUPABASE_URL}/functions/v1`;
            const res = await fetch(`${functionBase}/admin-create-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ action: 'delete', targetUserId })
            });

            if (res.ok) {
                const data = await res.json();
                return data;
            } else if (res.status !== 404) {
                const data = await res.json().catch(() => null);
                return { ok: false, error: (data && data.error) || `HTTP ${res.status}` };
            }
        } catch (edgeErr) {
            console.warn('[Admin] Edge delete failed:', edgeErr);
        }

        // 3. Fallback instructions if neither RPC nor Edge function is configured
        return {
            ok: false,
            needsSetup: true,
            error: `Функция прямого удаления ещё не активирована в Supabase.\n\nДля включения удаления прямо из приложения выполните один раз в Supabase SQL Editor:\n\ncreate or replace function public.delete_user_by_admin(target_user_id uuid)\nreturns boolean language plpgsql security definer set search_path = public, auth as $$\nbegin\n  if not public.is_admin() then raise exception 'Forbidden'; end if;\n  if target_user_id = auth.uid() then raise exception 'Cannot delete self'; end if;\n  delete from auth.users where id = target_user_id;\n  return true;\nend;\n$$;`
        };
    }

    window.SupabaseAPI = {
        client,
        loginWithPin,
        logout,
        getSession,
        getProfile,
        updateProfile,
        getFavorites,
        addFavorite,
        removeFavorite,
        getPlaylists,
        createPlaylist,
        updatePlaylist,
        clearPlaylistItems,
        deletePlaylist,
        togglePlaylistItem,
        saveSession,
        batchSaveSessions,
        syncPendingQuizSessions,
        getSessionHistory,
        getAuthUser,
        subscribeToOwnChanges,
        adminCreateUser,
        adminUpdateUser,
        adminDeleteUser,
        checkPinExists
    };
})();
