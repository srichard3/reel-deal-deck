/**
 * Homepage — The Reel Deal Deck
 *
 * Note on data: `flies` may legitimately be an empty array (data/flies.json is
 * the Fly Library's source of truth and is populated separately). Every read
 * below is defensive; when there is no data the Fly Library section falls back
 * to a small hard-coded set of pattern names purely so the layout stays visible
 * during development, and that fallback disappears the moment real data lands.
 */

export const meta = {
  path: '/',
  title: 'Fly Fishing Cards Worth Owning',
  description:
    'A 54-card fly-fishing deck: every card an original hand-drawn fly, printed on genuine Bicycle stock. Learn the flies free in our Fly Library.',
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
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'The Reel Deal Deck',
      url: 'https://reeldealdeck.com/',
      slogan: '54 flies. One deck worth owning.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Eagle',
        addressRegion: 'ID',
        addressCountry: 'US',
      },
      sameAs: [
        'https://instagram.com/reeldealdeck',
        'https://tiktok.com/@reeldealdeck',
      ],
    },
  ],
};

/* ----------------------------------------------------------------- utils -- */

import { flyCard as sharedFlyCard } from '../templates/_shared.mjs';

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const SUITS = { spade: '♠', heart: '♥', diamond: '♦', club: '♣' };
const SUIT_ORDER = [SUITS.spade, SUITS.heart, SUITS.diamond, SUITS.club];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

/** Resolve a card-corner index ("7♦") for a fly, however the data spells it. */
function cardIndex(fly, i) {
  const rank = fly?.rank ?? fly?.card?.rank ?? RANKS[i % RANKS.length];
  const rawSuit = String(fly?.suit ?? fly?.card?.suit ?? '').toLowerCase();
  const suit =
    SUITS[rawSuit.replace(/s$/, '')] ||
    (Object.values(SUITS).includes(rawSuit) ? rawSuit : SUIT_ORDER[i % SUIT_ORDER.length]);
  return { rank: String(rank), suit };
}

const flyName = (fly) => fly?.name ?? fly?.title ?? fly?.slug ?? 'Untitled fly';
const flyNote = (fly) =>
  fly?.imitates ?? fly?.summary ?? fly?.shortDescription ?? fly?.description ?? '';
const flyType = (fly) => String(fly?.type ?? fly?.category ?? '').toLowerCase();

/* ------------------------------------------------------------- fly art ---- */
/* Engraved single-weight line art. No photography exists yet and none is
   wanted: the deck's whole argument is that the drawings are original.       */

const HOOK = `
  <circle cx="23" cy="27" r="4.4"/>
  <path d="M27.4 27H82c10.6 0 17.4 8.6 17.4 18.8 0 10.6-8.6 18.6-19.6 18.6-9.4 0-16.6-5.4-19-13.2"/>
  <path d="M60.8 51.2 49.6 42.4"/>`;

function flyArt(kind, cls) {
  const parts = {
    dry: `
      <path d="M52 25c-4-8-4-14-1.4-19.6"/>
      <path d="M56 25c4-8 5-13.4 3.4-19"/>
      <path d="M40 27c-4.6-5-6.8-5.6-10-6"/>
      <path d="M40 27c-4 2.6-7.4 3.2-10.6 3"/>
      <path d="M45 27c-3.4-6-6-7.6-9.4-9"/>
      <path d="M62 26.4 60.4 33M68 26.4 66.4 33M74 26.4 72.4 33M80 26.6 78.6 33"/>
      <path d="M82 26c7-2.6 13.4-4.6 19-4.4M82 28.4c7 1 13 2.6 18 5.2"/>`,
    nymph: `
      <path d="M40 24.6c2.6 3.4 2.6 6 0 9M47 24.2c3 3.6 3 6.6 0 10M54.6 24.4c3.2 3.6 3.2 6.6 0 10M62.4 25c3 3.4 3 6 0 9.4"/>
      <path d="M36 26.6c-4.4-4-7.4-5-11.6-5.4"/>
      <path d="M70 26c6-3.6 11.4-6 17.4-6.6M70.6 28.6c6 1.4 11.4 3.6 16.6 6.8M71 27.4c6.4-1 12.4-1 18.2 0"/>
      <path d="M42 22.4c4.6-4 9.4-5.6 14.6-5"/>`,
    streamer: `
      <path d="M50 24.6c-5-4.6-9-6-14-6.4"/>
      <path d="M50 29.4c-5 4-9 5.4-14 5.6"/>
      <path d="M56 24c14.6-4.6 27.4-4.4 39.4 1.2"/>
      <path d="M56 27c14.6-1 27.4 1.6 38.4 8"/>
      <path d="M56 30c13.4 2.4 24.6 7.6 33.6 15.4"/>
      <path d="M61 25.6 59.4 31.6M67.4 25 65.8 31.4M74 25 72.4 31.6"/>`,
    terrestrial: `
      <path d="M40 21.6h30c3.4 0 5.6 2.4 5.6 5.6s-2.2 5.6-5.6 5.6H40c-3.4 0-5.6-2.4-5.6-5.6S36.6 21.6 40 21.6Z"/>
      <path d="M46 21.6 38.6 9.6M46 33l-8 11.4M66 21.6l8-12M66 33l8.4 11.6"/>
      <path d="M56 21.6v-9M56 33v8.6"/>`,
  };
  return `<svg class="${cls}" viewBox="0 0 112 74" role="img" aria-hidden="true" focusable="false"
  fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
  ${HOOK}${parts[kind] || parts.dry}
</svg>`;
}

