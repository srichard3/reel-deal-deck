# Punch list — the decisions still needed before launch

`npm run check` reports **0 errors and 0 warnings**. Every open question that
was sitting in the source as a `TODO-CONFIRM` has been answered by Ken and
Audrey and removed. What is left below is work that needs a thing to exist —
a store, a photograph, a decision about a byline — not a question about a fact.

```bash
npm run build && npm run check   # must stay at 0 errors, 0 warnings
```

---

## Blocking — do not launch publicly with these unresolved

| # | Decision | Who | Source file |
|---|---|---|---|
| 0 | **Five photographs.** The shot list, sizes and destinations are in `docs/PHOTO-PLAN.md`. Slot 2, the original artwork beside the printed card, is the single most valuable image the site could have. | Ken & Audrey | `new assets/photos/` |
| 1 | **The Shopify storefront URL.** Everything else about ordering is done; this one field turns ~60 buttons into real checkout. | Ken & Audrey | `data/site.json` → `shop.url`. See `docs/COMMERCE.md` |
| 2 | **The domain.** `reeldealdeck.com` is printed on the cards and is not registered to us yet. | Ken | — |

---

## Should fix before launch

| # | Decision | Who | Source file |
|---|---|---|---|
| 3 | **The Shopify customer account login URL**, for the wholesale login links. Empty hides them rather than shipping a dead link, so this is not urgent — but the wholesale flow is only half-visible without it. | Ken & Audrey | `data/site.json` → `shop.accountUrl` |
| 4 | **A named byline for the guides.** They are attributed to the brand. Ken's name on them is a real expertise signal for both Google and AI answer engines — but a fabricated byline is worse than none. | Ken | `data/site.json` → `blog.authorNote` |
| 5 | **Photography of Ken and Audrey.** None exists in the repo. The story and contact pages are written around its absence, and the press page offers card art only. | Audrey | `docs/PHOTO-PLAN.md` |
| 6 | **Credit for the designer** who drew the cards. Raised more than once and still the founders' call. The site never claims Ken drew them. | Ken & Audrey | `data/site.json` → `story.artNote` |

---

## Deliberately without a number

These are not blanks waiting to be filled. They are decisions to stay silent,
and each one is recorded at its source so a later contributor does not "fix" it
by inventing a figure.

| Subject | The decision |
|---|---|
| **Trout Unlimited contribution** | "A cut of every deck" — no dollar amount, no percentage. `data/site.json` → `conservation.commitment` |
| **International shipping** | Not offered and not mentioned. Domestic rates only. |
| **MAP policy** | None. No resale price condition appears on `/wholesale/`. |
| **Dates** | The years the deck was started and finished are not published. |
| **Knot-strength percentages** | Published figures contradict each other between test methods, so none is stated. |
| **The legal definition of "fly"** | Varies by state; the guide says so and sends the reader to their own regulation booklet. |
| **Release mortality rates** | Vary by species, temperature, hook and handling; no single figure would be honest. |
| **Stock weight, tuck-box finish, wrap and seal** | Not recorded anywhere, so not published. |

---

## Resolved

| Decision | Outcome |
|---|---|
| **Card count** | **54 unique cards** — 52 standard plus the Egg and San Juan Worm jokers, the figure printed on the tuck box. A bonus card ships on top and is never counted into the 54. `data/site.json` → `product.cardCountNote` |
| **Pricing against cost** | $19.95 retail, $6.95 shipping, $9.97/deck by the brick and $8.97/deck by the master case are confirmed against real cost. `data/site.json` → `pricing` is the only place any of them lives. |
| **Surnames** | Fry. Ken Fry and Audrey Fry, consistent with `brand.legalName`, Homer Fry Ranch, LLC. Full names carry the schema and the two founder cards; the running copy stays on first names. |
| **Generations** | Ken is the fifth generation, Audrey the sixth. |
| **Recyclability** | Confirmed: the same material specification as any Bicycle deck. Published as a spec row. No FSC chain-of-custody number and no certification mark on top of it. |
| **Ranks and suits** | Standard throughout, with two jokers — so "you can deal a hand of poker with it" is literally true. |
| **Stock and finish** | Bicycle Rider Back stock with USPCC's Air-Cushion finish. `data/site.json` → `product.stock` |
| **Contact address** | One inbox, `support@reeldealdeck.com`, for general, wholesale and press. Subject-line prefixes sort the mail. Every other address has been removed from the site. |
