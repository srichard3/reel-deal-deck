# Blog contract

Both the blog engine and the articles are built against this document. Read it before writing either.

---

## Why the blog exists

The Fly Library answers *"what is this fly?"*. The blog answers **every other question an angler
types into Google or asks an AI**, and uses that traffic to introduce the brand.

### The cannibalisation rule (non-negotiable)

**The Fly Library owns all fly-pattern queries. The blog must never write a "what is the X fly"
article.** Two pages competing for one query is how sites lose both. If an article needs to mention
a pattern, it **links to `/flies/<slug>/`** rather than re-explaining it.

| Owned by `/flies/` | Owned by `/blog/` |
|---|---|
| what a pattern imitates, sizes, dressing, when to fish it | getting started, gear choices, technique, knots, seasons, regulations, comparisons, "which do I need" |

---

## Content classes the blog targets

| Class | Shape of query |
|---|---|
| **Getting started** | "how to fly fish", "fly fishing for beginners", "is fly fishing hard" |
| **Gear decisions** | "what weight fly rod for trout", "leader vs tippet", "do I need waders" |
| **Technique** | "how to cast a fly rod", "how to mend line", "how to set the hook" |
| **Knots** | "improved clinch knot", "best fly fishing knots", "how to attach tippet" |
| **Comparison** | "dry fly vs nymph", "4wt vs 5wt", "floating vs sinking line" |
| **Seasonal / timing** | "best time of day to fly fish", "winter fly fishing", "fly fishing in the rain" |
| **Practical** | "do I need a fishing license", "catch and release best practices", "how much does fly fishing cost" |

---

## Answer Engine Optimisation — how a page earns an AI citation

Ranking and being *quoted by an AI* are different disciplines. These rules are what make a page
extractable. They are requirements, not suggestions.

1. **Answer first.** Immediately after the `<h1>`, before any preamble, give a direct
   **40–60 word** answer to the exact question in the title. No throat-clearing, no "fly fishing is
   a beautiful sport". A model lifting one block from the page must get a complete, correct answer.
2. **Question-shaped `<h2>`s.** Write headings the way a person speaks the query — *"What weight fly
   rod should a beginner buy?"* — not *"Rod Weight Considerations"*.
3. **Make facts extractable.** Tables, numbered steps and definition lists get quoted; flowing prose
   does not. Any article with a comparison needs a table. Any "how to" needs numbered steps.
4. **Self-contained sections.** A model may lift one `<h2>` block with no surrounding context. Each
   section must make sense alone — no "as mentioned above".
5. **Say the quiet part.** State units, ranges and caveats explicitly ("a 9-foot 5-weight, the most
   common trout setup in North America"). Vague copy cannot be quoted.
6. **Source real claims.** Anything about regulations, licences, biology or safety needs a link to a
   primary source (a state wildlife agency, not another blog).
7. **Freshness.** Every post carries `date` and, when edited, `updated`. Both render visibly and in schema.

### Honesty rules

- Never invent statistics, prices, study results or expert quotes.
- Licence and regulation content varies by state — say so, link to the state agency, never give a
  specific legal answer for all 50 states.
- No medical, legal or safety advice beyond "check with the relevant authority".
- Anything unverifiable goes in as a `TODO-CONFIRM` HTML comment, never as an invented fact.

---

## File contract

Articles live at `src/content/blog/<slug>.mjs`, one file per article.

```js
export const meta = {
  slug: 'what-weight-fly-rod-for-trout',
  title: 'What Weight Fly Rod for Trout?',      // ≤39 chars — see budget below
  question: 'What weight fly rod should I use for trout?',  // the natural-language query
  description: 'A 9-foot 5-weight handles most trout fishing…',  // ≤160 chars
  answer: 'A 9-foot 5-weight is the standard…',  // 40–60 words, THE extractable answer
  topic: 'gear',            // gear | basics | technique | knots | seasons | practical
  date: '2026-08-04',
  updated: null,
  readingTime: 6,           // minutes, integer
  faqs: [ { q: '…', a: '…' } ],       // rendered AND emitted as FAQPage schema
  howTo: null,              // optional; { name, steps: [{name, text}] } → HowTo schema
  related: ['fly-fishing-for-beginners'],   // other post slugs
  relatedFlies: ['adams', 'pheasant-tail-nymph'],  // slugs in data/flies.json
  sources: [ { label: 'Idaho Fish and Game', url: 'https://…' } ],
};

export default function ({ post, posts, site, flies, b }) {
  return `
    ${b.section('What weight fly rod should a beginner buy?', `
      <p>…</p>
      ${b.table(['Weight', 'Best for'], [['4wt', 'Small streams']])}
    `)}
  `;
}
```

`meta.title` has a **39-character budget** — the shell appends `" — The Reel Deal Deck"` (21 chars)
and `scripts/check.mjs` fails the build over 60 total. `meta.question` carries the full
natural-language query for the `<h1>` and schema, so the title can stay short.

### The `b` block helpers

`src/templates/_blocks.mjs` exports the shared vocabulary. Articles use these rather than
hand-rolling markup, so every page is structurally consistent and extractable:

| Helper | Purpose |
|---|---|
| `b.section(heading, html)` | An `<h2>` section with a stable anchor id |
| `b.answer(text)` | The answer-first block directly under the h1 |
| `b.takeaways([...])` | "Key takeaways" list — high-value for AI extraction |
| `b.table(headers, rows)` | Responsive, scrollable comparison table |
| `b.steps([{name, text}])` | Numbered `<ol>` for how-to content |
| `b.faq([{q, a}])` | Visible Q&A that matches the FAQPage schema exactly |
| `b.note(html)` / `b.warn(html)` | Callouts |
| `b.flyLink(slug)` | Link into the Fly Library — the internal-link engine |
| `b.sources([...])` | Rendered source list |

---

## Routes

```
/blog/                     index — all articles, grouped by topic
/blog/<slug>/              article
/blog/topics/<topic>/      topic hub (gear, basics, technique, knots, seasons, practical)
```

Slugs are permanent. Renaming one requires a redirect in `static/_redirects`.

---

## The Kickstarter CTA

Driven entirely by `site.campaign` in `data/site.json`. **Do not hard-code Kickstarter copy or the
campaign URL into any article or template.**

The campaign ends **19 September 2026**. The CTA component compares `campaign.endsAt` to build time
and renders `campaign.live` before it and `campaign.after` afterwards — so the site does not start
advertising a dead campaign the day it closes. Set `campaign.active: false` to force the fallback.

**Placement, in this order, on every article:**

1. **A slim announcement bar above the article.** One line, one link, dismissible, `<= 3rem` tall.
   It must **not** push the answer below the fold — an intrusive top interstitial is both a Google
   page-experience problem and, more importantly, it displaces the block AI engines quote.
2. **The answer.** The reader's question gets answered before anything is asked of them.
3. **A richer in-content CTA** after the first two or three sections, once the article has actually
   been useful.
4. **A closing CTA** at the end, tied to the article's subject where possible.

This is the deal: earn the pitch by answering the question first. A blog that pitches before it
helps gets bounced, and a bounced reader ranks nothing.
