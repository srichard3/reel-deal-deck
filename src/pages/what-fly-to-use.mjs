/* /what-fly-to-use/ — the fly picker.
 *
 * Every recommendation on this page comes out of data/flies.json, which was
 * transcribed from the printed cards and checked. NOTHING here is a judgement
 * this file makes about which fly suits which day: the page maps an answer onto
 * fields that already exist (`type`, `seasons`, `difficulty`) and shows what
 * matches. If a recommendation looks wrong, the fly's record is wrong — fix it
 * there and this page follows.
 *
 * The three questions were chosen by what actually PARTITIONS the data, not by
 * what sounds like a good question. Water type and target species both sound
 * obvious and are useless here: 53 of 55 flies are tagged `river` and 54 are
 * tagged for rainbow trout, so asking either returns almost the whole library
 * and teaches nobody anything. Season, situation and difficulty cut it to
 * between 4 and 20, which is a shortlist somebody can actually use.
 *
 * SITUATION maps onto `type`, and the mapping is exhaustive — every one of the
 * ten types in flies.json is reachable from exactly one situation, so no fly is
 * unreachable and none of them is orphaned by a filter. Check that again if a
 * new type is ever added.
 */
import { flyCard } from '../templates/_shared.mjs';
import { esc } from '../templates/_blocks.mjs';

/* type -> the situation an angler is actually in when they reach for it */
const SITUATIONS = [
  { id: 'rising',  label: 'Fish are rising',            types: ['dry', 'emerger'],
    hint: 'Something is coming off and fish are taking it on top.' },
  { id: 'nothing', label: 'Nothing showing',            types: ['nymph', 'wet', 'egg', 'worm'],
    hint: 'No rises, no insects. Most of the time, this is the honest answer.' },
  { id: 'tiny',    label: 'Tiny insects, fussy fish',   types: ['midge', 'emerger'],
    hint: 'Specks on the water and refusals to anything bigger.' },
  { id: 'cover',   label: 'Covering water for a big one', types: ['streamer', 'popper'],
    hint: 'Moving fast, swinging or stripping, looking for one good fish.' },
  { id: 'hoppers', label: 'Hot day, grassy banks',      types: ['terrestrial'],
    hint: 'Late summer, wind on the meadow, nothing hatching.' },
];

const SEASONS = ['spring', 'summer', 'fall', 'winter'];

/* What to say when a combination legitimately has no answer. These are not
   error messages — they are the page's most useful sentences. "Nothing rises in
   January" is a real thing to learn, and a picker that said "no results" would
   have thrown away the teaching. */
const NOTHING = {
  'rising|winter': 'Almost nothing rises in winter outside a tailwater. Try <strong>nothing showing</strong> — the fish are still eating, just not where you can see it.',
  'hoppers|winter': 'There are no hoppers in winter, and no beetles either. Try <strong>nothing showing</strong>.',
  'hoppers|spring': 'Terrestrials are a late-summer game. In spring, try <strong>nothing showing</strong> or <strong>fish are rising</strong>.',
};

function situationsFor(fly) {
  return SITUATIONS.filter((s) => s.types.includes(fly.type)).map((s) => s.id);
}

export const meta = {
  path: '/what-fly-to-use/',
  title: 'What Fly Should I Use?',
  description:
    'Answer three questions about the water in front of you and get a short list of flies that fit, with what each one imitates and how to fish it.',
  priority: 0.9,
  changefreq: 'monthly',
  bodyClass: 'page-picker',
};

