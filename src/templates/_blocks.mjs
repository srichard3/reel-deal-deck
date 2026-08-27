/* ==========================================================================
   THE REEL DEAL DECK — blog block vocabulary  (`b` inside an article)
   --------------------------------------------------------------------------
   Articles never hand-roll markup. They compose from these helpers, so every
   post is structurally identical and therefore reliably extractable by a
   search engine or an answer engine.

   The second job of this file is to make schema impossible to fake: every
   helper that has a matching schema type (answer, faq, steps) *records what it
   actually rendered* on `b.collected`. src/templates/post.mjs builds JSON-LD
   from that record, never from a parallel copy of the content. If it is not on
   the page, it cannot get into the schema.

   Zero dependencies. Node built-ins only (and not even those).
   ========================================================================== */

export const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * Block helpers take *inline HTML*, not plain text — an article legitimately
 * writes `<strong>5wt</strong>` or `&ndash;` inside a table cell or a step.
 * Escaping that produces visible tag soup; not escaping it leaves a naked `&`
 * as invalid markup. So: pass markup and entities through, and repair only an
 * ampersand that is not already the start of one.
 */
export const inline = (s) =>
  String(s ?? '').replace(/&(?![a-zA-Z][a-zA-Z0-9]{1,9};|#\d{1,7};|#[xX][0-9a-fA-F]{1,6};)/g, '&amp;');

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ensp: ' ', emsp: ' ', thinsp: ' ',
  ndash: '–', mdash: '—', hellip: '…', lsquo: '‘', rsquo: '’',
  ldquo: '“', rdquo: '”', times: '×', deg: '°', middot: '·',
  bull: '•', frac12: '½', frac14: '¼', frac34: '¾', prime: '′',
  Prime: '″', trade: '™', reg: '®', copy: '©', permil: '‰',
};

/**
 * Strip tags, decode entities and collapse whitespace.
 * This is what goes into JSON-LD: schema values must be readable text, not
 * markup, and must say exactly what the rendered page says.
 */
export const plain = (s) =>
  String(s ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&#[xX]([0-9a-fA-F]+);/g, (m, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (m, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-zA-Z][a-zA-Z0-9]{1,9});/g, (m, name) =>
      Object.prototype.hasOwnProperty.call(ENTITIES, name) ? ENTITIES[name] : m)
    .replace(/\s+/g, ' ')
    .trim();

/** Words in a string of prose or HTML. */
export const wordCount = (s) => (plain(s).match(/\S+/g) || []).length;

/**
 * Truncate on a word boundary, appending an ellipsis, so an over-budget title
 * or description from an article degrades instead of failing the build.
 * Returns the input untouched when it already fits.
 */
export function clamp(s, max) {
  const str = String(s ?? '').trim();
  if (str.length <= max) return str;
  const cut = str.slice(0, max - 1);
  const space = cut.lastIndexOf(' ');
  return (space > max * 0.5 ? cut.slice(0, space) : cut).replace(/[\s,;:.\-—–]+$/, '') + '…';
}

/** URL/anchor-safe slug. Stable for the same input, which is the whole point:
    a section anchor is a permanent address an AI answer can cite. */
export function slugify(s) {
  return String(s ?? '')
    .toLowerCase()
    .replace(/[’'"]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64) || 'section';
}

/** "pheasant-tail-nymph" -> "Pheasant Tail Nymph" (fallback for unknown flies) */
const deslug = (s) =>
  String(s ?? '')
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

/* ------------------------------------------------------------- campaign -- */

/**
 * Resolve `site.campaign` against build time. One place, one decision.
 *
 * Returns the flat, already-chosen values the campaign bar and the in-content
 * CTAs render — never the raw live/after branches — so no template, partial or
 * article ever has to know the campaign end date, and none of them can drift
 * out of sync with another.
 */
/* A ready-made call to action for the campaign, in whatever state it is in.
   Every campaign link on the site should come through here rather than
   hard-coding the Kickstarter URL, so that on 20 September the whole site
   stops pointing at a finished campaign without anyone editing a page. */
export function campaignCta(site, { variant = 'primary', label = null, now = new Date() } = {}) {
  const c = campaignState(site, now);
  const cls = variant === 'ghost' ? 'btn btn--ghost' : 'btn btn--primary';
  const ext = c.external
    ? ' target="_blank" rel="noopener"'
    : '';
  const hint = c.external
    ? '<span class="visually-hidden"> (opens Kickstarter in a new tab)</span>'
    : '';
  return `<a class="${cls}" href="${esc(c.url)}"${ext} data-campaign-cta="${esc(c.key)}">${esc(label || c.cta)}${hint}</a>`;
}

/* A one-line inline sentence for use inside prose, again state-aware. */
export function campaignLine(site, now = new Date()) {
  const c = campaignState(site, now);
  const ext = c.external ? ' target="_blank" rel="noopener"' : '';
  return c.live
    ? `The deck is funding on ${esc(c.platform || 'Kickstarter')} right now &mdash; <a href="${esc(c.url)}"${ext} data-campaign-cta="live">${esc(c.cta)}</a>.`
    : `<a href="${esc(c.url)}" data-campaign-cta="after">${esc(c.cta)}</a> and we will email you the day it ships.`;
}

export function campaignState(site, now = new Date()) {
  const c = (site && site.campaign) || {};
  const endsAt = c.endsAt ? new Date(c.endsAt) : null;
  const ended = endsAt instanceof Date && !Number.isNaN(endsAt.valueOf()) ? now >= endsAt : false;
  const live = c.active !== false && !ended;
  const copy = (live ? c.live : c.after) || {};

  return {
    live,
    key: live ? 'live' : 'after',
    platform: c.platform || '',
    eyebrow: copy.eyebrow || (live ? 'Live now' : 'Coming soon'),
    headline: copy.headline || '',
    sub: copy.sub || '',
    cta: copy.cta || (live ? 'Back the deck' : 'Reserve a deck'),
    // `after` carries its own on-site URL; `live` uses the campaign URL.
    url: copy.url || (live ? c.url : '/deck/#reserve') || '/deck/#reserve',
    external: /^https?:\/\//i.test(copy.url || (live ? c.url : '') || ''),
  };
}

/* --------------------------------------------------------------- blocks -- */

/**
 * Build a fresh block vocabulary for one article.
 *
 * @param {object}   opts
 * @param {Array}    opts.flies  data/flies.json, for b.flyLink
 * @returns {object} the `b` object handed to an article's default export
 */
export function makeBlocks({ flies = [] } = {}) {
  const bySlug = new Map((Array.isArray(flies) ? flies : []).map((f) => [f.slug, f]));

  /* What was actually rendered. post.mjs reads this to build schema and to
     avoid rendering a second copy of anything the article already emitted. */
  const collected = {
    answer: null,
    takeaways: [],
    steps: [],      // flat [{ name, text }]
    faqs: [],       // flat [{ q, a }]
    sections: [],   // [{ id, heading }] — the page's own table of contents
    sources: [],
    flyLinks: [],   // fly slugs actually linked
    tables: 0,
  };

  const usedIds = new Set();
  const uniqueId = (base) => {
    let id = base;
    let n = 2;
    while (usedIds.has(id)) id = `${base}-${n++}`;
    usedIds.add(id);
    return id;
  };

  const b = {
    collected,

    esc,
    slugify,

    /* --- structure ---------------------------------------------------- */

    /**
     * A self-contained `<h2>` section with a permanent anchor.
     * Deep links are how featured snippets and AI answers cite one specific
     * answer on a page, so every section gets a real, stable id.
     */
    section(heading, html = '', opts = {}) {
      const id = uniqueId(opts.id ? slugify(opts.id) : slugify(heading));
      collected.sections.push({ id, heading: plain(heading) });
      return `
<section class="post-section" id="${esc(id)}-section" aria-labelledby="${esc(id)}">
  <h2 class="post-h2" id="${esc(id)}">${heading}</h2>
  ${html}
</section>`;
    },

    /**
     * The answer-first block. 40–60 words, directly under the h1, before any
     * preamble. Rendered by post.mjs from `meta.answer`; an article may call it
     * directly, in which case post.mjs defers to this copy.
     */
    answer(text) {
      const t = String(text ?? '').trim();
      if (!t) return '';
      collected.answer = plain(t);
      return `
<div class="aeo-answer" data-aeo-answer>
  <p class="aeo-answer__label">Short answer</p>
  <p class="aeo-answer__text">${inline(t)}</p>
</div>`;
    },

    /** "Key takeaways" — the block an answer engine lifts when it wants bullets. */
    takeaways(items = []) {
      const list = (Array.isArray(items) ? items : [items]).map((s) => String(s ?? '').trim()).filter(Boolean);
      if (!list.length) return '';
      collected.takeaways = list.map(plain);
      return `
<aside class="aeo-takeaways" data-aeo-takeaways aria-labelledby="key-takeaways">
  <h2 class="aeo-takeaways__title post-h2" id="key-takeaways">Key takeaways</h2>
  <ul class="aeo-takeaways__list">
    ${list.map((t) => `<li>${inline(t)}</li>`).join('\n    ')}
  </ul>
</aside>`;
    },

    /* --- extractable facts -------------------------------------------- */

    /**
     * A real `<table>` in a horizontally scrollable container. Wide comparison
     * tables are the single most-quoted element on a page; they must never be
     * the reason a phone gets a horizontal scrollbar on the whole document.
     */
    table(headers = [], rows = [], caption = '') {
      const head = (Array.isArray(headers) ? headers : []).map((h) => String(h ?? ''));
      const body = (Array.isArray(rows) ? rows : []).filter((r) => Array.isArray(r));
      if (!head.length && !body.length) return '';
      collected.tables += 1;
      const label = caption ? plain(caption) : head.filter(Boolean).join(', ');
      return `
<div class="post-tablewrap" role="region" tabindex="0" aria-label="${esc(label || 'Comparison table')} (scrollable)">
  <table class="post-table">
    ${caption ? `<caption class="post-table__caption">${inline(caption)}</caption>` : ''}
    ${head.length ? `<thead><tr>${head.map((h) => `<th scope="col">${inline(h)}</th>`).join('')}</tr></thead>` : ''}
    <tbody>
      ${body
        .map(
          (r) =>
            `<tr>${r
              .map((cell, i) =>
                i === 0
                  ? `<th scope="row">${inline(cell)}</th>`
                  : `<td>${inline(cell)}</td>`
              )
              .join('')}</tr>`
        )
        .join('\n      ')}
    </tbody>
  </table>
</div>`;
    },

    /**
     * Numbered steps as a real `<ol>`. The step data is recorded on
     * `b.collected.steps` so post.mjs can build HowTo schema from the exact
     * text on the page rather than from a second copy in the front matter.
     */
    steps(steps = []) {
      const list = (Array.isArray(steps) ? steps : [])
        .map((s) => (typeof s === 'string' ? { name: s, text: '' } : s || {}))
        .map((s) => ({ name: String(s.name ?? '').trim(), text: String(s.text ?? '').trim() }))
        .filter((s) => s.name || s.text);
      if (!list.length) return '';
      for (const s of list) collected.steps.push({ name: plain(s.name), text: plain(s.text || s.name) });
      return `
<ol class="post-steps" data-aeo-steps>
  ${list
    .map(
      (s) => `<li class="post-steps__item">
    ${s.name ? `<p class="post-steps__name">${inline(s.name)}</p>` : ''}
    ${s.text ? `<p class="post-steps__text">${inline(s.text)}</p>` : ''}
  </li>`
    )
    .join('\n  ')}
</ol>`;
    },

    /**
     * Visible Q&A. post.mjs generates the FAQPage schema from
     * `b.collected.faqs`, i.e. from exactly these questions and answers —
     * schema for invisible content is a manual action waiting to happen.
     */
    faq(faqs = [], opts = {}) {
      const list = (Array.isArray(faqs) ? faqs : [])
        .map((f) => ({ q: String(f?.q ?? '').trim(), a: String(f?.a ?? '').trim() }))
        .filter((f) => f.q && f.a);
      if (!list.length) return '';
      for (const f of list) collected.faqs.push({ q: plain(f.q), a: plain(f.a) });
      const title = opts.title || 'Frequently asked questions';
      return `
<section class="post-faq" id="faq" data-aeo-faq aria-labelledby="faq-h">
  <h2 class="post-h2" id="faq-h">${esc(title)}</h2>
  <div class="post-faq__list">
    ${list
      .map(
        (f, i) => `<div class="post-faq__item">
      <h3 class="post-faq__q" id="faq-${i + 1}">${inline(f.q)}</h3>
      <div class="post-faq__a"><p>${inline(f.a)}</p></div>
    </div>`
      )
      .join('\n    ')}
  </div>
</section>`;
    },

    /* --- callouts ------------------------------------------------------ */

    note(html = '') {
      const t = String(html ?? '').trim();
      if (!t) return '';
      return `<aside class="notice notice--info post-note">${/<\w/.test(t) ? inline(t) : `<p>${inline(t)}</p>`}</aside>`;
    },

    warn(html = '') {
      const t = String(html ?? '').trim();
      if (!t) return '';
      return `<aside class="notice post-note post-note--warn" role="note">${
        /<\w/.test(t) ? inline(t) : `<p>${inline(t)}</p>`
      }</aside>`;
    },

    /* --- the internal-link engine -------------------------------------- */

    /**
     * Link into the Fly Library. The blog never re-explains a pattern — the
     * Fly Library owns those queries — so a mention becomes a link.
     * An unknown slug renders as plain text and does NOT break the build:
     * an article may legitimately be written before the fly is verified.
     */
    flyLink(slug, label) {
      const key = String(slug ?? '').trim();
      const fly = bySlug.get(key);
      if (!fly) {
        return `<span class="post-flyref">${esc(label || deslug(key))}</span>`;
      }
      if (!collected.flyLinks.includes(fly.slug)) collected.flyLinks.push(fly.slug);
      return `<a class="post-flylink" href="/flies/${esc(fly.slug)}/">${esc(label || fly.name)}</a>`;
    },

    /** Rendered source list. Regulations, biology and safety claims need one. */
    sources(list = []) {
      const items = (Array.isArray(list) ? list : [])
        .map((s) => ({ label: String(s?.label ?? '').trim(), url: String(s?.url ?? '').trim() }))
        .filter((s) => s.label);
      if (!items.length) return '';
      for (const s of items) collected.sources.push(s);
      return `
<section class="post-sources" id="sources" data-aeo-sources aria-labelledby="sources-h">
  <h2 class="post-h2" id="sources-h">Sources</h2>
  <ol class="post-sources__list">
    ${items
      .map(
        (s) =>
          `<li>${
            /^https:\/\//i.test(s.url)
              ? `<a href="${esc(s.url)}" rel="noopener">${inline(s.label)}</a>`
              : s.url && s.url.startsWith('/')
              ? `<a href="${esc(s.url)}">${inline(s.label)}</a>`
              : inline(s.label)
          }</li>`
      )
      .join('\n    ')}
  </ol>
</section>`;
    },
  };

  return b;
}

/**
 * A default vocabulary with no fly data bound.
 * `b.flyLink` degrades to plain text; everything else is identical. Real pages
 * always go through makeBlocks({ flies }) — this exists so the helpers can be
 * imported and unit-poked without loading data/flies.json.
 */
export const blocks = makeBlocks();

export default blocks;
