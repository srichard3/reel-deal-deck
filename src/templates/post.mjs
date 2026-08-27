/* ==========================================================================
   THE REEL DEAL DECK — article template  /blog/<slug>/
   --------------------------------------------------------------------------
   Called by buildPosts() in build.mjs as:
       const { meta, body } = await tpl.default({ post, posts, site, flies })

   The body order below is the entire strategy and is not negotiable:

       campaign bar -> breadcrumbs -> h1 -> byline -> ANSWER -> takeaways
       -> article -> in-content CTA -> FAQ -> sources -> related -> closing CTA

   Nothing may come between the h1 and the answer. A reader who asked a
   question gets it answered before anything is asked of them, and an answer
   engine lifting one block from the page gets a complete, correct answer.

   Schema is generated from `b.collected` — the record of what the block
   helpers actually rendered — so JSON-LD and visible content cannot drift.

   Resilient by design: articles are authored in parallel with this template.
   Missing, malformed or over-budget front matter degrades; it never throws.
   ========================================================================== */

import { makeBlocks, campaignState, esc, plain, clamp, wordCount, organizationSchema } from './_blocks.mjs';
import { flyCard } from './_shared.mjs';

/* The shell appends " — The Reel Deal Deck" (21 chars) and scripts/check.mjs
   fails the build over 60 total, so an article title has a 39-char budget. */
const TITLE_BUDGET = 39;
const DESC_MAX = 160;

const TOPICS = {
  basics:    { label: 'Getting started', blurb: 'First rod, first cast, first fish.' },
  gear:      { label: 'Gear',            blurb: 'What to buy, what to skip, and why.' },
  technique: { label: 'Technique',       blurb: 'Casting, mending, presentation, hook sets.' },
  knots:     { label: 'Knots',           blurb: 'The handful of knots that actually matter.' },
  seasons:   { label: 'Seasons & timing',blurb: 'When to go, and what to expect when you do.' },
  practical: { label: 'Practical',       blurb: 'Licences, costs, etiquette, catch and release.' },
};
const topicOf = (p) => (TOPICS[p?.topic] ? p.topic : 'basics');

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];

/** '2026-08-04' -> '4 August 2026'. Returns '' for anything unparseable. */
function humanDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso ?? ''));
  if (!m) return '';
  const [, y, mo, d] = m;
  const mi = Number(mo) - 1;
  if (mi < 0 || mi > 11) return '';
  return `${Number(d)} ${MONTHS[mi]} ${y}`;
}
const isoDate = (v) => (/^\d{4}-\d{2}-\d{2}/.test(String(v ?? '')) ? String(v).slice(0, 10) : '');

/* Warnings surfaced in the build log rather than thrown — a half-written
   article from a parallel agent is not a broken deploy. */
const warn = (slug, msg) => console.warn(`  post(${slug}): ${msg}`);

