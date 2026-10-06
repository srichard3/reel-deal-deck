#!/usr/bin/env node
/** scripts/env.mjs — read .env into process.env, for local development only.
 *
 *  Both build.mjs and scripts/dev-functions.mjs need it, and they are separate
 *  processes: `npm run dev:fn` runs the build FIRST, so a loader living only in
 *  the server would leave the build without WHOLESALE_LIVE and quietly emit the
 *  page with no form on it. That was a real bug. One loader, called by both.
 *
 *  A missing .env is normal — CI and Netlify have none, and the real values live
 *  in Netlify's environment. Values already in process.env always win, so
 *  `FOO=1 npm run build` still overrides a line in the file.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function loadEnv(root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')) {
  let text;
  try { text = readFileSync(path.join(root, '.env'), 'utf8'); } catch { return false; }
  for (const line of text.split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const m = /^\s*([\w.-]+)\s*=\s*(.*?)\s*$/.exec(line);
    if (!m) continue;
    const value = m[2].replace(/^(['"])(.*)\1$/, '$2');
    if (!(m[1] in process.env)) process.env[m[1]] = value;
  }
  return true;
}
