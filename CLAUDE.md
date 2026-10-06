# The Reel Deal Deck — working notes

A 54-card fly-fishing playing card deck by Ken and Audrey, a father-and-daughter
team in Eagle, Idaho. This repo is the marketing + SEO site: a zero-dependency
static generator producing ~94 routes.

**Read `docs/GROWTH-PLAN.md` first.** It has the strategy, the audit, and the
sequenced path forward.

---

## Commands

```bash
npm run build          # src/ + data/ -> dist/
npm run check          # quality gate — MUST be 0 errors
npm run dev            # build + serve on :4173
npm run test:wholesale # the /api/wholesale-apply guard rails; no store needed
netlify dev            # the only way to run the function locally
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
shipped and removed here because nothing sourced it.

**`npm run check` is at 0 warnings, and every TODO-CONFIRM has been answered.**
The remaining launch work is in `docs/PUNCH-LIST.md` and none of it is a question
about a fact. Several of those answers were *to stay silent*, and a later
contributor "helpfully" filling one in would be a regression:

| Settled fact | Value |
|---|---|
| Surname | **Fry.** Ken Fry, Audrey Fry — matches `brand.legalName`, Homer Fry Ranch, LLC. Full names in schema and the founder cards; first names in the running copy. |
| Generations | Ken is the **fifth**, Audrey the **sixth**. |
| Stock | **Bicycle Rider Back** with USPCC's Air-Cushion finish. |
| Recyclable | Yes — the same material specification as any Bicycle deck. **Not** an FSC or certification claim. |
| Ranks and suits | Standard throughout, two jokers. "Deal a hand of poker with it" is literally true. |
| Prices | $19.95 / $6.95 / $9.97 / $8.97 are confirmed against real cost. |
| The one inbox | **support@reeldealdeck.com.** No wholesale@, no press@, no gmail. Subject prefixes sort the mail. |

| Deliberately unstated — do not fill in | |
|---|---|
| Trout Unlimited | "A cut of every deck." **No dollar figure and no percentage.** |
| International shipping | Not offered, not mentioned. |
| MAP policy | None. No resale price condition on `/wholesale/`. |
| Dates | The years the deck was started and finished are not published. |
| Knot strength, release mortality, the legal definition of "fly" | No figures and no generalisations. The three blog files carry an `EDITORIAL RULE` comment saying so. |
| Stock weight, tuck-box finish, wrap, seal | Not recorded anywhere, so not published. |

**The art is hand-drawn and original, and Ken did not draw it.** A designer did.
The site attributed the artwork to him in six places — `site.founders[0].bio`,
`site.story.twist`, `/story/` three times and `humans.txt` — and every one was
wrong. "Hand-drawn", "original", "not photographed" and "drawn one at a time"
are all still true and all still load-bearing; what was false was whose hand.
Ken's part is that he went looking for a set, could not buy one, and had it
made. `/story/` deliberately stops there and does not discuss who drew them.
Do not re-introduce the attribution from older copy or from
`docs/VOICE-SOURCE.md`, both of which predate the correction.
See `story.artNote` in `data/site.json`.

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
`index.mjs` emits all 54 faces carrying nothing but `--i`;
`.fan` in `components.css` rotates each about a pivot 3.6 card-heights below it,
and the browser does the trigonometry. Hover and `:focus-within` get identical
rules, so it is fully keyboard-operable, and the neighbors lean away via `+`
and `:has()` rather than script.

**The hit area is the sliver, not the card, and three `pointer-events` rules
make it so.** `.fan__card` is `none` (layout and z-order only), `.fan__art` is
`none` (the picture never captures anything), and `.fan__link` is `auto` — a
narrow full-height strip that is the only hittable thing in the fan.

That last rule is load-bearing. When the art was the target, a hovered card
scaling to 1.6 blanketed **138px of the row** — about seven neighbors stopped
responding to their own slivers until the pointer cleared it, so pointing at a
card did nothing and then one five along fired.

**The strip is a wedge, and it has to be exact.** Cards rotate about a pivot 3.6
card-heights below them, so neighbors separate more at the top of a card than
at its foot: `0.1317` card widths against `0.0951`, which is the `72.2%` in the
`clip-path`. `clip-path` clips hit-testing as well as paint. A rectangle wide
enough for the top would overlap its neighbor at the foot — and a hovered card
jumps to `z-index: 60`, so that overlap would steal hits. A rectangle narrow
enough never to overlap would leave the top of every card inert.
**Recompute both numbers if `--fan-step` or `--fan-pivot` changes.**

Verify any change by probing `elementFromPoint` across the row at several
heights, once at rest and once with a card forced into its popped state: the two
hit maps must be identical, and sweeping the real pointer must step one card at
a time without going backwards.

Three numbers are load-bearing and move together: `--fan-step`, `.fan`'s
`inline-size` and its `block-size`. The height has to clear both the drop of the
end cards (`pivot x (1 - cos(half-angle))` card-heights) and the name label
hanging below them — `.fan-stage` is a scroll container and clips anything past
it. **Measure the end cards, not the middle one.** The exposed, pointable strip of each card is
`(fan width - card width) / 53` and the fan width is capped by the viewport, so
at 54 cards it is ~18px at any card size — under the 24px WCAG 2.5.8 minimum, a
known exception carried by the full list at `/flies/`. Showing half the deck got
it to 25px if that trade is ever wanted.

**The fan has two interactions, and the phone one is all in `src/js/fan.js`.**
That file returns before touching the DOM unless `(pointer: coarse)` matches, so
the desktop fan is exactly the CSS it always was. Everything it adds hangs off
`.is-scrubbable`, which it puts on the stage — with JS off, a phone falls back to
the old behaviour. On a phone: **drag walks the deck, release leaves that card
up, tap it to open it.**

Why a phone needed its own answer: the fan is 7.44 card widths across, so at the
old 104px card it was 774px inside a 390px screen. Half the deck sat outside a
scroll container and each card showed an 11px strip, so a tap was a guess that
navigated with no preview. On touch the fan is shrunk to fit the screen, the
wedges are switched off, and a full-size pad **underneath** every card takes the
touches — it works because the card, the link and the art are all
`pointer-events: none`, so events fall through to it. The one exception is the
picked card's art, which gets `pointer-events: auto` and sits at `z-index: 60`,
so a second tap opens it.

**The x-to-card mapping is a probed table, built once, forced non-decreasing.**
The fan is an arc: the middle rides high and the ends droop, so one probe row met
cards 15–45 and missed the other 23. Probing several rows fixes coverage but
makes the answer depend on where the thumb sits vertically, so the same drag
could step backwards. Instead `fan.js` probes every pixel across the fan once,
clamps the result to be non-decreasing, and scrubs off the table — selection is a
pure function of x. **It cannot be built at load**: `elementFromPoint` takes
viewport coordinates and the fan is ~1900px below the fold, so every probe
returns null. It is built when the fan first intersects, via
`requestIdleCallback(fn, {timeout: 1200})`, costing ~65ms off the critical path;
`pointerdown` builds it synchronously only as a fallback (~79ms).
**The IntersectionObserver must not disconnect until a build succeeds** — it
fired on a rootMargin while the fan was still off-screen, the build bailed, and
the calibration never ran.

**A lifted card is nudged back on screen, and the nudge is measured twice.**
At `--fan-pop` the end cards reached 53px past each edge at 320px. `fan.js` pops
each card once and writes a correction to `--nudge-at`; CSS applies it only to a
picked card, because applying it at rest shifts cards sideways in the closed fan.
`translateX` runs along the **card's own x-axis**, and end cards are rotated ~40°,
so a 61px nudge moved one only 47px across the screen — the code applies a probe
offset, measures the response, and scales by it rather than modelling a cosine.
`.fan-stage.is-scrubbable` is then `overflow-x: clip` / `overflow-y: visible` to
absorb the ~20px the rotated cards spill past the fan's box, which would
otherwise give the whole page a 4px horizontal scroll. **That clip is only safe
because the nudges land every card inside 8px of each edge** — without them it
cuts a third off the end cards.

**A scrub must never navigate, and where the click landed cannot decide that.**
A drag always ends with the lifted card under the finger, so "did the click hit
the picked card" is true after every scrub. `fan.js` carries a `didScrub` flag
through to the click instead. Verify by dispatching a drag and asserting zero
anchor activations, then a tap on the picked card and asserting exactly one.

**The stage does not clip on desktop.** A lifted card rises out over whatever is
above it, which is the point. `.fan-stage` is only a scroll container below
48rem, where the fan is wider than the screen and there is no hover anyway — and
that is why its padding still has to hold the labels. It carries `z-index: 3`;
the sticky header is 100 and deliberately stays above it.

**Only `transform` transitions, and only for 120ms.** Transitioning the
box-shadow on 54 transformed elements repaints rather than composites, and a
sweep across the fan left a wake of still-animating cards that read as lag. The
neighbor lean is one card either side for the same reason: each `:has()` rule
is sibling-invalidation work on every hover change, times 54.

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
three.js would be 150kB to draw a box. `scripts/box-panels.mjs` cuts all six panels out of the printer's dieline (gitignored) by detecting its cyan fold
lines, and `.tuck` in components.css folds them with transforms at the measured
ratios W:H:D = 1 : 1.393 : 0.26. The resting angle is CSS, so it is still a 3D
box with JS off; `src/js/box.js` only adds dragging, keyboard and the idle sway.

**All six panels are printed, including the base.** It hangs below the BACK
panel on the dieline (not the front, like the top flap) and carries the UPC, the
legal line and "Made in the USA". Both flaps are printed inverted because both
fold over, so both are rotated 180 degrees on the way out. It used to be a flat
green rectangle, which is why the box used to be clamped.

**The box's orientation is a matrix, and gestures are applied in WORLD space.**
`box.js` holds a 3x3 rotation and writes it to `--tf` as a `matrix3d`; CSS owns
only the resting pose, as `rotateX(var(--rx)) rotateY(var(--ry))`, which is all
a pose that never moves needs. Two Euler angles were enough while pitch was
clamped to an 80-degree band. They are not now: pitch the box a quarter turn and
its yaw axis lies along the view direction, so dragging sideways spins it in the
picture plane instead of turning it — it stops following your hand exactly where
it is most interesting. Every gesture **pre-multiplies** (`R_world · M`); post-
multiplying turns the box about its own axes, which is that same bug. Re-
orthonormalize every frame or accumulated error shears the box.

Verify a change by asserting the invariant, not by eye: a horizontal drag is a
rotation about the screen's vertical, so **every basis vector's Y component must
be unchanged by it, at every pitch** — including 90, 105 and 135 degrees, where
the old version failed. Read the authored `--tf`, never `getComputedStyle`,
which returns the mid-transition interpolation.

**`touch-action: pan-y` on the box is deliberate.** Yaw is ours, vertical panning
stays the page's: a hero that eats an upward swipe on a phone is a trap. So pitch
is a mouse, pen and keyboard gesture. Touch still reaches every face — yaw alone
walks all four sides — and the arrow keys are the only way to reach the top and
the base without a pointer, which is why they are not a nicety.

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

**The founders' photographs are real, theirs, and stripped of metadata.**
`scripts/photos.mjs` builds `static/photos/` from the gitignored
`logos-and-photos-new/`. Two things it does are not optional: it **strips EXIF**,
because phone photographs carry GPS and Ken and Audrey run this from home, and it
**applies the orientation tag to the pixels first** — two of these are stored
landscape with a rotation tag, so stripping without transposing ships them on
their side. The script asserts no metadata survives. WebP quality is 76, chosen
by sweeping the brick-wall frame (the worst case): 82 cost 420kB for PSNR 36.0,
76 costs 339kB for 33.8, and 62 still cost 278kB, so the detail is real rather
than encoder waste. **No stock photography, ever.**

**There is still no photograph of Audrey alone, so neither founder card has a
face.** One card with a portrait and one with the K♠/Q♥ mark reads as an
oversight; two marks read as a choice. Do not fill one and leave the other.

**The Trout Unlimited mark is the Business member mark, and where it sits is
part of the claim.** It is the mark issued to business members and already
printed on the info card in every deck, and it is the only TU artwork on the
site. On `/conservation/` it sits directly above the sentence saying the
membership is *not* a partnership, sponsorship or endorsement — showing someone
else's mark raises the bar on that disclaimer rather than lowering it. Do not
move it into the header, the footer, a hero or a product badge, and never set it
beside our own wordmark as though the two were partners.

**The card images are watermarked, and it is baked into the pixels.** A CSS
overlay would be theatre — the file is one right-click away and the overlay one
devtools deletion away. `scripts/watermark.mjs` rewrites `static/cards/` from
un-watermarked masters in `new assets/cards-clean/` (gitignored), which is what
makes it idempotent: never run it against `static/cards/` itself or you stack a
second mark. The `-400` variants are downscaled from the marked `-800`.
Deliberately NOT marked: `static/og/*` and `static/brand/box-*`, which are share
and packaging images where the wordmark already carries attribution.

**Hosting is GitHub Pages until the site is finished — decided, not pending.**
Netlify bills in credits (300/month free) and a *production deploy costs 15 of
them*, so twenty pushes to `main` would exhaust a month and pause the site. The
front-end work happens on Pages; the move to Netlify happens once, at the end,
on the Personal plan. That is why `_headers`, `_redirects` and the wholesale
function are all written but inert today. Do not re-open this without the
credit arithmetic: ~2.5MB and ~80 requests per homepage visit is ~0.066 credits.

**There is exactly one piece of server-side code, and it is the only reason the
site must eventually deploy to Netlify.** `netlify/functions/wholesale-apply.mjs` backs
`/wholesale/apply/`: it creates the Shopify customer tagged `wholesale`, uploads
the resale permit into Shopify Files against that customer, and returns a
Storefront cart carrying their email and address. It exists because the Admin
API token can never reach a browser and a static host has nowhere to put an
uploaded file. **On GitHub Pages `/api/wholesale-apply` is a 404.** Zero
dependencies there too — Functions v2 hands you a standard `Request`, so
`request.formData()` parses the multipart upload and `fetch` is built in. Its
validation is the security boundary and has the project's only test suite:
`npm run test:wholesale`, which needs no store and no network.

**Wholesale prices are not gated by this site, and could not be.** They come
from a Shopify automatic discount scoped to the `wholesale` customer segment
that the function tags people into. That is what makes the order link safe to
share — a secret URL is not a gate. Applications are auto-approved because that
was asked for; `REVIEW_ONLY=1` queues them as `wholesale-pending` instead, which
the discount does not match, with no code change. `pricing.wholesale.account.live` is the master switch and is **false**: the
form, the file input and the script are not emitted at all while the site is on
Pages, and `/wholesale/apply/` offers an email address instead. Flip it only
when the site is on Netlify *and* the Shopify variables are set. Runbook,
including every environment variable and the Shopify setup:
`docs/WHOLESALE-ACCOUNTS.md`.

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
- **One theme: the site is dark, always.** No light mode, no toggle, no
  `prefers-color-scheme` branch. Test with the OS set to *light* — that is the
  case that proves it. `--c-paper` and `--c-ink` deliberately keep their printed
  light/dark values: they are literal anchors, not background/foreground.
  `.section--dark` sets its text to `--c-paper` and `.btn--primary:hover` mixes
  toward `--c-ink` to darken, so flipping those two would blank the river band's
  type and make the order button lighten on hover. Only the semantic tokens
  carry night values. Contrast has no second theme to fall back on, so measure
  new colors against `--c-surface` (#161B17), not the page — that is where the
  faint type actually sits, and it is the stricter of the two.
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
| `scripts/photos.mjs` | the founders' photographs and the TU mark, from the gitignored originals; strips EXIF |
| `scripts/box-panels.mjs` | cuts the six 3D tuck-box panels out of the printer's dieline |
| `src/js/box.js` | drag / keyboard rotation for the hero box; the box itself is CSS |
| `netlify/functions/` | the only server-side code: the wholesale signup endpoint |
| `docs/WHOLESALE-ACCOUNTS.md` | switching wholesale accounts on, end to end |
| `new assets/` | printer source artwork — gitignored, large |

## Docs

`VOICE-SOURCE` Ken and Audrey's own words · `GROWTH-PLAN` strategy ·
`PUNCH-LIST` open decisions · `BLOG-CONTRACT` article rules ·
`CONTENT-PLAN` article backlog · `AEO` answer-engine system · `LAUNCH` founder playbook ·
`DEPLOY` going live · `COMMERCE` checkout swap-in · `AUDIENCE` market research
