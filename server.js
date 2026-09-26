// ==========================================================================
// USELESS PROJECTS - ZERO-DEPENDENCY NODE.JS REST API & STATIC SERVER
// ==========================================================================

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data', 'submissions.json');

// Helper: Read submissions from database file
function readSubmissions() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
      fs.writeFileSync(DATA_FILE, '[]', 'utf8');
      return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error reading submissions DB:', err);
    return [];
  }
}

// Helper: Save submissions to database file
function saveSubmissions(submissions) {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(submissions, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving submissions DB:', err);
    return false;
  }
}

// MIME types mapping
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // --------------------------------------------------
  // REST API ENDPOINTS
  // --------------------------------------------------

  // 1. GET /api/health
  if (pathname === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'online', message: 'Useless Projects API running smoothly!', uselessness: '100%' }));
    return;
  }

  // 2. GET /api/submissions
  if (pathname === '/api/submissions' && req.method === 'GET') {
    const submissions = readSubmissions();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, count: submissions.length, data: submissions }));
    return;
  }

  // 3. POST /api/submissions
  if (pathname === '/api/submissions' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const { title, team, category, desc, rating } = payload;

        if (!title || !team || !desc) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Missing required fields: title, team, or desc' }));
          return;
        }

        const submissions = readSubmissions();
        const newEntry = {
          id: `sub_${Date.now()}`,
          title: title.trim(),
          team: team.trim(),
          category: category || 'Hardware Chaos',
          desc: desc.trim(),
          rating: Number(rating) || 100,
          upvotes: 1,
          createdAt: new Date().toISOString()
        };

        submissions.unshift(newEntry);
        saveSubmissions(submissions);

        console.log(`[API] New project submission saved: "${newEntry.title}" by @${newEntry.team}`);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Project stamped as trash!', data: newEntry }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // 4. POST /api/submissions/:id/upvote
  if (pathname.startsWith('/api/submissions/') && pathname.endsWith('/upvote') && req.method === 'POST') {
    const id = pathname.split('/')[3];
    const submissions = readSubmissions();
    const entry = submissions.find(item => item.id === id);

    if (entry) {
      entry.upvotes += 1;
      saveSubmissions(submissions);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, id: id, upvotes: entry.upvotes }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Submission not found' }));
    }
    return;
  }

  // --------------------------------------------------
  // STATIC FILE SERVER
  // --------------------------------------------------
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  
  // Security check: prevent directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 Not Found</h1><p>The requested useless page does not exist.</p>');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Useless Projects Backend Server listening on http://localhost:${PORT}`);
});
