// auth.js - защита с 2 уровнями доступа
(function() {
    const PASSWORDS = {
        '456755': { role: 'admin', name: 'Administrator' },
        '0455': { role: 'user', name: 'User' }
    };
    
    const SESSION_KEY = 'starley_auth';
    
    // Получить данные текущего пользователя
    function getCurrentUser() {
        const authData = sessionStorage.getItem(SESSION_KEY);
        if (!authData) return null;
        
        try {
            const data = JSON.parse(authData);
            // Проверяем срок (24 часа)
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
    
    // Проверка авторизации
    function isAuthenticated() {
        return getCurrentUser() !== null;
    }
    
    // Проверка роли
    function hasRole(requiredRole) {
        const user = getCurrentUser();
        if (!user) return false;
        if (requiredRole === 'user') return true; // user доступен всем
        return user.role === requiredRole;
    }
    
    // Сохранить авторизацию
    function setAuthenticated(userInfo) {
        const authData = {
            ...userInfo,
            timestamp: Date.now()
        };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(authData));
    }
    
    // Модальное окно входа
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
                        maxlength="6"
                        pattern="[0-9]*"
                        inputmode="numeric"
                        autocomplete="off"
                        autofocus
                    >
                    <div class="error-message" id="error-message"></div>
                    <button type="submit">Enter</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const form = document.getElementById('auth-form');
        const input = document.getElementById('password-input');
        const errorMsg = document.getElementById('error-message');
        
        // Обработчик формы
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const password = input.value.trim();
            const userInfo = PASSWORDS[password];
            
            if (userInfo) {
                // Правильный пароль
                setAuthenticated(userInfo);
                
                // Анимация успеха
                modal.classList.add('auth-success');
                errorMsg.textContent = `✓ Welcome, ${userInfo.name}!`;
                errorMsg.style.color = '#27ae60';
                
                setTimeout(() => {
                    modal.remove();
                    document.body.style.overflow = '';
                    
                    // Применяем ограничения для user
                    if (userInfo.role === 'user') {
                        applyUserRestrictions();
                    }
                    
                    // Показываем индикатор роли
                    showRoleIndicator(userInfo);
                }, 800);
            } else {
                // Неверный пароль
                input.value = '';
                input.classList.add('shake');
                errorMsg.textContent = '✗ Incorrect password';
                errorMsg.style.color = '#e74c3c';
                
                setTimeout(() => {
                    input.classList.remove('shake');
                }, 500);
            }
        });
        
        setTimeout(() => input.focus(), 100);
    }
    
    // Применить ограничения для user
    function applyUserRestrictions() {
        // Скрыть ссылки на редактор и конвертер
        const editorLinks = document.querySelectorAll('a[href*="editor.html"], a[href*="mdconvert.html"]');
        editorLinks.forEach(link => {
            link.style.display = 'none';
        });
        
        // Скрыть кнопки редактирования
        const editButtons = document.querySelectorAll('.edit-btn, .admin-only, [data-role="admin"]');
        editButtons.forEach(btn => {
            btn.style.display = 'none';
        });
        
        // Если мы на странице редактора - редирект на главную
        if (window.location.pathname.includes('editor.html') || 
            window.location.pathname.includes('mdconvert.html')) {
            alert('⚠️ Access denied. Admin privileges required.');
            window.location.href = 'index.html';
        }
    }
    
    // Показать индикатор роли
    function showRoleIndicator(userInfo) {
        const existing = document.getElementById('role-indicator');
        if (existing) existing.remove();
        
        const indicator = document.createElement('div');
        indicator.id = 'role-indicator';
        indicator.className = `role-indicator role-${userInfo.role}`;
        indicator.innerHTML = `
            <span class="role-icon">${userInfo.role === 'admin' ? '👑' : '👤'}</span>
            <span class="role-name">${userInfo.name}</span>
            <button onclick="logout()" class="logout-btn" title="Logout">🚪</button>
        `;
        document.body.appendChild(indicator);
    }
    
    // Глобальная функция logout
    window.logout = function() {
        if (confirm('Exit the library?')) {
            sessionStorage.removeItem(SESSION_KEY);
            window.location.reload();
        }
    };
    
    // Проверка при загрузке страницы
    if (!isAuthenticated()) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', showLoginModal);
        } else {
            showLoginModal();
        }
    } else {
        // Пользователь уже авторизован
        const user = getCurrentUser();
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                if (user.role === 'user') {
                    applyUserRestrictions();
                }
                showRoleIndicator(user);
            });
        } else {
            if (user.role === 'user') {
                applyUserRestrictions();
            }
            showRoleIndicator(user);
        }
    }
    
    // Экспортируем функции для использования в других скриптах
    window.AuthSystem = {
        getCurrentUser: getCurrentUser,
        hasRole: hasRole,
        isAdmin: () => hasRole('admin'),
        isUser: () => hasRole('user')
    };
})();
