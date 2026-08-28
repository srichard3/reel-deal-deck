/* Shared helpers for the Fly-brary templates.
   Kept dependency-free and deliberately small — the homepage carries its own
   copy of the art so it can render before data/flies.json exists. */

export const esc = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const SUITS = { spade: '♠', heart: '♥', diamond: '♦', club: '♣', joker: '★' };
export const SUIT_NAME = { '♠': 'spades', '♥': 'hearts', '♦': 'diamonds', '♣': 'clubs', '★': 'joker' };

export const TYPES = {
  dry:         { label: 'Dry fly',    plural: 'Dry flies',    anchor: 'dry' },
  emerger:     { label: 'Emerger',    plural: 'Emergers',     anchor: 'emerger' },
  midge:       { label: 'Midge',      plural: 'Midges',       anchor: 'midge' },
  nymph:       { label: 'Nymph',      plural: 'Nymphs',       anchor: 'nymph' },
  wet:         { label: 'Wet fly',    plural: 'Wet flies',    anchor: 'wet' },
  terrestrial: { label: 'Terrestrial',plural: 'Terrestrials', anchor: 'terrestrial' },
  streamer:    { label: 'Streamer',   plural: 'Streamers',    anchor: 'streamer' },
  popper:      { label: 'Popper',     plural: 'Poppers',      anchor: 'popper' },
  attractor:   { label: 'Attractor',  plural: 'Attractors',   anchor: 'attractor' },
  egg:         { label: 'Egg',        plural: 'Egg patterns', anchor: 'egg' },
  worm:        { label: 'Worm',       plural: 'Worm patterns',anchor: 'worm' },
};

/** Order sections read in on the library index — roughly surface to bottom. */
export const TYPE_ORDER = ['dry', 'emerger', 'terrestrial', 'midge', 'nymph', 'wet',
                           'streamer', 'popper', 'egg', 'worm', 'attractor'];

/** Normalise however the data spells a suit ("spades", "spade", "♠") to a key. */
export function suitKey(fly) {
  const raw = String(fly?.card?.suit || '').toLowerCase().replace(/s$/, '');
  if (raw in SUITS) return `${raw}s`.replace('jokers', 'joker');
  const fromGlyph = Object.entries(SUITS).find(([, g]) => g === raw);
  return fromGlyph ? `${fromGlyph[0]}s`.replace('jokers', 'joker') : 'spades';
}

export const suitGlyph = (fly) => {
  const k = suitKey(fly).replace(/s$/, '');
  return SUITS[k] || SUITS.spade;
};

export const cardIndex = (fly) =>
  fly?.card?.rank === 'JOKER' ? '★' : `${fly?.card?.rank ?? ''}${suitGlyph(fly)}`;

/** Human label for a card, for screen readers. */
export function cardLabel(fly) {
  if (fly?.card?.rank === 'JOKER') return 'Joker';
  const rank = { A: 'Ace', K: 'King', Q: 'Queen', J: 'Jack' }[fly?.card?.rank] || fly?.card?.rank;
  return `${rank} of ${suitKey(fly)}`;
}

const HOOK = `
  <circle cx="23" cy="27" r="4.4"/>
  <path d="M27.4 27H82c10.6 0 17.4 8.6 17.4 18.8 0 10.6-8.6 18.6-19.6 18.6-9.4 0-16.6-5.4-19-13.2"/>`;

