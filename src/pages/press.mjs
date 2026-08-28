/* /press/ — the media page.
 *
 * Two jobs. For a journalist: the boilerplate, the facts and the artwork in one
 * place, so nothing has to be guessed or asked for. For a retrieval system: an
 * independent-looking, fact-dense statement of what this brand is, in the same
 * words used everywhere else on the site.
 *
 * This is also the prerequisite for the one press moment described in
 * docs/GROWTH-PLAN.md — a wire release needs somewhere to point. */

import { esc } from '../templates/_shared.mjs';
import { campaignCta, campaignLine, organizationSchema } from '../templates/_blocks.mjs';

export const meta = {
  path: '/press/',
  title: 'Press & Media',
  description:
    'Boilerplate, facts, founder details and artwork for The Reel Deal Deck — a 54-card fly-fishing deck made by a father-and-daughter team in Eagle, Idaho.',
  /* Unlisted on purpose. A press kit is something you send a journalist the
     link to, not something a customer should stumble into while browsing — and
     right now it would mostly advertise that there is no coverage yet.
     noindex:true does three things at once: it emits the robots meta, it keeps
     the route out of sitemap.xml, and it exempts the page from the orphan gate
     in scripts/check.mjs, which is the sanctioned way to have a deliberately
     unreachable page rather than an accidental one.

     This makes it UNLISTED, not private. The URL still resolves for anyone sent
     it or guessing it; a static site has nowhere to put a password. */
  noindex: true,
  priority: 0.6,
  changefreq: 'monthly',
  bodyClass: 'page-press',
  ogImage: '/og/default.png',
  jsonld: [
    { '@context': 'https://schema.org', '@type': 'Organization' }, // filled in the render
    { '@context': 'https://schema.org', '@type': 'WebPage' },      // filled in the render
  ],
};

export default function press({ site }) {
  const b = site.brand || {};
  const p = site.product || {};
  const base = site.url.replace(/\/$/, '');

  meta.jsonld[0] = { '@context': 'https://schema.org', ...organizationSchema(site, { full: true }) };
  meta.jsonld[1] = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Press & Media',
    url: `${base}/press/`,
    about: { '@id': `${base}/#organization` },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
        { '@type': 'ListItem', position: 2, name: 'Press', item: `${base}/press/` },
      ],
    },
  };

  const quick = [
    ['Product', `${p.name} — a ${p.cardCount}-card fly-fishing playing card deck`],
    ['Price', `$${p.priceIntended} per deck`],
    ['Format', `${p.dimensions}. ${p.boxClaim}. ${site.edition}.`],
    ['Printer', `${p.manufacturer}. ${p.origin}.`],
    ['Materials', p.material],
    ['Founders', site.founders.map((f) => `${f.name} (${f.role})`).join(', ')],
    ['Company', site.legalName],
    ['Based', `${site.location.city}, ${site.location.regionName}, USA`],
    ['Conservation', `${site.conservation.partner} Business member; a contribution from every deck`],
    ['Status', p.availabilityNote],
    ['Contact', site.social.email],
  ];

  const assets = [
    ['/brand/box-front-1200.webp', 'Tuck box, front', 'The printed case: engraved green border, two rising trout, a fan of three cards.'],
    ['/cards/card-back-800.webp', 'Card back', 'The back design, printed on every card in the deck.'],
    ['/cards/adams-800.webp', 'Sample card — Adams', 'A representative card face: rank and suit, fly name, category, illustration and description.'],
    ['/brand/joker-fish-512.png', 'Brand mark', 'The trout-in-a-jester’s-cap mark used on the deck’s jokers.'],
  ];

  return `
<div class="wrap">
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <a href="/">Home</a> <span aria-hidden="true">›</span>
    <span aria-current="page">Press</span>
  </nav>

  <header class="page-head">
    <p class="eyebrow">Press &amp; media</p>
    <h1 class="h1 page-head__title">Everything you need to write about us</h1>
    <p class="page-head__lede lede">
      Boilerplate, facts and artwork, all on one page. Anything you cannot find here,
      email <a href="mailto:${esc(site.social.email)}">${esc(site.social.email)}</a> and we will send it
      the same day &mdash; there are two of us, so it will be Ken or Audrey who replies.
    </p>
  </header>
</div>

<section class="section wrap">
  <div class="wrap--narrow">
    <h2 class="h2">Boilerplate</h2>
    <p class="text-faint">Use this verbatim. It is the description we use everywhere.</p>
    <blockquote class="about-quote">
      <p>${esc(b.description)}</p>
      <cite>${esc(b.name)} &mdash; standard boilerplate</cite>
    </blockquote>

    <h3 class="h3" style="margin-block-start:var(--s-7)">One line</h3>
    <blockquote class="about-quote">
      <p>${esc(b.shortDescription)}</p>
    </blockquote>
  </div>
</section>

<section class="section section--sunk">
  <div class="wrap">
    <h2 class="h2">Quick facts</h2>
    <dl class="about-facts">
      ${quick
        .map(
          ([k, v]) => `<div class="about-facts__row">
        <dt class="about-facts__key">${esc(k)}</dt>
        <dd class="about-facts__val">${esc(v)}</dd>
      </div>`
        )
        .join('\n      ')}
    </dl>
  </div>
</section>

<section class="section wrap">
  <h2 class="h2">Artwork</h2>
  <p class="lede">
    Free to use in coverage of The Reel Deal Deck, with credit to
    ${esc(site.legalName)}. All illustrations are original and hand-drawn.
  </p>
  <div class="card-grid" style="--min:14rem;--gap:var(--s-5)">
    ${assets
      .map(
        ([src, title, note]) => `<figure class="press-asset">
      <img src="${esc(src)}" alt="${esc(title)} — ${esc(note)}" loading="lazy" decoding="async" width="400" height="300">
      <figcaption>
        <strong>${esc(title)}</strong>
        <span class="text-faint">${esc(note)}</span>
        <a href="${esc(src)}">Open full size</a>
      </figcaption>
    </figure>`
      )
      .join('\n    ')}
  </div>
</section>

<section class="section section--sunk">
  <div class="wrap wrap--narrow">
    <h2 class="h2">The story, in one paragraph</h2>
    <p>
      ${esc(site.voice.intro)} ${esc(site.voice.why)}
    </p>
    <p class="text-faint">
      Their full note is printed on a card inside every deck and reproduced on
      <a href="/about/">the about page</a>. The longer version is on
      <a href="/story/">our story</a>.
    </p>
    <!-- TODO-CONFIRM: no press coverage exists yet, so there is no coverage list
         on this page. Add one once there is something real to link to — do not
         pad it with the Kickstarter page or the founders' own posts. -->
  </div>
</section>

<section class="section wrap wrap--narrow text-center stack" style="--gap:var(--s-4)">
  <h2 class="h2">Writing about us right now?</h2>
  <p class="lede">${campaignLine(site)}</p>
  <p class="cluster" style="justify-content:center">
    ${campaignCta(site)}
    <a class="btn btn--ghost" href="mailto:${esc(site.social.email)}">Email us</a>
  </p>
</section>`;
}
