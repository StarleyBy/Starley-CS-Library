/**
 * Google Apps Script Backend for Starley CS Library - Quiz System
 * Handles Auth, Data Sync, User Management, Telegram Bot Webhook, and Automated Email Dispatch.
 * 
 * Deployment Instructions:
 * 1. Open your Google Sheet.
 * 2. Go to Extensions -> Apps Script.
 * 3. Replace any existing code with this script.
 * 4. Update TELEGRAM_BOT_TOKEN below if using Telegram Bot.
 * 5. Click "Deploy" -> "New Deployment" -> Select type: "Web app".
 * 6. Set "Execute as": "Me".
 * 7. Set "Who has access": "Anyone".
 * 8. Click "Deploy" and copy the Web App URL into assets/js/config.js.
 */

const TELEGRAM_BOT_TOKEN = '8776764036:AAEjdwQQjmB2zxuF4ILgBDVcJgwdu0FdQ5c';

/**
 * Handle HTTP GET Requests
 */
function doGet(e) {
  return handleRequest(e);
}

/**
 * Handle HTTP POST Requests
 */
function doPost(e) {
  return handleRequest(e);
}

/**
 * Request Router
 */
function handleRequest(e) {
  try {
    ensureSheetsInitialized();

    let params = {};
    if (e.postData && e.postData.contents) {
      try {
        params = JSON.parse(e.postData.contents);
      } catch (err) {
        params = e.parameter || {};
      }
    } else if (e.parameter) {
      params = e.parameter;
    }

    const action = params.action || '';

    // Handle Telegram Webhook update if sent directly by Telegram
    if (params.update_id || params.message) {
      return handleTelegramWebhook(params);
    }

    let responseData = { success: false, error: 'Unknown action' };

    switch (action) {
      case 'ping':
        responseData = { success: true, message: 'Starley CS Library API operational' };
        break;

      case 'login':
        responseData = handleLogin(params);
        break;

      case 'get_user_data':
        responseData = handleGetUserData(params);
        break;

      case 'sync_user_data':
        responseData = handleSyncUserData(params);
        break;

      case 'telegram_register':
        responseData = handleTelegramRegister(params);
        break;

      case 'admin_get_requests':
        responseData = handleAdminGetRequests(params);
        break;

      case 'admin_process_request':
        responseData = handleAdminProcessRequest(params);
        break;

      case 'admin_get_users':
        responseData = handleAdminGetUsers(params);
        break;

      case 'admin_create_user':
        responseData = handleAdminCreateUser(params);
        break;

      case 'admin_update_user':
        responseData = handleAdminUpdateUser(params);
        break;

      case 'admin_delete_user':
        responseData = handleAdminDeleteUser(params);
        break;

      default:
        responseData = { success: false, error: 'Invalid or missing action parameter' };
        break;
    }

    return ContentService.createTextOutput(JSON.stringify(responseData))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Auto-initialize Sheets if they do not exist
 */
function ensureSheetsInitialized() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const sheets = [
    { name: 'Accounts', headers: ['Username', 'Password', 'Role', 'Nickname', 'Avatar', 'Email', 'TelegramID', 'Status', 'CreatedAt', 'LastLogin'] },
    { name: 'User_Progress', headers: ['Username', 'StreakDays', 'SolvedCount', 'AccuracyPct', 'MasteryJSON', 'FavoritesJSON', 'PlaylistsJSON', 'LastSynced'] },
    { name: 'Session_History', headers: ['SessionID', 'Username', 'Date', 'SetTitle', 'Mode', 'Lang', 'CountMode', 'TopicsJSON', 'TotalQ', 'CorrectQ', 'ScorePct', 'TimeSpentSec', 'ErrorsJSON'] },
    { name: 'Telegram_Requests', headers: ['RequestID', 'TelegramID', 'TelegramUsername', 'RequestedNickname', 'RequestedPassword', 'Email', 'Status', 'RequestedAt'] }
  ];

  sheets.forEach(sheetDef => {
    let sheet = ss.getSheetByName(sheetDef.name);
    if (!sheet) {
      sheet = ss.insertSheet(sheetDef.name);
      sheet.appendRow(sheetDef.headers);
      sheet.getRange(1, 1, 1, sheetDef.headers.length).setFontWeight('bold').setBackground('#1f2937').setFontColor('#ffffff');
    } else if (sheetDef.name === 'Session_History') {
      // Migrate older header if it has only 10 columns
      const headersRange = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1));
      const currentHeaders = headersRange.getValues()[0];
      if (currentHeaders.length < sheetDef.headers.length) {
        sheet.getRange(1, 1, 1, sheetDef.headers.length).setValues([sheetDef.headers]).setFontWeight('bold').setBackground('#1f2937').setFontColor('#ffffff');
      }
    }
  });

  // Check default admin account
  const accountsSheet = ss.getSheetByName('Accounts');
  if (accountsSheet.getLastRow() <= 1) {
    accountsSheet.appendRow(['admin', '456755', 'admin', 'Administrator', 'doc', 'admin@starley-cs.org', '', 'active', new Date().toISOString(), '']);
  }
}

