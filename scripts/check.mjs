#!/usr/bin/env node
/**
 * The Reel Deal Deck — quality gate.  `npm run check`
 *
 * Crawls dist/ and refuses to let the site ship with the failures that
 * silently destroy organic traffic. In rough order of how much damage each
 * one does:
 *
 *   • a broken internal link — the crawler follows it, gets a 404, and the
 *     page it was pointing at never enters the index
 *   • a missing/duplicate h1 or a skipped heading level — breaks both the
 *     document outline for screen readers and topical parsing
 *   • a title over 60 chars or a description over 160 — truncated in the SERP,
 *     which is a measurable click-through loss on every impression
 *   • a missing canonical or OG tag — duplicate-URL dilution, dead share cards
 *   • an og:image that 404s — every share of that page previews as a grey box
 *   • an <img> with no alt — inaccessible, and image search cannot read it
 *   • malformed JSON-LD — rich results silently stop appearing
 *   • any external or http:// reference — this site is strictly self-hosted;
 *     one CDN link is a privacy leak, a render-blocking SPOF, and a lie in
 *     the CSP
 *
 * Errors exit non-zero. Warnings (TODO markers, redirect hops, thin
 * descriptions) are printed and do not fail — they are the founders' list.
 *
 * Runs correctly against a half-built site: pages that do not exist yet are
 * reported, never crashed on.
 *
 * Node built-ins only.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

const TITLE_MAX = 60;
const DESC_MAX = 160;
const DESC_THIN = 70;

/* ---------------------------------------------------------------- utils -- */

const C = process.stdout.isTTY && !process.env.NO_COLOR
  ? { red: (s) => `\x1b[31m${s}\x1b[0m`, yellow: (s) => `\x1b[33m${s}\x1b[0m`,
      green: (s) => `\x1b[32m${s}\x1b[0m`, dim: (s) => `\x1b[2m${s}\x1b[0m`,
      bold: (s) => `\x1b[1m${s}\x1b[0m` }
  : { red: (s) => s, yellow: (s) => s, green: (s) => s, dim: (s) => s, bold: (s) => s };

async function walk(dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walk(full, out);
    else out.push(full);
  }
  return out;
}

const rel = (f) => path.relative(DIST, f).split(path.sep).join('/');