export default function ({ site, flies }) {
  const base = String(site.url || '').replace(/\/$/, '');

  const FAQ = [
    {
      q: 'What fly should I use if nothing is hatching?',
      a: 'A nymph, nearly always. Trout take the overwhelming majority of their food under the surface, so "nothing is happening" usually means "nothing is happening where I can see it". A weighted nymph fished dead drift through the deeper water covers the situation more often than any dry fly will.',
    },
    {
      q: 'How do I know which size fly to use?',
      a: 'Match the size of what you can see before you worry about the pattern. A fly that is roughly the right size and roughly the right colour will out-fish an exact imitation two sizes too big. Every fly in the library below lists the sizes it is tied in.',
    },
    {
      q: 'What is the one fly to use if I can only pick one?',
      a: 'A Parachute Adams in the middle sizes comes closest. It is close enough to a great many mayflies to pass, it floats well enough to see, and it has caught fish on more rivers than any other dry fly. That is not the same as saying it is the best fly on any particular day.',
    },
    {
      q: 'Should I fish a dry fly or a nymph?',
      a: 'Fish a dry fly when you can see fish taking things off the surface, and a nymph the rest of the time. The temptation is the other way round, because a dry fly is more fun to watch. Covering water with a nymph when nothing is rising catches more fish than waiting for a hatch that may not come.',
    },
  ];

  meta.jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
        { '@type': 'ListItem', position: 2, name: 'Fly-brary', item: `${base}/flies/` },
        { '@type': 'ListItem', position: 3, name: 'What fly should I use?', item: `${base}/what-fly-to-use/` },
      ],
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

  /* data-hint rides on the radio so picker.js can read the hint off the DOM
     instead of carrying a second copy of these strings. One source, in the
     page, with the rest of the prose. */
  const pills = (name, opts) => opts.map((o, i) => `
          <label class="pick__opt"><input type="radio" name="${name}" value="${esc(o.value)}"${
            o.hint ? ` data-hint="${esc(o.hint)}"` : ''}${i === 0 ? ' checked' : ''}><span>${esc(o.label)}</span></label>`).join('');

  const results = flies.map((fly) => {
    const sits = situationsFor(fly);
    return `
      <li class="pfly" data-f-sit="${esc(sits.join(' '))}" data-f-season="${esc((fly.seasons || []).join(' '))}" data-f-diff="${esc(fly.difficulty || '')}">
        <div class="pfly__art">${flyCard(fly)}</div>
        <div class="pfly__text">
          <h3 class="pfly__name"><a href="/flies/${esc(fly.slug)}/">${esc(fly.name)}</a></h3>
          <p class="pfly__meta">
            <span class="pfly__type">${esc(fly.cardCategory || fly.type)}</span>
            <span class="pfly__sizes">${esc(fly.sizes || '')}</span>
          </p>
          <p class="pfly__imitates">${esc(fly.imitates || '')}</p>
        </div>
      </li>`;
  }).join('');

  return `
<nav class="breadcrumbs wrap" aria-label="Breadcrumb">
  <a href="/">Home</a> <span aria-hidden="true">/</span>
  <a href="/flies/">Fly-brary</a> <span aria-hidden="true">/</span>
  <span aria-current="page">What fly to use</span>
</nav>

<section class="section wrap">
  <div class="wrap--narrow">
    <p class="eyebrow">Fly picker</p>
    <h1 class="h1">What fly should I use?</h1>
    <p class="lede">
      Answer three questions about the water in front of you. The honest short answer, before you
      do: if nothing is rising, fish a nymph. Trout take most of their food under the surface, so
      an empty-looking river usually means the food is somewhere you cannot see it, not that the
      fish have stopped eating.
    </p>
    <p class="help">
      Every fly below comes from our ${flies.length}-card library, with what it imitates and how
      it is fished. Nothing here is sponsored and nothing is for sale on this page.
    </p>
  </div>
</section>

<section class="section section--sunk" id="pick">
  <div class="wrap">
    <h2 class="h2">Three questions</h2>
    <p class="help">
      Answer what you know. The list below narrows as you go, and every fly in it links through to
      what it imitates and how to fish it.
    </p>

    <form class="pick" data-pick hidden>
      <fieldset class="pick__q">
        <legend class="pick__legend">1 &middot; What is the water doing?</legend>
        <div class="pick__opts">${pills('sit', SITUATIONS.map((s) => ({ value: s.id, label: s.label, hint: s.hint })))}</div>
        <p class="pick__hint" data-pick-hint></p>
      </fieldset>

      <fieldset class="pick__q">
        <legend class="pick__legend">2 &middot; What time of year?</legend>
        <div class="pick__opts">${pills('season', SEASONS.map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1) })))}</div>
      </fieldset>

      <fieldset class="pick__q">
        <legend class="pick__legend">3 &middot; How long have you been at this?</legend>
        <div class="pick__opts">${pills('diff', [
          { value: 'any', label: 'Does not matter' },
          { value: 'beginner', label: 'First season or two' },
        ])}</div>
      </fieldset>

      <p class="pick__count" role="status" aria-live="polite" data-pick-count></p>
    </form>

    <p class="pick__nothing" data-pick-nothing hidden></p>

    <ol class="pfly-grid" data-pick-list>${results}
    </ol>
  </div>
</section>

<section class="section wrap">
  <div class="wrap--narrow">
    <h2 class="h2">If you can see what is hatching</h2>
    <p>
      This picker works from the situation rather than the insect, because most of the time you
      cannot identify what is in the air and you still have to tie something on. When you can
      identify it, start there instead &mdash; the <a href="/hatches/">hatch guide</a> covers the
      eighteen that matter and lists the flies that match each one, month by month.
    </p>
    <p>
      If you know the river but not the season, the <a href="/fly-fishing-by-state/">state guides</a>
      cover what is hatching where, and when.
    </p>
  </div>
</section>

<section class="section section--sunk">
  <div class="wrap wrap--narrow">
    <h2 class="h2">Questions people ask before they tie one on</h2>
    ${FAQ.map((f) => `
    <div class="gift-objection">
      <h3 class="gift-objection__q">${esc(f.q)}</h3>
      <div><p class="gift-objection__a">${esc(f.a)}</p></div>
    </div>`).join('')}
  </div>
</section>

<section class="section wrap">
  <h2 class="h2">Where to go next</h2>
  <div class="cx-crosslink">
    <a class="cx-crosslink__item" href="/flies/">
      <p class="cx-crosslink__name">The whole Fly-brary</p>
      <p class="cx-crosslink__body">All ${flies.length} flies, filterable by type, free to read.</p>
    </a>
    <a class="cx-crosslink__item" href="/hatches/">
      <p class="cx-crosslink__name">What is hatching</p>
      <p class="cx-crosslink__body">Eighteen hatches, when they come off and what to fish through them.</p>
    </a>
    <a class="cx-crosslink__item" href="/blog/">
      <p class="cx-crosslink__name">The Virtual Guide</p>
      <p class="cx-crosslink__body">Knots, technique and reading water, written for somebody starting out.</p>
    </a>
  </div>
</section>

<script type="application/json" data-pick-nothing-copy>${JSON.stringify(NOTHING)}</script>
<script src="/js/picker.js" defer></script>
`;
}