/**
 * Handle Login
 */
function handleLogin(params) {
  const username = String(params.username || '').trim().toLowerCase();
  const password = String(params.password || '').trim();

  if (!username || !password) {
    return { success: false, error: 'Username and password are required.' };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Accounts');
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    const rowUser = String(data[i][0]).trim().toLowerCase();
    const rowPass = String(data[i][1]).trim();
    const role = data[i][2];
    const nickname = data[i][3];
    const avatar = data[i][4];
    const email = data[i][5];
    const telegramId = data[i][6];
    const status = data[i][7];

    if (rowUser === username && rowPass === password) {
      if (status === 'disabled') {
        return { success: false, error: 'This account has been disabled by an administrator.' };
      }

      // Update LastLogin timestamp
      sheet.getRange(i + 1, 10).setValue(new Date().toISOString());

      return {
        success: true,
        user: {
          username: rowUser,
          role: role,
          nickname: nickname || rowUser,
          avatar: avatar || 'doc',
          email: email || '',
          telegramId: telegramId || ''
        }
      };
    }
  }

  return { success: false, error: 'Invalid username or password.' };
}

/**
 * Handle Get User Data
 */
function handleGetUserData(params) {
  const username = String(params.username || '').trim().toLowerCase();
  if (!username) return { success: false, error: 'Username is required.' };

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const progressSheet = ss.getSheetByName('User_Progress');
  const historySheet = ss.getSheetByName('Session_History');

  let userProgress = {
    streakDays: 1,
    solvedCount: 0,
    accuracyPct: 0,
    mastery: {},
    favorites: [],
    playlists: []
  };

  const progData = progressSheet.getDataRange().getValues();
  for (let i = 1; i < progData.length; i++) {
    if (String(progData[i][0]).trim().toLowerCase() === username) {
      userProgress.streakDays = Number(progData[i][1]) || 1;
      userProgress.solvedCount = Number(progData[i][2]) || 0;
      userProgress.accuracyPct = Number(progData[i][3]) || 0;
      userProgress.mastery = safeParseJSON(progData[i][4], {});
      userProgress.favorites = safeParseJSON(progData[i][5], []);
      userProgress.playlists = safeParseJSON(progData[i][6], []);
      break;
    }
  }

  // Retrieve user's session history (last 50 sessions)
  const historyData = historySheet.getDataRange().getValues();
  const userHistory = [];

  for (let i = historyData.length - 1; i >= 1; i--) {
    const row = historyData[i];
    if (String(row[1]).trim().toLowerCase() === username) {
      let sessObj = {};
      if (row.length >= 13) {
        sessObj = {
          sessionId: row[0],
          date: row[2],
          setTitle: row[3],
          mode: row[4],
          lang: row[5] || 'En',
          countMode: String(row[6] || '10'),
          topics: safeParseJSON(row[7], []),
          totalQ: Number(row[8]),
          correctQ: Number(row[9]),
          scorePct: Number(row[10]),
          timeSpentSec: Number(row[11]),
          errors: safeParseJSON(row[12], [])
        };
      } else {
        // Legacy 10-column schema fallback
        sessObj = {
          sessionId: row[0],
          date: row[2],
          setTitle: row[3],
          mode: row[4],
          lang: 'En',
          countMode: String(row[5] || '10'),
          topics: [row[3] || 'General'],
          totalQ: Number(row[5]),
          correctQ: Number(row[6]),
          scorePct: Number(row[7]),
          timeSpentSec: Number(row[8]),
          errors: safeParseJSON(row[9], [])
        };
      }
      userHistory.push(sessObj);
      if (userHistory.length >= 50) break;
    }
  }

  return {
    success: true,
    progress: userProgress,
    history: userHistory
  };
}

