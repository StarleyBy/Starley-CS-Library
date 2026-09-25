/**
 * Google Apps Script Backend for Starley CS Library - Quiz System
 * Local-First Key-Value Architecture with Automatic User Sheet Provisioning
 * 
 * 1. Storage Engine:
 *    Single worksheet tab 'quiz_data' stores Key-Value records:
 *    - 'accounts': JSON array of registered accounts
 *    - 'user_<password>': JSON object of user playlists, favorites, progress & session history
 * 
 * 2. Visual User Pages (Dedicated Tabs):
 *    For every account, Google Apps Script automatically creates and updates a dedicated
 *    formatted tab 'User_<password>' with real-time statistics, rank, and recent test session log!
 * 
 * 3. Security & Concurrency:
 *    Protected with LockService (10s timeout). Supports GET/POST with JSON/JSONP.
 */

const SHEET_NAME = 'quiz_data';

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Starley CS Library')
    .addItem('➕ Добавить пользователя (Создать страницу)', 'menuAddNewUser')
    .addItem('🔄 Обновить все страницы пользователей', 'menuSyncAllUserTabs')
    .addSeparator()
    .addItem('🛠️ Инициализировать базу quiz_data', 'initStorage')
    .addItem('🧹 Очистить устаревшие служебные листы', 'cleanupObsoleteSheets')
    .addToUi();
}

/**
 * Get or automatically create the quiz_data Key-Value worksheet tab
 */
function _getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME, 0);
    sheet.getRange('A1:B1').setValues([['key', 'value_json']]);
    sheet.getRange('A1:B1').setFontWeight('bold').setBackground('#1e293b').setFontColor('#ffffff');
    try {
      sheet.setColumnWidth(1, 180);
      sheet.setColumnWidth(2, 600);
      sheet.setFrozenRows(1);
    } catch (e) {}
    _initDefaultData_(sheet);
  }
  return sheet;
}

/**
 * Initialize default accounts and admin 456755 data if sheet is brand new
 */
function _initDefaultData_(sheet) {
  const defaultAccounts = [
    { username: 'admin', password: '456755', nickname: 'Admin', role: 'admin', status: 'active', createdAt: new Date().toISOString() },
    { username: 'guest', password: '0455', nickname: 'Гость', role: 'user', status: 'active', createdAt: new Date().toISOString() }
  ];

  const defaultPlaylists = [];
  for (let i = 1; i <= 10; i++) {
    defaultPlaylists.push({ id: i, title: String(i), iconId: 1, count: 0, questionIds: [] });
  }

  const defaultUser456755 = {
    username: 'admin',
    password: '456755',
    nickname: 'Admin',
    role: 'admin',
    level: 'Lv.1 Resident Novice',
    currentExp: 0,
    totalExp: 0,
    tierId: 1,
    favorites: [],
    playlists: defaultPlaylists,
    progressMetrics: {
      totalBankQ: 2949,
      totalSessions: 0,
      totalAnsweredQ: 0,
      uniqueSolvedStr: '0 (0%)',
      avgAccuracyStr: '0%',
      avgSessionsFreq: '0/day',
      avgQFreq: '0/day',
      maxSessionQ: 0,
      topicWeeklyProgressJSON: '{}'
    },
    sessionHistory: [],
    lastUpdated: new Date().toISOString()
  };

  const defaultUser0455 = {
    username: 'guest',
    password: '0455',
    nickname: 'Гость',
    role: 'user',
    level: 'Lv.1 Resident Novice',
    currentExp: 0,
    totalExp: 0,
    tierId: 1,
    favorites: [],
    playlists: defaultPlaylists,
    progressMetrics: {
      totalBankQ: 2949,
      totalSessions: 0,
      totalAnsweredQ: 0,
      avgAccuracyStr: '0%'
    },
    sessionHistory: [],
    lastUpdated: new Date().toISOString()
  };

  _writeKey_(sheet, 'accounts', defaultAccounts);
  _writeKey_(sheet, 'user_456755', defaultUser456755);
  _writeKey_(sheet, 'user_0455', defaultUser0455);
}

/**
 * Read all Key-Value rows into a single JavaScript Object
 */
