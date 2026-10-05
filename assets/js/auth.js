// assets/js/auth.js
// Adapted for Supabase Auth. Public API unchanged (window.AuthSystem.*),
// so the rest of the site doesn't need to know the backend changed.
//
// Key difference from the old version: session + role/nickname/avatar now
// live in Supabase (auth.users + public.profiles), not in a client-writable
// localStorage blob. getCurrentUser() returns a CACHED snapshot that is
// populated once at boot (async) and kept live via a realtime subscription
// to the user's own profiles row.
//
// "Guest" stays a pure local mode: no Supabase account, no sync.
// Survives page reloads within the same session via sessionStorage.

(function () {
    const MASTER_ADMIN_PIN = '456755';
    const MASTER_USER_PIN = '0455';
    const SESSION_KEY = 'starley_auth';
    const GUEST_SESSION_KEY = 'starley_guest_auth';

    let currentUser = null;      // cached snapshot, synchronous reads
    let unsubscribeRealtime = null;

    function getStoredAuth() {
        try {
            let authData = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
            if (!authData) return null;
            const data = JSON.parse(authData);
            // 30 days validity
            if (data.timestamp && Date.now() - data.timestamp > 30 * 24 * 60 * 60 * 1000) {
                clearStoredAuth();
                return null;
            }
            return data;
        } catch(e) {
            return null;
        }
    }

    function saveAuth(user) {
        if (!user) return;
        user.timestamp = Date.now();
        try {
            localStorage.setItem(SESSION_KEY, JSON.stringify(user));
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
        } catch(e) {}
    }

    function clearStoredAuth() {
        try {
            localStorage.removeItem(SESSION_KEY);
            sessionStorage.removeItem(SESSION_KEY);
            sessionStorage.removeItem('starley_guest_auth');
        } catch(e) {}
    }

    function getCurrentUser() {
        return currentUser;
    }

    function isAuthenticated() {
        return currentUser !== null;
    }

    function hasRole(requiredRole) {
        if (!currentUser) return false;
        if (requiredRole === 'user') return true;
        return currentUser.role === requiredRole;
    }

    // Kept for API compatibility with code that patches currentUser in place
    // (e.g. after a profile edit) and wants the cache updated immediately.
    function setAuthenticated(patch) {
        currentUser = Object.assign({}, currentUser, patch);
        saveAuth(currentUser);
    }

    async function loginAsGuest() {
        sessionStorage.setItem(GUEST_SESSION_KEY, 'true');
        currentUser = {
            username: 'user',
            role: 'user',
            name: 'User',
            nickname: 'User',
            avatar: 'doc',
            isGuest: true
        };
        saveAuth(currentUser);
        window.location.reload();
    }

    async function loginWithPin(pin) {
        if (!window.SupabaseAPI) {
            return { ok: false, error: 'Database service not loaded' };
        }
        const res = await window.SupabaseAPI.loginWithPin(pin);
        if (!res || !res.ok) {
            return { ok: false, error: (res && res.error) || 'Login failed' };
        }
        const profile = res.user; // from getProfile() inside loginWithPin
        currentUser = {
            id: profile.id,
            username: profile.username,
            role: profile.role || 'user',
            name: profile.nickname || 'Doctor',
            nickname: profile.nickname || 'Doctor',
            avatar: profile.avatar || 'doc',
            isGuest: false
        };
        saveAuth(currentUser);
        return { ok: true, user: currentUser };
    }

    function startProfileRealtimeSync() {
        if (!currentUser || currentUser.isGuest || !window.SupabaseAPI || !currentUser.id) return;
        if (unsubscribeRealtime) unsubscribeRealtime();
        unsubscribeRealtime = window.SupabaseAPI.subscribeToOwnChanges(currentUser.id, {
            profiles: (payload) => {
                if (payload.new) {
                    currentUser.nickname = payload.new.nickname;
                    currentUser.avatar = payload.new.avatar;
                    currentUser.role = payload.new.role;
                    saveAuth(currentUser);
                    if (window.state) {
                        if (!window.state.userProfile) window.state.userProfile = {};
                        if (payload.new.nickname) window.state.userProfile.nickname = payload.new.nickname;
                        if (payload.new.avatar) window.state.userProfile.avatar = payload.new.avatar;
                        window.state.currentSelectedAvatar = payload.new.avatar;
                        try {
                            localStorage.setItem('starley_user_profile', JSON.stringify(window.state.userProfile));
                        } catch (e) {}
                    }
                    const nameDisplay = document.getElementById('profile-nickname-display');
                    if (nameDisplay) nameDisplay.textContent = currentUser.nickname;
                    showRoleIndicator(currentUser); // refresh badge in place
                    if (typeof window.updateUserProfileDisplay === 'function') {
                        window.updateUserProfileDisplay();
                    }
                }
            }
        });
    }

    // -----------------------------------------------------------------
    // Login modal — Master Passwords (456755/0455) + Quiz Accounts
    // -----------------------------------------------------------------
    function showLoginModal() {
        if (document.getElementById('auth-modal')) return;
        document.body.style.overflow = 'hidden';

        const isRu = (window.state && window.state.settings && window.state.settings.lang) ? window.state.settings.lang === 'Ru' : true;
        const modal = document.createElement('div');
        modal.id = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-overlay"></div>
            <div class="auth-box" style="position: relative;">
                <button type="button" id="auth-modal-close" style="position: absolute; top: 12px; right: 14px; background: none; border: none; font-size: 1.5rem; line-height: 1; color: #94a3b8; cursor: pointer; padding: 4px 8px; border-radius: 6px; transition: all 0.2s;" title="${isRu ? 'Закрыть' : 'Close'}">&times;</button>
                <div class="auth-header">
                    <h2>🔒 Medical Library</h2>
                    <p>${isRu ? 'Введите ваш PIN или пароль:' : 'Enter your PIN or password to continue'}</p>
                </div>
                <form id="auth-form" autocomplete="off">
                    <input
                        type="password"
                        id="password-input"
                        placeholder="${isRu ? 'PIN / Пароль' : 'PIN / Password'}"
                        maxlength="16"
                        autocomplete="off"
                        autofocus
                        style="color: #0f172a; background: #ffffff; border: 2px solid #94a3b8; font-weight: 700; font-size: 1.2rem; text-align: center; letter-spacing: 4px;"
                    >
                    <div class="error-message" id="error-message"></div>
                    <button type="submit">${isRu ? 'Войти' : 'Enter'}</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        const closeModal = () => {
            modal.remove();
            document.body.style.overflow = '';
            document.removeEventListener('keydown', onKeyDown);
            // If user has no session at all, ensure they enter as guest so they aren't blocked
            if (!currentUser) {
                currentUser = {
                    username: 'user',
                    role: 'user',
                    name: 'User',
                    nickname: 'User',
                    avatar: 'doc',
                    isGuest: true
                };
                sessionStorage.setItem(GUEST_SESSION_KEY, 'true');
                saveAuth(currentUser);
                window.location.reload();
            }
        };

        const onKeyDown = (e) => {
            if (e.key === 'Escape') closeModal();
        };
        document.addEventListener('keydown', onKeyDown);

        const closeBtn = document.getElementById('auth-modal-close');
        if (closeBtn) closeBtn.onclick = closeModal;

        const overlay = modal.querySelector('.auth-overlay');
        if (overlay) overlay.onclick = closeModal;

        const form = document.getElementById('auth-form');
        const passInput = document.getElementById('password-input');
        const errorMsg = document.getElementById('error-message');
        const submitBtn = form.querySelector('button[type="submit"]');

        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            const password = passInput ? passInput.value.trim() : '';
            if (!password) {
                errorMsg.textContent = isRu ? '✗ Введите пароль или PIN' : '✗ Password or PIN is required';
                errorMsg.style.color = '#f87171';
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = isRu ? 'Проверка...' : 'Authenticating...';

            // 1. Master Admin Password (456755) -> Instant Admin Privileges
            if (password === MASTER_ADMIN_PIN) {
                currentUser = {
                    username: 'admin',
                    role: 'admin',
                    name: 'Administrator',
                    nickname: 'Administrator',
                    avatar: 'doc',
                    isGuest: false
                };
                sessionStorage.removeItem(GUEST_SESSION_KEY);
                saveAuth(currentUser);
                if (window.SupabaseAPI) {
                    window.SupabaseAPI.loginWithPin(MASTER_ADMIN_PIN).catch(() => {});
                }
                showLoginSuccess(modal, errorMsg, 'Administrator');
                return;
            }

            // 2. Master User Password (0455) -> Instant Library User Privileges
            if (password === MASTER_USER_PIN) {
                currentUser = {
                    username: 'user',
                    role: 'user',
                    name: 'User',
                    nickname: 'User',
                    avatar: 'doc',
                    isGuest: true
                };
                sessionStorage.setItem(GUEST_SESSION_KEY, 'true');
                saveAuth(currentUser);
                showLoginSuccess(modal, errorMsg, 'User');
                return;
            }

            // 3. Quiz Account PIN Login via Supabase (for personal accounts)
            if (window.SupabaseAPI) {
                try {
                    const res = await window.SupabaseAPI.loginWithPin(password);
                    if (res && res.ok && res.user) {
                        const profile = res.user;
                        currentUser = {
                            id: profile.id,
                            username: profile.username || `user_${password}`,
                            role: profile.role || 'user',
                            name: profile.nickname || 'Doctor',
                            nickname: profile.nickname || 'Doctor',
                            avatar: profile.avatar || 'doc',
                            isGuest: false
                        };
                        sessionStorage.removeItem(GUEST_SESSION_KEY);
                        saveAuth(currentUser);
                        showLoginSuccess(modal, errorMsg, currentUser.nickname);
                        return;
                    }
                } catch (err) {
                    console.warn('[Auth] login error:', err);
                }
            }

            // Incorrect Password
            submitBtn.disabled = false;
            submitBtn.textContent = isRu ? 'Войти' : 'Enter';
            passInput.value = '';
            passInput.classList.add('shake');
            setTimeout(() => passInput.classList.remove('shake'), 500);

            errorMsg.textContent = isRu ? '✗ Неверный PIN или пароль' : '✗ Incorrect PIN or password';
            errorMsg.style.color = '#f87171';
        });

        setTimeout(() => { if (passInput) passInput.focus(); }, 100);
    }

    function showLoginSuccess(modal, errorMsg, displayName) {
        modal.classList.add('auth-success');
        errorMsg.textContent = `✓ Welcome, ${displayName}!`;
        errorMsg.style.color = '#3fb950';
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
            if (currentUser.role === 'user') applyUserRestrictions();
            showRoleIndicator(currentUser);
            startProfileRealtimeSync();
            window.location.reload();
        }, 600);
    }

    function applyUserRestrictions() {
        document.querySelectorAll('a[href*="editor.html"], a[href*="mdconvert.html"], a[href*="manifest-editor.html"]')
            .forEach(link => link.style.display = 'none');
        document.querySelectorAll('.edit-btn, .admin-only, [data-role="admin"]')
            .forEach(btn => btn.style.display = 'none');

        if (window.location.pathname.includes('editor.html') ||
            window.location.pathname.includes('mdconvert.html') ||
            window.location.pathname.includes('manifest-editor.html')) {
            alert('⚠️ Access denied. Administrator privileges required.');
            window.location.href = 'index.html';
        }
    }

    function applyAdminAccess() {
        document.querySelectorAll('[data-role="admin"], .admin-only, a[href*="manifest-editor.html"], a[href*="editor.html"]')
            .forEach(el => { if (el.style.display === 'none') el.style.display = ''; });
    }

    function showRoleIndicator(userInfo) {
        if (!userInfo) return;
        const existing = document.getElementById('role-indicator');
        if (existing) existing.remove();

        const indicator = document.createElement('div');
        indicator.id = 'role-indicator';
        indicator.className = `role-indicator role-${userInfo.role}`;
        const borderColor = userInfo.role === 'admin' ? '#f59e0b' : '#38bdf8';
        indicator.style.cssText = `position: fixed; top: 12px; right: 12px; z-index: 10000; display: flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 20px; background: rgba(15, 23, 42, 0.95); border: 2px solid ${borderColor}; color: #ffffff; font-size: 0.84rem; font-weight: 700; box-shadow: 0 6px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.15); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); cursor: grab; user-select: none;`;

        const avatarIcon = userInfo.role === 'admin' ? '👑' : (userInfo.isGuest ? '👤' : '🩺');
        const badgeTitle = userInfo.role === 'admin' ? 'Admin' : (userInfo.isGuest ? 'Guest' : 'User');
        const displayName = userInfo.isGuest ? 'User' : (userInfo.nickname || userInfo.name);

        const actionBtn = userInfo.isGuest
            ? `<button onclick="window.AuthSystem.showLoginModal()" class="auth-action-btn" title="Войти в аккаунт по PIN" style="background: none; border: none; color: #38bdf8; cursor: pointer; padding: 2px 4px; font-size: 0.95rem; margin-left: 2px;">🔑</button>`
            : `<button onclick="window.logout()" class="auth-action-btn logout-btn" title="Выйти из аккаунта" style="background: none; border: none; color: #f87171; cursor: pointer; padding: 2px 4px; font-size: 0.95rem; margin-left: 2px;">🚪</button>`;

        indicator.innerHTML = `
            <span class="role-icon" style="font-size: 1.1rem; pointer-events: none;">${avatarIcon}</span>
            <span class="role-name" style="color: #ffffff !important; font-weight: 700 !important; text-shadow: 0 1px 3px rgba(0,0,0,0.8); pointer-events: none;">${displayName} (${badgeTitle})</span>
            ${actionBtn}
        `;
        document.body.appendChild(indicator);
        makeDraggable(indicator);
    }

    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, isDragging = false;
        const savedPosition = localStorage.getItem('role-indicator-position');
        if (savedPosition) {
            try {
                const pos = JSON.parse(savedPosition);
                element.style.top = pos.top;
                element.style.left = pos.left;
                element.style.right = 'auto';
            } catch (e) { }
        }
        element.addEventListener('mousedown', dragMouseDown);
        element.addEventListener('touchstart', dragTouchStart, { passive: false });

        function dragMouseDown(e) {
            if (e.target.closest('.auth-action-btn') || e.target.closest('.logout-btn')) return;
            e.preventDefault();
            isDragging = true;
            element.style.cursor = 'grabbing';
            pos3 = e.clientX; pos4 = e.clientY;
            document.addEventListener('mousemove', elementDrag);
            document.addEventListener('mouseup', closeDragElement);
        }
        function dragTouchStart(e) {
            if (e.target.closest('.auth-action-btn') || e.target.closest('.logout-btn')) return;
            e.preventDefault();
            isDragging = true;
            element.style.cursor = 'grabbing';
            const t = e.touches[0]; pos3 = t.clientX; pos4 = t.clientY;
            document.addEventListener('touchmove', elementTouchDrag, { passive: false });
            document.addEventListener('touchend', closeDragElement);
        }
        function elementDrag(e) {
            if (!isDragging) return;
            e.preventDefault();
            pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY;
            pos3 = e.clientX; pos4 = e.clientY;
            updatePosition();
        }
        function elementTouchDrag(e) {
            if (!isDragging) return;
            e.preventDefault();
            const t = e.touches[0];
            pos1 = pos3 - t.clientX; pos2 = pos4 - t.clientY;
            pos3 = t.clientX; pos4 = t.clientY;
            updatePosition();
        }
        function updatePosition() {
            const newTop = element.offsetTop - pos2;
            const newLeft = element.offsetLeft - pos1;
            const maxX = window.innerWidth - element.offsetWidth;
            const maxY = window.innerHeight - element.offsetHeight;
            element.style.top = Math.max(0, Math.min(newTop, maxY)) + 'px';
            element.style.left = Math.max(0, Math.min(newLeft, maxX)) + 'px';
            element.style.right = 'auto';
        }
        function closeDragElement() {
            isDragging = false;
            element.style.cursor = 'grab';
            document.removeEventListener('mousemove', elementDrag);
            document.removeEventListener('mouseup', closeDragElement);
            document.removeEventListener('touchmove', elementTouchDrag);
            document.removeEventListener('touchend', closeDragElement);
            localStorage.setItem('role-indicator-position', JSON.stringify({ top: element.style.top, left: element.style.left }));
        }
    }

    window.logout = async function () {
        if (!currentUser || currentUser.isGuest) {
            showLoginModal();
            return;
        }

        const isRu = (window.state && window.state.settings && window.state.settings.lang) ? window.state.settings.lang === 'Ru' : true;
        const confirmMsg = isRu ? 'Вы действительно хотите выйти из аккаунта?' : 'Do you want to log out of your account?';
        if (!confirm(confirmMsg)) return;

        if (unsubscribeRealtime) {
            try { unsubscribeRealtime(); } catch (e) {}
            unsubscribeRealtime = null;
        }

        if (window.SupabaseAPI && currentUser && !currentUser.isGuest) {
            try { await window.SupabaseAPI.logout(); } catch (e) { }
        }

        clearStoredAuth();
        currentUser = null;

        sessionStorage.setItem(GUEST_SESSION_KEY, 'true');
        sessionStorage.setItem('starley_show_login', 'true');
        window.location.reload();
    };

    // -----------------------------------------------------------------
    // Boot sequence — async, checking local stored auth, Supabase session, or Guest session
    // -----------------------------------------------------------------
    async function boot() {
        const stored = getStoredAuth();
        if (stored) {
            currentUser = stored;
            // If logged in as admin, silently ensure Supabase admin session in background if available
            if (currentUser.role === 'admin' && window.SupabaseAPI && typeof window.SupabaseAPI.loginWithPin === 'function') {
                window.SupabaseAPI.loginWithPin(MASTER_ADMIN_PIN).catch(() => {});
            }
        } else if (sessionStorage.getItem(GUEST_SESSION_KEY) === 'true') {
            currentUser = {
                username: 'guest',
                role: 'user',
                name: 'User',
                nickname: 'User',
                avatar: 'doc',
                isGuest: true
            };
        } else if (window.SupabaseAPI) {
            try {
                const { data: { session } } = await window.SupabaseAPI.getSession();
                if (session) {
                    const profileRes = await window.SupabaseAPI.getProfile();
                    if (profileRes.ok && profileRes.data) {
                        const p = profileRes.data;
                        currentUser = {
                            id: p.id,
                            username: p.username,
                            role: p.role,
                            name: p.nickname,
                            nickname: p.nickname,
                            avatar: p.avatar,
                            isGuest: false
                        };
                        saveAuth(currentUser, true);
                    }
                }
            } catch (err) {
                console.warn('[Auth] Session restoration failed:', err);
            }
        }

        if (!isAuthenticated()) {
            showLoginModal();
            return;
        }

        if (sessionStorage.getItem('starley_show_login') === 'true') {
            sessionStorage.removeItem('starley_show_login');
            setTimeout(showLoginModal, 150);
        }

        const nameDisplay = document.getElementById('profile-nickname-display');
        if (nameDisplay) nameDisplay.textContent = currentUser.nickname || currentUser.username || (currentUser.role === 'admin' ? 'Administrator' : 'User');

        if (currentUser.role === 'user') applyUserRestrictions();
        if (currentUser.role === 'admin') applyAdminAccess();
        showRoleIndicator(currentUser);
        startProfileRealtimeSync();

        document.dispatchEvent(new CustomEvent('starley-auth-ready', { detail: currentUser }));

        // Resilient background sync: flush any pending quiz sessions
        if (currentUser && !currentUser.isGuest && window.SupabaseAPI && typeof window.SupabaseAPI.syncPendingQuizSessions === 'function') {
            window.SupabaseAPI.syncPendingQuizSessions().catch(() => {});
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

    window.AuthSystem = {
        getCurrentUser,
        isAuthenticated,
        hasRole,
        isAdmin: () => hasRole('admin'),
        isUser: () => hasRole('user'),
        setAuthenticated,
        showLoginModal,
        logout: () => window.logout()
    };
})();
