/**
 * The Reel Deal Deck — postbuild hook.
 *
 * build.mjs calls the default export with { site, flies, routes, DIST, ROOT }
 * after everything has been written. This is the only place we are allowed to
 * touch the emitted output, so it does the jobs that need to see the whole
 * site at once:
 *
 *   1. dist/404.html          — Netlify/Pages serve this for unmatched paths.
 *                               build.mjs emits /404/index.html; hosts want the
 *                               file at the root, with a real 404 status.
 *   2. meta robots noindex    — any route that asked for "noindex": true is
 *                               kept out of sitemap.xml by build.mjs, but the
 *                               page itself carries no directive. Without one,
 *                               an external link is enough to get it indexed.
 *   3. feed discovery         — <link rel="alternate"> for the Fly Library feed.
 *   4. /search-index.json     — every route, compactly, so on-site search can be
 *                               added later without re-architecting anything.
 *   5. /flies/feed.json + rss.xml — the Fly Library is a publication. Make it
 *                               syndicable so fly shops and forums can follow it.
 *   6. robots.txt sitemap URL — pinned to site.url rather than a hand-typed host.
 *   7. CSP script hashes      — the inline bootstrap in head.html is hashed and
 *                               added to the policy in dist/_headers, so the
 *                               shipped CSP is stronger than the static one.
 *   8. A build report         — title/description budgets, missing h1s, weight.
 *
 * Node built-ins only. Warnings never fail the build (three other agents are
 * working in parallel and a half-finished page is not a broken deploy); only
 * genuinely broken *output* does.
 */
import { readdir, readFile, writeFile, stat, copyFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/* -------------------------------------------------------------- helpers -- */

const SELF_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * build.mjs derives ROOT from `new URL(import.meta.url).pathname`, which leaves
 * percent-encoding in the path when the checkout lives under a directory with a
 * space in it. Recover rather than explode. See the note in docs/DEPLOY.md.
 */
function usable(p, fallback) {
  if (p && existsSync(p)) return p;
  if (p) {
    try {
      const d = decodeURIComponent(p);
      if (existsSync(d)) return d;
    } catch { /* not encoded */ }
  }
  return fallback;
}

async function walk(dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walk(full, out);
    else out.push(full);
  }
  return out;
}

