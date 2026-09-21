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
        '0455': { username: 'guest', password: '0455', role: 'user', name: 'Guest Doctor', nickname: 'Guest Doctor', avatar: 'doc', isGuest: true }
    };
    
    const SESSION_KEY = 'starley_auth';
    
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
            password: userInfo.password || (userInfo.role === 'admin' ? '456755' : ''),
            role: userInfo.role || 'user',
            name: userInfo.nickname || userInfo.name || 'User',
            nickname: userInfo.nickname || userInfo.name || 'User',
            avatar: userInfo.avatar || 'doc',
            email: userInfo.email || '',
            telegramId: userInfo.telegramId || '',
            isGuest: Boolean(userInfo.isGuest),
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

    /**
     * Show Modal for Requesting New Account via Telegram Bot or Web API
     */
    function showAccountRequestModal() {
        const existing = document.getElementById('account-request-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'account-request-modal';
        modal.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 16px;';
        
        modal.innerHTML = `
            <div style="background: rgba(22, 27, 34, 0.95); border: 1px solid rgba(88, 166, 255, 0.3); border-radius: 20px; width: 100%; max-width: 440px; padding: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.7); color: #c9d1d9; animation: modal-slide-in 0.3s ease-out;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #30363d; padding-bottom: 12px;">
                    <h3 style="margin: 0; font-size: 1.1rem; color: #58a6ff; font-weight: 800;">📲 Request Quiz Account</h3>
                    <button type="button" id="btn-close-req-modal" style="background: none; border: none; color: #8b949e; font-size: 1.2rem; cursor: pointer;">✕</button>
                </div>

                <div style="background: rgba(13, 17, 23, 0.6); border: 1px solid #30363d; border-radius: 10px; padding: 12px; margin-bottom: 16px; font-size: 0.83rem; color: #8b949e; line-height: 1.5;">
                    Enter your desired username and password. Your request will be sent to the administrator for single-click approval. You will receive notifications upon activation!
                </div>

                <form id="account-req-form">
                    <div style="margin-bottom: 12px;">
                        <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #8b949e; margin-bottom: 4px; text-transform: uppercase;">Desired Nickname / Username *</label>
                        <input type="text" id="req-nickname" placeholder="e.g. Test" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #30363d; background: #0d1117; color: #f0f6fc; font-size: 0.9rem;">
                    </div>
                    <div style="margin-bottom: 12px;">
                        <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #8b949e; margin-bottom: 4px; text-transform: uppercase;">Desired Password *</label>
                        <input type="password" id="req-password" placeholder="e.g. 1234" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #30363d; background: #0d1117; color: #f0f6fc; font-size: 0.9rem;">
                    </div>
                    <div style="margin-bottom: 12px;">
                        <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #8b949e; margin-bottom: 4px; text-transform: uppercase;">Email Address (For Notifications)</label>
                        <input type="email" id="req-email" placeholder="e.g. doctor@example.com" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #30363d; background: #0d1117; color: #f0f6fc; font-size: 0.9rem;">
                    </div>
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #8b949e; margin-bottom: 4px; text-transform: uppercase;">Telegram Username (Optional)</label>
                        <input type="text" id="req-telegram" placeholder="e.g. @doctor_starley" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #30363d; background: #0d1117; color: #f0f6fc; font-size: 0.9rem;">
                    </div>

                    <div id="req-status-msg" style="margin-bottom: 12px; font-size: 0.85rem; text-align: center; min-height: 18px;"></div>

                    <button type="submit" id="btn-submit-req" style="width: 100%; padding: 10px; border-radius: 8px; border: none; background: #238636; color: #fff; font-weight: 700; cursor: pointer; font-size: 0.95rem;">📤 Submit Request to Admin</button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        const closeBtn = document.getElementById('btn-close-req-modal');
        if (closeBtn) closeBtn.onclick = () => modal.remove();

        const form = document.getElementById('account-req-form');
        const statusMsg = document.getElementById('req-status-msg');
        const submitBtn = document.getElementById('btn-submit-req');

        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const nickname = document.getElementById('req-nickname').value.trim();
            const password = document.getElementById('req-password').value.trim();
            const email = document.getElementById('req-email').value.trim();
            const telegram = document.getElementById('req-telegram').value.trim();

            if (!nickname || !password) {
                statusMsg.textContent = '✗ Nickname and password are required.';
                statusMsg.style.color = '#f87171';
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting Request...';

            // Dispatch instant direct Telegram alert to Admin (@CSbugs_bot)
            try {
                const botToken = window.TELEGRAM_BOT_TOKEN || '8776764036:AAEjdwQQjmB2zxuF4ILgBDVcJgwdu0FdQ5c';
                const adminChatId = window.TELEGRAM_ADMIN_CHAT_ID || '954588841';
                const escStr = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                const tgMsg = `📬 <b>НОВЫЙ ЗАПРОС НА АККАУНТ (КВИЗ)</b>\n\n` +
                    `👤 <b>Имя пользователя:</b> <code>${escStr(nickname)}</code>\n` +
                    `🔑 <b>Пароль:</b> <code>${escStr(password)}</code>\n` +
                    `📧 <b>Email:</b> ${escStr(email || 'не указан')}\n` +
                    `✈️ <b>Telegram:</b> ${escStr(telegram || 'не указан')}\n\n` +
                    `Одобрите или отклоните в панели управления 👑 Admin или Google Таблице!`;

                fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: adminChatId,
                        text: tgMsg,
                        parse_mode: 'HTML'
                    })
                }).catch(err => console.warn('[Telegram Alert Error]:', err));
            } catch (err) {}

            if (window.GoogleSheetsAPI && typeof window.GoogleSheetsAPI.submitRegistration === 'function') {
                const res = await window.GoogleSheetsAPI.submitRegistration({
                    nickname: nickname,
                    password: password,
                    email: email,
                    telegramUsername: telegram
                });

                if (res && res.success) {
                    statusMsg.textContent = '✓ Request submitted! Administrator notified.';
                    statusMsg.style.color = '#3fb950';
                    setTimeout(() => {
                        alert(`✅ Registration Request Submitted!\n\nUser '${nickname}' has been sent to the admin approval queue.`);
                        modal.remove();
                    }, 800);
                    return;
                }
            }

            statusMsg.textContent = '✓ Offline simulation: Request logged.';
            statusMsg.style.color = '#3fb950';
            setTimeout(() => {
                modal.remove();
            }, 1000);
        });
    }
    
    // Display Login Modal
    function showLoginModal() {
        document.body.style.overflow = 'hidden';
        const isQuizPage = window.location.pathname.includes('quiz.html');
        
        const modal = document.createElement('div');
        modal.id = 'auth-modal';

        if (!isQuizPage) {
            // Main site login modal: Original simple version (single password field)
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
                            maxlength="6"
                            pattern="[0-9]*"
                            inputmode="numeric"
                            autocomplete="off"
                            autofocus
                            style="color: #0f172a; background: #ffffff; border: 2px solid #94a3b8; font-weight: 700; font-size: 1.2rem; text-align: center; letter-spacing: 6px;"
                        >
                        <div class="error-message" id="error-message"></div>
                        <button type="submit">Enter</button>
                    </form>
                </div>
            `;
        } else {
            // Quiz page login modal: Extended version with account login & Telegram request option
            modal.innerHTML = `
                <div class="auth-overlay"></div>
                <div class="auth-box" style="max-width: 400px; padding: 24px; background: rgba(22, 27, 34, 0.95); border: 1px solid rgba(88, 166, 255, 0.3); border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,0.7); color: #c9d1d9; backdrop-filter: blur(10px);">
                    <div class="auth-header" style="text-align: center; margin-bottom: 20px;">
                        <h2 style="margin: 0; font-size: 1.3rem; color: #58a6ff;">🔒 Medical Library Quiz</h2>
                        <p style="margin: 6px 0 0; font-size: 0.85rem; color: #8b949e;">Enter credentials or PIN to continue</p>
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
                    
                    <div style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed #30363d; display: flex; flex-direction: column; gap: 8px; text-align: center;">
                        <button type="button" id="btn-trigger-account-req" style="width: 100%; padding: 8px; border-radius: 8px; border: 1px solid rgba(88, 166, 255, 0.4); background: rgba(88, 166, 255, 0.1); color: #58a6ff; font-weight: 700; cursor: pointer; font-size: 0.82rem; display: flex; align-items: center; justify-content: center; gap: 6px;">
                            📲 Request New Account (Telegram Bot)
                        </button>
                        <button type="button" id="btn-guest-login" style="background: none; border: none; color: #8b949e; font-size: 0.82rem; cursor: pointer; text-decoration: underline;">Continue as Guest (No Cloud Sync)</button>
                    </div>
                </div>
            `;
        }
        
        document.body.appendChild(modal);
        
        const form = document.getElementById('auth-form');
        const userInput = document.getElementById('username-input');
        const passInput = document.getElementById('password-input');
        const errorMsg = document.getElementById('error-message');
        const submitBtn = form.querySelector('button[type="submit"]');
        const guestBtn = document.getElementById('btn-guest-login');
        const reqBtn = document.getElementById('btn-trigger-account-req');

        if (guestBtn) {
            guestBtn.addEventListener('click', function() {
                modal.remove();
                document.body.style.overflow = '';
                loginAsGuest();
            });
        }

        if (reqBtn) {
            reqBtn.addEventListener('click', function() {
                showAccountRequestModal();
            });
        }
        
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = userInput ? userInput.value.trim() : '';
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

            // Check hardcoded static PINs (456755 for Admin, 0455 for User/Guest)
            if (password === '456755') {
                setAuthenticated(PASSWORDS['456755']);
                showLoginSuccess(modal, errorMsg, 'Administrator');
                return;
            }

            if (password === '0455') {
                setAuthenticated(PASSWORDS['0455']);
                showLoginSuccess(modal, errorMsg, 'Guest Doctor');
                return;
            }

            // Check Google Sheets API if on Quiz page and username provided
            if (isQuizPage && window.GoogleSheetsAPI && typeof window.GoogleSheetsAPI.login === 'function') {
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

            // Reject anything else
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

        indicator.innerHTML = `
            <span class="role-icon" style="font-size: 1.1rem; pointer-events: none;">${avatarIcon}</span>
            <span class="role-name" style="color: #ffffff !important; font-weight: 700 !important; text-shadow: 0 1px 3px rgba(0,0,0,0.8); pointer-events: none;">${userInfo.nickname || userInfo.name} (${badgeTitle})</span>
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

    window.showAccountRequestModal = showAccountRequestModal;
    
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
        setAuthenticated: setAuthenticated,
        showAccountRequestModal: showAccountRequestModal
    };
})();
