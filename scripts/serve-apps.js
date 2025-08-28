#!/usr/bin/env node

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { URL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..');
const APPS_DIR = path.join(ROOT_DIR, 'apps');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const HOST = process.env.HOST || '0.0.0.0';
const PORT = Number(process.env.PORT || 12000);

if (!fs.existsSync(APPS_DIR)) {
  console.error(`Apps directory not found at ${APPS_DIR}`);
  process.exit(1);
}
if (!fs.existsSync(DIST_DIR)) {
  console.warn(`Warning: dist directory not found at ${DIST_DIR}. Run \"npm run build\" if your apps import from /dist.`);
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.wasm': 'application/wasm'
};

function setCommonHeaders(res, contentType) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  // Allow embedding in iframes from anywhere
  res.setHeader('Content-Security-Policy', "frame-ancestors *");
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (contentType) res.setHeader('Content-Type', contentType);
}

function send404(res) {
  setCommonHeaders(res, 'text/plain; charset=utf-8');
  res.statusCode = 404;
  res.end('404 Not Found');
}

function safeJoin(base, requestedPath) {
  const safePath = path.normalize(requestedPath).replace(/^\\+|^\/+/, '');
  const finalPath = path.join(base, safePath);
  if (!finalPath.startsWith(base)) return null; // prevent path traversal
  return finalPath;
}

function resolvePath(urlPath) {
  // Default to apps index.html at root
  if (urlPath === '/' || urlPath === '') return path.join(APPS_DIR, 'index.html');

  // If request starts with /dist/, serve from built dist under repo root
  if (urlPath === '/dist' || urlPath.startsWith('/dist/')) {
    const distSub = urlPath.replace(/^\/dist\/?/, '');
    const t = safeJoin(DIST_DIR, distSub);
    if (!t) return null;
    try {
      const st = fs.existsSync(t) ? fs.statSync(t) : null;
      if (st && st.isDirectory()) {
        const indexPath = path.join(t, 'index.html');
        if (fs.existsSync(indexPath)) return indexPath;
        return null;
      }
      if (st && st.isFile()) return t;
      const htmlAttempt = t + '.html';
      if (fs.existsSync(htmlAttempt) && fs.statSync(htmlAttempt).isFile()) return htmlAttempt;
    } catch (_) {
      return null;
    }
    return null;
  }

  // Serve any other path from apps/ by default so /dino-jump/ works
  const appPath = safeJoin(APPS_DIR, urlPath);
  if (!appPath) return null;
  try {
    const st = fs.existsSync(appPath) ? fs.statSync(appPath) : null;
    if (st && st.isDirectory()) {
      const indexPath = path.join(appPath, 'index.html');
      if (fs.existsSync(indexPath)) return indexPath;
      return null;
    }
    if (st && st.isFile()) return appPath;
    const htmlAttempt = appPath + '.html';
    if (fs.existsSync(htmlAttempt) && fs.statSync(htmlAttempt).isFile()) return htmlAttempt;
  } catch (_) {
    return null;
  }

  return null;
}

const server = http.createServer((req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    setCommonHeaders(res);
    res.statusCode = 204;
    return res.end();
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    setCommonHeaders(res, 'text/plain; charset=utf-8');
    res.statusCode = 405;
    return res.end('Method Not Allowed');
  }

  let pathname;
  try {
    const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    pathname = decodeURIComponent(requestUrl.pathname);
  } catch {
    pathname = '/';
  }

  const filePath = resolvePath(pathname);
  if (!filePath) return send404(res);

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  setCommonHeaders(res, contentType);

  try {
    if (req.method === 'HEAD') {
      res.statusCode = 200;
      return res.end();
    }

    const stream = fs.createReadStream(filePath);
    stream.on('error', () => send404(res));
    stream.pipe(res);
  } catch {
    return send404(res);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Static server running at http://${HOST}:${PORT}`);
  console.log(`Serving dev root: ${ROOT_DIR}`);
  console.log('Routes:');
  console.log('  - /            -> apps/index.html');
  console.log('  - /apps/*      -> apps/*');
  console.log('  - /dist/*      -> dist/* (built output)');
  console.log('  - /*           -> repository root fallback');
});
