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
- Retail **$24.95**; three tiers in `src/pages/deck.mjs` — one deck, one signed
  ($39.95), and a brick of twelve for the price of ten ($249.50)
- **29 open decisions** in `docs/PUNCH-LIST.md` — pricing sign-off, the Trout
  Unlimited figure, and wholesale terms are the blocking ones
- Domain cutover = drop `NOINDEX`/`BASE_PATH`, set `SITE_URL`, add a `CNAME`

---

## Invariants — each of these has already caused a real bug

**Never invent a fact.** No prices, statistics, dates, mortality figures or
attributions that aren't verifiable. Anything unconfirmed ships as a
`TODO-CONFIRM` HTML comment, never as plausible filler. `npm run check` lists them.
This includes *charming* details: "he drew them at the kitchen table" was written,
shipped and removed here because no source says where he drew them.

**The voice is warm, and it is sourced.** The site sounds like a father and daughter
because Ken and Audrey wrote it that way, on the printed info card (`site.voice`) and
on the Kickstarter (`docs/VOICE-SOURCE.md`, transcribed). Reusable beats live in
`site.story`. If you want to say something warm that is in neither place, you do not
know it. Their line is "he couldn't even find a set" — never widen that into "nobody
makes fly-fishing flashcards", which is false and one search disproves it.

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
had inbound links, but the whole cluster was cut off from the site. The one
sanctioned exemption is `meta.noindex = true`, which marks a page deliberately
unlisted: it emits the robots meta, drops the route from `sitemap.xml`, and
exempts it from the orphan gate in one move. `/press/` uses it — a press kit is a
link you send, not a browse destination. Unlisted is not private; a static site
has nowhere to put a password.

**The bonus card is never counted.** The deck is "54 unique cards" (52 + 2 jokers).
A third special ships on top and is shown on the site but excluded from every count.

**`meta` is module-level in `.mjs` pages**, so `site` is not in scope there.
`build.mjs` reads `meta` *after* the render runs, so patch `meta.jsonld` inside the
default export (see `flies.mjs`, `deck.mjs`, `about.mjs`).

**JSON embedded in a page does not get the base path.** `applyBase()` rewrites
`href`/`src`/`action`/`content` attributes only, so root-relative paths inside a
`<script type="application/json">` stay unprefixed. `feed.js` recovers the prefix
from its own rewritten `src`. Any future embedded data must do the same.

**Do not run `scripts/og.mjs`.** The OG images and app icons committed under
`static/` are real artwork; that script is an old bitmap-font fallback and
regenerating overwrote all of them with a far worse pixel-font version. It has
a warning at the top now. The same run also proves the icons are an "R♦" mark,
not the joker fish.

**The hero tuck box is CSS, not a 3D library.** A cuboid is six rectangles, so
three.js would be 150kB to draw a box. `scripts/box-panels.mjs` cuts the six
panels out of the printer's dieline (gitignored) by detecting its cyan fold
lines, and `.tuck` in components.css folds them with transforms at the measured
ratios W:H:D = 1 : 1.393 : 0.26. The resting angle is CSS, so it is still a 3D
box with JS off; `src/js/box.js` only adds dragging, keyboard and the idle sway.

**The card images are watermarked, and it is baked into the pixels.** A CSS
overlay would be theatre — the file is one right-click away and the overlay one
devtools deletion away. `scripts/watermark.mjs` rewrites `static/cards/` from
un-watermarked masters in `new assets/cards-clean/` (gitignored), which is what
makes it idempotent: never run it against `static/cards/` itself or you stack a
second mark. The `-400` variants are downscaled from the marked `-800`.
Deliberately NOT marked: `static/og/*` and `static/brand/box-*`, which are share
and packaging images where the wordmark already carries attribution.

**`/suggest/` is the one form that actually delivers.** Everything else using
`data-capture` writes to localStorage and says so, which is honest for a waiting
list that has not opened. A suggestion nobody receives is not, so `suggest.js`
composes a real email — mailto plus the message on the page with a copy button,
because mailto silently fails for anyone without a mail client. The form is
hidden on `.no-js`; the plain address underneath is the fallback.

**The Instagram strip is a snapshot, not an embed.** `data/instagram.json` plus
`static/instagram/` are committed, and `instagramStrip()` renders from them.
There is no live feed to be had: widgets mean a third-party script, the Graph
API needs a token, Instagram serves a bare shell to server-side fetches, and its
CDN URLs are signed and expire in days. Refresh with `scripts/instagram.mjs`.
Captions are stored but never rendered — several go stale and one is wrong.

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
| `src/js/feed.js` | the homepage game — card list built by `feedData()` in `index.mjs` |
| `data/instagram.json` | the committed @reeldealdeck snapshot — refresh via `scripts/instagram.mjs` |
| `src/js/suggest.js` | `/suggest/` — composes a real email; reads the address off the page |
| `scripts/watermark.mjs` | burns the watermark into `static/cards/` from the gitignored masters |
| `scripts/box-panels.mjs` | cuts the six 3D tuck-box panels out of the printer's dieline |
| `src/js/box.js` | drag / keyboard rotation for the hero box; the box itself is CSS |
| `new assets/` | printer source artwork — gitignored, large |

## Docs

`VOICE-SOURCE` Ken and Audrey's own words · `GROWTH-PLAN` strategy ·
`PUNCH-LIST` open decisions · `BLOG-CONTRACT` article rules ·
`CONTENT-PLAN` article backlog · `AEO` answer-engine system · `LAUNCH` founder playbook ·
`DEPLOY` going live · `COMMERCE` checkout swap-in · `AUDIENCE` market research
