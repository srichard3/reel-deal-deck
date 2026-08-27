# Answer Engine Optimisation

How the blog earns citations from Google's answer boxes and from AI assistants, how the
machinery actually works, how to verify a page still works, and what would break it.

Read `docs/BLOG-CONTRACT.md` first — this document explains the *implementation* of the rules
it sets out.

---

## The one rule everything else serves

**A page earns a citation by containing a complete, correct answer in a block that can be lifted
out of the page with no surrounding context.**

Ranking and being quoted are different disciplines. Ranking rewards a page that is comprehensive.
Being quoted rewards a page that is *extractable*: a model reading the HTML must be able to pull
one region and have it stand on its own. A brilliant article whose answer is spread across four
paragraphs of narrative gets outranked for citations by a mediocre one with the answer in a box.

---

## The answer-first rule

Every article renders, in this exact order:

```
campaign bar → breadcrumbs → h1 (the question) → byline → THE ANSWER → takeaways
→ article body → in-content CTA → FAQ → sources → related posts + related flies → closing CTA
```

Nothing may come between the `<h1>` and the answer block. Not an image, not a table of contents,
not an email capture, not a "before we begin". `src/templates/post.mjs` enforces the order
structurally — the answer is emitted immediately after the `<header>` and there is no hook to
insert anything between them.

The answer is 40–60 words of `meta.answer`, rendered as:

```html
<div class="aeo-answer" data-aeo-answer>
  <p class="aeo-answer__label">Short answer</p>
  <p class="aeo-answer__text">…</p>
</div>
```

`post.mjs` warns in the build log when the answer is outside 30–75 words, and warns when it is
missing entirely. It never fails the build for it — a half-written article is not a broken deploy.

The same text is emitted as the `abstract` of the page's `Article` schema and named in the
`speakable` specification, so the three places a machine looks for "the answer" all agree.

### Why the campaign bar is where it is

The bar is capped at `3rem`, is a single non-wrapping line with one link, and sits in normal flow
above the article. That is not a stylistic preference. An intrusive top interstitial is a Google
page-experience problem, and — more expensively — it pushes the answer block below the fold, which
is the exact region we want a machine and a human to hit first. If you make the bar taller, add a
second line, or turn it into an overlay, you have degraded the thing the whole page is built
around. Check it on a 375px-wide viewport before you ship a change to it.

---

## Why schema is generated from visible content

Schema for content a reader cannot see is a manual action from Google and, from an AI engine's
point of view, a reason to distrust the whole domain. So the system makes it *structurally
impossible* to emit schema for invisible content rather than relying on discipline.

`src/templates/_blocks.mjs` builds a fresh `b` object for each article. Every helper with a
matching schema type records what it actually rendered on `b.collected`:

| Helper | Records | Feeds |
|---|---|---|
| `b.answer(text)` | `collected.answer` | `Article.abstract` |
| `b.faq([{q,a}])` | `collected.faqs` | `FAQPage.mainEntity` |
| `b.steps([{name,text}])` | `collected.steps` | `HowTo.step` |
| `b.section(heading, html)` | `collected.sections` | the page's anchor ids |
| `b.flyLink(slug)` | `collected.flyLinks` | `Article.mentions` |
| `b.sources([…])` | `collected.sources` | the rendered source list |

`post.mjs` then builds JSON-LD **from `b.collected`, never from `meta`**. The consequence is the
important part: if a block did not render, its schema does not exist. `FAQPage` is emitted only
when `collected.faqs` is non-empty. `HowTo` is emitted only when the article declares `meta.howTo`
*and* steps were actually rendered onto the page.

There is one more guard. An article may call `b.faq()` itself, or let `post.mjs` render
`meta.faqs`. If the article already rendered one (detected by the `data-aeo-faq` marker in the
body HTML), `post.mjs` does not render a second — so there is exactly one visible FAQ, and the
schema is built from it. The same applies to `data-aeo-answer`, `data-aeo-takeaways` and
`data-aeo-sources`.