export default function ({ post, posts = [], site, flies = [] }) {
  const slug = String(post?.slug || String(post?.file || 'untitled').replace(/\.mjs$/, ''));
  const path = `/blog/${slug}/`;
  const base = String(site?.url || '').replace(/\/$/, '');
  const url = base + path;
  const blogPath = (site?.blog?.path) || '/blog/';
  const blogName = (site?.blog?.name) || 'Fly Fishing Guides';

  /* ------------------------------------------------------------ meta --- */

  const question = String(post?.question || post?.title || slug).trim();

  let title = String(post?.title || question).trim();
  if (title.length > TITLE_BUDGET) {
    warn(slug, `title is ${title.length} chars (budget ${TITLE_BUDGET}) — truncated for <title>`);
    title = clamp(title, TITLE_BUDGET);
  }

  let description = String(post?.description || post?.answer || '').trim();
  if (description.length > DESC_MAX) {
    warn(slug, `description is ${description.length} chars (max ${DESC_MAX}) — truncated`);
    description = clamp(description, DESC_MAX);
  }
  if (!description) warn(slug, 'no description — the SERP snippet will be whatever Google picks');

  const published = isoDate(post?.date);
  const updated = isoDate(post?.updated);
  const topic = topicOf(post);

  /* ------------------------------------------------- render the article -- */

  const b = makeBlocks({ flies });

  let article = '';
  try {
    article = String(post?.render?.({ post, posts, site, flies, b }) ?? '');
  } catch (e) {
    warn(slug, `body failed to render — ${e.message}`);
    article = `<!-- TODO-CONFIRM: article body failed to render (${esc(e.message)}) -->`;
  }

  /* Articles are written out of order, so one will cross-link a guide that is
     not published yet. A broken internal link is the single most expensive
     failure in scripts/check.mjs — the crawler follows it, 404s, and the page
     it pointed at never enters the index. Degrade the link to plain text
     instead, exactly as b.flyLink does for an unknown fly, and say so in the
     build log. When the target ships, the link comes back on its own. */
  const knownSlugs = new Set(posts.map((p) => p?.slug).filter(Boolean));
  const dangling = new Set();
  article = article.replace(
    /<a\b[^>]*\shref="\/blog\/([a-z0-9][a-z0-9-]*)\/"[^>]*>([\s\S]*?)<\/a>/gi,
    (whole, target, text) => {
      if (target === 'topics' || knownSlugs.has(target)) return whole;
      dangling.add(target);
      return `<span class="post-flyref">${text}</span>`;
    }
  );
  if (dangling.size) {
    warn(slug, `link(s) to unpublished guide(s) rendered as plain text: ${[...dangling].join(', ')}`);
  }

  /* The article may render its own answer / takeaways / FAQ / sources with the
     block helpers. If it did, we do not render a second copy — duplicated
     content is bad, and duplicated FAQ content with one schema block is worse. */
  const has = (marker) => article.includes(marker);

  /* --------------------------------------------------------- the answer -- */

  const answerText = b.collected.answer || String(post?.answer || '').trim();
  const answerHtml = has('data-aeo-answer') ? '' : b.answer(post?.answer);
  if (!answerText) {
    warn(slug, 'no answer block — this is the block an AI engine quotes');
  } else {
    const w = wordCount(answerText);
    if (w < 30 || w > 75) warn(slug, `answer is ${w} words; the contract asks for 40–60`);
  }

  const takeawaysHtml = has('data-aeo-takeaways') ? '' : b.takeaways(post?.takeaways || []);

  /* ------------------------------------------------------------- FAQ ---- */
  /* Schema is built from b.collected.faqs, which only ever contains what was
     actually rendered — by the article or by the block below. */
  const faqHtml = has('data-aeo-faq') ? '' : b.faq(post?.faqs || []);
  const faqs = b.collected.faqs;

  /* ---------------------------------------------------------- sources --- */
  const sourcesHtml = has('data-aeo-sources') ? '' : b.sources(post?.sources || []);

  /* --------------------------------------------------- internal linking -- */
  /* Every post links to >= 3 other posts and >= 2 fly pages. Internal linking
     is the engine; `related` from the front matter is a hint, not the source
     of truth, because it is thin or empty while the blog is being written. */

  const others = posts.filter((p) => p && p.slug !== slug);
  const bySlugPost = new Map(others.map((p) => [p.slug, p]));
  const relatedPosts = [];
  const pushPost = (p) => {
    if (p && p.slug !== slug && !relatedPosts.some((r) => r.slug === p.slug)) relatedPosts.push(p);
  };
  for (const s of Array.isArray(post?.related) ? post.related : []) pushPost(bySlugPost.get(s));
  for (const p of others) { if (relatedPosts.length >= 3) break; if (topicOf(p) === topic) pushPost(p); }
  for (const p of others) { if (relatedPosts.length >= 3) break; pushPost(p); }
  const missingRelated = (Array.isArray(post?.related) ? post.related : []).filter((s) => !bySlugPost.has(s));
  if (missingRelated.length) warn(slug, `related post slug(s) not found: ${missingRelated.join(', ')}`);
  if (relatedPosts.length < 3) {
    warn(slug, `only ${relatedPosts.length} related post link(s) available — falling back to the Fly Library`);
  }

  const flyBySlug = new Map(flies.map((f) => [f.slug, f]));
  const relatedFlies = [];
  const pushFly = (f) => { if (f && !relatedFlies.some((r) => r.slug === f.slug)) relatedFlies.push(f); };
  for (const s of Array.isArray(post?.relatedFlies) ? post.relatedFlies : []) pushFly(flyBySlug.get(s));
  for (const s of b.collected.flyLinks) pushFly(flyBySlug.get(s));
  /* Everything above this line is a pattern the article actually names. */
  const mentionedFlies = relatedFlies.slice();
  /* Fallback so the >= 2 fly links hold even for an article that names none:
     the beginner-friendly patterns, which are the right answer for a reader
     who arrived on a general question anyway. */
  for (const s of ['adams', 'pheasant-tail-nymph', 'elk-hair-caddis', 'woolly-bugger']) {
    if (relatedFlies.length >= 4) break;
    pushFly(flyBySlug.get(s));
  }
  for (const f of flies) { if (relatedFlies.length >= 4) break; pushFly(f); }
  const missingFlies = (Array.isArray(post?.relatedFlies) ? post.relatedFlies : [])
    .filter((s) => !flyBySlug.has(s));
  if (missingFlies.length) warn(slug, `relatedFlies slug(s) not in data/flies.json: ${missingFlies.join(', ')}`);

  /* ---------------------------------------------------------- campaign -- */

  const camp = campaignState(site);

  /* ------------------------------------------------ in-content CTA slot -- */
  /* The pitch goes after the article has actually been useful — three sections
     in — never before the answer. On a short article there is no honest
     mid-point, so it falls to the end rather than interrupting.
     `b.section()` is the only thing that emits this marker, so splitting on it
     is safe even though the article also contains nested <section> elements. */

  const MARK = '<section class="post-section"';
  const starts = [];
  for (let i = article.indexOf(MARK); i !== -1; i = article.indexOf(MARK, i + 1)) starts.push(i);
  const ctaHtml = inContentCta({ camp, site });
  const cut = starts.length >= 5 ? starts[3] : -1;
  const bodyWithCta =
    cut === -1 ? article : article.slice(0, cut) + ctaHtml + '\n' + article.slice(cut);
  const trailingCta = cut === -1 ? ctaHtml : '';

  /* ------------------------------------------------------- reading time -- */

  const words = wordCount(article) + wordCount(answerText);
  const readingTime =
    Number.isFinite(post?.readingTime) && post.readingTime > 0
      ? Math.round(post.readingTime)
      : Math.max(1, Math.round(words / 225));

  /* -------------------------------------------------------------- HowTo -- */

  const howToSteps =
    (Array.isArray(post?.howTo?.steps) && post.howTo.steps.length
      ? post.howTo.steps
      : b.collected.steps
    ).map((s) => ({ name: plain(s?.name), text: plain(s?.text || s?.name) })).filter((s) => s.name || s.text);

  if (post?.howTo && !howToSteps.length) warn(slug, 'howTo declared but no steps were rendered — HowTo schema omitted');

  /* -------------------------------------------------------------- JSON-LD */

  const publisher = {
    ...organizationSchema(site),
    logo: { '@type': 'ImageObject', url: `${base}/icon-512.png` },
  };
  /* TODO-CONFIRM: site.blog.authorNote — articles are attributed to the brand.
     A named author (Ken) is a real E-E-A-T signal for Google and for answer
     engines. Add a Person here the moment the founders agree to a byline. */
  const author = organizationSchema(site);

  const jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: clamp(question, 110),
      name: title,
      description,
      articleSection: TOPICS[topic].label,
      inLanguage: 'en-US',
      ...(published ? { datePublished: published } : {}),
      dateModified: updated || published || undefined,
      author,
      publisher,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      isPartOf: { '@type': 'Blog', name: blogName, url: base + blogPath },
      ...(answerText ? { abstract: answerText } : {}),
      wordCount: words || undefined,
      /* The two blocks that are genuinely worth reading aloud: the question
         and the 40–60 word answer. Nothing else on the page qualifies. */
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['.post-head__title', '.aeo-answer__text'],
      },
      /* Only patterns the article genuinely names — never the fallback set the
         "flies mentioned" strip pads itself out with. */
      ...(mentionedFlies.length
        ? { mentions: mentionedFlies.slice(0, 6).map((f) => ({ '@type': 'Thing', name: `${f.name} fly pattern`, url: `${base}/flies/${f.slug}/` })) }
        : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site?.url },
        { '@type': 'ListItem', position: 2, name: 'Guides', item: base + blogPath },
        { '@type': 'ListItem', position: 3, name: question, item: url },
      ],
    },
  ];

  /* FAQPage only when Q&A is actually visible on the page. */
  if (faqs.length) {
    jsonld.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }

  /* HowTo only when the article declares one AND the steps are on the page. */
  if (post?.howTo && howToSteps.length) {
    jsonld.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: plain(post.howTo.name || question),
      ...(description ? { description } : {}),
      ...(post.howTo.totalTime ? { totalTime: post.howTo.totalTime } : {}),
      step: howToSteps.map((s, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: s.name || `Step ${i + 1}`,
        text: s.text || s.name,
        url: `${url}#${b.slugify(s.name || `step-${i + 1}`)}`,
      })),
    });
  }

  const meta = {
    path,
    title,
    description,
    priority: 0.7,
    changefreq: 'monthly',
    bodyClass: 'page-post',
    ogImage: post?.ogImage || '/og/default.png',
    jsonld,
    /* Resolved campaign values for  — see the partial. */
    campaignKey: camp.key,
    campaignEyebrow: camp.eyebrow,
    campaignCta: camp.cta,
    campaignUrl: camp.url,
    campaignRel: camp.external ? 'noopener' : '',
  };

  /* ----------------------------------------------------------------- body */

  const bylineBits = [
    published ? `<span>Published <time datetime="${esc(published)}">${esc(humanDate(published))}</time></span>` : '',
    updated ? `<span>Updated <time datetime="${esc(updated)}">${esc(humanDate(updated))}</time></span>` : '',
    `<span>${readingTime} min read</span>`,
    `<span><a href="${esc(blogPath)}#${esc(topic)}">${esc(TOPICS[topic].label)}</a></span>`,
  ].filter(Boolean);

  const body = `
<link rel="stylesheet" href="/styles/blog.css">

<article class="post" data-post="${esc(slug)}">
  <div class="wrap wrap--narrow">
    <nav class="breadcrumbs post-breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li><a href="/">Home</a></li>
        <li><a href="${esc(blogPath)}">Guides</a></li>
        <!-- Kept short deliberately: a breadcrumb that wraps to two lines on a
             360px phone costs ~24px of the space the answer block needs. -->
        <li><span aria-current="page">${esc(clamp(title, 32))}</span></li>
      </ol>
    </nav>

    <header class="post-head">
      <p class="eyebrow"><a class="post-head__topic" href="${esc(blogPath)}#${esc(topic)}">${esc(TOPICS[topic].label)}</a></p>
      <h1 class="h1 post-head__title">${esc(question)}</h1>
      <p class="byline post-byline">${bylineBits.join('\n        ')}</p>
    </header>

    ${answerHtml}
    ${takeawaysHtml}

    <div class="post-body prose">
      ${bodyWithCta}
    </div>

    ${trailingCta}

    ${faqHtml}
    ${sourcesHtml}

    <section class="post-related" aria-labelledby="keep-reading">
      <h2 class="post-h2" id="keep-reading">Keep reading</h2>
      ${
        relatedPosts.length
          ? `<ul class="post-related__list">
        ${relatedPosts
          .slice(0, 4)
          .map(
            (p) => `<li><a class="post-related__link" href="/blog/${esc(p.slug)}/">
          <span class="post-related__q">${esc(p.question || p.title || p.slug)}</span>
          ${p.description ? `<span class="post-related__d">${esc(clamp(p.description, 110))}</span>` : ''}
        </a></li>`
          )
          .join('\n        ')}
      </ul>`
          : ''
      }
      <p class="post-related__more">
        <a href="${esc(blogPath)}">All fly-fishing guides</a> ·
        <a href="/blog/topics/">Browse by topic</a> ·
        <a href="/flies/">The Fly Library</a>
      </p>
    </section>

    <section class="post-related post-related--flies" aria-labelledby="related-flies">
      <h2 class="post-h2" id="related-flies">Flies mentioned in this guide</h2>
      <p class="post-related__note">Every pattern below has its own page in the free Fly Library — what it imitates, what sizes to carry, and when to fish it.</p>
      <div class="card-grid post-flies" style="--gap:var(--s-4)">
        ${relatedFlies.slice(0, 4).map((f) => flyCard(f)).join('\n        ')}
      </div>
    </section>
  </div>

  ${closingCta({ camp, site, question })}
</article>
<script src="/js/blog.js" defer></script>`;

  return { meta, body };
}

