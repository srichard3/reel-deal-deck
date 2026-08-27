/**
 * Homepage — The Reel Deal Deck
 *
 * The job of this page is to introduce two things in the first screen and a
 * half: the family who made the deck, and the object itself. Both are quoted
 * or shown rather than described — the copy in `site.voice` is transcribed
 * verbatim from the info card printed inside the deck, and the artwork is the
 * real printed artwork.
 *
 * Note on data: `flies` may legitimately be an empty array (data/flies.json is
 * the Fly Library's source of truth and is populated separately). Every read
 * below is defensive; when there is no data the fly strips simply do not
 * render, and nothing else on the page depends on them.
 */

export const meta = {
  path: '/',
  title: 'Hand-Drawn Fly Fishing Cards',
  description:
    'Hand-drawn playing cards that teach while you play. 54 original fly illustrations on genuine Bicycle stock, made by a father-daughter team in Eagle, Idaho.',
  priority: 1.0,
  changefreq: 'weekly',
  bodyClass: 'page-home',
  jsonld: [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'The Reel Deal Deck',
      url: 'https://reeldealdeck.com/',
      description:
        'A 54-card fly-fishing playing card deck with original hand-drawn flies, printed on genuine Bicycle stock.',
    },
    { '@context': 'https://schema.org', '@type': 'Organization' }, // filled in the render
    {
      '@context': 'https://schema.org',
      '@type': 'ImageObject',
      contentUrl: 'https://reeldealdeck.com/brand/box-front-1200.webp',
      caption:
        'The Reel Deal Deck tuck box: an engraved green case with two rising trout, holding a fan of three hand-drawn fly cards.',
      width: 759,
      height: 1106,
    },
  ],
};

/* ----------------------------------------------------------------- utils -- */

import { flyCard as sharedFlyCard } from '../templates/_shared.mjs';
import { campaignCta, campaignLine, organizationSchema } from '../templates/_blocks.mjs';

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/* ------------------------------------------------------------- sections --- */

function heroPack() {
  /* The printed tuck box. It already carries the logo, the engraved trout and
     a fan of three real cards, so it does the job a CSS sketch used to. */
  return `<figure class="hero-pack">
      <img class="hero-pack__img"
        src="/brand/box-front-600.webp"
        srcset="/brand/box-front-600.webp 600w, /brand/box-front-1200.webp 759w"
        sizes="(min-width: 60rem) 24rem, 70vw"
        width="600" height="874" fetchpriority="high" decoding="async"
        alt="The Reel Deal Deck tuck box: an engraved green case with two trout, holding a fan of three fly cards">
    </figure>`;
}

/** A strip of real printed faces, chosen for variety across suits and types. */
function flyStrip(flies, picks) {
  if (!Array.isArray(flies) || !flies.length) return '';
  const items = picks.map((sl) => flies.find((f) => f.slug === sl)).filter(Boolean);
  const list = items.length === picks.length ? items : flies.slice(0, picks.length);
  if (!list.length) return '';
  return `
      <div class="card-grid fly-strip" style="--gap:var(--s-4)">
        ${list.map((f) => sharedFlyCard(f)).join('\n        ')}
      </div>`;
}

/* ---------------------------------------------------------- match the hatch --
   Rounds for the homepage game. Each insect family maps to the real cards in
   the deck that imitate it, so the game can never offer a fly that is not
   printed. Slugs are validated against data/flies.json — an unknown one is
   dropped rather than shipped as a broken image. */
const HATCH_FLIES = {
  mayfly: ['adams', 'parachute-adams', 'blue-wing-olive', 'pale-morning-dun',
           'green-drake', 'march-brown', 'trico', 'pink-albert', 'rusty-spinner'],
  caddis: ['elk-hair-caddis', 'caddis-pupa'],
  midge: ['zebra-midge', 'griffiths-gnat', 'disco-midge', 'snow-cone-midge',
          'wd-40', 'serendipity'],
  terrestrial: ['grasshopper', 'ant', 'beetle', 'chubby-chernobyl', 'madam-x'],
  stonefly: ['salmonfly', 'yellow-sally', 'pats-rubber-legs'],
};

