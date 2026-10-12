/* /hatches/ — the hub for the entomology tier.
 *
 * Grouped by what the insect actually is rather than listed alphabetically,
 * because an angler standing in a river is asking "what is that" and the
 * answer starts with mayfly, caddis or stonefly. */

import { esc } from '../templates/_shared.mjs';
import { organizationSchema } from '../templates/_blocks.mjs';

export const meta = {
  path: '/hatches/',
  title: 'Hatches and What Trout Eat',
  description:
    'Every major trout hatch explained: what it is, when it happens, what size to fish and which flies imitate it. Mayflies, caddis, stoneflies, midges and more.',
  priority: 0.7,
  changefreq: 'monthly',
  bodyClass: 'page-hatches',
  ogImage: '/og/flies.png',
};

const GROUP_ORDER = ['Mayfly', 'Caddisfly', 'Stonefly', 'Midge', 'Terrestrial', 'Crustacean', 'Baitfish', 'Other'];

const GROUP_BLURB = {
  Mayfly: 'Upright wings, two or three tails, and the insects most fly fishing writing is about. Four life stages, and trout often key on one of them.',
  Caddisfly: 'Tent-shaped wings and a moth-like flutter. More numerous than mayflies in most rivers, and the rising pupa is the stage anglers miss.',
  Stonefly: 'Big, flat-winged and crawling to the bank to hatch rather than emerging on the water. The largest insects a trout eats.',
  Midge: 'Small enough to be ignored and important enough to carry winter fishing on its own.',
  Terrestrial: 'Land insects that fall in by accident. No hatch to time, and the best fishing of late summer.',
  Crustacean: 'No hatch, no season, available every day of the year on the waters that hold them.',
  Baitfish: 'The largest regular meal a trout gets, and the reason streamer fishing exists.',
  Other: 'Food that is not an insect at all, and some of it catches the biggest fish of the year.',
};

export default function ({ site, hatches }) {
  const base = site.url.replace(/\/$/, '');
  const list = hatches || [];

  meta.jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Hatches and what trout eat',
      description: meta.description,
      url: `${base}/hatches/`,
      publisher: organizationSchema(site),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      numberOfItems: list.length,
      itemListElement: list.map((h, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: h.name,
        url: `${base}/hatches/${h.slug}/`,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
        { '@type': 'ListItem', position: 2, name: 'Hatches', item: `${base}/hatches/` },
      ],
    },
  ];

  const groups = GROUP_ORDER
    .map((g) => [g, list.filter((h) => h.group === g)])
    .filter(([, items]) => items.length);

  return `
<div class="wrap">
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <a href="/">Home</a> <span aria-hidden="true">›</span>
    <span aria-current="page">Hatches</span>
  </nav>

  <header class="page-head">
    <p class="eyebrow">Entomology</p>
    <h1 class="h1 page-head__title">Hatches and what trout eat</h1>
    <p class="page-head__lede lede">
      A trout does not eat flies, it eats insects &mdash; and the fly only matters because
      it resembles one. These pages cover what each insect is, when it appears, what size
      to fish, and which cards in the deck imitate it. Where a hatch defines a season on a
      particular river, the state pages say so and these pages link back.
    </p>
  </header>
</div>

<div class="wrap">
  ${groups.map(([group, items]) => `
  <section class="state-section" aria-labelledby="g-${esc(group.toLowerCase())}">
    <h2 class="h2" id="g-${esc(group.toLowerCase())}">${esc(group)}${items.length > 1 ? 's' : ''}</h2>
    <p class="lede">${esc(GROUP_BLURB[group] || '')}</p>
    <div class="card-grid" style="--min:17rem;--gap:var(--s-5)">
      ${items.map((h) => `<a class="card card--link" href="/hatches/${esc(h.slug)}/">
        <p class="eyebrow">${esc(h.size)}</p>
        <p class="card__title">${esc(h.name)}</p>
        <p class="card__text">${esc(h.summary)}</p>
      </a>`).join('\n      ')}
    </div>
  </section>`).join('\n  ')}

  <p class="text-faint" style="margin-block-start:var(--s-6)">
    ${list.length} entries. Emergence dates move with latitude, altitude and the weather of
    a given year &mdash; these pages give the shape of a season, not a diary. A local shop
    report is worth more than any calendar in the week you actually travel.
  </p>
</div>`;
}