/* ----------------------------------------------------------------- CTAs -- */
/* Both CTAs read only the resolved campaign state. No template and no article
   ever hard-codes the platform name, the copy or the URL. */

function inContentCta({ camp, site }) {
  return `
    <aside class="aeo-cta" aria-labelledby="cta-h">
      <p class="eyebrow">${esc(camp.eyebrow)}</p>
      <p class="aeo-cta__headline" id="cta-h">${esc(camp.headline || `${site?.name} — ${site?.tagline}`)}</p>
      <p class="aeo-cta__sub">${esc(camp.sub || site?.positioning || '')}</p>
      <p class="cluster">
        <a class="btn btn--primary" href="${esc(camp.url)}"${camp.external ? ' rel="noopener"' : ''}>${esc(camp.cta)}</a>
        <a class="btn btn--quiet" href="/deck/">What is in the deck</a>
      </p>
    </aside>`;
}

function closingCta({ camp, site }) {
  return `
  <section class="section section--sunk post-endcta">
    <div class="wrap wrap--narrow text-center stack" style="--gap:var(--s-4)">
      <p class="eyebrow">${esc(camp.eyebrow)}</p>
      <h2 class="h2">The answers above, in your vest pocket.</h2>
      <p class="lede mx-auto">
        ${esc(site?.product?.cardCount || 54)} hand-drawn flies on ${esc(site?.product?.stock || 'genuine Bicycle stock')},
        with a contribution to ${esc(site?.conservation?.partner || 'Trout Unlimited')} from every deck.
      </p>
      <p class="cluster" style="justify-content:center">
        <a class="btn btn--primary" href="${esc(camp.url)}"${camp.external ? ' rel="noopener"' : ''}>${esc(camp.cta)}</a>
        <a class="btn btn--ghost" href="/flies/">Browse all 54 flies</a>
      </p>
    </div>
  </section>`;
}