const ART = {
  dry: `
      <path d="M50 27c-6-8-12-11-20-11.6"/><path d="M50 27c-6 8-12 11-20 11.6"/>
      <path d="M56 21c12-7 24-8 36-4"/><path d="M56 33c12 7 24 8 36 4"/>
      <path d="M52 20v-8M56 19.6l4-7.4"/>`,
  nymph: `
      <path d="M40 20.6h28c4 0 6.6 2.8 6.6 6.4s-2.6 6.4-6.6 6.4H40c-4 0-6.6-2.8-6.6-6.4S36 20.6 40 20.6Z"/>
      <path d="M44 20.6v13M50 20.6v13M56 20.6v13M62 20.6v13"/>
      <path d="M40 20.6c-4-4-8-6-13-6.6M40 33.4c-4 4-8 6-13 6.6"/>
      <path d="M74.6 27c7 0 13-2.6 17.4-7M74.6 27c7 0 13 2.6 17.4 7"/>`,
  streamer: `
      <path d="M50 24.6c-5-4.6-9-6-14-6.4"/><path d="M50 29.4c-5 4-9 5.4-14 5.6"/>
      <path d="M56 24c14.6-4.6 27.4-4.4 39.4 1.2"/>
      <path d="M56 27c14.6-1 27.4 1.6 38.4 8"/>
      <path d="M56 30c13.4 2.4 24.6 7.6 33.6 15.4"/>
      <path d="M61 25.6 59.4 31.6M67.4 25 65.8 31.4M74 25 72.4 31.6"/>`,
  terrestrial: `
      <path d="M40 21.6h30c3.4 0 5.6 2.4 5.6 5.6s-2.2 5.6-5.6 5.6H40c-3.4 0-5.6-2.4-5.6-5.6S36.6 21.6 40 21.6Z"/>
      <path d="M46 21.6 38.6 9.6M46 33l-8 11.4M66 21.6l8-12M66 33l8.4 11.6"/>
      <path d="M56 21.6v-9M56 33v8.6"/>`,
  egg: `
      <ellipse cx="56" cy="27" rx="17" ry="14.4"/>
      <path d="M47 20.4c3-2.6 7-3.6 11-2.8"/>`,
  worm: `
      <path d="M34 27c4-7.4 10-7.4 14 0s10 7.4 14 0 10-7.4 14 0"/>
      <path d="M34 33.6c4-7.4 10-7.4 14 0s10 7.4 14 0 10-7.4 14 0"/>`,
};

const ART_ALIAS = { wet: 'nymph', attractor: 'dry' };

/** Engraved single-weight line art, keyed by fly type. No photography exists
    and none is wanted — the deck's whole argument is that the drawings are original. */
export function flyArt(type, cls = 'playing-card__art') {
  const key = ART[type] ? type : ART_ALIAS[type] || 'dry';
  return `<svg class="${cls}" viewBox="0 0 112 74" role="img" aria-hidden="true" focusable="false"
  fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
  ${HOOK}${ART[key]}
</svg>`;
}

/* --- The real thing -------------------------------------------------------
   Every card in the deck is now a photograph-quality render of the printed
   v8 face, so the site shows the actual product rather than a CSS sketch.
   Sources live in static/cards/<slug>-{400,800}.webp.
   Sources are cropped to the printed card edge, so the artwork IS the card:
   the true 2.5x3.5 poker ratio, no surrounding white margin. width/height are
   declared to reserve layout space and keep CLS at zero.                  */

export const CARD_W = 400;
export const CARD_H = 559;

/** <img> for a card face. `size` picks the art direction, not the file only. */
export function cardImage(fly, {
  eager = false,
  /* The library grid is 6-up on desktop (~11rem a card), 3-up on tablet, 2-up
     on a phone. Declaring that honestly keeps the browser on the 400w file
     instead of pulling the 800w for a thumbnail 55 times over. */
  sizes = '(min-width: 64rem) 11rem, (min-width: 34rem) 22vw, 44vw',
} = {}) {
  const base = esc(fly.image || `/cards/${fly.slug}`);
  return `<img class="card-face__img"
      src="${base}-400.webp"
      srcset="${base}-400.webp 400w, ${base}-800.webp 800w"
      sizes="${esc(sizes)}"
      width="${CARD_W}" height="${CARD_H}"
      loading="${eager ? 'eager' : 'lazy'}" decoding="async"
      alt="${esc(fly.name)} — ${esc(cardLabel(fly))} from The Reel Deal Deck, showing the hand-drawn fly and its description">`;
}

/** A card face, linked to its Fly-brary page. */
export function flyCard(fly, { link = true, eager = false } = {}) {
  const inner = `${cardImage(fly, { eager })}
      <span class="visually-hidden">${esc(fly.name)} — ${esc(fly.cardCategory || '')}</span>`;
  return link
    ? `<a class="card-face" href="/flies/${esc(fly.slug)}/">${inner}</a>`
    : `<figure class="card-face">${inner}</figure>`;
}

export const titleCase = (s) => String(s).charAt(0).toUpperCase() + String(s).slice(1);
