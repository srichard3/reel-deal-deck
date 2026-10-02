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
import { orderCta, organizationSchema, instagramStrip } from '../templates/_blocks.mjs';

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

/* ------------------------------------------------------------------ page -- */

export default function homepage({ site, flies, instagram }) {
  /* `meta` is module-level, so `site` is not in scope there. build.mjs reads
     meta after this runs, so the canonical entity is patched in here. */
  const orgIdx = meta.jsonld.findIndex((n) => n['@type'] === 'Organization');
  if (orgIdx > -1) meta.jsonld[orgIdx] = { '@context': 'https://schema.org', ...organizationSchema(site, { full: true }) };

  const f = Array.isArray(flies) ? flies : [];
  const v = site?.voice ?? {};
  const craft = site?.cardCraft ?? {};
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
      <p class="lede hero__lede">
        That is our line, and it is printed on a card tucked inside the deck. ${esc(count)} flies,
        every one drawn by hand, on genuine Bicycle stock &mdash; so it deals like a proper deck of
        cards and still earns its place in a vest pocket.
      </p>
      <div class="cluster hero__actions" style="--gap:var(--s-3)">
        ${orderCta(site, { variant: 'primary' })}
        <a class="btn btn--ghost btn--lg" href="/deck/">See the deck</a>
      </div>
      <p class="hero__note">
        ${money(per)} a deck, printed in the USA, and from two up we cover the shipping.
        Still just the two of us, in ${esc(city)}, ${esc(regionName)}.
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
      <span class="stat__num">USA</span>
      <span class="stat__label">Drawn in ${esc(city)}, ${esc(regionName)} &middot; printed in the USA</span>
    </div>
  </div>
</section>

${instagramStrip(site, instagram, {
  title: 'Follow along while we make it',
  blurb: 'We put the whole thing on Instagram as it happens \u2014 prototypes, print proofs, trips, and the odd fish that had nothing to do with work. Tap any of these to open it.',
})}

<!-- ======================================================== THE CARDS == -->
<!-- The one section on this page that is not the box, the facts or Instagram:
     six real printed faces. Picked across suits and categories so the strip
     shows the range rather than six nymphs. -->
<section class="section" id="in-the-deck" aria-labelledby="deck-h">
  <div class="wrap">
    <div class="section-head section-head--split">
      <div>
        <p class="section-num" aria-hidden="true">2&#9829;</p>
        <h2 class="h2" id="deck-h">Six of the fifty-four</h2>
        <p class="lede">
          ${esc(craft.eachCard || 'Every card shows the rank and suit, the fly&rsquo;s name, its category, the hand-drawn fly itself, a plain-English note on what it imitates, and the hook sizes it is usually tied in.')}
        </p>
      </div>
      <p><a class="btn btn--ghost" href="/cards/">Anatomy of a card</a></p>
    </div>
${flyStrip(f, ['adams', 'parachute-adams', 'woolly-bugger', 'grasshopper', 'copper-john', 'san-juan-worm'])}

    <p class="text-muted" style="margin-block-start:var(--s-6)">
      Every one of these is a real printed face, and all ${esc(count)} are written out free in
      <a href="/flies/">the Fly-brary</a> &mdash; what each fly imitates, when it works, and how to
      fish it.
    </p>
  </div>
</section>

<script src="/js/box.js" defer></script>
`;
}
