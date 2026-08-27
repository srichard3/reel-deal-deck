/* ==========================================================================
   /blog/topics/ — the topic map.
   --------------------------------------------------------------------------
   WHY THIS IS ONE PAGE AND NOT SIX

   docs/BLOG-CONTRACT.md sketches /blog/topics/<topic>/ as six separate hubs.
   Six hub pages carrying one or two articles each is thin content: six URLs
   competing with /blog/ for the same head terms, splitting internal link
   equity six ways, and giving a crawler six near-duplicate pages whose only
   real content is a list. That is a measurable liability, not a win.

   So the topics live as anchored sections on /blog/ (#gear, #knots, …) —
   which are real, linkable, quotable addresses — and this page is the
   crawlable map of the taxonomy: what each topic covers, what it deliberately
   does NOT cover, and where the boundary with the Fly Library sits. That last
   part is content no other page on the site has, which is what keeps this from
   being a duplicate of /blog/.

   When a topic reaches roughly six or more articles it has earned its own hub:
   add src/pages/blog-topic-<topic>.mjs, point the anchor here at it, and add
   the old anchor to static/_redirects. See docs/AEO.md.

   Renders correctly with zero posts.
   ========================================================================== */

import { esc, campaignState } from '../templates/_blocks.mjs';
import { TOPICS } from './blog.mjs';

export const meta = {
  path: '/blog/topics/',
  title: 'Guide Topics',
  description:
    'What the fly fishing guides cover: getting started, gear, technique, knots, seasons and the practical stuff — and where the Fly Library takes over.',
  priority: 0.6,
  changefreq: 'monthly',
  bodyClass: 'page-blog-topics',
  ogImage: '/og/default.png',
};

/* What each topic answers, and what it does not. The "not" column is the
   cannibalisation rule made visible: fly-pattern queries belong to /flies/. */
const SCOPE = {
  basics: {
    covers: ['How to fly fish, start to finish', 'Whether fly fishing is hard to learn', 'What a beginner actually needs on day one'],
    not: 'What any individual fly pattern imitates.',
  },
  gear: {
    covers: ['Rod weight and length for trout', 'Leader, tippet and line choices', 'Waders, boots, nets and what you can skip'],
    not: 'Which fly to tie on — that is a pattern question.',
  },
  technique: {
    covers: ['Casting, roll casting and distance', 'Mending line and getting a dead drift', 'Setting the hook and playing a fish'],
    not: 'How to fish one specific pattern.',
  },
  knots: {
    covers: ['Attaching tippet to leader', 'Tying the fly on', 'Loop-to-loop connections'],
    not: 'Fly-tying recipes and dressings.',
  },
  seasons: {
    covers: ['Best time of day, by season', 'Cold water, high water and runoff', 'Weather, light and water temperature'],
    not: 'Hatch-by-hatch pattern selection.',
  },
  practical: {
    covers: ['Licences and where to check the rules', 'What fly fishing costs to start', 'Catch-and-release handling and etiquette'],
    not: 'Legal advice — regulations are set by each state agency.',
  },
};

const topicKey = (p) => (TOPICS.some((t) => t.key === p?.topic) ? p.topic : 'basics');

export default function ({ site, posts = [] }) {
  const base = String(site?.url || '').replace(/\/$/, '');
  const list = Array.isArray(posts) ? posts.filter(Boolean) : [];
  const camp = campaignState(site);

  meta.campaignKey = camp.key;
  meta.campaignEyebrow = camp.eyebrow;
  meta.campaignCta = camp.cta;
  meta.campaignUrl = camp.url;
  meta.campaignRel = camp.external ? 'noopener' : '';

  const counted = TOPICS.map((t) => ({
    ...t,
    scope: SCOPE[t.key] || { covers: [], not: '' },
    items: list.filter((p) => topicKey(p) === t.key),
  }));

  meta.jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Guide topics',
      description: meta.description,
      url: `${base}/blog/topics/`,
      inLanguage: 'en-US',
      isPartOf: { '@type': 'Blog', name: (site?.blog?.name) || 'Fly Fishing Guides', url: `${base}/blog/` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Fly fishing guide topics',
      numberOfItems: counted.length,
      itemListElement: counted.map((t, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: t.label,
        url: `${base}/blog/#${t.key}`,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site?.url },
        { '@type': 'ListItem', position: 2, name: 'Guides', item: `${base}/blog/` },
        { '@type': 'ListItem', position: 3, name: 'Topics', item: `${base}/blog/topics/` },
      ],
    },
  ];

  return `
<link rel="stylesheet" href="/styles/blog.css">

<div class="wrap wrap--narrow">
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <ol>
      <li><a href="/">Home</a></li>
      <li><a href="/blog/">Guides</a></li>
      <li><span aria-current="page">Topics</span></li>
    </ol>
  </nav>

  <header class="page-head blog-head">
    <p class="eyebrow">The map</p>
    <h1 class="h1 page-head__title">Guide topics</h1>
    <p class="page-head__lede lede">
      Six topics, one question per article. This page is the map: what each topic covers, what it
      deliberately leaves alone, and where the <a href="/flies/">Fly Library</a> takes over.
    </p>
  </header>

  <div class="blog-topics">
    ${counted
      .map(
        (t) => `
    <section class="blog-topic" id="${esc(t.key)}" aria-labelledby="${esc(t.key)}-h">
      <div class="blog-topic__head">
        <h2 class="h3 blog-topic__title" id="${esc(t.key)}-h">
          <a href="/blog/#${esc(t.key)}">${esc(t.label)}</a>
        </h2>
        <p class="blog-topic__count text-faint">${t.items.length} article${t.items.length === 1 ? '' : 's'}</p>
      </div>
      <p class="blog-topic__blurb">${esc(t.blurb)}</p>
      ${
        t.scope.covers.length
          ? `<ul class="list-index blog-topic__covers">
        ${t.scope.covers.map((c) => `<li>${esc(c)}</li>`).join('\n        ')}
      </ul>`
          : ''
      }
      ${t.scope.not ? `<p class="blog-topic__not"><strong>Not here:</strong> ${esc(t.scope.not)}</p>` : ''}
      ${
        t.items.length
          ? `<ul class="blog-topic__posts">
        ${t.items
          .map((p) => `<li><a href="/blog/${esc(p.slug)}/">${esc(p.question || p.title || p.slug)}</a></li>`)
          .join('\n        ')}
      </ul>`
          : `<p class="blog-topic__posts blog-topic__posts--empty text-faint">No articles published under this topic yet.</p>`
      }
    </section>`
      )
      .join('\n')}
  </div>

  <div class="notice notice--info blog-boundary">
    <p><strong>Fly patterns are not a blog topic.</strong></p>
    <p>Every question of the form <em>"what does the Adams imitate"</em> is answered in the
    <a href="/flies/">Fly Library</a> — one page per pattern, 54 of them, free. The guides link
    across to it rather than explaining a pattern twice.</p>
  </div>
</div>

<section class="section section--sunk">
  <div class="wrap wrap--narrow text-center stack" style="--gap:var(--s-4)">
    <p class="eyebrow">${esc(camp.eyebrow)}</p>
    <h2 class="h2">${esc(camp.headline || 'The deck the guides keep pointing at')}</h2>
    <p class="lede mx-auto">${esc(camp.sub || site?.positioning || '')}</p>
    <p class="cluster" style="justify-content:center">
      <a class="btn btn--primary" href="/deck/">See the deck</a>
      <a class="btn btn--ghost" href="/blog/">All guides</a>
    </p>
  </div>
</section>
<script src="/js/blog.js" defer></script>`;
}
