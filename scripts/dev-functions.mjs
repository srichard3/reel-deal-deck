#!/usr/bin/env node
/**
 * scripts/dev-functions.mjs — dist/ plus the Netlify functions, locally.
 *
 * `netlify dev` is the official way to do this and remains the right thing to
 * run before a real deploy. It is not what this project uses day to day: the
 * CLI is a ~1,000-package install that this repo otherwise has no need for, and
 * its dependency tree has broken outright on Node 20 (@fastify/static requiring
 * an ESM-only content-disposition). A dependency-free generator should not need
 * one to test its one function.
 *
 * What this gives you is the function's own contract: Functions v2 export a
 * default handler taking a standard Request and returning a standard Response,
 * and declare their route in `export const config = { path }`. All of that is
 * plain web API that Node 20 has natively, so the handler runs here exactly as
 * it runs on Netlify.
 *
 * What it does NOT give you is Netlify's platform — edge redirects, _headers,
 * their body size caps, their cold starts. Those are only ever proven by one
 * real deploy. Use this to build the thing; use a deploy to trust it.
 *
 * Run with: npm run dev:fn      (WHOLESALE_LIVE=1 to switch the form on)
 */
import { createServer } from 'node:http';
import { readFile, readdir } from 'node:fs/promises';
import { Readable } from 'node:stream';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { serveStatic } from './serve.mjs';
import { loadEnv } from './env.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT || 8888);

if (loadEnv(ROOT)) console.log('loaded .env');

/* Mount every function by the path it declares, so this file never carries a
   second copy of the routing table that could drift from the real one. */
const routes = new Map();
const dir = path.join(ROOT, 'netlify/functions');
for (const entry of await readdir(dir)) {
  if (!entry.endsWith('.mjs') && !entry.endsWith('.js')) continue;
  const mod = await import(path.join(dir, entry));
  const route = mod.config?.path || `/.netlify/functions/${entry.replace(/\.m?js$/, '')}`;
  if (typeof mod.default === 'function') routes.set(route, mod.default);
}

createServer(async (req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const fn = routes.get(url);
  if (!fn) return serveStatic(req, res);

  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers.set(k, v);
  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
  const request = new Request(`http://localhost:${PORT}${req.url}`, {
    method: req.method,
    headers,
    body: hasBody ? Readable.toWeb(req) : undefined,
    duplex: 'half',
  });

  let out;
  try {
    out = await fn(request);
  } catch (err) {
    /* On Netlify a throwing handler is a 500, not a dead socket. Match that,
       and print the stack here where the developer can see it. */
    console.error(`${url} threw:`, err?.stack || err);
    out = new Response('Function error — see the terminal.', { status: 500 });
  }
  const buf = Buffer.from(await out.arrayBuffer());
  res.writeHead(out.status, Object.fromEntries(out.headers));
  res.end(buf);
}).listen(PORT, () => {
  console.log(`\n  dist/ + functions → http://localhost:${PORT}`);
  for (const r of routes.keys()) console.log(`    ${r}`);
  console.log(`  wholesale form: ${process.env.WHOLESALE_LIVE === '1' ? 'ON' : 'OFF (set WHOLESALE_LIVE=1)'}\n`);
});
