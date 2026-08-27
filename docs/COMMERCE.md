# Commerce swap-in plan

**Who this is for:** Ken and Audrey, to hand to whoever wires up real checkout.
**What it covers:** which provider to pick, exactly what to change in this repo, how to
connect the email captures, what to know about tax and shipping, and what to check before
the first real order.

**Current state:** there is no checkout, no cart, no payment processor and no back end.
Everything commerce-shaped on this site is a deliberate placeholder in
`src/js/commerce.js`. Forms save to the visitor's own browser (`localStorage`) and send
nothing anywhere. Nothing on the site says an order was placed or a payment was taken, and
nothing should be changed in a way that makes it say so before real checkout is live.

---

## 1. Which provider

The shape of this business decides it: **five or six retail SKUs**, **physical goods**,
**US shipping**, **a wholesale tier**, **low volume at launch**, and **two non-technical
owners**. That rules more out than it rules in.

| | Shopify (Starter → Basic) | Stripe Payment Links | Lemon Squeezy |
|---|---|---|---|
| Physical goods | Yes, built for it | Yes, but you build the logic | **No** — digital products only |
| Real shipping rates | Yes, by weight and zone | Flat rates only, per link | n/a |
| Inventory count | Yes, stops overselling | No | n/a |
| Sales tax across states | Yes (Shopify Tax), automatic | Stripe Tax, extra setup + fee | n/a |
| Wholesale / trade orders | Draft orders, invoices, B2B on higher plans | Manual invoices | n/a |
| Abandoned-cart email | Yes | No | n/a |
| Works embedded in a static site | Yes — Buy Buttons | Yes — plain links | n/a |
| Monthly cost | ~$5 Starter, ~$39 Basic | $0 | n/a |
| Per-transaction | ~2.9% + 30¢ | 2.9% + 30¢ | n/a |
| Non-technical owner can run it | Yes | Not really | n/a |

### Recommendation: Shopify, embedded as Buy Buttons. Start on the Starter plan.

Not because it is cheapest — Stripe is — but because a physical product with a dozen-deck
bulk tier needs three things Stripe Payment Links will not give you without a developer on
retainer: **weight-based shipping**, **inventory that stops overselling a print run**, and
**an order screen a non-technical owner can actually run a business from**.

Lemon Squeezy is out entirely. It is a merchant of record for **digital** products and does
not sell physical goods. Do not spend a meeting on it.

**The path:**

1. **Shopify Starter (~$5/mo).** No storefront theme, no theme editor — just products,
   checkout, and embeddable Buy Buttons. This site stays exactly as it is; the buttons drop
   into the tier ladder. This is the right launch configuration.
2. **Upgrade to Basic (~$39/mo)** the moment either is true: you want abandoned-cart
   recovery, or a wholesale account needs a draft order / invoice.
3. **Do not** rebuild this site inside a Shopify theme. The Fly Library is the traffic
   engine and it is already fast, static and free to host. Keep the content here and let
   Shopify do nothing but take money.

**Set up in Shopify, exactly these products:**

| Shopify product / variant | Decks | Price | SKU suggestion |
|---|---|---|---|
| The Reel Deal Deck — 1 deck | 1 | $24 | RDD-01 |
| The Reel Deal Deck — 2 decks | 2 | $44 | RDD-02 |
| The Reel Deal Deck — 4-pack | 4 | $84 | RDD-04 |
| The Reel Deal Deck — Brick | 12 | $216 | RDD-12 |
| Signed First Edition | 1 | $60 | RDD-SIGNED |

TODO-CONFIRM: all five prices are proposals from `src/pages/deck.mjs` and need founder
sign-off against real landed cost. Whatever you settle on, change it in **three** places or
they will drift: the `TIERS` array in `src/pages/deck.mjs`, the `offers` block in that same
file's `meta.jsonld`, and the trade table in `src/pages/wholesale.html`.

Do **one** variant per tier as a separate product rather than a quantity selector. It keeps
the analytics readable — you want to know that the brick outsells the single deck, which is
the whole commercial thesis of this business.

---

## 2. Exactly what to change in this repo

Everything commerce-related is in **two files**. You do not need to touch any page.

### `src/js/commerce.js` — the only file with the seam

At the bottom of the IIFE it exposes:

```js
window.RDD.commerce = {
  onCapture(record) {},   // called after a form is saved locally
  onInterest(list, item) {},  // called after a tier is saved to the list
  getCaptures(), getInterest(), clearInterest(),
  isPlaceholder: true,
};
```

Both hooks are called **after** the local write, are allowed to return a Promise, and are
wrapped so that a thrown error or rejected promise can never break the page. Overriding
them is the entire integration.

**Selectors it binds to** (do not rename these without updating the pages):

