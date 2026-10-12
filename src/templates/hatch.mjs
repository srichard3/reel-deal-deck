/* Per-hatch page: /hatches/<slug>/
 *
 * The entomology tier. Each entry answers a question an angler actually types
 * — "when is the green drake hatch", "what does a blue wing olive look like" —
 * and then does the thing no fly page and no state page can do on its own: it
 * joins them. A hatch knows which cards in the deck imitate it and which
 * states name it in their season calendar, so this tier is the connective
 * tissue between the two tiers that already exist.
 *
 * Nothing here is invented. Every fly slug and every state slug is validated
 * against data/flies.json and data/states.json at build time, and a bad
 * reference fails the build rather than rendering a dead link. */

import { esc, flyCard } from './_shared.mjs';
import { organizationSchema } from './_blocks.mjs';

export default function ({ hatch: h, hatches, site, flies, states }) {
  const base = site.url.replace(/\/$/, '');
  const path = `/hatches/${h.slug}/`;
  const url = base + path;

  const bySlug = new Map(flies.map((f) => [f.slug, f]));
  const hatchFlies = (h.flies || []).map((s) => bySlug.get(s)).filter(Boolean);

  const stateBySlug = new Map((states || []).map((s) => [s.slug, s]));
  const hatchStates = (h.states || []).map((s) => stateBySlug.get(s)).filter(Boolean);

  const others = (hatches || []).filter((x) => x.slug !== h.slug);
  const sameGroup = others.filter((x) => x.group === h.group).slice(0, 4);

  const faqs = [
    { q: `When does the ${h.name.toLowerCase()} hatch?`, a: h.when.map((w) => `${w.window}: ${w.what}`).join(' ') },
    { q: `What size fly imitates a ${h.name.toLowerCase()}?`, a: `${h.size}. ${h.colour}.` },
    { q: `How do you fish a ${h.name.toLowerCase()} hatch?`, a: h.howToFish },
  ];

  const meta = {
    path,
    title: `${h.name} Hatch`,
    description: h.summary.length > 158 ? h.summary.slice(0, 155) + '…' : h.summary,
    priority: 0.7,
    changefreq: 'yearly',
    bodyClass: 'page-hatch',
    ogImage: '/og/flies.png',
    jsonld: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: `${h.name} hatch: when it happens and how to fish it`,
        description: h.answer,
        mainEntityOfPage: url,
        about: { '@type': 'Thing', name: h.name },
        publisher: organizationSchema(site),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
          { '@type': 'ListItem', position: 2, name: 'Hatches', item: `${base}/hatches/` },
          { '@type': 'ListItem', position: 3, name: h.name, item: url },
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
    ],
  };

  const body = `
<article class="hatch">
  <div class="wrap">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <a href="/">Home</a> <span aria-hidden="true">›</span>
      <a href="/hatches/">Hatches</a> <span aria-hidden="true">›</span>
      <span aria-current="page">${esc(h.name)}</span>
    </nav>

    <header class="page-head">
      <p class="eyebrow">${esc(h.group)}${h.scientific ? ` &middot; <em>${esc(h.scientific)}</em>` : ''}</p>
      <h1 class="h1 page-head__title">${esc(h.name)}</h1>
      ${(h.aka || []).length ? `<p class="hatch-aka">Also called ${h.aka.map((a) => esc(a)).join(', ')}.</p>` : ''}

      <div class="aeo-answer">
        <p class="aeo-answer__label">Short answer</p>
        <p class="aeo-answer__text">${esc(h.answer)}</p>
      </div>
    </header>

    <section class="state-section" aria-labelledby="what-h">
      <h2 class="h2" id="what-h">What a ${esc(h.name.toLowerCase())} is</h2>
      <div class="prose"><p>${esc(h.whatItIs)}</p></div>
      <dl class="state-list">
        <div class="state-list__row">
          <dt class="state-list__key">Hook size</dt><dd class="state-list__val">${esc(h.size)}</dd>
        </div>
        <div class="state-list__row">
          <dt class="state-list__key">Colour</dt><dd class="state-list__val">${esc(h.colour)}</dd>
        </div>
      </dl>
    </section>

    <section class="state-section" aria-labelledby="stages-h">
      <h2 class="h2" id="stages-h">The stages trout eat</h2>
      <dl class="state-list">
        ${h.stages.map((s) => `<div class="state-list__row">
          <dt class="state-list__key">${esc(s.name)}</dt>
          <dd class="state-list__val">${esc(s.note)}</dd>
        </div>`).join('\n        ')}
      </dl>
    </section>

    <section class="state-section" aria-labelledby="when-h">
      <h2 class="h2" id="when-h">When does the ${esc(h.name.toLowerCase())} hatch?</h2>
      <div class="post-tablewrap" tabindex="0">
        <table class="post-table">
          <caption class="post-table__caption">The ${esc(h.name.toLowerCase())} through the year</caption>
          <thead><tr><th scope="col">When</th><th scope="col">What is happening</th></tr></thead>
          <tbody>
            ${h.when.map((w) => `<tr><td><strong>${esc(w.window)}</strong></td><td>${esc(w.what)}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>
      <p class="state-caveat">
        Emergence dates move with latitude, altitude and the weather of a given year. Treat
        these windows as a shape, not a diary, and check a local report before you travel.
      </p>
    </section>

    <section class="state-section" aria-labelledby="where-h">
      <h2 class="h2" id="where-h">Where it matters</h2>
      <div class="prose"><p>${esc(h.where)}</p></div>
      ${hatchStates.length ? `<p class="cluster" style="margin-block-start:var(--s-5)">
        ${hatchStates.map((s) => `<a class="btn btn--quiet btn--sm" href="/fly-fishing-in-${esc(s.slug)}/">Fly fishing in ${esc(s.name)}</a>`).join('\n        ')}
      </p>` : ''}
    </section>

    <section class="state-section" aria-labelledby="how-h">
      <h2 class="h2" id="how-h">How to fish it</h2>
      <div class="prose"><p>${esc(h.howToFish)}</p></div>
      ${(h.tips || []).length ? `<ul class="state-rules">
        ${h.tips.map((t) => `<li>${esc(t)}</li>`).join('\n        ')}
      </ul>` : ''}
    </section>

    ${hatchFlies.length ? `<section class="state-section" aria-labelledby="flies-h">
      <h2 class="h2" id="flies-h">Flies that imitate it</h2>
      <p class="lede">Each of these is a card in the deck, and each has a full page in Our Fly-brary.</p>
      <div class="card-grid fly-strip" style="--gap:var(--s-4)">
        ${hatchFlies.map((f) => flyCard(f)).join('\n        ')}
      </div>
    </section>` : ''}

    <section class="state-section" aria-labelledby="more-h">
      <h2 class="h3" id="more-h">Keep reading</h2>
      <ul class="state-rules">
        <li><a href="/blog/dry-fly-vs-nymph/">Dry fly vs nymph</a> — which stage to fish, and when</li>
        <li><a href="/blog/why-trout-refuse-your-fly/">Why trout refuse your fly</a> — usually the wrong stage, not the wrong pattern</li>
        <li><a href="/blog/best-time-of-day-to-fly-fish/">Best time of day to fly fish</a> — the daily logic behind the table above</li>
        <li><a href="/flies/">Our Fly-brary</a> — every fly in the deck, explained</li>
      </ul>
      ${sameGroup.length ? `<p class="cluster" style="margin-block-start:var(--s-5)">
        ${sameGroup.map((o) => `<a class="btn btn--quiet btn--sm" href="/hatches/${esc(o.slug)}/">${esc(o.name)}</a>`).join('\n        ')}
      </p>` : ''}
      <p style="margin-block-start:var(--s-5)"><a href="/hatches/">All hatches and trout food &rarr;</a></p>
    </section>
  </div>
</article>`;

  return { meta, body };
}
