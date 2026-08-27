/* Per-fly page: /flies/<slug>/
   This is the organic-traffic engine. Each page has to stand on its own as a
   reference an experienced angler would respect — the product pitch is a
   footnote, not the point. */

import { esc, flyCard, cardImage, cardLabel, TYPES, titleCase } from './_shared.mjs';
import { campaignCta, organizationSchema } from './_blocks.mjs';

/* Build the answer-first block: 40-60 words, directly under the h1, before any
   other prose. This is the block an answer engine lifts, so it has to answer
   "what is this fly, what does it imitate, when do I fish it" on its own.
   Assembled only from fields that exist in data/flies.json — nothing invented.
   `summary` is used as a fallback opener, never as the whole answer. */
function buildAnswer(fly, type) {
  const words = (t) => String(t).trim().split(/\s+/).filter(Boolean).length;
  const trimSentence = (t) => String(t).replace(/\s+/g, ' ').trim().replace(/\.*$/, '');

  /* "Midge/Emerger" reads badly spoken aloud, and an answer engine may well
     read it aloud. */
  const label = String(fly.cardCategory || type.label).toLowerCase().replace(/\s*\/\s*/g, ' or ');
  /* The article must agree with the word that follows it — the category — not
     with the fly's name. "The Adams is a dry fly", never "an dry fly". */
  const article = /^[aeiou]/i.test(label) ? 'an' : 'a';

  const parts = [];
  parts.push(`The ${fly.name} is ${article} ${label} that imitates ${trimSentence(fly.imitates).replace(/^[A-Z]/, (c) => c.toLowerCase())}.`);
  if (fly.sizes) {
    const sizes = String(fly.sizes).replace(/#(\d+)\s*-\s*#(\d+)/, 'sizes $1 to $2').replace(/#/g, 'size ');
    parts.push(`It is usually tied in ${sizes}.`);
  }

  /* Add the most useful practical sentence available until we clear 40 words. */
  const extras = [
    fly.whenToFish && `Fish it ${trimSentence(fly.whenToFish).replace(/^[A-Z]/, (c) => c.toLowerCase())}.`,
    fly.howToFish && trimSentence(String(fly.howToFish).split(/(?<=\.)\s/)[0]) + '.',
    fly.summary && trimSentence(fly.summary) + '.',
  ].filter(Boolean);

  for (const e of extras) {
    if (words(parts.join(' ')) >= 40) break;
    parts.push(e);
  }

  /* Trim back to 60 words on a sentence boundary rather than mid-clause. */
  while (parts.length > 2 && words(parts.join(' ')) > 60) parts.pop();
  let out = parts.join(' ');
  if (words(out) > 60) {
    const w = out.split(/\s+/).slice(0, 60);
    out = w.join(' ').replace(/[,;:]$/, '') + '…';
  }
  return out;
}

const list = (arr) => (Array.isArray(arr) ? arr.filter(Boolean) : []);

function specRow(label, value) {
  if (!value || (Array.isArray(value) && !value.length)) return '';
  const v = Array.isArray(value) ? value.map(titleCase).join(', ') : value;
  return `<div class="fly-spec__row">
          <dt class="fly-spec__key">${esc(label)}</dt>
          <dd class="fly-spec__val">${esc(v)}</dd>
        </div>`;
}

export default function ({ fly, flies, site }) {
  const type = TYPES[fly.type] || TYPES.dry;

  /* Declared early: the answer is also the Article description in the schema. */
  const answer = buildAnswer(fly, type);
  const idx = flies.findIndex((f) => f.slug === fly.slug);
  const prev = flies[(idx - 1 + flies.length) % flies.length];
  const next = flies[(idx + 1) % flies.length];

  /* Cross-linking is the whole SEO play: never fewer than four outbound links
     to sibling flies. Fall back to same-type neighbours if pairsWith is thin. */
  const bySlug = new Map(flies.map((f) => [f.slug, f]));
  const related = [];
  for (const s of list(fly.pairsWith)) {
    const f = bySlug.get(s);
    if (f && f.slug !== fly.slug && !related.includes(f)) related.push(f);
  }
  for (const f of flies) {
    if (related.length >= 4) break;
    if (f.slug !== fly.slug && f.type === fly.type && !related.includes(f)) related.push(f);
  }
  for (const f of flies) {
    if (related.length >= 4) break;
    if (f.slug !== fly.slug && !related.includes(f)) related.push(f);
  }

  /* The shell appends " — The Reel Deal Deck" (21 chars), so a fly title has a
     39-char budget before the whole thing overruns the ~60-char SERP cut.
     Take the most keyword-complete variant that still fits. */
  const title =
    [
      `${fly.name}: What It Imitates & How to Fish It`,
      `${fly.name} Fly: What It Imitates`,
      `${fly.name} Fly Pattern Guide`,
      `${fly.name} Fly Pattern`,
      fly.name,
    ].find((t) => t.length <= 39) || fly.name;

  const path = `/flies/${fly.slug}/`;
  const url = site.url.replace(/\/$/, '') + path;

  /* Only questions that are actually rendered below get FAQ schema. */
  const faqs = [
    { q: `What does ${aAn(fly.name)} imitate?`, a: `${fly.imitates}.` },
    fly.whenToFish && { q: `When should you fish ${aAn(fly.name)}?`, a: fly.whenToFish },
    fly.howToFish && { q: `How do you fish ${aAn(fly.name)}?`, a: fly.howToFish },
  ].filter(Boolean);

  const jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: answer,
      mainEntityOfPage: url,
      about: { '@type': 'Thing', name: `${fly.name} fly pattern` },
      isPartOf: { '@type': 'CollectionPage', name: 'Fly Library', url: `${site.url.replace(/\/$/, '')}/flies/` },
      publisher: organizationSchema(site),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
        { '@type': 'ListItem', position: 2, name: 'Fly Library', item: `${site.url.replace(/\/$/, '')}/flies/` },
        { '@type': 'ListItem', position: 3, name: fly.name, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ];

  const meta = {
    path,
    title,
    description: fly.summary,
    priority: 0.7,
    changefreq: 'yearly',
    bodyClass: 'page-fly',
    ogImage: '/og/flies.png',
    jsonld,
  };

  const origin = [
    fly.designer ? `Attributed to ${esc(fly.designer)}` : '',
    fly.yearOrigin ? `${fly.designer ? ', ' : 'Dates to '}${esc(fly.yearOrigin)}` : '',
  ].join('');

  const body = `
<article class="fly">
  <div class="wrap">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <a href="/">Home</a> <span aria-hidden="true">›</span>
      <a href="/flies/">Fly Library</a> <span aria-hidden="true">›</span>
      <span aria-current="page">${esc(fly.name)}</span>
    </nav>

    <header class="fly-head">
      <div class="fly-head__text">
        <p class="eyebrow">${esc(type.label)}${fly.card?.rank === 'JOKER' ? ' · Joker' : ''}</p>
        <h1 class="h1 fly-head__title">${esc(fly.name)}</h1>
        ${list(fly.aka).length ? `<p class="fly-head__aka">Also called ${esc(list(fly.aka).join(', '))}</p>` : ''}

        <div class="aeo-answer">
          <p class="aeo-answer__label">Short answer</p>
          <p class="aeo-answer__text">${esc(answer)}</p>
        </div>

        <p class="cluster fly-head__pills">
          <span class="pill pill--${esc(fly.type)}">${esc(type.label)}</span>
          ${fly.difficulty ? `<span class="pill">${esc(titleCase(fly.difficulty))}</span>` : ''}
          ${fly.sizes ? `<span class="pill">${esc(fly.sizes)}</span>` : ''}
        </p>
      </div>
      <figure class="fly-head__card">
        ${cardImage(fly, { eager: true, sizes: '(min-width: 54rem) 20rem, 70vw' })}
        <figcaption class="figure-note">
          ${esc(cardLabel(fly))}${fly.cardCategory ? ` &middot; ${esc(fly.cardCategory)}` : ''} in the deck
        </figcaption>
      </figure>
    </header>

    <div class="fly-layout">
      <div class="fly-main prose">
        ${fly.cardText ? `<blockquote class="fly-cardtext">
          <p>${esc(fly.cardText)}</p>
          <cite>Printed on the ${esc(cardLabel(fly))}</cite>
        </blockquote>` : ''}
        ${list(fly.body).map((p) => `<p>${esc(p)}</p>`).join('\n        ')}

        ${fly.imitates ? `<h2>What does ${aAn(fly.name)} imitate?</h2>\n        <p>${esc(fly.imitates)}.</p>` : ''}
        ${fly.howToFish ? `<h2>How do you fish ${aAn(fly.name)}?</h2>\n        <p>${esc(fly.howToFish)}</p>` : ''}
        ${fly.whenToFish ? `<h2>When should you fish ${aAn(fly.name)}?</h2>\n        <p>${esc(fly.whenToFish)}</p>` : ''}

        ${list(fly.tips).length ? `<h2>What are the quick tips for fishing it?</h2>
        <ul class="fly-tips">
          ${list(fly.tips).map((t) => `<li>${esc(t)}</li>`).join('\n          ')}
        </ul>` : ''}

        ${list(fly.materials).length ? `<h2>How is ${aAn(fly.name)} tied?</h2>
        <ul class="fly-materials">
          ${list(fly.materials).map((m) => `<li>${esc(m)}</li>`).join('\n          ')}
        </ul>
        <p class="text-faint">Dressings vary by tier and region. Treat this as the common recipe, not the only one.</p>` : ''}
      </div>

      <aside class="fly-aside">
        <div class="card fly-spec">
          <h2 class="fly-spec__title">At a glance</h2>
          <dl class="fly-spec__list">
            ${specRow('Imitates', fly.imitates)}
            ${specRow('Type', fly.cardCategory || type.label)}
            ${specRow('Common sizes', fly.sizes)}
            ${specRow('Season', fly.seasons)}
            ${specRow('Water', fly.waters)}
            ${specRow('Targets', fly.targetSpecies)}
            ${specRow('Difficulty', fly.difficulty)}
            ${origin ? specRow('Origin', origin) : ''}
          </dl>
        </div>
        ${fly.originNote ? `<div class="card fly-origin">
          <h2 class="fly-spec__title">Where it comes from</h2>
          <p>${esc(fly.originNote)}</p>
        </div>` : ''}
      </aside>
    </div>

    <section class="fly-related" aria-labelledby="related-h">
      <h2 class="h3" id="related-h">Fishes well alongside</h2>
      <div class="card-grid fly-strip" style="--gap:var(--s-4)">
        ${related.slice(0, 4).map((f) => flyCard(f)).join('\n        ')}
      </div>
    </section>

    <nav class="fly-pager" aria-label="Fly Library">
      <a class="fly-pager__link" href="/flies/${esc(prev.slug)}/" rel="prev">
        <span class="fly-pager__dir">Previous</span>
        <span class="fly-pager__name">${esc(prev.name)}</span>
      </a>
      <a class="btn btn--quiet" href="/flies/">All 54 flies</a>
      <a class="fly-pager__link fly-pager__link--next" href="/flies/${esc(next.slug)}/" rel="next">
        <span class="fly-pager__dir">Next</span>
        <span class="fly-pager__name">${esc(next.name)}</span>
      </a>
    </nav>
  </div>

  <section class="section section--sunk fly-cta">
    <div class="wrap wrap--narrow text-center stack" style="--gap:var(--s-4)">
      <p class="eyebrow">The physical version</p>
      <h2 class="h2">${esc(fly.name)} is ${esc(cardLabel(fly))} in the deck.</h2>
      <p class="lede">All ${site.product.cardCount} flies, hand-drawn, on ${esc(site.product.stock)}. A reference you can actually deal out.</p>
      <p class="cluster" style="justify-content:center">
        ${campaignCta(site)}
        <a class="btn btn--ghost" href="/deck/">See the deck</a>
        <a class="btn btn--ghost" href="/flies/">Browse the library</a>
      </p>
    </div>
  </section>
</article>`;

  return { meta, body };
}

/** "a Woolly Bugger" / "an Elk Hair Caddis" */
function aAn(name) {
  return `${/^[aeiou]/i.test(String(name)) ? 'an' : 'a'} ${name}`;
}