/**
 * Handle Sync User Data
 */
function handleSyncUserData(params) {
  const username = String(params.username || '').trim().toLowerCase();
  if (!username) return { success: false, error: 'Username is required.' };

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const progressSheet = ss.getSheetByName('User_Progress');
  const progData = progressSheet.getDataRange().getValues();

  const streakDays = Number(params.streakDays) || 1;
  const solvedCount = Number(params.solvedCount) || 0;
  const accuracyPct = Number(params.accuracyPct) || 0;
  const masteryJSON = JSON.stringify(params.mastery || {});
  const favoritesJSON = JSON.stringify(params.favorites || []);
  const playlistsJSON = JSON.stringify(params.playlists || []);
  const nowStr = new Date().toISOString();

  let foundRow = -1;
  for (let i = 1; i < progData.length; i++) {
    if (String(progData[i][0]).trim().toLowerCase() === username) {
      foundRow = i + 1;
      break;
    }
  }

  if (foundRow > 0) {
    progressSheet.getRange(foundRow, 2, 1, 7).setValues([[
      streakDays, solvedCount, accuracyPct, masteryJSON, favoritesJSON, playlistsJSON, nowStr
    ]]);
  } else {
    progressSheet.appendRow([
      username, streakDays, solvedCount, accuracyPct, masteryJSON, favoritesJSON, playlistsJSON, nowStr
    ]);
  }

  // Record session history if provided
  if (params.newSession) {
    const s = params.newSession;
    const historySheet = ss.getSheetByName('Session_History');
    historySheet.appendRow([
      s.sessionId || ('sess_' + Date.now()),
      username,
      s.date || nowStr,
      s.setTitle || 'Quiz Session',
      s.mode || 'smart',
      s.lang || 'En',
      String(s.countMode || '10'),
      JSON.stringify(s.topics || []),
      Number(s.totalQ) || 0,
      Number(s.correctQ) || 0,
      Number(s.scorePct) || 0,
      Number(s.timeSpentSec) || 0,
      JSON.stringify(s.errors || [])
    ]);
  }

  return { success: true, message: 'User progress synchronized successfully.' };
}

/**
 * Notify Administrator Telegram Chat when a new registration request is logged
 */
function notifyAdminNewRequest(reqId, nickname, password, email, telegramUsername, telegramId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const accountsSheet = ss.getSheetByName('Accounts');
    const accData = accountsSheet.getDataRange().getValues();
    let adminTgId = '954588841'; // Primary Admin Chat ID

    for (let i = 1; i < accData.length; i++) {
      if (accData[i][2] === 'admin' && accData[i][6]) {
        adminTgId = String(accData[i][6]).trim();
        break;
      }
    }

    if (adminTgId && TELEGRAM_BOT_TOKEN && TELEGRAM_BOT_TOKEN !== 'YOUR_TELEGRAM_BOT_TOKEN') {
      const msg = `📬 *New Quiz Account Request!*\n\n` +
        `👤 *Nickname:* \`${nickname}\`\n` +
        `🔑 *Password:* \`${password}\`\n` +
        `📧 *Email:* ${email || 'N/A'}\n` +
        `✈️ *Telegram:* @${telegramUsername || 'N/A'} (ID: ${telegramId || 'N/A'})\n\n` +
        `Approve/Reject via Admin Panel in Quiz Mode or Google Sheets!`;
      sendTelegramMessage(adminTgId, msg);
    }
  } catch (e) {
    Logger.log('Notify admin error: ' + e.toString());
  }
}

