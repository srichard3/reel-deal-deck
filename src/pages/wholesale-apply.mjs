/**
 * /wholesale/apply/ — open a wholesale account.
 *
 * The one form on this site that posts to a server. Everything it does happens
 * in netlify/functions/wholesale-apply.mjs: the Shopify customer, the permit
 * upload and the pre-filled cart all need either a secret token or a place to
 * put a file, and a static page has neither.
 *
 * `pricing.wholesale.account.live` in data/site.json is the master switch. It
 * is false while the site is hosted on GitHub Pages, where /api/wholesale-apply
 * does not exist: the page then offers the email route and the form is not
 * emitted at all — not hidden, not disabled, absent. A file input and a form
 * posting into a 404 are not markup that should ship. Flip it the day the site
 * moves to Netlify with the Shopify environment variables set.
 *
 * Progressive enhancement, like the rest of the site, but with a real limit:
 * a file upload needs a multipart POST, and without JavaScript the browser
 * would navigate away to the function's JSON response. So the form posts
 * natively to the function only as a last resort; `.no-js` hides it and shows
 * the email route instead, which is the same honest fallback /suggest/ uses.
 */

import { esc } from '../templates/_shared.mjs';
import { organizationSchema, wholesaleState } from '../templates/_blocks.mjs';

export const meta = {
  path: '/wholesale/apply/',
  title: 'Open a Wholesale Account',
  description:
    'Apply for wholesale pricing on The Reel Deal Deck: your business details and a resale permit. Approved on the spot, with your first order ready to go.',
  priority: 0.6,
  changefreq: 'yearly',
  bodyClass: 'page-ws-apply',
  ogImage: '/og/wholesale.png',
  /* Not a browse destination and nothing to rank for — /wholesale/ is the page
     that should win those queries, and this is the button on it. noindex also
     exempts it from the orphan gate, which is right: it has exactly one
     inbound link and that is deliberate. */
  noindex: true,
  jsonld: [{ '@context': 'https://schema.org', '@type': 'WebPage' }],
};

const field = ({ id, label, type = 'text', required = false, autocomplete, help, placeholder, full = false, as = 'input', options }) => {
  const attrs = [
    `class="input"`,
    `id="ws-${id}"`,
    `name="${id}"`,
    autocomplete ? `autocomplete="${autocomplete}"` : '',
    required ? 'required' : '',
    placeholder ? `placeholder="${esc(placeholder)}"` : '',
    help ? `aria-describedby="ws-${id}-help"` : '',
  ].filter(Boolean).join(' ');

  const control = as === 'select'
    ? `<select ${attrs}>\n${options.map((o) => `          <option value="${esc(o[0])}">${esc(o[1])}</option>`).join('\n')}\n        </select>`
    : as === 'textarea'
      ? `<textarea ${attrs} rows="3"></textarea>`
      : `<input ${attrs} type="${type}">`;

  return `      <div class="field${full ? ' ws-form__full' : ''}">
        <label class="label" for="ws-${id}">${esc(label)}${required ? '' : ' <span class="label__opt">(optional)</span>'}</label>
        ${control}
        ${help ? `<p class="help" id="ws-${id}-help">${help}</p>` : ''}
      </div>`;
};

export default function wholesaleApply({ site }) {
  const base = site.url.replace(/\/$/, '');
  const email = site?.social?.email || 'support@reeldealdeck.com';
  const tiers = site?.pricing?.wholesale?.tiers || [];
  const ws = wholesaleState(site);
  const live = ws.live;
  const login = ws.loginUrl;
  const loginLabel = ws.loginLabel;
  const loginRel = ws.loginRel ? ` rel="${ws.loginRel}"` : '';
  const money = (n) => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  meta.jsonld[0] = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Open a wholesale account',
    description: meta.description,
    url: `${base}/wholesale/apply/`,
    publisher: organizationSchema(site),
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
        { '@type': 'ListItem', position: 2, name: 'Wholesale', item: `${base}/wholesale/` },
        { '@type': 'ListItem', position: 3, name: 'Open an account', item: `${base}/wholesale/apply/` },
      ],
    },
  };

  return `
<nav class="breadcrumbs wrap" aria-label="Breadcrumb">
  <a href="/">Home</a> <span aria-hidden="true">/</span>
  <a href="/wholesale/">Wholesale</a> <span aria-hidden="true">/</span>
  <span aria-current="page">Open an account</span>
</nav>

<section class="section wrap wrap--narrow">
  <p class="eyebrow">Trade</p>
  <h1 class="h1">Open a wholesale account</h1>
  <p class="lede">
    Your business details, a copy of your resale certificate, and a password. You are set up
    straight away, and you land logged in with your pricing showing and your shipping address
    already filled in.
  </p>

  <!-- No prices here. This page sits in FRONT of the gate, so anything printed
       on it is published to everyone, which is the thing /wholesale/ was
       changed to stop. Pricing appears once they are logged in and tagged. -->

  ${!live ? `<div class="notice notice--info">
    <p><strong>Accounts are not open online just yet.</strong> The signup is built and waiting on
    our shop system going live, and we would rather say so than hand you a form that quietly
    fails.</p>
    <p style="margin-block-end:0">
      Email <a href="mailto:${esc(email)}?subject=Wholesale%20account">${esc(email)}</a> with your
      business name, address, phone and a photo of your resale permit, and we will set the account
      up by hand and reply with your pricing. It is the two of us reading it, so it will not sit in
      a queue.
    </p>
  </div>` : `
  <noscript>
    <p class="notice notice--info">
      This form needs JavaScript to attach your permit. Email
      <a href="mailto:${esc(email)}?subject=Wholesale%20account">${esc(email)}</a> with your business
      name, address, phone and a photo of your resale permit instead, and we will set the account up
      by hand and reply with the link.
    </p>
  </noscript>

  <form class="cx-form ws-apply" data-ws-apply
        action="/api/wholesale-apply" method="post" enctype="multipart/form-data" hidden data-js-only>
    <div class="ws-form__grid">
