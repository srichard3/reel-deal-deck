#!/usr/bin/env node
/** Minimal static server for dist/. Zero dependencies. */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const DIST = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'dist');
const PORT = Number(process.env.PORT || 4173);

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json',
};

createServer(async (req, res) => {
  try {
    const url = decodeURIComponent(req.url.split('?')[0]);
    let file = path.join(DIST, url);
    if (!file.startsWith(DIST)) throw Object.assign(new Error('bad path'), { code: 'ENOENT' });
    const s = await stat(file).catch(() => null);
    if (!s || s.isDirectory()) file = path.join(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, {
      'content-type': TYPES[path.extname(file)] || 'application/octet-stream',
      'cache-control': 'no-cache',
    });
    res.end(body);
  } catch {
    const notFound = await readFile(path.join(DIST, '404', 'index.html')).catch(() => null);
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
    res.end(notFound ?? '<h1>404</h1>');
  }
}).listen(PORT, () => console.log(`serving dist/ → http://localhost:${PORT}`));
