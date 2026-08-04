# Content plan — The Reel Deal Deck blog

Owner: content. Scope: `src/content/blog/*.mjs` only. Governed by `docs/BLOG-CONTRACT.md`.

---

## 1. Method, and an honesty note about numbers

**There are no measured search volumes in this document, and there must never be any.** We do not have
a paid keyword tool. Any figure of the form "8,100 searches/month" that appears in an SEO plan without
a tool behind it is fabricated, and fabricated numbers get planned against for years. So this backlog
ranks **relative demand** and **winnability**, both stated as judgements with the evidence that
produced them.

How the picture was assembled:

- **Query phrasing** — the natural-language shapes anglers actually type, taken from the way the same
  questions are titled across forum threads, publisher headlines and Q&A pages. Where several
  phrasings compete ("what weight fly rod for trout" vs "best fly rod weight for trout"), the article
  targets the question form, because that is what both People Also Ask and AI answer engines consume.
- **Community recurrence** — questions that repeat endlessly on r/flyfishing, The Fly Fishing Forum
  and equivalent boards are, by definition, questions the existing top results are failing to settle.
  Beginner setup cost, leader vs tippet, rod weight, and "which knot" threads recur constantly and
  never converge, which is a demand signal and a quality-gap signal at once.
- **Incumbent coverage audit** — who currently owns each query and how good their page is. Orvis,
  MidCurrent, Gink and Gasoline, Troutbitten, Hatch Magazine and Field & Stream hold the broad heads.
  Their weak spots are consistent: broad "how to fly fish" pillars that answer nothing specific,
  gear posts written as buying funnels, and near-zero extractable structure — long prose with no
  tables, no numbered steps, and no direct answer in the first hundred words.
- **The AEO gap** — this is our actual opening. Most incumbent pages are written for 2015 SEO: keyword
  headings, a slow intro, an affiliate list. Very few open with a 40–60 word answer, question-shaped
  `<h2>`s, and a comparison table. That is a structural advantage a new site can take without
  out-ranking anybody on domain authority, because an answer engine picks the most quotable passage,
  not the most authoritative domain.

**Winnability, stated plainly.** A site with one commit cannot take "how to fly fish". It can take
"how far above the fly does a strike indicator go", because that is a specific question with a
specific numeric answer, and the pages currently answering it bury the number in paragraph nine.
Every entry below carries a winnability judgement on that basis.

Sources consulted while building this plan are listed in section 6.

---

## 2. The backlog — 36 articles, ranked

Ranking is by (relative demand × winnability × bridge value). "Bridge" = how naturally the article
reaches a product that teaches 54 fly patterns.