/**
 * Handle Telegram Register Request (from bot or API)
 */
function handleTelegramRegister(params) {
  const telegramId = String(params.telegramId || '').trim();
  const telegramUsername = String(params.telegramUsername || '').trim();
  const nickname = String(params.nickname || '').trim();
  const password = String(params.password || '').trim();
  const email = String(params.email || '').trim();

  if (!nickname || !password) {
    return { success: false, error: 'Nickname and password are required for registration.' };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const reqSheet = ss.getSheetByName('Telegram_Requests');
  const reqId = 'req_' + Date.now();
  const nowStr = new Date().toISOString();

  reqSheet.appendRow([
    reqId, telegramId, telegramUsername, nickname, password, email, 'pending', nowStr
  ]);

  // Dispatch alert to Admin Telegram Chat
  notifyAdminNewRequest(reqId, nickname, password, email, telegramUsername, telegramId);

  return {
    success: true,
    requestId: reqId,
    message: 'Your registration request has been submitted to administrators. You will be notified upon approval.'
  };
}

/**
 * Admin: Get Pending Registration Requests
 */
function handleAdminGetRequests(params) {
  if (!verifyAdmin(params.adminUser, params.adminPass)) {
    return { success: false, error: 'Unauthorized admin access.' };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const reqSheet = ss.getSheetByName('Telegram_Requests');
  const data = reqSheet.getDataRange().getValues();

  const requests = [];
  for (let i = data.length - 1; i >= 1; i--) {
    requests.push({
      requestId: data[i][0],
      telegramId: data[i][1],
      telegramUsername: data[i][2],
      nickname: data[i][3],
      password: data[i][4],
      email: data[i][5],
      status: data[i][6],
      requestedAt: data[i][7]
    });
  }

  return { success: true, requests: requests };
}

/**
 * Admin: Approve or Reject Registration Request
 */
function handleAdminProcessRequest(params) {
  if (!verifyAdmin(params.adminUser, params.adminPass)) {
    return { success: false, error: 'Unauthorized admin access.' };
  }

  const requestId = String(params.requestId || '').trim();
  const decision = String(params.decision || '').trim().toLowerCase(); // 'approve' or 'reject'

  if (!requestId || (decision !== 'approve' && decision !== 'reject')) {
    return { success: false, error: 'Valid requestId and decision (approve/reject) are required.' };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const reqSheet = ss.getSheetByName('Telegram_Requests');
  const reqData = reqSheet.getDataRange().getValues();

  let reqRow = -1;
  let reqObj = null;

  for (let i = 1; i < reqData.length; i++) {
    if (String(reqData[i][0]).trim() === requestId) {
      reqRow = i + 1;
      reqObj = {
        requestId: reqData[i][0],
        telegramId: reqData[i][1],
        telegramUsername: reqData[i][2],
        nickname: reqData[i][3],
        password: reqData[i][4],
        email: reqData[i][5]
      };
      break;
    }
  }

  if (reqRow < 0 || !reqObj) {
    return { success: false, error: 'Request ID not found.' };
  }

  if (decision === 'approve') {
    reqSheet.getRange(reqRow, 7).setValue('approved');

    // Create user in Accounts sheet
    const username = sanitizeUsername(reqObj.nickname);
    const accountsSheet = ss.getSheetByName('Accounts');

    // Check if user already exists
    let existingRow = -1;
    const accData = accountsSheet.getDataRange().getValues();
    for (let i = 1; i < accData.length; i++) {
      if (String(accData[i][0]).trim().toLowerCase() === username.toLowerCase()) {
        existingRow = i + 1;
        break;
      }
    }

    if (existingRow < 0) {
      accountsSheet.appendRow([
        username, reqObj.password, 'user', reqObj.nickname, 'doc', reqObj.email, reqObj.telegramId, 'active', new Date().toISOString(), ''
      ]);
    } else {
      accountsSheet.getRange(existingRow, 2).setValue(reqObj.password);
      accountsSheet.getRange(existingRow, 8).setValue('active');
    }

    // Send Automated Notifications (Telegram + Email)
    sendApprovalNotifications(reqObj, username);

    return {
      success: true,
      message: `Account '${username}' approved successfully. Notifications dispatched via Telegram and Email.`
    };
  } else {
    reqSheet.getRange(reqRow, 7).setValue('rejected');
    sendRejectionNotifications(reqObj);
    return { success: true, message: 'Registration request rejected.' };
  }
}

/**
 * Admin: Get All Users
 */
function handleAdminGetUsers(params) {
  if (!verifyAdmin(params.adminUser, params.adminPass)) {
    return { success: false, error: 'Unauthorized admin access.' };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const accountsSheet = ss.getSheetByName('Accounts');
  const data = accountsSheet.getDataRange().getValues();

  const users = [];
  for (let i = 1; i < data.length; i++) {
    users.push({
      username: data[i][0],
      password: data[i][1],
      role: data[i][2],
      nickname: data[i][3],
      avatar: data[i][4],
      email: data[i][5],
      telegramId: data[i][6],
      status: data[i][7],
      createdAt: data[i][8],
      lastLogin: data[i][9]
    });
  }

  return { success: true, users: users };
}

/**
 * Admin: Create User Manually
 */
function handleAdminCreateUser(params) {
  if (!verifyAdmin(params.adminUser, params.adminPass)) {
    return { success: false, error: 'Unauthorized admin access.' };
  }

  const username = sanitizeUsername(params.username || params.nickname || '');
  const password = String(params.password || '').trim();
  const role = String(params.role || 'user').trim().toLowerCase();
  const nickname = String(params.nickname || username).trim();
  const email = String(params.email || '').trim();
  const telegramId = String(params.telegramId || '').trim();

  if (!username || !password) {
    return { success: false, error: 'Username and password are required.' };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const accountsSheet = ss.getSheetByName('Accounts');
  const accData = accountsSheet.getDataRange().getValues();

  for (let i = 1; i < accData.length; i++) {
    if (String(accData[i][0]).trim().toLowerCase() === username.toLowerCase()) {
      return { success: false, error: `Account '${username}' already exists.` };
    }
  }

  accountsSheet.appendRow([
    username, password, role, nickname, 'doc', email, telegramId, 'active', new Date().toISOString(), ''
  ]);

  // Send Email / Telegram notification if email or Telegram ID provided
  if (email || telegramId) {
    sendApprovalNotifications({
      nickname: nickname,
      password: password,
      email: email,
      telegramId: telegramId
    }, username);
  }

  return { success: true, message: `Account '${username}' created successfully.` };
}

/**
 * Admin: Update User
 */
function handleAdminUpdateUser(params) {
  if (!verifyAdmin(params.adminUser, params.adminPass)) {
    return { success: false, error: 'Unauthorized admin access.' };
  }

  const username = String(params.targetUser || '').trim().toLowerCase();
  if (!username) return { success: false, error: 'Target username is required.' };

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const accountsSheet = ss.getSheetByName('Accounts');
  const data = accountsSheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toLowerCase() === username) {
      if (params.newPassword) accountsSheet.getRange(i + 1, 2).setValue(String(params.newPassword).trim());
      if (params.newRole) accountsSheet.getRange(i + 1, 3).setValue(String(params.newRole).trim());
      if (params.newNickname) accountsSheet.getRange(i + 1, 4).setValue(String(params.newNickname).trim());
      if (params.newEmail !== undefined) accountsSheet.getRange(i + 1, 6).setValue(String(params.newEmail).trim());
      if (params.newStatus) accountsSheet.getRange(i + 1, 8).setValue(String(params.newStatus).trim());

      return { success: true, message: `Account '${username}' updated successfully.` };
    }
  }

  return { success: false, error: 'User not found.' };
}

/**
 * Admin: Delete User
 */
function handleAdminDeleteUser(params) {
  if (!verifyAdmin(params.adminUser, params.adminPass)) {
    return { success: false, error: 'Unauthorized admin access.' };
  }

  const username = String(params.targetUser || '').trim().toLowerCase();
  if (!username || username === 'admin') {
    return { success: false, error: 'Cannot delete primary admin account.' };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const accountsSheet = ss.getSheetByName('Accounts');
  const data = accountsSheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toLowerCase() === username) {
      accountsSheet.deleteRow(i + 1);
      return { success: true, message: `Account '${username}' deleted successfully.` };
    }
  }

  return { success: false, error: 'User not found.' };
}

/**
 * Helper: Verify Admin Credentials
 */
function verifyAdmin(adminUser, adminPass) {
  if (!adminUser || !adminPass) return false;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const accountsSheet = ss.getSheetByName('Accounts');
  const data = accountsSheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toLowerCase() === String(adminUser).trim().toLowerCase() &&
        String(data[i][1]).trim() === String(adminPass).trim() &&
        data[i][2] === 'admin') {
      return true;
    }
  }
  return false;
}

