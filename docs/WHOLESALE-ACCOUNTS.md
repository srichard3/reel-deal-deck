# Wholesale accounts — how it works and how to switch it on

**Who this is for:** whoever sets up the Shopify store.
**What it covers:** the one piece of server-side code in this project, the five
environment variables it needs, the Shopify configuration that makes wholesale
pricing real, and the two things this design deliberately does not do.

---

## The shape of it

```
/wholesale/                           THE GATE. Log in, or create an account.
        │                             Carries no price, margin, unit or term.
        ├─ "Log in"  ──────────────▶  Shopify customer login (shop.accountUrl)
        │
        └─ "Create an account"
                 ▼
/wholesale/apply/                     a static page, like every other page
        │  multipart POST (incl. the password they choose)
        ▼
/api/wholesale-apply                  netlify/functions/wholesale-apply.mjs
        │                             (the only server-side code in the repo)
        ├─ uploads the resale certificate  →  Shopify Files
        ├─ creates the customer WITH THEIR PASSWORD  →  Storefront API
        │     (the Admin API cannot set one — CustomerInput has no
        │      password field — so this call has to come first)
        ├─ tags it `wholesale` and attaches the certificate  →  Admin API
        ├─ exchanges the password for a customer access token, so they
        │  land signed in rather than being asked to log in they just made
        └─ builds a Storefront cart carrying their email + shipping address
        │
        ▼
Shopify, signed in                    pricing resolves, they check out
```

**Shopify must be on CLASSIC customer accounts.** The newer "customer accounts"
are passwordless — a one-time code by email — and have no password to set or
check, so `customerCreate(password:)` and `customerAccessTokenCreate` do not
exist for them and this flow cannot work. Settings → Customer accounts →
**Classic**. This is the one setting that silently breaks everything else here.

**Prices are not gated by this website, and could not be.** Anything a browser
can work out, a visitor can work out. `/wholesale/` is a gate in the sense that
it no longer *publishes* the numbers — which is a real improvement, because they
were in the page, in its meta description and in `llms.txt` — but it is not a
security boundary, and a login rendered into a static page never could be. Wholesale pricing comes from a Shopify
**automatic discount targeted at the `wholesale` customer segment** — the tag
this function applies. That is what makes the order link safe to share: without
a tagged, logged-in account the discount does not apply and the visitor pays the
listed price. **A secret URL is not a gate** and is not used as one here.

---

## 0. The switch

`data/site.json` → `pricing.wholesale.account.live` is **false**, and while it is,
`/wholesale/apply/` shows an email address instead of a form. The form, the file
input and the script are not emitted at all — not hidden, not disabled, absent.

That is deliberate. The site is on GitHub Pages today, where
`/api/wholesale-apply` is a 404; a form posting into that would tell applicants
their connection had failed, which is a lie about their wifi.

**Set it to `true` on the day both of these are true, not one of them:**

1. the site is deploying to Netlify, and
2. the Shopify environment variables in section 3 are set.

Nothing else needs changing. If it does get flipped early, `src/js/wholesale.js`
catches the 404 and says signup is not switched on rather than blaming the
reader's connection — but that is a safety net, not the plan.

---

## 1. Netlify, not GitHub Pages

The site currently deploys to GitHub Pages, which serves static bytes and
nothing else. **On Pages, `/api/wholesale-apply` is a 404** and the application
form has nowhere to post.

`netlify.toml` is already written, including the `[functions]` block. Connect the
repo to Netlify, let it build with `npm run build`, and point the domain there.
`docs/DEPLOY.md` has the click-by-click. Until that happens, the apply page will
tell applicants it is not switched on rather than failing silently.

---

## 2. Shopify setup

### a. The products

Two wholesale products, in a collection excluded from search and navigation:

| Product | Contains | List price |
|---|---|---|
| The Reel Deal Deck — Brick | 12 decks | set to the **retail** value, see below |
| The Reel Deal Deck — Master case | 144 decks | set to the **retail** value, see below |

List them at a non-wholesale price. The wholesale price is applied by the
discount in (c), so an untagged visitor who finds the link is simply quoted a
normal price rather than being handed trade pricing.

### b. The customer segment

Shopify → Customers → Segments → create:

```
customer_tags CONTAINS 'wholesale'
```

### c. The discount

Shopify → Discounts → **Automatic discount**, applying to that segment and those
two products, bringing them to the per-deck figures in
`data/site.json → pricing.wholesale.tiers` — currently **$9.97/deck** by the
brick ($119.64) and **$8.97/deck** by the master case ($1,291.68).

