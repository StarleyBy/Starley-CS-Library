// assets/js/google-sheets-api.js
// Client API Integration for Google Sheets Apps Script Backend

(function() {
    // Configurable Google Apps Script Web App Endpoint URL
    // Can be overridden in config.js via window.GOOGLE_SHEETS_WEB_APP_URL
    const DEFAULT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbz_SAMPLE_DEPLOYMENT_ID/exec';
    
    function getApiUrl() {
        return (window.GOOGLE_SHEETS_WEB_APP_URL && window.GOOGLE_SHEETS_WEB_APP_URL.startsWith('http')) 
            ? window.GOOGLE_SHEETS_WEB_APP_URL 
            : null;
    }

    async function postRequest(payload) {
        const url = getApiUrl();
        if (!url) {
            console.warn('[GoogleSheetsAPI] Web App URL not configured. Operating in local offline mode.');
            return { success: false, error: 'Google Sheets Web App URL not configured.' };
        }

        // 1. Attempt POST request first
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8'
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const rawText = await response.text();
                if (rawText && rawText.trim()) {
                    try {
                        return JSON.parse(rawText);
                    } catch (jsonErr) {
                        console.warn('[GoogleSheetsAPI] Non-JSON POST response, trying GET fallback...');
                    }
                }
            }
        } catch (postError) {
            console.warn('[GoogleSheetsAPI] POST request failed (CORS/Network), executing GET fallback...', postError.message);
        }

        // 2. GET Fallback (100% immune to browser CORS restrictions on GitHub Pages)
        try {
            const controller2 = new AbortController();
            const timeoutId2 = setTimeout(() => controller2.abort(), 25000);

            const action = encodeURIComponent(payload.action || '');
            const username = encodeURIComponent(payload.username || '');
            const payloadStr = encodeURIComponent(JSON.stringify(payload));
            const getUrl = `${url}?action=${action}&username=${username}&payload=${payloadStr}`;

            const response = await fetch(getUrl, {
                method: 'GET',
                signal: controller2.signal
            });

            clearTimeout(timeoutId2);

            if (!response.ok) {
                throw new Error(`HTTP Error ${response.status}`);
            }

            const rawText = await response.text();
            if (!rawText || !rawText.trim()) {
                throw new Error('Empty response from Google Sheets server');
            }

            let data;
            try {
                data = JSON.parse(rawText);
            } catch (jsonErr) {
                console.error('[GoogleSheetsAPI] Non-JSON output from backend GET:', rawText.substring(0, 200));
                return { 
                    success: false, 
                    error: 'Backend returned HTML/non-JSON response.' 
                };
            }

            return data;
        } catch (getError) {
            const isAbort = getError.name === 'AbortError';
            const errMsg = isAbort ? 'Request timed out (15s).' : getError.message;
            console.error('[GoogleSheetsAPI] GET Fallback Error:', errMsg);
            return { success: false, error: 'Connection to Google Sheets backend failed: ' + errMsg };
        }
    }

    const GoogleSheetsAPI = {
        /**
         * Login user against Google Sheets DB
         */
        async login(username, password) {
            return await postRequest({
                action: 'login',
                username: username,
                password: password
            });
        },

        /**
         * Fetch user progress, stats, favorites, playlists, and session history
         */
        async getUserData(username) {
            return await postRequest({
                action: 'get_user_data',
                username: username
            });
        },

        /**
         * Sync progress, favorites, playlists, and new session to Google Sheets
         */
        async syncUserData(username, syncData) {
            return await postRequest({
                action: 'sync_user_data',
                username: username,
                streakDays: syncData.streakDays,
                solvedCount: syncData.solvedCount,
                accuracyPct: syncData.accuracyPct,
                mastery: syncData.mastery,
                favorites: syncData.favorites,
                playlists: syncData.playlists,
                newSession: syncData.newSession || null
            });
        },

        /**
         * Register request from user/telegram
         */
        async submitRegistration(regData) {
            return await postRequest({
                action: 'telegram_register',
                telegramId: regData.telegramId || '',
                telegramUsername: regData.telegramUsername || '',
                nickname: regData.nickname,
                password: regData.password,
                email: regData.email || ''
            });
        },

        /**
         * Admin: Get pending registration requests
         */
        async adminGetRequests(adminUser, adminPass) {
            return await postRequest({
                action: 'admin_get_requests',
                adminUser: adminUser,
                adminPass: adminPass
            });
        },

        /**
         * Admin: Process (Approve / Reject) registration request
         */
        async adminProcessRequest(adminUser, adminPass, requestId, decision) {
            return await postRequest({
                action: 'admin_process_request',
                adminUser: adminUser,
                adminPass: adminPass,
                requestId: requestId,
                decision: decision
            });
        },

        /**
         * Admin: Get all user accounts
         */
        async adminGetUsers(adminUser, adminPass) {
            return await postRequest({
                action: 'admin_get_users',
                adminUser: adminUser,
                adminPass: adminPass
            });
        },

        /**
         * Admin: Create new user manually
         */
        async adminCreateUser(adminUser, adminPass, userData) {
            return await postRequest({
                action: 'admin_create_user',
                adminUser: adminUser,
                adminPass: adminPass,
                username: userData.username,
                password: userData.password,
                role: userData.role || 'user',
                nickname: userData.nickname || userData.username,
                email: userData.email || '',
                telegramId: userData.telegramId || ''
            });
        },

        /**
         * Admin: Update existing user
         */
        async adminUpdateUser(adminUser, adminPass, targetUser, updateFields) {
            return await postRequest({
                action: 'admin_update_user',
                adminUser: adminUser,
                adminPass: adminPass,
                targetUser: targetUser,
                newPassword: updateFields.password,
                newRole: updateFields.role,
                newNickname: updateFields.nickname,
                newEmail: updateFields.email,
                newStatus: updateFields.status
            });
        },

        /**
         * Admin: Delete user account
         */
        async adminDeleteUser(adminUser, adminPass, targetUser) {
            return await postRequest({
                action: 'admin_delete_user',
                adminUser: adminUser,
                adminPass: adminPass,
                targetUser: targetUser
            });
        }
    };

    window.GoogleSheetsAPI = GoogleSheetsAPI;
})();