| # | Target question | Class | Winnability | Fly Library links |
|---|---|---|---|---|
| 1 | What weight fly rod do I need for trout? | gear | **High.** Enormous demand, but almost every incumbent answer is a rod-buying page. A neutral table of weights → water types with no product to sell out-answers them. | woolly-bugger, adams, clouser-deep-minnow |
| 2 | What is the difference between leader and tippet? | gear | **High.** The single most repeated beginner confusion. Incumbents explain taper physics; nobody just gives the X-size-to-fly-size table first. | adams, zebra-midge, pheasant-tail-nymph |
| 3 | How do I set up a fly rod for the first time? | basics | **High.** Purely procedural, so numbered steps win outright. Most existing coverage is video, which AI engines cannot quote. | woolly-bugger, parachute-adams |
| 4 | Which fly fishing knots do I actually need? | knots | **High.** Existing pages list 12 knots. The winning answer is "four, and here they are". Strong AI-citation shape. | copper-john, elk-hair-caddis |
| 5 | Dry fly or nymph — which should I fish? | technique | **High.** Decision question, table-shaped, and the honest answer (nymph most days) is stated hesitantly elsewhere. | parachute-adams, pheasant-tail-nymph, woolly-bugger |
| 6 | How do I read water and find trout? | technique | **Medium-high.** Gink and Gasoline own a good version. Winnable by being structural: named water types, each self-contained, each with what to fish. | elk-hair-caddis, pats-rubber-legs |
| 7 | What flies do I actually need to start? | basics | **High.** Perfect bridge. Must be a *selection strategy* page (sizes, categories, how many), never a pattern explainer — patterns live in /flies/. | adams, pheasant-tail-nymph, elk-hair-caddis, woolly-bugger, zebra-midge |
| 8 | Do I need a fishing licence to fly fish? | practical | **High.** High intent, low competition from anglers (state agencies rank, but they answer per-state). Our win is the national framing + "check your state" done properly. | — (none; regulatory) |
| 9 | How do I set up a strike-indicator nymph rig? | technique | **High.** Specific numeric answers (indicator at 1.5–2× depth, shot 12–18in above the point fly) that incumbents bury. | pheasant-tail-nymph, zebra-midge, perdigon |
| 10 | What is the best time of day to fly fish? | seasons | **Medium-high.** Heavily covered, but almost always seasonally vague. Winnable with a season × time-of-day table plus water temperature bands. | zebra-midge, blue-winged-olive |
| 11 | How much does it cost to start fly fishing? | practical | Medium. Demand is huge; competition is affiliate-driven. Winnable only if we publish honest ranges with sources and refuse to recommend products. |chernobyl-ant |
| 12 | How do I stop my fly line from dragging? (mending) | technique | High. Narrow, mechanical, under-served. Drag is the #1 unexplained reason beginners get refusals. | parachute-adams, blue-winged-olive |
| 13 | 4wt vs 5wt vs 6wt — which do I buy? | gear | High. Pure comparison, table-shaped, distinct enough from #1 not to cannibalise it (#1 = "what weight", #13 = "which of these three"). | griffiths-gnat, woolly-bugger |
| 14 | What size tippet for what size fly? | gear | High. A single table answers it. Currently answered inconsistently everywhere. | zebra-midge, chubby-chernobyl |
| 15 | How do I set the hook on a trout? | technique | High. Dry vs nymph vs streamer hooksets are genuinely different and rarely tabled together. | elk-hair-caddis, woolly-bugger |
| 16 | Floating vs sinking vs sink-tip line | gear | Medium-high. Comparison shape; incumbents are manufacturer pages. | clouser-deep-minnow, balanced-leech |
| 17 | Do I need waders to fly fish? | gear | High. Cheap-to-answer, high beginner anxiety, wet-wading is under-covered. | — |
| 18 | What is "matching the hatch" and do I have to? | basics | Medium-high. Must stay conceptual — the moment it becomes "here are the mayfly patterns" it collides with /flies/. | blue-winged-olive, pale-morning-dun, adams |
| 19 | How do I fly fish in winter? | seasons | High. Seasonal, low competition outside December–February, evergreen ranking window. | zebra-midge, chironomid-pupa, san-juan-worm |
| 20 | Can you fly fish in the rain / high water? | seasons | High. Conditions questions are long-tail and under-served. | pats-rubber-legs, egg-sucking-leech |
| 21 | How do I fish a hopper-dropper rig? | technique | High. Named rig, specific measurements, summer-seasonal. | chubby-chernobyl, daves-hopper, copper-john |
| 22 | What is euro nymphing and do I need it? | technique | Medium. Competitive (Troutbitten owns it) but the *"do I need it"* framing is open. | perdigon, frenchie |
| 23 | How do I release a trout without killing it? | practical | High. Genuine authority play; must cite agencies, never invent mortality figures. | — |
| 24 | What water temperature is too warm to fish? | seasons | High. Conservation-adjacent, specific numbers, rising search interest each summer. | — |
| 25 | How do I fly fish a lake from shore? | technique | High. Stillwater is badly under-covered relative to rivers. | balanced-leech, damselfly-nymph, chironomid-pupa |
| 26 | How long should my leader be? | gear | Medium-high. Narrow enough to win; pairs with #2 and #14. | griffiths-gnat, clouser-deep-minnow |
| 27 | Why do trout keep refusing my fly? | technique | High. Diagnostic-shaped ("if X then Y") which is highly extractable and rarely written. | parachute-adams, comparadun, rusty-spinner |
| 28 | How do I fly fish small streams? | technique | High. Specific, low competition, distinct gear answers (short rod, short leader). | royal-wulff, humpy, foam-beetle |
| 29 | Barbless hooks — required, or just better? | practical | Medium-high. Regulatory + practical, must be state-caveated. | — |
| 30 | How do I false cast without tangling? | technique | Medium. Casting is video-dominated; text wins only on specific faults. | — |
| 31 | Streamer fishing for beginners — where to start | technique | Medium-high. Streamer content skews expert; a beginner entry is open. | woolly-bugger, muddler-minnow, zonker |
| 32 | What do I do with a wind knot? | knots | High. Tiny long-tail, near-zero competition, real recurring problem. | — |
| 33 | Fly fishing vs spin fishing — which should I learn? | basics | Medium. High demand, generic incumbents; winnable with an honest table. | — |
| 34 | How do I fish a two-fly rig legally and safely? | practical | Medium-high. Two-fly legality genuinely varies by state — strong caveat article. | copper-john, zebra-midge |
| 35 | What should go in a fly fishing first-day checklist? | basics | High. Checklist shape, very quotable, natural top-of-funnel. | adams, woolly-bugger |
| 36 | How do I fish a spring runoff river? | seasons | High. Sharp seasonal window (Apr–Jun in the Mountain West), thin coverage. | pats-rubber-legs, san-juan-worm, egg-pattern |