### What is deliberately not emitted

- **No `aggregateRating`, no `Review`.** There are no reviews. Inventing them is fraud, and it is
  the single most reliably penalised schema abuse there is.
- **No `Person` author yet.** `data/site.json` carries a `TODO-CONFIRM` on this. Articles are
  attributed to the organisation. A named author with real fishing credentials is a genuine
  E-E-A-T signal for Google and for answer engines, and is the highest-value open item on this
  system — but a fabricated one is worse than none.
- **No `speakable` on prose.** Only `.post-head__title` and `.aeo-answer__text` — the two blocks
  that are actually worth reading aloud.

---

## Deep links: why every `<h2>` has an id

`b.section(heading, html)` slugifies the heading into a stable `id` on the `<h2>`, deduplicating
within the page. That makes every section individually addressable:

```
https://reeldealdeck.com/blog/<slug>/#what-weight-fly-rod-should-a-beginner-buy
```

This is how a featured snippet or an AI answer points at one specific answer rather than at the
page. **Those ids are permanent addresses.** Rewording an `<h2>` changes its id and breaks every
link anyone ever made to it. If you must reword a heading, pass the old slug explicitly:

```js
b.section('A better wording of the question', html, { id: 'the-original-slug' })
```

---

## Making facts extractable

Flowing prose does not get quoted. Structure does.

- **Comparisons need `b.table(headers, rows)`.** It renders a real `<table>` with `<th scope="col">`
  header cells and `<th scope="row">` first cells, wrapped in a container with `overflow-x: auto`
  and `tabindex="0"`. Wide tables scroll inside themselves; the page body never scrolls
  horizontally on a phone, and the scroll container is reachable from the keyboard.
- **How-tos need `b.steps([{name, text}])`.** A real `<ol>`, and the same data backs `HowTo`.
- **Units, ranges and caveats go in the text.** "A 9-foot 5-weight, the most common trout setup in
  North America" can be quoted. "The right rod for the job" cannot.
- **Sections must be self-contained.** A model may lift one `<h2>` block with nothing around it.
  "As mentioned above" makes that block wrong.

---

## The cannibalisation boundary

The Fly Library owns every fly-pattern query. The blog owns everything else. Two pages of ours
competing for one query is how a site loses both.

`b.flyLink('adams')` is the mechanism: it looks the slug up in `data/flies.json` and renders a link
to `/flies/adams/` with the fly's real name. An unknown slug renders as plain text and does **not**
break the build, because an article may reference a fly before anyone has verified the slug.

`post.mjs` applies the same treatment to guide-to-guide links: an `href="/blog/<slug>/"` pointing
at an article that has not been published yet is rewritten to plain text and reported in the build
log. Articles get written out of order, and a broken internal link is the most expensive failure
`npm run check` catches — the crawler follows it, 404s, and the page it pointed at never enters the
index. When the target ships, the link restores itself on the next build.

---

## Internal linking

Every article links to **at least 3 other articles and at least 2 fly pages**, with graceful
fallback: `meta.related` is a hint, not the source of truth. `post.mjs` fills gaps with same-topic
articles, then any article, then falls back to the Fly Library; the fly strip pads out with the
beginner patterns (Adams, Pheasant Tail, Elk Hair Caddis, Woolly Bugger), which are the right
answer for a reader who arrived on a general question anyway.

`Article.mentions` only ever lists patterns the article genuinely names — never the padding.

---

## Topic hubs: one page, not six

`docs/BLOG-CONTRACT.md` sketches `/blog/topics/<topic>/` as six hubs. They are not built that way,
deliberately.

Six hub pages carrying one or two articles each is thin content: six URLs competing with `/blog/`
for the same head terms, internal link equity split six ways, and six near-duplicate pages whose
only real content is a list. So:

