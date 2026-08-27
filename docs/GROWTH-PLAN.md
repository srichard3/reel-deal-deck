# Growth plan — the Reunly playbook, applied honestly

An audit of this site against `reunly-playbook.md`, and a sequenced path forward.

**Compiled:** 27 August 2026 · **Method:** direct inspection of the built site

---

## 1. Where we already stand

The audit is more encouraging than the page count suggests. The hardest phase is done.

| Playbook phase | Status | Evidence |
|---|---|---|
| **1 · Technical foundation** | **Strong** | sitemap, canonicals, OG/Twitter, `FAQPage` on 80 pages, `HowTo` on 6, plain crawlable HTML, no JS gate, no login |
| **2 · Mine the question graph** | **Done** | 6 categories — technique 9, gear 4, seasons 3, knots 2, practical 2, basics 2. The playbook wants 6–8. |
| **3 · Answer-shaped format** | **Strong** | **55/55 fly pages and 22/23 guides** carry a 40–60 word answer-first block before any prose |
| **4 · Programmatic, genuinely specific** | **Missing** | 0 location pages |
| **5 · Free tools** | **Missing** | 0 |
| **6 · Comparison pages** | **Missing** | 0 |
| **7 · Entity legibility** | **Weak** | no `/about/`, no `/press/`, **3 different Organization descriptions** in schema |
| **8 · Track citations** | **Not started** | not indexed yet, so nothing to track |

**Inventory:** 89 indexable pages — 55 fly, 23 guides, 11 brand. Reunly has ~400+.

Phase 3 is the phase most sites never get right, and it is the one we have. The
answer-first block, FAQ schema generated from visible content, and per-question
URLs are exactly the shape the playbook describes. That is real ground.

---

## 2. The blocker that makes everything else moot

**The site is `noindex` on a staging URL and `reeldealdeck.com` is not pointed at it.**

Nothing in this document compounds until that changes. Not one of the 89 pages
can be crawled, ranked, cited by an AI, or tracked. Publishing 400 more pages
behind a `noindex` tag produces exactly zero.

This was the right call while the site was unfinished — but it is now the single
highest-value action available, and it is worth more than any volume of content.

---

## 3. Where the playbook does *not* transfer

The playbook is a teardown of a SaaS business. Copying it wholesale would be a mistake.

| | Reunly | The Reel Deal Deck |
|---|---|---|
| Product | Software, $39–99/event | Physical deck, **$19.99 one-time** |
| Contribution per sale | Near-pure margin | Perhaps $6–8 after COGS, shipping, fees |
| Supply | Unlimited | A finite print run |
| Buyer intent at point of search | **Urgent** — "I have to plan a reunion" | **Idle** — "what does a Pheasant Tail imitate" |

Three consequences worth being blunt about:

1. **Our content sits further from the purchase.** Someone planning a reunion needs
   planning software. Someone identifying a fly does not need playing cards. Our
   traffic will be larger and convert far worse. That is not a reason to skip it —
   it *is* a reason not to model the return on Reunly's.
2. **550 pages does not pay for itself at $19.99.** Reunly's build cost is amortised
   over unlimited high-margin sales. Ours is amortised over a print run.
3. **Volume is not the lever here.** We should take the phases with the best
   effort-to-return ratio and deliberately decline the ones that only make sense
   for software.

**The reframe that makes it worth doing anyway:** the content asset is not only a
sales channel for Volume 1. It is the audience for Volume 2, the credibility that
makes a fly shop take a wholesale call, and a durable asset in its own right. Judge
it on that, not on decks-per-visitor.

---

## 4. What to do, in order

### Tier 1 — Become eligible *(do this before anything else)*

Small, and worth more than every other tier combined.

1. Point `reeldealdeck.com` at the site. Drop `BASE_PATH`, set `SITE_URL`, add a `CNAME`.
2. Remove `NOINDEX`. Verify no `noindex` survives anywhere.
3. Verify Search Console + Bing Webmaster; submit `sitemap.xml`.
4. Make AI crawler policy explicit in `robots.txt`. The snippet is already written
   and sitting unused in `docs/AEO.md` — it names GPTBot, ClaudeBot, PerplexityBot,
   Google-Extended, CCBot and others. Currently the wildcard permits them by
   silence; the playbook's point is that being explicit is a decision, not an accident.

### Tier 2 — Entity legibility *(cheap, disproportionate AI leverage)*

The playbook is explicit that a **coherent, repeated identity** is what lets a
language model resolve a brand into a confident entity. We currently ship **three
different Organization descriptions** and at least three different one-line brand
descriptions. That is the opposite of the requirement, and it is a day's work to fix.