---

## 3. Priority tier — the first ten, and why

Published in this order. The logic: **the first ten must cover the entire beginner decision path**
(what to buy → how to rig it → what to tie on → where to cast it → what the law says), because that
makes them mutually reinforcing internal links rather than ten unrelated pages. A new site with ten
tightly cross-linked pages on one topic cluster looks like a resource; ten scattered pages look like
a content farm.

| Order | Slug | Why it is first |
|---|---|---|
| 1 | `what-weight-fly-rod-for-trout` | Highest-intent gear question in the sport, and the honest table-first answer beats a buying funnel. Anchors the gear cluster. |
| 2 | `leader-vs-tippet` | The most-repeated confusion in fly fishing. Whoever explains it in one screen owns it. Feeds 1, 3, 4. |
| 3 | `how-to-set-up-a-fly-rod` | Purely procedural → `b.steps()` → highly quotable. Nothing to fabricate, nothing to caveat. |
| 4 | `best-fly-fishing-knots` | Reduces a crowded field ("15 essential knots!") to four. Reduction is a defensible editorial position and a quotable one. |
| 5 | `dry-fly-vs-nymph` | The first real technique decision, comparison-shaped, and the natural doorway into the Fly Library's dry/nymph split. |
| 6 | `how-to-read-water-fly-fishing` | Converts a buyer into a reader. This is the article that makes the site feel like it knows something. |
| 7 | `what-flies-do-i-need-to-start` | The strongest product bridge on the whole list — and the one most at risk of cannibalising /flies/, so it is written as selection strategy only. |
| 8 | `do-i-need-a-fishing-license` | Highest pure intent on the list, and an authority signal: we cite agencies and refuse to give a national answer. |
| 9 | `nymph-rig-setup` | Specific numbers competitors bury. Best single AI-citation candidate in the backlog. |
| 10 | `best-time-of-day-to-fly-fish` | Broad top-of-funnel, seasonal re-entry every year, and links outward to everything above. |

Articles 1–8 ship at launch (see section 7). 9 and 10 follow in week two.

---

## 4. Cannibalisation map — reserved for `/flies/`

The blog must **never** publish an article matching these query shapes. Each one is already owned by
a Fly Library page at `/flies/<slug>/`, and a second page targeting it costs us both.

**Reserved — do not write:**

- `what is a <pattern>` / `what is the <pattern> fly`
- `what does a <pattern> imitate`
- `how to fish a <pattern>`
- `what size <pattern>` / `<pattern> sizes`
- `when to fish a <pattern>` / `best time for <pattern>`
- `how to tie a <pattern>` (dressing, materials, recipe)
- `<pattern> vs <pattern>` where both are named patterns (e.g. Adams vs Parachute Adams)
- `best <pattern> colours/variants`
- any article whose `<h1>` contains a pattern name from `data/flies.json`

**Permitted, and the distinction that keeps it clean:**

| Blog may write | Because it is about | Not |
|---|---|---|
| "What flies do I need to start?" | how many, what sizes, what categories | what any one pattern is |
| "Dry fly vs nymph" | two *methods* | two *patterns* |
| "How do I fish a hopper-dropper rig?" | a *rig*, patterns named only as links | a hopper pattern |
| "What is matching the hatch?" | the *concept* and how to observe | which mayfly pattern to use |

