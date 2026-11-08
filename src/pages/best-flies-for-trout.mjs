/* ==========================================================================
   /best-flies-for-trout/ — the ranked list.
   --------------------------------------------------------------------------
   WHY THIS IS NOT ANOTHER "TOP 10 TROUT FLIES"

   Every competing list is one person's opinion dressed as a ranking. This one
   is COUNTED, at build time, from data already on this site: how many of the
   fifty state guides name the fly, and how many of the eighteen hatch pages
   list it. Both numbers are printed next to every entry so a reader can see
   the working and disagree with it.

   BE HONEST ABOUT WHAT THE NUMBER MEANS. It measures how often a pattern
   appears across our own researched pages — a proxy for consensus among the
   agencies, shops and guides those pages were written from. It is NOT a
   measurement of fish caught, and the page says so where a reader cannot miss
   it. Overclaiming here would be the one thing that makes the method worthless.

   The ranking is computed, never typed. Rewriting a state's fly list changes
   this page the next time it builds, which is the point: a hand-typed top ten
   would be wrong within a month and nobody would notice.
   ========================================================================== */

import { esc } from '../templates/_blocks.mjs';
import { flyCard } from '../templates/_shared.mjs';

const SHOWN = 12;

/* The page says TROUT, so the list has to mean it.
   The counts come from state guides, and several states are warmwater — which
   is correct for those pages and wrong for this one. Left unfiltered, a Bass
   Popper ranked eleventh on a page titled "best flies for trout", purely on
   appearances in the Louisiana and Mississippi guides. Caught by reading the
   rendered list, not the code.
   Char, grayling and steelhead count: those pages are written for the same
   angler, and a fly listed for Dolly Varden is not a bass fly. */
const TROUT = /trout|\bchar\b|grayling|steelhead|cutbow|dolly/i;
const forTrout = (fly) => (fly.targetSpecies || []).some((sp) => TROUT.test(sp));

export const meta = {
  path: '/best-flies-for-trout/',
  title: 'Best Flies for Trout',
  description:
    'The twelve trout flies that appear most often across fifty state guides and eighteen hatch charts — counted, not guessed, with the numbers shown.',
  priority: 0.9,
  changefreq: 'monthly',
  bodyClass: 'page-ranked',
};

