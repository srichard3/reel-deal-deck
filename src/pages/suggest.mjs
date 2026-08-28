/* /suggest/ — suggest a fly for Volume 2.
 *
 * The other forms on this site are honest placeholders: data-capture writes to
 * localStorage and says so, because nothing here has a backend yet. That is
 * fine for "join the list" — the list has not opened. It would be useless here.
 * A suggestion that never reaches Ken and Audrey is worse than no form at all,
 * because the reader believes they have sent something.
 *
 * So this one composes a real email. suggest.js turns the fields into a
 * formatted message and opens the reader's mail client; it also prints the
 * message on the page with a copy button, because a mailto: link is useless to
 * anyone without a mail client configured. With JS off the form is replaced by
 * the same address and a template to paste. Every path ends in a real inbox.
 */

import { esc } from '../templates/_shared.mjs';
import { organizationSchema } from '../templates/_blocks.mjs';

export const meta = {
  path: '/suggest/',
  title: 'Suggest a Fly for Volume 2',
  description:
    'Tell Ken and Audrey which fly belongs in the next Reel Deal Deck. Say what it imitates and where you fish it — every suggestion goes straight to their inbox.',
  priority: 0.6,
  changefreq: 'monthly',
  bodyClass: 'page-suggest',
  ogImage: '/og/flies.png',
  jsonld: [
    { '@context': 'https://schema.org', '@type': 'WebPage' },  // filled in the render
  ],
};

export default function suggest({ site, flies }) {
  const base = site.url.replace(/\/$/, '');
  const list = (Array.isArray(flies) ? flies : []).filter((f) => f && f.name);
  const email = site?.social?.email || 'reeldealdeck@gmail.com';
  const edition = site?.cardCraft?.edition || 'Volume 1';
  const count = site?.product?.cardCount ?? 54;

  meta.jsonld[0] = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Suggest a fly for Volume 2',
    description: meta.description,
    url: `${base}/suggest/`,
    publisher: organizationSchema(site),
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
        { '@type': 'ListItem', position: 2, name: 'Suggest a fly', item: `${base}/suggest/` },
      ],
    },
  };

  /* The existing names, so the input can autocomplete and a reader can see for
     themselves that their pattern is already in the deck before they send it. */
  const datalist = list
    .map((f) => `<option value="${esc(f.name)}"></option>`)
    .join('\n      ');

  return `
<div class="wrap wrap--narrow">
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <ol>
      <li><a href="/">Home</a></li>
      <li><span aria-current="page">Suggest a fly</span></li>
    </ol>
  </nav>

  <header class="page-head">
    <p class="eyebrow" style="margin-block-start:var(--s-5)">Volume 2</p>
    <h1 class="h1 page-head__title">Which fly did we miss?</h1>
    <p class="page-head__lede lede">
      ${esc(edition)} holds ${esc(count)} flies, and there was no version of that list
      that did not leave something out. Tell us the pattern you would have put in,
      what it imitates and where you fish it. It goes straight to Ken and Audrey,
      who read every one of these.
    </p>
  </header>
</div>

<section class="section">
  <div class="wrap wrap--narrow">
    <form class="stack suggest__form" data-suggest style="--gap:var(--s-5)">
      <div class="field">
        <label class="label" for="sg-fly">The fly <span class="label__req" aria-hidden="true">&#9830;</span></label>
        <input class="input" id="sg-fly" name="fly" type="text" required
               list="sg-existing" autocomplete="off"
               placeholder="Purple Haze, Sculpzilla, Perdigon&hellip;"
               aria-describedby="sg-fly-help">
        <datalist id="sg-existing">
      ${datalist}
        </datalist>
        <p class="help" id="sg-fly-help">
          Start typing and the box will tell you if it is already in the deck &mdash;
          or <a href="/flies/">browse the Fly-brary</a> first.
        </p>
      </div>

      <div class="field">
        <label class="label" for="sg-why">Why it belongs <span class="label__req" aria-hidden="true">&#9830;</span></label>
        <textarea class="input" id="sg-why" name="why" rows="5" required
                  placeholder="What it imitates, when it works, and why you would not fish without it."
                  aria-describedby="sg-why-help"></textarea>
        <p class="help" id="sg-why-help">
          The useful part. Every card has to say what the fly imitates, so that is
          the bit we cannot write without you.
        </p>
      </div>

      <div class="form-row">
        <div class="field">
          <label class="label" for="sg-water">Where you fish it</label>
          <input class="input" id="sg-water" name="water" type="text"
                 placeholder="Henry&rsquo;s Fork, spring creeks, anywhere&hellip;">
        </div>
        <div class="field">
          <label class="label" for="sg-name">Your name</label>
          <input class="input" id="sg-name" name="name" type="text" autocomplete="name"
                 placeholder="So we can credit you">
        </div>
      </div>

      <div class="cluster" style="--gap:var(--s-4)">
        <button class="btn btn--primary btn--lg" type="submit">Send it to Ken and Audrey</button>
        <p class="help" style="margin:0">
          Fields marked <span class="label__req" aria-hidden="true">&#9830;</span><span class="visually-hidden">with a diamond</span>
          are required. Nothing is stored on this site.
        </p>
      </div>
    </form>

    <!-- The no-JS path, and the fallback for anyone without a mail client. CSS
         hides the form on .no-js, because a form whose submit button reloads
         the page and empties the fields is worse than no form. The address is
         the one the contact page publishes. -->
    <div class="suggest__manual" data-suggest-manual>
      <p class="suggest__manual-title">Prefer to just email us?</p>
      <p>
        Email <a href="mailto:${esc(email)}?subject=Fly%20suggestion%20for%20Volume%202">${esc(email)}</a>
        with the fly&rsquo;s name, what it imitates and where you fish it. That is all
        we need, and it reaches exactly the same two people.
      </p>
    </div>
  </div>
</section>

<section class="section section--sunk">
  <div class="wrap wrap--narrow">
    <h2 class="h2">What happens to it</h2>
    <div class="prose">
      <p>
        It arrives in the same inbox as everything else, and Ken and Audrey read
        it. That is the whole process &mdash; there is no panel and no voting.
      </p>
      <p>
        We are not going to promise your fly makes the cut. A deck is
        ${esc(count)} slots and the arguments about the last ten are the hardest
        part of building one. What we can promise is that a pattern suggested by
        somebody who actually fishes it beats one we picked off a list, so these
        genuinely change the deck.
      </p>
      <p>
        If we do draw it, we will ask before putting your name anywhere.
      </p>
    </div>
    <p class="cluster" style="margin-block-start:var(--s-6);--gap:var(--s-3)">
      <a class="btn btn--ghost" href="/flies/">See what is already in ${esc(edition)}</a>
      <a class="btn btn--quiet" href="/deck/">The deck itself</a>
    </p>
  </div>
</section>

<script src="/js/suggest.js" defer></script>`;
}
