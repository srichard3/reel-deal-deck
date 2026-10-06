/**
 * /deck/ — the product page.
 *
 * Ordering is live. Checkout is hosted on Shopify, and this page never names
 * it: every buy button comes through orderCta() / orderState(), which read
 * `site.shop`. Until that URL is filled in, those buttons land on #order —
 * the pricing panel below — which is the honest fallback, because the prices
 * on this page are real.
 *
 * Every number here is read from `site.pricing`. Do not type a price into this
 * file. /wholesale/ quotes the same figures and they have drifted apart once.
 */

import { orderCta, orderState, organizationSchema, tuckBox } from '../templates/_blocks.mjs';
const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* Thousands separators matter here: the master case is $1,291.68, and
   "$1291.68" reads as a typo on the one figure big enough to need checking. */
function money(n) {
  const v = Number(n);
  return '$' + v.toLocaleString('en-US', {
    minimumFractionDigits: Number.isInteger(v) ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

/* The free-shipping threshold reads as a numeral in a table and as a word in a
   sentence, and it is the same figure from site.pricing in both places. */
const lowerFirst = (str) => String(str).charAt(0).toLowerCase() + String(str).slice(1);

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const inWords = (n) => WORDS[n] || String(n);

/* ---------------------------------------------------------------- meta -- */

export const meta = {
  path: '/deck/',
  title: '54 Hand-Drawn Fly Fishing Cards',
  description:
    '54 original hand-drawn flies, each with what it imitates, on genuine Bicycle stock. $19.95 a deck, and shipping is free on two or more. Made in the USA.',
  priority: 1.0,
  changefreq: 'weekly',
  bodyClass: 'page-deck',
  ogImage: '/og/deck.png',
  jsonld: [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'The Reel Deal Deck',
      description:
        'A 54-card fly-fishing playing card deck. Every card is an original hand-drawn fly with a description of what it imitates, printed on genuine Bicycle / USPCC stock with the patented Air-Cushion finish.',
      brand: { '@type': 'Brand', name: 'The Reel Deal Deck', slogan: 'Hand-drawn playing cards that teach while you play.' },
      category: 'Playing Cards',
      material: 'FSC-certified paper, starch-based laminating glue, vegetable-based inks',
      size: 'Poker size, 2.5in x 3.5in',
      url: 'https://reeldealdeck.com/deck/',
      countryOfOrigin: 'US',
      additionalProperty: [
        { '@type': 'PropertyValue', name: 'Cards', value: '54' },
        { '@type': 'PropertyValue', name: 'Stock', value: 'Genuine Bicycle / USPCC with Air-Cushion finish' },
        { '@type': 'PropertyValue', name: 'Origin', value: 'Made in the USA' },
      ],
      /* price, availability and the shipping rule are filled in the render,
         where `site.pricing` is in scope. Never type a price here. */
      offers: null,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://reeldealdeck.com/' },
        { '@type': 'ListItem', position: 2, name: 'The Deck', item: 'https://reeldealdeck.com/deck/' },
      ],
    },
  ],
};

/* ------------------------------------------------------------ partials -- */

/* The two retail cards.
 *
 * The big figure is the DECK, on both cards, and it is the same number on both
 * because it is the same deck at the same price. What differs is the shipping,
 * so that is the highlighted band rather than a gray line: "+ $6.95 shipping"
 * against "Free shipping". The delivered total sits underneath as the sum.
 *
 * An earlier version made the big figure the delivered total, which put $26.90
 * in the largest type on the page next to a $19.95 product. The comparison was
 * right and the headline number was wrong.
 *
 * Every figure is derived from site.pricing. None is typed.
 *
 * BOTH cards carry a flag, and they have to. Without one on the first card, the
 * featured card's flag pushed its own name, price, shipping band and list a
 * line lower and the pair read as crooked. An empty reserved row would fix the
 * geometry, but "Standard" against "Save $6.95" also names the choice, so the
 * row earns its place instead of being invisible scaffolding. The subgrid in
 * commerce.css then keeps every row level even when a line wraps on one card
 * and not the other.
 */
function retailCards(site) {
  const r = (site.pricing || {}).retail || {};
  const per = r.perDeck ?? 19.95;
  const ship = r.shipping ?? 6.95;
  const from = r.freeShippingFromDecks ?? 2;

  /* The same three points on both cards, because it is the same deck — these
     are the three things the whole site leads with. The second card adds the
     one thing that genuinely differs. Listing different features on each would
     imply you get a different product. */
  const POINTS = [
    `${site.product?.cardCount ?? 54} original hand-drawn flies, one per card`,
    'What each one imitates, printed on the card',
    /* Only the leading letter: toLowerCase() on the whole string turned
       "Made in the USA" into "made in the usa" and ate the acronym. */
    `Genuine Bicycle stock, ${lowerFirst(site.product?.origin ?? 'Made in the USA')}`,
  ];

  const cards = [
    {
      name: 'One deck',
      flag: 'Standard',
      lede: 'Fifty-four flies in a jacket pocket.',
      shipLead: `+ ${money(ship)}`,
      shipRest: 'shipping',
      delivered: `${money(per + ship)} delivered`,
      points: POINTS,
    },
    {
      name: `${inWords(from).replace(/^t/, 'T')} or more`,
      lede: 'One for the vest, one for whoever keeps borrowing it.',
      featured: true,
      flag: `Save ${money(ship)}`,
      shipLead: 'Free',
      shipRest: 'shipping',
      delivered: `${money(per * from)} delivered, for ${inWords(from)}`,
      points: [...POINTS, 'Free shipping'],
    },
  ];

  return cards.map((t) => `
      <article class="buy-tier${t.featured ? ' buy-tier--featured' : ''}">
        <p class="buy-tier__flag">${esc(t.flag)}</p>
        <h2 class="buy-tier__name">${esc(t.name)}</h2>
        <p class="buy-tier__lede">${esc(t.lede)}</p>

        <p class="buy-tier__amount">
          <span class="buy-tier__figure" data-price="${per}">${money(per)}</span>
          <span class="buy-tier__unit">a deck</span>
        </p>

        <p class="buy-tier__ship">
          <span class="buy-tier__ship-lead">${esc(t.shipLead)}</span>
          <span class="buy-tier__ship-rest">${esc(t.shipRest)}</span>
        </p>
        <p class="buy-tier__breakdown">${esc(t.delivered)}</p>

        <ul class="buy-tier__list">
          ${t.points.map((p) => `<li>${esc(p)}</li>`).join('\n          ')}
        </ul>

        <div class="buy-tier__foot">
          ${orderCta(site, { variant: t.featured ? 'primary' : 'ghost' })}
        </div>
      </article>`).join('\n');
}

/* ---------------------------------------------------------------- page -- */

export default function deckPage({ site }) {
  const p = site.product || {};
  const pr = site.pricing || {};
  const r = pr.retail || {};
  const per = r.perDeck ?? 19.95;
  const ship = r.shipping ?? 6.95;
  const from = r.freeShippingFromDecks ?? 2;
  const shop = orderState(site);

  /* `meta` is a module-level constant, so `site` is not in scope up there.
     build.mjs reads meta AFTER this function runs, so patching it here is the
     established pattern (see pages/flies.mjs). */
  const org = organizationSchema(site, { full: true });
  for (const node of meta.jsonld) {
    if (node['@type'] !== 'Product') continue;
    node.brand = { '@type': 'Brand', name: site.brand?.name || site.name, slogan: site.brand?.slogan };
    node.offers = {
      '@type': 'Offer',
      price: per.toFixed(2),
      priceCurrency: pr.currency || 'USD',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      url: 'https://reeldealdeck.com/deck/',
      seller: organizationSchema(site),
      /* The free-shipping threshold is a real offer term, so it is described
         rather than implied: one deck carries postage, two or more do not. */
      shippingDetails: [
        {
          '@type': 'OfferShippingDetails',
          shippingRate: { '@type': 'MonetaryAmount', value: ship.toFixed(2), currency: pr.currency || 'USD' },
          shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'US' },
          description: `Flat ${money(ship)} on a single deck.`,
        },
        {
          '@type': 'OfferShippingDetails',
          shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: pr.currency || 'USD' },
          shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'US' },
          description: `Free on orders of ${from} decks or more.`,
        },
      ],
    };
  }
  if (!meta.jsonld.some((n) => n['@type'] === 'Organization')) meta.jsonld.push({ '@context': 'https://schema.org', ...org });

  return `
<nav class="breadcrumbs wrap" aria-label="Breadcrumb">
  <a href="/">Home</a> <span aria-hidden="true">/</span> <span aria-current="page">The Deck</span>
</nav>

<!-- The hero visual is the interactive tuck box, the same one as the homepage,
     rather than the flat product photograph it used to be. It is the real
     printed artwork either way, but here a reader can turn it over and look at
     the back and the spine, which is the nearest thing a website has to picking
     the box up in a shop. box.js is loaded at the foot of this page for it. -->
<section class="section wrap">
  <div class="buy-hero">
    <div class="buy-hero__art">
      ${tuckBox({ eager: true })}
      <!-- No caption here: box.js injects a "Drag to turn it" hint itself, so
           the prompt only ever appears when the dragging actually works. A
           static one beside it rendered the instruction twice. -->
    </div>

    <div class="buy-hero__copy">
      <p class="eyebrow">The Deck</p>
      <h1 class="h1">${esc(p.name || site.name)}</h1>
      <p class="lede">
        ${esc(p.cardCount)} flies, every one drawn by hand, on genuine Bicycle stock.
        ${esc(p.origin || 'Made in the USA')}.
      </p>

      <div class="buy-price">
        <span class="buy-price__amount" data-price="${per}">${money(per)}</span>
        <span class="buy-price__unit">a deck &middot; ${money(ship)} postage, free from ${esc(inWords(from))}</span>
      </div>

      <p class="buy-avail">
        <span class="buy-avail__dot" aria-hidden="true"></span>
        Ordering now
      </p>

      ${shop.ready ? '' : `<p class="buy-hero__note">
        Checkout is being set up, so this button goes to the prices rather than to a cart.
      </p>`}

      <div class="cluster">
        ${orderCta(site)}
        <a class="btn btn--ghost btn--lg" href="/wholesale/">Wholesale</a>
      </div>
    </div>
  </div>
</section>

<!-- ======================================================== THE PRICES == -->
<!-- id="order" is the fallback target for every order CTA on the site while
     site.shop.url is empty — see orderState(). Do not rename it without
     changing site.shop.fallback. -->
<section class="section section--sunk" id="order">
  <div class="wrap">
    <p class="eyebrow">Price</p>

    <!-- Confirmed by Ken and Audrey: ${money(per)} retail, ${money(ship)} shipping on a single deck,
         free from ${esc(from)} up, and checked against real per-unit cost on
         their side. The wholesale figures live on /wholesale/.

         Domestic only by design. International rates are not set and are not
         mentioned anywhere on the site.

         Every figure on this page is read from site.pricing in data/site.json.
         /wholesale/ reads the same block. Never type a price into a page. -->

    <div class="buy-tiers">
${retailCards(site)}
    </div>
  </div>
</section>

<!-- ===================================================== CONSERVATION == -->
<section class="section section--sunk">
  <div class="wrap wrap--narrow text-center stack" style="--gap:var(--s-4)">
    <p class="eyebrow">Conservation</p>
    <h2 class="h2">${esc((site.conservation || {}).partner)} gets a cut of every deck</h2>
    <p class="lede mx-auto">
      A deck of flies is a nice object. Water with fish in it is the point.
    </p>
    <p class="cluster" style="justify-content:center">
      ${orderCta(site)}
      <a class="btn btn--ghost" href="/conservation/">How the contribution works</a>
    </p>
  </div>
</section>

<script src="/js/box.js" defer></script>
`;
}