5. One canonical brand paragraph in `site.json`, used verbatim in every
   `Organization` block, `llms.txt`, `/about/`, and `/press/`.
6. Build `/about/` — what it is, what it costs, who it is for, who makes it.
7. Build `/press/` — the same facts in a form a journalist or a model can lift,
   plus the artwork and the founders' own words from the info card.

### Tier 3 — The location play *(the biggest genuine opportunity)*

This is where fly fishing fits the playbook **better** than reunions do. Fly fishing
is intensely regional: seasons, hatches, species, licence rules and signature rivers
all vary by state. `/fly-fishing-in-[state]/` is a real, defensible 50-page tier.

**But Phase 4's warning applies with full force.** If the only difference between
pages is a find-and-replace on the state name, it reads as thin and gets suppressed.
Each page must carry: signature species, the state's actual licence page, a genuine
hatch calendar, named notable waters, and season/temperature specifics — cross-linked
into the existing fly pages and guides.

Budget real research time per page, or **do not do this tier at all.**

### Tier 4 — Tools *(we already own the data)*

Every one of these is buildable from `data/flies.json` and existing guide content,
which is unusual and makes the effort-to-value ratio excellent:

| Tool | Built from |
|---|---|
| Tippet ↔ fly size calculator | the rule of 3, already written up |
| Hatch calendar by month + region | `seasons` on all 55 flies |
| "What should I tie on?" picker | `type`, `seasons`, `waters`, `targetSpecies` |
| Leader/tippet formula builder | the leader guide |

These capture bottom-funnel searches a guide cannot ("tippet size chart"), and they
are the most naturally linkable thing on the site.

### Tier 5 — Comparisons *(smallest, do last)*

Lower volume here than for software, and it needs care: a fair, specific comparison
builds trust, a takedown does not. The honest framing is not deck-versus-deck but
**"a card deck vs a hatch chart app vs a fly box sticker"** — the alternatives people
actually weigh.

---

## 5. What I would *not* do

- **Chase 400 pages.** The number is an artefact of Reunly's economics, not a target.
  Roughly 150–200 genuinely specific pages is the right ceiling here.
- **Programmatic pages per fly shop, river or city.** Too many, too thin, and we
  cannot research them honestly at that volume. State-level is the right granularity.
- **A press push before Tier 1 and 2.** A wire release pointing at a `noindex`
  staging URL with three different brand descriptions wastes the one press moment
  the playbook says to spend carefully.

---

## 6. Execution as agent work packages

Each package below is self-contained, has disjoint file ownership, and ends in a
verifiable state. Tiers must run in order; packages inside a tier can run in parallel.

| # | Package | Owns | Verification |
|---|---|---|---|
| **A** | Domain cutover + indexability | `build.mjs` env, `static/CNAME`, `robots.txt`, workflow | live domain resolves, zero `noindex`, sitemap submitted |
| **B** | Entity consistency + `/about/` + `/press/` | `site.json` brand block, `about.mjs`, `press.mjs`, `llms.txt` | exactly **one** Organization description sitewide |
| **C** | State pages — research | `data/states.json` | 50 states, each with cited licence URL, species, hatch window |
| **D** | State pages — template + build | `templates/state.mjs`, `pages/states.mjs`, `styles/state.css` | 50 routes, 0 check errors, each links ≥4 flies + ≥2 guides |
| **E** | Tools | `pages/tools/*.mjs`, `js/tools.js` | works with JS off or degrades honestly; no invented data |
| **F** | Comparison page | `pages/compare.mjs` | no competitor named unfairly; every claim checkable |

**Non-negotiables for every package** — these are the rules that have already caught
real problems in this codebase:

- `npm run build && npm run check` → **0 errors**, in both root and base-path modes
- No invented facts. Anything unverifiable ships as `TODO-CONFIRM`, never as filler
- Schema generated from **visible** content only
- Answer-first block on any new answer-shaped page
- New sections must be reachable from the homepage — the checker now enforces this

**Package C is the risk.** Fifty states of genuinely researched content is the one
place this plan can produce the thin, templated pages the playbook warns about. It
should be gated: research and ship **five** states first, review them honestly for
specificity, and only then authorise the remaining forty-five.

---

## 7. Sequencing

```
Tier 1  ──►  Tier 2  ──►  Tier 3 (gate after 5 states)  ──►  Tier 4  ──►  Tier 5
 A            B             C ──► D                            E           F
 days         days          weeks                              days        day
```

Tier 1 alone changes the site from invisible to eligible. Everything after it is
compounding — and the playbook is explicit that compounding takes months, not weeks.