| Selector | Where | What it does now |
|---|---|---|
| `form[data-capture="reserve"]` | `/deck/#reserve` | Saves to `localStorage["rdd-captures"]` |
| `form[data-capture="gift"]` | `/gifts/#gift-list` | Same |
| `form[data-capture="wholesale"]` | `/wholesale/#wholesale-enquiry` | Same |
| `[data-add-to-cart="<tier-id>"]` | tier cards on `/deck/` | Saves to `localStorage["rdd-interest"]` |
| `[data-price]`, `[data-decks]`, `[data-label]` | on those buttons | Tier metadata |
| `[data-qty]` inside `[data-tier-root]` | tier cards | Quantity |
| `[data-interest-panel]`, `[data-interest-list]`, `[data-interest-count]`, `[data-interest-total]` | `/deck/` | The summary panel |
| `[data-interest-remove]`, `[data-interest-clear]` | summary panel | Edit the list |

### The swap, in three steps

**Step 1 — real checkout.** Add Shopify's Buy Button script and give each tier a real
button. The cleanest minimal change: keep the existing markup, add the Shopify variant id
to each button, and replace `onInterest` so a click goes to a real cart.

```html
<!-- src/pages/deck.mjs, inside tierCard() — add one attribute -->
data-shopify-variant="0000000000000"
```

```js
// A new file, src/js/checkout.js, loaded AFTER commerce.js.
// Do not edit commerce.js itself; just override the seam.
window.RDD.commerce.onInterest = function (list, item) {
  var qs = list.map(function (l) {
    return VARIANTS[l.tier] + ':' + l.qty;   // VARIANTS maps tier id -> variant id
  }).join(',');
  window.location.href = 'https://YOURSHOP.myshopify.com/cart/' + qs;
};
```

**Step 2 — retire the placeholder language.** Once real checkout is live, these strings are
wrong and must go. They are all in `src/js/commerce.js` and the pages:

- `successCopy()` in `commerce.js` — every branch says "no payment has been taken".
- Every `<p class="cx-stub">` block (one per form, three pages).
- The `.buy-avail` "Not yet shipping" pill on `/deck/`, `/gifts/` and `/wholesale/`.
- "Save to my list" button labels and the `.buy-interest` panel heading on `/deck/`.
- The availability line in `data/site.json` (`product.availabilityNote`, `product.status`).
- `"availability": "https://schema.org/PreOrder"` in the Product JSON-LD in
  `src/pages/deck.mjs` → `https://schema.org/InStock`. **Do not change this one until stock
  is physically in hand.** Google penalises structured data that contradicts the page.

**Step 3 — delete the stub.** When both hooks are overridden and the copy is updated, the
localStorage writes are dead weight. Remove `writeJSON(CAPTURE_KEY, …)` and the
`INTEREST_KEY` block. Keep the validation and the inline status rendering; both are still
useful.

---

## 3. Wiring the email captures to a real ESP

There are three capture forms and they want to land in three different places.

**Recommendation: MailerLite to start, Klaviyo when you outgrow it.**
MailerLite is free to 1,000 subscribers, has a plain HTTP API, and Audrey can run it without
help. Klaviyo is the right answer once there is Shopify order data to segment on and more
than about 2,000 subscribers — it is materially better at "who bought a brick, who bought
one deck" and materially more expensive.

Do **not** send the wholesale enquiries into the same list as the consumer emails. A shop
buyer who receives a Father's Day promo unsubscribes and you lose an account.

| Form | Destination | Why |
|---|---|---|
| `reserve` | ESP list: **Pre-order waitlist** | The launch announcement list |
| `gift` | ESP list: **Gift buyers**, tagged with `occasion` | Seasonal sends, timed to the date they gave you |
| `wholesale` | **Email to `reeldealdeck@gmail.com` + a spreadsheet or CRM** | These are sales leads, not subscribers |

The whole integration:

```js
// src/js/checkout.js — loaded after commerce.js
window.RDD.commerce.onCapture = function (record) {
  return fetch('https://your-worker.example.com/capture', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(record),
  });
};
```

`record` is already shaped for this: `{ kind, page, at, fields: {...}, interest: [...] }`.

**Never put an ESP write key in this file.** It is a public static site; anything in
`src/js/` is readable by anyone. Put a Cloudflare Worker, Netlify Function or Formspark
endpoint in between, holding the key server-side. If that is too much for now, the honest
interim is the `mailto:` fallback already on every form — it works and it is not a lie.

**Consent:** add an explicit opt-in checkbox before sending anyone marketing email. US
CAN-SPAM does not strictly require opt-in, but it costs nothing and it keeps the option of
selling to the EU and UK open.

---

## 4. Sales tax and nexus

Not legal advice; this is the shape of the problem so you can ask an accountant the right
question.

- **Home state.** The business is in Eagle, Idaho, so it has physical nexus in Idaho from
  day one. You will need an Idaho seller's permit and you charge Idaho sales tax on Idaho
  orders. This is the only registration you certainly need at launch.
- **Everywhere else.** Every other state uses *economic nexus*: you only owe them anything
  once you cross a threshold there, typically **$100,000 in sales into that state**, and in
  some states a transaction count as well. At $24 a deck, hitting $100k in a single other
  state means roughly 4,000 decks into that one state. That is not a launch-year problem.
