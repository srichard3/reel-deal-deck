/**
 * /cards/ — What is in the deck.
 *
 * The one page that explains the object: how a card is laid out, why the suits
 * are green and brown, what is in each suit, the three specials, the back, the
 * box, the info card, and who prints it.
 *
 * Every fact on this page comes from data/cards.json (transcribed from the
 * printed v8 faces) or data/site.json (`cardCraft`, `product`, `voice`).
 * Nothing here is invented; where a fact is not in the data it ships as a
 * TODO-CONFIRM comment.
 *
 * data/cards.json is not part of the build render context, so it is read
 * directly here. It is read-only — this page never writes to it.
 */
import { readFileSync } from 'node:fs';
import { campaignCta } from '../templates/_blocks.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc, cardImage, flyCard } from '../templates/_shared.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

/** The deck as printed. Empty array is survivable: the page degrades. */
let CARDS = [];
try {
  CARDS = JSON.parse(readFileSync(path.join(ROOT, 'data', 'cards.json'), 'utf8'));
} catch {
  CARDS = [];
}

/** cards.json is flat (`rank`, `suit`); _shared.mjs helpers want `card.{rank,suit}`. */
const toFly = (c) => ({
  slug: c.slug,
  name: c.name,
  image: `/cards/${c.slug}`,
  card: { rank: c.rank, suit: c.suit },
  cardCategory: c.category,
});

const SUIT_GLYPH = { spades: '♠', hearts: '♥', diamonds: '♦', clubs: '♣' };
const SUIT_ORDER = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANK_ORDER = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

/** Which ink a suit is printed in, per site.cardCraft.suits. */
const SUIT_INK = {
  hearts: { ink: 'Green', note: 'green replaces red' },
  diamonds: { ink: 'Green', note: 'green replaces red' },
  spades: { ink: 'Bark brown', note: 'bark brown replaces black' },
  clubs: { ink: 'Bark brown', note: 'bark brown replaces black' },
};

const bySuit = (s) =>
  CARDS.filter((c) => c.suit === s)
    .sort((a, b) => RANK_ORDER.indexOf(a.rank) - RANK_ORDER.indexOf(b.rank));