/* The five cards in the hero fan. Hard-coded deliberately: this is a drawing,
   not data, and it must render identically before flies.json exists. */
const FAN = [
  { rank: '9', suit: SUITS.club, name: 'Woolly Bugger', art: 'streamer' },
  { rank: 'J', suit: SUITS.spade, name: 'Pheasant Tail', art: 'nymph' },
  { rank: 'A', suit: SUITS.diamond, name: 'Parachute Adams', art: 'dry' },
  { rank: 'Q', suit: SUITS.heart, name: 'Chernobyl Ant', art: 'terrestrial' },
  { rank: '7', suit: SUITS.diamond, name: 'Elk Hair Caddis', art: 'dry' },
];

/* Layout-only stand-ins. Real patterns, but no claim is attached to them and
   they vanish the instant data/flies.json has entries. */
const FALLBACK_FLIES = [
  { name: 'Parachute Adams', type: 'dry' },
  { name: 'Pheasant Tail Nymph', type: 'nymph' },
  { name: 'Woolly Bugger', type: 'streamer' },
  { name: 'Elk Hair Caddis', type: 'dry' },
  { name: 'Zebra Midge', type: 'nymph' },
  { name: 'Chernobyl Ant', type: 'terrestrial' },
];

const ART_FOR_TYPE = (t) =>
  ['dry', 'nymph', 'streamer', 'terrestrial'].includes(t) ? t : t === 'wet' ? 'nymph' : 'dry';

/* ------------------------------------------------------------- sections --- */

function heroFan() {
  /* The printed tuck box. It already carries the logo, the engraved trout and
     a fan of three real cards, so it does the job the CSS sketch used to. */
  return `<figure class="hero-pack">
      <img class="hero-pack__img"
        src="/brand/box-front-600.webp"
        srcset="/brand/box-front-600.webp 600w, /brand/box-front-1200.webp 1200w"
        sizes="(min-width: 60rem) 24rem, 70vw"
        width="600" height="874" fetchpriority="high" decoding="async"
        alt="The Reel Deal Deck tuck box: an engraved green case with two trout, holding a fan of three fly cards">
    </figure>`;
}

function libraryCards(flies) {
  const real = Array.isArray(flies) && flies.length > 0;
  if (!real) {
    return `
      <!-- data/flies.json is empty at build time; the strip renders once it lands. -->
      <p class="text-faint">Fly Library loading…</p>`;
  }
  /* Six of the best-looking faces in the deck, linked into the library. */
  const picks = ['royal-coachman', 'chubby-chernobyl', 'woolly-bugger', 'san-juan-worm',
                 'grasshopper', 'copper-john']
    .map((sl) => flies.find((f) => f.slug === sl))
    .filter(Boolean);
  const items = (picks.length === 6 ? picks : flies.slice(0, 6));
  return `
      <div class="card-grid fly-strip" style="--gap:var(--s-4)">
        ${items.map((f) => sharedFlyCard(f)).join('\n        ')}
      </div>`;
}

/* ------------------------------------------------------------------ page -- */