**The mechanical rule:** when an article needs a pattern, it names it once and links it with
`b.flyLink('slug')`. It never states what the pattern imitates, its size range, or its dressing —
that text exists on the Fly Library page and duplicating it splits the query.

---

## 5. 90-day publishing cadence

Two posts a week, Tuesday and Thursday. That is a pace one person can hold, and holding it matters
more than the number — an abandoned blog is a negative quality signal.

| Window | Output | Focus |
|---|---|---|
| **Days 1–7 (launch)** | 8 articles, published together | Priority tier 1–8. A blog that launches with eight cross-linked pages reads as a resource; one that launches with two reads as an experiment. |
| **Days 8–30** | 6 articles (2/wk) | Tier 9–10, then #12 mending, #13 4wt-vs-5wt, #14 tippet sizing, #17 waders. Completes the gear + rigging cluster. |
| **Days 31–60** | 8 articles (2/wk) | Technique depth: #15 hooksets, #21 hopper-dropper, #27 refusals, #25 stillwater, #28 small streams, #31 streamers, #35 checklist, #23 release. Autumn-timed. |
| **Days 61–90** | 8 articles (2/wk) | Seasonal + practical: #19 winter, #20 rain/high water, #24 water temperature, #29 barbless, #34 two-fly legality, #16 line types, #18 matching the hatch, #33 fly vs spin. Winter pieces land before the winter search window opens. |

**Held back deliberately:** #22 euro nymphing and #30 casting faults sit in the second quarter. Both
are contested by specialists (Troutbitten on the first, video on the second) and are better attempted
once the site has a link profile.

**Refresh, not just publish.** From day 45, one existing article gets re-edited per fortnight —
`updated` set, thin sections expanded, new internal links added. Freshness is a ranking and a
citation input; ten maintained articles outperform thirty stale ones.

**Kickstarter timing.** The campaign closes 19 September 2026. Nothing in the editorial calendar
bends around that date — the CTA component swaps itself (`campaign.endsAt`), and articles must not
reference the campaign in body copy at all. The one concession: the seasonal autumn cluster in days
31–60 lands while the campaign is live, which is when traffic is worth the most.

---

## 6. Sources consulted for this plan

Publisher and community pages used to audit incumbent coverage and query phrasing:

- Orvis News — *Pro Tips: The Only Two Terminal Knots You Really Need* — https://news.orvis.com/fly-fishing/pro-tips-the-only-two-terminal-knots-you-really-need
- Troutbitten — *Use the Davy Knot* — https://troutbitten.com/2017/09/17/fifty-fly-fishing-tips-8-use-the-davy-knot-heres-why/
- Gink and Gasoline — *10 Types Of Water That Always Hold Trout* — https://www.ginkandgasoline.com/fly-fishing-tips-technique/10-types-of-water-that-always-hold-trout/
- Hatch Magazine — *Understanding Leaders and Tippets* — https://www.hatchmag.com/articles/understanding-leaders-and-tippets/7711248
- University of Kentucky — *A Beginner's Guide to Rods, Reels, and Lines (FAQ)* — https://www.uky.edu/~agrdanny/flyfish/newfaq.htm
- The Fly Fishing Forum — *Beginner setup cost?* — https://www.theflyfishingforum.com/threads/beginner-setup-cost.969147/
- Field & Stream — *A Temperature Guide for Trout Fishing* — https://fieldandstream.com/stories/fishing/freshwater-fishing/trout-fishing/temperature-guide-trout-fishing
- Idaho Fish and Game — *Licenses, tags, and permits* — https://idfg.idaho.gov/licenses
- Idaho Fish and Game — *Fishing Seasons and Rules* — https://idfg.idaho.gov/rules/fish
- Virginia DWR — *Catch and Release Best Practices* — https://dwr.virginia.gov/blog/grab-a-big-net-and-keep-your-hands-wet-catch-and-release-best-practices/
- Take Me Fishing (RBFF) — state licence portal — https://www.takemefishing.org/
- Trout Unlimited — https://www.tu.org/

<!-- TODO-CONFIRM: no paid keyword tool was used. If one is ever licensed, re-rank sections 2 and 3
     against measured volume and difficulty, and replace the winnability judgements with data. Do not
     retro-fit numbers to this document from memory or estimation. -->
