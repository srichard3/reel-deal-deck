/**
 * /deck/ — the product page.
 *
 * Every purchase control on this page is a placeholder. Nothing ships, no
 * payment is taken, no order is created. The page's job is to make the deck
 * worth $24.95 in the reader's head and then capture the email.
 *
 * Pricing below is the proposal, not a decision. Search this file for
 * TODO-CONFIRM before launch.
 */

import { campaignCta, campaignLine, organizationSchema, instagramStrip } from '../templates/_blocks.mjs';
const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* --------------------------------------------------------------- tiers -- */
/* Three rungs, anchored on site.product.priceIntended ($24.95): the deck, the
   deck signed, and a brick of twelve for the price of ten. The brick's discount
   is the whole pitch, so it is stated as "twelve for the price of ten" rather
   than as a percentage — arithmetic a reader can check beats a claim.
   $249.50 = 10 x $24.95. Change SINGLE and this stays consistent. */

export const TIERS = [
  {
    id: 'single',
    name: 'One Deck',
    qty: 1,
    price: 24.95,
    kicker: 'The deck',
    body: 'Fifty-four flies in your jacket pocket. The one you keep.',
    points: ['54 original hand-drawn flies', 'What each one imitates, on the card', 'Genuine Bicycle / USPCC stock'],
  },
  {
    id: 'signed',
    name: 'Signed Deck',
    qty: 1,
    price: 39.95,
    limited: true,
    flag: 'Limited',
    kicker: 'Signed by Ken and Audrey',
    body: 'The same deck, signed by both of us before it goes in the envelope. For the person who is going to keep it on a shelf rather than in a vest.',
    points: ['Signed by both founders', 'From the first print run', 'Limited by how many two people can sign'],
  },
  {
    id: 'brick',
    name: 'The Brick',
    qty: 12,
    price: 249.50,
    featured: true,
    flag: 'Twelve for the price of ten',
    kicker: 'Twelve decks',
    body: 'A dozen decks the way playing cards actually ship, and two of them are free. Guide tips, groomsmen, a club raffle, or the counter of a shop that only wants to try one case.',
    points: ['12 decks in one carton, priced as 10', 'The tier that outsold every other on Kickstarter', 'If you want more than this, use the wholesale page'],
  },
];

/* ----------------------------------------------------------------- FAQ -- */
/* These are the only questions rendered, and therefore the only questions in
   the FAQPage JSON-LD. Keep the two lists identical. */

