/* ==========================================================================
   /blog/topics/knots/ — the knots hub.
   --------------------------------------------------------------------------
   THE FIRST TOPIC TO EARN ITS OWN PAGE, under the rule in blog-topics.mjs:
   roughly six articles or more. Knots has ten. Technique has nine and has
   earned one too; the other four have not and must stay as anchors on /blog/.

   WHAT KEEPS THIS FROM BEING THE THIN CONTENT THAT RULE WARNS ABOUT

   A hub whose only content is a list of its own articles is a liability — it
   competes with /blog/ for the same terms and gives a crawler a page whose
   every sentence appears elsewhere. The unique thing here is the JOB TABLE:
   knots indexed by the connection you are trying to make rather than by name.
   That is the question somebody standing in a river actually has, and it is
   answered nowhere else on the site — the articles are each about one knot,
   and none of them says which knot the moment calls for.

   The table is built from JOBS below, and every knot in it is resolved against
   the posts that actually exist. A knot named here with no article raises at
   build time rather than rendering a dead link, because a hub that points at
   nothing is worse than no hub.
   ========================================================================== */

import { esc, orderState } from '../templates/_blocks.mjs';

/* The connection, then the knot. Slugs are checked against the real posts in
   the render — add a knot here only when its article exists. */
const JOBS = [
  { job: 'Tying the fly on',               knots: ['improved-clinch-knot', 'davy-knot'],
    note: 'The one you tie most. The clinch is the standard; the Davy is faster and wastes less tippet.' },
  { job: 'Joining two pieces of leader',   knots: ['blood-knot', 'double-surgeons-knot'],
    note: 'The blood knot is slimmer and runs through guides better. The surgeon’s is easier cold and in the dark.' },
  { job: 'Leader to fly line',             knots: ['nail-knot'],
    note: 'Smooth enough to pass through the tip guide. Tied once and left alone for a season.' },
  { job: 'A loop to loop into',            knots: ['perfection-loop'],
    note: 'Sits straight rather than cocked, which is why it beats a surgeon’s loop at the leader butt.' },
  { job: 'Backing to the spool',           knots: ['arbor-knot'],
    note: 'Tied once in the life of a reel, and it only has to not slip.' },
  { job: 'A fly that must swing freely',   knots: ['non-slip-loop-knot'],
    note: 'A loop at the hook eye instead of a tight knot, so a streamer or a heavy nymph can move.' },
  { job: 'Deciding what to learn first',   knots: ['best-fly-fishing-knots'],
    note: 'If you learn four and no more, these are the four.' },
  { job: 'When it has already gone wrong', knots: ['wind-knot'],
    note: 'The overhand knot your cast tied for you, and what it costs you if you leave it.' },
];

export const meta = {
  path: '/blog/topics/knots/',
  title: 'Fly Fishing Knots by Job',
  description:
    'Every knot worth learning, indexed by the connection you are making: fly to tippet, tippet to leader, leader to line, backing to spool.',
  priority: 0.8,
  changefreq: 'monthly',
  bodyClass: 'page-blog',
};