/**
 * Send Approval Notifications via Telegram and Email (in English!)
 */
function sendApprovalNotifications(reqObj, username) {
  const nickname = reqObj.nickname || username;
  const password = reqObj.password;

  // 1. Send Email Notification if email is present
  if (reqObj.email && reqObj.email.indexOf('@') > 0) {
    try {
      const subject = '🎉 Account Activated - Starley CS Library Quiz';
      const body = `Hello ${nickname},\n\n` +
        `Your Quiz account for Starley CS Library has been approved and activated!\n\n` +
        `Account Credentials:\n` +
        `- Username: ${username}\n` +
        `- Password: ${password}\n\n` +
        `You can now log in to access your Personal Cabinet, save custom question playlists, track session statistics, and sync your study progress across all devices.\n\n` +
        `Best regards,\n` +
        `Starley CS Library Administration`;

      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; background: #0d1117; color: #c9d1d9; border: 1px solid #30363d; border-radius: 12px; padding: 24px;">
          <h2 style="color: #58a6ff; margin-top: 0;">🎉 Account Activated!</h2>
          <p style="font-size: 1rem; color: #e6edf3;">Hello <strong>${nickname}</strong>,</p>
          <p>Your Quiz account for <strong>Starley CS Library</strong> has been successfully approved by the administrator.</p>
          
          <div style="background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <div style="margin-bottom: 8px;"><strong>Username:</strong> <code style="color: #3fb950; font-size: 1.05rem;">${username}</code></div>
            <div><strong>Password:</strong> <code style="color: #3fb950; font-size: 1.05rem;">${password}</code></div>
          </div>

          <p>Features now available in your <strong>Personal Cabinet</strong>:</p>
          <ul style="color: #8b949e; padding-left: 20px;">
            <li>Sync question mastery and spaced repetition radar across devices</li>
            <li>Create and play custom question playlists (e.g., CABG, Congenital, ICU)</li>
            <li>Review detailed session history and incorrect answer logs</li>
          </ul>
          
          <hr style="border: 0; border-top: 1px solid #30363d; margin: 24px 0;" />
          <p style="font-size: 0.85rem; color: #8b949e;">Starley CS Library — Medical Examination & Study System</p>
        </div>
      `;

      MailApp.sendEmail({
        to: reqObj.email,
        subject: subject,
        body: body,
        htmlBody: htmlBody
      });
    } catch (e) {
      Logger.log('Email dispatch error: ' + e.toString());
    }
  }

  // 2. Send Telegram Notification if telegramId is present
  if (reqObj.telegramId && TELEGRAM_BOT_TOKEN && TELEGRAM_BOT_TOKEN !== 'YOUR_TELEGRAM_BOT_TOKEN') {
    try {
      const tgMessage = `🎉 *Account Activated!*\n\n` +
        `Hello *${nickname}*,\n` +
        `Your Quiz account for *Starley CS Library* is ready!\n\n` +
        `👤 *Username:* \`${username}\`\n` +
        `🔑 *Password:* \`${password}\`\n\n` +
        `Log in now to access your Personal Cabinet, custom playlists, and cloud sync!`;

      sendTelegramMessage(reqObj.telegramId, tgMessage);
    } catch (e) {
      Logger.log('Telegram dispatch error: ' + e.toString());
    }
  }
}

