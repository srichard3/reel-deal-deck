# Technical SEO reference

How this site is structured for search, and how to extend it without breaking anything.

For the *marketing* playbook (Search Console setup, content cadence, link building), see
[LAUNCH.md](LAUNCH.md). This document is the technical side.

---

## URL structure

```
/                        Home
/deck/                   Product
/flies/                  Fly Library index          ← traffic hub
/flies/<slug>/           54 individual fly pages    ← the traffic
/gifts/                  Gift buyer
/wholesale/              Fly shops, guides, lodges
/story/                  Founders
/conservation/           Trout Unlimited
/contact/                Contact
/404/                    Not found (noindex)
```

**Why directories, not `.html`:** clean, stable, and they let a fly page become a hub later
(`/flies/adams/tying/`) without a redirect. Every URL ends in a trailing slash, enforced by
`static/_redirects`.

**Slugs are permanent.** A slug is a promise. If a fly must be renamed, add a redirect in
`static/_redirects` — never silently change the path, or you lose every link and ranking it earned.

---

## Structured data by template

| Template | Schema types |
|---|---|
| Home | `Organization`, `WebSite` |
| `/deck/` | `Product` with `offers.availability = PreOrder`, `FAQPage` |
| `/flies/` | `CollectionPage`, `ItemList` (all 54), `BreadcrumbList` |
| `/flies/<slug>/` | `Article`, `FAQPage`, `BreadcrumbList` |
| `/story/`, `/contact/` | `Organization`, `Person`, `BreadcrumbList` |

**Two rules that are not optional:**

1. **Never emit schema for content that is not visible on the page.** The `FAQPage` blocks on fly
   pages are generated from the same `imitates` / `whenToFish` / `howToFish` fields that render in
   the body. If you add a question to the schema, render it too.
2. **Never fabricate ratings or review counts.** The `Product` schema deliberately carries no
   `aggregateRating`. Inventing one is a Google penalty and an FTC problem.

---

## Canonical, OG and meta

All handled centrally in `src/_partials/head.html` — do not add meta tags to individual pages.

- **Canonical** is derived from `meta.path` + `site.url`. Always self-referential.
- **`og:image`** defaults to `/og/default.png`; override per page with `meta.ogImage`.
- **Title budget:** the shell appends `" — The Reel Deal Deck"` (21 chars), so a page title has
  **39 characters** before the total overruns the ~60-char SERP cut. `scripts/check.mjs` enforces this.
  `src/templates/fly.mjs` picks the most keyword-complete title variant that fits.
- **Description budget:** 160 chars, enforced by the same check. For fly pages this comes from
  `summary` in `data/flies.json`, which is validated at ≤155.

---

## The internal linking model

This is what makes the Fly Library work as a system rather than 54 orphans.

```
              ┌──────────────┐
   header ───▶│   /flies/    │◀─── footer (4 type-anchor links)
              └──────┬───────┘
                     │ links to all 54
                     ▼
            ┌────────────────────┐
            │  /flies/<slug>/    │
            └────────┬───────────┘
                     ├─▶ 4+ sibling flies ("Fishes well alongside")
                     ├─▶ prev / next through the deck
                     ├─▶ back to /flies/
                     └─▶ /deck/  (conversion)
```

Every fly page links to **at least four** others. `src/templates/fly.mjs` guarantees this: it uses
`pairsWith` first, then falls back to same-type flies, then to any fly. No page is ever a dead end,
and crawl depth from the homepage to any fly is 2.

`pairsWith` is validated — a slug that does not exist will not silently produce a broken link, but
you should still run the validation below after editing.

---

## Adding a new fly

1. Append an object to `data/flies.json`. Required: `slug`, `name`, `card`, `type`, `imitates`,
   `summary` (≤155 chars), `body` (3+ paragraphs).
2. Add its slug to the `pairsWith` of 2–3 existing flies so it is not an orphan.
3. Validate:

```bash
node -e "const f=require('./data/flies.json');const s=new Set(f.map(x=>x.slug));f.forEach(x=>(x.pairsWith||[]).forEach(p=>{if(!s.has(p))console.log('broken',x.slug,'->',p)}));f.forEach(x=>{if(x.summary.length>155)console.log('long summary',x.slug)});console.log(f.length,'flies,',new Set(f.map(x=>x.slug)).size,'unique slugs')"
```

4. `npm run build && npm run check`
5. Resubmit `sitemap.xml` in Search Console (or wait — it will be recrawled).

`type` must be one of: `dry`, `nymph`, `streamer`, `wet`, `terrestrial`, `attractor`, `egg`, `worm`.
Anything else falls back to dry-fly art and will not get its own section on the index.

---

## Verifying in Search Console

| What | Where | Healthy looks like |
|---|---|---|
| Indexing | Pages → Indexed | Climbing toward 62. Investigate anything stuck in "Discovered — currently not indexed" for 30+ days. |
| Rich results | URL Inspection → Test live URL | Fly pages show `Article` + `FAQ` + `Breadcrumb` |
| Queries | Performance → Queries | Fly names and "what does X imitate" — *not* the brand name |
| Mobile | Experience → Mobile Usability | Zero issues (the site is mobile-first and has no webfonts) |

---

## Performance

There is nothing to optimise, by design: no framework, no CDN, no webfonts, no external requests,
no client-side routing, no images above the fold. Pages are static HTML with five small stylesheets
and two small scripts, and the fly art is inline SVG.

`scripts/check.mjs` fails the build on any `http://` reference or external script/style/font host.
Keep it that way — the strict CSP in `static/_headers` depends on it.