export default function ({ site, flies, states, hatches }) {
  const base = String(site.url || '').replace(/\/$/, '');
  const bySlug = new Map((flies || []).map((f) => [f.slug, f]));

  const stateCount = new Map();
  const hatchCount = new Map();
  for (const st of states || []) {
    for (const slug of st.flies || []) stateCount.set(slug, (stateCount.get(slug) || 0) + 1);
  }
  for (const h of hatches || []) {
    for (const slug of h.flies || []) hatchCount.set(slug, (hatchCount.get(slug) || 0) + 1);
  }

  const ranked = [...new Set([...stateCount.keys(), ...hatchCount.keys()])]
    .filter((slug) => bySlug.has(slug) && forTrout(bySlug.get(slug)))
    .map((slug) => ({
      fly: bySlug.get(slug),
      states: stateCount.get(slug) || 0,
      hatches: hatchCount.get(slug) || 0,
      total: (stateCount.get(slug) || 0) + (hatchCount.get(slug) || 0),
    }))
    .sort((a, b) => b.total - a.total || b.states - a.states || a.fly.name.localeCompare(b.fly.name))
    .slice(0, SHOWN);

  const nStates = (states || []).length;
  const nHatches = (hatches || []).length;
  const topFive = ranked.slice(0, 5);

  const FAQ = [
    {
      q: 'What is the best all-round trout fly?',
      a: `By this count it is the ${ranked[0]?.fly.name}, which ${ranked[0]?.states} of our ${nStates} state guides name. That is a statement about how widely a pattern is recommended, not a promise about your river on Saturday. Local knowledge beats any national list, and a fly shop within sight of the water beats both.`,
    },
    {
      q: 'How many trout flies do I really need?',
      a: 'About a dozen patterns, in two or three sizes each, covers nearly everything a trout angler meets in a season. More sizes of fewer flies beats more flies in one size, because size is what fish refuse over first.',
    },
    {
      q: 'Is one fly enough to start with?',
      a: 'No, but three is close. A dry fly you can see, a weighted nymph, and something that moves — the first three on this list happen to be exactly that, which is less of a coincidence than it looks. Those three cover fish feeding on top, fish feeding underneath, and fish that need provoking.',
    },
    {
      q: 'Does the exact pattern matter?',
      a: 'Less than size, and much less than drift. A roughly right fly presented well out-fishes an exact imitation dragged across the current. That is the reason this list is twelve patterns rather than a hundred.',
    },
  ];

  meta.jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
        { '@type': 'ListItem', position: 2, name: 'Fly-brary', item: `${base}/flies/` },
        { '@type': 'ListItem', position: 3, name: 'Best flies for trout', item: `${base}/best-flies-for-trout/` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Best flies for trout',
      numberOfItems: ranked.length,
      itemListElement: ranked.map((r, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: r.fly.name,
        url: `${base}/flies/${r.fly.slug}/`,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ];

  const entries = ranked.map((r, i) => `
      <li class="ranked" id="${esc(r.fly.slug)}">
        <p class="ranked__rank" aria-hidden="true">${String(i + 1).padStart(2, '0')}</p>
        <div class="ranked__art">${flyCard(r.fly)}</div>
        <div class="ranked__text">
          <h3 class="ranked__name">
            <span class="visually-hidden">Number ${i + 1}: </span>
            <a href="/flies/${esc(r.fly.slug)}/">${esc(r.fly.name)}</a>
          </h3>
          <p class="ranked__counts">
            <span class="ranked__stat"><strong>${r.states}</strong> of ${nStates} state guides</span>
            <span class="ranked__stat"><strong>${r.hatches}</strong> of ${nHatches} hatches</span>
            <span class="ranked__stat ranked__stat--quiet">${esc(r.fly.cardCategory || r.fly.type)} &middot; ${esc(r.fly.sizes || '')}</span>
          </p>
          <p class="ranked__imitates">${esc(r.fly.imitates || '')}</p>
          <p class="ranked__when">${esc(r.fly.whenToFish || '')}</p>
        </div>
      </li>`).join('');

  return `
<nav class="breadcrumbs wrap" aria-label="Breadcrumb">
  <a href="/">Home</a> <span aria-hidden="true">/</span>
  <a href="/flies/">Fly-brary</a> <span aria-hidden="true">/</span>
  <span aria-current="page">Best flies for trout</span>
</nav>

<section class="section wrap">
  <div class="wrap--narrow">
    <p class="eyebrow">Counted, not guessed</p>
    <h1 class="h1">Best flies for trout</h1>
    <p class="lede">
      ${ranked.length} patterns, ranked by how often they appear across our ${nStates} state guides
      and ${nHatches} hatch pages. The top three &mdash;
      ${topFive.slice(0, 3).map((r) => esc(r.fly.name)).join(', ')} &mdash; cover fish feeding on
      top, fish feeding underneath, and fish that need provoking, which is most of trout fishing
      in three flies.
    </p>
  </div>
</section>

<!-- The method goes near the TOP, not in a footnote. It is the only reason to
     read this list rather than the forty others, and burying it would waste
     the one advantage the page has. It also states the limit plainly: this
     counts recommendations, not fish. -->
<section class="section section--sunk">
  <div class="wrap wrap--narrow">
    <h2 class="h2">How this list was made</h2>
    <p>
      Every other ranking of trout flies is somebody's opinion. This one is a count. We wrote
      ${nStates} state guides and ${nHatches} hatch pages, each researched separately, and every
      one names the flies that work there. This page adds up how often each pattern appears in
      both. The numbers are printed next to every fly so you can see the working.
    </p>
    <p class="help">
      <strong>What the number is not:</strong> it measures how often a fly is recommended across
      those sources, not how many fish it has caught. Nobody has that data, including the people
      who write lists as though they do. A shop within sight of the water you are fishing knows
      more than any national ranking, this one included.
    </p>
  </div>
</section>

<section class="section wrap">
  <h2 class="h2">The ${ranked.length}</h2>
  <ol class="ranked-list">${entries}
  </ol>
</section>

<section class="section section--sunk">
  <div class="wrap wrap--narrow">
    <h2 class="h2">If you are buying five</h2>
    <p>
      In order: ${topFive.map((r) => `<a href="/flies/${esc(r.fly.slug)}/">${esc(r.fly.name)}</a>`).join(', ')}.
      Two or three sizes of each beats one size of twice as many &mdash; size is what fish refuse
      over before they refuse a pattern.
    </p>
    <p>
      For how many to carry, how to organise them and what to do at the bin, read
      <a href="/blog/what-flies-do-i-need-to-start/">what flies a beginner actually needs</a> &mdash;
      that answers the how-many question this page deliberately leaves alone. If you already have
      flies and want to know which to tie on today, the
      <a href="/what-fly-to-use/">three-question picker</a> narrows it by conditions.
    </p>
  </div>
</section>

<section class="section wrap">
  <div class="wrap--narrow">
    <h2 class="h2">Questions about trout flies</h2>
    ${FAQ.map((f) => `
    <div class="gift-objection">
      <h3 class="gift-objection__q">${esc(f.q)}</h3>
      <div><p class="gift-objection__a">${esc(f.a)}</p></div>
    </div>`).join('')}
  </div>
</section>

<section class="section section--sunk">
  <div class="wrap">
    <h2 class="h2">Where to go next</h2>
    <div class="cx-crosslink">
      <a class="cx-crosslink__item" href="/flies/">
        <p class="cx-crosslink__name">All ${(flies || []).length} flies</p>
        <p class="cx-crosslink__body">The whole Fly-brary, searchable and filterable, free to read.</p>
      </a>
      <a class="cx-crosslink__item" href="/fly-fishing-by-state/">
        <p class="cx-crosslink__name">Your state</p>
        <p class="cx-crosslink__body">The ${nStates} guides these counts came from: seasons, species and water.</p>
      </a>
      <a class="cx-crosslink__item" href="/deck/">
        <p class="cx-crosslink__name">All of them on cards</p>
        <p class="cx-crosslink__body">Fifty-four flies, one to a card, with what each imitates.</p>
      </a>
    </div>
  </div>
</section>
`;
}