/**
 * Send Rejection Notification via Telegram and Email (in English!)
 */
function sendRejectionNotifications(reqObj) {
  if (reqObj.email && reqObj.email.indexOf('@') > 0) {
    try {
      MailApp.sendEmail({
        to: reqObj.email,
        subject: 'Registration Request Status - Starley CS Library',
        body: `Hello ${reqObj.nickname || 'User'},\n\n` +
          `Your registration request for Starley CS Library Quiz mode could not be approved at this time.\n` +
          `Please contact the administrator for further details.\n\n` +
          `Starley CS Library Administration`
      });
    } catch (e) {}
  }

  if (reqObj.telegramId && TELEGRAM_BOT_TOKEN && TELEGRAM_BOT_TOKEN !== 'YOUR_TELEGRAM_BOT_TOKEN') {
    try {
      sendTelegramMessage(reqObj.telegramId, `⚠️ *Registration Request Update*\n\nHello *${reqObj.nickname}*, your registration request was not approved by the administrator. Please contact admin for assistance.`);
    } catch (e) {}
  }
}

/**
 * Helper: Send Telegram API Message
 */
function sendTelegramMessage(chatId, text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const payload = {
    chat_id: chatId,
    text: text,
    parse_mode: 'Markdown'
  };

  UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
}

