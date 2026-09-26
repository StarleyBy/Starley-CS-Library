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
        const { data, error } = await client.auth.signInWithPassword({
            email: pinToEmail(pin),
            password: pinToPassword(pin)
        });
        if (error) return { ok: false, success: false, error: error.message };

        const profile = await getProfile();
        return { ok: true, success: true, user: profile.data, session: data.session };
    }

    async function logout() {
        await client.auth.signOut();
    }

    function getSession() {
        return client.auth.getSession();
    }

    // -------------------------------------------------------------------
    // Profile (nickname / avatar / RPG progress)
    // -------------------------------------------------------------------
    async function getProfile() {
        const { data: { user } } = await client.auth.getUser();
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
        const { data: { user } } = await client.auth.getUser();
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
    // Quiz sessions — compact summary only.
    // -------------------------------------------------------------------
    async function saveSession(sessionSummary) {
        const { data: { user } } = await client.auth.getUser();
        if (!user) return { ok: false, error: 'Not authenticated' };

        const row = {
            user_id: user.id,
            session_id: sessionSummary.sessionId,
            date: sessionSummary.date || new Date().toISOString(),
            set_title: sessionSummary.setTitle,
            mode: sessionSummary.mode,
            lang: sessionSummary.lang,
            total_q: sessionSummary.totalQ,
            correct_q: sessionSummary.correctQ,
            score_pct: sessionSummary.scorePct,
            time_spent_sec: sessionSummary.timeSpentSec,
            exp_gained: sessionSummary.expGained || 0,
            topics: sessionSummary.topics || [],
            detail_summary: sessionSummary.detailSummary || ''
        };

        const { error } = await client
            .from('quiz_sessions')
            .upsert(row, { onConflict: 'user_id,session_id' });
        if (error) return { ok: false, error: error.message };
        return { ok: true, success: true };
    }

    async function getSessionHistory(limit = 50) {
        const { data: { user } } = await client.auth.getUser();
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
    async function adminCreateUser(pin, nickname, role = 'user') {
        const { data: { session } } = await client.auth.getSession();
        if (!session) return { ok: false, error: 'Not authenticated' };

        // Verify caller is admin
        const profileRes = await getProfile();
        if (!profileRes.ok || !profileRes.data || profileRes.data.role !== 'admin') {
            return { ok: false, error: 'Forbidden: admin role required' };
        }

        const functionBase = window.SUPABASE_FUNCTIONS_URL || `${window.SUPABASE_URL}/functions/v1`;
        let edgeError = null;

        // 1. Try calling the Edge Function first
        try {
            const res = await fetch(`${functionBase}/admin-create-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ pin, nickname, role })
            });

            if (res.ok) {
                const data = await res.json();
                return data;
            } else if (res.status === 404) {
                edgeError = 'Edge Function not deployed (HTTP 404)';
            } else {
                try {
                    const data = await res.json();
                    return data;
                } catch (_) {
                    edgeError = `Edge Function HTTP ${res.status}`;
                }
            }
        } catch (fetchErr) {
            edgeError = fetchErr.message || 'Network error';
        }

        // 2. Fallback: Direct creation attempt via ephemeral client
        try {
            const ephemeralClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY, {
                auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
            });

            const email = pinToEmail(pin);
            const password = pinToPassword(pin);
            const { data: signUpData, error: signUpErr } = await ephemeralClient.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        nickname: nickname || 'Doctor',
                        username: `user_${pin}`
                    }
                }
            });

            if (signUpErr) {
                return {
                    ok: false,
                    error: `Edge Function недоступна (${edgeError}). Прямая регистрация: ${signUpErr.message}`
                };
            }

            if (signUpData && signUpData.user) {
                // Test if signIn succeeds or if email confirmation is required
                const testSignIn = await ephemeralClient.auth.signInWithPassword({ email, password });
                if (testSignIn.error && String(testSignIn.error.message || '').toLowerCase().includes('confirm')) {
                    return {
                        ok: false,
                        error: `Edge Function 'admin-create-user' не задеплоена на Supabase (${edgeError}).\n\nПользователь создан в auth, но в Supabase включена опция «Confirm email».\n\nРешение:\n1) В панели Supabase: Authentication → Providers → Email → ВЫКЛЮЧИТЕ тумблер «Confirm email» (тогда пользователи активируются мгновенно);\n2) Либо задеплойте Edge Function командой:\n   supabase functions deploy admin-create-user`
                    };
                }

                return {
                    ok: true,
                    success: true,
                    message: `Пользователь для PIN ${pin} успешно создан!`,
                    user: { id: signUpData.user.id, nickname, role }
                };
            }
        } catch (fallbackErr) {
            return {
                ok: false,
                error: `Ошибка создания: Edge Function не задеплоена (${edgeError}). Fallback: ${fallbackErr.message}`
            };
        }

        return {
            ok: false,
            error: `Edge function 'admin-create-user' не задеплоена на Supabase (${edgeError}).`
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
        getSessionHistory,
        subscribeToOwnChanges,
        adminCreateUser
    };
})();