- The topics are **anchored sections on `/blog/`** (`#basics`, `#gear`, `#technique`, `#knots`,
  `#seasons`, `#practical`) with real ids, real `<h2>`s and `aria-labelledby`. They are linkable
  and quotable addresses; they simply are not separate URLs.
- **`/blog/topics/`** is the crawlable map of the taxonomy — what each topic covers, what it
  deliberately does not, and where the Fly Library boundary sits. That last part is content no
  other page on the site has, which is what stops it being a duplicate of `/blog/`.

**When to promote a topic to its own hub:** roughly six or more published articles under it. At
that point add `src/pages/blog-topic-<topic>.mjs`, point the entries in `/blog/topics/` at the new
URL, and add the old anchor to `static/_redirects`. Until then, consolidating the authority on one
strong index page is worth more than six weak ones.

---

## AI crawlers

`static/robots.txt` currently allows **all** crawlers via `User-agent: *`, with only tracking
parameters and `/404/` disallowed. That means every named AI crawler below is allowed today.

| Crawler | Operator | What it is for |
|---|---|---|
| `GPTBot` | OpenAI | Training data collection |
| `OAI-SearchBot` | OpenAI | Indexing for ChatGPT search results |
| `ChatGPT-User` | OpenAI | Fetches a page live when a user's prompt needs it |
| `ClaudeBot` | Anthropic | Training data collection |
| `Claude-User` / `Claude-SearchBot` | Anthropic | Live user fetches / search indexing |
| `PerplexityBot` | Perplexity | Indexing for Perplexity answers |
| `Google-Extended` | Google | Gemini training and grounding (does **not** affect Search ranking) |
| `CCBot` | Common Crawl | Open crawl corpus most model builders consume |
| `Applebot-Extended` | Apple | Apple Intelligence training (`Applebot` itself serves Siri/Spotlight) |
| `Bytespider` | ByteDance | Training data collection |
| `Amazonbot`, `meta-externalagent` | Amazon, Meta | Assistant indexing / training |

### Recommendation for the founders — a licensing decision, not a technical one

Making these crawlers explicit in `robots.txt` is worth doing, because the current
`User-agent: *` grants everything by silence. Being explicit means the policy is a decision on the
record rather than a default nobody chose.

There are two honest positions:

1. **Allow everything (what the site does today).** The entire acquisition strategy is being found
   — by search engines and increasingly by assistants. A citation inside an AI answer is
   distribution to exactly the beginner this brand wants to reach, and this content exists to be
   free. The cost is that the text is also training data with no attribution guarantee.
2. **Allow the search/live-fetch bots, disallow the pure training bots.** Keeps the citations
   (which drive traffic) while withholding the corpus (which does not). Note this is a weaker
   distinction than it sounds: the split is only as good as each operator's compliance, and
   `robots.txt` is a request, not an enforcement mechanism.

The recommendation is **position 1**, made explicit. This is a 60-page free reference library whose
whole job is to be found and quoted; withholding it from the systems people increasingly ask first
costs more than it protects. But it is the founders' call — it is a content-licensing decision, not
an engineering one, and it is easy to reverse.

**You do not own `static/robots.txt` from this system — this is a copy-paste snippet.** Paste the
block below immediately after the existing `User-agent: *` group, keeping the existing tracking
parameter and `/404/` rules where they are:

