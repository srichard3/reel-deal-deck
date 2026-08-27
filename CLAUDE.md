# The Reel Deal Deck — working notes

A 54-card fly-fishing playing card deck by Ken and Audrey, a father-and-daughter
team in Eagle, Idaho. This repo is the marketing + SEO site: a zero-dependency
static generator producing ~94 routes.

**Read `docs/GROWTH-PLAN.md` first.** It has the strategy, the audit, and the
sequenced path forward.

---

## Commands

```bash
npm run build     # src/ + data/ -> dist/
npm run check     # quality gate — MUST be 0 errors
npm run dev       # build + serve on :4173
```

**Before every commit, verify BOTH build modes:**

```bash
# root (the eventual real domain)
node build.mjs && node scripts/check.mjs

# staging (GitHub Pages project site)
NOINDEX=1 BASE_PATH=/reel-deal-deck SITE_URL=https://srichard3.github.io/reel-deal-deck node build.mjs
BASE_PATH=/reel-deal-deck SITE_URL=https://srichard3.github.io/reel-deal-deck node scripts/check.mjs
```

Both must report **0 errors**. A change can pass one and fail the other.

---

## Current state

- **Live at** https://srichard3.github.io/reel-deal-deck/ — deliberately `noindex`
- **`reeldealdeck.com` is not bought yet.** Nothing compounds until it is. The
  printed cards already display that address, so it is urgent for a non-SEO reason.
- Kickstarter runs until **19 September 2026**
- Retail **$19.99**; ladder in `src/pages/deck.mjs`
- **29 open decisions** in `docs/PUNCH-LIST.md` — pricing sign-off, the Trout
  Unlimited figure, and wholesale terms are the blocking ones
- Domain cutover = drop `NOINDEX`/`BASE_PATH`, set `SITE_URL`, add a `CNAME`

---

## Invariants — each of these has already caused a real bug

**Never invent a fact.** No prices, statistics, dates, mortality figures or
attributions that aren't verifiable. Anything unconfirmed ships as a
`TODO-CONFIRM` HTML comment, never as plausible filler. `npm run check` lists them.

**The Fly Library owns fly patterns. The blog owns everything else.** Before
writing any article, check its headings against existing ones — three planned
articles were cancelled for overlap. Two pages competing for one query lose both.

**Schema is generated from visible content only.** Never emit a `FAQPage`
question that isn't rendered. No fabricated ratings or reviews, ever.

**Answer-first.** Every fly page and guide opens with a 40–60 word answer
directly under the `<h1>`, before any other prose. That is the block an AI lifts.

**Never hard-code the Kickstarter URL.** Route through `campaignCta()` /
`campaignLine()` / `campaignState()` in `src/templates/_blocks.mjs`. They flip to
pre-order copy automatically after 19 Sept — 60 CTAs depend on this.

**One canonical entity.** `site.brand` in `data/site.json` is the only place the
business is described. Emit via `organizationSchema()`. Do not write a new
description anywhere.

**Pricing lives in `deck.mjs`'s `TIERS`.** `preorder.mjs` imports it. Duplicating
prices is how `/preorder/` was left quoting $24 after everything else moved.

**Every section must be reachable from the homepage.** `check.mjs` walks the link
graph and fails on unreachable clusters. 22 guides were once orphaned — every page
had inbound links, but the whole cluster was cut off from the site.

**The bonus card is never counted.** The deck is "54 unique cards" (52 + 2 jokers).
A third special ships on top and is shown on the site but excluded from every count.

**`meta` is module-level in `.mjs` pages**, so `site` is not in scope there.
`build.mjs` reads `meta` *after* the render runs, so patch `meta.jsonld` inside the
default export (see `flies.mjs`, `deck.mjs`, `about.mjs`).

**SVG needs explicit dimensions.** Never `width: auto` on a viewBox-only SVG —
Safari will not infer it and collapses the element to nothing. Chrome hides this.

---

## Layout and browser verification

- No horizontal overflow at **320 / 375 / 768 / 1280**. Measure
  `scrollWidth > clientWidth`; do not eyeball it. This has regressed twice.
- Guard every `minmax()` with `min(…, 100%)`.
- Light **and** dark both ship. Test both.
- **The browser pane is Chromium.** It cannot catch Safari-specific bugs, and it
  sometimes fails to composite images into screenshots — if an image area looks
  blank, verify by measuring the element or probing decoded pixels via canvas
  before concluding it is broken.

---

## Where things are

| Path | What |
|---|---|
| `data/site.json` | brand, product, campaign, voice — the source of truth |
| `data/flies.json` | 55 cards, transcribed from the printed artwork |
| `data/cards.json` | the deck's rank/suit/category mapping |
| `data/states.json` | the state tier (2 so far) |
| `src/templates/_blocks.mjs` | campaign helpers, `organizationSchema`, block vocabulary |
| `src/templates/_shared.mjs` | card rendering, suit logic |
| `new assets/` | printer source artwork — gitignored, large |

## Docs

`GROWTH-PLAN` strategy · `PUNCH-LIST` open decisions · `BLOG-CONTRACT` article rules ·
`CONTENT-PLAN` article backlog · `AEO` answer-engine system · `LAUNCH` founder playbook ·
`DEPLOY` going live · `COMMERCE` checkout swap-in · `AUDIENCE` market research
