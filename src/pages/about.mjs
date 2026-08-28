/* /about/ — the entity page.
 *
 * This page exists to answer four questions in one place, in the same words
 * used everywhere else on the site: what it is, what it costs, who it is for,
 * and who makes it. That consistency is what lets a search engine or a language
 * model resolve "The Reel Deal Deck" into one confident entity instead of a
 * fuzzy one. Every fact here comes from data/site.json — nothing is written
 * fresh, on purpose. */

import { esc, cardImage } from '../templates/_shared.mjs';
import { campaignCta, campaignLine, organizationSchema } from '../templates/_blocks.mjs';

export const meta = {
  path: '/about/',
  title: 'About Us',
  description:
    'Who makes The Reel Deal Deck, what it is, what it costs and who it is for. A father-and-daughter team in Eagle, Idaho.',
  priority: 0.8,
  changefreq: 'monthly',
  bodyClass: 'page-about',
  ogImage: '/og/story.png',
  jsonld: [
    { '@context': 'https://schema.org', '@type': 'Organization' }, // filled in the render
    { '@context': 'https://schema.org', '@type': 'AboutPage' },     // filled in the render
  ],
};

export default function about({ site, flies }) {
  const b = site.brand || {};
  const p = site.product || {};
  const v = site.voice || {};
  const base = site.url.replace(/\/$/, '');

  /* meta is module-level; build.mjs reads it after this runs. */
  meta.jsonld[0] = { '@context': 'https://schema.org', ...organizationSchema(site, { full: true }) };
  meta.jsonld[1] = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About The Reel Deal Deck',
    url: `${base}/about/`,
    mainEntity: { '@id': `${base}/#organization` },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
        { '@type': 'ListItem', position: 2, name: 'About', item: `${base}/about/` },
      ],
    },
  };

  const facts = [
    ['What it is', `A ${p.cardCount}-card fly-fishing playing card deck. Every card is an original hand-drawn fly with a plain-English note on what it imitates and the hook sizes it is usually tied in.`],
    ['What it costs', `$${p.priceIntended} for a single deck. Multi-deck prices are on the deck page.`],
    ['Who it is for', 'Anglers who want a reference they can actually carry, and the people buying a gift for one. It teaches a beginner and settles arguments for someone who has fished for thirty years.'],
    ['Who makes it', `${site.founders.map((f) => f.name).join(' and ')} — a father and his daughter, in ${site.location.city}, ${site.location.regionName}. They answer their own email.`],
    ['Who prints it', `${p.manufacturer}, on ${p.stock.replace(/^Genuine /, 'genuine ')}. ${p.origin}.`],
    ['Legal entity', site.legalName],
    ['Conservation', `A contribution from every deck goes to ${site.conservation.partner}.`],
    ['Status', p.availabilityNote],
  ];

  const hero = flies.find((f) => f.slug === 'adams') || flies[0];

  return `
<div class="wrap">
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <a href="/">Home</a> <span aria-hidden="true">›</span>
    <span aria-current="page">About</span>
  </nav>

  <header class="page-head">
    <p class="eyebrow">About</p>
    <h1 class="h1 page-head__title">${esc(b.slogan || site.tagline)}</h1>
    <p class="page-head__lede lede">${esc(b.description)}</p>
  </header>
</div>

<section class="section wrap">
  <div class="about-layout">
    <div>
      <h2 class="h2">The short version</h2>
      <dl class="about-facts">
        ${facts
          .map(
            ([k, val]) => `<div class="about-facts__row">
          <dt class="about-facts__key">${esc(k)}</dt>
          <dd class="about-facts__val">${esc(val)}</dd>
        </div>`
          )
          .join('\n        ')}
      </dl>
    </div>
    ${hero ? `<figure class="about-card">
      ${cardImage(hero, { sizes: '(min-width: 54rem) 16rem, 60vw' })}
      <figcaption class="figure-note">One of ${p.cardCount} &mdash; every card works like this</figcaption>
    </figure>` : ''}
  </div>
</section>

<section class="section wrap wrap--narrow">
  <div class="prose">
    <h2 class="h2">How it started</h2>
    <p>${esc(site.story?.hook || '')}</p>
    <p>${esc(site.story?.looking || '')} ${esc(site.story?.twist || '')}</p>
    <p>${esc(site.story?.belief || '')} ${esc(site.story?.spirit || '')}</p>
    <p><a href="/story/">The longer version, with both of them in it &rarr;</a></p>
  </div>
</section>

<section class="section section--sunk">
  <div class="wrap wrap--narrow">
    <p class="eyebrow">In their words</p>
    <h2 class="h2">Ken and Audrey</h2>
    <blockquote class="about-quote">
      <p>${esc(v.intro)}</p>
      <p>${esc(v.why)}</p>
      <p>${esc(v.hope)} ${esc(v.signoff)}</p>
      <cite>Printed on the info card inside every deck</cite>
    </blockquote>
    <p class="cluster" style="margin-block-start:var(--s-6)">
      <a class="btn btn--ghost" href="/story/">The longer story</a>
      <a class="btn btn--ghost" href="/cards/">What is in the deck</a>
    </p>
  </div>
</section>

<section class="section wrap wrap--narrow text-center stack" style="--gap:var(--s-4)">
  <h2 class="h2">${esc(p.availabilityNote)}</h2>
  <p class="lede">${campaignLine(site)}</p>
  <p class="cluster" style="justify-content:center">
    ${campaignCta(site)}
    <a class="btn btn--ghost" href="/deck/">See the deck</a>
  </p>
</section>`;
}