/** Categories actually printed in a suit, most common first. Derived, not asserted. */
function categoryMix(cards) {
  const counts = new Map();
  for (const c of cards) counts.set(c.category, (counts.get(c.category) || 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

/** Hook sizes across a set of cards, as a single honest range. */
function hookSpan(cards) {
  const nums = cards.flatMap((c) => String(c.sizes).match(/\d+/g) || []).map(Number);
  if (!nums.length) return '';
  return `#${Math.min(...nums)}–#${Math.max(...nums)}`;
}

const ANATOMY_SLUG = 'adams';
const JOKER_SLUGS = ['egg-pattern', 'san-juan-worm', 'bass-popper'];

/* ------------------------------------------------------------------ meta -- */

export const meta = {
  path: '/cards/',
  title: "What's in the Deck",
  description:
    'Inside The Reel Deal Deck: how a card is laid out, the green-and-brown suits, what is in each suit, the three specials, the engraved back and who prints it.',
  priority: 0.9,
  changefreq: 'monthly',
  bodyClass: 'page-cards',
  jsonld: [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: "What's in the deck",
      url: 'https://reeldealdeck.com/cards/',
      description:
        'How a Reel Deal Deck card is laid out, the two-colour suit system, the four suits, the three specials, the engraved back and box, and how the deck is printed.',
      isPartOf: {
        '@type': 'WebSite',
        name: 'The Reel Deal Deck',
        url: 'https://reeldealdeck.com/',
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        contentUrl: 'https://reeldealdeck.com/cards/adams-800.webp',
        caption:
          'The Ace of hearts from The Reel Deal Deck: the Adams, a hand-drawn dry fly with its category, description and hook sizes.',
        width: 800,
        height: 1118,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://reeldealdeck.com/' },
        { '@type': 'ListItem', position: 2, name: "What's in the deck", item: 'https://reeldealdeck.com/cards/' },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ImageObject',
      contentUrl: 'https://reeldealdeck.com/cards/card-back-800.webp',
      caption:
        'The card back: an engraved green border framing two rising trout and an angler on the river.',
      width: 800,
      height: 1118,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ImageObject',
      contentUrl: 'https://reeldealdeck.com/brand/box-front-1200.webp',
      caption: 'The Reel Deal Deck tuck box, engraved in green with two rising trout.',
      width: 759,
      height: 1106,
    },
  ],
};

/* -------------------------------------------------------------- sections -- */

function anatomy() {
  const c = CARDS.find((x) => x.slug === ANATOMY_SLUG);
  if (!c) return '';
  const fly = toFly(c);
  const glyph = SUIT_GLYPH[c.suit] || '♥';

  const rows = [
    ['Rank and suit', `${c.rank}${glyph}`,
      'Top left and bottom right, the way any playing card indexes itself. Printed in green here, because hearts and diamonds are green in this deck.'],
    ['The fly&rsquo;s name', esc(c.name),
      'What anglers call it, and what you would ask for at a fly shop counter.'],
    ['Category', esc(c.category),
      'What kind of fly it is, so you know roughly where in the water it belongs before you read a word.'],
    ['The drawing', 'Hand-drawn',
      'The fly itself, drawn by hand for this deck. Not a photograph and not licensed art.'],
    ['What it imitates', esc(c.cardText),
      'The plain-English note printed on the card. One or two lines, no jargon.'],
    ['Hook sizes', `#${esc(String(c.sizes).replace('-', '&ndash;#'))}`,
      'The range the pattern is usually tied in.'],
  ];

  return `
<section class="section" id="anatomy" aria-labelledby="anatomy-h">
  <div class="wrap">
    <div class="section-head">
      <p class="section-num" aria-hidden="true">A&#9829;</p>
      <h2 class="h2" id="anatomy-h">What is on a card</h2>
      <p class="lede">
        Six things, in the same place on all ${esc(CARDS.length)} of them. This is the Adams,
        the ace of hearts.
      </p>
    </div>

    <div class="cards-anatomy">
      <div class="cards-figure">
        ${flyCard(fly, { eager: true })}
        <p class="figure-note" style="margin-block-start:var(--s-4)">
          The printed face, actual artwork. Every card in the deck links through to its
          full page in the <a href="/flies/">Fly-brary</a>.
        </p>
      </div>

      <ol class="cards-spec">
        ${rows.map(([label, value, note], i) => `<li class="cards-spec__row">
          <span class="cards-spec__num" aria-hidden="true">${i + 1}</span>
          <div>
            <p class="cards-spec__label">${label}</p>
            <p class="cards-spec__value">${value}</p>
            <p class="cards-spec__note">${note}</p>
          </div>
        </li>`).join('\n        ')}
      </ol>
    </div>
  </div>
</section>`;
}

function suitInk(site) {
  const craft = site?.cardCraft || {};
  return `
<section class="section section--dark" id="suits" aria-labelledby="ink-h">
  <div class="wrap">
    <div class="section-head">
      <p class="section-num" aria-hidden="true">2&#9829;</p>
      <h2 class="h2" id="ink-h">Green and brown, not red and black</h2>
      <p class="lede">
        ${esc(craft.suits || 'A two-colour deck: green replaces red on hearts and diamonds, bark brown replaces black on spades and clubs.')}
      </p>
    </div>

    <div class="card-grid" style="--min:min(13rem, 100%)">
      ${SUIT_ORDER.map((s) => {
        const info = SUIT_INK[s];
        return `<div class="cards-ink">
        <span class="cards-ink__glyph cards-ink__glyph--${esc(s)}" aria-hidden="true">${SUIT_GLYPH[s]}</span>
        <p class="cards-ink__name">${esc(s[0].toUpperCase() + s.slice(1))}</p>
        <p class="cards-ink__note">${esc(info.ink)} &mdash; ${esc(info.note)}</p>
      </div>`;
      }).join('\n      ')}
    </div>

    <p class="lede" style="margin-block-start:var(--s-7);max-inline-size:var(--measure)">
      It still deals and reads like a normal deck &mdash; four suits, thirteen ranks, the same
      corner index in the same corner. The colours come off the tuck box and the card back,
      so a hand of cards looks like the river it came from rather than a casino.
    </p>
  </div>
</section>`;
}

function suitContents() {
  return `
<section class="section" id="four-suits" aria-labelledby="four-h">
  <div class="wrap">
    <div class="section-head">
      <p class="section-num" aria-hidden="true">3&#9829;</p>
      <h2 class="h2" id="four-h">The four suits</h2>
      <p class="lede">
        Thirteen cards each, ace through king. Every fly listed here has a free page in the
        Fly-brary &mdash; the deck&rsquo;s contents are readable in full before you own one.
      </p>
    </div>

    ${SUIT_ORDER.map((s) => {
      const cards = bySuit(s);
      if (!cards.length) return '';
      const mix = categoryMix(cards);
      const span = hookSpan(cards);
      return `<section class="cards-suit" aria-labelledby="suit-${esc(s)}-h">
      <div class="cards-suit__head">
        <h3 class="h3" id="suit-${esc(s)}-h">
          <span class="cards-suit__glyph cards-suit__glyph--${esc(s)}" aria-hidden="true">${SUIT_GLYPH[s]}</span>
          ${esc(s[0].toUpperCase() + s.slice(1))}
        </h3>
        <p class="cards-suit__meta">
          ${cards.length} cards &middot; ${esc(SUIT_INK[s].ink.toLowerCase())} ink${span ? ` &middot; hooks ${span}` : ''}
        </p>
      </div>
      <p class="cards-suit__mix">
        ${mix.map(([cat, n]) => `<span class="pill">${esc(cat)} <span class="cards-suit__n">${n}</span></span>`).join('\n        ')}
      </p>
      <ul class="cards-list">
        ${cards.map((c) => `<li class="cards-list__item">
          <a class="cards-list__link" href="/flies/${esc(c.slug)}/">
            <span class="cards-list__index" aria-hidden="true">${esc(c.rank)}${SUIT_GLYPH[s]}</span>
            <span class="visually-hidden">${esc(c.rank)} of ${esc(s)}:</span>
            <span class="cards-list__name">${esc(c.name)}</span>
            <span class="cards-list__cat">${esc(c.category)} &middot; #${esc(String(c.sizes).replace('-', '&ndash;#'))}</span>
          </a>
        </li>`).join('\n        ')}
      </ul>
    </section>`;
    }).join('\n    ')}
  </div>
</section>`;
}

function specials(site) {
  const cards = JOKER_SLUGS.map((s) => CARDS.find((c) => c.slug === s)).filter(Boolean);
  const craft = site?.cardCraft || {};
  return `
<section class="section section--sunk" id="specials" aria-labelledby="specials-h">
  <div class="wrap">
    <div class="section-head">
      <p class="section-num" aria-hidden="true">4&#9829;</p>
      <h2 class="h2" id="specials-h">Three cards with no rank at all</h2>
      <p class="lede">
        ${esc(craft.jokers || 'Three specials carry a trout-in-a-jester&rsquo;s-cap mark instead of a rank: the Egg, the San Juan Worm and the Bass Popper.')}
      </p>
    </div>

    <div class="cards-jokers">
      <figure class="cards-joker-mark">
        <img src="/brand/joker-fish-512.png" width="359" height="512"
             loading="lazy" decoding="async"
             alt="The Reel Deal Deck joker mark: a trout wearing a jester's cap">
        <figcaption class="figure-note">
          The mark that stands in for a rank on all three specials.
        </figcaption>
      </figure>

      <div class="card-grid" style="--min:min(12rem, 100%);--gap:var(--s-5)">
        ${cards.map((c) => `<figure class="cards-joker">
          ${flyCard(toFly(c))}
          <figcaption class="cards-joker__cap">
            <a href="/flies/${esc(c.slug)}/">${esc(c.name)}</a>
            <span class="cards-joker__cat">${esc(c.category)} &middot; #${esc(String(c.sizes).replace('-', '&ndash;#'))}</span>
          </figcaption>
        </figure>`).join('\n        ')}
      </div>
    </div>

    <p class="figure-note" style="margin-block-start:var(--s-6)">
      All three catch fish, which is why they are in the deck and not a gag.
      An egg, a worm and a popper simply do not belong to a suit of trout flies.
    </p>
  </div>
</section>`;
}

function backAndBox(site) {
  const craft = site?.cardCraft || {};
  return `
<section class="section" id="back" aria-labelledby="back-h">
  <div class="wrap">
    <div class="section-head">
      <p class="section-num" aria-hidden="true">5&#9829;</p>
      <h2 class="h2" id="back-h">The back and the box</h2>
      <p class="lede">
        ${esc(craft.backDesign || 'An engraved green border framing two rising trout and an angler on the river.')}
      </p>
    </div>

    <div class="cards-pair">
      <figure class="cards-figure">
        <img class="card-face__img"
             src="/cards/card-back-400.webp"
             srcset="/cards/card-back-400.webp 400w, /cards/card-back-800.webp 800w"
             sizes="(min-width: 60rem) 20rem, 80vw"
             width="400" height="559" loading="lazy" decoding="async"
             alt="The Reel Deal Deck card back: an engraved green border framing two rising trout and an angler casting on the river">
        <figcaption class="figure-note" style="margin-block-start:var(--s-4)">
          One back, printed on every card in the deck. It is symmetrical top to bottom,
          so nothing in your hand gives itself away.
        </figcaption>
      </figure>

      <figure class="cards-figure">
        <img class="card-face__img"
             src="/brand/box-front-600.webp"
             srcset="/brand/box-front-600.webp 600w, /brand/box-front-1200.webp 759w"
             sizes="(min-width: 60rem) 20rem, 80vw"
             width="600" height="874" loading="lazy" decoding="async"
             alt="The Reel Deal Deck tuck box: an engraved green case with two trout, holding a fan of three fly cards">
        <figcaption class="figure-note" style="margin-block-start:var(--s-4)">
          The tuck box carries the same engraving and the claim printed on it:
          &ldquo;${esc(site?.product?.boxClaim || '54 Unique Cards — Hand Illustrated in Exquisite Detail')}&rdquo;.
        </figcaption>
      </figure>
    </div>
  </div>
</section>`;
}

function infoCard(site) {
  const v = site?.voice || {};
  const craft = site?.cardCraft || {};
  const partner = site?.conservation?.partner || 'Trout Unlimited';
  return `
<section class="section section--dark" id="info-card" aria-labelledby="info-h">
  <div class="wrap">
    <div class="section-head">
      <p class="section-num" aria-hidden="true">6&#9829;</p>
      <h2 class="h2" id="info-h">The card that is not a fly</h2>
      <p class="lede">
        ${esc(craft.infoCard || 'A card carries Ken and Audrey&rsquo;s note, the site address and the Trout Unlimited Business mark.')}
      </p>
    </div>

    <div class="cards-pair">
      <figure class="cards-figure">
        <img class="card-face__img"
             src="/cards/info-card-400.webp"
             srcset="/cards/info-card-400.webp 400w, /cards/info-card-800.webp 800w"
             sizes="(min-width: 60rem) 18rem, 70vw"
             width="400" height="559" loading="lazy" decoding="async"
             alt="The info card from The Reel Deal Deck, printed with Ken and Audrey's note and the Trout Unlimited Business member mark">
      </figure>

      <div>
        <blockquote class="cards-quote">
          <p>${esc(v.intro || '')}</p>
          <p>${esc(v.why || '')}</p>
          <p>${esc(v.hope || '')}</p>
          <p>${esc(v.signoff || '')}</p>
          <cite>Ken and Audrey &mdash; printed on the info card</cite>
        </blockquote>
        <p class="figure-note" style="margin-block-start:var(--s-5)">
          The same card carries the ${esc(partner)} Business member mark and
          ${esc(v.handle || '@reeldealdeck')}. We are business members of ${esc(partner)};
          that is a membership anyone can buy, not a partnership or an endorsement.
          <a href="/conservation/">What that does and does not mean</a>.
        </p>
      </div>
    </div>
  </div>
</section>`;
}

function printing(site) {
  const p = site?.product || {};
  const craft = site?.cardCraft || {};
  const rows = [
    ['Printer', p.manufacturer || craft.printer || ''],
    ['Stock', p.stock || ''],
    ['Size', p.dimensions || ''],
    ['Materials', p.material || ''],
    ['Origin', p.origin || ''],
    ['Edition', craft.edition || site?.edition || ''],
  ].filter(([, v]) => v);

  return `
<section class="section" id="printing" aria-labelledby="printing-h">
  <div class="wrap wrap--narrow">
    <div class="section-head">
      <p class="section-num" aria-hidden="true">7&#9829;</p>
      <h2 class="h2" id="printing-h">How it is printed</h2>
      <p class="lede">
        The specification, in the words the manufacturer and the tuck box use.
      </p>
    </div>

    <dl class="cards-spec-list">
      ${rows.map(([k, v]) => `<div class="cards-spec-list__row">
        <dt>${esc(k)}</dt>
        <dd>${esc(v)}</dd>
      </div>`).join('\n      ')}
    </dl>

    <p class="notice notice--info" style="margin-block-start:var(--s-6)">
      <strong>On the count.</strong> The deck is
      &ldquo;${esc(p.boxClaim || '54 Unique Cards')}&rdquo; &mdash; fifty-two standard cards
      plus the two jokers. There is a bonus card in there as well. We will let you find it.
    </p>

    <!-- TODO-CONFIRM: no finish/coating name beyond USPCC's Air-Cushion is in
         data/site.json, and no card-stock weight, tuck-box finish, cellophane
         wrap or seal detail is recorded anywhere. Do not add them from memory. -->
  </div>
</section>`;
}

function styles() {
  /* Scoped to this page. Tokens only — no literal colours. Declared in the
     handover report; fold into components.css if it earns its keep. */
  return `<style>
.cards-anatomy { display: grid; gap: var(--s-7); align-items: start; }
@media (min-width: 52rem) {
  .cards-anatomy { grid-template-columns: minmax(min(16rem, 100%), 20rem) minmax(min(18rem, 100%), 1fr); gap: var(--s-8); }
}
.cards-figure { max-inline-size: 20rem; margin-inline: auto; }
.cards-figure img { inline-size: 100%; height: auto; }

.cards-spec { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--s-5); }
.cards-spec__row { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: var(--s-4); align-items: start; }
.cards-spec__num {
  display: grid; place-items: center;
  inline-size: 2rem; block-size: 2rem;
  border: 1px solid var(--c-border); border-radius: var(--r-pill);
  font-family: var(--f-mono); font-size: var(--t-sm); color: var(--c-text-muted);
}
.cards-spec__label { margin: 0; font-size: var(--t-xs); letter-spacing: var(--ls-wide); text-transform: uppercase; color: var(--c-text-faint); }
.cards-spec__value { margin: var(--s-1) 0 0; font-family: var(--f-display); font-size: var(--t-lg); line-height: var(--lh-snug); color: var(--c-text); }
.cards-spec__note { margin: var(--s-2) 0 0; font-size: var(--t-sm); color: var(--c-text-muted); max-inline-size: var(--measure); }

.cards-ink { border: 1px solid var(--c-border); border-radius: var(--r-card); padding: var(--s-5); }
.cards-ink__glyph { display: block; font-size: var(--t-3xl); line-height: 1; }
.cards-ink__glyph--hearts, .cards-ink__glyph--diamonds { color: var(--c-green); }
.cards-ink__glyph--spades, .cards-ink__glyph--clubs { color: var(--c-bark); }
.cards-ink__name { margin: var(--s-3) 0 0; font-family: var(--f-display); font-size: var(--t-lg); }
.cards-ink__note { margin: var(--s-1) 0 0; font-size: var(--t-sm); color: var(--c-text-muted); }

.cards-suit { margin-block-start: var(--s-8); }
.cards-suit__head { display: flex; flex-wrap: wrap; align-items: baseline; gap: var(--s-2) var(--s-4); }
.cards-suit__head .h3 { margin: 0; }
.cards-suit__glyph { margin-inline-end: var(--s-2); }
.cards-suit__glyph--hearts, .cards-suit__glyph--diamonds { color: var(--c-green); }
.cards-suit__glyph--spades, .cards-suit__glyph--clubs { color: var(--c-bark); }
.cards-suit__meta { margin: 0; font-size: var(--t-sm); color: var(--c-text-faint); }
.cards-suit__mix { display: flex; flex-wrap: wrap; gap: var(--s-2); margin-block: var(--s-4) 0; }
.cards-suit__n { font-family: var(--f-mono); color: var(--c-text-faint); }

.cards-list { list-style: none; margin: var(--s-5) 0 0; padding: 0; display: grid; gap: var(--s-2); grid-template-columns: repeat(auto-fill, minmax(min(15rem, 100%), 1fr)); }
.cards-list__link {
  display: grid; grid-template-columns: 2.75rem minmax(0, 1fr); gap: var(--s-3);
  align-items: center; min-block-size: 2.75rem;
  padding: var(--s-2) var(--s-3);
  border: 1px solid transparent; border-radius: var(--r-sm);
  text-decoration: none; color: inherit;
}
.cards-list__link:hover, .cards-list__link:focus-visible { border-color: var(--c-border); background-color: var(--c-bg-sunk); }
.cards-list__index { font-family: var(--f-mono); font-size: var(--t-sm); letter-spacing: var(--ls-index); color: var(--c-text-muted); }
.cards-list__name { display: block; font-family: var(--f-display); line-height: var(--lh-snug); }
.cards-list__cat { display: block; font-size: var(--t-xs); color: var(--c-text-faint); }

.cards-jokers { display: grid; gap: var(--s-7); align-items: start; }
@media (min-width: 52rem) { .cards-jokers { grid-template-columns: minmax(min(10rem, 100%), 13rem) minmax(min(18rem, 100%), 1fr); gap: var(--s-8); } }
.cards-joker-mark { margin: 0; }
.cards-joker-mark img { inline-size: 100%; max-inline-size: 9rem; height: auto; }
.cards-joker { margin: 0; }
.cards-joker__cap { margin-block-start: var(--s-3); font-size: var(--t-sm); }
.cards-joker__cat { display: block; font-size: var(--t-xs); color: var(--c-text-faint); }

.cards-pair { display: grid; gap: var(--s-7); align-items: start; }
@media (min-width: 52rem) { .cards-pair { grid-template-columns: repeat(auto-fit, minmax(min(18rem, 100%), 1fr)); gap: var(--s-8); } }

.cards-quote { margin: 0; border-inline-start: 2px solid var(--c-green); padding-inline-start: var(--s-5); }
.cards-quote p { margin: 0 0 var(--s-4); font-family: var(--f-display); font-size: var(--t-lg); line-height: var(--lh-snug); }
.cards-quote cite { display: block; font-style: normal; font-size: var(--t-sm); color: var(--c-text-faint); }

.cards-spec-list { margin: 0; display: grid; gap: 0; }
.cards-spec-list__row { display: grid; gap: var(--s-1) var(--s-5); padding-block: var(--s-4); border-block-end: 1px solid var(--c-border); }
@media (min-width: 40rem) { .cards-spec-list__row { grid-template-columns: minmax(min(8rem, 100%), 10rem) minmax(0, 1fr); } }
.cards-spec-list dt { font-size: var(--t-xs); letter-spacing: var(--ls-wide); text-transform: uppercase; color: var(--c-text-faint); }
.cards-spec-list dd { margin: 0; color: var(--c-text); }
</style>`;
}

/* ------------------------------------------------------------------ page -- */

export default function cardsPage({ site }) {
  const v = site?.voice || {};
  const count = CARDS.length;

  return `${styles()}
<section class="page-head">
  <div class="wrap">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li><a href="/">Home</a></li>
        <li><span aria-current="page">What&rsquo;s in the deck</span></li>
      </ol>
    </nav>
    <p class="eyebrow" style="margin-block-start:var(--s-5)">${esc(site?.cardCraft?.edition || site?.edition || 'Volume 1')} &middot; every card explained</p>
    <h1 class="h1 page-head__title">${esc(v.shortLine || 'Hand-drawn playing cards that teach while you play.')}</h1>
    <p class="lede page-head__lede">
      That is Ken and Audrey&rsquo;s description, printed on a card inside the deck. This page
      is the long version, for anyone who likes knowing how a thing was made: what is on a card,
      why the suits came out green and brown, what is in each one, and who prints it. It says
      Volume 1 on the box for a reason &mdash; <a href="/suggest/">tell us what goes in the next one</a>.
    </p>
  </div>
</section>

${anatomy()}
${suitInk(site)}
${suitContents()}
${specials(site)}
${backAndBox(site)}
${infoCard(site)}
${printing(site)}

<section class="section section--sunk" aria-labelledby="next-h">
  <div class="wrap wrap--narrow">
    <p class="section-num" aria-hidden="true">8&#9829;</p>
    <h2 class="h2" id="next-h" style="margin-block-start:var(--s-4)">Where to go next</h2>
    <p class="lede" style="margin-block-start:var(--s-4)">
      Every fly above has a free page. The deck is the same thing, in your hands, on cards
      you can actually deal.
    </p>
    <p class="cluster" style="margin-block-start:var(--s-6);--gap:var(--s-3)">
      ${campaignCta(site)}
      <a class="btn btn--ghost" href="/flies/">Browse the Fly-brary</a>
      <a class="btn btn--quiet" href="/story/">Meet Ken and Audrey</a>
    </p>
  </div>
</section>
`;
}