- **What to do:** register in Idaho. Turn on **Shopify Tax**, which calculates by
  destination and tracks how close each state is to its threshold, and watch the liability
  screen. Register elsewhere only when Shopify tells you a threshold is close.
- **Wholesale is different.** Trade sales are sales for resale and are exempt — but only if
  you **collect and keep a resale certificate from every shop** before you invoice them. Add
  that to the account-opening flow. Auditors ask for these; "the shop told me they were a
  shop" is not a defence.
- **Marketplace facilitator rules** meant Kickstarter may have handled tax on the campaign.
  Selling direct, it is yours. Do not assume the campaign's treatment carries over.

TODO-CONFIRM: whether the Kickstarter campaign already created a registration or filing
obligation in Idaho, and how the entity is structured.

---

## 5. Shipping

TODO-CONFIRM: weigh a finished deck before quoting anything below. A standard USPCC poker
deck in its tuck box is roughly **3.3–3.5 oz (95–100 g)**; the numbers here assume that.

| Order | Est. packed weight | Sensible service | Rough cost |
|---|---|---|---|
| 1 deck | ~5 oz in a rigid mailer | USPS Ground Advantage, under 8 oz | ~$4–6 |
| 2 decks | ~9 oz | Ground Advantage | ~$5–7 |
| 4 decks | ~1 lb 2 oz | Ground Advantage | ~$7–9 |
| 12-deck brick | ~3 lb | Ground Advantage / UPS Ground | ~$10–14 |
| 72-deck master carton | ~17–19 lb | UPS/FedEx Ground | ~$20–35 by zone |

Practical consequences, and they matter more than the table:

- **A single deck is the worst unit economics you will ever ship.** At $24 with $5 of
  postage, $1.00 of packaging and roughly $1.00 of card fees, shipping and handling eat a
  quarter of the order before COGS. This is precisely why the tier ladder exists — every
  rung up spreads one shipping cost across more decks.
- **Set free shipping at a threshold, not at zero.** Free over $50 pushes single-deck buyers
  to the two-pack, which is the single highest-leverage lever on this site. Do not offer
  free shipping on one deck at $24.
- **Do not use a padded envelope.** Cards arriving with bent corners on a product whose
  entire pitch is "genuine Bicycle stock" is a refund and a bad review at once. Rigid
  cardboard mailer, always.
- **International:** the site currently promises nothing, deliberately. Keep it that way
  until you have quoted actual rates. Customs forms on a $24 item are rarely worth it below
  a batch; consider a single overseas fulfilment run instead of per-order shipping.

---

## 6. Pre-launch checklist

Nothing on this list is optional before the first real order.

**Money**
- [ ] Prices signed off by both founders against real landed cost per deck.
- [ ] Shopify products created; five variants above; SKUs set.
- [ ] Inventory counts entered and "continue selling when out of stock" turned **off**.
- [ ] Test order placed with a real card, then refunded end to end.
- [ ] Idaho seller's permit obtained; Shopify Tax on; Idaho tax charging correctly on a test order.
- [ ] Refund and returns policy written and linked in the footer.

**Site**
- [ ] `onCapture` and `onInterest` overridden in `src/js/checkout.js`; the stub no longer stores anything.
- [ ] Every `.cx-stub` paragraph removed (3 pages).
- [ ] Every `.buy-avail` "not yet shipping" pill removed or rewritten (3 pages).
- [ ] `product.status` and `product.availabilityNote` in `data/site.json` updated.
- [ ] Product JSON-LD `availability` changed `PreOrder` → `InStock`, **after** stock lands.
- [ ] `console.info('[RDD stub] …')` lines gone from `src/js/commerce.js`.
- [ ] Every `TODO-CONFIRM` comment in `src/pages/` resolved or deliberately left. Find them:
      `grep -rn "TODO-CONFIRM" src/ data/ docs/`
- [ ] `data/site.json` → `conservation.commitment` replaced with a hard number. "A portion of
      proceeds" converts measurably worse than "$1 from every deck".
- [ ] Checkout tested with JavaScript disabled — or, if it cannot work without JS, a visible
      fallback that tells the visitor so.

**Wholesale**
- [ ] Trade price table confirmed and the 55% tier checked for positive contribution margin.
- [ ] Case pack and master carton counts confirmed against the USPCC packing spec.
- [ ] Resale certificate collection added to the account-opening flow.
- [ ] MAP policy decided and written down, or accounts will be undercut by the direct site.
- [ ] Lead time replaced with a real number once the print slot is booked.

**Email**
- [ ] ESP account live; three destinations wired; a real test capture arrives in each.
- [ ] Server-side proxy in place so no API key is in `src/js/`.
- [ ] The existing `rdd-captures` records — sitting in early visitors' browsers and readable
      via `window.RDD.commerce.getCaptures()` — are gone for good the moment they clear their
      cache. If the pre-launch waitlist matters, wire the ESP up **before** driving traffic,
      not after.
