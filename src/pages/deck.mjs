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

import { orderCta, orderLine, orderState, organizationSchema, instagramStrip } from '../templates/_blocks.mjs';
const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function money(n) {
  return Number.isInteger(n) ? `$${n}` : `$${Number(n).toFixed(2)}`;
}

/* The free-shipping threshold reads as a numeral in a table and as a word in a
   sentence, and it is the same figure from site.pricing in both places. */
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const inWords = (n) => WORDS[n] || String(n);

/* ----------------------------------------------------------------- FAQ -- */
/* These are the only questions rendered, and therefore the only questions in
   the FAQPage JSON-LD. Keep the two lists identical. */

const FAQ = [
  {
    q: 'What does shipping cost?',
    a: [
      'One deck is $19.95 plus $6.95 shipping. Two or more decks are $19.95 each and we pay the shipping.',
      'There is no quantity discount hiding in there — the deck is the same price either way. The second deck simply arrives in the same envelope, so it costs us nothing to send, and we would rather hand that back than keep it.',
    ],
  },
  {
    q: 'Is this a real, playable deck of cards?',
    a: [
      'Yes. Fifty-four cards, poker size, 2.5 by 3.5 inches, printed on genuine Bicycle / USPCC stock with the patented Air-Cushion finish. You can deal a hand of poker on a tailgate with it and it will handle like the deck in your kitchen drawer, because it is made on the same line.',
      'It is a reference you happen to be able to play cards with, not a novelty that falls apart the second time you shuffle it.',
    ],
  },
  {
    q: 'What is it actually printed on?',
    a: [
      'Genuine Bicycle / USPCC card stock with the patented Air-Cushion finish, on FSC-certified paper, using starch-based laminating glue and vegetable-based inks.',
      'That is a specific, checkable answer. Most fly-fishing card sets are printed on generic 300gsm board, which is why they feel like a business card and fan like one too.',
    ],
  },
  {
    q: 'Where is it made?',
    a: [
      'In the United States, start to finish. The flies were drawn in Eagle, Idaho, the cards are printed by The United States Playing Card Company, and the two of us pack and post them.',
      'It is the same choice as the card stock, arrived at the same way: the printer we wanted for how the cards feel happens to be an American one, so the stock decision and the origin decision turned out to be one decision.',
    ],
  },
  {
    q: 'Why is it $19.95 when I can find fly-fishing cards for ten dollars?',
    a: [
      'Because you are buying different things. The cheaper sets use photography or licensed stock art on generic board. Every fly in this deck was drawn by hand, one at a time, and it is printed on real playing card stock in the United States.',
      'And because a deck priced at twelve dollars does not survive its own fees, shipping and manufacturing. We would rather charge a price that lets us print a second run than a price that quietly kills the project.',
    ],
  },
  {
    q: 'Do I need to know anything about fly fishing to enjoy it?',
    a: [
      'No. Every card says what the fly imitates in plain language, so the deck teaches while you flip through it. Beginners use it as a field reference; people who have fished for thirty years use it to settle arguments.',
      'If you are buying for someone else and you do not fish yourself, start with the gift guide instead.',
    ],
  },
  {
    q: 'Can I buy these for my shop, lodge or guide service?',
    a: [
      'Yes, and it is the part of this business we are most serious about. Wholesale is sold by the brick — a box of twelve decks — or by the master case, which is twelve bricks. The per-deck prices, the minimums and the lead times are on the wholesale page.',
    ],
  },
  {
    q: 'Do you ship internationally?',
    a: [
      'We have not set international rates yet, and we would rather say so than publish a number we have to walk back.',
      'Write to us with your country before you order. If enough people are in one place, that decides it for us.',
    ],
  },
];

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
      '@type': 'FAQPage',
      mainEntity: FAQ.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a.join(' ') },
      })),
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

