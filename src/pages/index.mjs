/**
 * Homepage — The Reel Deal Deck
 *
 * Four sections and nothing else: the deck in three dimensions with a way to
 * order it, four facts about what is in the box, the Instagram strip, and a
 * handful of the real printed cards.
 *
 * It used to be ten sections — the makers, the library, the Virtual Guide, a
 * matching game, a differentiators grid, an audience chooser and an email
 * capture. Every one of those is a page of its own, reached from the nav, the
 * Fly-brary or the footer, and a homepage that explains all of them explains
 * none of them. The game lives on in src/js/feed.js if it ever earns a page.
 *
 * Note on data: `flies` may legitimately be an empty array (data/flies.json is
 * the Fly-brary's source of truth and is populated separately). Every read
 * below is defensive; when there is no data the fly strip simply does not
 * render, and nothing else on the page depends on it.
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
import { orderCta, organizationSchema, instagramStrip, tuckBox } from '../templates/_blocks.mjs';

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/* ------------------------------------------------------------- sections --- */

/* ------------------------------------------------------------- the fan ----
 * All 54 printed faces, spread the way a deck is spread on a table.
 *
 * The layout is one rotation per card about a pivot well below the fan, which
 * is how a real fan works and means the browser does the trigonometry: every
 * card sits at the same place in the DOM and differs only by `--i`. No JS, no
 * canvas, no library. At rest about 18px of each card shows, which is what a
 * fanned deck in a pair of hands looks like — the interaction is what makes a
 * card readable, not the resting state. That 18px is also the ceiling: the
 * exposed strip is (fan width - card width) / 53, and the fan width is capped
 * by the viewport, so 54 cards cannot show more of themselves than this at any
 * card size. See the target-size note in components.css.
 *
 * Hovering or tabbing to a card lifts it out of the fan and scales it up, and
 * its neighbors lean away to make room. That second part is the thing that
 * makes it feel like cards rather than a CSS trick, and it is done with sibling
 * selectors in components.css rather than script.
 *
 * Every card is a link to that fly's page, so this is also 54 internal links
 * from the homepage into the Fly-brary — the strip it replaced had six.
 *
 * Weight. The card faces are the one real cost of this section, so each <img>
 * offers a 240 and a 400 and the `sizes` stops match what the CSS actually
 * renders: 104px under 46rem (the coarse-pointer size), 13vw up to 64rem, then
 * the 150px cap. A phone at 2x therefore takes the 240s and a desktop retina
 * screen takes the 400s, which is the split worth having. Everything is
 * loading="lazy" and the section is well below the fold.
 *
 * Deck order, not file order: spades, hearts, diamonds, clubs, then the two
 * jokers, so it reads as a deck someone opened rather than a shuffled pile.
 * The bonus card is excluded here as it is excluded from every count.
 */
const FAN_SUITS = ['spades', 'hearts', 'diamonds', 'clubs', 'joker'];
const FAN_RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'JOKER'];

function cardFan(flies) {
  const all = (Array.isArray(flies) ? flies : [])
    .filter((f) => !f.bonus && f.slug && f.name && f.image)
    .sort((a, b) => {
      const ca = a.card || {}, cb = b.card || {};
      return (FAN_SUITS.indexOf(ca.suit) - FAN_SUITS.indexOf(cb.suit))
          || (FAN_RANKS.indexOf(ca.rank) - FAN_RANKS.indexOf(cb.rank));
    });
  const list = all;
  if (list.length < 8) return '';          /* not a fan — show nothing */

  const mid = (list.length - 1) / 2;

  const card = (f, i) => {
    const c = f.card || {};
    const label = c.rank === 'JOKER' ? 'Joker' : `${c.rank || ''}${SUIT_GLYPH[c.suit] || ''}`;
    /* Three layers, and the split matters: .fan__card and .fan__link never
       move, and every visual transform happens on .fan__art inside them. See
       the note on .fan__art in components.css — when the card itself grew, it
       moved out from under the pointer and the hover oscillated.

       `sizes` has to describe what the fan REALLY renders, or the browser buys
       the wrong file. It used to claim 104px on phones, written before the fan
       was made to fit the screen on touch — the cards are 46px there now, so
       every phone was fetching a 240w to paint 46 CSS px. 13vw is accurate from
       375px all the way up until the clamp caps the card at 150px, which is
       72rem, so the whole thing is two clauses.

       Candidates follow from that: 160w covers a phone at 3x (146px), 300w
       covers every desktop at 2x (267-300px), 400w is there for 3x desktop. */
    return `      <li class="fan__card" style="--i:${i}">
        <a class="fan__link" href="/flies/${esc(f.slug)}/">
          <span class="fan__art">
            <img class="fan__img" src="${esc(f.image)}-300.webp"
                 srcset="${esc(f.image)}-160.webp 160w, ${esc(f.image)}-300.webp 300w, ${esc(f.image)}-400.webp 400w"
                 sizes="(max-width: 72rem) 13vw, 150px"
                 width="400" height="559"
                 loading="lazy" decoding="async" draggable="false" alt="">
          </span>
          <span class="fan__name">${esc(f.name)}${label ? ` <span class="fan__idx">${label}</span>` : ''}</span>
        </a>
      </li>`;
  };

  /* The scrub pad is deliberately the FIRST child and sits below every card in
     the stacking order. It still receives every touch, because the whole fan is
     pointer-events:none — the card, the link and the art all are, and on a
     coarse pointer the sliver is switched off too. So on a phone the pad is the
     only thing in the fan that hits, which is what lets a drag walk the deck
     without any card's anchor firing. The one exception is the picked card's
     art, which is given pointer-events:auto and a z-index above the pad, so a
     second tap lands on its link and navigates.

     It is inert on a mouse: fan.js never arms it, and CSS leaves it
     pointer-events:none outside (hover: none). Desktop is untouched. */
  return `
    <div class="fan-stage" data-fan-stage>
      <ul class="fan" style="--fan-n:${list.length};--fan-mid:${mid}">
        <li class="fan__scrub" data-fan-scrub aria-hidden="true"></li>
${list.map(card).join('\n')}
      </ul>
    </div>`;
}