```
# ---------------------------------------------------------------------------
# AI crawlers — stated explicitly rather than inherited from `User-agent: *`.
# This is a content-licensing decision. Current position: allow everything.
# The free reference content on this site exists to be found and quoted, and a
# citation inside an AI answer reaches the beginner we are trying to reach.
#
# To withhold the site from model TRAINING while keeping it available for
# assistant SEARCH and live user fetches, change GPTBot, ClaudeBot, CCBot,
# Google-Extended, Applebot-Extended and Bytespider below to `Disallow: /`
# and leave the rest allowed. Do not disallow Googlebot or Bingbot under any
# circumstances — those are the search crawlers, and Google-Extended is a
# separate token that has no effect on Search ranking.
# ---------------------------------------------------------------------------

# OpenAI
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

# Anthropic
User-agent: ClaudeBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: Claude-SearchBot
Allow: /

# Perplexity
User-agent: PerplexityBot
Allow: /

# Google (Gemini training/grounding; separate from Googlebot and from ranking)
User-agent: Google-Extended
Allow: /

# Common Crawl
User-agent: CCBot
Allow: /

# Apple Intelligence
User-agent: Applebot-Extended
Allow: /

# ByteDance
User-agent: Bytespider
Allow: /
```

`/llms.txt` complements this: a hand-maintained plain-Markdown map of the site for LLM consumers.
It lists **sections, not individual articles**, on purpose — it is a static file and an
article-level list would go stale the day the next guide ships. It also states the things we most
need a machine not to get wrong: the deck is pre-launch and not shipping, the price is not final,
and licence rules are state-specific.

---

## How to verify a page is extractable

Run all four. The first two are the gate; the last two are the ones that actually catch AEO
regressions.

**1. Build and check.**

```bash
node build.mjs
npm run check     # must report 0 errors; TODO-CONFIRM warnings are the founders' punch list
```

**2. Read the build log.** `post.mjs` prints a warning line per article for: an over-budget title
or description (truncated, not failed), an answer outside 30–75 words, a missing answer, a
`related` slug that does not exist, fewer than three related articles available, a `relatedFlies`
slug missing from `data/flies.json`, a link to an unpublished guide, and a `howTo` with no rendered
steps. None of these fail the build; all of them are real defects.

**3. Prove the schema matches the page.** For an article page:

```bash
node -e '
const fs=require("fs"),f=process.argv[1],h=fs.readFileSync(f,"utf8");
const strip=s=>s.replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim();
for(const m of h.matchAll(/<script[^>]*ld\+json[^>]*>([\s\S]*?)<\/script>/g)){
  const j=JSON.parse(m[1].replace(/\\u003c/g,"<"));
  console.log(j["@type"]);
  if(j["@type"]==="FAQPage") for(const q of j.mainEntity)
    console.log("  Q:",q.name,"\n     found on page:",h.includes(q.name.replace(/&/g,"&amp;")));
}
console.log("answer on page:",strip((h.match(/aeo-answer__text">([\s\S]*?)<\/p>/)||[])[1]||"").split(/\s+/).length,"words");
' dist/blog/<slug>/index.html
```

Every FAQ question must report `found on page: true`, and the answer must be 40–60 words. Then
paste the page into Google's Rich Results Test and Schema.org's validator before a launch.

**4. Read the page with CSS and JS off.** `curl` it, or disable both in dev tools. The h1, the
answer, every section heading, the FAQ, the sources and every internal link must still be there and
in order. If the answer only appears after JS runs, no answer engine will ever see it.

---

## What would break this

In rough order of damage:

1. **Putting anything between the `<h1>` and the answer block.** A subscribe box, a hero image, a
   table of contents, a taller campaign bar. This is the whole system.
2. **Writing schema by hand in an article, or from `meta` instead of `b.collected`.** The moment
   schema stops being generated from rendered content, it starts drifting, and drifted FAQ schema
   is a manual action.
3. **Writing a "what is the X fly" article.** It competes with the Fly Library page for the same
   query and both lose. Link with `b.flyLink()` instead.
4. **Rewording an `<h2>` without pinning its old id.** Silently breaks every deep link and every
   existing citation to that section.
5. **Rendering content client-side.** JS is progressive enhancement only; `src/js/blog.js` does
   exactly one thing (dismissing the campaign bar) and the page is complete without it.
6. **Prose instead of tables and steps.** A comparison without a table does not get quoted.
7. **Inventing a statistic, price, study or quote to make a section quotable.** It will get quoted,
   and it will be wrong with our name on it. Unverifiable claims become `TODO-CONFIRM` comments.
