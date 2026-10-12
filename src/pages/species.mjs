/* /species/ — the hub for the identification tier.
 *
 * Grouped by what the fish actually is rather than by how anglers talk about
 * it, because three of the fish most people call trout are char and one is a
 * grayling. Saying so is the whole point of the page. */

import { esc } from '../templates/_shared.mjs';
import { organizationSchema } from '../templates/_blocks.mjs';

export const meta = {
  path: '/species/',
  title: 'Trout Species',
  description:
    'How to identify every trout, char and grayling in North America: field marks, native range, conservation status, what they eat and how to catch them.',
  priority: 0.7,
  changefreq: 'monthly',
  bodyClass: 'page-species-hub',
  ogImage: '/og/flies.png',
};

const FAMILY_ORDER = ['Trout', 'Char', 'Grayling', 'Whitefish', 'Hybrid'];

const FAMILY_BLURB = {
  Trout: 'True trout: dark spots on a light body. Rainbow, brown, cutthroat and golden, plus the sea-run form of the rainbow.',
  Char: 'Not trout at all, and patterned the other way round — pale spots on a dark body. Brook trout, lake trout, bull trout and Dolly Varden are all char.',
  Grayling: 'A salmonid, but neither trout nor char. One species, one unmistakable fin.',
  Whitefish: 'Native where the trout were introduced, abundant, and unfairly ignored.',
  Hybrid: 'A cross that does not reproduce, stocked deliberately for what it does to a lake.',
};

export default function ({ site, speciesList }) {
  const base = site.url.replace(/\/$/, '');
  const list = speciesList || [];

  meta.jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Trout species',
      description: meta.description,
      url: `${base}/species/`,
      publisher: organizationSchema(site),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      numberOfItems: list.length,
      itemListElement: list.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: s.name,
        url: `${base}/species/${s.slug}/`,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
        { '@type': 'ListItem', position: 2, name: 'Trout species', item: `${base}/species/` },
      ],
    },
  ];

  const groups = FAMILY_ORDER
    .map((g) => [g, list.filter((s) => s.family === g)])
    .filter(([, items]) => items.length);

  return `
<div class="wrap">
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <a href="/">Home</a> <span aria-hidden="true">›</span>
    <span aria-current="page">Trout species</span>
  </nav>

  <header class="page-head">
    <p class="eyebrow">Identification</p>
    <h1 class="h1 page-head__title">Trout species</h1>
    <p class="page-head__lede lede">
      What did you just catch, where does it live, and is it protected. Field marks first,
      because that is the question people actually have with a fish in the net &mdash; and
      then range, status, diet and method. Three of the fish most anglers call trout are
      char, and one of them may not be fished for at all in most of its range.
    </p>
  </header>
</div>

<div class="wrap">
  ${groups.map(([family, items]) => `
  <section class="state-section" aria-labelledby="f-${esc(family.toLowerCase())}">
    <h2 class="h2" id="f-${esc(family.toLowerCase())}">${esc(family)}</h2>
    <p class="lede">${esc(FAMILY_BLURB[family] || '')}</p>
    <div class="card-grid" style="--min:17rem;--gap:var(--s-5)">
      ${items.map((s) => `<a class="card card--link" href="/species/${esc(s.slug)}/">
        <p class="eyebrow"><em>${esc(s.scientific)}</em></p>
        <p class="card__title">${esc(s.name)}</p>
        <p class="card__text">${esc(s.summary)}</p>
      </a>`).join('\n      ')}
    </div>
  </section>`).join('\n  ')}

  <p class="text-faint" style="margin-block-start:var(--s-6)">
    ${list.length} species. Conservation status and the rules that follow from it are set
    state by state and change &mdash; bull trout in particular may not be targeted on most
    waters, and are easily confused with Dolly Varden. Check the regulations for the water
    you are on before you fish.
  </p>
</div>`;
}