export default function ({ site, posts }) {
  const base = String(site.url || '').replace(/\/$/, '');
  /* posts are flat here — p.slug, p.title, p.topic — the same shape
     blog.mjs and blog-topics.mjs read. */
  const all = (posts || []).filter((p) => p?.topic === 'knots');
  const bySlug = new Map(all.map((p) => [p.slug, p]));

  /* A hub that points at nothing is worse than no hub. Fail the build rather
     than ship a dead row. */
  for (const row of JOBS) {
    for (const slug of row.knots) {
      if (!bySlug.has(slug)) {
        throw new Error(`blog-topic-knots: JOBS names "${slug}" but no knots article has that slug`);
      }
    }
  }

  const listed = new Set(JOBS.flatMap((r) => r.knots));
  const unlisted = all.filter((p) => !listed.has(p.slug));

  const FAQ = [
    {
      q: 'How many fly fishing knots do I actually need?',
      a: 'Four. One to tie the fly on, one to join two pieces of leader, one to attach the leader to the fly line, and one to get the backing onto the spool. Everything beyond those four is a refinement, and most anglers fish a lifetime on a handful.',
    },
    {
      q: 'Why does my knot keep slipping?',
      a: 'Almost always because it was pulled tight dry. Wet the knot before you seat it: friction from a dry draw deforms the monofilament and leaves a knot that looks right and fails under load. The second most common cause is too few wraps on a heavy tippet.',
    },
    {
      q: 'What is the strongest fly fishing knot?',
      a: 'The question matters less than it sounds. A well-tied ordinary knot in fresh tippet outperforms a badly tied strong one every time, and tippet almost never fails at the knot when the knot was seated wet and the material is not old. Learn one for each job and tie it properly.',
    },
  ];

  meta.jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
        { '@type': 'ListItem', position: 2, name: 'Virtual Guide', item: `${base}/blog/` },
        { '@type': 'ListItem', position: 3, name: 'Topics', item: `${base}/blog/topics/` },
        { '@type': 'ListItem', position: 4, name: 'Knots', item: `${base}/blog/topics/knots/` },
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

  const order = orderState(site);

  const rows = JOBS.map((r) => `
      <tr>
        <th scope="row" class="knot-job">${esc(r.job)}</th>
        <td class="knot-pick">
          ${r.knots.map((slug) => `<a href="/blog/${esc(slug)}/">${esc(bySlug.get(slug).title.replace(/^How to Tie (an?|the) /i, ''))}</a>`).join(' <span class="text-faint">or</span> ')}
          <span class="knot-note">${r.note}</span>
        </td>
      </tr>`).join('');

  return `
<link rel="stylesheet" href="/styles/blog.css">

<div class="wrap wrap--narrow">
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <ol>
      <li><a href="/">Home</a></li>
      <li><a href="/blog/">Virtual Guide</a></li>
      <li><a href="/blog/topics/">Topics</a></li>
      <li><span aria-current="page">Knots</span></li>
    </ol>
  </nav>

  <header class="page-head blog-head">
    <p class="eyebrow">Knots</p>
    <h1 class="h1 page-head__title">Which knot for which job</h1>
    <p class="page-head__lede lede">
      There are four connections in a fly rod setup and one knot for each: the fly to the tippet,
      the tippet to the leader, the leader to the line, and the backing to the spool. Learn those
      four and you can fish anywhere. The rest of this page is which is which, and the few worth
      adding later.
    </p>
  </header>

  <table class="knot-table">
    <caption class="visually-hidden">Fly fishing knots by the connection they make</caption>
    <thead>
      <tr><th scope="col">What you are joining</th><th scope="col">What to tie</th></tr>
    </thead>
    <tbody>${rows}
    </tbody>
  </table>

  <p class="text-faint">
    Every one of these is a separate page with the steps photographed out, and none of them asks
    you to sign up for anything.
  </p>
${unlisted.length ? `
  <h2 class="h2">Also in this topic</h2>
  <ul class="blog-topic__list">
    ${unlisted.map((p) => `<li><a href="/blog/${esc(p.slug)}/">${esc(p.question || p.title || p.slug)}</a></li>`).join('\n    ')}
  </ul>` : ''}

  <h2 class="h2">Questions people ask about knots</h2>
  ${FAQ.map((f) => `
  <div class="gift-objection">
    <h3 class="gift-objection__q">${esc(f.q)}</h3>
    <div><p class="gift-objection__a">${esc(f.a)}</p></div>
  </div>`).join('')}

  <h2 class="h2">Where to go next</h2>
  <div class="cx-crosslink">
    <a class="cx-crosslink__item" href="/blog/topics/">
      <p class="cx-crosslink__name">The rest of the guide</p>
      <p class="cx-crosslink__body">Gear, technique, seasons and getting started &mdash; what each topic covers.</p>
    </a>
    <a class="cx-crosslink__item" href="/what-fly-to-use/">
      <p class="cx-crosslink__name">What to tie on</p>
      <p class="cx-crosslink__body">Three questions about the water, and a shortlist of flies that fit.</p>
    </a>
    <a class="cx-crosslink__item" href="/flies/">
      <p class="cx-crosslink__name">The Fly-brary</p>
      <p class="cx-crosslink__body">Every pattern in the deck, what it imitates and how to fish it.</p>
    </a>
  </div>

  <p class="help">
    ${order.ready
      ? `The deck itself is ${esc(order.headline || 'ready to order')} &mdash; <a href="${esc(order.url)}">${esc(order.cta)}</a>.`
      : `<a href="/deck/">See the deck</a> that these guides were written alongside.`}
  </p>
</div>
`;
}
