// Global logout handler
window.logout = function() {
    if (confirm('Exit Medical Library session?')) {
        sessionStorage.removeItem('starley_auth');
        localStorage.removeItem('starley_auth');
        localStorage.removeItem('starley_user_profile');
        window.location.reload();
    }
};

(function() {
    const PASSWORDS = {
        '456755': { username: 'admin', password: '456755', role: 'admin', name: 'Administrator', nickname: 'Administrator', avatar: 'doc' },
        '0455': { username: 'guest', password: '0455', role: 'user', name: 'User', nickname: 'User', avatar: 'doc', isGuest: true }
    };
    
    const SESSION_KEY = 'starley_auth';
    
    function getCurrentUser() {
        let authData = sessionStorage.getItem(SESSION_KEY);
        if (!authData) {
            authData = localStorage.getItem(SESSION_KEY);
        }
        if (!authData) return null;
        
        try {
            const data = JSON.parse(authData);
            const now = Date.now();
            // 30 days validity for persistent login
            if (now - data.timestamp > 30 * 24 * 60 * 60 * 1000) {
                sessionStorage.removeItem(SESSION_KEY);
                localStorage.removeItem(SESSION_KEY);
                return null;
            }
            return data;
        } catch {
            return null;
        }
    }
    
    function isAuthenticated() {
        return getCurrentUser() !== null;
    }
    
    function hasRole(requiredRole) {
        const user = getCurrentUser();
        if (!user) return false;
        if (requiredRole === 'user') return true;
        return user.role === requiredRole;
    }
    
    function setAuthenticated(userInfo) {
        const authData = {
            username: userInfo.username || userInfo.name || 'user',
            password: userInfo.password || '',
            role: userInfo.role || 'user',
            name: userInfo.nickname || userInfo.name || 'User',
            nickname: userInfo.nickname || userInfo.name || 'User',
            avatar: userInfo.avatar || 'doc',
            email: userInfo.email || '',
            telegramId: userInfo.telegramId || '',
            isGuest: Boolean(userInfo.isGuest || userInfo.password === '0455'),
            timestamp: Date.now()
        };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(authData));
        localStorage.setItem(SESSION_KEY, JSON.stringify(authData));
    }

    function loginAsGuest() {
        const guestData = {
            username: 'guest',
            password: '0455',
            role: 'user',
            name: 'User',
            nickname: 'User',
            avatar: 'doc',
            isGuest: true,
            timestamp: Date.now()
        };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(guestData));
        localStorage.setItem(SESSION_KEY, JSON.stringify(guestData));
        window.location.reload();
    }
    
    // Display Unified Login Modal (Simple Password Input on All Pages)
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

        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const password = passInput ? passInput.value.trim() : '';

            if (!password) {
                errorMsg.textContent = '✗ Password is required';
                errorMsg.style.color = '#f87171';
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Authenticating...';
            }

            // Check hardcoded static PINs (456755 for Admin, 0455 for User/Anonymous)
            if (password === '456755') {
                setAuthenticated(PASSWORDS['456755']);
                showLoginSuccess(modal, errorMsg, 'Administrator');
                return;
            }

            if (password === '0455') {
                setAuthenticated(PASSWORDS['0455']);
                showLoginSuccess(modal, errorMsg, 'User');
                return;
            }

            // Check Google Sheets API for registered accounts matching entered password
            if (window.GoogleSheetsAPI && typeof window.GoogleSheetsAPI.login === 'function') {
                try {
                    const apiRes = await window.GoogleSheetsAPI.login('', password);
                    if (apiRes && apiRes.success && apiRes.user) {
                        setAuthenticated({
                            ...apiRes.user,
                            password: password
                        });
                        showLoginSuccess(modal, errorMsg, apiRes.user.nickname || apiRes.user.username);
                        return;
                    }
                } catch (err) {
                    console.warn('[Auth] Remote login error:', err);
                }
            }

            // Reject invalid password
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enter';
            }
            if (passInput) {
                passInput.value = '';
                passInput.classList.add('shake');
                setTimeout(() => passInput.classList.remove('shake'), 500);
            }
            errorMsg.textContent = '✗ Incorrect password';
            errorMsg.style.color = '#f87171';
        });
        
        setTimeout(() => {
            if (passInput) passInput.focus();
        }, 100);
    }

    function showLoginSuccess(modal, errorMsg, displayName) {
        modal.classList.add('auth-success');
        errorMsg.textContent = `✓ Welcome, ${displayName}!`;
        errorMsg.style.color = '#3fb950';
        
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
            
            const user = getCurrentUser();
            if (user && user.role === 'user') {
                applyUserRestrictions();
            }
            showRoleIndicator(user);
            window.location.reload();
        }, 600);
    }
    
    function applyUserRestrictions() {
        const editorLinks = document.querySelectorAll('a[href*="editor.html"], a[href*="mdconvert.html"], a[href*="manifest-editor.html"]');
        editorLinks.forEach(link => link.style.display = 'none');
        
        const editButtons = document.querySelectorAll('.edit-btn, .admin-only, [data-role="admin"]');
        editButtons.forEach(btn => btn.style.display = 'none');
        
        if (window.location.pathname.includes('editor.html') || 
            window.location.pathname.includes('mdconvert.html') ||
            window.location.pathname.includes('manifest-editor.html')) {
            alert('⚠️ Access denied. Administrator privileges required.');
            window.location.href = 'index.html';
        }
    }

    function applyAdminAccess() {
        const adminElements = document.querySelectorAll('[data-role="admin"], .admin-only, a[href*="manifest-editor.html"], a[href*="editor.html"]');
        adminElements.forEach(el => {
            if (el.style.display === 'none') {
                el.style.display = '';
            }
        });
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
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        let isDragging = false;
        
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
            if (e.target.classList.contains('logout-btn') || e.target.closest('.logout-btn')) return;
            e.preventDefault();
            isDragging = true;
            element.style.cursor = 'grabbing';
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.addEventListener('mousemove', elementDrag);
            document.addEventListener('mouseup', closeDragElement);
        }
        
        function dragTouchStart(e) {
            if (e.target.classList.contains('logout-btn') || e.target.closest('.logout-btn')) return;
            e.preventDefault();
            isDragging = true;
            element.style.cursor = 'grabbing';
            const touch = e.touches[0];
            pos3 = touch.clientX;
            pos4 = touch.clientY;
            document.addEventListener('touchmove', elementTouchDrag, { passive: false });
            document.addEventListener('touchend', closeDragElement);
        }
        
        function elementDrag(e) {
            if (!isDragging) return;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            updatePosition();
        }
        
        function elementTouchDrag(e) {
            if (!isDragging) return;
            e.preventDefault();
            const touch = e.touches[0];
            pos1 = pos3 - touch.clientX;
            pos2 = pos4 - touch.clientY;
            pos3 = touch.clientX;
            pos4 = touch.clientY;
            updatePosition();
        }
        
        function updatePosition() {
            const newTop = element.offsetTop - pos2;
            const newLeft = element.offsetLeft - pos1;
            const maxX = window.innerWidth - element.offsetWidth;
            const maxY = window.innerHeight - element.offsetHeight;
            const boundedTop = Math.max(0, Math.min(newTop, maxY));
            const boundedLeft = Math.max(0, Math.min(newLeft, maxX));
            element.style.top = boundedTop + 'px';
            element.style.left = boundedLeft + 'px';
            element.style.right = 'auto';
        }
        
        function closeDragElement() {
            isDragging = false;
            element.style.cursor = 'grab';
            document.removeEventListener('mousemove', elementDrag);
            document.removeEventListener('mouseup', closeDragElement);
            document.removeEventListener('touchmove', elementTouchDrag);
            document.removeEventListener('touchend', closeDragElement);
            localStorage.setItem('role-indicator-position', JSON.stringify({
                top: element.style.top,
                left: element.style.left
            }));
        }
    }
    
    window.logout = function() {
        if (confirm('Exit Medical Library session?')) {
            sessionStorage.removeItem(SESSION_KEY);
            sessionStorage.removeItem('starley_auth');
            localStorage.removeItem('starley_auth');
            localStorage.removeItem('starley_user_profile');
            window.location.reload();
        }
    };
    
    if (!isAuthenticated()) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', showLoginModal);
        } else {
            showLoginModal();
        }
    } else {
        const user = getCurrentUser();
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                if (user.role === 'user') applyUserRestrictions();
                if (user.role === 'admin') applyAdminAccess();
                showRoleIndicator(user);
            });
        } else {
            if (user.role === 'user') applyUserRestrictions();
            if (user.role === 'admin') applyAdminAccess();
            showRoleIndicator(user);
        }
    }
    
    window.AuthSystem = {
        getCurrentUser: getCurrentUser,
        hasRole: hasRole,
        isAdmin: () => hasRole('admin'),
        isUser: () => hasRole('user'),
        setAuthenticated: setAuthenticated
    };
})();

