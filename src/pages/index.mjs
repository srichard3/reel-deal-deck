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
 * the Fly-brary's source of truth and is populated separately). Every read
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
import { campaignCta, campaignLine, organizationSchema, instagramStrip } from '../templates/_blocks.mjs';

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/* ------------------------------------------------------------- sections --- */

function heroPack() {
  /* The real tuck box, in three dimensions, built from the printer's dieline —
     the six panels are cut out by scripts/box-panels.mjs and the proportions
     here are the ones measured off it (W : H : D = 1 : 1.393 : 0.26).
     No 3D library: six images and CSS transforms. A tuck box is a cuboid, and
     a cuboid is six rectangles, so three.js would be 150kB to draw a box.

     With JS off it stays at the three-quarter angle set in CSS, which is the
     view the flat image used to show anyway. box.js adds the dragging.

     The front panel is the LCP image and keeps fetchpriority; the back is the
     one face that cannot be seen at rest, so it loads lazily. */
  /* draggable="false" is not decoration. Chrome starts a native image drag on
     mousedown over an <img>, which swallows the gesture and hands the reader a
     dragged picture instead of a turning box. Safari is lazier about firing
     dragstart, so it only showed up in Chrome. */
  const face = (name, w, h, alt, eager) =>
    `<img class="tuck__img" src="/brand/box3d-${name}.webp" width="${w}" height="${h}"
             alt="${alt}" draggable="false" decoding="async"${eager ? ' fetchpriority="high"' : ' loading="lazy"'}>`;

  return `<figure class="hero-pack">
      <div class="tuck" data-tuck>
        <div class="tuck__stage">
          <div class="tuck__box" data-tuck-box
               role="img"
               aria-label="The Reel Deal Deck tuck box: an engraved green case with two rising trout, a fan of three fly cards on the front, and &lsquo;54 Unique Cards, Hand Illustrated in Exquisite Detail&rsquo; down the spine">
            <div class="tuck__face tuck__face--front">${face('front', 600, 836, '', true)}</div>
            <div class="tuck__face tuck__face--back">${face('back', 600, 836, '')}</div>
            <div class="tuck__face tuck__face--left">${face('left', 156, 836, '')}</div>
            <div class="tuck__face tuck__face--right">${face('right', 156, 836, '')}</div>
            <div class="tuck__face tuck__face--top">${face('top', 600, 156, '')}</div>
            <div class="tuck__face tuck__face--bottom"></div>
          </div>
        </div>
        <div class="tuck__shadow" aria-hidden="true"></div>
      </div>
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

/* ------------------------------------------------------------ feed the trout --
   The homepage game is pure artwork matching, so it needs nothing from a fly
   beyond its name and its picture — every card in the deck is playable. Anything
   without a rendered card image is dropped rather than shipped broken. */
function feedData(list) {
  const cards = list
    .filter((f) => f.slug && f.name && f.image)
    .map((f) => ({ slug: f.slug, name: f.name, img: f.image }));
  const json = JSON.stringify({ cards });
  return json.replace(/</g, '\\u003c');   /* never let a "</script>" through */
}

/* ------------------------------------------------------------------ page -- */

export default function homepage({ site, flies, posts, instagram }) {
  /* `meta` is module-level, so `site` is not in scope there. build.mjs reads
     meta after this runs, so the canonical entity is patched in here. */
  const orgIdx = meta.jsonld.findIndex((n) => n['@type'] === 'Organization');
  if (orgIdx > -1) meta.jsonld[orgIdx] = { '@context': 'https://schema.org', ...organizationSchema(site, { full: true }) };

  /* Four entry points into the Virtual Guide, chosen as the widest doors: what to buy,
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
        That is our line, and it is printed on a card tucked inside the deck. ${esc(count)} flies,
        every one drawn by hand, on genuine Bicycle stock &mdash; so it deals like a proper deck of
        cards and still earns its place in a vest pocket.
      </p>
      <div class="cluster hero__actions" style="--gap:var(--s-3)">
        ${campaignCta(site, { variant: 'primary' })}
        <a class="btn btn--ghost btn--lg" href="/cards/">See what&rsquo;s in it</a>
      </div>
      <p class="hero__note">
        Just the two of us, in ${esc(city)}, ${esc(regionName)}. Nothing ships from here yet &mdash;
        the list is free, and it holds your place.
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
      <span class="stat__label">Gets a cut of every deck</span>
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
          Card 56 &mdash; it is in every deck.
        </figcaption>
      </figure>

      <div>
        <p class="section-num" aria-hidden="true">A&#9829;</p>
        <h2 class="h2" id="makers-h" style="margin-block-start:var(--s-4)">Hello from Ken and Audrey</h2>
        <blockquote class="home-quote">
          <p>${esc(v.intro || '')}</p>
          <p>${esc(v.why || '')}</p>
          <p class="home-quote__signoff">${esc(v.signoff || '')}</p>
          <cite>Ken and Audrey &mdash; printed on the info card</cite>
        </blockquote>
        <p class="home-origin">
          ${esc(site?.story?.looking || '')} ${esc(site?.story?.twist || '')}
        </p>
        <p class="cluster" style="margin-block-start:var(--s-6);--gap:var(--s-3)">
          <a class="btn btn--ghost" href="/story/">Read the whole story</a>
          <a class="btn btn--quiet" href="/conservation/">Why catch-and-release</a>
        </p>
      </div>
    </div>
  </div>
</section>

${instagramStrip(site, instagram, {
  title: 'Follow along while we make it',
  blurb: 'We put the whole thing on Instagram as it happens \u2014 prototypes, print proofs, trips, and the odd fish that had nothing to do with work. Tap any of these to open it.',
})}

<section class="section" id="in-the-deck" aria-labelledby="deck-h">
  <div class="wrap">
    <div class="section-head section-head--split">
      <div>
        <p class="section-num" aria-hidden="true">2&#9829;</p>
        <h2 class="h2" id="deck-h">What you actually get</h2>
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
        <h2 class="h2" id="library-h">Learn the flies free, right now, without buying a thing</h2>
        <p class="lede">
          The Fly-brary is the whole deck written out as a reference: one page per pattern,
          what it imitates, when it works and how to fish it. It is genuinely free &mdash; no
          sign-up, no paywall, no e-book waiting at the end. We would rather you learned the
          flies than bought the cards.
        </p>
      </div>
      <p><a class="btn btn--ghost" href="/flies/">All ${esc(count)} flies</a></p>
    </div>
${flyStrip(f, ['royal-coachman', 'chubby-chernobyl', 'elk-hair-caddis', 'zebra-midge', 'clouser-minnow', 'green-drake'])}
    <p class="text-muted" style="margin-block-start:var(--s-6)">
      <a href="/flies/">Open the Fly-brary</a> &mdash; dries, nymphs, streamers, wets,
      terrestrials and attractors, each one indexed like a card.
    </p>
  </div>
</section>

<section class="section" id="guides" aria-labelledby="guides-h">
  <div class="wrap">
    <div class="section-head section-head--split">
      <div>
        <p class="section-num" aria-hidden="true">4&#9827;</p>
        <h2 class="h2" id="guides-h">The Virtual Guide, for the questions a card is too small to answer</h2>
        <p class="lede">
          Straight answers to the things anglers actually ask &mdash; which rod, which tippet,
          how to rig it, why the fish keep refusing you. Written to be useful standing on the
          bank, not to sell you a rod.
        </p>
      </div>
      <p><a class="btn btn--ghost" href="/blog/">All ${esc(posts.length)} answers</a></p>
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
      <a href="/blog/">Open the Virtual Guide</a> &mdash; gear, technique, knots, seasons and
      getting started, each one answering a single question.
    </p>
  </div>
</section>

<!-- ============================================================= the game ==
     "Feed the trout" — a matching toy, not a quiz. The trout wants one fly;
     three drift past; tap the one whose artwork matches and it rises to that
     card and takes it. Nothing here needs any fly-fishing knowledge, and there
     is no timer and no fail state — a wrong tap costs a beat and nothing else.

     No-JS: the water and the trout render as a still illustration and no cards
     appear (they are injected). Nothing on this page depends on it. -->
<section class="section section--sunk" id="game" aria-labelledby="game-h">
  <div class="wrap">
    <p class="eyebrow">Try it</p>
    <h2 class="h2" id="game-h">Feed the trout</h2>
    <p class="lede feed__lede">
      This trout has its eye on one fly. Three are drifting overhead. Tap the one
      that matches and watch it come up.
    </p>

    <div class="feed" data-feed>

      <!-- what the trout is looking for -->
      <figure class="feed__want">
        <figcaption class="feed__want-label">The trout wants</figcaption>
        <div class="feed__want-card">
          <img class="feed__want-img" data-feed-want src="/cards/adams-400.webp"
               width="572" height="800" alt="" decoding="async">
        </div>
      </figure>

      <!-- the drifting flies (injected) -->
      <div class="feed__row" data-feed-row></div>

      <!-- the water -->
      <div class="feed__scene" data-feed-scene>
        <svg class="feed__water" data-feed-water viewBox="0 0 400 120" role="img"
             aria-label="A trout holding under the surface of a stream.">
          <defs>
            <linearGradient id="feed-deep" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="var(--c-green)" stop-opacity=".26"/>
              <stop offset="100%" stop-color="var(--c-green)" stop-opacity=".05"/>
            </linearGradient>
          </defs>
          <rect x="0" y="34" width="400" height="86" fill="url(#feed-deep)"/>
          <path class="feed__surface" d="M0 34 H400"/>
          <path class="feed__seam" d="M0 62 C90 58 150 66 250 61 S360 58 400 63"/>
          <path class="feed__seam" d="M0 95 C80 91 170 99 260 93 S370 91 400 96"/>

          <!-- the splash, aimed at whichever card was taken -->
          <g class="feed__rings">
            <ellipse class="feed__ring" cx="0" cy="34" rx="15" ry="4"/>
            <ellipse class="feed__ring feed__ring--2" cx="0" cy="34" rx="15" ry="4"/>
          </g>

          <!-- Scaled here rather than in the path data: the trout has to fill the
               stream, but every rise coordinate is easier to reason about in the
               original units. -->
          <g class="feed__fish" data-feed-fish>
            <g class="feed__fish-scale">
            <path class="feed__fish-tail" d="M62 17 L82 4 L78 17 L82 30 Z"/>
            <path class="feed__fish-fin"  d="M40 5 L52 -3 L56 7 Z"/>
            <path class="feed__fish-fin"  d="M32 24 L38 33 L46 25 Z"/>
            <path class="feed__fish-body"
                  d="M4 17 C16 4 48 1 66 9 C70 12 70 22 66 25 C48 33 16 30 4 17 Z"/>
            <path class="feed__fish-line" d="M12 17 C30 14 50 15 64 17"/>
            <circle class="feed__fish-spot" cx="30" cy="11" r="1.8"/>
            <circle class="feed__fish-spot" cx="42" cy="14" r="1.6"/>
            <circle class="feed__fish-spot" cx="36" cy="21" r="1.5"/>
            <circle class="feed__fish-spot" cx="50" cy="20" r="1.4"/>
            <circle class="feed__fish-eye" cx="12" cy="15" r="2.4"/>
            </g>
          </g>
        </svg>
      </div>

      <p class="feed__status" data-feed-status role="status">
        Turn on JavaScript to play — or just
        <a href="/flies/">browse all 54 flies</a> instead.
      </p>
      <p class="feed__score" data-feed-score aria-live="polite"></p>
    </div>

    <p class="feed__foot">
      Every one of these is a real card, and Ken drew all of them. The name, what it
      imitates and how to fish it are printed right on the face — there are ${esc(count)}
      to get through. <a href="/flies/">See the whole library →</a>
    </p>
  </div>
</section>

<section class="section section--dark" aria-labelledby="diff-h">
  <div class="wrap">
    <div class="section-head">
      <p class="section-num" aria-hidden="true">4&#9829;</p>
      <h2 class="h2" id="diff-h">Other fly cards exist. Here is where we went our own way.</h2>
      <p class="lede">
        Three decisions we made the harder way, because the easy way would have bothered us
        every time we looked at the box.
      </p>
    </div>

    <div class="card-grid" style="--min:min(16rem, 100%)">
      <div class="point">
        <span class="point__index" aria-hidden="true">1&#9830;</span>
        <h3 class="point__title">The art is drawn, not photographed</h3>
        <p class="point__text">
          Every fly on every card was drawn by hand, specifically for this deck. Line art shows
          a pattern's structure &mdash; the proportions, the hackle, the profile you are actually
          trying to tie or match &mdash; in a way a photograph of one particular fly never quite
          manages.
        </p>
      </div>
      <div class="point">
        <span class="point__index" aria-hidden="true">2&#9830;</span>
        <h3 class="point__title">Genuine Bicycle stock, not generic card</h3>
        <p class="point__text">
          Printed by ${esc(site?.product?.manufacturer ?? 'The United States Playing Card Company')}
          on real Bicycle stock with the Air-Cushion finish, so the deck actually deals and
          shuffles. ${esc(site?.product?.material ?? 'FSC-certified paper, starch-based glue, vegetable-based inks')}.
          It is a proper deck of cards first and a reference second, which is the whole trick.
        </p>
      </div>
      <div class="point">
        <span class="point__index" aria-hidden="true">3&#9830;</span>
        <h3 class="point__title">A contribution to the water</h3>
        <p class="point__text">
          We are a ${esc(partner)} business member, and a set amount from every deck goes to
          <a href="${esc(partnerUrl)}" rel="noopener">${esc(partner)}</a> &mdash; who do the
          cold-water habitat work the fish we draw depend on.
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
      <h2 class="h2" id="who-h">Which one are you?</h2>
    </div>
    <div class="card-grid" style="--min:min(16rem, 100%)">
      <a class="door" href="/deck/">
        <span class="point__index" aria-hidden="true">J&#9824;</span>
        <span class="door__title">You fish</span>
        <span class="door__text">
          What is in the deck, how it is printed, what it costs and when it ships.
        </span>
        <span class="door__go">See the deck &rarr;</span>
      </a>
      <a class="door" href="/gifts/">
        <span class="point__index" aria-hidden="true">Q&#9829;</span>
        <span class="door__title">You&rsquo;re buying for someone who fishes</span>
        <span class="door__text">
          A gift that does not ask you to guess a rod weight, a line taper or a hook size.
        </span>
        <span class="door__go">Gift guide &rarr;</span>
      </a>
      <a class="door" href="/wholesale/">
        <span class="point__index" aria-hidden="true">K&#9827;</span>
        <span class="door__title">You run a shop, boat, or lodge</span>
        <span class="door__text">
          Case pricing for fly shops, guides and outfitters. Honestly, this is where the deck
          belongs.
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
          One email when the deck is real, one when it ships, and nothing else. We are far too
          busy drawing flies to pester you.
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
          Nothing ships yet &mdash; this is a waiting list, not an order. No card details, no
          charge, and one click to leave.
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

/* The origin beat, sitting under their printed note as the plain-prose answer
   to "who are these people and why did they do this". */
.home-origin { margin: var(--s-5) 0 0; color: var(--c-text-muted); max-inline-size: var(--measure); }
.home-quote cite { display: block; font-style: normal; font-size: var(--t-sm); color: var(--c-text-faint); }
</style>

<script type="application/json" id="feed-data">${feedData(f)}</script>
<script src="/js/box.js" defer></script>
<script src="/js/feed.js" defer></script>
`;
}