/* "Terrestrial" rather than "Hopper": the group also holds the ant and the
   beetle, and a label that excluded them would make a correct answer read
   as wrong. */
const HATCH_FAMS = {
  mayfly:      { label: 'Mayfly',      article: 'mayflies' },
  caddis:      { label: 'Caddis',      article: 'caddisflies' },
  midge:       { label: 'Midge',       article: 'midges' },
  terrestrial: { label: 'Terrestrial', article: 'terrestrials — land insects that fall in' },
  stonefly:    { label: 'Stonefly',    article: 'stoneflies' },
};

/* Silhouettes, not illustrations — the shape has to read at a glance, because
   reading the shape at a glance is the actual skill. */
const HATCH_BUGS = {
  mayfly: `<svg viewBox="0 0 40 24"><path d="M18 13 C16 6 19 3 21 2 C22 6 22 10 21 13 Z"/><path d="M21 13 C22 8 25 5 27 4 C27 8 25 11 24 13 Z" opacity=".65"/><ellipse cx="20" cy="15" rx="9" ry="2"/><circle cx="11" cy="14.6" r="2.1"/><path d="M29 15 L38 12 M29 15 L38 17" fill="none" stroke="currentColor" stroke-width="1"/></svg>`,
  caddis: `<svg viewBox="0 0 40 24"><path d="M10 17 L27 6 L32 17 Z"/><ellipse cx="19" cy="17" rx="9" ry="1.8"/><circle cx="10" cy="16" r="2"/><path d="M9 14 L2 10 M9 15 L2 14" fill="none" stroke="currentColor" stroke-width="1"/></svg>`,
  midge: `<svg viewBox="0 0 40 24"><path d="M19 13 C21 9 25 7 28 6 C27 10 24 13 21 14 Z" opacity=".6"/><path d="M19 14 C22 14 26 15 28 17 C24 18 21 17 19 15 Z" opacity=".45"/><ellipse cx="20" cy="14" rx="6" ry="1.2"/><circle cx="14" cy="13.8" r="1.5"/></svg>`,
  terrestrial: `<svg viewBox="0 0 40 24"><ellipse cx="21" cy="13" rx="10" ry="3.2"/><path d="M22 11 L32 10 L24 15 Z" opacity=".6"/><path d="M20 15 L23 22 L31 19" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="11" cy="12.5" r="3"/><path d="M9 10 L3 5" fill="none" stroke="currentColor" stroke-width="1"/></svg>`,
  stonefly: `<svg viewBox="0 0 40 24"><ellipse cx="21" cy="15" rx="11" ry="2.2"/><path d="M12 13 L31 10 L30 14 L13 16 Z" opacity=".6"/><circle cx="9" cy="14" r="2.3"/><path d="M32 15 L38 13 M32 15 L38 18" fill="none" stroke="currentColor" stroke-width="1"/></svg>`,
};

/** Build the game's round data, dropping anything the deck does not contain. */
function hatchData(flies) {
  const byId = new Map(flies.map((x) => [x.slug, x]));
  const out = [];
  const fams = {};
  for (const [fam, slugs] of Object.entries(HATCH_FLIES)) {
    const kept = slugs.filter((sl) => byId.has(sl) && byId.get(sl).cardText);
    if (!kept.length) continue;
    fams[fam] = { ...HATCH_FAMS[fam], bug: HATCH_BUGS[fam] };
    for (const sl of kept) {
      const f = byId.get(sl);
      /* The size range in brackets is printed on the card and reads as noise
         out of context, so it is trimmed from the revealed line. */
      out.push({ slug: sl, name: f.name, img: `/cards/${sl}`, fam,
                 text: String(f.cardText).replace(/\s*\[[^\]]*\]\s*$/, '').trim() });
    }
  }
  const json = JSON.stringify({ flies: out, fams });
  return json.replace(/</g, '\\u003c');   /* never let a "</script>" through */
}