const strip = (s) => String(s).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const decode = (s) =>
  String(s)
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;|&rsquo;|&#8217;/g, "'")
    .replace(/&mdash;|&#8212;/g, '—').replace(/&ndash;/g, '–')
    .replace(/&nbsp;/g, ' ').replace(/&hellip;/g, '…');

const xml = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const tag = (html, re) => {
  const m = html.match(re);
  return m ? m[1].trim() : null;
};

const kb = (n) => `${(n / 1024).toFixed(1)} kB`;

/* ----------------------------------------------------------------- main -- */

export default async function postbuild({ site, flies = [], routes = [], DIST, ROOT } = {}) {
  const dist = usable(DIST, path.join(SELF_ROOT, 'dist'));
  const root = usable(ROOT, SELF_ROOT);
  const base = String(site?.url || '').replace(/\/$/, '');
  /* When the site is served from a subpath (GitHub Pages project site), the
     path portion of site.url is that prefix. Root-relative links written here
     run after emit(), so they miss build.mjs's rewrite and need it applied. */
  let basePath = '';
  try { basePath = new URL(base).pathname.replace(/\/$/, ''); } catch { basePath = ''; }

  const errors = [];
  const warnings = [];
  const notes = [];

  if (!existsSync(dist)) {
    console.error('\npostbuild: dist/ does not exist — nothing was built.\n');
    process.exitCode = 1;
    return;
  }

  const files = await walk(dist);
  const htmlFiles = files.filter((f) => f.endsWith('.html'));

  /* Map every emitted HTML file back to its route. */
  const toRoute = (file) => {
    const rel = path.relative(dist, file).split(path.sep).join('/');
    if (rel === 'index.html') return '/';
    if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'index.html'.length);
    return '/' + rel;
  };

  const indexedRoutes = new Set(routes.map((r) => r.route));

  /* ------------------------------------------------- 1. read + rewrite -- */

  const pages = [];

  for (const file of htmlFiles) {
    const route = toRoute(file);
    let html = await readFile(file, 'utf8');
    let dirty = false;

    // A route that build.mjs kept out of sitemap.xml was marked noindex.
    // Give it an actual directive — robots.txt Disallow does not prevent
    // indexing, it only prevents crawling, and Google will happily index a
    // disallowed URL it found a link to.
    const isNoindex = !indexedRoutes.has(route);
    if (isNoindex && !/<meta\s+name=["']robots["']/i.test(html)) {
      html = html.replace(
        /<\/head>/i,
        '<meta name="robots" content="noindex, follow">\n</head>'
      );
      dirty = true;
    }

    // Feed autodiscovery.
    if (!/rel=["']alternate["'][^>]*application\/rss\+xml/i.test(html)) {
      html = html.replace(
        /<\/head>/i,
        `<link rel="alternate" type="application/rss+xml" title="${xml(site?.name || 'Fly Library')} — Fly Library" href="${basePath}/flies/rss.xml">\n` +
        `<link rel="alternate" type="application/feed+json" title="${xml(site?.name || 'Fly Library')} — Fly Library" href="${basePath}/flies/feed.json">\n` +
        '</head>'
      );
      dirty = true;
    }

    if (dirty) await writeFile(file, html);

    const title = decode(tag(html, /<title[^>]*>([\s\S]*?)<\/title>/i) || '');
    const description = decode(
      tag(html, /<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i) || ''
    );
    const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => decode(strip(m[1])));

    pages.push({ file, route, title, description, h1: h1s[0] || '', h1Count: h1s.length, isNoindex, html });
  }

  pages.sort((a, b) => a.route.localeCompare(b.route));

  /* ------------------------------------------------------ 2. dist/404 -- */

  const src404 = path.join(dist, '404', 'index.html');
  if (existsSync(src404)) {
    await copyFile(src404, path.join(dist, '404.html'));
    notes.push('404.html written to the dist root (host fallback page)');
  } else {
    warnings.push('src/pages/404.html did not emit /404/ — no dist/404.html fallback was written');
  }

  /* ------------------------------------------ 3. /search-index.json ----- */

  const typeOf = (route) => {
    if (route === '/') return 'home';
    if (/^\/flies\/[^/]+\/$/.test(route)) return 'fly';
    if (route === '/flies/') return 'library';
    return 'page';
  };

  const bySlug = new Map(flies.map((f) => [f.slug, f]));

  const indexEntries = pages
    .filter((p) => !p.isNoindex)
    .map((p) => {
      const type = typeOf(p.route);
      const entry = {
        url: p.route,
        title: p.h1 || p.title.split(' — ')[0] || p.title,
        description: p.description,
        type,
      };
      if (type === 'fly') {
        const fly = bySlug.get(p.route.split('/')[2]);
        if (fly) {
          entry.keywords = [fly.name, fly.type, fly.imitates, ...(fly.aka || []), ...(fly.tags || [])]
            .filter((v) => typeof v === 'string' && v.trim())
            .map((v) => v.trim());
        }
      }
      return entry;
    });

  await writeFile(
    path.join(dist, 'search-index.json'),
    JSON.stringify(
      {
        version: 1,
        site: site?.name ?? '',
        origin: base,
        generated: new Date().toISOString(),
        count: indexEntries.length,
        entries: indexEntries,
      },
      null,
      0
    ) + '\n'
  );

  /* ---------------------------------------------- 4. Fly Library feeds -- */

  const flyPages = pages.filter((p) => typeOf(p.route) === 'fly' && !p.isNoindex);
  const built = new Date();

  await mkdir(path.join(dist, 'flies'), { recursive: true });

  const feedItems = flyPages.map((p) => {
    const fly = bySlug.get(p.route.split('/')[2]);
    return {
      id: base + p.route,
      url: base + p.route,
      title: p.h1 || p.title.split(' — ')[0],
      summary: p.description,
      content_text: p.description,
      date_published: built.toISOString(),
      tags: [fly?.type, fly?.imitates].filter(Boolean),
    };
  });

  await writeFile(
    path.join(dist, 'flies', 'feed.json'),
    JSON.stringify(
      {
        version: 'https://jsonfeed.org/version/1.1',
        title: `${site?.name ?? 'Fly Library'} — Fly Library`,
        home_page_url: `${base}/flies/`,
        feed_url: `${base}/flies/feed.json`,
        description:
          'A free reference page for every fly in The Reel Deal Deck: what it imitates, when to fish it, and how.',
        language: 'en-US',
        icon: `${base}/icon-512.png`,
        favicon: `${base}/favicon.svg`,
        authors: (site?.founders ?? []).map((f) => ({ name: f.name })),
        items: feedItems,
      },
      null,
      2
    ) + '\n'
  );

  const rssItems = feedItems
    .map(
      (i) =>
        '    <item>\n' +
        `      <title>${xml(i.title)}</title>\n` +
        `      <link>${xml(i.url)}</link>\n` +
        `      <guid isPermaLink="true">${xml(i.id)}</guid>\n` +
        `      <description>${xml(i.summary)}</description>\n` +
        `      <pubDate>${built.toUTCString()}</pubDate>\n` +
        i.tags.map((t) => `      <category>${xml(t)}</category>\n`).join('') +
        '    </item>'
    )
    .join('\n');

  await writeFile(
    path.join(dist, 'flies', 'rss.xml'),
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n' +
      '  <channel>\n' +
      `    <title>${xml(site?.name ?? '')} — Fly Library</title>\n` +
      `    <link>${xml(base)}/flies/</link>\n` +
      `    <atom:link href="${xml(base)}/flies/rss.xml" rel="self" type="application/rss+xml"/>\n` +
      '    <description>A free reference page for every fly in The Reel Deal Deck: what it imitates, when to fish it, and how.</description>\n' +
      '    <language>en-us</language>\n' +
      `    <lastBuildDate>${built.toUTCString()}</lastBuildDate>\n` +
      `    <generator>build.mjs</generator>\n` +
      (rssItems ? rssItems + '\n' : '') +
      '  </channel>\n</rss>\n'
  );

  /* ------------------------------------------------------- 5. robots -- */

  const robotsPath = path.join(dist, 'robots.txt');
  if (existsSync(robotsPath)) {
    const before = await readFile(robotsPath, 'utf8');
    const after = before.replace(/^Sitemap:.*$/m, `Sitemap: ${base}/sitemap.xml`);
    if (after !== before) {
      await writeFile(robotsPath, after);
      notes.push(`robots.txt Sitemap pinned to ${base}/sitemap.xml`);
    }
    if (!/^Sitemap:/m.test(after)) {
      errors.push('robots.txt has no Sitemap: line');
    }
  } else {
    errors.push('robots.txt missing from dist/');
  }

  /* ---------------------------------------------- 6. CSP script hashes -- */

  const headersPath = path.join(dist, '_headers');
  if (existsSync(headersPath)) {
    const inline = new Set();
    for (const p of pages) {
      for (const m of p.html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/gi)) {
        if (/type=["']application\/ld\+json["']/i.test(m[0])) continue; // data, not code
        if (!m[1].trim()) continue;
        inline.add(m[1]);
      }
    }
    const hashes = [...inline]
      .map((code) => `'sha256-${createHash('sha256').update(code, 'utf8').digest('base64')}'`)
      .sort();

    if (hashes.length) {
      let h = await readFile(headersPath, 'utf8');
      const next = h.replace(
        /script-src 'self' 'unsafe-inline';/,
        `script-src 'self' 'unsafe-inline' ${hashes.join(' ')};`
      );
      if (next !== h) {
        await writeFile(headersPath, next);
        notes.push(
          `CSP: hashed ${hashes.length} inline script${hashes.length === 1 ? '' : 's'} into dist/_headers`
        );
      } else {
        warnings.push("dist/_headers: could not find the script-src directive to harden — CSP left as-authored");
      }
    }
  } else {
    warnings.push('_headers not present in dist/ — security headers will not ship');
  }

  /* ----------------------------------------------- 7. required assets -- */

  const required = [
    'sitemap.xml',
    'robots.txt',
    'favicon.svg',
    'apple-touch-icon.png',
    'site.webmanifest',
    (site?.defaultOgImage || '/og/default.png').replace(/^\//, ''),
  ];
  for (const rel of required) {
    if (!existsSync(path.join(dist, rel))) errors.push(`required asset missing from dist/: /${rel}`);
  }

  /* ------------------------------------------------------- 8. report --- */

  const SUFFIX = site?.name ? ` — ${site.name}` : '';
  const longTitles = pages.filter((p) => p.title.length > 60);
  const noTitle = pages.filter((p) => !p.title);
  const longDesc = pages.filter((p) => p.description.length > 160);
  const noDesc = pages.filter((p) => !p.description);
  const badH1 = pages.filter((p) => p.h1Count !== 1);

  let total = 0;
  const sized = [];
  for (const f of files) {
    const s = await stat(f);
    total += s.size;
    sized.push([path.relative(dist, f).split(path.sep).join('/'), s.size]);
  }
  sized.sort((a, b) => b[1] - a[1]);

  const L = [];
  const rule = '─'.repeat(74);
  L.push('');
  L.push(rule);
  L.push('  POSTBUILD REPORT');
  L.push(rule);
  L.push(`  routes indexed        ${routes.length}`);
  L.push(`  pages emitted         ${pages.length}  (${pages.length - routes.length} noindex)`);
  L.push(`  fly pages             ${flyPages.length}${flies.length ? ` of ${flies.length} in data/flies.json` : ''}`);
  L.push(`  search index          ${indexEntries.length} entries`);
  L.push(`  feed items            ${feedItems.length}`);
  L.push(`  dist weight           ${kb(total)} across ${files.length} files`);
  L.push('');
  L.push('  Largest files');
  for (const [f, s] of sized.slice(0, 8)) L.push(`    ${kb(s).padStart(9)}  ${f}`);

  const section = (label, rows) => {
    if (!rows.length) return;
    L.push('');
    L.push(`  ${label}`);
    for (const r of rows) L.push(`    ${r}`);
  };

  section(
    `Titles over 60 chars (${longTitles.length}) — budget is ${60 - SUFFIX.length} chars before "${SUFFIX.trim()}" is appended`,
    longTitles.slice(0, 15).map((p) => `${String(p.title.length).padStart(3)}  ${p.route}  “${p.title}”`)
  );
  section(`Pages with no <title> (${noTitle.length})`, noTitle.map((p) => p.route));
  section(
    `Meta descriptions over 160 chars (${longDesc.length})`,
    longDesc.slice(0, 15).map((p) => `${String(p.description.length).padStart(3)}  ${p.route}`)
  );
  section(`Pages with no meta description (${noDesc.length})`, noDesc.map((p) => p.route));
  section(
    `Pages without exactly one <h1> (${badH1.length})`,
    badH1.slice(0, 15).map((p) => `${p.h1Count} h1  ${p.route}`)
  );

  section('Notes', notes);
  section('Warnings', warnings);
  section('Errors', errors);

  L.push('');
  if (errors.length) {
    L.push(`  ✗ ${errors.length} error${errors.length === 1 ? '' : 's'} in generated output.`);
  } else {
    const soft = longTitles.length + noTitle.length + longDesc.length + noDesc.length + badH1.length;
    L.push(
      soft
        ? `  ⚠ output is deployable; ${soft} page-level issue${soft === 1 ? '' : 's'} to fix — run \`npm run check\` for detail.`
        : '  ✓ output is clean.'
    );
  }
  L.push(rule);
  L.push('');
  console.log(L.join('\n'));

  // Page-level SEO problems belong to `npm run check`, which is the gate.
  // Only unbuildable output stops the build here.
  if (errors.length) process.exitCode = 1;
}
