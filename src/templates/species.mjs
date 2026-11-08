/* Per-species page: /species/<slug>/
 *
 * The identification tier. It answers the question a beginner asks before any
 * other — "what did I just catch" — and the one a planner asks before a trip:
 * where does this fish live and is it protected.
 *
 * The conservation line is not decoration. Bull trout may not be targeted on
 * most waters, Dolly Varden are nearly indistinguishable from them, and
 * several cutthroat subspecies sit on recovery water with their own rules. A
 * page that describes a fish and omits its legal status is worse than no page.
 */

import { esc, flyCard } from './_shared.mjs';
import { organizationSchema } from './_blocks.mjs';


/* The brand suffix build.mjs appends costs 21 of the 60 characters a title
   gets, so a family suffix has to be measured, not assumed: ": Identification,
   Range and Habitat" was the obvious choice and puts every one of these pages
   over the limit. These two helpers keep that from happening silently.

   titleWithin() adds the suffix only when the result still fits, and falls
   back to the bare name otherwise. One hatch — Baitfish and Sculpin — takes
   the fallback. A conditional suffix is slightly inconsistent; a title the
   gate rejects, or a truncated one in a search result, is worse.

   leadWith() puts the subject at the front of the description, because these
   summaries were written to follow a heading that already said what the page
   was about and so most of them never name their own subject. It SKIPS any
   summary that already mentions it, rather than producing "Midge: midges
   are…". */
const TITLE_MAX = 60;
const BRAND_SUFFIX = ' — The Reel Deal Deck'.length;

function titleWithin(base, suffix) {
  return base.length + suffix.length + BRAND_SUFFIX <= TITLE_MAX ? base + suffix : base;
}

function leadWith(name, summary) {
  /* The WHOLE name, not its words. Matching word by word meant any summary
     containing "trout" counted as naming Brook Trout, Brown Trout, Lake Trout
     and nine others — which is nearly every summary here, so almost nothing
     got the prefix it needed. */
  const named = summary.toLowerCase().includes(name.toLowerCase());
  const text = named ? summary : `${name}: ${summary[0].toLowerCase()}${summary.slice(1)}`;
  return text.length > 158 ? `${text.slice(0, 155)}…` : text;
}

