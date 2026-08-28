/* ==========================================================================
   /blog/ — the guide index.
   --------------------------------------------------------------------------
   Works completely without JavaScript: every article is in the HTML, grouped
   by topic under real anchor ids (#gear, #basics, …). Those anchors are the
   topic hubs — see docs/AEO.md for why six near-empty hub *pages* would be a
   liability while the blog is small, and /blog/topics/ for the crawlable map.

   `posts` can legitimately be an empty array (articles are authored in
   parallel). The page renders honestly in that case rather than crashing.
   ========================================================================== */

import { esc, clamp, campaignState } from '../templates/_blocks.mjs';

export const meta = {
  path: '/blog/',
  title: 'The Virtual Guide: Fly Fishing Answers',
  description:
    'Straight answers to the questions anglers actually ask — gear, technique, knots, seasons and getting started. Free, no sign-up, written by people who fish.',
  priority: 0.9,
  changefreq: 'weekly',
  bodyClass: 'page-blog',
  ogImage: '/og/default.png',
};

/* The six content classes from docs/BLOG-CONTRACT.md, in reading order:
   a beginner arrives at the top and works down. */
export const TOPICS = [
  { key: 'basics',    label: 'Getting started', blurb: 'Your first rod, your first cast, your first fish — and an honest answer to "is this hard?"' },
  { key: 'gear',      label: 'Gear',            blurb: 'Rod weights, lines, leaders, waders. What to buy, what to skip, and what it actually costs.' },
  { key: 'technique', label: 'Technique',       blurb: 'Casting, mending, drifts, hook sets. The things that turn drifts into fish.' },
  { key: 'knots',     label: 'Knots',           blurb: 'The short list of knots worth learning, tied step by step.' },
  { key: 'seasons',   label: 'Seasons & timing',blurb: 'When to go, what the water is doing, and what to expect when you get there.' },
  { key: 'practical', label: 'Practical',       blurb: 'Licences, etiquette, catch-and-release handling, and the rest of the real world.' },
];

const topicKey = (p) => (TOPICS.some((t) => t.key === p?.topic) ? p.topic : 'basics');

export default function ({ site, posts = [], flies = [] }) {
  const base = String(site?.url || '').replace(/\/$/, '');
  const list = Array.isArray(posts) ? posts.filter(Boolean) : [];
  const camp = campaignState(site);

  /* Resolved values for  — the partial cannot branch. */
  meta.campaignKey = camp.key;
  meta.campaignEyebrow = camp.eyebrow;
  meta.campaignCta = camp.cta;
  meta.campaignUrl = camp.url;
  meta.campaignRel = camp.external ? 'noopener' : '';

  const groups = TOPICS.map((t) => ({ ...t, items: list.filter((p) => topicKey(p) === t.key) }));

  meta.jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: (site?.blog?.name) || 'The Virtual Guide',
      description: meta.description,
      url: `${base}/blog/`,
      inLanguage: 'en-US',
      isPartOf: { '@type': 'WebSite', name: site?.name, url: site?.url },
      about: TOPICS.map((t) => ({ '@type': 'Thing', name: t.label })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'The Virtual Guide',
      numberOfItems: list.length,
      itemListElement: list.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.question || p.title || p.slug,
        url: `${base}/blog/${p.slug}/`,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site?.url },
        { '@type': 'ListItem', position: 2, name: 'Virtual Guide', item: `${base}/blog/` },
      ],
    },
  ];

  const count = list.length;

  return `
<link rel="stylesheet" href="/styles/blog.css">

<div class="wrap wrap--narrow">
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <ol>
      <li><a href="/">Home</a></li>
      <li><span aria-current="page">Virtual Guide</span></li>
    </ol>
  </nav>

  <header class="page-head blog-head">
    <p class="eyebrow">Free${count ? ` · ${count} answer${count === 1 ? '' : 's'}` : ''}</p>
    <h1 class="h1 page-head__title">The Virtual Guide</h1>
    <p class="page-head__lede lede">
      The <a href="/flies/">Fly-brary</a> explains the patterns. The Virtual Guide answers everything
      else an angler actually asks — what rod to buy, how to cast it, which knot to tie, when to go.
      One question per article, answered in the first paragraph, because nobody wants to scroll
      past somebody's childhood to find out which tippet to use.
    </p>
  </header>

  <nav class="blog-topicnav" aria-label="Guide topics">
    <ul class="cluster blog-topicnav__list">
      ${TOPICS.map(
        (t) => `<li><a class="pill blog-topicnav__pill" href="#${esc(t.key)}">${esc(t.label)}</a></li>`
      ).join('\n      ')}
    </ul>
  </nav>
</div>

<div class="wrap wrap--narrow blog-index">
  ${
    count === 0
      ? `<div class="notice notice--info blog-empty">
    <p><strong>The first answers are being written right now.</strong></p>
    <p>Nothing is published here yet — we would rather ship six articles worth reading than sixty
    worth skimming. In the meantime the <a href="/flies/">Fly-brary</a> covers all 54 patterns
    in the deck, free and without a sign-up.</p>
  </div>`
      : groups
          .map(
            (g) => `
  <section class="blog-group" id="${esc(g.key)}" aria-labelledby="${esc(g.key)}-h">
    <div class="blog-group__head">
      <h2 class="h2 blog-group__title" id="${esc(g.key)}-h">${esc(g.label)}</h2>
      <p class="blog-group__blurb">${esc(g.blurb)}</p>
    </div>
    ${
      g.items.length
        ? `<ul class="blog-list">
      ${g.items.map((p) => card(p)).join('\n      ')}
    </ul>`
        : `<p class="blog-group__empty text-faint">Nothing published under this topic yet — it is next on the list.</p>`
    }
  </section>`
          )
          .join('\n')
  }
</div>

<section class="section section--sunk">
  <div class="wrap wrap--narrow text-center stack" style="--gap:var(--s-4)">
    <p class="eyebrow">${esc(camp.eyebrow)}</p>
    <h2 class="h2">${esc(camp.headline || 'The deck behind the Virtual Guide')}</h2>
    <p class="lede mx-auto">
      ${esc(site?.product?.cardCount || 54)} hand-drawn flies on ${esc(site?.product?.stock || 'genuine Bicycle stock')},
      made by a father and daughter in ${esc(site?.location?.city || 'Eagle')}, with a contribution
      to ${esc(site?.conservation?.partner || 'Trout Unlimited')} from every deck.
    </p>
    <p class="cluster" style="justify-content:center">
      <a class="btn btn--primary" href="/deck/">See the deck</a>
      <a class="btn btn--ghost" href="/flies/">Browse the Fly-brary</a>
    </p>
  </div>
</section>
<script src="/js/blog.js" defer></script>`;
}

/** One article in the index. The question is the link text — it is the query. */
function card(p) {
  const q = p.question || p.title || p.slug;
  const answer = p.answer || p.description || '';
  return `<li class="blog-list__item">
        <article class="blog-card">
          <h3 class="blog-card__title"><a href="/blog/${esc(p.slug)}/">${esc(q)}</a></h3>
          ${answer ? `<p class="blog-card__text">${esc(clamp(answer, 190))}</p>` : ''}
          <p class="blog-card__meta">${
            p.readingTime ? `${esc(p.readingTime)} min read` : ''
          }${p.updated ? `${p.readingTime ? ' · ' : ''}Updated ${esc(String(p.updated).slice(0, 10))}` : ''}</p>
        </article>
      </li>`;
}