const decode = (s) =>
  String(s)
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#0?39;|&rsquo;|&lsquo;|&#8217;/g, "'")
    .replace(/&mdash;|&#8212;/g, '—').replace(/&ndash;|&#8211;/g, '–')
    .replace(/&nbsp;|&#160;|&#8202;/g, ' ').replace(/&hellip;/g, '…')
    .replace(/&[a-z]+;/gi, '?');

const strip = (s) => String(s).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

/** Line number of the first occurrence of an index in a string. */
const lineAt = (src, idx) => src.slice(0, idx).split('\n').length;

function attr(tagHtml, name) {
  const m = tagHtml.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  if (!m) return null;
  return m[2] ?? m[3] ?? m[4] ?? '';
}
const hasAttr = (tagHtml, name) =>
  new RegExp(`\\s${name}(\\s*=|[\\s/>])`, 'i').test(tagHtml);

function meta(html, key, kind = 'name') {
  const re = new RegExp(
    `<meta\\s[^>]*${kind}\\s*=\\s*["']${key}["'][^>]*>`,
    'i'
  );
  const m = html.match(re);
  return m ? decode(attr(m[0], 'content') ?? '') : null;
}

/* ------------------------------------------------------------- preflight -- */

if (!existsSync(DIST)) {
  console.error(C.red('\ncheck: dist/ does not exist. Run `npm run build` first.\n'));
  process.exit(1);
}

let site = {};
try {
  site = JSON.parse(await readFile(path.join(ROOT, 'data/site.json'), 'utf8'));
} catch {
  console.error(C.yellow('check: could not read data/site.json — host checks relaxed.'));
}
/* SITE_URL overrides the canonical origin at build time — a GitHub Pages
   deploy is served from the Pages origin, not from data/site.json's canonical
   host. Every host check below derives from this, so it must follow the same
   override the build used or the whole gate misfires. */
const EFFECTIVE_SITE_URL = process.env.SITE_URL || site.url || '';
const SITE_ORIGIN = (() => {
  try { return new URL(EFFECTIVE_SITE_URL).origin; } catch { return null; }
})();
const SITE_HOST = SITE_ORIGIN ? new URL(SITE_ORIGIN).host : null;

const allFiles = await walk(DIST);
const fileSet = new Set(allFiles.map(rel));
const linkGraph = new Map();  // route -> Set(routes it links to)
const htmlFiles = allFiles
  .filter((f) => f.endsWith('.html'))
  // dist/404.html is a byte-identical copy of dist/404/index.html written by
  // postbuild for the host's fallback; checking it twice just doubles noise.
  .filter((f) => rel(f) !== '404.html')
  .sort();

/* --------------------------------------------------------------- report -- */

const report = new Map(); // file -> { errors: [], warnings: [] }
let errorCount = 0;
let warnCount = 0;

function add(file, level, msg, line) {
  const key = file;
  if (!report.has(key)) report.set(key, { errors: [], warnings: [] });
  const where = line ? `${C.dim(`:${line}`)} ` : '';
  if (level === 'error') { report.get(key).errors.push(where + msg); errorCount++; }
  else { report.get(key).warnings.push(where + msg); warnCount++; }
}

/* ------------------------------------------------------- root assets ---- */

const REQUIRED = [
  'index.html',
  'sitemap.xml',
  'robots.txt',
  'favicon.svg',
  'apple-touch-icon.png',
  'site.webmanifest',
  (site.defaultOgImage || '/og/default.png').replace(/^\//, ''),
];
for (const r of REQUIRED) {
  if (!fileSet.has(r)) add('(site)', r === 'index.html' ? 'warning' : 'error', `missing from dist/: /${r}`);
}

/* --------------------------------------------------------- link resolve -- */

/**
 * Resolve an internal href to a file in dist.
 * @returns {'ok'|'redirect'|'missing'}
 */
/* When the site is built for a subpath (GitHub Pages project site) every
   root-relative href carries that prefix, but dist/ is still laid out from the
   root. Strip it before resolving, or every internal link reads as broken. */
const CHECK_BASE = (process.env.BASE_PATH || '').replace(/\/+$/, '');

function resolveInternal(href, fromRoute) {
  let target = href.split('#')[0].split('?')[0];
  if (!target) return 'ok'; // same-document
  if (CHECK_BASE && target.startsWith(CHECK_BASE + '/')) target = target.slice(CHECK_BASE.length);
  else if (CHECK_BASE && target === CHECK_BASE) target = '/';
  if (!target.startsWith('/')) {
    target = path.posix.resolve(path.posix.dirname(fromRoute.replace(/\/$/, '/index.html')), target);
  }
  target = path.posix.normalize(target);
  const relTarget = target.replace(/^\//, '');

  if (target.endsWith('/')) return fileSet.has(relTarget + 'index.html') ? 'ok' : 'missing';
  if (path.posix.extname(relTarget)) return fileSet.has(relTarget) ? 'ok' : 'missing';
  if (fileSet.has(relTarget)) return 'ok';
  // Extensionless and not a directory URL — the host will redirect to the
  // trailing-slash form. It works, but it costs a hop on every crawl.
  if (fileSet.has(relTarget + '/index.html')) return 'redirect';
  if (fileSet.has(relTarget + '.html')) return 'redirect';
  return 'missing';
}

const RESOURCE_TAGS = /<(script|link|img|iframe|source|video|audio|embed|object|use)\b[^>]*>/gi;

/* ------------------------------------------------------------ per page -- */

for (const file of htmlFiles) {
  const name = rel(file);
  const route = name === 'index.html' ? '/' : '/' + name.replace(/index\.html$/, '');
  let html;
  try {
    html = await readFile(file, 'utf8');
  } catch (e) {
    add(name, 'error', `unreadable: ${e.message}`);
    continue;
  }

  const head = (html.match(/<head[^>]*>([\s\S]*?)<\/head>/i) || [, html])[1];

  /* --- title -------------------------------------------------------- */
  const titleRaw = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleRaw ? decode(strip(titleRaw[1])) : null;
  if (!title) add(name, 'error', 'no <title>');
  else if (title.length > TITLE_MAX)
    add(name, 'error', `<title> is ${title.length} chars (max ${TITLE_MAX}) — “${title}”`);

  /* --- description -------------------------------------------------- */
  const titleText = (html.match(/<title>([\s\S]*?)<\/title>/i) || [, ''])[1].trim();
  if (titleText && /[…]/.test(titleText))
    add(name, 'warning', 'title was truncated by the template — shorten it at the source');

  const desc = meta(html, 'description');
  if (!desc) add(name, 'error', 'no <meta name="description">');
  else if (desc.length > DESC_MAX)
    add(name, 'error', `meta description is ${desc.length} chars (max ${DESC_MAX})`);
  else if (desc.length < DESC_THIN)
    add(name, 'warning', `meta description is only ${desc.length} chars — thin, aim for ${DESC_THIN}–${DESC_MAX}`);

  /* A description ending in an ellipsis was clamped by the template because the
     source was over length. It renders inside the limit, so the length check
     above passes and the truncation goes unnoticed — but the sentence has been
     cut. Shorten it at the source instead and the ellipsis disappears. */
  if (desc && /[…]$/.test(desc))
    add(name, 'warning', 'meta description was truncated by the template — shorten it at the source so it ends on a full sentence');

  /* --- canonical + Open Graph --------------------------------------- */
  const canonicalTag = head.match(/<link\s[^>]*rel\s*=\s*["']canonical["'][^>]*>/i);
  const canonical = canonicalTag ? attr(canonicalTag[0], 'href') : null;
  if (!canonical) add(name, 'error', 'no <link rel="canonical">');
  else if (SITE_ORIGIN && !canonical.startsWith(SITE_ORIGIN))
    add(name, 'error', `canonical points off-origin: ${canonical}`);
  else if (canonical && !canonical.endsWith(route) && route !== '/')
    add(name, 'warning', `canonical ${canonical} does not match route ${route}`);

  for (const p of ['og:title', 'og:description', 'og:image']) {
    if (!meta(html, p, 'property')) add(name, 'error', `no <meta property="${p}">`);
  }

  const ogImage = meta(html, 'og:image', 'property');
  if (ogImage) {
    let ogPath = null;
    if (/^https?:\/\//i.test(ogImage)) {
      try {
        const u = new URL(ogImage);
        if (SITE_HOST && u.host !== SITE_HOST)
          add(name, 'error', `og:image is on a foreign host: ${ogImage}`);
        ogPath = u.pathname;
      } catch { add(name, 'error', `og:image is not a valid URL: ${ogImage}`); }
    } else {
      add(name, 'warning', `og:image is relative (${ogImage}) — scrapers want an absolute URL`);
      ogPath = ogImage;
    }
    if (ogPath) {
      if (CHECK_BASE && ogPath.startsWith(CHECK_BASE + '/')) ogPath = ogPath.slice(CHECK_BASE.length);
      const f = ogPath.replace(/^\//, '');
      if (!fileSet.has(f)) add(name, 'error', `og:image does not exist on disk: /${f}`);
    }
  }

  /* --- headings ------------------------------------------------------ */
  const headings = [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({
    level: Number(m[1]),
    text: strip(m[2]),
    line: lineAt(html, m.index),
  }));
  const h1s = headings.filter((h) => h.level === 1);
  if (h1s.length === 0) add(name, 'error', 'no <h1>');
  else if (h1s.length > 1)
    add(name, 'error', `${h1s.length} <h1> elements (lines ${h1s.map((h) => h.line).join(', ')}) — there must be exactly one`);

  let prev = 0;
  for (const h of headings) {
    if (prev && h.level > prev + 1)
      add(name, 'error', `heading level skipped: h${prev} → h${h.level} (“${h.text.slice(0, 48)}”)`, h.line);
    prev = h.level;
  }

  /* --- images -------------------------------------------------------- */
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!hasAttr(m[0], 'alt')) {
      const src = attr(m[0], 'src') || '(no src)';
      add(name, 'error', `<img> without alt: ${src}`, lineAt(html, m.index));
    }
  }

  /* --- JSON-LD ------------------------------------------------------- */
  const ld = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const m of ld) {
    const line = lineAt(html, m.index);
    let parsed;
    try {
      parsed = JSON.parse(m[1].replace(/\\u003c/g, '<'));
    } catch (e) {
      add(name, 'error', `JSON-LD does not parse: ${e.message}`, line);
      continue;
    }
    const nodes = Array.isArray(parsed) ? parsed : parsed['@graph'] ?? [parsed];
    if (!parsed['@context'] && !(Array.isArray(parsed) && parsed.every((n) => n['@context'])))
      add(name, 'error', 'JSON-LD block has no @context', line);
    for (const n of [].concat(nodes)) {
      if (!n || typeof n !== 'object') { add(name, 'error', 'JSON-LD node is not an object', line); continue; }
      if (!n['@type']) add(name, 'error', 'JSON-LD node has no @type', line);
    }
  }

  /* --- links --------------------------------------------------------- */
  for (const m of html.matchAll(/<a\b[^>]*>/gi)) {
    const href = attr(m[0], 'href');
    const line = lineAt(html, m.index);
    if (href === null) continue;
    const h = href.trim();
    if (!h) { add(name, 'warning', 'empty href=""', line); continue; }
    if (/^(mailto:|tel:|sms:|data:)/i.test(h)) continue;
    if (h === '#') { add(name, 'warning', 'placeholder link href="#"', line); continue; }
    if (h.startsWith('#')) continue;
    if (/^javascript:/i.test(h)) { add(name, 'error', 'javascript: href', line); continue; }
    if (/^http:\/\//i.test(h)) { add(name, 'error', `insecure http:// link: ${h}`, line); continue; }
    if (/^https:\/\//i.test(h)) {
      try {
        const u = new URL(h);
        if (SITE_HOST && u.host === SITE_HOST)
          add(name, 'warning', `absolute self-link — use a root-relative path: ${h}`, line);
      } catch { add(name, 'error', `malformed URL: ${h}`, line); }
      continue;
    }
    if (/^\/\//.test(h)) { add(name, 'error', `protocol-relative link: ${h}`, line); continue; }

    const state = resolveInternal(h, route);
    if (state !== 'missing') noteLinkTarget(h, route);
    if (state === 'missing') add(name, 'error', `broken internal link: ${h}`, line);
    else if (state === 'redirect')
      add(name, 'warning', `link costs a redirect hop (no trailing slash): ${h}`, line);
  }

  /* --- external resources (strictly self-hosted) ---------------------- */
  for (const m of html.matchAll(RESOURCE_TAGS)) {
    const tagName = m[1].toLowerCase();
    const line = lineAt(html, m.index);

    // <link> covers two unrelated jobs. Some rels fetch a subresource and must
    // be same-origin and present on disk; others are pure metadata whose whole
    // point is to carry an absolute URL (canonical, alternate, me). Treating
    // them the same is how you end up "fixing" a correct canonical tag.
    let metadataLink = false;
    if (tagName === 'link') {
      const r = (attr(m[0], 'rel') || '').toLowerCase();
      if (/preconnect|dns-prefetch/.test(r))
        add(name, 'error', `<link rel="${r}"> — nothing on this site is third-party`, line);
      metadataLink = !/stylesheet|icon|manifest|preload|prefetch|modulepreload/.test(r);
    }

    for (const a of ['src', 'href', 'srcset', 'data', 'poster']) {
      const v = attr(m[0], a);
      if (!v) continue;
      for (const candidate of v.split(',').map((s) => s.trim().split(/\s+/)[0]).filter(Boolean)) {
        if (/^data:|^mailto:|^tel:|^#/i.test(candidate)) continue;
        if (/^http:\/\//i.test(candidate)) {
          add(name, 'error', `<${tagName}> uses an http:// URL: ${candidate}`, line);
          continue;
        }
        if (/^(https:)?\/\//i.test(candidate)) {
          let host = null;
          try { host = new URL(candidate, SITE_ORIGIN || 'https://x.invalid').host; } catch { /* ignore */ }
          if (!SITE_HOST || host !== SITE_HOST)
            add(name, 'error', `<${tagName}> points at an external host (${host}): ${candidate}`, line);
          else if (!metadataLink)
            add(name, 'warning', `<${tagName}> loads an absolute self URL — use a root-relative path: ${candidate}`, line);
          continue;
        }
        if (metadataLink) continue;
        const state = resolveInternal(candidate, route);
        if (state === 'missing')
          add(name, 'error', `<${tagName}> references a missing file: ${candidate}`, line);
      }
    }
  }

  /* --- inline CSS reaching outside ------------------------------------ */
  for (const m of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
    const css = m[1];
    const base = lineAt(html, m.index);
    for (const u of css.matchAll(/@import|url\(\s*['"]?(https?:)?\/\/[^)]*\)/gi)) {
      if (u[0].startsWith('@import'))
        add(name, 'error', '@import in inline CSS — inline it or move it to /styles/', base);
      else add(name, 'error', `inline CSS loads an external resource: ${u[0]}`, base);
    }
  }
  for (const m of html.matchAll(/style\s*=\s*"[^"]*url\(\s*['"]?(https?:)?\/\/[^)]*\)/gi)) {
    add(name, 'error', 'inline style attribute loads an external resource', lineAt(html, m.index));
  }

  /* --- lingering TODO markers ----------------------------------------- */
  const lines = html.split('\n');
  lines.forEach((l, i) => {
    const m = l.match(/TODO(?:-CONFIRM)?\b[:\s]?(.{0,90})/);
    if (m) add(name, 'warning', `TODO in shipped HTML — ${strip(m[0]).slice(0, 110)}`, i + 1);
  });

  /* --- unexpanded template tokens ------------------------------------- */
  for (const m of html.matchAll(/\{\{\{?\s*[\w.]+\s*\}?\}\}/g)) {
    add(name, 'error', `unexpanded template token: ${m[0]}`, lineAt(html, m.index));
  }

  /* --- lang ------------------------------------------------------------ */
  if (!/<html\b[^>]*\slang\s*=/i.test(html)) add(name, 'error', '<html> has no lang attribute');
}

/* ------------------------------------------------------------- orphans -- */
/* A page nothing links to is invisible to a reader and close to invisible to a
   crawler, which reaches it only via the sitemap and passes it no internal
   authority. This is how 22 guides ended up unreachable from the homepage: the
   link checker proved every link RESOLVED, and never asked whether anything
   pointed AT a given page. */

function noteLinkTarget(href, fromRoute) {
  let t = href.split('#')[0].split('?')[0];
  if (!t) return;
  if (!t.startsWith('/')) {
    t = path.posix.resolve(path.posix.dirname(fromRoute.replace(/\/$/, '/index.html')), t);
  }
  if (CHECK_BASE && t.startsWith(CHECK_BASE + '/')) t = t.slice(CHECK_BASE.length);
  else if (CHECK_BASE && t === CHECK_BASE) t = '/';
  t = path.posix.normalize(t);
  if (!t.endsWith('/') && !path.posix.extname(t)) t += '/';
  if (t === fromRoute) return;
  if (!linkGraph.has(fromRoute)) linkGraph.set(fromRoute, new Set());
  linkGraph.get(fromRoute).add(t);
}

/* Walk the link graph outward from the homepage. Counting inbound links is not
   enough: a cluster that links only to itself — as the guides did — has inbound
   links on every page and is still unreachable from the front door. */
const reachable = new Set(['/']);
const queue = ['/'];
while (queue.length) {
  for (const next of linkGraph.get(queue.shift()) ?? []) {
    if (!reachable.has(next)) { reachable.add(next); queue.push(next); }
  }
}

const unreachable = [];
for (const file of htmlFiles) {
  const name = rel(file);
  const route = name === 'index.html' ? '/' : '/' + name.replace(/index\.html$/, '');
  if (route === '/' || /^\/404\//.test(route)) continue;
  if (reachable.has(route)) continue;
  const html = await readFile(file, 'utf8').catch(() => '');
  if (/<meta[^>]+name=["']robots["'][^>]*noindex/i.test(html)) continue;
  unreachable.push({ name, route });
}

/* Report the cluster, not 23 identical lines. */
if (unreachable.length) {
  const roots = unreachable.filter((u) => u.route.split('/').filter(Boolean).length === 1);
  const head = roots.length ? roots : unreachable.slice(0, 1);
  for (const r of head) {
    add(r.name, 'error',
      `unreachable from the homepage — nothing outside this section links to it` +
      (unreachable.length > head.length ? ` (${unreachable.length} pages in this cluster)` : ''));
  }
  for (const u of unreachable.filter((x) => !head.includes(x)).slice(0, 5)) {
    add(u.name, 'warning', 'unreachable from the homepage (same cluster as above)');
  }
}

/* ------------------------------------------------------------ sitemap --- */

const sitemapPath = path.join(DIST, 'sitemap.xml');
if (existsSync(sitemapPath)) {
  const xml = await readFile(sitemapPath, 'utf8');
  const locs = [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/g)].map((m) => m[1].trim());
  if (!locs.length) add('sitemap.xml', 'warning', 'contains no <loc> entries');
  for (const loc of locs) {
    let p;
    try { p = new URL(loc).pathname; } catch { add('sitemap.xml', 'error', `invalid URL: ${loc}`); continue; }
    if (SITE_ORIGIN && !loc.startsWith(SITE_ORIGIN))
      add('sitemap.xml', 'error', `URL is off-origin: ${loc}`);
    /* dist/ is laid out from the root even when the site is served from a
       subpath, so strip the base before the on-disk lookup. */
    let sp = p;
    if (CHECK_BASE && sp.startsWith(CHECK_BASE + '/')) sp = sp.slice(CHECK_BASE.length);
    else if (CHECK_BASE && sp === CHECK_BASE) sp = '/';
    const f = sp.replace(/^\//, '') + (sp.endsWith('/') ? 'index.html' : '');
    if (!fileSet.has(f)) add('sitemap.xml', 'error', `lists a page that was not built: ${p}`);
  }
  const noindexed = htmlFiles
    .map((f) => (rel(f) === 'index.html' ? '/' : '/' + rel(f).replace(/index\.html$/, '')))
    .filter((r) => !locs.some((l) => l.endsWith(r)));
  for (const r of noindexed) {
    const f = path.join(DIST, r === '/' ? 'index.html' : r + 'index.html');
    if (!existsSync(f)) continue;
    const h = await readFile(f, 'utf8');
    if (!/<meta\s+name=["']robots["'][^>]*noindex/i.test(h))
      add('sitemap.xml', 'warning', `${r} is in neither the sitemap nor marked noindex — it will be orphaned`);
  }
}

/* ------------------------------------------------------------- output --- */

const out = [];
const rule = '─'.repeat(78);
out.push('');
out.push(rule);
out.push(`  ${C.bold('CHECK')}  ${htmlFiles.length} pages · ${allFiles.length} files · dist/`);
out.push(rule);

const files = [...report.keys()].sort();
if (!files.length) {
  out.push(C.green('  Nothing to report.'));
} else {
  for (const f of files) {
    const { errors, warnings } = report.get(f);
    if (!errors.length && !warnings.length) continue;
    out.push('');
    out.push(`  ${C.bold(f)}`);
    for (const e of errors) out.push(`    ${C.red('✗')} ${e}`);
    for (const w of warnings) out.push(`    ${C.yellow('!')} ${w}`);
  }
}

let totalBytes = 0;
for (const f of allFiles) totalBytes += (await stat(f)).size;

out.push('');
out.push(rule);
out.push(
  `  ${errorCount ? C.red(`${errorCount} error${errorCount === 1 ? '' : 's'}`) : C.green('0 errors')}` +
  `   ${warnCount ? C.yellow(`${warnCount} warning${warnCount === 1 ? '' : 's'}`) : '0 warnings'}` +
  `   ${(totalBytes / 1024).toFixed(0)} kB total`
);
if (errorCount) {
  out.push(C.dim('  Errors block the deploy. Warnings are the founders\' punch list.'));
} else {
  out.push(C.green('  Deployable.'));
}
out.push(rule);
out.push('');
console.log(out.join('\n'));

process.exit(errorCount ? 1 : 0);