const SUIT_GLYPH = { hearts: '♥', diamonds: '♦', spades: '♠', clubs: '♣', joker: '' };

/* ------------------------------------------------------------------ page -- */

export default function homepage({ site, flies, instagram }) {
  /* `meta` is module-level, so `site` is not in scope there. build.mjs reads
     meta after this runs, so the canonical entity is patched in here. */
  const orgIdx = meta.jsonld.findIndex((n) => n['@type'] === 'Organization');
  if (orgIdx > -1) meta.jsonld[orgIdx] = { '@context': 'https://schema.org', ...organizationSchema(site, { full: true }) };

  const f = Array.isArray(flies) ? flies : [];
  const v = site?.voice ?? {};
  const count = site?.product?.cardCount ?? 54;
  const partner = site?.conservation?.partner ?? 'Trout Unlimited';
  const city = site?.location?.city ?? 'Eagle';
  const regionName = site?.location?.regionName ?? 'Idaho';
  const shortLine = v.shortLine || 'Hand-drawn playing cards that teach while you play.';
  const retail = site?.pricing?.retail ?? {};
  const per = retail.perDeck ?? 19.95;
  const money = (n) => (Number.isInteger(n) ? `$${n}` : `$${Number(n).toFixed(2)}`);

  return `
<section class="hero">
  <div class="wrap hero__grid">
    <div>
      <p class="eyebrow">Ken &amp; Audrey &middot; ${esc(city)}, ${esc(regionName)}</p>
      <h1 class="h1 hero__title">${esc(shortLine)}</h1>
      <!-- Sell the idea, not the provenance. This used to open "That is our
           line, and it is printed on a card tucked inside the deck" — a
           footnote to the headline the reader had just read, with the actual
           reason to want one buried at the end. The hook is that you learn the
           patterns by playing cards with them; everything else supports it. -->
      <p class="lede hero__lede">
        ${esc(count)} flies, drawn by hand, one to a card. Each says what it imitates and the
        hook sizes it is tied in, so the patterns stick without it ever feeling like homework.
        Real Bicycle stock. Fits a vest pocket.
      </p>
      <div class="cluster hero__actions" style="--gap:var(--s-3)">
        ${orderCta(site, { variant: 'primary' })}
      </div>
      <!-- "Still just the two of us" was an apology. Two people in Idaho making
           this by hand is the selling point, so it is stated, not conceded. -->
      <p class="hero__note">
        ${money(per)} a deck, free shipping on two or more. Made in the USA by a father and
        daughter in ${esc(city)}, ${esc(regionName)}.
      </p>
    </div>
    ${tuckBox({ eager: true })}
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
      <span class="stat__num">USA</span>
      <span class="stat__label">Drawn in ${esc(city)}, ${esc(regionName)} &middot; printed in the USA</span>
    </div>
  </div>
</section>


<!-- ======================================================== THE CARDS == -->
<!-- All 54, fanned. See cardFan() above and the .fan block in components.css. -->
<section class="section" id="in-the-deck" aria-labelledby="deck-h">
  <div class="wrap">
    <div class="section-head section-head--split">
      <div>
        <p class="section-num" aria-hidden="true">2&#9829;</p>
        <h2 class="h2" id="deck-h">Pick one up</h2>
        <p class="lede">The whole deck, from the Adams to the San Juan Worm.</p>
      </div>
      <p><a class="btn btn--ghost" href="/flies/">Open Our Fly-brary</a></p>
    </div>
  </div>

${cardFan(f)}

  <div class="wrap">
    <p class="fan-foot text-muted">
      <a href="/cards/">What is on a card</a>, and why the suits came out green and brown.
    </p>
  </div>
</section>

${instagramStrip(site, instagram, {
  title: 'Follow along while we make it',
  blurb: 'Prototypes, print proofs, trips, and the odd fish that had nothing to do with work.',
})}

<script src="/js/box.js" defer></script>
<script src="/js/fan.js" defer></script>
`;
}
