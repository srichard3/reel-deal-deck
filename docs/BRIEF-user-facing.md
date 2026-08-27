# Brief — make this a user-facing brand site

The site is technically strong (73 routes, 0 errors, real card artwork, a 55-page
Fly Library, 8 guides). It is not yet doing three jobs it needs to do: it does not
feel like a father-and-daughter business, it barely mentions the live Kickstarter,
and its largest surface — the fly pages — is not written for AI answer engines.

Read this before touching anything. It is the contract.

---

## What the audit found

| Finding | Evidence |
|---|---|
| **The Kickstarter is invisible.** | The campaign bar renders on 10 blog routes and **nowhere else** — not the homepage, not `/deck/`, not any of the 55 fly pages. 63 of 73 routes never mention a live campaign. |
| **Fly pages have no answer-first block.** | `grep aeo-answer dist/flies/adams/` → 0. The blog has the AEO treatment; the 55 pages most likely to be surfaced by an AI do not. |
| **The family is missing.** | Ken and Audrey appear on `/story/` and nowhere else. The deck itself carries their voice on a printed card; the site does not use it. |
| **The card craft is undocumented.** | Nothing explains the two-colour suits, the engraved back, the trout-in-a-jester's-cap jokers, USPCC, or "Volume 1". This is the most interesting thing about the product. |

---

## Voice — use their actual words

`site.voice` in `data/site.json` is transcribed **verbatim** from the info card printed
in the deck. It is the family talking, and it is better than anything we would write:

> We're Ken and Audrey, a father-daughter team of multigenerational Idaho farmers and entrepreneurs.
>
> And as passionate fly anglers, we are dedicated to catch-and-release fishing and protecting
> our headwaters and trout habitats. That's why we created The Reel Deal Deck — exquisite
> hand-drawn playing cards that teach while you play.
>
> We hope this deck sparks joy, conversation, and a deeper love for the sport.
> Thank you for your support. Tight lines!

**Rules:**
- Quote it. Do not "improve" it into marketing copy.
- First person plural — *we*, not "the company" or "The Reel Deal Deck team".
- Warm and plain. They are farmers and anglers, not a startup.
- **"Hand-drawn playing cards that teach while you play"** is the best line the brand has. Use it.
- Never invent family details — no ages, no anecdotes, no "one afternoon on the river…".
  Anything not in `site.json` is a `TODO-CONFIRM` comment, not a guess.
- Do not overclaim the sentiment either. No "beloved family tradition since…".

---

## What "cool" means here, and what it does not

**Cool is:** the artwork doing the talking; confident restraint; motion that responds to
the user rather than performing at them; details that reward a second look (the corner
index, the suit colours, the joker fish); fast.

**Cool is not:** parallax, scroll-jacking, animated counters, hero carousels, gradient
blobs, glassmorphism, an autoplaying video, or a cookie-cutter DTC landing page.

The banned list from `README.md` still stands. Adding warmth must not mean adding kitsch:
still no wood grain, no plaid, no burlap, no stock photography.

## Responsive requirements (hard)

- No horizontal document overflow at **320px, 375px, 768px, 1280px**. This has regressed
  twice already; verify by measuring `scrollWidth > clientWidth`, not by eye.
- Every grid using `minmax()` must guard with `min(…, 100%)`.
- Images: `width`/`height` attributes on every `<img>`, honest `sizes`, `loading="lazy"`
  except above the fold. Zero CLS.
- Touch targets ≥ 44px. Respect `prefers-reduced-motion` — it is already globally reset in
  `tokens.css`; do not fight it with inline animation.
- Light **and** dark must both be excellent. Dark is "night fishing".

---

## The Kickstarter

Facts, from `site.campaign`:

- Live now, **ends 19 September 2026**
- URL: `https://www.kickstarter.com/projects/reeldealdeck/the-reel-deal-decktm-fly-fishing-custom-playing-cards`
- The CTA is **date-aware**: `campaignState()` in `src/templates/_blocks.mjs` compares
  `endsAt` to build time and returns `live` copy before it, `after` copy afterwards.

**Never hard-code Kickstarter copy or the campaign URL into a page.** Always go through
`site.campaign` / `campaignState()`, so the site does not advertise a dead campaign on
20 September.

Honesty limits: nothing on this site takes payment or creates an order. Backing happens on
Kickstarter; everything else is "join the list". Never imply otherwise, never invent a ship
date, never fake scarcity or a backer count.

---

## LLM / answer-engine requirements

The 55 fly pages are the biggest surface an AI will ever crawl here. They need the same
treatment the blog already has (see `docs/AEO.md`):

1. A direct **40–60 word answer** immediately after the `<h1>`, before any other prose.
2. Question-shaped `<h2>`s.
3. Extractable structure — a spec table already exists; keep and strengthen it.
4. Schema generated **from visible content only**. Never emit schema for text that is not
   rendered. Never fabricate ratings or reviews.
5. `static/llms.txt` must describe the site as it now is (55 fly pages, 8 guides, real
   artwork, live campaign), not as it was.

---

## File ownership — do not touch anything outside your list

| Agent | Owns |
|---|---|
| **1 · Research & design** | `docs/AUDIENCE.md`, `src/styles/base.css`, `src/styles/components.css`, `src/js/site.js` |
| **2 · Family voice & card craft** | `src/pages/index.mjs`, `src/pages/story.html`, `src/pages/conservation.html`, `src/pages/contact.html`, `src/pages/cards.mjs` (new) |
| **3 · Kickstarter & AEO** | `src/pages/deck.mjs`, `src/pages/preorder.mjs` (new), `src/templates/fly.mjs`, `src/styles/flies.css`, `src/styles/blog.css`, `src/_partials/campaign-bar.html`, `src/_partials/shell.html`, `src/_partials/header.html`, `static/llms.txt`, `docs/AEO.md` |

Reserved (nobody edits): `build.mjs`, `data/*.json`, `src/styles/tokens.css`,
`src/styles/commerce.css`, `src/templates/_shared.mjs`, `src/templates/_blocks.mjs`,
`src/templates/post.mjs`, `src/pages/blog*.mjs`, `src/content/blog/*`, `scripts/*`,
`README.md`, this file. Need a change there? Put it in your report.

**No agent runs git.**

---

## Definition of done

- `node build.mjs` succeeds and `npm run check` reports **0 errors**
- No horizontal overflow at 320 / 375 / 768 / 1280
- Light and dark both verified in a browser
- Every new claim traceable to `data/site.json`, `data/flies.json` or `data/cards.json`
- Anything unverifiable shipped as a `TODO-CONFIRM` HTML comment
