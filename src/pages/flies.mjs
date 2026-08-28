/* /flies/ — the Fly-brary index.
   Works completely without JavaScript: all 54 flies are in the HTML, grouped
   by type under real anchors. fly-filter.js upgrades it into an instant
   filter/search in place. */

import { esc, flyCard, TYPES, TYPE_ORDER, titleCase } from '../templates/_shared.mjs';
import { campaignCta } from '../templates/_blocks.mjs';
import { TOPICS } from './blog.mjs';

export const meta = {
  path: '/flies/',
  title: 'Fly-brary: Every Fly in the Deck',
  description:
    'A free fly fishing reference: every fly in The Reel Deal Deck, what each imitates and when to fish it, plus straight answers on gear and technique.',
  priority: 0.9,
  changefreq: 'monthly',
  bodyClass: 'page-flies',
  ogImage: '/og/flies.png',
};


/* The Virtual Guide now lives here rather than in the top navigation, so this
   page is its main door. Four widest questions plus the topic list, then the
   link through to all of them. */
function virtualGuide(posts) {
  const p = Array.isArray(posts) ? posts : [];
  if (!p.length) return '';
  const want = ['what-weight-fly-rod-for-trout', 'what-flies-do-i-need-to-start',
                'nymph-rig-setup', 'why-trout-refuse-your-fly'];
  const picked = want.map((sl) => p.find((x) => x.slug === sl)).filter(Boolean);
  const featured = picked.length === 4 ? picked : p.slice(0, 4);
  /* Topic labels and links come from the TOPICS taxonomy in blog.mjs. Deriving
     slugs here produced six broken links: the topics are anchors on /blog/,
     not routes of their own. */
  const present = new Set(p.map((x) => x.topic).filter(Boolean));
  const topics = TOPICS.filter((t) => present.has(t.key));

  return `
<section class="section" id="virtual-guide" aria-labelledby="vg-h">
  <div class="wrap">
    <div class="section-head section-head--split">
      <div>
        <p class="eyebrow">The Virtual Guide</p>
        <h2 class="h2" id="vg-h">The questions that come up most</h2>
        <p class="lede">
          ${p.length} of them, each answered in its first paragraph. These four are
          the ones people arrive asking; the rest are one click further in.
        </p>
      </div>
      <p><a class="btn btn--ghost" href="/blog/">Open the Virtual Guide</a></p>
    </div>

    <div class="card-grid" style="--min:15rem;--gap:var(--s-4)">
      ${featured.map((g) => `<a class="card card--link" href="/blog/${esc(g.slug)}/">
        <p class="eyebrow">${esc(g.topic || 'Answer')}</p>
        <p class="card__title">${esc(g.question || g.title)}</p>
      </a>`).join('\n      ')}
    </div>

    ${topics.length ? `<p class="cluster" style="margin-block-start:var(--s-5);--gap:var(--s-2)">
      ${topics.map((t) => `<a class="pill" href="/blog/#${esc(t.key)}">${esc(t.label)}</a>`).join('\n      ')}
    </p>` : ''}
  </div>
</section>`;
}


const uniq = (arr) => [...new Set(arr.filter(Boolean))].sort();

export default function ({ site, flies, posts }) {
  const base = site.url.replace(/\/$/, '');

  if (!flies.length) {
    return `<div class="wrap section"><h1 class="h1">Fly-brary</h1>
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
      name: 'Fly-brary',
      description: meta.description,
      url: `${base}/flies/`,
      isPartOf: { '@type': 'WebSite', name: site.name, url: site.url },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Every fly in The Reel Deal Deck',
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
        { '@type': 'ListItem', position: 2, name: 'Fly-brary', item: `${base}/flies/` },
      ],
    },
  ];
  meta.jsonld = jsonld;

  return `
<div class="wrap">
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <a href="/">Home</a> <span aria-hidden="true">›</span>
    <span aria-current="page">Fly-brary</span>
  </nav>

  <header class="page-head">
    <!-- No count here on purpose. The deck is marketed as 54 unique cards
         (52 standard + 2 jokers) — the industry-standard figure on the tuck
         box — while the library also carries the bonus card. Stating a library
         total would contradict the product claim, so it states neither. -->
    <p class="eyebrow">Free reference &middot; no sign-up, no paywall</p>
    <h1 class="h1 page-head__title">The Fly-brary</h1>
    <p class="page-head__lede lede">
      Everything we know about fly fishing, in one place and free. Ken built this deck
      because he wanted to learn the flies himself, so it would be a bit rich to charge
      you for the same thing. Two ways in.
    </p>
  </header>
</div>

<!-- The fork. This page is a hub, and the two things a reader wants from it —
     a fly, or an answer about fishing one — live in different places: the fly
     list is below, the Virtual Guide is at /blog/. Saying so at the top beats
     making them scroll to find out. -->
<div class="wrap">
  <ul class="hub" aria-label="Choose where to start">
    <li class="hub__door">
      <a class="hub__link" href="#the-flies">
        <span class="hub__index" aria-hidden="true">A&#9830;</span>
        <span class="hub__title">The flies</span>
        <span class="hub__text">
          Every pattern in the deck, one page each: what it imitates, what sizes to
          carry, and when it earns its place in your box. Search and filter them below.
        </span>
        <span class="hub__go" aria-hidden="true">Start here &rarr;</span>
      </a>
    </li>
    <li class="hub__door">
      <a class="hub__link" href="/blog/">
        <span class="hub__index" aria-hidden="true">K&#9827;</span>
        <span class="hub__title">The Virtual Guide</span>
        <span class="hub__text">
          Everything that is not a fly: which rod, which tippet, how to rig it, where
          to stand, and why the fish keep refusing you. One question per answer.
        </span>
        <span class="hub__go" aria-hidden="true">Open the guide &rarr;</span>
      </a>
    </li>
  </ul>
</div>

<div class="wrap library" id="the-flies">
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

${virtualGuide(posts)}

<section class="section section--sunk">
  <div class="wrap wrap--narrow text-center stack" style="--gap:var(--s-4)">
    <p class="eyebrow">Why this exists</p>
    <h2 class="h2">The library is free. The deck is the version you can deal out.</h2>
    <p class="lede">
      Every fly above is a card in ${esc(site.name)} — ${site.product.cardCount} originals,
      drawn by hand in ${esc(site.location.city)}, ${esc(site.location.regionName)}, and
      printed on ${esc(site.product.stock)}.
    </p>
    <p class="cluster" style="justify-content:center">
      ${campaignCta(site)}
      <a class="btn btn--ghost" href="/gifts/">Buying it as a gift</a>
    </p>
    <p class="text-muted" style="margin-block-start:var(--s-5)">
      Scrolled the whole list and yours is not in it?
      <a href="/suggest/">Tell us what we missed</a> &mdash; Volume 2 is not written yet.
    </p>
  </div>
</section>

<script type="application/json" id="fly-index">${JSON.stringify(index).replace(/</g, '\\u003c')}</script>
<script src="/js/fly-filter.js" defer></script>`;
}
