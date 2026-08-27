/* /fly-fishing-by-state/ — the hub for the state tier.
 *
 * Deliberately honest about coverage: this lists the states that actually
 * exist, and says so, rather than implying a complete set. */

import { esc } from '../templates/_shared.mjs';
import { organizationSchema } from '../templates/_blocks.mjs';

export const meta = {
  path: '/fly-fishing-by-state/',
  title: 'Fly Fishing by State',
  description:
    'Fly fishing guides by US state: what trout are there, where to fish, when to go, and what licence you need. Written state by state, not templated.',
  priority: 0.7,
  changefreq: 'monthly',
  bodyClass: 'page-states',
  ogImage: '/og/flies.png',
};

export default function ({ site, states }) {
  const base = site.url.replace(/\/$/, '');
  const list = states || [];

  meta.jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Fly fishing by state',
      description: meta.description,
      url: `${base}/fly-fishing-by-state/`,
      publisher: organizationSchema(site),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      numberOfItems: list.length,
      itemListElement: list.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: `Fly fishing in ${s.name}`,
        url: `${base}/fly-fishing-in-${s.slug}/`,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
        { '@type': 'ListItem', position: 2, name: 'Fly fishing by state', item: `${base}/fly-fishing-by-state/` },
      ],
    },
  ];

  return `
<div class="wrap">
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <a href="/">Home</a> <span aria-hidden="true">›</span>
    <span aria-current="page">Fly fishing by state</span>
  </nav>

  <header class="page-head">
    <p class="eyebrow">By state</p>
    <h1 class="h1 page-head__title">Fly fishing by state</h1>
    <p class="page-head__lede lede">
      Trout water is regional. The species, the hatches, the season and the licence rules
      all change at a state line, so these are written one state at a time &mdash; named
      rivers, a real calendar, and a link to the agency that actually issues the licence.
    </p>
  </header>
</div>

<div class="wrap">
  <div class="card-grid" style="--min:17rem;--gap:var(--s-5)">
    ${list
      .map(
        (s) => `<a class="card card--link" href="/fly-fishing-in-${esc(s.slug)}/">
      <p class="eyebrow">${esc(s.region)}</p>
      <p class="card__title">Fly fishing in ${esc(s.name)}</p>
      <p class="card__text">${esc(s.summary)}</p>
    </a>`
      )
      .join('\n    ')}
  </div>

  <p class="text-faint" style="margin-block-start:var(--s-6)">
    ${list.length === 1 ? 'One state so far.' : `${list.length} states so far.`}
    More are being written. Each one takes real research &mdash; we would rather publish
    two states worth reading than fifty with the name swapped out.
  </p>
</div>`;
}
