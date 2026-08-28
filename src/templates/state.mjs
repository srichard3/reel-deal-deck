/* Per-state page: /fly-fishing-in-<slug>/
 *
 * The programmatic tier. Its whole defensibility rests on each page carrying
 * real, distinct, checkable detail — named waters, a genuine hatch calendar,
 * the state's own licence figures with a link to the agency. If two of these
 * pages ever read like the same page with a name swapped, the tier is not
 * worth publishing. See docs/GROWTH-PLAN.md, tier 3.
 *
 * Nothing here is invented: every field comes from data/states.json, and any
 * figure that goes stale is dated and linked to the issuing agency. */

import { esc, flyCard } from './_shared.mjs';
import { campaignCta, organizationSchema } from './_blocks.mjs';

export default function ({ state: st, states, site, flies }) {
  const base = site.url.replace(/\/$/, '');
  const path = `/fly-fishing-in-${st.slug}/`;
  const url = base + path;
  const lic = st.licence || {};

  const bySlug = new Map(flies.map((f) => [f.slug, f]));
  const stateFlies = (st.flies || []).map((s) => bySlug.get(s)).filter(Boolean);

  const others = states.filter((s) => s.slug !== st.slug);

  const faqs = [
    {
      q: `Do you need a fishing licence to fly fish in ${st.name}?`,
      a: `Yes. ${lic.agency} issues them. As of ${lic.priceYear}, an adult annual resident licence is ${lic.residentAnnual} and a non-resident licence is ${lic.nonResidentAnnual}. ${lic.priceNote}`,
    },
    {
      q: `What trout are in ${st.name}?`,
      a: st.species.map((s) => s.name).join(', ') + '.',
    },
    {
      q: `When is the best time to fly fish in ${st.name}?`,
      a: st.seasons.map((s) => `${s.window}: ${s.what}`).join(' '),
    },
  ];

  const meta = {
    path,
    title: `Fly Fishing in ${st.name}`,
    description: st.summary.length > 158 ? st.summary.slice(0, 155) + '…' : st.summary,
    priority: 0.8,
    changefreq: 'yearly',
    bodyClass: 'page-state',
    ogImage: '/og/flies.png',
    jsonld: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: `Fly Fishing in ${st.name}`,
        description: st.answer,
        mainEntityOfPage: url,
        about: { '@type': 'Place', name: `${st.name}, United States` },
        publisher: organizationSchema(site),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
          { '@type': 'ListItem', position: 2, name: 'Fly fishing by state', item: `${base}/fly-fishing-by-state/` },
          { '@type': 'ListItem', position: 3, name: st.name, item: url },
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
<article class="state">
  <div class="wrap">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <a href="/">Home</a> <span aria-hidden="true">›</span>
      <a href="/fly-fishing-by-state/">Fly fishing by state</a> <span aria-hidden="true">›</span>
      <span aria-current="page">${esc(st.name)}</span>
    </nav>

    <header class="page-head">
      <p class="eyebrow">${esc(st.region)}</p>
      <h1 class="h1 page-head__title">Fly fishing in ${esc(st.name)}</h1>

      <div class="aeo-answer">
        <p class="aeo-answer__label">Short answer</p>
        <p class="aeo-answer__text">${esc(st.answer)}</p>
      </div>
      ${st.localNote ? `<p class="state-local">${esc(st.localNote)}</p>` : ''}
    </header>

    <section class="state-section" aria-labelledby="diff-h">
      <h2 class="h2" id="diff-h">What makes ${esc(st.name)} different</h2>
      <div class="prose"><p>${esc(st.whatMakesItDifferent)}</p></div>
    </section>

    <section class="state-section" aria-labelledby="species-h">
      <h2 class="h2" id="species-h">What trout are in ${esc(st.name)}?</h2>
      <dl class="state-list">
        ${st.species
          .map(
            (s) => `<div class="state-list__row">
          <dt class="state-list__key">${esc(s.name)}</dt>
          <dd class="state-list__val">${esc(s.note)}</dd>
        </div>`
          )
          .join('\n        ')}
      </dl>
    </section>

    <section class="state-section" aria-labelledby="waters-h">
      <h2 class="h2" id="waters-h">Where to fly fish in ${esc(st.name)}</h2>
      <dl class="state-list">
        ${st.waters
          .map(
            (w) => `<div class="state-list__row">
          <dt class="state-list__key">${esc(w.name)}</dt>
          <dd class="state-list__val">${esc(w.note)}</dd>
        </div>`
          )
          .join('\n        ')}
      </dl>
    </section>

    <section class="state-section" aria-labelledby="when-h">
      <h2 class="h2" id="when-h">When to fly fish in ${esc(st.name)}</h2>
      <div class="post-tablewrap" tabindex="0">
        <table class="post-table">
          <caption class="post-table__caption">The season, month by month</caption>
          <thead><tr><th scope="col">When</th><th scope="col">What is happening</th></tr></thead>
          <tbody>
            ${st.seasons
              .map((s) => `<tr><td><strong>${esc(s.window)}</strong></td><td>${esc(s.what)}</td></tr>`)
              .join('\n            ')}
          </tbody>
        </table>
      </div>
    </section>

    <section class="state-section" aria-labelledby="lic-h">
      <h2 class="h2" id="lic-h">Do you need a licence to fly fish in ${esc(st.name)}?</h2>
      <div class="prose">
        <p>
          Yes. Licences are issued by
          <a href="${esc(lic.licenceUrl)}" rel="noopener">${esc(lic.agency)}</a>.
        </p>
      </div>
      <div class="post-tablewrap" tabindex="0">
        <table class="post-table">
          <caption class="post-table__caption">Adult annual fishing licence, ${esc(lic.priceYear)}</caption>
          <thead><tr><th scope="col">Licence</th><th scope="col">Price</th></tr></thead>
          <tbody>
            <tr><td>Resident, annual</td><td>${esc(lic.residentAnnual)}</td></tr>
            <tr><td>Non-resident, annual</td><td>${esc(lic.nonResidentAnnual)}</td></tr>
          </tbody>
        </table>
      </div>
      <p class="state-caveat">${esc(lic.priceNote)}</p>

      <h3 class="h3">Rules worth knowing before you go</h3>
      <ul class="state-rules">
        ${st.regulations.map((r) => `<li>${esc(r)}</li>`).join('\n        ')}
      </ul>
      <p class="text-faint">
        Regulations change every year and vary water by water. The
        <a href="${esc(lic.rulesUrl)}" rel="noopener">${esc(lic.agency)} rule book</a>
        is the only authority — this page is a starting point, not a legal reference.
      </p>
    </section>

    ${stateFlies.length ? `<section class="state-section" aria-labelledby="flies-h">
      <h2 class="h2" id="flies-h">Flies that matter in ${esc(st.name)}</h2>
      <p class="lede">Each of these is a card in the deck, and each has a full page in the Fly-brary.</p>
      <div class="card-grid fly-strip" style="--gap:var(--s-4)">
        ${stateFlies.map((f) => flyCard(f)).join('\n        ')}
      </div>
    </section>` : ''}

    <section class="state-section" aria-labelledby="more-h">
      <h2 class="h3" id="more-h">Keep reading</h2>
      <ul class="state-rules">
        <li><a href="/blog/do-i-need-a-fishing-license/">Do I need a fishing licence?</a> — how licensing works across states</li>
        <li><a href="/blog/how-to-read-water-fly-fishing/">How to read water</a> — where trout hold, anywhere</li>
        <li><a href="/blog/best-time-of-day-to-fly-fish/">Best time of day to fly fish</a> — the seasonal logic behind the table above</li>
        <li><a href="/flies/">The Fly-brary</a> — every fly in the deck, explained</li>
      </ul>
      ${others.length ? `<p class="cluster" style="margin-block-start:var(--s-5)">
        ${others.map((o) => `<a class="btn btn--quiet btn--sm" href="/fly-fishing-in-${esc(o.slug)}/">Fly fishing in ${esc(o.name)}</a>`).join('\n        ')}
      </p>` : ''}
    </section>
  </div>

  <section class="section section--sunk">
    <div class="wrap wrap--narrow text-center stack" style="--gap:var(--s-4)">
      <p class="eyebrow">The deck</p>
      <h2 class="h2">${site.product.cardCount} flies, drawn by hand, in your jacket pocket.</h2>
      <p class="lede">${esc(site.brand.shortDescription)}</p>
      <p class="cluster" style="justify-content:center">
        ${campaignCta(site)}
        <a class="btn btn--ghost" href="/deck/">See the deck</a>
      </p>
    </div>
  </section>
</article>`;

  return { meta, body };
}