function _readAll_() {
  const sheet = _getSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return {};

  const range = sheet.getRange(2, 1, lastRow - 1, 2);
  const values = range.getValues();
  const result = {};

  for (let i = 0; i < values.length; i++) {
    const key = String(values[i][0] || '').trim();
    if (!key) continue;

    const rawJson = values[i][1];
    if (typeof rawJson === 'string' && rawJson.trim()) {
      try {
        result[key] = JSON.parse(rawJson);
      } catch (err) {
        result[key] = rawJson;
      }
    } else if (rawJson && typeof rawJson === 'object') {
      result[key] = rawJson;
    } else {
      result[key] = null;
    }
  }

  return result;
}

/**
 * Read a single Key from the quiz_data sheet
 */
function _readKey_(key) {
  const data = _readAll_();
  return data[key] !== undefined ? data[key] : null;
}

/**
 * Write a single Key-Value pair to quiz_data sheet
 * Automatically creates/updates dedicated visual user page if key is 'user_*'
 */
function _writeKey_(sheet, key, valueObj) {
  if (!key) return;
  const safeKey = String(key).trim();
  const jsonStr = typeof valueObj === 'string' ? valueObj : JSON.stringify(valueObj);

  const lastRow = sheet.getLastRow();
  let found = false;
  if (lastRow > 1) {
    const keysRange = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (let i = 0; i < keysRange.length; i++) {
      if (String(keysRange[i][0]).trim() === safeKey) {
        sheet.getRange(i + 2, 2).setValue(jsonStr);
        found = true;
        break;
      }
    }
  }

  if (!found) {
    sheet.appendRow([safeKey, jsonStr]);
  }

  // Update or create dedicated human-readable user tab in Google Sheets
  if (safeKey.startsWith('user_')) {
    try {
      const pass = safeKey.replace('user_', '');
      const uObj = typeof valueObj === 'string' ? JSON.parse(valueObj) : valueObj;
      const ss = sheet.getParent();
      _ensureUserSheetTab_(ss, pass, (uObj && uObj.nickname) || 'User', (uObj && uObj.role) || 'user', uObj);
    } catch (tabErr) {
      console.warn('Could not update user sheet tab for ' + safeKey + ':', tabErr);
    }
  }
}

/**
 * Delete a Key-Value pair from quiz_data sheet
 */
function _deleteKey_(sheet, key) {
  if (!key) return;
  const safeKey = String(key).trim();
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return;

  const keysRange = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (let i = 0; i < keysRange.length; i++) {
    if (String(keysRange[i][0]).trim() === safeKey) {
      sheet.deleteRow(i + 2);
      return;
    }
  }
}

/**
 * Write multiple Key-Value pairs in a single operation
 */
function _writeAll_(sheet, dataObj) {
  if (!dataObj || typeof dataObj !== 'object') return;
  const keys = Object.keys(dataObj);
  for (let i = 0; i < keys.length; i++) {
    _writeKey_(sheet, keys[i], dataObj[keys[i]]);
  }
}

/**
 * Create or update a dedicated visual worksheet tab: 'User_<password>'
 */
function _ensureUserSheetTab_(ss, password, nickname, role, userData) {
  const safePass = String(password || '').trim();
  if (!safePass) return null;
  const sheetTitle = 'User_' + safePass;
  
  let sheet = ss.getSheetByName(sheetTitle);
  if (!sheet) {
    sheet = ss.insertSheet(sheetTitle);
    try {
      sheet.setTabColor(role === 'admin' ? '#f59e0b' : '#38bdf8');
    } catch (e) {}
  }

  _renderUserSheetTabContent_(sheet, safePass, nickname, role, userData);
  return sheet;
}

/**
 * Format and populate the dedicated User sheet tab
 */