8. **Letting a title exceed 39 characters or a description exceed 160.** `post.mjs` truncates both
   rather than failing, but a truncated title is a truncated title — fix it in the article.
9. **Adding a webfont, a CDN or an external request.** `npm run check` fails on it, and it is a
   render-blocking single point of failure in front of the answer.

---

## The Fly Library treatment (added Aug 2026)

The 55 fly pages are the largest surface an answer engine will crawl here, and they
now get the same treatment the guides do.

### The answer block

`buildAnswer()` in `src/templates/fly.mjs` assembles a **40–60 word** answer and
renders it immediately after the `<h1>`, before any other prose. It is generated
from `data/flies.json` only — `cardCategory`, `imitates`, `sizes`, `whenToFish`,
`howToFish`, `summary` — so it can never contain a claim the data does not make.

It reads: *"The Adams is a dry fly that imitates adult mayflies and midges,
generically. It is usually tied in sizes 12 to 16. Fish it any time you see mayfly
duns on the surface…"*

Two details that matter and were bugs the first time:

- The indefinite article agrees with the **category**, not the fly's name.
  "The Adams is **a** dry fly", never "an dry fly".
- Slashed categories are spoken, not printed: `Midge/Emerger` renders as
  "a midge or emerger", because an assistant may read the answer aloud.

The same string is used as the `Article` `description` in the schema, so the page's
summary and its answer can never drift apart.

**When adding a fly**, check the generated answer lands in range:

```bash
node build.mjs && node -e "const re=require('fs');" 
```
…or simply re-run the range check used when this shipped: every page must produce
40–60 words. A fly with a very short `imitates` and no `whenToFish` will fall under.

### FAQ schema matches visible headings, exactly

Each fly page emits three `FAQPage` questions, and **each one is rendered as a
visible `<h2>` with its answer directly beneath it**:

| Schema question | Visible `<h2>` | Answer source |
|---|---|---|
| What does *X* imitate? | same | `fly.imitates` |
| How do you fish *X*? | same | `fly.howToFish` |
| When should you fish *X*? | same | `fly.whenToFish` |

This was originally wrong — two of the three questions existed only in the schema
while the headings read "When to fish it" and had no "what does it imitate"
section at all. That is schema describing invisible content, which is both against
the rule in this document and a Google structured-data policy risk.

**If you change a heading on a fly page, change the schema question with it.**
Verify with:

```bash
node build.mjs && node -e "
const fs=require('fs'),path=require('path');
let bad=0;
for(const d of fs.readdirSync('dist/flies')){
  const f=path.join('dist/flies',d,'index.html');
  if(!fs.existsSync(f))continue;
  const h=fs.readFileSync(f,'utf8');
  const m=h.match(/<script type=\"application\/ld\+json\">(.*?)<\/script>/gs)||[];
  const faq=m.map(x=>JSON.parse(x.replace(/<[^>]*>/g,''))).find(j=>j['@type']==='FAQPage');
  if(!faq)continue;
  const heads=[...h.matchAll(/<h2[^>]*>(.*?)<\/h2>/gs)].map(x=>x[1].replace(/<[^>]+>/g,'').trim());
  for(const q of faq.mainEntity) if(!heads.includes(q.name)){console.log('MISMATCH',d,q.name);bad++;}
}
console.log(bad?bad+' mismatches':'all fly pages OK');"
```

### The campaign bar and the answer block

The bar now renders from `src/_partials/shell.html` on **every** route, not just
blog pages. It is capped at 3rem and sits above the header precisely so it cannot
displace the answer block — that block is what an engine quotes, and pushing it
down the page is the one thing that would undo this work.

The live/after decision is made once in `build.mjs` via `campaignState()` and
injected onto `ctx.meta` for the partial, which stays logic-free. Do not
reintroduce per-page campaign resolution.