> Those figures live in `data/site.json` and are rendered on `/wholesale/` and
> `/deck/` from there. **If you change a price, change it in that file and in the
> Shopify discount together** — they are the two halves of the same number.

### d. The metafield definitions

Settings → Custom data → Customers. Namespace `wholesale`, so the permit and the
business details show up on the customer record instead of being invisible:

| Key | Type |
|---|---|
| `business_name` | Single line text |
| `resale_permit` | File |
| `tax_id` | Single line text |
| `role` | Single line text |
| `website` | Single line text |
| `notes` | Multi-line text |
| `applied_at` | Date and time |

### e. The app and its tokens

Settings → Apps → **Develop apps** → create an app. Two sets of credentials:

**Admin API** — scopes `write_customers`, `read_customers`, `write_files`. This
token can read and change your customers. It lives only in Netlify's environment
and must never be pasted into a page, a commit, or a message.

**Storefront API** — scopes `unauthenticated_write_checkouts`,
`unauthenticated_read_product_listings`. This one is the public kind and is safe
in a browser; the function uses it server-side anyway.

---

## 3. The environment variables

Netlify → Site configuration → Environment variables:

| Variable | Example | Required |
|---|---|---|
| `SHOPIFY_STORE_DOMAIN` | `reeldealdeck.myshopify.com` | yes |
| `SHOPIFY_ADMIN_TOKEN` | `shpat_…` | yes |
| `SHOPIFY_STOREFRONT_TOKEN` | `…` | **yes** — it is the only API that can set a password, so without it no account can be created at all |
| `SHOPIFY_WHOLESALE_VARIANT_ID` | `gid://shopify/ProductVariant/123…` | for the pre-filled cart |
| `WHOLESALE_PORTAL_URL` | the wholesale collection URL | fallback landing page |
| `SHOPIFY_API_VERSION` | `2025-10` | no — see below |
| `REVIEW_ONLY` | `1` | no — see below |

Without the first two, the form says wholesale signup is not switched on yet and
points people at email. Without the Storefront pair, accounts are still created
and applicants land on `WHOLESALE_PORTAL_URL` instead of a pre-filled cart.

**Check `SHOPIFY_API_VERSION` before launch.** Shopify versions its API
quarterly and retires old versions; the pinned default will age out.

---

## 4. Two things to decide, not to discover

### Auto-approval — decided, and on

Everyone who submits is approved immediately and tagged `wholesale`. **The
resale permit is collected and stored but nobody checks it**, so anyone who
uploads any file gets trade pricing. That trade-off was weighed and accepted:
speed over screening, while volume is low.

Two things follow from it, worth knowing rather than discovering:

- A resale certificate is a sales-tax document. Accepting one nobody has looked
  at is the seller's risk, not the buyer's — worth a word with whoever does the
  books, not a reason to change the setting.
- A brick saves someone about $120 against retail, which is enough incentive for
  a determined non-shop to try it. Spotting that is a matter of glancing at new
  customers in Shopify now and then, not of changing this.

**If that ever stops being the right trade, it is one variable.** Set
`REVIEW_ONLY=1` and applications are tagged `wholesale-pending` instead. The
discount segment does not match that tag, so they queue for review and nothing
else changes — no code, no redeploy. Retag to `wholesale` in Shopify to approve.
The applicant is told their application is in rather than being sent to a cart.

### Abuse

`/api/wholesale-apply` is a public endpoint that creates customer records and
accepts file uploads. It has a honeypot field, a 10MB cap, a MIME allowlist, and
it ignores any field it does not expect — but **there is no rate limit**,
because that needs somewhere to keep a counter and this project has no database.

Low-volume and obscure is fine for now. If it is ever found, Netlify's own rate
limiting or a Cloudflare Turnstile check in front of the function is the fix.

---

## 5. Testing it before real shops use it

```bash
netlify dev      # serves dist/ and the function together on one port
```

Then, with the environment variables set on a **development** Shopify store:

1. Apply with a real address and a junk PDF.
2. Shopify → Customers: the customer exists, is tagged `wholesale`, and the
   permit is on the record under Metafields.
3. The browser lands on a cart with a brick in it, the email filled in, and the
   shipping address already entered.
4. Log out and open the same wholesale product URL. **You should see the list
   price, not the wholesale price.** If you see the wholesale price, the
   discount is not scoped to the segment and the whole gate is open.

Step 4 is the one that matters. Do not skip it.
