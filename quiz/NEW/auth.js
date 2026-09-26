// assets/js/auth.js
// Adapted for Supabase Auth. Public API unchanged (window.AuthSystem.*),
// so the rest of the site doesn't need to know the backend changed.
//
// Key difference from the old version: session + role/nickname/avatar now
// live in Supabase (auth.users + public.profiles), not in a client-writable
// localStorage blob. getCurrentUser() returns a CACHED snapshot that is
// populated once at boot (async) and kept live via a realtime subscription
// to the user's own profiles row — so a nickname/avatar change on another
// device shows up here without any polling.
//
// "Guest" stays a pure local, offline mode: no Supabase account, no sync,
// nothing to leak. It never calls SupabaseAPI at all.

(function () {
    const GUEST_PIN = '0455';
    let currentUser = null;      // cached snapshot, synchronous reads
    let unsubscribeRealtime = null;

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
    }

    async function loginAsGuest() {
        currentUser = {
            username: 'guest',
            role: 'user',
            name: 'User',
            nickname: 'User',
            avatar: 'doc',
            isGuest: true
        };
        window.location.reload();
    }

    async function loginWithPin(pin) {
        const res = await window.SupabaseAPI.loginWithPin(pin);
        if (!res || !res.ok) {
            return { ok: false, error: (res && res.error) || 'Login failed' };
        }
        const profile = res.user; // from getProfile() inside loginWithPin
        currentUser = {
            id: profile.id,
            username: profile.username,
            role: profile.role,
            name: profile.nickname,
            nickname: profile.nickname,
            avatar: profile.avatar,
            isGuest: false
        };
        return { ok: true, user: currentUser };
    }

    function startProfileRealtimeSync() {
        if (!currentUser || currentUser.isGuest || !window.SupabaseAPI) return;
        if (unsubscribeRealtime) unsubscribeRealtime();
        unsubscribeRealtime = window.SupabaseAPI.subscribeToOwnChanges(currentUser.id, {
            profiles: (payload) => {
                if (payload.new) {
                    currentUser.nickname = payload.new.nickname;
                    currentUser.avatar = payload.new.avatar;
                    currentUser.role = payload.new.role;
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
    // Login modal — same UI, now calls loginWithPin() / loginAsGuest()
    // -----------------------------------------------------------------
    function showLoginModal() {
        document.body.style.overflow = 'hidden';

        const modal = document.createElement('div');
        modal.id = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-overlay"></div>
            <div class="auth-box">
                <div class="auth-header">
                    <h2>🔒 Medical Library</h2>
                    <p>Enter password to continue</p>
                </div>
                <form id="auth-form" autocomplete="off">
                    <input
                        type="password"
                        id="password-input"
                        placeholder="Password"
                        maxlength="12"
                        autocomplete="off"
                        autofocus
                        style="color: #0f172a; background: #ffffff; border: 2px solid #94a3b8; font-weight: 700; font-size: 1.2rem; text-align: center; letter-spacing: 4px;"
                    >
                    <div class="error-message" id="error-message"></div>
                    <button type="submit">Enter</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        const form = document.getElementById('auth-form');
        const passInput = document.getElementById('password-input');
        const errorMsg = document.getElementById('error-message');
        const submitBtn = form.querySelector('button[type="submit"]');

        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            const password = passInput ? passInput.value.trim() : '';
            if (!password) {
                errorMsg.textContent = '✗ Password is required';
                errorMsg.style.color = '#f87171';
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Authenticating...';

            if (password === GUEST_PIN) {
                await loginAsGuest();
                return;
            }

            const res = await loginWithPin(password);
            if (res.ok) {
                showLoginSuccess(modal, errorMsg, res.user.nickname);
                return;
            }

            submitBtn.disabled = false;
            submitBtn.textContent = 'Enter';
            passInput.value = '';
            passInput.classList.add('shake');
            setTimeout(() => passInput.classList.remove('shake'), 500);
            errorMsg.textContent = '✗ Incorrect password';
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

        indicator.innerHTML = `
            <span class="role-icon" style="font-size: 1.1rem; pointer-events: none;">${avatarIcon}</span>
            <span class="role-name" style="color: #ffffff !important; font-weight: 700 !important; text-shadow: 0 1px 3px rgba(0,0,0,0.8); pointer-events: none;">${displayName} (${badgeTitle})</span>
            <button onclick="window.logout()" class="logout-btn" title="Logout" style="background: none; border: none; color: #f87171; cursor: pointer; padding: 2px 4px; font-size: 0.95rem; margin-left: 2px;">🚪</button>
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
            } catch (e) {}
        }
        element.addEventListener('mousedown', dragMouseDown);
        element.addEventListener('touchstart', dragTouchStart, { passive: false });

        function dragMouseDown(e) {
            if (e.target.closest('.logout-btn')) return;
            e.preventDefault();
            isDragging = true;
            element.style.cursor = 'grabbing';
            pos3 = e.clientX; pos4 = e.clientY;
            document.addEventListener('mousemove', elementDrag);
            document.addEventListener('mouseup', closeDragElement);
        }
        function dragTouchStart(e) {
            if (e.target.closest('.logout-btn')) return;
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
        if (!confirm('Exit Medical Library session?')) return;
        if (unsubscribeRealtime) unsubscribeRealtime();
        if (window.SupabaseAPI && currentUser && !currentUser.isGuest) {
            await window.SupabaseAPI.logout();
        }
        currentUser = null;
        window.location.reload();
    };

    // -----------------------------------------------------------------
    // Boot sequence — async, because checking a Supabase session and
    // loading the profile row both require a round trip (usually served
    // from local storage / cache, but still a Promise).
    // -----------------------------------------------------------------
    async function boot() {
        // Guest mode is purely local — check it first, no Supabase call needed.
        // (We don't persist guest state across reloads on purpose: guest is
        // meant to be a no-trace, no-sync mode. Remove this comment/behavior
        // if you'd rather have guest survive a refresh via sessionStorage.)

        if (window.SupabaseAPI) {
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
                }
            }
        }

        if (!isAuthenticated()) {
            showLoginModal();
            return;
        }

        const nameDisplay = document.getElementById('profile-nickname-display');
        if (nameDisplay) nameDisplay.textContent = currentUser.nickname || currentUser.username || 'Doctor User';

        if (currentUser.role === 'user') applyUserRestrictions();
        if (currentUser.role === 'admin') applyAdminAccess();
        showRoleIndicator(currentUser);
        startProfileRealtimeSync();

        // Let quiz.js (or any page) know auth is ready — needed because this
        // whole boot sequence is now async, unlike the old synchronous version.
        document.dispatchEvent(new CustomEvent('starley-auth-ready', { detail: currentUser }));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

    window.AuthSystem = {
        getCurrentUser,
        hasRole,
        isAdmin: () => hasRole('admin'),
        isUser: () => hasRole('user'),
        setAuthenticated
    };
})();