function _renderUserSheetTabContent_(sheet, safePass, nickname, role, userData) {
  userData = userData || {};
  const pm = userData.progressMetrics || {};
  const sessions = userData.sessionHistory || [];
  const playlists = userData.playlists || [];
  const favorites = userData.favorites || [];

  // Header Banner A1:G1
  sheet.getRange('A1:G1').merge();
  sheet.getRange('A1').setValue('🏥 STARLEY CLINICAL QUIZ — ЛИЧНЫЙ КАБИНЕТ: ' + (nickname || 'Доктор') + ' (PIN: ' + safePass + ')')
    .setFontWeight('bold')
    .setFontSize(12)
    .setBackground('#0f172a')
    .setFontColor('#38bdf8')
    .setHorizontalAlignment('center');

  // Stats Table Header A3:B3
  sheet.getRange('A3:B3').setValues([['Параметр аккаунта', 'Значение']])
    .setFontWeight('bold')
    .setBackground('#1e293b')
    .setFontColor('#ffffff');

  // Parameters
  const paramsData = [
    ['Пароль для входа (PIN)', safePass],
    ['Никнейм / Имя', nickname || userData.nickname || 'Doctor'],
    ['Роль / Доступ', role || userData.role || 'user'],
    ['Текущий ранг и уровень', userData.level || 'Lv.1 Resident Novice'],
    ['Накоплено опыта (Total EXP)', userData.totalExp || 0],
    ['Всего решено вопросов', pm.totalAnsweredQ !== undefined ? pm.totalAnsweredQ : 0],
    ['Средняя точность ответов', pm.avgAccuracyStr || '0%'],
    ['Количество избранных вопросов', favorites.length],
    ['Количество пользовательских плейлистов', playlists.length],
    ['Всего завершенных сессий', sessions.length],
    ['Последняя синхронизация', userData.lastUpdated ? new Date(userData.lastUpdated).toLocaleString() : new Date().toLocaleString()]
  ];

  sheet.getRange(4, 1, paramsData.length, 2).setValues(paramsData);
  sheet.getRange(4, 1, paramsData.length, 1).setFontWeight('bold').setBackground('#f8fafc');

  // Section: Session History
  const historyStartRow = 4 + paramsData.length + 2;
  sheet.getRange(historyStartRow, 1, 1, 7).merge();
  sheet.getRange(historyStartRow, 1).setValue('📜 Журнал сессий тестирования (от новых к старым)')
    .setFontWeight('bold')
    .setFontSize(11)
    .setBackground('#0f172a')
    .setFontColor('#4ade80')
    .setHorizontalAlignment('center');

  // History table headers
  const historyHeadersRow = historyStartRow + 1;
  const historyHeaders = [['Дата и время', 'Режим / Тема', 'Вопросов', 'Правильно', 'Ошибок', 'Точность', 'Получено EXP']];
  sheet.getRange(historyHeadersRow, 1, 1, 7).setValues(historyHeaders)
    .setFontWeight('bold')
    .setBackground('#1e293b')
    .setFontColor('#ffffff')
    .setHorizontalAlignment('center');

  // Clear previous session rows if any
  const maxRows = sheet.getMaxRows();
  if (maxRows > historyHeadersRow) {
    sheet.getRange(historyHeadersRow + 1, 1, maxRows - historyHeadersRow, 7).clearContent().setBackground(null);
  }

  // Populate sessions
  if (sessions && sessions.length > 0) {
    const sessionRows = [];
    const limit = Math.min(sessions.length, 50);
    for (let i = 0; i < limit; i++) {
      const s = sessions[i];
      const dt = s.date || s.timestamp ? new Date(s.date || s.timestamp).toLocaleString() : '-';
      const mode = s.mode || s.categoryTitle || 'Тестирование';
      const totalQ = s.totalQuestions || s.total || 0;
      const correct = s.score !== undefined ? s.score : (s.correct || 0);
      const wrong = s.incorrect !== undefined ? s.incorrect : (totalQ - correct);
      const acc = s.percentage !== undefined ? (s.percentage + '%') : (totalQ > 0 ? Math.round((correct / totalQ) * 100) + '%' : '0%');
      const exp = s.expEarned || s.exp || 0;

      sessionRows.push([dt, mode, totalQ, correct, wrong, acc, exp]);
    }

    if (sessionRows.length > 0) {
      sheet.getRange(historyHeadersRow + 1, 1, sessionRows.length, 7).setValues(sessionRows)
        .setHorizontalAlignment('center');
      sheet.getRange(historyHeadersRow + 1, 2, sessionRows.length, 1).setHorizontalAlignment('left');
    }
  }

  // Adjust column widths
  try {
    sheet.setColumnWidth(1, 160);
    sheet.setColumnWidth(2, 220);
    sheet.setColumnWidth(3, 90);
    sheet.setColumnWidth(4, 90);
    sheet.setColumnWidth(5, 90);
    sheet.setColumnWidth(6, 100);
    sheet.setColumnWidth(7, 110);
  } catch (e) {}
}

