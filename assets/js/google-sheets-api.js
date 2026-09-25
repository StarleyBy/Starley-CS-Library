// assets/js/google-sheets-api.js
// Client API Integration for Google Sheets Apps Script Backend
// Architecture: Local-First Key-Value Store (Wolfson Schedule pattern)

(function() {
    function getApiUrl() {
        return (window.GOOGLE_SHEETS_WEB_APP_URL && window.GOOGLE_SHEETS_WEB_APP_URL.startsWith('http')) 
            ? window.GOOGLE_SHEETS_WEB_APP_URL 
            : null;
    }

    function jsonpRequest(url, payload) {
        return new Promise((resolve, reject) => {
            const payloadStr = encodeURIComponent(JSON.stringify(payload));
            if (payloadStr.length > 2500) {
                return reject(new Error('Payload too large for JSONP URL'));
            }

            const callbackName = 'gs_cb_' + Math.round(1000000 * Math.random());
            let script = null;

            const timeoutId = setTimeout(() => {
                delete window[callbackName];
                if (script && script.parentNode) script.parentNode.removeChild(script);
                reject(new Error('JSONP Request timed out (25s)'));
            }, 25000);

            window[callbackName] = function(data) {
                clearTimeout(timeoutId);
                delete window[callbackName];
                if (script && script.parentNode) script.parentNode.removeChild(script);
                resolve(data);
            };

            script = document.createElement('script');
            script.src = `${url}?callback=${callbackName}&payload=${payloadStr}`;
            script.onerror = function(e) {
                clearTimeout(timeoutId);
                delete window[callbackName];
                if (script && script.parentNode) script.parentNode.removeChild(script);
                reject(new Error('JSONP Script Tag Error'));
            };
            document.body.appendChild(script);
        });
    }

    async function postRequest(payload) {
        const url = getApiUrl();
        if (!url) {
            console.warn('[GoogleSheetsAPI] Web App URL not configured.');
            return { ok: false, success: false, error: 'Google Sheets Web App URL not configured.' };
        }

        // 1. Direct POST fetch (Content-Type text/plain avoids unnecessary preflight CORS)
        // Note: Using Promise.race timeout instead of AbortController avoids Chrome abort on 302 redirects
        try {
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Network timeout (30s)')), 30000)
            );

            const response = await Promise.race([
                fetch(url, {
                    method: 'POST',
                    mode: 'cors',
                    redirect: 'follow',
                    headers: {
                        'Content-Type': 'text/plain;charset=utf-8'
                    },
                    body: JSON.stringify(payload)
                }),
                timeoutPromise
            ]);

            if (response.ok) {
                const rawText = await response.text();
                if (rawText && rawText.trim()) {
                    try {
                        const parsed = JSON.parse(rawText);
                        console.log('[GoogleSheetsAPI] POST Response:', parsed);
                        return parsed;
                    } catch (jsonErr) {}
                }
            }
        } catch (postError) {
            console.warn('[GoogleSheetsAPI] POST fetch error, trying fallback:', postError.message);
        }

        // 2. JSONP fallback
        try {
            const res = await jsonpRequest(url, payload);
            console.log('[GoogleSheetsAPI] JSONP Success:', res);
            return res;
        } catch (jsonpErr) {
            // Ignored if too large
        }

        // 3. Direct GET fallback if payload is small
        try {
            const payloadStr = encodeURIComponent(JSON.stringify(payload));
            const getUrl = `${url}?action=${encodeURIComponent(payload.action || '')}&payload=${payloadStr}`;
            if (getUrl.length <= 2000) {
                const res = await fetch(getUrl, { redirect: 'follow' });
                const data = await res.json();
                console.log('[GoogleSheetsAPI] GET Fallback Success:', data);
                return data;
            }
        } catch (getError) {}

        return { ok: false, success: false, error: 'Connection to Google Sheets backend failed.' };
    }

    async function getRequest(params = {}) {
        const url = getApiUrl();
        if (!url) {
            return { ok: false, success: false, error: 'Google Sheets Web App URL not configured.' };
        }

        const queryParams = new URLSearchParams({
            ...params,
            v: Date.now() // Cache-busting parameter
        });

        const fetchUrl = `${url}${url.includes('?') ? '&' : '?'}${queryParams.toString()}`;

        // 1. Direct fetch with Promise.race timeout (avoids Chrome AbortController redirect bug)
        try {
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Network timeout (25s)')), 25000)
            );

            const res = await Promise.race([
                fetch(fetchUrl, {
                    method: 'GET',
                    mode: 'cors',
                    redirect: 'follow',
                    cache: 'no-store'
                }),
                timeoutPromise
            ]);

            if (res.ok) {
                const data = await res.json();
                console.log('[GoogleSheetsAPI] GET Response:', data);
                return data;
            }
        } catch (err) {
            console.warn('[GoogleSheetsAPI] GET fetch error:', err.message);
        }

        // 2. JSONP fallback for GET requests
        try {
            return await new Promise((resolve, reject) => {
                const callbackName = 'gs_get_cb_' + Math.round(1000000 * Math.random());
                let script = null;

                const timeoutId = setTimeout(() => {
                    delete window[callbackName];
                    if (script && script.parentNode) script.parentNode.removeChild(script);
                    reject(new Error('GET JSONP Request timed out (20s)'));
                }, 20000);

                window[callbackName] = function(data) {
                    clearTimeout(timeoutId);
                    delete window[callbackName];
                    if (script && script.parentNode) script.parentNode.removeChild(script);
                    resolve(data);
                };

                const p = new URLSearchParams({
                    ...params,
                    callback: callbackName,
                    v: Date.now()
                });

                script = document.createElement('script');
                script.src = `${url}${url.includes('?') ? '&' : '?'}${p.toString()}`;
                script.onerror = function() {
                    clearTimeout(timeoutId);
                    delete window[callbackName];
                    if (script && script.parentNode) script.parentNode.removeChild(script);
                    reject(new Error('GET JSONP Script error'));
                };
                document.body.appendChild(script);
            });
        } catch (jsonpErr) {
            console.warn('[GoogleSheetsAPI] GET JSONP fallback error:', jsonpErr.message);
        }

        return { ok: false, success: false, error: 'Failed to read data from Google Sheets.' };
    }

    const GoogleSheetsAPI = {
        /**
         * Test connectivity to Google Sheets backend (ping)
         */
        async testConnection() {
            return await getRequest({ action: 'ping' });
        },

        /**
         * Pull all Key-Value data from Google Sheets (wf_data / quiz_data)
         * Supports both new Key-Value architecture and legacy get_user_data fallback
         */
        async pullFromSheets() {
            let res = await getRequest({ action: 'getAll' });

            // If legacy backend returns empty or action error, try get_user_data for current user
            if (!res || !res.ok || !res.data) {
                const user = window.AuthSystem ? window.AuthSystem.getCurrentUser() : null;
                const pass = String((user && user.password) || '456755').trim();
                const safePass = (pass === 'admin' || pass === 'Admin') ? '456755' : (pass === 'user' ? '0455' : pass);
                const userKey = 'user_' + safePass;

                const legacyRes = await getRequest({
                    action: 'get_user_data',
                    username: safePass === '456755' ? 'admin' : 'user',
                    password: safePass
                });

                if (legacyRes && legacyRes.success) {
                    const legacyUser = {
                        favorites: legacyRes.favorites || (legacyRes.progress && legacyRes.progress.favorites) || [],
                        playlists: legacyRes.playlists || (legacyRes.progress && legacyRes.progress.playlists) || [],
                        progressMetrics: legacyRes.progressMetrics || (legacyRes.progress && legacyRes.progress.progressMetrics) || {},
                        sessionHistory: legacyRes.history || []
                    };
                    return {
                        ok: true,
                        success: true,
                        data: {
                            [userKey]: legacyUser
                        }
                    };
                }
            }

            return res;
        },

        /**
         * Push all Key-Value data to Google Sheets (action: 'setAll')
         * Supports both new Key-Value architecture and legacy sync_user_data fallback
         */
        async pushToSheets(dataObj) {
            let res = await postRequest({
                action: 'setAll',
                data: dataObj
            });

            if (res && res.error && (res.error.includes('action parameter') || res.error.includes('Invalid or missing'))) {
                console.warn('[GoogleSheetsAPI] Backend is running legacy deployment. Pushing user keys individually...');
                const keys = Object.keys(dataObj || {});
                for (const k of keys) {
                    if (k.startsWith('user_')) {
                        res = await this.pushKey(k, dataObj[k]);
                    }
                }
            }

            return res;
        },

        /**
         * Push a single key-value pair to Google Sheets (action: 'setKey')
         * Supports both new Key-Value architecture and legacy sync_user_data fallback
         */
        async pushKey(key, value) {
            let res = await postRequest({
                action: 'setKey',
                key: key,
                value: value
            });

            // If backend returned "Invalid or missing action parameter" (old deployment version active),
            // automatically adapt and send via legacy sync_user_data!
            if (res && res.error && (res.error.includes('action parameter') || res.error.includes('Invalid or missing'))) {
                console.warn('[GoogleSheetsAPI] Backend is running legacy deployment. Falling back to sync_user_data...');
                const pass = key.replace('user_', '');
                res = await postRequest({
                    action: 'sync_user_data',
                    username: pass === '456755' ? 'admin' : 'user',
                    password: pass,
                    favorites: (value && value.favorites) || [],
                    playlists: (value && value.playlists) || [],
                    progressMetrics: (value && value.progressMetrics) || {},
                    history: (value && value.sessionHistory) || []
                });
            }

            return res;
        },

        /**
         * Backward-compatible: getUserData
         */
        async getUserData(userIdentifier) {
            const user = window.AuthSystem ? window.AuthSystem.getCurrentUser() : null;
            const pass = String((user && user.password) || userIdentifier || '456755').trim();
            const safePass = (pass === 'admin' || pass === 'Admin') ? '456755' : (pass === 'user' ? '0455' : pass);
            const userKey = 'user_' + safePass;

            const pullRes = await this.pullFromSheets();
            if (pullRes && (pullRes.ok || pullRes.success) && pullRes.data) {
                const userData = pullRes.data[userKey] || {};
                return {
                    ok: true,
                    success: true,
                    userProfile: { nickname: userData.nickname || 'Admin', password: safePass, level: userData.level || 'Lv.1 Resident' },
                    playlists: userData.playlists || [],
                    favorites: userData.favorites || [],
                    progressMetrics: userData.progressMetrics || {},
                    progress: {
                        playlists: userData.playlists || [],
                        favorites: userData.favorites || [],
                        progressMetrics: userData.progressMetrics || {}
                    },
                    history: userData.sessionHistory || []
                };
            }

            return await postRequest({
                action: 'get_user_data',
                password: safePass,
                username: safePass === '456755' ? 'admin' : 'user'
            });
        },

        /**
         * Backward-compatible: syncUserData
         */
        async syncUserData(userIdentifier, syncData) {
            const user = window.AuthSystem ? window.AuthSystem.getCurrentUser() : null;
            const pass = String((user && user.password) || userIdentifier || '456755').trim();
            const safePass = (pass === 'admin' || pass === 'Admin') ? '456755' : (pass === 'user' ? '0455' : pass);
            const userKey = 'user_' + safePass;

            return await this.pushKey(userKey, {
                username: (user && user.username) || (safePass === '456755' ? 'admin' : 'user'),
                password: safePass,
                nickname: (user && user.nickname) || 'Admin',
                level: syncData.level || 'Lv.1 Resident',
                favorites: syncData.favorites || [],
                playlists: syncData.playlists || [],
                progressMetrics: syncData.progressMetrics || {},
                sessionHistory: syncData.sessionHistory || syncData.history || [],
                lastUpdated: new Date().toISOString()
            });
        },

        /**
         * Backward-compatible: login
         */
        async login(username, password) {
            return await postRequest({
                action: 'login',
                username: username || '',
                password: password
            });
        },

        /**
         * Admin: Get all registered user accounts
         */
        async adminGetUsers(adminUsername, adminPassword) {
            return await postRequest({
                action: 'admin_get_users',
                adminUsername: adminUsername || 'admin',
                adminPassword: adminPassword || '456755'
            });
        },

        /**
         * Admin: Create new user account & trigger dedicated Google Sheet tab creation
         */
        async adminCreateUser(adminUsername, adminPassword, userData) {
            return await postRequest({
                action: 'admin_create_user',
                adminUsername: adminUsername || 'admin',
                adminPassword: adminPassword || '456755',
                userData: userData
            });
        },

        /**
         * Admin: Delete user account and their dedicated Google Sheet tab
         */
        async adminDeleteUser(adminUsername, adminPassword, targetUser) {
            return await postRequest({
                action: 'admin_delete_user',
                adminUsername: adminUsername || 'admin',
                adminPassword: adminPassword || '456755',
                targetUser: targetUser
            });
        }
    };

    window.GoogleSheetsAPI = GoogleSheetsAPI;
})();