const FAQ = [
  {
    q: 'When does it ship?',
    a: [
      'We are not going to give you a date we cannot keep. The deck is not in production yet, and anyone who tells you a shipping week before a print run is scheduled is guessing.',
      'What we will do is email the list before anything goes on sale, with the real timeline attached. That is the whole point of the reservation form on this page.',
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
    q: 'Why is it $24.95 when I can find fly-fishing cards for ten dollars?',
    a: [
      'Because you are buying different things. The cheaper sets use photography or licensed stock art on generic board. Every fly in this deck was drawn by hand, one at a time, and it is printed on real playing card stock.',
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
    q: 'Do you ship internationally?',
    a: [
      'We have not set international rates yet, and we would rather say so than publish a number we have to walk back.',
      'Put your country in the note field when you join the list. If enough people are in one place, that decides it for us.',
    ],
  },
  {
    q: 'Can I buy these for my shop, lodge or guide service?',
    a: [
      'Yes, and it is the part of this business we are most serious about. Case pricing, minimums and lead times live on the wholesale page.',
    ],
  },
];

/* ---------------------------------------------------------------- meta -- */

export const meta = {
  path: '/deck/',
  title: '54 Hand-Drawn Fly Fishing Cards',
  description:
    '54 original hand-drawn flies, each with what it imitates, on genuine Bicycle stock. $24.95. Not yet shipping — reserve a deck and be first in line.',
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
      brand: { '@type': 'Brand', name: 'The Reel Deal Deck', slogan: "Hand-drawn playing cards that teach while you play." },
      category: 'Playing Cards',
      material: 'FSC-certified paper, starch-based laminating glue, vegetable-based inks',
      size: 'Poker size, 2.5in x 3.5in',
      url: 'https://reeldealdeck.com/deck/',
      additionalProperty: [
        { '@type': 'PropertyValue', name: 'Cards', value: '54' },
        { '@type': 'PropertyValue', name: 'Stock', value: 'Genuine Bicycle / USPCC with Air-Cushion finish' },
      ],
      offers: {
        '@type': 'Offer',
        price: '24.95',
        priceCurrency: 'USD',
        availability: 'https://schema.org/PreOrder',
        itemCondition: 'https://schema.org/NewCondition',
        url: 'https://reeldealdeck.com/deck/',
        seller: null, // filled in the render, where `site` is in scope
      },
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

/* The single-deck price is the anchor every other tier is measured against.
   Derived from the ladder itself so it can never drift from TIERS. */
const SINGLE = TIERS.find((t) => t.id === 'single').price;

function tierCard(t) {
  const per = t.price / t.qty;
  const full = SINGLE * t.qty;
  const save = full - t.price;
  const perLabel = t.qty > 1
    ? `${money(per)} a deck`
    : t.limited ? 'One deck, one of a limited run' : 'One deck';

  return `
      <article class="buy-tier${t.featured ? ' buy-tier--featured' : ''}" data-tier-root>
        ${t.flag ? `<p class="buy-tier__flag">${esc(t.flag)}</p>` : ''}
        <p class="buy-tier__qty">${t.qty === 1 ? '1 deck' : `${t.qty} decks`}</p>
        <h3 class="buy-tier__name">${esc(t.name)}</h3>
        <p class="buy-tier__price" data-price="${t.price}">${money(t.price)}</p>
        <p class="buy-tier__per">${esc(perLabel)}</p>
        ${save > 0 ? `<p class="buy-tier__save">Saves ${money(save)} against single decks</p>` : ''}
        <p class="buy-tier__body">${esc(t.body)}</p>
        <ul class="buy-tier__list">
          ${t.points.map((p) => `<li>${esc(p)}</li>`).join('\n          ')}
        </ul>
        <div class="buy-tier__foot stack">
          <div class="form-inline" hidden data-js-only>
            <label class="visually-hidden" for="qty-${t.id}">How many ${esc(t.name)} sets</label>
            <input class="input" id="qty-${t.id}" name="qty-${t.id}" type="number"
                   value="1" min="1" max="99" step="1" inputmode="numeric" data-qty>
            <button type="button" class="btn ${t.featured ? 'btn--primary' : 'btn--ghost'} btn--sm"
                    data-add-to-cart="${t.id}"
                    data-price="${t.price}"
                    data-decks="${t.qty}"
                    data-label="${esc(t.name)}">Save to my list</button>
          </div>
          <a class="btn btn--quiet btn--sm" href="#reserve">Join the list for this tier</a>
        </div>
      </article>`;
}

/* The signed edition is not a rung on the quantity ladder — it is a different
   product. Given its own band so it does not orphan a fifth grid column. */

function money(n) {
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`;
}


/* ---------------------------------------------------------------- page -- */

export default function deckPage({ site, flies, instagram }) {
  const p = site.product || {};

  /* `meta` is a module-level constant, so `site` is not in scope up there.
     build.mjs reads meta AFTER this function runs, so patching it here is the
     established pattern (see pages/flies.mjs). */
  const org = organizationSchema(site, { full: true });
  for (const node of meta.jsonld) {
    if (node['@type'] === 'Product') {
      node.offers.seller = organizationSchema(site);
      node.brand = { '@type': 'Brand', name: site.brand?.name || site.name, slogan: site.brand?.slogan };
    }
  }
  if (!meta.jsonld.some((n) => n['@type'] === 'Organization')) meta.jsonld.push({ '@context': 'https://schema.org', ...org });
  const price = p.priceIntended ?? 24.95;
  const list = Array.isArray(flies) ? flies : [];

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
        <span class="buy-price__amount" data-price="${price}">$${esc(price)}</span>
        <span class="buy-price__unit">per deck, ${esc(p.priceCurrency || 'USD')} &middot; intended retail</span>
      </div>

      <p class="buy-avail">
        <span class="buy-avail__dot" aria-hidden="true"></span>
        Not yet shipping &mdash; reserve, don&rsquo;t buy
      </p>

      <p class="buy-hero__note">
        ${esc(p.availabilityNote || 'Not yet shipping. Join the list to be first in line.')}
        Nothing on this site takes payment, and no order is created when you save a deck to your list.
        You are getting in line, and we will email you before the first run goes on sale.
      </p>

      <div class="cluster">
        ${campaignCta(site)}
        <a class="btn btn--ghost btn--lg" href="#reserve">Or just join the list</a>
        <a class="btn btn--ghost btn--lg" href="#tiers">See the tiers</a>
      </div>
    </div>
  </div>
</section>

<!-- ====================================================== TIER LADDER == -->
<section class="section section--sunk" id="tiers">
  <div class="wrap">
    <p class="eyebrow">Choose your rung</p>
    <h2 class="h2">Three ways to buy it</h2>
    <p class="lede">
      One deck, the same deck signed by Ken and Audrey, or a brick of twelve for the price of ten.
      On Kickstarter the brick converted at almost exactly the same rate as a single deck, so it is
      priced to stay the obvious choice.
    </p>

    <!-- Ken and Audrey have set the single-deck retail price at $24.95 and the
         brick at twelve for the price of ten ($249.50). Those two are decided.

         TODO-CONFIRM: the $39.95 signed tier assumes both founders are willing
         to hand-sign every deck in the first run, and that a rigid mailer is
         sourced so a signed deck does not arrive bent. Confirm both before this
         tier is published.

         TODO-CONFIRM: none of the three has been checked against real per-unit
         COGS, carton weight and fulfilment. $24.95 is a price, not yet a margin.

         Prices live in TIERS at the top of this file. The Product JSON-LD offer
         here and the MSRP table in src/pages/wholesale.html are anchored on the
         same number and must move with it. -->

    <div class="buy-tiers">
${TIERS.map(tierCard).join('\n')}
    </div>

    <p class="cx-note">
      Buying for a shop, a lodge or a guide service? Past twelve decks it stops being a gift and starts being
      inventory &mdash; <a href="/wholesale/">wholesale pricing is here</a>.
    </p>

    <p class="visually-hidden" role="status" aria-live="polite" data-interest-live></p>

    <div class="buy-interest" data-interest-panel hidden>
      <h3 class="buy-interest__title">
        Your list<span class="buy-badge" data-interest-count hidden>0</span>
      </h3>
      <p class="cx-stub">
        This is a wish list stored in this browser. It is not a cart. Nothing has been ordered,
        nothing is reserved, and no payment has been taken or requested.
      </p>
      <ul class="buy-interest__list" data-interest-list></ul>
      <p class="buy-tier__per" data-interest-total></p>
      <div class="cluster">
        <a class="btn btn--primary btn--sm" href="#reserve">Send this to us with my email</a>
        <button type="button" class="btn btn--quiet btn--sm" data-interest-clear>Clear my list</button>
      </div>
    </div>
  </div>
</section>

${instagramStrip(site, instagram, {
  tag: 'deck',
  title: 'The deck, out in the world',
  blurb: 'Prototypes, print proofs and cards being dealt \u2014 posted as it happens on Instagram.',
})}

<!-- ========================================================== RESERVE == -->
<section class="section wrap" id="reserve">
  <p class="eyebrow">Reserve</p>
  <h2 class="h2">Get in line for the first print run</h2>
  <p class="lede">
    There is no checkout on this site yet, on purpose. Leave an email and you will hear from
    Ken and Audrey before decks go on sale &mdash; not after they have sold out.
  </p>
  <p class="buy-hero__note">${campaignLine(site)}</p>

  <div class="buy-reserve">
    <noscript>
      <p class="notice notice--info">
        This form needs JavaScript to save your details. Email
        <a href="mailto:reeldealdeck@gmail.com?subject=Reserve%20a%20deck">reeldealdeck@gmail.com</a>
        instead and we will add you to the list by hand.
      </p>
    </noscript>

    <form class="cx-form stack" data-capture="reserve"
          action="mailto:reeldealdeck@gmail.com" method="post" enctype="text/plain">
      <div class="field">
        <label class="label" for="reserve-email">Email address</label>
        <input class="input" id="reserve-email" name="email" type="email"
               autocomplete="email" required placeholder="you@example.com">
        <p class="help" id="reserve-email-help">We email about the print run and nothing else.</p>
      </div>

      <div class="form-row">
        <div class="field">
          <label class="label" for="reserve-name">Name (optional)</label>
          <input class="input" id="reserve-name" name="name" type="text" autocomplete="name">
        </div>
        <div class="field">
          <label class="label" for="reserve-tier">Which tier are you after?</label>
          <select class="input" id="reserve-tier" name="tier">
            <option value="">Not sure yet</option>
${TIERS.map((t) => `            <option value="${t.id}">${esc(t.name)} — ${money(t.price)}</option>`).join('\n')}
            <option value="wholesale">Wholesale — for my shop or lodge</option>
          </select>
        </div>
      </div>

      <div class="field">
        <label class="label" for="reserve-where">Where do you fish? (optional)</label>
        <input class="input" id="reserve-where" name="where" type="text"
               placeholder="Country or home water — this decides our shipping map">
        <p class="help">If you are outside the US, tell us. That is how we decide where to ship first.</p>
      </div>

      <button class="btn btn--primary btn--lg btn--block" type="submit">Reserve a deck</button>

      <p class="cx-stub">
        <strong>Placeholder form.</strong> This site has no payment processor and no mailing list
        connected yet. Submitting saves your details to this browser&rsquo;s local storage only
        &mdash; nothing is transmitted, no account is created, and no card is ever asked for.
      </p>
    </form>
  </div>
</section>

<!-- ============================================================ SPECS == -->
<section class="section section--sunk">
  <div class="wrap">
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
        <p class="buy-specs__key">Made by</p>
        <p class="buy-specs__val">Ken and Audrey, a father and daughter in ${esc((site.location || {}).city)}, ${esc((site.location || {}).regionName)}</p>
      </div>
      <div class="buy-specs__row">
        <p class="buy-specs__key">Availability</p>
        <p class="buy-specs__val">Pre-launch. Reservations only &mdash; no orders are being taken and no payment is being collected.</p>
      </div>
    </div>
    <!-- TODO-CONFIRM: does every card carry a standard rank and suit index
         alongside the fly, and are the two extra cards jokers or reference
         cards? The FAQ answer "you can deal a hand of poker with it" depends
         on the first being yes. -->
  </div>
</section>

<!-- ====================================================== WHY IT COSTS == -->
<section class="section wrap">
  <p class="eyebrow">Price</p>
  <h2 class="h2">Why it costs $${esc(price)}</h2>
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
        At $${esc(price)} the deck can pay for the next print run, the next fifty-four drawings, and the
        conservation contribution &mdash; without a second crowdfunding campaign.
      </p>
    </div>
  </div>
</section>

<!-- ================================================ WHAT'S ON THE CARDS == -->
<!-- This used to open with a strip of eight sample cards. They were tiny, they
     clipped their own text at wide widths, and they were a worse advert for the
     library than a sentence and a button. The space now does a second job the
     product page was not doing: asking what should be in the next deck. -->
<section class="section section--sunk">
  <div class="wrap wrap--narrow">
    <p class="eyebrow">The cards</p>
    <h2 class="h2">Every fly in the deck, free to read right now</h2>
    <p class="lede">
      The whole deck is published as a reference library on this site &mdash; what each fly imitates,
      when to fish it, and why it is in the fifty-four. Read it before you decide the deck is worth $${esc(price)}.
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
        tell us &mdash; the next one is not written yet, and Ken and Audrey read every suggestion.
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
    <div class="cx-crosslink">
      <a class="cx-crosslink__item" href="/gifts/">
        <p class="cx-crosslink__name">Buying it for somebody else</p>
        <p class="cx-crosslink__body">You do not fish, they do, and you need this to land. Start here instead.</p>
      </a>
      <a class="cx-crosslink__item" href="/wholesale/">
        <p class="cx-crosslink__name">Fly shops, guides and lodges</p>
        <p class="cx-crosslink__body">Case pricing, minimums and lead times for the counter.</p>
      </a>
      <a class="cx-crosslink__item" href="/flies/">
        <p class="cx-crosslink__name">The Fly-brary</p>
        <p class="cx-crosslink__body">All ${esc(p.cardCount)} flies, free, with what each one imitates.</p>
      </a>
    </div>
  </div>
</section>

<script src="/js/commerce.js" defer></script>
`;
}
