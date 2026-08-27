# Who buys The Reel Deal Deck — research, and what it means for the design

Owner: Agent 1 (research & design system). Written 26 Aug 2026.

Everything below is sourced. Where a number does not exist in public data, this
document says so and reasons from what is available rather than inventing one.
Source quality is graded inline: **[primary]** = the organisation that collected
the data, **[trade]** = industry press reporting it, **[weak]** = vendor or agency
marketing content, useful as a directional signal only.

---

## 1. Who actually buys this

### The angler population is smaller than people assume, and it is not growing

- Fly fishing was **7.9 million US participants in 2025**, down slightly year over
  year, on a national participation rate of **3%** — but still roughly 2 million
  more fly anglers than a decade ago. **[trade/primary]**
  ([2026 Special Report on Fishing, ASA/Outdoor Foundation/RBFF](https://asafishing.org/press-release/2026-special-report-on-fishing/);
  [PDF](https://asafishing.org/wp-content/uploads/2026/07/2026-Special-Report-on-Fishing_WEB_FV.pdf))
- The prior year's edition put fly fishing at **8 million**, with a **69/31
  male/female** split, the **largest single age bracket at 25–34**, **~35% of fly
  anglers in $100k+ households**, and **39% of all US fly anglers in the South**.
  **[trade summarising primary]**
  ([2025 Special Report summary](http://www.laflyfish.com/2025/07/2025-rbff-report-fly-fishing-holding.html);
  [2025 Special Report PDF](https://www.takemefishing.org/getmedia/a57d8109-fec7-48eb-8b19-47b193e0fb18/2025SpecialReport.pdf))

Read that as a design constraint, not a market size. 7.9M people, skewing male,
skewing 25–34, skewing affluent, spread nationally with a Southern tilt. Idaho is
not where most of them are. Nothing on this site should assume the reader is local.

### The non-angler gift buyer is a larger and easier pool than the angler

There is no public dataset that splits "$20–30 fly-fishing gift" purchases into
self-purchase versus gift-purchase. **I could not find one and did not invent one.**
What can be established:

- **Father's Day is a $27.9bn US event; 77% of consumers participate; average
  spend is $226.58.** Fathers/stepfathers are the recipient for 45%, husbands 25%.
  **[primary]** ([NRF / Prosper, 2026 survey, n=7,914](https://nrf.com/media-center/press-releases/father-s-day-spending-to-hit-record-27-9-billion))
- Crucially, when NRF asks *what shoppers are looking for*, the top answers are
  **"something unique or different" (44%)** and **a gift that "creates a special
  memory" (34%)**. Not "useful". Not "cheap". **[primary]**
- The categories that actually get bought are dominated by low-risk, low-knowledge
  items: greeting cards 60%, clothing 58%, an outing 55%, gift cards 52%. **[primary]**

That last line is the whole opportunity. Gift cards at 52% is a confession: half
of buyers do not know what to get. A $24 object that is obviously beautiful and
requires zero knowledge of the recipient's gear is competing against a gift card,
not against a fly rod.

### The brick tier is evidence, and it holds up

The internal Kickstarter observation — the 12-deck brick converting at close to
the single deck's rate — is consistent with two independent facts:

- A "brick" of 12 is a **standard, well-understood SKU in the custom playing-card
  world**, and bulk tiers are a known draw for people who go through decks and for
  people who redistribute them. **[weak — crowdfunding agency content]**
  ([PledgeBox: Kickstarter playing cards](https://www.pledgebox.com/post/playing-cards-kickstarter))
- Kickstarter's own aggregate is that **~75% of all pledges are $50 or less and
  ~90% are $100 or less**, average pledge ~$71 **[trade citing Kickstarter's
  published stats — Kickstarter's own stats page returns 403 to automated fetch,
  so this is second-hand and should be treated as approximate]**
  ([Kickstarter statistics roundup](https://expandedramblings.com/index.php/kickstarter-statistics/))

If ~90% of pledges platform-wide are ≤$100 and a ~$99 brick nonetheless converts
near the single deck, that tier is over-performing relative to platform base rates.
The plausible reasons are gifting and redistribution: one buyer, many recipients —
a fly shop, a guide, a lodge, a father buying for his club, a company buying for
clients. **I cannot prove the motive from public data.** What I can say is that the
site should make the multi-unit path visible instead of burying it in `/wholesale/`,
because the person buying twelve is not necessarily a business.

**Honest gap:** we have no first-party data on *who* the brick backers were. If the
Kickstarter survey can ask one question, it should be "who is this for?".

---

## 2. What each buyer responds to

### The gift buyer needs to not look stupid

The strongest single piece of evidence is an editorial one. *Outdoor Life* runs a
fishing gift guide explicitly written **"for shoppers who know nothing about
fishing"**, and its structure is a list of things **not** to buy — rods, reels and
tackle storage — because they are personal, task-specific, and the buyer cannot
know what the recipient already owns. The guide's own framing is that most safe
suggestions read to an uninformed shopper "like the equivalent of giving someone
socks". **[primary — editorial]**
([Outdoor Life fishing gift guide](https://www.outdoorlife.com/gear/fishing-gift-guide/))

That is the entire gift-buyer psychology in one artifact: **fear of buying the wrong
thing, competing with fear of buying a boring thing.** A hand-drawn 54-card deck
resolves both — it cannot be the wrong size, the wrong weight, or a duplicate of
something in the recipient's vest, and it does not look like socks.

Two supporting behaviours:

- **Only 43% of consumers say they would buy a product with zero ratings or
  reviews**, and confidence rises with review volume for 39%. **[weak — vendor
  survey, but directionally consistent across years]**
  ([Bazaarvoice, 2025](https://www.bazaarvoice.com/blog/why-customer-testimonials-and-peer-reviews-are-key-to-shopper-trust-in-2025/))
  This site has no reviews and must not fake any. The substitute for reviews is
  **verifiable manufacturing fact** — USPCC, Bicycle stock, Air-Cushion finish,
  FSC paper, made in the USA. Those are checkable claims that do the same job.
- Real founder identity and non-stock imagery are consistently reported as the
  highest-trust elements of a small brand's About page, and stock photography of
  staged teams as the fastest way to look fake. **[weak — agency/marketing
  content, no controlled study found]**
  ([Shopify: About Us pages](https://www.shopify.com/blog/how-to-write-an-about-us-page))
  I would not cite a number from this material. The directional claim is safe and
  it matches what the README already bans.

### The angler needs the accuracy to survive a second glance

Anglers are a specialist audience with strong priors. The README is already right
that claiming "nobody makes fly-fishing flashcards" is disprovable in one search.
The credibility surface here is the **Fly Library**: 54 pages of correct hook
sizes, correct imitation notes, correct categories. An angler who checks two flies
and finds them right will trust the deck. One that is wrong costs more than the
other fifty-three earn.

The corollary for design: **the fly pages must not be decorated.** Precision is the
persuasion. Warmth on those pages is a liability.

---

## 3. Family / heritage brands in the outdoor space

The useful case study is **Dette Flies** (Roscoe/Livingston Manor, NY), founded
1928 and generally described as the oldest family-run fly shop in the world, now
run by the founders' daughter and great-grandson. **[trade]**
([The River Reporter](https://www.riverreporter.com/stories/preserving-and-reinventing-tradition,18148);
[Dette Flies about page](https://detteflies.com/pages/about-us))

What their web presentation actually does:

- **Leads with a checkable fact, not a feeling** — "Established in 1928 … now in
  our 98th year." A date is not sentiment; it is a claim you could disprove.
- **Names the people and the relationship.** Walt and Winnie, their daughter Mary,
  her grandson Joe. No "our family has always believed…".
- **Proves craft with operations, not adjectives** — flies tied in house, named
  domestic partners, a stated inventory standard.
- **Plain product photography and archive material** (the 1928 catalogue) rather
  than staged lifestyle shots.

The pattern that reads as genuine: **specific, dated, named, checkable, and
under-stated.** The pattern that reads as staged: unnamed "family", undated
"generations", lifestyle photography, and adjectives doing the work that facts
should do.

Applied here: Ken and Audrey, father and daughter, Eagle Idaho, multigenerational
Idaho farmers, and their own printed words from the info card. That is already the
Dette formula. It does not need warming up — it needs to be *shown*, in their
voice, with nothing added. `data/site.json` already flags the one place where a
specific claim is unconfirmed ("multigenerational" vs "5th-generation"); that
caution is exactly right and should stay.

---

## 4. Seasonality

Three distinct clocks, and they matter more than the campaign end date:

1. **Editorial clock (earliest).** Holiday gift-guide pitching for national print
   effectively closes in **July–August**; online gift guides are pitched **late
   August through early October**. Print lead times of 3–6 months are normal.
   **[weak — PR agency consensus, but multiple independent agencies agree]**
   ([Wolf Craft](https://wolf-craft.com/blog/holiday-gift-guide-pitching-how-to);
   [Emerge](https://emergetheagency.com/tips-trends/resource-guide-pitching-your-product-to-press-for-holiday-gift-guides))
   Concretely: *Fly Fisherman* published its 2025 holiday gift guide on
   **3 November**, spanning **$20–$595**, with the sub-$30 band explicitly framed
   as "stocking stuffer". **[primary — the artifact itself]**
   ([Fly Fisherman 2025 Holiday Gift Guide](https://www.flyfisherman.com/editorial/holiday-gift-guide/537822))
   **$24 lands squarely in that band.** That is the slot this product wins.
2. **Consumer clock.** **42% of US holiday shoppers browse and buy before
   November**, mainly to spread budget (54%) and avoid last-minute stress (41%),
   though **60% still finish in December**. **[primary]**
   ([NRF winter holiday data](https://nrf.com/research-insights/holiday-data-and-trends/winter-holidays))
3. **Father's Day clock.** Mid-June, and it is the single best-matched occasion
   for this product — 45% of Father's Day gifts go to a father or stepfather, and
   the deck is a father-and-daughter product. **[primary]** (NRF, above)

**Gap:** I could not obtain Google Trends data for "fly fishing gifts" through
these tools and will not guess a curve. The defensible statement is that gift
*guides* are written Jul–Oct and published Nov, and consumer buying splits
roughly 40/60 across pre-November and December.

**Campaign timing note, unflattering but true:** the Kickstarter ends
**19 September 2026** — before the gift-guide publication window and well before
consumer buying. Crowdfunding advice consistently rates late-November/December as
a poor launch window, but that is about *launching*, not about *shipping into
Christmas*. **[weak]** ([Stonemaier: seasonal timing](https://stonemaiergames.com/kickstarter-lesson-109-seasonal-timing/))
The implication for the site is that **the email list is the asset**, because the
demand peak arrives two to three months after the campaign closes. The site must
be excellent at capturing a non-angler who arrives in November and finds a closed
campaign — which the date-aware `campaignState()` already handles.

---

## 5. Design conclusions for this site

Each one is tied to a finding above.

1. **Lead with the object, not the story.**
   *Why:* the gift buyer's dominant fear is buying a dud (Outdoor Life), and
   44% want "something unique or different" (NRF). Both are answered by seeing
   the actual printed card faces immediately. The homepage's first screen must
   show real card artwork, at a size where the hand-drawing is legible.

2. **Put the family in the first screen, but as a caption, not a chapter.**
   *Why:* Dette's pattern — named, specific, understated. A one-line attribution
   ("Ken and Audrey, a father-daughter team, Eagle, Idaho") near the product
   converts anonymity into a maker. A long story above the fold does not.

3. **Warmth belongs to the chrome and the connective tissue; restraint belongs to
   the data.** Concretely: warmth in the hero, the story blocks, the founder
   quote, the footer, the section rules. Restraint on the fly pages, the spec
   tables, the wholesale tables. *Why:* the angler audience is persuaded by
   accuracy (§2), and decoration on a reference page reads as unserious.

4. **Show manufacturing fact where a review would go.**
   *Why:* only 43% will buy with zero reviews (Bazaarvoice) and we have none and
   must fake none. USPCC, Bicycle stock, Air-Cushion finish, FSC paper, vegetable
   inks, made in USA — these are the trust substitute, and they should be typeset
   as *evidence* (a compact, scannable proof strip), not as body copy.

5. **The multi-deck path needs a visible, non-B2B door.**
   *Why:* the brick converted, and platform pledge distribution says it should not
   have. Some of those buyers are individuals. `/wholesale/` is the wrong-shaped
   door for a person buying twelve gifts. (Not my file — flagged for Agent 3 and
   for the brief owner.)

6. **What a non-angler needs in the first screen that an angler does not:**
   - **Price.** $24 reads as thoughtful; ambiguity reads as risky.
   - **"It is a real, printed object"** — USPCC / Bicycle stock, poker size.
   - **A reason it is not a novelty** — "hand-drawn playing cards that teach
     while you play" does this in eight words and is the family's own line.
   - **Who made it.** Two names.
   The angler needs none of that above the fold. He needs one thing: to see a
   card face and judge the drawing. Both audiences are served by the same asset —
   the artwork — which is why the artwork leads and the copy supports.

7. **Seasonality implication for the design system:** the site will be read in
   November by people arriving from a gift guide, on a phone, cold, with no brand
   knowledge, after the campaign has closed. The mobile first screen and the
   date-aware CTA are the two highest-value surfaces on the site. Everything in
   the responsive contract (§ Responsive requirements in the brief) is therefore
   a commercial requirement, not a hygiene one.

---

## What is not proven here

- No first-party data on brick-tier buyer identity or motive.
- No public split of self-purchase vs gift-purchase for sub-$30 fly-fishing goods.
- No Google Trends curve for gift-intent keywords in this niche.
- Founder-photo and About-page trust claims rest on marketing content, not on
  controlled research. Treated as directional only.
