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
- **Ordering is live. There is no Kickstarter and no pre-order** — both were
  removed site-wide. Checkout will be Shopify; `site.shop.url` is still empty, so
  every order CTA falls back to `/deck/#order`.
- Retail **$19.95** a deck, **$6.95** shipping on one, **free from two up**.
  Wholesale **$9.97**/deck by the 12-deck brick, **$8.97**/deck by the 144-deck
  master case. All of it in `site.pricing` — see below.
- Nav is three items, in this order: **The Deck · Our Story · Fly-brary**
- Open decisions in `docs/PUNCH-LIST.md` — the Shopify URL, the Trout Unlimited
  figure, lead time and freight are the blocking ones
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

**Never hard-code a store URL, and never type a price into a page.** Two rules,
one reason: both used to live in sixty places.

*Where "buy" points* is `site.shop`, read through `orderCta()` / `orderLine()` /
`orderState()` in `src/templates/_blocks.mjs`. Roughly sixty CTAs go through
them, plus the sitewide order bar (`src/_partials/order-bar.html`, resolved once
in `build.mjs` onto `meta.order*`). While `shop.url` is empty every one of them
falls back to `shop.fallback` — `/deck/#order` — so the site is never broken
while the store is being set up, and `orderState().ready` is `false` so a page
can say so. Filling in that one field repoints the whole site. **Do not rename
`#order` on `/deck/`** without changing `shop.fallback` with it.

*What it costs* is `site.pricing`: `retail.perDeck`, `retail.shipping`,
`retail.freeShippingFromDecks`, the three `units`, and `wholesale.tiers`.
`/deck/` computes from it, and `/wholesale/` and `/gifts/` read it as
`{{ site.pricing.… }}` tokens. `$24.95` was once typed into eight files and they
disagreed by the end. There is **no quantity discount** — the deck is one price
and only the postage changes, so do not reintroduce a tier ladder that implies
one.

**Write as Ken and Audrey, not about them.** `site.voice.register` in
`data/site.json` is the rule. On a page they are speaking on it is "we made",
never "Ken and Audrey decided" — the site read like a case study about a father
and daughter rather than a thing they made. Third person stays correct in
schema, alt text, citations, spec rows, press boilerplate and product facts
("signed by Ken and Audrey"). `voice.intro/why/hope/signoff` are printed-card
text and are quoted verbatim, never paraphrased.

**One canonical entity.** `site.brand` in `data/site.json` is the only place the
business is described. Emit via `organizationSchema()`. Do not write a new
description anywhere.

**The homepage is four sections and stays four sections.** Hero (the 3D box and
the order button), the four proof stats, the card fan, and the Instagram strip
last. It was ten; a page that explains the makers, the library, the guide, a
game, three differentiators and an audience chooser explains none of them, and
every one of those has a page of its own. `src/js/feed.js` and the `.feed` block
in `components.css` are the old homepage game, now unreferenced — kept because
it works, not because anything loads it.

**The card fan is CSS, and the arc is one rotation per card.** `cardFan()` in
`index.mjs` emits all 54 faces carrying nothing but `--i`; `.fan` in
`components.css` rotates each about a pivot 3.6 card-heights below it, and the
browser does the trigonometry. Hover and `:focus-within` get identical rules, so
it is fully keyboard-operable, and the neighbours lean away via `+` and `:has()`
rather than script. Two numbers are load-bearing and must move together:
`--fan-step` and `.fan`'s `block-size`, which has to clear both the drop of the
end cards (`pivot x (1 - cos(half-angle))` card-heights) and the name label
hanging below them — `.fan-stage` is a scroll container and clips anything past
it. Measure the end cards, not the middle one, after any change.

**The fan is the homepage's whole image budget.** 54 faces, so each `<img>`
offers a 240 and a 400 with `sizes` stops that match what the CSS really
renders. A phone at 2x takes the 240s (~845kB), a desktop retina screen takes
the 400s (~1.6MB), everything is `loading="lazy"`, and the section is well below
the fold. `scripts/card-thumbs.mjs` makes the 240s by downscaling the ALREADY
WATERMARKED `-400`s, which is safe to re-run — unlike `scripts/watermark.mjs`,
it cannot stack a second mark.

**The Fly-brary is the hub for everything that is not the product or the people.**
Four doors at the top of `/flies/`: what's in the deck (`/cards/`), the flies,
the Virtual Guide (`/blog/`), and the flashcards at the foot of the page.
`/cards/` is deliberately *not* in the top nav and its breadcrumb runs
Home › Fly-brary › What's in the deck. The `.hub` grid uses **explicit** column
counts (2 then 4), never `auto-fit`, which stretches a lone door on the last row.

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

**CSS and JS URLs are content-fingerprinted.** `scripts/postbuild.mjs` appends
`?v=<hash>` to every stylesheet and script reference. Without it a shipped CSS
fix sits invisible behind a cached file — GitHub Pages sends `max-age=600` and
Safari holds subresources harder than that, which is how a fixed button stayed
broken after deploy. Hashes are stable across rebuilds, so unchanged files stay
cached. Never tell someone to hard-refresh instead.

**The hero tuck box is CSS, not a 3D library.** It is `tuckBox()` in
`_blocks.mjs` and renders on both `/` and `/deck/`; any page using it must load
`src/js/box.js`, and only one page should pass `eager`. A cuboid is six rectangles, so
three.js would be 150kB to draw a box. `scripts/box-panels.mjs` cuts the six panels out of the printer's dieline (gitignored) by detecting its cyan fold
lines, and `.tuck` in components.css folds them with transforms at the measured
ratios W:H:D = 1 : 1.393 : 0.26. The resting angle is CSS, so it is still a 3D
box with JS off; `src/js/box.js` only adds dragging, keyboard and the idle sway.

**Card art is cropped to its own keyline, and `--r-card-art` matches it.** The
scans carried ~2px of paper outside the printed outline; rounding the corners
then clipped a curve that was not the card's, showing a white wedge at every
corner. `scripts/watermark.mjs` trims to the keyline, and `--r-card-art`
(4.37% / 3.12% = 25px) is the radius for anything showing a real card face.
It was found by outcome, not geometry: sweep the radius and count how much of
the corner arc shows white instead of keyline. Fitting a circle to the corner
gave 27px and looked worse. `--r-card` is 12px and belongs to panels.

**Images are fingerprinted too**, not just CSS and JS — a recropped card a
browser already holds stays wrong, and files cache independently, so a partial
refresh fixes some cards and not others.

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
| `data/site.json` | brand, product, **shop**, **pricing**, voice — the source of truth |
| `data/flies.json` | 55 cards, transcribed from the printed artwork |
| `data/cards.json` | the deck's rank/suit/category mapping |
| `data/states.json` | the state tier (2 so far) |
| `src/templates/_blocks.mjs` | order helpers, `organizationSchema`, block vocabulary |
| `src/templates/_shared.mjs` | card rendering, suit logic |
| `src/js/feed.js` | the old homepage game — **no longer loaded anywhere**; needs a `feedData()` JSON block to work again |
| `scripts/card-thumbs.mjs` | the `-240` card variants for the homepage fan; safe to re-run |
| `docs/PHOTO-PLAN.md` | the five photographs the site is waiting on, and where each goes |
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
