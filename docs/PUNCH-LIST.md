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
| 0 | **The remaining photographs.** Four have arrived and are on `/story/` and `/conservation/`. Still open: the printed info card, **the original artwork beside the finished card** (the most valuable image the site could have), the packing table, and **one portrait of Audrey alone** — without it neither founder card can carry a face. `docs/PHOTO-PLAN.md` has the shot list. | Ken & Audrey | `logos-and-photos-new/` |

| 1 | **Submit the sitemap** to Search Console and Bing, once a deploy has been verified public and index-able. Nothing blocks this any more; it simply has not been done. | Ken & Audrey | `docs/GROWTH-PLAN.md` phase 2 |
| 3 | **Shopify terms of service.** `/policies/terms-of-service` returns 404. It is the only place the fishing-information disclaimer lives, and the site now publishes licence figures for all fifty states. | Ken & Audrey | Shopify → Settings → Policies |

---

## Should fix before launch

| # | Decision | Who | Source file |
|---|---|---|---|
| 4 | **A named byline for the guides.** They are attributed to the brand. Ken's name on them is a real expertise signal for both Google and AI answer engines — but a fabricated byline is worse than none. | Ken | `data/site.json` → `blog.authorNote` |
| 5 | **A portrait of Audrey.** There are now several photographs of Ken and one of them both, but none of Audrey on her own, so the founder cards still carry the K♠/Q♥ marks. The press page still offers card art only. | Audrey | `docs/PHOTO-PLAN.md` |
| 6 | **Credit for the designer** who drew the cards. Raised more than once and still the founders' call. The site never claims Ken drew them. | Ken & Audrey | `data/site.json` → `story.artNote` |

---

## Resolved — 12 October 2026

| Was | Outcome |
|---|---|
| **Netlify access control** returned a site-wide `401` with a JavaScript "Login Redirect" interstitial. | Switched off. `reeldealdeck.com` answers `200`, `www` redirects to the apex. |
| **`NOINDEX=1`** was set as a Netlify environment variable and every page carried `<meta name="robots" content="noindex, nofollow">`. | Deleted from the Netlify environment. |
| **Production deploys were failing silently** on Netlify's secrets scanner, so the live site served a build from 6 October with 93 of its 181 pages missing. | No secret was ever leaking: `SHOPIFY_CLIENT_SECRET`, `RESEND_API_KEY` and `SHOPIFY_CLIENT_ID` appear zero times in `dist/`. The scanner was matching `SHOPIFY_SHOP_URL`, which is on all 185 output files because it is every Buy button, and `WHOLESALE_LIVE`, whose value is `1`. `SECRETS_SCAN_OMIT_KEYS` in `netlify.toml` now names the six public variables; the three credentials stay scanned so a genuine leak still fails the build. |

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
| **The Shopify storefront URL** | Set and verified. `data/site.json` → `shop.url` points at `/products/the-reel-deal-deck`. |
| **Where the domain points** | Done. `reeldealdeck.com` and `www` both resolve to Netlify; Shopify moved to `shop.reeldealdeck.com`. |
| **The customer account login URL** | Set, and pointed at `/account/login?return_url=%2Fpages%2Fwholesale` rather than a bare `/account` — the latter lands a trade buyer on Shopify's hosted dashboard, which advertises the retail deck. |
| **GitHub Pages** | Taken down 12 October 2026. Netlify is the only host. The staging mirror shipped `noindex` on every page, so nothing was indexed and there is nothing to redirect. |
| **Shopify Payments** | Appears active. The product page renders the Shop Pay accelerated checkout, which Shopify only shows once Shopify Payments is set up. Confirm in Settings → Payments; this was checked from the storefront, not the admin, and no test order was placed. |
| **The state tier** | Complete. All fifty states, every licence figure read from the issuing agency's own table. |
| **Card count** | **54 unique cards** — 52 standard plus the Egg and San Juan Worm jokers, the figure printed on the tuck box. A bonus card ships on top and is never counted into the 54. `data/site.json` → `product.cardCountNote` |
| **Pricing against cost** | $19.95 retail, $6.95 shipping, $9.97/deck by the brick and $8.97/deck by the master case are confirmed against real cost. `data/site.json` → `pricing` is the only place any of them lives. |
| **Surnames** | Fry. Ken Fry and Audrey Fry, consistent with `brand.legalName`, Homer Fry Ranch, LLC. Full names carry the schema and the two founder cards; the running copy stays on first names. |
| **Generations** | Ken is the fifth generation, Audrey the sixth. |
| **Recyclability** | Confirmed: the same material specification as any Bicycle deck. Published as a spec row. No FSC chain-of-custody number and no certification mark on top of it. |
| **Ranks and suits** | Standard throughout, with two jokers — so "you can deal a hand of poker with it" is literally true. |
| **Stock and finish** | Bicycle Rider Back stock with USPCC's Air-Cushion finish. `data/site.json` → `product.stock` |
| **Contact address** | One inbox, `reeldealdeck@gmail.com`, for general, wholesale and press. Subject-line prefixes sort the mail. Every other address has been removed from the site. |
