/* /flies/ — the Fly Library index.
   Works completely without JavaScript: all 54 flies are in the HTML, grouped
   by type under real anchors. fly-filter.js upgrades it into an instant
   filter/search in place. */

import { esc, flyCard, TYPES, TYPE_ORDER, titleCase } from '../templates/_shared.mjs';

export const meta = {
  path: '/flies/',
  title: 'Fly Library: 54 Trout Flies Explained',
  description:
    'A free reference to 54 classic trout flies — what each one imitates, what sizes to carry, and when to fish it. No sign-up, no paywall.',
  priority: 0.9,
  changefreq: 'monthly',
  bodyClass: 'page-flies',
  ogImage: '/og/flies.png',
};

const uniq = (arr) => [...new Set(arr.filter(Boolean))].sort();

export default function ({ site, flies }) {
  const base = site.url.replace(/\/$/, '');

  if (!flies.length) {
    return `<div class="wrap section"><h1 class="h1">Fly Library</h1>
      <p class="lede">No fly data yet.</p></div>`;
  }

  const groups = TYPE_ORDER
    .map((t) => ({ type: t, meta: TYPES[t], items: flies.filter((f) => f.type === t) }))
    .filter((g) => g.items.length);

  const allSeasons = uniq(flies.flatMap((f) => f.seasons || []));
  const allWaters = uniq(flies.flatMap((f) => f.waters || []));
  const allSpecies = uniq(flies.flatMap((f) => f.targetSpecies || []));

  /* Compact index for the client-side filter — deliberately excludes body copy
     so this stays a few kB, not a few hundred. */
  const index = flies.map((f) => ({
    s: f.slug, n: f.name, t: f.type, i: f.imitates,
    se: f.seasons || [], w: f.waters || [], sp: f.targetSpecies || [],
    d: f.difficulty || '', k: [...(f.aka || []), ...(f.searchTerms || [])].join(' '),
  }));

  const opt = (v) => `<option value="${esc(v)}">${esc(titleCase(v))}</option>`;

  const jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Fly Library',
      description: meta.description,
      url: `${base}/flies/`,
      isPartOf: { '@type': 'WebSite', name: site.name, url: site.url },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'The 54 flies of The Reel Deal Deck',
      numberOfItems: flies.length,
      itemListElement: flies.map((f, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: f.name,
        url: `${base}/flies/${f.slug}/`,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
        { '@type': 'ListItem', position: 2, name: 'Fly Library', item: `${base}/flies/` },
      ],
    },
  ];
  meta.jsonld = jsonld;

  return `
<div class="wrap">
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <a href="/">Home</a> <span aria-hidden="true">›</span>
    <span aria-current="page">Fly Library</span>
  </nav>

  <header class="page-head">
    <p class="eyebrow">Free reference · ${flies.length} flies</p>
    <h1 class="h1 page-head__title">The Fly Library</h1>
    <p class="page-head__lede lede">
      Every fly in the deck, explained properly: what it imitates, what sizes to carry,
      when it earns its place in your box. No sign-up, no paywall, no email gate —
      if it helps you catch a fish, that is the point.
    </p>
  </header>
</div>

<div class="wrap library">
  <form class="library-filters" data-fly-filter hidden>
    <div class="library-filters__row">
      <div class="field library-filters__search">
        <label class="label" for="fly-q">Search flies</label>
        <input class="input" type="search" id="fly-q" name="q" autocomplete="off"
               placeholder="Try “mayfly”, “winter”, “beginner”, “Adams”…">
      </div>
      <div class="field">
        <label class="label" for="fly-type">Type</label>
        <select class="input" id="fly-type" name="type">
          <option value="">All types</option>
          ${groups.map((g) => `<option value="${esc(g.type)}">${esc(g.meta.plural)}</option>`).join('\n          ')}
        </select>
      </div>
      <div class="field">
        <label class="label" for="fly-season">Season</label>
        <select class="input" id="fly-season" name="season">
          <option value="">Any season</option>
          ${allSeasons.map(opt).join('\n          ')}
        </select>
      </div>
      <div class="field">
        <label class="label" for="fly-water">Water</label>
        <select class="input" id="fly-water" name="water">
          <option value="">Any water</option>
          ${allWaters.map(opt).join('\n          ')}
        </select>
      </div>
      <div class="field">
        <label class="label" for="fly-species">Target</label>
        <select class="input" id="fly-species" name="species">
          <option value="">Any species</option>
          ${allSpecies.map(opt).join('\n          ')}
        </select>
      </div>
      <button class="btn btn--quiet library-filters__reset" type="reset">Reset</button>
    </div>
    <p class="library-status" data-fly-status role="status" aria-live="polite"></p>
  </form>

  <p class="library-empty" data-fly-empty hidden>
    Nothing matches that combination. <button class="btn btn--quiet btn--sm" type="button" data-fly-clear>Clear filters</button>
  </p>

  ${groups
    .map(
      (g) => `
  <section class="library-group" id="${esc(g.meta.anchor)}" data-fly-group="${esc(g.type)}">
    <div class="section-head section-head--split">
      <h2 class="h2">${esc(g.meta.plural)}</h2>
      <p class="text-faint"><span data-fly-count>${g.items.length}</span> in the deck</p>
    </div>
    <div class="card-grid fly-strip" style="--gap:var(--s-4)">
      ${g.items.map((f) => flyCard(f)).join('\n      ')}
    </div>
  </section>`
    )
    .join('\n')}
</div>

<section class="section section--sunk">
  <div class="wrap wrap--narrow text-center stack" style="--gap:var(--s-4)">
    <p class="eyebrow">Why this exists</p>
    <h2 class="h2">The library is free. The deck is the version you can deal out.</h2>
    <p class="lede">
      Every fly above is a card in ${esc(site.name)} — ${site.product.cardCount} originals,
      hand-drawn, printed on ${esc(site.product.stock)}.
    </p>
    <p class="cluster" style="justify-content:center">
      <a class="btn btn--primary" href="/deck/#reserve">Reserve a deck</a>
      <a class="btn btn--ghost" href="/gifts/">Buying it as a gift</a>
    </p>
  </div>
</section>

<script type="application/json" id="fly-index">${JSON.stringify(index).replace(/</g, '\\u003c')}</script>
<script src="/js/fly-filter.js" defer></script>`;
}
