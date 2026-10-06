#!/usr/bin/env node
/** Minimal static server for dist/. Zero dependencies.
 *
 *  The file-serving half is exported so scripts/dev-functions.mjs can reuse it
 *  verbatim instead of keeping a second copy of the MIME table and the
 *  directory-index rules. Running this file directly still starts the server,
 *  so `npm run dev` is unchanged; importing it starts nothing. */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = Number(process.env.PORT || 4173);

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json',
};

export async function serveStatic(req, res) {
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
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  createServer(serveStatic).listen(PORT, () => console.log(`serving dist/ → http://localhost:${PORT}`));
}
