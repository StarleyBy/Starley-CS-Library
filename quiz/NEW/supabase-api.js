// assets/js/supabase-api.js
//
// Replacement for google-sheets-api.js. Same job (favorites / playlists /
// sessions / profile sync), completely different mechanics:
//   - Real auth session (JWT) instead of re-sending the raw PIN on every call.
//   - Every favorite / playlist item / session is its own row -> no full-object
//     overwrite, no 50,000-char cell limit, no lost-update race.
//   - Realtime subscription for live cross-device sync instead of 30s polling.
//
// Load order in quiz.html should become:
//   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
//   <script src="assets/js/config.js"></script>
//   <script src="assets/js/supabase-api.js"></script>
//   <script src="assets/js/auth.js"></script>        (adapted, see MIGRATION_PLAN.md)
//   <script src="assets/js/quiz.js"></script>
//
// config.js should expose:
//   window.SUPABASE_URL = 'https://xxxx.supabase.co';
//   window.SUPABASE_ANON_KEY = 'eyJ...';   // anon key is PUBLIC by design — RLS is what protects data
//   window.SUPABASE_FUNCTIONS_URL = 'https://xxxx.functions.supabase.co';

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
    // battle-tested password auth (hashing, session issuance, built-in
    // abuse protection) instead of hand-rolling it.
    //
    // NOTE: a bare 4-6 digit PIN is still a weak secret. At minimum, set
    // Auth > Providers > Email > "Minimum password length" in the Supabase
    // dashboard to match your PIN length, and strongly consider moving to
    // 6+ digit PINs or a real password for admin accounts specifically.
    // -------------------------------------------------------------------
    function pinToEmail(pin) {
        return `pin_${String(pin).trim()}@starley.local`;
    }

    async function loginWithPin(pin) {
        const { data, error } = await client.auth.signInWithPassword({
            email: pinToEmail(pin),
            password: String(pin).trim()
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
    // Favorites — single-row add/remove. No array merge logic needed at all.
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
        // upsert -> idempotent, safe to call twice
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
        const { data, error } = await client
            .from('playlists')
            .select('id, title, icon_id, playlist_items(special_id)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true });
        if (error) return { ok: false, error: error.message, data: [] };

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

    // -------------------------------------------------------------------
    // Quiz sessions — compact summary only (see schema.sql comment on
    // detail_summary). Insert is idempotent via unique(user_id, session_id),
    // so retries / duplicate calls never create duplicate history entries.
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
            detail_summary: sessionSummary.detailSummary || ''   // compact string, NOT full question text
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
    // Realtime — replaces the 30s polling loop. Each event tells you
    // exactly which row changed, so the client applies a targeted
    // insert/update/delete to local state instead of guessing what to
    // overwrite. This is what actually eliminates the pull/push race
    // condition class, not just papers over it.
    // -------------------------------------------------------------------
    function subscribeToOwnChanges(userId, handlers) {
        const channel = client.channel('user-data-' + userId);

        ['favorites', 'playlists', 'playlist_items', 'quiz_sessions', 'profiles'].forEach(table => {
            channel.on('postgres_changes',
                { event: '*', schema: 'public', table, filter: `user_id=eq.${userId}` },
                (payload) => {
                    if (handlers && typeof handlers[table] === 'function') {
                        handlers[table](payload);
                    }
                }
            );
        });

        channel.subscribe();
        return () => client.removeChannel(channel);
    }

    // -------------------------------------------------------------------
    // Admin operations go through an Edge Function using the service-role
    // key server-side — the client NEVER holds a key capable of creating
    // or deleting arbitrary accounts. See functions/admin-create-user/.
    // -------------------------------------------------------------------
    async function adminCreateUser(pin, nickname, role = 'user') {
        const { data: { session } } = await client.auth.getSession();
        if (!session) return { ok: false, error: 'Not authenticated' };

        const res = await fetch(`${window.SUPABASE_FUNCTIONS_URL}/admin-create-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ pin, nickname, role })
        });
        return res.json();
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
        togglePlaylistItem,
        saveSession,
        getSessionHistory,
        subscribeToOwnChanges,
        adminCreateUser
    };
})();
