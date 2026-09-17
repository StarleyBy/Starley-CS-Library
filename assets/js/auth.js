// assets/js/auth.js - Medical Library Authentication Engine (Google Sheets API & Dual Level Support)
(function() {
    const PASSWORDS = {
        '456755': { username: 'admin', role: 'admin', name: 'Administrator', nickname: 'Administrator', avatar: 'doc' },
        '0455': { username: 'user', role: 'user', name: 'User', nickname: 'Doctor User', avatar: 'doc' }
    };
    
    const SESSION_KEY = 'starley_auth';
    
    // Get current logged-in user
    function getCurrentUser() {
        const authData = sessionStorage.getItem(SESSION_KEY);
        if (!authData) return null;
        
        try {
            const data = JSON.parse(authData);
            const now = Date.now();
            if (now - data.timestamp > 24 * 60 * 60 * 1000) {
                sessionStorage.removeItem(SESSION_KEY);
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
            timestamp: Date.now()
        };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(authData));
    }

    function loginAsGuest() {
        const guestData = {
            username: 'guest',
            role: 'user',
            name: 'Guest Doctor',
            nickname: 'Guest Doctor',
            avatar: 'doc',
            isGuest: true,
            timestamp: Date.now()
        };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(guestData));
        window.location.reload();
    }
    
    // Display English Login Modal
    function showLoginModal() {
        document.body.style.overflow = 'hidden';
        
        const modal = document.createElement('div');
        modal.id = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-overlay"></div>
            <div class="auth-box" style="max-width: 380px; padding: 24px; background: rgba(22, 27, 34, 0.95); border: 1px solid rgba(88, 166, 255, 0.3); border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,0.7); color: #c9d1d9; backdrop-filter: blur(10px);">
                <div class="auth-header" style="text-align: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; font-size: 1.3rem; color: #58a6ff;">🔒 Medical Library</h2>
                    <p style="margin: 6px 0 0; font-size: 0.85rem; color: #8b949e;">Enter credentials or PIN to access your profile</p>
                </div>
                <form id="auth-form" autocomplete="off">
                    <div style="margin-bottom: 12px;">
                        <input 
                            type="text" 
                            id="username-input" 
                            placeholder="Username / Nickname (Optional for PIN)"
                            autocomplete="off"
                            style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid #30363d; background: #0d1117; color: #f0f6fc; font-size: 0.9rem;"
                        >
                    </div>
                    <div style="margin-bottom: 14px;">
                        <input 
                            type="password" 
                            id="password-input" 
                            placeholder="Password or PIN" 
                            autocomplete="off"
                            autofocus
                            style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid #30363d; background: #0d1117; color: #f0f6fc; font-size: 0.9rem;"
                        >
                    </div>
                    <div class="error-message" id="error-message" style="margin-bottom: 12px; font-size: 0.85rem; text-align: center; min-height: 20px;"></div>
                    <button type="submit" id="auth-submit-btn" style="width: 100%; padding: 10px; border-radius: 8px; border: none; background: #238636; color: #fff; font-weight: 700; cursor: pointer; font-size: 0.95rem;">Enter</button>
                </form>
                <div style="margin-top: 16px; padding-top: 14px; border-top: 1px dashed #30363d; text-align: center;">
                    <button type="button" id="btn-guest-login" style="background: none; border: none; color: #8b949e; font-size: 0.82rem; cursor: pointer; text-decoration: underline;">Continue as Guest (No Cloud Sync)</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const form = document.getElementById('auth-form');
        const userInput = document.getElementById('username-input');
        const passInput = document.getElementById('password-input');
        const errorMsg = document.getElementById('error-message');
        const submitBtn = document.getElementById('auth-submit-btn');
        const guestBtn = document.getElementById('btn-guest-login');

        if (guestBtn) {
            guestBtn.addEventListener('click', function() {
                modal.remove();
                document.body.style.overflow = '';
                loginAsGuest();
            });
        }
        
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = userInput.value.trim();
            const password = passInput.value.trim();

            if (!password) {
                errorMsg.textContent = '✗ Password or PIN is required';
                errorMsg.style.color = '#f87171';
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Authenticating...';

            // Check Google Sheets API if available
            if (window.GoogleSheetsAPI && typeof window.GoogleSheetsAPI.login === 'function') {
                const searchUser = username || password;
                const apiRes = await window.GoogleSheetsAPI.login(searchUser, password);
                if (apiRes && apiRes.success && apiRes.user) {
                    setAuthenticated({
                        ...apiRes.user,
                        password: password
                    });
                    showLoginSuccess(modal, errorMsg, apiRes.user.nickname || apiRes.user.username);
                    return;
                }
            }

            // Local fallback / Static PIN check
            let staticUser = PASSWORDS[password];
            if (!staticUser && username && PASSWORDS[username]) {
                if (PASSWORDS[username].password === password) staticUser = PASSWORDS[username];
            }

            if (staticUser) {
                setAuthenticated({
                    ...staticUser,
                    password: password
                });
                showLoginSuccess(modal, errorMsg, staticUser.nickname || staticUser.name);
            } else {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enter';
                passInput.value = '';
                passInput.classList.add('shake');
                errorMsg.textContent = '✗ Incorrect username, password or PIN';
                errorMsg.style.color = '#f87171';
                setTimeout(() => passInput.classList.remove('shake'), 500);
            }
        });
        
        setTimeout(() => passInput.focus(), 100);
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
    
    // Apply user restrictions
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
    
    // Show role indicator with drag support
    function showRoleIndicator(userInfo) {
        if (!userInfo) return;
        const existing = document.getElementById('role-indicator');
        if (existing) existing.remove();
        
        const indicator = document.createElement('div');
        indicator.id = 'role-indicator';
        indicator.className = `role-indicator role-${userInfo.role}`;
        indicator.style.cssText = 'position: fixed; top: 12px; right: 12px; z-index: 9999; display: flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 20px; background: rgba(22, 27, 34, 0.9); border: 1px solid var(--quiz-border, #30363d); color: #f0f6fc; font-size: 0.82rem; font-weight: 700; box-shadow: 0 4px 12px rgba(0,0,0,0.4); backdrop-filter: blur(8px); cursor: grab;';
        
        const avatarIcon = userInfo.role === 'admin' ? '👑' : (userInfo.isGuest ? '👤' : '🩺');
        const badgeTitle = userInfo.role === 'admin' ? 'Admin' : (userInfo.isGuest ? 'Guest' : 'User');

        indicator.innerHTML = `
            <span class="role-icon">${avatarIcon}</span>
            <span class="role-name">${userInfo.nickname || userInfo.name} (${badgeTitle})</span>
            <button onclick="logout()" class="logout-btn" title="Logout" style="background: none; border: none; color: #f87171; cursor: pointer; padding: 2px 4px; font-size: 0.9rem;">🚪</button>
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
        if (confirm('Exit Medical Library?')) {
            sessionStorage.removeItem(SESSION_KEY);
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
                showRoleIndicator(user);
            });
        } else {
            if (user.role === 'user') applyUserRestrictions();
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