export default function ({ species: sp, speciesList, site, flies, states }) {
  const base = site.url.replace(/\/$/, '');
  const path = `/species/${sp.slug}/`;
  const url = base + path;

  const bySlug = new Map(flies.map((f) => [f.slug, f]));
  const spFlies = (sp.flies || []).map((s) => bySlug.get(s)).filter(Boolean);

  const stateBySlug = new Map((states || []).map((s) => [s.slug, s]));
  const spStates = (sp.states || []).map((s) => stateBySlug.get(s)).filter(Boolean);

  const others = (speciesList || []).filter((x) => x.slug !== sp.slug);

  const faqs = [
    { q: `How do you identify a ${sp.name.toLowerCase()}?`, a: sp.identify.map((i) => `${i.feature}: ${i.note}`).join(' ') },
    { q: `Where do ${sp.name.toLowerCase()} live?`, a: sp.range },
    { q: `What do ${sp.name.toLowerCase()} eat?`, a: sp.diet },
    { q: `How big do ${sp.name.toLowerCase()} get?`, a: sp.size },
  ];

  const meta = {
    path,
    title: titleWithin(sp.name, ': How to Identify'),
    /* leadWith() prefixes the name, which costs ~17 chars and pushed one
       species (cutthroat trout) past the limit, where the template clamped it
       mid-word. A hand-written field is the escape hatch, so the index card
       keeps its own copy instead of being shortened to suit the SERP. */
    description: sp.metaDescription || leadWith(sp.name, sp.summary),
    priority: 0.7,
    changefreq: 'yearly',
    bodyClass: 'page-species',
    ogImage: '/og/flies.png',
    jsonld: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: `${sp.name}: identification, range and how to catch them`,
        description: sp.answer,
        mainEntityOfPage: url,
        about: { '@type': 'Thing', name: sp.name, alternateName: sp.scientific },
        publisher: organizationSchema(site),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
          { '@type': 'ListItem', position: 2, name: 'Trout species', item: `${base}/species/` },
          { '@type': 'ListItem', position: 3, name: sp.name, item: url },
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
<article class="species">
  <div class="wrap">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <a href="/">Home</a> <span aria-hidden="true">›</span>
      <a href="/species/">Trout species</a> <span aria-hidden="true">›</span>
      <span aria-current="page">${esc(sp.name)}</span>
    </nav>

    <header class="page-head">
      <p class="eyebrow">${esc(sp.family)} &middot; <em>${esc(sp.scientific)}</em></p>
      <h1 class="h1 page-head__title">${esc(sp.name)}</h1>
      ${(sp.aka || []).length ? `<p class="hatch-aka">Also called ${sp.aka.map((a) => esc(a)).join(', ')}.</p>` : ''}

      <div class="aeo-answer">
        <p class="aeo-answer__label">Short answer</p>
        <p class="aeo-answer__text">${esc(sp.answer)}</p>
      </div>
    </header>

    <section class="state-section" aria-labelledby="id-h">
      <h2 class="h2" id="id-h">How to identify a ${esc(sp.name.toLowerCase())}</h2>
      <dl class="state-list">
        ${sp.identify.map((i) => `<div class="state-list__row">
          <dt class="state-list__key">${esc(i.feature)}</dt>
          <dd class="state-list__val">${esc(i.note)}</dd>
        </div>`).join('\n        ')}
      </dl>
    </section>

    <section class="state-section" aria-labelledby="about-h">
      <h2 class="h2" id="about-h">What a ${esc(sp.name.toLowerCase())} is</h2>
      <div class="prose"><p>${esc(sp.whatItIs)}</p></div>
      <dl class="state-list">
        <div class="state-list__row">
          <dt class="state-list__key">Native to</dt><dd class="state-list__val">${esc(sp.native)}</dd>
        </div>
        <div class="state-list__row">
          <dt class="state-list__key">Typical size</dt><dd class="state-list__val">${esc(sp.size)}</dd>
        </div>
        <div class="state-list__row">
          <dt class="state-list__key">What they eat</dt><dd class="state-list__val">${esc(sp.diet)}</dd>
        </div>
      </dl>
    </section>

    <section class="state-section" aria-labelledby="range-h">
      <h2 class="h2" id="range-h">Where ${esc(sp.name.toLowerCase())} live</h2>
      <div class="prose"><p>${esc(sp.range)}</p></div>
      ${spStates.length ? `<p class="cluster" style="margin-block-start:var(--s-5)">
        ${spStates.map((s) => `<a class="btn btn--quiet btn--sm" href="/fly-fishing-in-${esc(s.slug)}/">Fly fishing in ${esc(s.name)}</a>`).join('\n        ')}
      </p>` : ''}
    </section>

    <section class="state-section" aria-labelledby="status-h">
      <h2 class="h2" id="status-h">Conservation status</h2>
      <div class="prose"><p>${esc(sp.status)}</p></div>
      <p class="state-caveat">
        Protected status and the rules that follow from it are set state by state and change.
        Before you fish, check the current regulations for the water you are standing in &mdash;
        this page is a starting point, not a legal reference.
      </p>
    </section>

    <section class="state-section" aria-labelledby="catch-h">
      <h2 class="h2" id="catch-h">How to catch ${esc(sp.name.toLowerCase())}</h2>
      <div class="prose"><p>${esc(sp.howToCatch)}</p></div>
      ${(sp.tips || []).length ? `<ul class="state-rules">
        ${sp.tips.map((t) => `<li>${esc(t)}</li>`).join('\n        ')}
      </ul>` : ''}
    </section>

    ${spFlies.length ? `<section class="state-section" aria-labelledby="flies-h">
      <h2 class="h2" id="flies-h">Flies that work for ${esc(sp.name.toLowerCase())}</h2>
      <p class="lede">Each of these is a card in the deck, and each has a full page in Our Fly-brary.</p>
      <div class="card-grid fly-strip" style="--gap:var(--s-4)">
        ${spFlies.map((f) => flyCard(f)).join('\n        ')}
      </div>
    </section>` : ''}

    <section class="state-section" aria-labelledby="more-h">
      <h2 class="h3" id="more-h">Keep reading</h2>
      <ul class="state-rules">
        <li><a href="/blog/how-to-release-a-trout/">How to release a trout</a> — handling, and why it matters more for some species than others</li>
        <li><a href="/blog/how-to-read-water-fly-fishing/">How to read water</a> — where each of these fish holds</li>
        <li><a href="/hatches/">Hatches and what trout eat</a> — the food these fish are feeding on</li>
        <li><a href="/fly-fishing-by-state/">Fly fishing by state</a> — which species you will meet, state by state</li>
      </ul>
      ${others.length ? `<p class="cluster" style="margin-block-start:var(--s-5)">
        ${others.map((o) => `<a class="btn btn--quiet btn--sm" href="/species/${esc(o.slug)}/">${esc(o.name)}</a>`).join('\n        ')}
      </p>` : ''}
    </section>
  </div>
</article>`;

  return { meta, body };
}