/* ------------------------------------------------------------------ page -- */

export default function homepage({ site, flies, posts }) {
  /* `meta` is module-level, so `site` is not in scope there. build.mjs reads
     meta after this runs, so the canonical entity is patched in here. */
  const orgIdx = meta.jsonld.findIndex((n) => n['@type'] === 'Organization');
  if (orgIdx > -1) meta.jsonld[orgIdx] = { '@context': 'https://schema.org', ...organizationSchema(site, { full: true }) };

  /* Four entry points into the guides, chosen as the widest doors: what to buy,
     what to tie on, how to rig it, and why it is not working. Falls back to the
     newest four if any slug is missing, so the section never renders empty. */
  const p = Array.isArray(posts) ? posts : [];
  const want = ['what-weight-fly-rod-for-trout', 'what-flies-do-i-need-to-start',
                'nymph-rig-setup', 'why-trout-refuse-your-fly'];
  const picked = want.map((sl) => p.find((x) => x.slug === sl)).filter(Boolean);
  const featured = (picked.length === 4 ? picked : p.slice(0, 4)).map((x) => ({
    path: `/blog/${x.slug}/`,
    topic: x.topic,
    title: x.title,
    question: x.question,
    blurb: String(x.description || '').split('. ')[0].replace(/\.$/, '') + '.',
  }));
  const f = Array.isArray(flies) ? flies : [];
  const v = site?.voice ?? {};
  const craft = site?.cardCraft ?? {};
  const count = site?.product?.cardCount ?? 54;
  const partner = site?.conservation?.partner ?? 'Trout Unlimited';
  const partnerUrl = site?.conservation?.partnerUrl ?? 'https://www.tu.org/';
  const city = site?.location?.city ?? 'Eagle';
  const regionName = site?.location?.regionName ?? 'Idaho';
  const shortLine = v.shortLine || 'Hand-drawn playing cards that teach while you play.';

  return `
<section class="hero">
  <div class="wrap hero__grid">
    <div>
      <p class="eyebrow">Ken &amp; Audrey &middot; ${esc(city)}, ${esc(regionName)}</p>
      <h1 class="h1 hero__title">${esc(shortLine)}</h1>
      <p class="lede hero__lede">
        Their words, printed on a card inside the deck. ${esc(count)} flies, every one drawn
        by hand, on genuine Bicycle stock &mdash; so it survives the shuffle as well as the
        streamside.
      </p>
      <div class="cluster hero__actions" style="--gap:var(--s-3)">
        ${campaignCta(site, { variant: 'primary' })}
        <a class="btn btn--ghost btn--lg" href="/cards/">See what&rsquo;s in it</a>
      </div>
      <p class="hero__note">
        Nothing ships from this site. Joining the list costs nothing and holds your place.
      </p>
    </div>
    ${heroPack()}
  </div>
</section>

<section class="proof" aria-label="What is in the box">
  <div class="wrap proof__grid">
    <div class="stat">
      <span class="stat__num">${esc(count)}</span>
      <span class="stat__label">Hand-drawn flies</span>
    </div>
    <div class="stat">
      <span class="stat__num">Bicycle</span>
      <span class="stat__label">Genuine USPCC stock</span>
    </div>
    <div class="stat">
      <span class="stat__num">${esc(partner)}</span>
      <span class="stat__label">A cut of every deck</span>
    </div>
    <div class="stat">
      <span class="stat__num">${esc(regionName)}</span>
      <span class="stat__label">Drawn in ${esc(city)}</span>
    </div>
  </div>
</section>

<section class="section section--sunk" id="makers" aria-labelledby="makers-h">
  <div class="wrap">
    <div class="home-makers">
      <figure class="home-makers__card">
        <img class="card-face__img"
             src="/cards/info-card-400.webp"
             srcset="/cards/info-card-400.webp 400w, /cards/info-card-800.webp 800w"
             sizes="(min-width: 60rem) 17rem, 60vw"
             width="400" height="559" loading="lazy" decoding="async"
             alt="The info card printed inside The Reel Deal Deck, carrying Ken and Audrey's note and the Trout Unlimited Business member mark">
        <figcaption class="figure-note" style="margin-block-start:var(--s-4)">
          Card 56. It is in every deck.
        </figcaption>
      </figure>

      <div>
        <p class="section-num" aria-hidden="true">A&#9829;</p>
        <h2 class="h2" id="makers-h" style="margin-block-start:var(--s-4)">Who made this</h2>
        <blockquote class="home-quote">
          <p>${esc(v.intro || '')}</p>
          <p>${esc(v.why || '')}</p>
          <p class="home-quote__signoff">${esc(v.signoff || '')}</p>
          <cite>Ken and Audrey &mdash; printed on the info card</cite>
        </blockquote>
        <p class="cluster" style="margin-block-start:var(--s-6);--gap:var(--s-3)">
          <a class="btn btn--ghost" href="/story/">Meet Ken and Audrey</a>
          <a class="btn btn--quiet" href="/conservation/">Why catch-and-release</a>
        </p>
      </div>
    </div>
  </div>
</section>

<section class="section" id="in-the-deck" aria-labelledby="deck-h">
  <div class="wrap">
    <div class="section-head section-head--split">
      <div>
        <p class="section-num" aria-hidden="true">2&#9829;</p>
        <h2 class="h2" id="deck-h">What is actually in the deck</h2>
        <p class="lede">
          ${esc(craft.eachCard || 'Every card shows the rank and suit, the fly&rsquo;s name, its category, the hand-drawn fly itself, a plain-English note on what it imitates, and the hook sizes it is usually tied in.')}
        </p>
      </div>
      <p><a class="btn btn--ghost" href="/cards/">Anatomy of a card</a></p>
    </div>
${flyStrip(f, ['adams', 'parachute-adams', 'woolly-bugger', 'grasshopper', 'copper-john', 'san-juan-worm'])}

    <div class="card-grid" style="--min:min(16rem, 100%);margin-block-start:var(--s-7)">
      <div class="point">
        <span class="point__index" aria-hidden="true">A&#9829;</span>
        <h3 class="point__title">Green and brown, not red and black</h3>
        <p class="point__text">
          ${esc(craft.suits || 'Green replaces red on hearts and diamonds; bark brown replaces black on spades and clubs.')}
          <a href="/cards/#suits">See the suits</a>.
        </p>
      </div>
      <div class="point">
        <span class="point__index" aria-hidden="true">&#9733;</span>
        <h3 class="point__title">Three cards with no rank</h3>
        <p class="point__text">
          ${esc(craft.jokers || 'The Egg, the San Juan Worm and the Bass Popper carry a trout-in-a-jester&rsquo;s-cap mark instead.')}
          <a href="/cards/#specials">See the specials</a>.
        </p>
      </div>
      <div class="point">
        <span class="point__index" aria-hidden="true">K&#9824;</span>
        <h3 class="point__title">An engraved back, on all of them</h3>
        <p class="point__text">
          ${esc(craft.backDesign || 'An engraved green border framing two rising trout and an angler on the river.')}
          <a href="/cards/#back">See the back and the box</a>.
        </p>
      </div>
    </div>
  </div>
</section>

<section class="section section--sunk" id="library" aria-labelledby="library-h">
  <div class="wrap">
    <div class="section-head section-head--split">
      <div>
        <p class="section-num" aria-hidden="true">3&#9829;</p>
        <h2 class="h2" id="library-h">Learn the flies. Free, and without the deck.</h2>
        <p class="lede">
          The Fly Library is the whole deck as a reference you can read right now:
          one page per pattern, what it imitates, when it works, and how to fish it.
          No sign-up, no paywall, no e-book funnel.
        </p>
      </div>
      <p><a class="btn btn--ghost" href="/flies/">All ${esc(count)} flies</a></p>
    </div>
${flyStrip(f, ['royal-coachman', 'chubby-chernobyl', 'elk-hair-caddis', 'zebra-midge', 'clouser-minnow', 'green-drake'])}
    <p class="text-muted" style="margin-block-start:var(--s-6)">
      <a href="/flies/">Open the Fly Library</a> &mdash; dries, nymphs, streamers, wets,
      terrestrials and attractors, each one indexed like a card.
    </p>
  </div>
</section>

<section class="section" id="guides" aria-labelledby="guides-h">
  <div class="wrap">
    <div class="section-head section-head--split">
      <div>
        <p class="section-num" aria-hidden="true">4&#9827;</p>
        <h2 class="h2" id="guides-h">And the questions the cards do not answer.</h2>
        <p class="lede">
          Straight answers to what anglers actually ask &mdash; which rod, which tippet,
          how to rig it, why the fish keep refusing. Written to be useful on the bank,
          not to sell you a rod.
        </p>
      </div>
      <p><a class="btn btn--ghost" href="/blog/">All ${esc(posts.length)} guides</a></p>
    </div>

    <div class="card-grid" style="--min:15rem;--gap:var(--s-4)">
      ${featured
        .map(
          (g) => `<a class="card card--link" href="${esc(g.path)}">
        <p class="eyebrow">${esc(g.topic || 'Guide')}</p>
        <p class="card__title">${esc(g.question || g.title)}</p>
        <p class="card__text">${esc(g.blurb)}</p>
      </a>`
        )
        .join('\n      ')}
    </div>

    <p class="text-muted" style="margin-block-start:var(--s-6)">
      <a href="/blog/">Open the guides</a> &mdash; gear, technique, knots, seasons and
      getting started, each one answering a single question.
    </p>
  </div>
</section>

<!-- ============================================================= the game ==
     "Match the hatch" — the deck's own premise as a ten-second toy. One card
     is shown large and you name what it imitates. The card's printed line is
     the answer key, so it is cropped off during the question and revealed
     afterwards as the explanation.

     No-JS: the scene and a card render as a still illustration and the buttons
     never appear (they are injected). Nothing on this page depends on it. -->
<section class="section section--sunk" id="game" aria-labelledby="game-h">
  <div class="wrap">
    <p class="eyebrow">Try it</p>
    <h2 class="h2" id="game-h">Match the hatch</h2>
    <p class="lede hatch__lede">
      Half of fly fishing is working out what the trout are eating and tying on
      something that looks like it. Here is a card from the deck — name what it
      is imitating, and the card will tell you whether you were right.
    </p>

    <div class="hatch" data-hatch>
      <div class="hatch__board">

        <!-- the card in question -->
        <figure class="hatch__card">
          <div class="hatch__crop">
            <img data-hatch-img src="/cards/adams-800.webp" width="572" height="800"
                 alt="The Adams card from the deck" decoding="async">
          </div>
          <figcaption class="hatch__card-name" data-hatch-name>Adams</figcaption>
        </figure>

        <div class="hatch__play">
          <!-- the water -->
          <div class="hatch__scene">
            <svg class="hatch__water" viewBox="0 0 400 150" role="img"
                 aria-label="A trout holding under the surface of a stream.">
              <defs>
                <linearGradient id="hatch-deep" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="var(--c-green)" stop-opacity=".26"/>
                  <stop offset="100%" stop-color="var(--c-green)" stop-opacity=".05"/>
                </linearGradient>
              </defs>
              <rect x="0" y="70" width="400" height="80" fill="url(#hatch-deep)"/>
              <path class="hatch__surface" d="M0 70 H400"/>
              <path class="hatch__seam" d="M0 92 C90 88 150 96 250 91 S360 88 400 93"/>
              <path class="hatch__seam" d="M0 116 C80 112 170 120 260 114 S370 112 400 117"/>

              <ellipse class="hatch__ring" cx="200" cy="70" rx="16" ry="4.5"/>
              <ellipse class="hatch__ring hatch__ring--2" cx="200" cy="70" rx="16" ry="4.5"/>

              <g class="hatch__fish" data-hatch-fish transform="translate(152 100)">
                <path class="hatch__fish-tail" d="M62 17 L82 4 L78 17 L82 30 Z"/>
                <path class="hatch__fish-fin"  d="M40 5 L52 -3 L56 7 Z"/>
                <path class="hatch__fish-fin"  d="M32 24 L38 33 L46 25 Z"/>
                <path class="hatch__fish-body"
                      d="M4 17 C16 4 48 1 66 9 C70 12 70 22 66 25 C48 33 16 30 4 17 Z"/>
                <path class="hatch__fish-line" d="M12 17 C30 14 50 15 64 17"/>
                <circle class="hatch__fish-spot" cx="30" cy="11" r="1.8"/>
                <circle class="hatch__fish-spot" cx="42" cy="14" r="1.6"/>
                <circle class="hatch__fish-spot" cx="36" cy="21" r="1.5"/>
                <circle class="hatch__fish-spot" cx="50" cy="20" r="1.4"/>
                <circle class="hatch__fish-eye" cx="12" cy="15" r="2.4"/>
              </g>
            </svg>
            <!-- the real insect, shown only once the round is over -->
            <div class="hatch__bug" data-hatch-bug aria-hidden="true"></div>
          </div>

          <p class="hatch__status" data-hatch-status role="status">
            Turn on JavaScript to play — or just
            <a href="/flies/">browse all 54 flies</a> instead.
          </p>

          <div class="hatch__choices" data-hatch-choices></div>

          <!-- The explanation. The family is stated plainly because two of the
               twenty-five printed lines never name it ("White bead imitates gas
               bubble"), and then the card is quoted in its own words. -->
          <div class="hatch__reveal" data-hatch-reveal aria-live="polite">
            <p class="hatch__reveal-fam" data-hatch-fam></p>
            <p class="hatch__reveal-quote" data-hatch-quote></p>
          </div>
          <p class="hatch__score" data-hatch-score aria-live="polite"></p>
        </div>
      </div>
    </div>

    <p class="hatch__foot">
      Every card in the deck works like this one — the name, what it imitates
      and how to fish it, printed on the face. There are ${count} of them.
      <a href="/flies/">See the whole library →</a>
    </p>
  </div>
</section>

<section class="section section--dark" aria-labelledby="diff-h">
  <div class="wrap">
    <div class="section-head">
      <p class="section-num" aria-hidden="true">4&#9829;</p>
      <h2 class="h2" id="diff-h">Fly cards exist. This is what we did differently.</h2>
      <p class="lede">
        Three decisions, and all three cost more than the alternative.
      </p>
    </div>

    <div class="card-grid" style="--min:min(16rem, 100%)">
      <div class="point">
        <span class="point__index" aria-hidden="true">1&#9830;</span>
        <h3 class="point__title">The art is drawn, not photographed</h3>
        <p class="point__text">
          Every fly on every card was drawn by hand, specifically for this deck. Line art
          shows a pattern's structure &mdash; the proportions, the hackle, the profile you are
          actually trying to tie or match &mdash; in a way a photograph of one particular fly can't.
        </p>
      </div>
      <div class="point">
        <span class="point__index" aria-hidden="true">2&#9830;</span>
        <h3 class="point__title">Genuine Bicycle stock, not generic card</h3>
        <p class="point__text">
          Printed by ${esc(site?.product?.manufacturer ?? 'The United States Playing Card Company')}
          on real Bicycle stock with the Air-Cushion finish, so the deck actually deals and
          shuffles. ${esc(site?.product?.material ?? 'FSC-certified paper, starch-based glue, vegetable-based inks')}.
          It is a playing card deck first and a reference second.
        </p>
      </div>
      <div class="point">
        <span class="point__index" aria-hidden="true">3&#9830;</span>
        <h3 class="point__title">A contribution to the water</h3>
        <p class="point__text">
          A set amount from every deck goes to <a href="${esc(partnerUrl)}" rel="noopener">${esc(partner)}</a>,
          which does the cold-water habitat work the fish we draw depend on.
          <a href="/conservation/">See exactly how that works</a>.
        </p>
      </div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="who-h">
  <div class="wrap">
    <div class="section-head">
      <p class="section-num" aria-hidden="true">5&#9829;</p>
      <h2 class="h2" id="who-h">Three ways in</h2>
    </div>
    <div class="card-grid" style="--min:min(16rem, 100%)">
      <a class="door" href="/deck/">
        <span class="point__index" aria-hidden="true">J&#9824;</span>
        <span class="door__title">You fish</span>
        <span class="door__text">
          What's in the deck, how it's printed, what it costs, and when it ships.
        </span>
        <span class="door__go">See the deck &rarr;</span>
      </a>
      <a class="door" href="/gifts/">
        <span class="point__index" aria-hidden="true">Q&#9829;</span>
        <span class="door__title">You're buying for someone who fishes</span>
        <span class="door__text">
          A gift that doesn't require you to guess a rod weight, a line taper, or a hook size.
        </span>
        <span class="door__go">Gift guide &rarr;</span>
      </a>
      <a class="door" href="/wholesale/">
        <span class="point__index" aria-hidden="true">K&#9827;</span>
        <span class="door__title">You run a shop, boat, or lodge</span>
        <span class="door__text">
          Case pricing for fly shops, guides and outfitters. Bulk is where this deck belongs.
        </span>
        <span class="door__go">Wholesale &rarr;</span>
      </a>
    </div>
  </div>
</section>

<section class="section section--sunk" id="list" aria-labelledby="capture-h">
  <div class="wrap">
    <div class="capture">
      <div>
        <p class="section-num" aria-hidden="true">6&#9829;</p>
        <h2 class="h2" id="capture-h" style="margin-block-start:var(--s-4)">Be first in line</h2>
        <p class="lede" style="margin-block-start:var(--s-4)">
          One email when the deck is real, one when it ships, and nothing else.
        </p>
      </div>

      <form class="capture__form" data-capture="email" action="#" method="post">
        <div class="form-inline">
          <div class="field">
            <label class="label" for="home-email">Email address</label>
            <input class="input" id="home-email" name="email" type="email"
                   autocomplete="email" required placeholder="you@example.com"
                   aria-describedby="home-email-help">
          </div>
          <button class="btn btn--primary" type="submit">Join the list</button>
        </div>
        <p class="help" id="home-email-help">
          Nothing ships yet &mdash; this is a waiting list, not an order. No card details, no charge,
          unsubscribe in one click.
        </p>
      </form>

      <p class="notice notice--info">
        <strong>Pre-launch.</strong> ${esc(site?.product?.availabilityNote ?? 'Not yet shipping. Join the list to be first in line.')}
      </p>
    </div>
  </div>
</section>

<style>
.home-makers { display: grid; gap: var(--s-7); align-items: start; }
@media (min-width: 52rem) {
  .home-makers { grid-template-columns: minmax(min(13rem, 100%), 17rem) minmax(min(18rem, 100%), 1fr); gap: var(--s-8); }
}
.home-makers__card { margin: 0; max-inline-size: 17rem; }
.home-makers__card img { inline-size: 100%; height: auto; }

.home-quote { margin: var(--s-5) 0 0; border-inline-start: 2px solid var(--c-green); padding-inline-start: var(--s-5); }
.home-quote p { margin: 0 0 var(--s-4); font-family: var(--f-display); font-size: var(--t-lg); line-height: var(--lh-snug); color: var(--c-text); max-inline-size: var(--measure); }
.home-quote__signoff { color: var(--c-green); }
.home-quote cite { display: block; font-style: normal; font-size: var(--t-sm); color: var(--c-text-faint); }
</style>

<script type="application/json" id="hatch-data">${hatchData(f)}</script>
<script src="/js/hatch.js" defer></script>
`;
}