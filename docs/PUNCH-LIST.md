# Punch list — the decisions still needed before launch

Every item below is a `TODO-CONFIRM` sitting in the site's source. They are
placeholders and open questions, deliberately visible in the code and invisible
to visitors, so nothing was ever invented to fill a gap.

## How to work through one

```bash
npm run check          # lists every TODO with its file and line
```

Each warning looks like:

```
wholesale/index.html
  ! :293 TODO in shipped HTML — TODO-CONFIRM: EVERY NUMBER IN THIS TABLE IS A PLACEHOLDER
```

That line number is in the **built** file (`dist/…`), not the source. To fix one:

1. Find the matching source file — the table below maps each item to it.
2. Replace the placeholder value with the real one.
3. **Delete the `TODO-CONFIRM` comment.**
4. `npm run build && npm run check` — the warning count drops by one.

Where a value appears on several pages, it usually lives in `data/site.json`.
Change it once there and every page follows.

---

## Blocking — do not launch publicly with these unresolved

| # | Decision | Who | Source file |
|---|---|---|---|
| 1 | **Final pricing.** Every figure in the tier ladder is a proposal. It appears on three pages. | Ken & Audrey | `src/pages/deck.mjs` (the `TIERS` array) — `gifts.html` and `preorder.mjs` mirror it |
| 2 | **The Trout Unlimited contribution.** Currently "a portion of proceeds", which converts badly. A hard number — "$1 from every deck" — converts. | Ken & Audrey | `data/site.json` → `conservation.commitment` |
| 3 | **Wholesale terms.** Margin table, case counts, minimums, lead time, payment terms, freight policy, MAP policy. **Every number is a placeholder.** A shop will treat these as real. | Ken | `src/pages/wholesale.html` |

> **Item 3 is the one I would not leave public.** The other placeholders read as
> "coming soon". A wholesale margin table reads as an offer.

---

## Should fix before launch

| # | Decision | Who | Source file |
|---|---|---|---|
| 4 | **Surnames for Ken and Audrey**, if they want them public. | Ken & Audrey | `src/pages/story.html` |
| 5 | **"Multigenerational" vs "5th-generation" Idaho farmers.** The printed info card says multigenerational; `site.json` previously said 5th-generation. The card wording is what ships. | Ken | `data/site.json` → `voice.note` |
| 6 | **Dates** — the year Ken started drawing, the year the deck was finished. | Ken | `src/pages/story.html` |
| 7 | **Contact addresses.** One address currently covers general, wholesale and press. | Audrey | `src/pages/contact.html` |
| 8 | **A named byline for the guides.** They are attributed to the brand. Ken's name on them is a real expertise signal for both Google and AI answer engines — but a fabricated byline is worse than none. | Ken | `data/site.json` → `blog.authorNote` |
| 9 | **Photography of Ken and Audrey.** None exists in the repo. The story and contact pages are written around its absence. | Audrey | `src/pages/story.html`, `contact.html` |

---

## Product detail — confirm with the printer

| # | Decision | Source file |
|---|---|---|
| 10 | **Recyclability claim.** The brief describes the deck as recyclable; that has not been confirmed with USPCC and is a regulated claim in some markets. | `src/pages/deck.mjs` |
| 11 | **Does every card carry a standard rank and suit index?** The three specials carry the jester-fish mark instead. | `src/pages/deck.mjs` |
| 12 | **Finish, stock weight, tuck-box finish, wrap and seal.** Nothing beyond USPCC's Air-Cushion is recorded. Do not add from memory. | `src/pages/cards.mjs` |

---

## Content accuracy — needs an angler's judgement

| # | Decision | Source file |
|---|---|---|
| 13 | **Knot-strength percentages.** Published figures for the clinch, improved clinch and Davy contradict each other between sources, so no figure is stated. Either cite one source explicitly or leave it. | `src/content/blog/best-fly-fishing-knots.mjs` |
| 14 | **The legal definition of "fly"** under fly-fishing-only regulations differs by state. The article says so rather than generalising. | `src/content/blog/do-i-need-a-fishing-license.mjs` |

---

## Resolved

| Decision | Outcome |
|---|---|
| **Card count** | **54 unique cards** — 52 standard plus the Egg and San Juan Worm jokers. This is the industry-standard figure and what is printed on the tuck box. A bonus card ships on top of that; it is shown on the site but never counted into the 54. See `data/site.json` → `product.cardCountNote`. |

---

## A note on the ones that are not really "problems"

Items 13 and 14 are not unfinished work — they are places where the honest answer
is "this varies" or "the sources disagree", and the copy says so. Resolving them
means deciding whether to cite a specific source, not filling in a blank. Leaving
them as they are is a legitimate choice.