function deckArt() {
  /* The printed tuck box and the engraved card back — the real product, not a
     CSS approximation of it. */
  return `
  <div class="buy-deckart">
    <figure class="buy-deckart__pack">
      <img class="buy-deckart__box"
        src="/brand/box-front-600.webp"
        srcset="/brand/box-front-600.webp 600w, /brand/box-front-1200.webp 1200w"
        sizes="(min-width: 60rem) 21rem, 62vw"
        width="600" height="874" fetchpriority="high" decoding="async"
        alt="The Reel Deal Deck tuck box: an engraved green case with two trout and a fan of three fly cards.">
      <img class="buy-deckart__card-back"
        src="/cards/card-back-400.webp"
        srcset="/cards/card-back-400.webp 400w, /cards/card-back-800.webp 800w"
        sizes="(min-width: 60rem) 9rem, 26vw"
        width="400" height="559" loading="lazy" decoding="async"
        alt="The card back: a green engraved border framing two rising trout and an angler on the river.">
    </figure>
  </div>`;
}

/* The two retail cards. There is no quantity ladder any more — the deck is one
   price and the only thing that changes is who pays the postage — so these are
   deliberately not called tiers and carry no fake discount arithmetic. */
function retailCards(site) {
  const r = (site.pricing || {}).retail || {};
  const per = r.perDeck ?? 19.95;
  const ship = r.shipping ?? 6.95;
  const from = r.freeShippingFromDecks ?? 2;

  const cards = [
    {
      qty: '1 deck',
      name: 'One deck',
      price: per,
      per: `${money(per)} + ${money(ship)} shipping — ${money(per + ship)} delivered`,
      body: 'Fifty-four flies in a jacket pocket. The one you keep.',
      points: [
        '54 original hand-drawn flies',
        'What each one imitates, printed on the card',
        'Genuine Bicycle / USPCC stock, made in the USA',
      ],
    },
    {
      qty: `${from}+ decks`,
      name: 'Two or more',
      price: per,
      featured: true,
      flag: 'Shipping is on us',
      per: `${money(per)} a deck, shipping free`,
      body: 'Same deck, same price, and we cover the postage. One for the vest, one for whoever keeps borrowing it.',
      points: [
        `No postage from ${inWords(from)} decks up`,
        'The deck itself never changes price',
        'Past twelve it becomes wholesale — see below',
      ],
    },
  ];

  return cards.map((t) => `
      <article class="buy-tier${t.featured ? ' buy-tier--featured' : ''}">
        ${t.flag ? `<p class="buy-tier__flag">${esc(t.flag)}</p>` : ''}
        <p class="buy-tier__qty">${esc(t.qty)}</p>
        <h3 class="buy-tier__name">${esc(t.name)}</h3>
        <p class="buy-tier__price" data-price="${t.price}">${money(t.price)}</p>
        <p class="buy-tier__per">${esc(t.per)}</p>
        <p class="buy-tier__body">${esc(t.body)}</p>
        <ul class="buy-tier__list">
          ${t.points.map((p) => `<li>${esc(p)}</li>`).join('\n          ')}
        </ul>
        <div class="buy-tier__foot stack">
          ${orderCta(site, { variant: t.featured ? 'primary' : 'ghost' })}
        </div>
      </article>`).join('\n');
}

/* How the three units nest. A reader who has never bought a case of anything
   should not have to guess what a brick is, and a shop owner should not have
   to email to find out how many decks are in one. */
function unitRows(site) {
  const units = (site.pricing || {}).units || [];
  if (!units.length) return '';
  return units.map((u) => `
      <div class="buy-specs__row">
        <p class="buy-specs__key">${esc(u.name)}</p>
        <p class="buy-specs__val">${esc(u.what)} ${u.decks > 1 ? `<span class="text-muted">${esc(u.decks)} decks</span>` : ''}</p>
      </div>`).join('\n');
}

/* ---------------------------------------------------------------- page -- */