/**
 * Helper: Notify Admin via Telegram for New Registration Request
 */
function notifyAdminNewRequest(reqId, nickname, password, email, telegramUsername, telegramId) {
  const adminChatId = TELEGRAM_ADMIN_CHAT_ID || '954588841';
  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN === 'YOUR_TELEGRAM_BOT_TOKEN') return;
  
  const msg = `📬 *НОВЫЙ ЗАПРОС НА АККАУНТ (КВИЗ)*\n\n` +
    `👤 *Имя:* \`${nickname}\`\n` +
    `🔑 *Пароль:* \`${password}\`\n` +
    `📧 *Email:* ${email || 'не указан'}\n` +
    `✈️ *Telegram:* @${telegramUsername || 'не указан'} (ID: ${telegramId || 'N/A'})\n` +
    `🆔 *Request ID:* \`${reqId}\`\n\n` +
    `Утвердите или отклоните в панели 👑 Admin или в Google Таблице!`;
    
  sendTelegramMessage(adminChatId, msg);
}

/**
 * Telegram Webhook Processor for Bot commands (/start, /register)
 */
function handleTelegramWebhook(update) {
  if (!update.message || !update.message.text) {
    return ContentService.createTextOutput('OK');
  }

  const chatId = update.message.chat.id;
  const tgUser = update.message.from ? update.message.from.username || '' : '';
  const text = update.message.text.trim();

  if (text.startsWith('/start')) {
    const welcome = `🧠 *Welcome to Starley CS Library Quiz Bot!*\n\n` +
      `To request a new Quiz Account, use the command:\n` +
      `\`\/register nickname password email\`\n\n` +
      `*Example:*\n` +
      `\`\/register DrStarley 123456 doctor@example.com\`\n\n` +
      `Once submitted, our administrator will approve your request and notify you right here!`;
    sendTelegramMessage(chatId, welcome);
  } else if (text.startsWith('/register')) {
    const parts = text.split(' ').filter(Boolean);
    if (parts.length < 3) {
      sendTelegramMessage(chatId, `⚠️ *Usage Error*\nPlease use format:\n\`\/register <nickname> <password> [email]\``);
    } else {
      const nickname = parts[1];
      const password = parts[2];
      const email = parts[3] || '';

      handleTelegramRegister({
        telegramId: chatId,
        telegramUsername: tgUser,
        nickname: nickname,
        password: password,
        email: email
      });

      sendTelegramMessage(chatId, `✅ *Request Submitted!*\n\nHello *${nickname}*, your account request has been logged. You will receive an instant notification here and via email once approved by the administrator.`);
    }
  }

  return ContentService.createTextOutput('OK');
}

/**
 * Helper: Sanitize Usernames
 */
function sanitizeUsername(input) {
  return String(input || 'user')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '') || 'user_' + Math.floor(Math.random() * 1000);
}

/**
 * Helper: Safe JSON Parser
 */
function safeParseJSON(str, fallback) {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
}
