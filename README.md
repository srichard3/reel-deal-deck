# The Reel Deal Deck — website

Marketing + SEO hub for The Reel Deal Deck, a 54-card fly-fishing playing card deck.

Zero dependencies. Node 20+. Pure HTML/CSS/vanilla JS output.

```bash
npm run build     # src/ + data/ -> dist/
npm run dev       # build, then serve dist/ on :4173
npm run check     # link/meta/a11y sanity checks over dist/
```

---

## Strategy this site implements

| Goal | Mechanism |
|---|---|
| **Organic traffic** | The **Fly Library** — one page per fly, 54 pages of genuinely useful free reference content targeting long-tail angler search ("what does a Pheasant Tail imitate"). Nobody searches the brand name; they search the flies. |
| **Angler conversion** | Fly Library → deck page. The content *is* the product demo. |
| **Gift conversion** | `/gifts/` speaks to the non-angler buying for an angler. Different copy, different objections. |
| **B2B** | `/wholesale/` — fly shops, guides, lodges. The Kickstarter's $99 brick tier out-converted the single deck; bulk is the real market. |
| **List building** | Email capture on every page. There is no product to sell yet. |

### Positioning

**Do not** claim "nobody makes fly-fishing flashcards." That is false and one search disproves it —
Inkstone ($9.95), Go Fly Fish ($11.95), RIO ($15.99) and River's Edge all exist, plus Orvis publishes
free flash cards. Claiming it makes us look lazy to the exact expert we're courting.

**Do** claim what is true and defensible:
> The first fly-fishing deck an angler would be proud to own — original hand-drawn art,
> printed on genuine Bicycle stock, with a portion of every deck going to Trout Unlimited.

Every competitor uses photography or licensed art on generic 300gsm. We draw ours and print on USPCC.

---

## Architecture

```
build.mjs              generator — DO NOT EDIT without coordinating
data/site.json         brand constants, nav, product facts
data/flies.json        the 54 flies (Fly Library source of truth)
src/_partials/         shell.html, head.html, header.html, footer.html
src/pages/*.html       content pages (see front matter below)
src/pages/*.mjs        pages that need logic
src/templates/fly.mjs  per-fly page generator
src/styles/            tokens.css (contract) + base/components/page CSS
src/js/                progressive-enhancement only; site works without it
static/                copied verbatim to dist root (robots.txt, og/, favicon)
scripts/postbuild.mjs  optional hook, receives { site, flies, routes, DIST, ROOT }
```

### Page contract — `src/pages/*.html`

Every HTML page starts with a JSON front-matter comment:

```html
<!--meta
{
  "path": "/gifts/",
  "title": "Fly Fishing Gifts",
  "description": "Under 160 chars. Written for humans, not keyword stuffing.",
  "priority": 0.8,
  "changefreq": "monthly",
  "bodyClass": "page-gifts",
  "ogImage": "/og/gifts.png",
  "jsonld": [ { "@context": "https://schema.org", "@type": "..." } ]
}
-->
<section class="wrap">…</section>
```

- `path` must start and end with `/` (except the homepage, which is `"/"`)
- Everything after the comment is injected into `<main>`
- `{{ site.x }}` and `{{ meta.x }}` interpolate (HTML-escaped)
- `{{> partialName }}` includes `src/_partials/partialName.html`
- Add `"noindex": true` to keep a route out of `sitemap.xml`

### Page contract — `src/pages/*.mjs`

```js
export const meta = { path: '/flies/', title: '…', description: '…' };
export default function ({ site, flies, meta }) {
  return `<section class="wrap">…</section>`;
}
```

### Fly template — `src/templates/fly.mjs`

```js
export default function ({ fly, flies, site }) {
  return { meta: { path: `/flies/${fly.slug}/`, title: …, jsonld: [...] }, body: `…` };
}
```

---

## Rules

1. **tokens.css is the design contract.** No hard-coded colours, type sizes, or spacing anywhere else.
2. **No frameworks, no CDNs, no webfonts, no build dependencies.** Everything is self-hosted and offline-capable.
3. **JS is progressive enhancement only.** Every page must be fully readable and navigable with JS disabled.
4. **Accessibility is not optional**: one `<h1>` per page, sane heading order, visible focus rings,
   4.5:1 contrast minimum, real `<button>`/`<a>` elements, `prefers-reduced-motion` respected.
5. **Light and dark both ship.** Test both.
6. **Never invent brand facts.** If a number, date, price, or claim isn't in `data/site.json`,
   mark it `TODO-CONFIRM` in the copy rather than making it up.
7. **All purchase actions are placeholders** (see `docs/COMMERCE.md`). Never imply an order was taken.

## Art direction

The site should feel like *the card*, not like a lodge. Precise, engraved, high-contrast,
generous whitespace. The repeating motif is the **card-corner index** (rank + suit).

Banned: wood grain, plaid, burlap, stock photography, hero carousels, "Welcome to our website",
parallax, glassmorphism, animated counters, chat bubbles, exit-intent popups.
