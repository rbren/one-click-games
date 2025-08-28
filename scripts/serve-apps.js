#!/usr/bin/env node

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { URL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APPS_DIR = path.join(__dirname, '..', 'apps');
const HOST = process.env.HOST || '0.0.0.0';
const PORT = Number(process.env.PORT || 12000);

if (!fs.existsSync(APPS_DIR)) {
  console.error(`Apps directory not found at ${APPS_DIR}`);
  process.exit(1);
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
  // Default to index.html at root
  if (urlPath === '/' || urlPath === '') return path.join(APPS_DIR, 'index.html');

  let target = safeJoin(APPS_DIR, urlPath);
  if (!target) return null;

  try {
    const stat = fs.existsSync(target) ? fs.statSync(target) : null;
    if (stat && stat.isDirectory()) {
      const indexPath = path.join(target, 'index.html');
      if (fs.existsSync(indexPath)) return indexPath;
      return null;
    }
    if (stat && stat.isFile()) return target;

    // If no exact match, try adding .html (common for static sites)
    const htmlAttempt = target + '.html';
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
  console.log(`Serving directory: ${APPS_DIR}`);
  console.log('Examples:');
  console.log(`  - / (homepage)`);
  console.log(`  - /hello-world/ (game)`);
});