export default function homepage({ site, flies }) {
  const f = Array.isArray(flies) ? flies : [];
  const count = site?.product?.cardCount ?? 54;
  const partner = site?.conservation?.partner ?? 'Trout Unlimited';
  const partnerUrl = site?.conservation?.partnerUrl ?? 'https://www.tu.org/';
  const city = site?.location?.city ?? 'Eagle';
  const regionName = site?.location?.regionName ?? 'Idaho';

  return `
<section class="hero">
  <div class="wrap hero__grid">
    <div>
      <p class="eyebrow">${esc(count)} flies &middot; one deck</p>
      <h1 class="h1 hero__title">The first fly-fishing deck an angler would be proud to own.</h1>
      <p class="lede hero__lede">
        Every card is an original hand-drawn fly with a plain-English note on what it imitates &mdash;
        printed on genuine Bicycle stock so the deck survives the shuffle as well as the streamside.
      </p>
      <div class="cluster hero__actions" style="--gap:var(--s-3)">
        <a class="btn btn--primary btn--lg" href="/deck/#reserve">Reserve a deck</a>
        <a class="btn btn--ghost btn--lg" href="/flies/">Browse the Fly Library</a>
      </div>
      <p class="hero__note">
        Nothing ships yet. Joining the list costs nothing and holds your place.
      </p>
    </div>
    ${heroFan()}
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

<section class="section" id="library" aria-labelledby="library-h">
  <div class="wrap">
    <div class="section-head section-head--split">
      <div>
        <p class="section-num" aria-hidden="true">A&#9830;</p>
        <h2 class="h2" id="library-h">Learn the flies. Free, and without the deck.</h2>
        <p class="lede">
          The Fly Library is the whole deck as a reference you can read right now:
          one page per pattern, what it imitates, when it works, and how to fish it.
          No sign-up, no paywall, no e-book funnel.
        </p>
      </div>
      <p><a class="btn btn--ghost" href="/flies/">All ${esc(count)} flies</a></p>
    </div>
${libraryCards(f)}
    <p class="text-muted" style="margin-block-start:var(--s-6)">
      <a href="/flies/">Open the Fly Library</a> &mdash; dries, nymphs, streamers, wets,
      terrestrials and attractors, each one indexed like a card.
    </p>
  </div>
</section>

<section class="section section--dark" aria-labelledby="diff-h">
  <div class="wrap">
    <div class="section-head">
      <p class="section-num" aria-hidden="true">2&#9830;</p>
      <h2 class="h2" id="diff-h">Fly cards exist. This is what we did differently.</h2>
      <p class="lede">
        Three decisions, and all three cost more than the alternative.
      </p>
    </div>

    <div class="card-grid" style="--min:16rem">
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
          Printed by USPCC on real Bicycle stock with the Air-Cushion finish, so the deck
          actually deals and shuffles. ${esc(site?.product?.material ?? 'FSC-certified paper, starch-based glue, vegetable-based inks')}.
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
      <p class="section-num" aria-hidden="true">3&#9830;</p>
      <h2 class="h2" id="who-h">Three ways in</h2>
    </div>
    <div class="card-grid" style="--min:16rem">
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

<section class="section section--sunk" aria-labelledby="story-h">
  <div class="wrap wrap--narrow">
    <p class="section-num" aria-hidden="true">4&#9830;</p>
    <h2 class="h2" id="story-h" style="margin-block-start:var(--s-4)">A father, a daughter, and a stack of index cards</h2>
    <div class="prose" style="margin-block-start:var(--s-5)">
      <p>
        Ken went looking for a set of fly-fishing cards he'd actually want to carry.
        He found several. He didn't want to own any of them. So he started drawing his own,
        one pattern at a time, until there were enough for a deck.
      </p>
      <p>
        Audrey &mdash; his daughter, and an entrepreneurship graduate of Loyola Marymount
        University's College of Business Administration &mdash; took the drawings and turned
        them into a product.
      </p>
    </div>
    <p class="cluster" style="margin-block-start:var(--s-6)">
      <a class="btn btn--ghost" href="/story/">Read the whole story</a>
    </p>
  </div>
</section>

<section class="section" id="list" aria-labelledby="capture-h">
  <div class="wrap">
    <div class="capture">
      <div>
        <p class="section-num" aria-hidden="true">5&#9830;</p>
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
`;
}