/**
 * HTTP GET Handler (pull / test)
 */
function doGet(e) {
  try {
    const sheet = _getSheet_();
    const params = (e && e.parameter) || {};
    const action = params.action || 'getAll';
    const callback = params.callback;

    let responseData = { ok: true };

    if (action === 'ping' || action === 'test') {
      responseData = {
        ok: true,
        success: true,
        message: 'Starley CS Library API operational',
        architecture: 'Local-First Key-Value with Dedicated User Tabs',
        time: new Date().toISOString()
      };
    } else if (action === 'getKey') {
      const key = String(params.key || '').trim();
      responseData = {
        ok: true,
        key: key,
        data: _readKey_(key)
      };
    } else {
      // Default: read all data
      responseData = {
        ok: true,
        success: true,
        data: _readAll_()
      };
    }

    return createOutput(responseData, callback);

  } catch (error) {
    const callback = e && e.parameter && e.parameter.callback;
    return createOutput({ ok: false, success: false, error: error.toString() }, callback);
  }
}

/**
 * HTTP POST Handler (push / mutations / admin user lifecycle)
 * Protected by LockService (10 seconds timeout)
 */
function doPost(e) {
  let callback = null;

  try {
    let params = {};
    if (e && e.postData && e.postData.contents) {
      try {
        params = JSON.parse(e.postData.contents);
      } catch (err) {
        params = (e && e.parameter) || {};
      }
    } else if (e && e.parameter) {
      params = e.parameter || {};
    }

    if (params && params.payload) {
      try {
        const pObj = typeof params.payload === 'string' ? JSON.parse(params.payload) : params.payload;
        if (pObj && typeof pObj === 'object') {
          params = Object.assign({}, pObj, params);
        }
      } catch (pErr) {}
    }

    callback = params.callback || (e && e.parameter && e.parameter.callback);
    const action = params.action || 'setAll';

    // Concurrency lock to prevent race conditions
    const lock = LockService.getScriptLock();
    const hasLock = lock.waitLock(10000);
    if (!hasLock) {
      return createOutput({ ok: false, success: false, error: 'Could not obtain lock (concurrency timeout 10s)' }, callback);
    }

    try {
      const sheet = _getSheet_();
      let responseData = { ok: true, success: true };

      if (action === 'ping' || action === 'test') {
        responseData = {
          ok: true,
          success: true,
          message: 'Starley CS Library API operational',
          time: new Date().toISOString()
        };
      } else if (action === 'setAll') {
        const payloadData = params.data || {};
        _writeAll_(sheet, payloadData);
        responseData = {
          ok: true,
          success: true,
          message: 'All keys updated successfully',
          keys: Object.keys(payloadData),
          timestamp: new Date().toISOString()
        };
      } else if (action === 'setKey') {
        const key = String(params.key || '').trim();
        _writeKey_(sheet, key, params.value);
        responseData = {
          ok: true,
          success: true,
          message: `Key '${key}' updated successfully`,
          key: key,
          timestamp: new Date().toISOString()
        };
      } else if (action === 'sync_user_data' || action === 'set_user_data') {
        const rawPass = String(params.password || params.username || '456755').trim();
        const safePass = (rawPass === 'admin' || rawPass === 'Admin') ? '456755' : (rawPass === 'user' ? '0455' : rawPass);
        const userKey = 'user_' + safePass;

        const existingUserData = _readKey_(userKey) || {};
        const updatedUserData = {
          username: params.username || existingUserData.username || 'user_' + safePass,
          password: safePass,
          nickname: params.nickname || existingUserData.nickname || 'Doctor',
          role: params.role || existingUserData.role || (safePass === '456755' ? 'admin' : 'user'),
          level: params.level || existingUserData.level || 'Lv.1 Resident Novice',
          currentExp: params.currentExp !== undefined ? params.currentExp : (existingUserData.currentExp || 0),
          totalExp: params.totalExp !== undefined ? params.totalExp : (existingUserData.totalExp || 0),
          tierId: params.tierId !== undefined ? params.tierId : (existingUserData.tierId || 1),
          favorites: params.favorites !== undefined ? params.favorites : (existingUserData.favorites || []),
          playlists: params.playlists !== undefined ? params.playlists : (existingUserData.playlists || []),
          progressMetrics: params.progressMetrics !== undefined ? params.progressMetrics : (existingUserData.progressMetrics || {}),
          sessionHistory: existingUserData.sessionHistory || [],
          lastUpdated: new Date().toISOString()
        };

        if (params.newSession && typeof params.newSession === 'object') {
          updatedUserData.sessionHistory.unshift(params.newSession);
          if (updatedUserData.sessionHistory.length > 100) {
            updatedUserData.sessionHistory = updatedUserData.sessionHistory.slice(0, 100);
          }
        }

        _writeKey_(sheet, userKey, updatedUserData);
        responseData = {
          ok: true,
          success: true,
          message: 'User data synchronized successfully.',
          key: userKey,
          timestamp: updatedUserData.lastUpdated
        };
      } else if (action === 'get_user_data') {
        const rawPass = String(params.password || params.username || '456755').trim();
        const safePass = (rawPass === 'admin' || rawPass === 'Admin') ? '456755' : (rawPass === 'user' ? '0455' : rawPass);
        const userKey = 'user_' + safePass;
        const userData = _readKey_(userKey) || {};

        responseData = {
          ok: true,
          success: true,
          userProfile: {
            nickname: userData.nickname || 'Doctor',
            password: safePass,
            role: userData.role || (safePass === '456755' ? 'admin' : 'user'),
            level: userData.level || 'Lv.1 Resident Novice',
            totalExp: userData.totalExp || 0,
            currentExp: userData.currentExp || 0,
            tierId: userData.tierId || 1
          },
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
      } else if (action === 'login') {
        const pass = String(params.password || '').trim();
        const accounts = _readKey_('accounts') || [];
        let matched = accounts.find(a => String(a.password).trim() === pass);
        if (!matched && (pass === '456755' || pass === '0455')) {
          matched = {
            password: pass,
            nickname: pass === '456755' ? 'Admin' : 'Гость',
            role: pass === '456755' ? 'admin' : 'user'
          };
        }

        if (matched) {
          responseData = {
            ok: true,
            success: true,
            user: {
              username: matched.username || (matched.role === 'admin' ? 'admin' : 'user_' + matched.password),
              password: matched.password,
              nickname: matched.nickname,
              role: matched.role
            }
          };
        } else {
          responseData = { ok: false, success: false, error: 'Incorrect password.' };
        }
      } else if (action === 'admin_get_users' || action === 'get_users') {
        const adminPass = String(params.adminPassword || params.password || '').trim();
        if (adminPass !== '456755') {
          return createOutput({ ok: false, success: false, error: 'Unauthorized: Admin password required' }, callback);
        }
        const accounts = _readKey_('accounts') || [];
        responseData = {
          ok: true,
          success: true,
          users: accounts
        };
      } else if (action === 'admin_create_user' || action === 'create_user') {
        const adminPass = String(params.adminPassword || params.password || '').trim();
        if (adminPass !== '456755') {
          return createOutput({ ok: false, success: false, error: 'Unauthorized: Admin password required' }, callback);
        }

        const uData = params.userData || params;
        const newPass = String(uData.password || '').trim();
        const newNick = String(uData.nickname || uData.username || 'User').trim();
        const newRole = (uData.role === 'admin') ? 'admin' : 'user';
        const newUsername = String(uData.username || ('user_' + newPass)).trim();
        const newEmail = String(uData.email || '').trim();

        if (!newPass) {
          return createOutput({ ok: false, success: false, error: 'Пароль (PIN) обязателен' }, callback);
        }

        const accounts = _readKey_('accounts') || [];
        if (accounts.some(a => String(a.password).trim() === newPass)) {
          return createOutput({ ok: false, success: false, error: `Пользователь с паролем '${newPass}' уже существует` }, callback);
        }

        const newAccount = {
          username: newUsername,
          password: newPass,
          nickname: newNick,
          role: newRole,
          email: newEmail,
          status: 'active',
          createdAt: new Date().toISOString()
        };

        accounts.push(newAccount);
        _writeKey_(sheet, 'accounts', accounts);

        // Default playlists 1..10
        const defaultPlaylists = [];
        for (let i = 1; i <= 10; i++) {
          defaultPlaylists.push({ id: i, title: String(i), iconId: 1, count: 0, questionIds: [] });
        }

        const defaultUserData = {
          username: newUsername,
          password: newPass,
          nickname: newNick,
          role: newRole,
          level: 'Lv.1 Resident Novice',
          currentExp: 0,
          totalExp: 0,
          tierId: 1,
          favorites: [],
          playlists: defaultPlaylists,
          progressMetrics: {
            totalBankQ: 2949,
            totalSessions: 0,
            totalAnsweredQ: 0,
            uniqueSolvedStr: '0 (0%)',
            avgAccuracyStr: '0%',
            avgSessionsFreq: '0/day',
            avgQFreq: '0/day',
            maxSessionQ: 0,
            topicWeeklyProgressJSON: '{}'
          },
          sessionHistory: [],
          lastUpdated: new Date().toISOString()
        };

        const userKey = 'user_' + newPass;
        _writeKey_(sheet, userKey, defaultUserData);

        // Create dedicated sheet tab in spreadsheet
        const ss = sheet.getParent();
        _ensureUserSheetTab_(ss, newPass, newNick, newRole, defaultUserData);

        responseData = {
          ok: true,
          success: true,
          message: `Аккаунт '${newNick}' успешно создан! Создана персональная страница 'User_${newPass}' в Google Таблице.`,
          user: newAccount
        };
      } else if (action === 'admin_delete_user' || action === 'delete_user') {
        const adminPass = String(params.adminPassword || params.password || '').trim();
        if (adminPass !== '456755') {
          return createOutput({ ok: false, success: false, error: 'Unauthorized: Admin password required' }, callback);
        }

        const target = String(params.targetUser || params.username || params.targetPassword || '').trim();
        if (target === '456755' || target === 'admin') {
          return createOutput({ ok: false, success: false, error: 'Нельзя удалить главного администратора' }, callback);
        }

        let accounts = _readKey_('accounts') || [];
        const found = accounts.find(a => String(a.password).trim() === target || String(a.username).trim() === target);
        const targetPass = found ? String(found.password).trim() : target;

        accounts = accounts.filter(a => String(a.password).trim() !== targetPass && String(a.username).trim() !== target);
        _writeKey_(sheet, 'accounts', accounts);

        // Delete user key from quiz_data
        _deleteKey_(sheet, 'user_' + targetPass);

        // Delete dedicated tab if exists
        const ss = sheet.getParent();
        const userTab = ss.getSheetByName('User_' + targetPass);
        if (userTab && ss.getSheets().length > 1) {
          try {
            ss.deleteSheet(userTab);
          } catch (e) {}
        }

        responseData = {
          ok: true,
          success: true,
          message: `Пользователь '${target}' и страница 'User_${targetPass}' удалены.`
        };
      } else {
        responseData = { ok: false, success: false, error: 'Unknown action parameter: ' + action };
      }

      return createOutput(responseData, callback);

    } finally {
      lock.releaseLock();
    }

  } catch (error) {
    return createOutput({ ok: false, success: false, error: error.toString() }, callback);
  }
}

/**
 * Format JSON or JSONP HTTP Output
 */
function createOutput(dataObj, callback) {
  const jsonStr = JSON.stringify(dataObj);
  if (callback) {
    return ContentService.createTextOutput(callback + '(' + jsonStr + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(jsonStr)
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Manual Initializer for Google Sheets UI Menu
 */
function initStorage() {
  const sheet = _getSheet_();
  menuSyncAllUserTabs();
  SpreadsheetApp.getActiveSpreadsheet().toast('Хранилище quiz_data и листы пользователей готовы к работе!', 'Starley CS Library', 4);
}

/**
 * Custom UI Dialog to add user directly from Google Sheets
 */
function menuAddNewUser() {
  const ui = SpreadsheetApp.getUi();
  const passResp = ui.prompt('➕ Добавить пользователя', 'Введите пароль / PIN (например: 778899):', ui.ButtonSet.OK_CANCEL);
  if (passResp.getSelectedButton() !== ui.Button.OK) return;
  const pass = passResp.getResponseText().trim();
  if (!pass) {
    ui.alert('Ошибка: Пароль не может быть пустым.');
    return;
  }

  const nickResp = ui.prompt('➕ Добавить пользователя', 'Введите имя / никнейм врача (например: Д-р Иванов):', ui.ButtonSet.OK_CANCEL);
  if (nickResp.getSelectedButton() !== ui.Button.OK) return;
  const nick = nickResp.getResponseText().trim() || ('User ' + pass);

  const roleResp = ui.alert('Права доступа', 'Назначить права администратора? (Да = admin, Нет = user)', ui.ButtonSet.YES_NO);
  const role = (roleResp === ui.Button.YES) ? 'admin' : 'user';

  const sheet = _getSheet_();
  const accounts = _readKey_('accounts') || [];
  if (accounts.some(a => String(a.password).trim() === pass)) {
    ui.alert('Ошибка: Пользователь с таким паролем уже существует.');
    return;
  }

  const newAccount = {
    username: 'user_' + pass,
    password: pass,
    nickname: nick,
    role: role,
    status: 'active',
    createdAt: new Date().toISOString()
  };
  accounts.push(newAccount);
  _writeKey_(sheet, 'accounts', accounts);

  const defaultPlaylists = [];
  for (let i = 1; i <= 10; i++) {
    defaultPlaylists.push({ id: i, title: String(i), iconId: 1, count: 0, questionIds: [] });
  }

  const defaultUserData = {
    username: 'user_' + pass,
    password: pass,
    nickname: nick,
    role: role,
    level: 'Lv.1 Resident Novice',
    currentExp: 0,
    totalExp: 0,
    tierId: 1,
    favorites: [],
    playlists: defaultPlaylists,
    progressMetrics: { totalBankQ: 2949, totalSessions: 0, totalAnsweredQ: 0, avgAccuracyStr: '0%' },
    sessionHistory: [],
    lastUpdated: new Date().toISOString()
  };

  _writeKey_(sheet, 'user_' + pass, defaultUserData);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  _ensureUserSheetTab_(ss, pass, nick, role, defaultUserData);

  ui.alert(`✅ Пользователь '${nick}' добавлен!\nСоздана персональная страница 'User_${pass}'.\nПользователь может сразу войти в квиз под PIN: ${pass}`);
}

/**
 * Regenerate / synchronize all dedicated User_* tabs from quiz_data
 */
function menuSyncAllUserTabs() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const allData = _readAll_();
  const accounts = allData.accounts || [];
  let count = 0;

  for (let i = 0; i < accounts.length; i++) {
    const acc = accounts[i];
    const pass = String(acc.password).trim();
    if (!pass) continue;
    const uData = allData['user_' + pass] || { nickname: acc.nickname, role: acc.role };
    _ensureUserSheetTab_(ss, pass, acc.nickname, acc.role, uData);
    count++;
  }

  ss.toast(`Синхронизировано страниц пользователей: ${count}`, 'Starley CS Library', 4);
}

/**
 * Clean up obsolete legacy multi-sheet tabs (preserves active User_* tabs)
 */
function cleanupObsoleteSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const obsolete = ['User_Progress', 'Session_History', 'Telegram_Requests', 'Accounts'];
  let deletedCount = 0;

  obsolete.forEach(name => {
    const s = ss.getSheetByName(name);
    if (s && ss.getSheets().length > 1) {
      try {
        ss.deleteSheet(s);
        deletedCount++;
      } catch (e) {}
    }
  });

  _getSheet_();
  SpreadsheetApp.getActiveSpreadsheet().toast(`Удалено устаревших листов: ${deletedCount}. Лист quiz_data и листы пользователей активны!`, 'Starley CS Library', 5);
}
