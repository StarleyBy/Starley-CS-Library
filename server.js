// server.js - Lightweight local server with auto-save for Starley CS Library
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = parseInt(process.env.PORT || process.argv[2] || '8085', 10);
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8'
};

const server = http.createServer((req, res) => {
  // CORS Headers for seamless local access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  // 1. API Endpoint: Save User Data to quiz/user_data_456755.json
  if (pathname === '/api/save-user-data' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 50 * 1024 * 1024) {
        req.destroy();
      }
    });

    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const pass = String(payload.password || payload.username || '456755').trim();
        const safePass = (pass === 'admin' || pass === 'Admin') ? '456755' : (pass === 'user' ? '0455' : pass);
        const targetFilename = `user_data_${safePass}.json`;
        const targetPath = path.join(ROOT_DIR, 'quiz', targetFilename);

        const fileData = {
          username: payload.username || 'admin',
          password: safePass,
          nickname: payload.nickname || 'Admin',
          level: payload.level || 'Lv.1 Resident Novice',
          currentExp: payload.currentExp !== undefined ? payload.currentExp : 0,
          totalExp: payload.totalExp !== undefined ? payload.totalExp : 0,
          tierId: payload.tierId !== undefined ? payload.tierId : 1,
          lastUpdated: new Date().toISOString(),
          favorites: payload.favorites || [],
          playlists: payload.playlists || [],
          progressMetrics: payload.progressMetrics || {},
          sessionHistory: payload.sessionHistory || payload.history || []
        };

        fs.writeFileSync(targetPath, JSON.stringify(fileData, null, 2), 'utf-8');
        console.log(`[LocalServer] User data successfully saved to quiz/${targetFilename}`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: `Saved to quiz/${targetFilename}`,
          filename: targetFilename,
          timestamp: fileData.lastUpdated
        }));
      } catch (err) {
        console.error('[LocalServer] Error saving user data:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // 2. API Endpoint: Get User Data from local JSON file
  if (pathname === '/api/get-user-data' && req.method === 'GET') {
    const pass = String(parsedUrl.searchParams.get('user') || parsedUrl.searchParams.get('password') || '456755').trim();
    const safePass = (pass === 'admin' || pass === 'Admin') ? '456755' : (pass === 'user' ? '0455' : pass);
    const targetPath = path.join(ROOT_DIR, 'quiz', `user_data_${safePass}.json`);

    if (fs.existsSync(targetPath)) {
      try {
        const content = fs.readFileSync(targetPath, 'utf-8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(content);
        return;
      } catch (readErr) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: readErr.message }));
        return;
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'User data file not found' }));
      return;
    }
  }

  // 3. Static File Server
  let relativePath = pathname;
  if (relativePath === '/' || relativePath === '') {
    relativePath = '/index.html';
  }

  const safePath = path.normalize(path.join(ROOT_DIR, relativePath));

  // Security: Prevent path traversal outside ROOT_DIR
  if (!safePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found: ' + pathname);
      return;
    }

    let filePath = safePath;
    if (stats.isDirectory()) {
      filePath = path.join(safePath, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Server Error');
        return;
      }

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Starley CS Library Local Server running at:`);
  console.log(`   http://localhost:${PORT}/`);
  console.log(`   http://localhost:${PORT}/quiz.html`);
  console.log(`📁 Local JSON Sync active: quiz/user_data_456755.json`);
  console.log(`=======================================================`);
});