export default function deckPage({ site, instagram }) {
  const p = site.product || {};
  const pr = site.pricing || {};
  const r = pr.retail || {};
  const per = r.perDeck ?? 19.95;
  const ship = r.shipping ?? 6.95;
  const from = r.freeShippingFromDecks ?? 2;
  const wholesale = (pr.wholesale || {}).tiers || [];
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

<section class="section wrap">
  <div class="buy-hero">
    <div class="buy-hero__art">
      ${deckArt()}
      <p class="buy-deckart__caption">54 cards &middot; poker size &middot; genuine Bicycle stock</p>
    </div>

    <div class="buy-hero__copy">
      <p class="eyebrow">The Deck</p>
      <h1 class="h1">${esc(p.name || site.name)}</h1>
      <p class="lede">${esc(site.positioning)}</p>

      <div class="buy-price">
        <span class="buy-price__amount" data-price="${per}">${money(per)}</span>
        <span class="buy-price__unit">per deck, ${esc(pr.currency || 'USD')} &middot; ${esc(p.origin || 'Made in the USA')}</span>
      </div>

      <p class="buy-avail">
        <span class="buy-avail__dot" aria-hidden="true"></span>
        Ordering now &mdash; shipping free on ${esc(inWords(from))} decks or more
      </p>

      <p class="buy-hero__note">
        ${esc(p.availabilityNote || '')}
        A single deck is ${money(per)} plus ${money(ship)} postage; from ${esc(inWords(from))} up we pay the postage and the
        deck stays ${money(per)}. ${shop.ready ? '' : 'Checkout is being set up right now, so the button below takes you to the full prices rather than to a cart.'}
      </p>

      <div class="cluster">
        ${orderCta(site)}
        <a class="btn btn--ghost btn--lg" href="#order">What it costs</a>
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
    <h2 class="h2">${money(per)} a deck. Shipping is the only thing that changes.</h2>
    <p class="lede">
      We thought about a quantity ladder and could not make an honest one: it costs us the same to
      draw, print and box the second deck as the first. What genuinely changes is the postage, so
      that is the only thing that moves. One deck carries it. ${esc(inWords(from)).replace(/^t/, 'T')} or more and we cover it.
    </p>

    <!-- Confirmed by Ken and Audrey: ${money(per)} retail, ${money(ship)} shipping on a single deck,
         free from ${esc(from)} up, and the wholesale per-deck figures below.

         TODO-CONFIRM: none of these has been checked against real per-unit
         COGS, carton weight and fulfilment. They are prices, not yet margins.
         TODO-CONFIRM: international shipping rates. The FAQ says we have not
         set them, which is true, and it should stop being true before launch.

         Every figure on this page is read from site.pricing in data/site.json.
         /wholesale/ reads the same block. Never type a price into a page. -->

    <div class="buy-tiers">
${retailCards(site)}
    </div>

    <div class="buy-specs" style="margin-block-start:var(--s-7)">
      <p class="eyebrow">How it is boxed</p>
${unitRows(site)}
    </div>

    <p class="cx-note">
      Buying for a shop, a lodge or a guide service? Past a dozen decks it stops being a gift and
      starts being inventory. Wholesale is sold by the brick at
      ${wholesale.length ? esc(money(wholesale[0].perDeck)) : ''} a deck and by the master case at
      ${wholesale.length > 1 ? esc(money(wholesale[1].perDeck)) : ''} a deck &mdash;
      <a href="/wholesale/">the terms are here</a>.
    </p>
  </div>
</section>

${instagramStrip(site, instagram, {
  tag: 'deck',
  title: 'The deck, out in the world',
  blurb: 'Prototypes, print proofs and cards being dealt — posted as it happens on Instagram.',
})}

<!-- ============================================================ SPECS == -->
<section class="section wrap">
  <p class="eyebrow">Specification</p>
  <h2 class="h2">What is in the tuck box</h2>

  <div class="buy-specs">
    <div class="buy-specs__row">
      <p class="buy-specs__key">Cards</p>
      <p class="buy-specs__val">${esc(p.cardCount)} cards, every one an original hand-drawn fly with what it imitates</p>
    </div>
    <div class="buy-specs__row">
      <p class="buy-specs__key">Size</p>
      <p class="buy-specs__val">${esc(p.dimensions)}</p>
    </div>
    <div class="buy-specs__row">
      <p class="buy-specs__key">Stock &amp; finish</p>
      <p class="buy-specs__val">${esc(p.stock)}</p>
    </div>
    <div class="buy-specs__row">
      <p class="buy-specs__key">Materials</p>
      <p class="buy-specs__val">${esc(p.material)}</p>
    </div>
    <!-- TODO-CONFIRM: the brief describes the deck as recyclable, but
         data/site.json only lists the materials. Do not publish a formal
         recyclability claim (or any FSC chain-of-custody number) until
         USPCC confirms it in writing. -->
    <div class="buy-specs__row">
      <p class="buy-specs__key">Origin</p>
      <p class="buy-specs__val">
        ${esc(p.origin || 'Made in the USA')} &mdash; printed by ${esc(p.manufacturer)},
        drawn and packed in ${esc((site.location || {}).city)}, ${esc((site.location || {}).regionName)}.
        <a href="/story/#made-in-the-usa">Why that mattered to us</a>.
      </p>
    </div>
    <div class="buy-specs__row">
      <p class="buy-specs__key">Made by</p>
      <p class="buy-specs__val">Ken and Audrey, a father and daughter in ${esc((site.location || {}).city)}, ${esc((site.location || {}).regionName)}</p>
    </div>
    <div class="buy-specs__row">
      <p class="buy-specs__key">Price</p>
      <p class="buy-specs__val">${money(per)} a deck. ${money(ship)} postage on one; free on ${esc(inWords(from))} or more.</p>
    </div>
  </div>
  <!-- TODO-CONFIRM: does every card carry a standard rank and suit index
       alongside the fly, and are the two extra cards jokers or reference
       cards? The FAQ answer "you can deal a hand of poker with it" depends
       on the first being yes. -->
</section>

<!-- ====================================================== WHY IT COSTS == -->
<section class="section section--sunk">
  <div class="wrap">
    <p class="eyebrow">Price</p>
    <h2 class="h2">Why it costs ${money(per)}</h2>
    <div class="prose">
      <p class="lede">
        You can buy fly-fishing cards for ten dollars. We know, because we looked, and that is
        roughly what this deck was first priced at. It was the wrong number, and we would rather
        explain why than quietly hope you do not notice.
      </p>
    </div>

    <div class="buy-why">
      <div class="buy-why__item">
        <h3 class="buy-why__head">The art is drawn, not photographed</h3>
        <p class="buy-why__body">
          Fifty-four flies, each one illustrated by hand. That is fifty-four separate pieces of original
          artwork rather than a licensed photo library dropped onto a template. It is the single largest
          cost in the deck and the only part a competitor cannot buy off a shelf.
        </p>
      </div>
      <div class="buy-why__item">
        <h3 class="buy-why__head">Real playing card stock, not board</h3>
        <p class="buy-why__body">
          ${esc(p.stock)}. It costs meaningfully more per unit than the generic stock most reference
          card sets are printed on, and you can feel the difference in the first riffle shuffle.
          A deck you do not enjoy handling gets left in a drawer.
        </p>
      </div>
      <div class="buy-why__item">
        <h3 class="buy-why__head">Printed in the United States</h3>
        <p class="buy-why__body">
          ${esc(p.manufacturer)} prints it, in the United States, and the two of us pack and post it from
          ${esc((site.location || {}).regionName)}. It is the same choice as the stock, arrived at the same
          way: the printer we wanted for how the cards feel happens to be an American one.
          <a href="/story/#made-in-the-usa">The longer version is on our story page</a>.
        </p>
      </div>
      <div class="buy-why__item">
        <h3 class="buy-why__head">Materials chosen for a river</h3>
        <p class="buy-why__body">
          ${esc(p.material)}. Those choices cost more than the defaults. They are the right ones for a
          product about water you would like to still be fishable in thirty years.
        </p>
      </div>
      <div class="buy-why__item">
        <h3 class="buy-why__head">A portion goes to ${esc((site.conservation || {}).partner)}</h3>
        <p class="buy-why__body">
          A share of every deck sold goes to ${esc((site.conservation || {}).partner)}. That is built into
          the price rather than bolted on at checkout as an optional dollar you have to opt into.
        </p>
        <!-- TODO-CONFIRM: data/site.json still carries a TODO for the exact
             conservation commitment. Replace "a share of every deck" with a hard
             number ("$1 from every deck") the moment Ken confirms it — the
             specific figure is worth real conversion and the vague one is not. -->
      </div>
      <div class="buy-why__item">
        <h3 class="buy-why__head">Priced so there is a second print run</h3>
        <p class="buy-why__body">
          At twelve dollars a deck, once card fees, packaging, postage and manufacturing come out,
          what is left over is close to a dollar. That is not a business, it is a hobby with paperwork.
          At ${money(per)} the deck can pay for the next print run, the next fifty-four drawings, and the
          conservation contribution.
        </p>
      </div>
    </div>
  </div>
</section>

<!-- ================================================ WHAT'S ON THE CARDS == -->
<!-- This used to open with a strip of eight sample cards. They were tiny, they
     clipped their own text at wide widths, and they were a worse advert for the
     library than a sentence and a button. The space now does a second job the
     product page was not doing: asking what should be in the next deck. -->
<section class="section">
  <div class="wrap wrap--narrow">
    <p class="eyebrow">The cards</p>
    <h2 class="h2">Every fly in the deck, free to read right now</h2>
    <p class="lede">
      The whole deck is published as a reference library on this site &mdash; what each fly imitates,
      when to fish it, and why it is in the fifty-four. Read it before you decide the deck is worth
      ${money(per)}.
    </p>
    <p class="cx-note">
      <a class="btn btn--ghost btn--lg" href="/flies/">Browse all ${esc(p.cardCount)} flies</a>
    </p>

    <div class="card deck-next">
      <p class="eyebrow">Volume 2</p>
      <h3 class="deck-next__title">Which one did we miss?</h3>
      <p class="deck-next__text">
        ${esc(p.cardCount)} slots, and the arguments about the last ten were the hardest part of
        building this deck. If the pattern you would not fish without is not in there,
        tell us &mdash; the next one is not written yet, and we read every suggestion.
      </p>
      <p><a class="btn btn--primary" href="/suggest/">Suggest a fly</a></p>
    </div>
  </div>
</section>

<!-- ===================================================== CONSERVATION == -->
<section class="section section--dark">
  <div class="wrap wrap--narrow">
    <p class="eyebrow">Conservation</p>
    <h2 class="h2">A portion of every deck goes to ${esc((site.conservation || {}).partner)}</h2>
    <div class="prose">
      <p>
        A deck of flies is a nice object. Water with fish in it is the point. A share of every deck we
        sell goes to ${esc((site.conservation || {}).partner)}, who do the unglamorous work &mdash;
        culverts, cold water, habitat, access.
      </p>
    </div>
    <p class="cx-note">
      <a class="btn btn--ghost" href="/conservation/">How the contribution works</a>
    </p>
  </div>
</section>

<!-- ============================================================== FAQ == -->
<section class="section wrap">
  <p class="eyebrow">Questions</p>
  <h2 class="h2">The things people actually ask</h2>

  <div class="cx-faq">
${FAQ.map((f) => `    <details class="cx-faq__item">
      <summary class="cx-faq__q">${esc(f.q)}</summary>
      <div class="cx-faq__a">
${f.a.map((para) => `        <p>${esc(para)}</p>`).join('\n')}
      </div>
    </details>`).join('\n')}
  </div>
</section>

<!-- ======================================================= CROSSLINKS == -->
<section class="section section--sunk">
  <div class="wrap">
    <h2 class="h2">Where to go next</h2>
    <p class="lede">${orderLine(site)}</p>
    <div class="cx-crosslink">
      <a class="cx-crosslink__item" href="/gifts/">
        <p class="cx-crosslink__name">Buying it for somebody else</p>
        <p class="cx-crosslink__body">You do not fish, they do, and you need this to land. Start here instead.</p>
      </a>
      <a class="cx-crosslink__item" href="/wholesale/">
        <p class="cx-crosslink__name">Fly shops, guides and lodges</p>
        <p class="cx-crosslink__body">Brick and master-case pricing, minimums and lead times for the counter.</p>
      </a>
      <a class="cx-crosslink__item" href="/flies/">
        <p class="cx-crosslink__name">The Fly-brary</p>
        <p class="cx-crosslink__body">All ${esc(p.cardCount)} flies, free, with what each one imitates.</p>
      </a>
    </div>
  </div>
</section>
`;
}