${field({ id: 'business', label: 'Shop or business name', required: true, autocomplete: 'organization', full: true })}
${field({ id: 'contact', label: 'Your name', required: true, autocomplete: 'name' })}
${field({ id: 'role', label: 'Your role', autocomplete: 'organization-title', placeholder: 'Owner, buyer, manager' })}
${field({ id: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email', help: 'This is your username.' })}
${field({ id: 'phone', label: 'Phone', type: 'tel', required: true, autocomplete: 'tel' })}
${field({ id: 'address1', label: 'Street address', required: true, autocomplete: 'address-line1', full: true })}
${field({ id: 'address2', label: 'Suite, unit or floor', autocomplete: 'address-line2', full: true })}
${field({ id: 'city', label: 'City', required: true, autocomplete: 'address-level2' })}
${field({ id: 'region', label: 'State', required: true, autocomplete: 'address-level1', placeholder: 'ID' })}
${field({ id: 'postal', label: 'ZIP', required: true, autocomplete: 'postal-code' })}
${field({ id: 'country', label: 'Country', as: 'select', required: true, autocomplete: 'country', options: [['US', 'United States'], ['CA', 'Canada']] })}
${field({ id: 'taxId', label: 'Resale certificate number', full: true, help: 'Whatever your state calls it. It goes on the account so we do not have to ask again.' })}
${field({ id: 'website', label: 'Website or Instagram', full: true, placeholder: 'So we can see what kind of shop you run' })}

      <!-- The password is the account. It is sent once, straight to Shopify,
           and is never stored, logged or echoed by anything we run — see the
           note in netlify/functions/wholesale-apply.mjs. autocomplete
           new-password is what tells a password manager to offer to generate
           and save one. -->
${field({ id: 'password', label: 'Choose a password', type: 'password', required: true, autocomplete: 'new-password', help: 'At least 8 characters. Your email above is the username.' })}
${field({ id: 'password2', label: 'Confirm password', type: 'password', required: true, autocomplete: 'new-password' })}

      <div class="field ws-form__full">
        <label class="label" for="ws-permit">Resale certificate</label>
        <input class="input ws-apply__file" id="ws-permit" name="permit" type="file"
               accept="application/pdf,image/jpeg,image/png,image/heic,image/heif,image/webp"
               required aria-describedby="ws-permit-help">
        <p class="help" id="ws-permit-help">
          A PDF or a photo, up to 10MB. It is stored on your customer record in our shop system and
          is not shown anywhere on this site.
        </p>
      </div>

${field({ id: 'notes', label: 'Anything we should know', as: 'textarea', full: true, placeholder: 'Timing, an event you are buying for, questions about the case pack' })}

      <!-- Bots fill every field they can see in the markup; people never see
           this one. The function answers 200 and does nothing when it is set,
           so a bot cannot tell it was caught. -->
      <div class="ws-apply__trap" aria-hidden="true">
        <label for="ws-company_website_url">Do not fill this in</label>
        <input id="ws-company_website_url" name="company_website_url" type="text" tabindex="-1" autocomplete="off">
      </div>
    </div>

    <p class="ws-apply__status" role="status" aria-live="polite" data-ws-status></p>

    <button class="btn btn--primary btn--lg" type="submit" data-ws-submit>Open my account</button>

    <p class="help">
      By applying you are telling us this is a business buying for resale. We keep your details to
      set up and run the account, and nothing else &mdash; no marketing list, no third parties.
      Questions first? <a href="mailto:${esc(email)}">${esc(email)}</a>.
    </p>
  </form>`}

  <p class="ws-apply__back">
    <a href="/wholesale/">Back</a> &middot; already have an account?
    <a href="${esc(login)}"${loginRel}>${esc(loginLabel)}</a>
  </p>
</section>

${live ? '<script src="/js/wholesale.js" defer></script>' : ''}
`;
}
