/* /preorder/ — how to get a deck, honestly.
 *
 * This page takes no payment and creates no order. Backing happens on
 * Kickstarter while the campaign is live; afterwards this becomes a list
 * signup. Both states are rendered from site.campaign via campaignState(),
 * so the page reads correctly on 20 September 2026 with no edit.
 *
 * Never add a ship date, a backer count, a stock number or a countdown to
 * this page unless it comes from data the founders have confirmed.
 */

import { TIERS } from './deck.mjs';

import { esc, campaignState } from '../templates/_blocks.mjs';

export const meta = {
  path: '/preorder/',
  title: 'Pre-order The Reel Deal Deck',
  description:
    'How to get a deck: back it on Kickstarter while the campaign is running, or join the list and we will tell you the day it ships. No payment is taken here.',
  priority: 0.95,
  changefreq: 'weekly',
  bodyClass: 'page-preorder',
  ogImage: '/og/deck.png',
};

const fmtDate = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.valueOf())
    ? ''
    : d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
};

export default function ({ site }) {
  const c = campaignState(site);
  const p = site.product || {};
  const base = site.url.replace(/\/$/, '');
  const ends = fmtDate(site.campaign?.endsAt);

  /* Three rungs only. The full ladder lives on /deck/; this page answers
     "how do I get one", not "which one".

     Prices are imported rather than restated: the same numbers written in two
     files is exactly how this page ended up still quoting $24 after the ladder
     moved to $19.99. One source of truth, and the drift cannot recur. */
  const NOTES = {
    single: 'The deck. Fifty-four flies in a jacket pocket.',
    pair: 'Keep one, hand one over on the drive to the put-in.',
    brick: 'A dozen, the way playing cards actually ship. Guide tips, groomsmen, a club raffle.',
  };
  const rungs = ['single', 'pair', 'brick']
    .map((id) => TIERS.find((t) => t.id === id))
    .filter(Boolean)
    .map((t) => ({
      name: t.name,
      qty: t.qty === 1 ? '1 deck' : `${t.qty} decks`,
      price: t.price,
      note: NOTES[t.id],
    }));

  const jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Pre-order The Reel Deal Deck',
      description: meta.description,
      url: `${base}/preorder/`,
      isPartOf: { '@type': 'WebSite', name: site.name, url: site.url },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
        { '@type': 'ListItem', position: 2, name: 'Pre-order', item: `${base}/preorder/` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Can I buy The Reel Deal Deck right now?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: c.live
              ? `Not as a normal shop order. While the Kickstarter is running (it ends ${ends}), backing the campaign is how you reserve a deck. This website takes no payment and creates no order.`
              : 'Not yet. The deck is in production. Join the list and we will email you the day it goes on sale. This website takes no payment and creates no order.',
          },
        },
        {
          '@type': 'Question',
          name: 'What does The Reel Deal Deck cost?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: `The intended retail price is $${p.priceIntended} per deck. Multi-deck tiers bring the per-deck price down; the full ladder is on the deck page.`,
          },
        },
        {
          '@type': 'Question',
          name: 'When will the deck ship?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We are not giving a date we cannot keep. The print run is not scheduled yet. Everyone on the list gets the real timeline before anything goes on sale.',
          },
        },
        {
          '@type': 'Question',
          name: 'What happens if I miss the Kickstarter?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The deck is being made either way. Missing the campaign means missing the campaign pricing and the first print run, not missing the deck.',
          },
        },
      ],
    },
  ];
  meta.jsonld = jsonld;

  return `
<div class="wrap">
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <a href="/">Home</a> <span aria-hidden="true">›</span>
    <span aria-current="page">Pre-order</span>
  </nav>

  <header class="page-head">
    <p class="eyebrow">${esc(c.eyebrow)}</p>
    <h1 class="h1 page-head__title">How to get a deck</h1>
    <p class="page-head__lede lede">${esc(c.sub)}</p>
  </header>
</div>

<div class="wrap wrap--narrow">
  <div class="aeo-answer">
    <p class="aeo-answer__label">Short answer</p>
    <p class="aeo-answer__text">${
      c.live
        ? `The Reel Deal Deck is funding on Kickstarter until ${esc(ends)}. Backing the campaign is the only way to reserve one right now &mdash; it is where the pricing and the first print run live. This website takes no payment and creates no order.`
        : `The Kickstarter has closed and the deck is in production. There is nothing to buy on this site yet. Join the list and we will email you the day it goes on sale, with a real timeline attached.`
    }</p>
  </div>

  <section class="section section--tight">
    <h2 class="h2">${c.live ? 'Backing it on Kickstarter' : 'Joining the list'}</h2>
    <div class="prose">
      ${
        c.live
          ? `<p>
               Kickstarter is where the deck is being funded, so it is where the campaign pricing
               and the first print run live. You pledge there; Kickstarter takes payment only if
               the project funds by ${esc(ends)}. Nothing on this website charges you.
             </p>
             <p>
               If the campaign funds, backers are first in line. If you would rather wait and buy
               it normally later, that is fine too &mdash; ${esc(site.voice?.intro ? 'Ken and Audrey' : 'we')}
               are making the deck either way.
             </p>`
          : `<p>
               The campaign has ended and the deck is in production. We are not selling from this
               site yet, and we would rather say that plainly than take money against a date we
               cannot promise.
             </p>
             <p>
               Join the list below and you will hear the day it goes on sale, with the real
               timeline attached.
             </p>`
      }
    </div>
    <p class="cluster" style="margin-block-start:var(--s-5)">
      <a class="btn btn--primary btn--lg" href="${esc(c.url)}"${c.external ? ' rel="noopener"' : ''}>${esc(c.cta)}</a>
      <a class="btn btn--ghost" href="/deck/#reserve">Join the list instead</a>
    </p>
  </section>

  <section class="section section--tight">
    <h2 class="h2">What it costs</h2>
    <div class="post-tablewrap" tabindex="0">
      <table class="post-table">
        <caption class="post-table__caption">Intended pricing &mdash; the full ladder is on the deck page</caption>
        <thead>
          <tr><th scope="col">Tier</th><th scope="col">Decks</th><th scope="col">Price</th><th scope="col">Per deck</th></tr>
        </thead>
        <tbody>
          ${rungs
            .map(
              (r) => `<tr>
            <th scope="row">${esc(r.name)}</th>
            <td>${esc(r.qty)}</td>
            <td>$${r.price}</td>
            <td>$${(r.price / parseInt(r.qty, 10)).toFixed(2)}</td>
          </tr>`
            )
            .join('\n          ')}
        </tbody>
      </table>
    </div>
    <!-- TODO-CONFIRM: every figure in this table is the proposal from deck.mjs,
         not a decision. Confirm final pricing before launch; it appears here,
         on /deck/ and on /gifts/. -->
    <p class="text-faint" style="margin-block-start:var(--s-3)">
      ${esc(p.dimensions)}. ${esc(p.stock)}. Printed by ${esc(p.manufacturer)}.
    </p>
  </section>

  <section class="section section--tight">
    <h2 class="h2">When will it ship?</h2>
    <div class="prose">
      <p>
        We are not going to give you a date we cannot keep. The print run is not scheduled yet, and
        anyone quoting a shipping week before a run is booked is guessing.
      </p>
      <p>
        What we will do is email the list before anything goes on sale, with the real timeline
        attached. That is the entire purpose of the list.
      </p>
    </div>
  </section>

  <section class="section section--tight">
    <h2 class="h2">What if I miss the campaign?</h2>
    <div class="prose">
      <p>
        The deck is being made either way. Missing the campaign means missing the campaign pricing
        and the first print run &mdash; not missing the deck.
      </p>
      <p>
        It is <strong>${esc(site.edition || 'Volume 1')}</strong>, which should tell you how we are
        thinking about it.
      </p>
    </div>
  </section>

  <section class="section section--tight">
    <h2 class="h2">Buying more than a few?</h2>
    <div class="prose">
      <p>
        Fly shops, guide services, lodges and Trout Unlimited chapters have their own page, with case
        pricing, minimums and lead times. <a href="/wholesale/">Wholesale is here</a>.
      </p>
    </div>
  </section>
</div>

<section class="section section--sunk">
  <div class="wrap wrap--narrow text-center stack" style="--gap:var(--s-4)">
    <p class="eyebrow">Still deciding</p>
    <h2 class="h2">Have a look at what is actually on the cards.</h2>
    <p class="lede">
      All ${site.product.cardCount} flies are online, free, with what each one imitates and the sizes
      it is tied in. No sign-up.
    </p>
    <p class="cluster" style="justify-content:center">
      <a class="btn btn--primary" href="/cards/">What's in the deck</a>
      <a class="btn btn--ghost" href="/flies/">Browse the Fly Library</a>
    </p>
  </div>
</section>`;
}
