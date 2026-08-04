#!/usr/bin/env node
/**
 * The Reel Deal Deck — zero-dependency static site generator.
 *
 * Pipeline:
 *   1. Load site data (data/site.json) and fly data (data/flies.json).
 *   2. Render every src/pages/*.html and src/pages/*.mjs into dist/<route>/index.html
 *   3. Render one page per fly via src/templates/fly.mjs
 *   4. Copy src/styles, src/js and static/ into dist/
 *   5. Emit sitemap.xml + robots.txt from the routes actually built
 *   6. Run scripts/postbuild.mjs if it exists
 *
 * DO NOT EDIT without coordinating — every page in the site depends on the
 * contracts documented in README.md.
 */
import { readFile, readdir, mkdir, writeFile, cp, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

// fileURLToPath (not URL.pathname) — the repo path may contain spaces or other
// percent-encoded characters that pathname would hand back still encoded.
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');

const read = (p) => readFile(p, 'utf8');
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ------------------------------------------------------------------ data -- */

const site = JSON.parse(await read(path.join(ROOT, 'data/site.json')));
const flies = existsSync(path.join(ROOT, 'data/flies.json'))
  ? JSON.parse(await read(path.join(ROOT, 'data/flies.json')))
  : [];

/* -------------------------------------------------------------- partials -- */

const partials = {};
for (const f of await readdir(path.join(SRC, '_partials'))) {
  if (f.endsWith('.html')) partials[path.basename(f, '.html')] = await read(path.join(SRC, '_partials', f));
}

/** Expand {{> name }} partial includes, recursively (max 6 deep). */
function expandPartials(html, depth = 0) {
  if (depth > 6) return html;
  const out = html.replace(/\{\{>\s*([\w-]+)\s*\}\}/g, (m, name) => {
    if (!(name in partials)) throw new Error(`Unknown partial: {{> ${name} }}`);
    return partials[name];
  });
  return out === html ? out : expandPartials(out, depth + 1);
}

/** Substitute {{ meta.x }} / {{ site.x }} tokens. Values are HTML-escaped. */
function interpolate(html, ctx) {
  return html.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (m, key) => {
    const val = key.split('.').reduce((o, k) => (o == null ? o : o[k]), ctx);
    return val === undefined || val === null ? '' : esc(val);
  });
}

/* ----------------------------------------------------------------- shell -- */

const shell = await read(path.join(SRC, '_partials', 'shell.html'));

const routes = [];

function jsonldBlock(entries) {
  if (!entries || !entries.length) return '';
  return entries
    .map((e) => `<script type="application/ld+json">${JSON.stringify(e).replace(/</g, '\\u003c')}</script>`)
    .join('\n');
}

async function emit(route, meta, bodyHtml) {
  const canonical = site.url.replace(/\/$/, '') + route;
  const ctx = {
    site,
    meta: {
      ...meta,
      canonical,
      title: meta.title,
      fullTitle: meta.title === site.name ? meta.title : `${meta.title} — ${site.name}`,
      description: meta.description,
      ogImage: site.url.replace(/\/$/, '') + (meta.ogImage || site.defaultOgImage),
      bodyClass: meta.bodyClass || '',
    },
  };

  let html = shell
    .replace('{{{ jsonld }}}', jsonldBlock(meta.jsonld))
    .replace('{{{ content }}}', bodyHtml);
  html = expandPartials(html);
  html = interpolate(html, ctx);

  const outDir = route === '/' ? DIST : path.join(DIST, route);
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, 'index.html'), html);

  if (meta.noindex !== true) {
    routes.push({ route, changefreq: meta.changefreq || 'monthly', priority: meta.priority ?? 0.6 });
  }
}

/* ----------------------------------------------------------------- pages -- */

async function buildPages() {
  const dir = path.join(SRC, 'pages');
  for (const file of await readdir(dir)) {
    const full = path.join(dir, file);

    if (file.endsWith('.mjs')) {
      // JS page: `export const meta = {...}; export default (ctx) => htmlString`
      const mod = await import(pathToFileURL(full).href + `?t=${Date.now()}`);
      const meta = mod.meta;
      const body = await mod.default({ site, flies, meta });
      await emit(meta.path, meta, body);
      continue;
    }

    if (!file.endsWith('.html')) continue;

    const raw = await read(full);
    const m = raw.match(/^<!--\s*meta\s*([\s\S]*?)-->/);
    if (!m) throw new Error(`${file} is missing its <!--meta {...} --> front matter block`);
    const meta = JSON.parse(m[1]);
    const body = raw.slice(m[0].length).trim();
    await emit(meta.path, meta, body);
  }
}

/* ------------------------------------------------------------ fly pages -- */

async function buildFlies() {
  const tplPath = path.join(SRC, 'templates', 'fly.mjs');
  if (!existsSync(tplPath) || !flies.length) return;
  const tpl = await import(pathToFileURL(tplPath).href + `?t=${Date.now()}`);
  for (const fly of flies) {
    const { meta, body } = await tpl.default({ fly, flies, site });
    await emit(meta.path, meta, body);
  }
}

/* ---------------------------------------------------------------- assets -- */

async function copyAssets() {
  for (const [from, to] of [
    [path.join(SRC, 'styles'), path.join(DIST, 'styles')],
    [path.join(SRC, 'js'), path.join(DIST, 'js')],
    [path.join(ROOT, 'static'), DIST],
  ]) {
    if (existsSync(from)) await cp(from, to, { recursive: true });
  }
}

/* --------------------------------------------------------------- sitemap -- */

async function buildSitemap() {
  const base = site.url.replace(/\/$/, '');
  const today = new Date().toISOString().slice(0, 10);
  const urls = routes
    .sort((a, b) => b.priority - a.priority || a.route.localeCompare(b.route))
    .map(
      (r) =>
        `  <url><loc>${base}${r.route}</loc><lastmod>${today}</lastmod>` +
        `<changefreq>${r.changefreq}</changefreq><priority>${r.priority.toFixed(1)}</priority></url>`
    )
    .join('\n');
  await writeFile(
    path.join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  );

  const robotsSrc = path.join(ROOT, 'static', 'robots.txt');
  if (!existsSync(robotsSrc)) {
    await writeFile(
      path.join(DIST, 'robots.txt'),
      `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`
    );
  }
}

/* ------------------------------------------------------------------ main -- */

const t0 = Date.now();
await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });
await buildPages();
await buildFlies();
await copyAssets();
await buildSitemap();

const post = path.join(ROOT, 'scripts', 'postbuild.mjs');
if (existsSync(post)) {
  const mod = await import(pathToFileURL(post).href + `?t=${Date.now()}`);
  await mod.default?.({ site, flies, routes, DIST, ROOT });
}

console.log(`built ${routes.length} routes in ${Date.now() - t0}ms → dist/`);
