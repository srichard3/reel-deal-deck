/**
 * POST /api/wholesale-apply — open a wholesale account.
 *
 * This is the only server-side code in the project. Everything else is a static
 * file, which is why this exists at all: creating a Shopify customer needs the
 * Admin API, the Admin token must never reach a browser, and a resale permit
 * has to land somewhere a static host cannot provide.
 *
 * What it does, in order:
 *   1. validates the application (server-side — the client checks are a
 *      courtesy, not a control)
 *   2. uploads the resale permit into Shopify Files
 *   3. creates or updates the Shopify customer, tagged `wholesale`, with the
 *      permit attached to the customer record as a metafield
 *   4. builds a Storefront cart carrying their email and shipping address, with
 *      the minimum order already in it
 *   5. returns the cart URL for the browser to follow
 *
 * ZERO DEPENDENCIES, like the rest of the repo. Netlify Functions v2 hands us a
 * standard Request, so `await request.formData()` parses the multipart upload
 * with no library, and `fetch` is built in. Do not add a package here.
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS DOES NOT DO, and you should know before relying on it
 *
 * It does not gate PRICES. Wholesale prices are attached in Shopify, by an
 * automatic discount targeted at the `wholesale` customer segment this function
 * tags people into. That is what makes the wholesale link safe to leak: without
 * a tagged, logged-in account, the discount does not apply and the visitor pays
 * the listed price. A "secret URL" is not a gate and is not used as one here.
 *
 * It approves everybody, immediately, because that is what was asked for. The
 * resale permit is collected and stored but NOT checked. A resale certificate
 * is a sales-tax document: auto-approving means anyone who uploads any file
 * gets wholesale pricing, and potentially a tax-exempt sale, before a human has
 * looked. REVIEW_ONLY=1 switches this to tagging `wholesale-pending` instead,
 * which the discount does not match, so applications queue for approval without
 * any code change. See docs/WHOLESALE-ACCOUNTS.md.
 * ---------------------------------------------------------------------------
 */

export const config = { path: '/api/wholesale-apply' };

/* Shopify's API is versioned quarterly and old versions are retired. Pinned
   here, overridable, and worth checking against Shopify's release notes before
   launch rather than discovering it from a 400. */
const API_VERSION = process.env.SHOPIFY_API_VERSION || '2025-10';

const MAX_BYTES = 10 * 1024 * 1024;          /* 10MB — a photo of a permit */
const PERMIT_TYPES = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/heic': 'heic',
  'image/heif': 'heif',
  'image/webp': 'webp',
};

/* Fields the applicant must give us. Anything not in here is ignored entirely,
   so a crafted POST cannot smuggle extra properties onto the customer. */
const REQUIRED = ['business', 'contact', 'email', 'phone', 'address1', 'city', 'region', 'postal'];
const OPTIONAL = ['address2', 'country', 'website', 'taxId', 'role', 'notes'];

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

/* One place that talks to Shopify, so the token handling and the error shape
   cannot drift between call sites. */
async function shopify(endpoint, token, headerName, query, variables) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json', [headerName]: token },
    body: JSON.stringify({ query, variables }),
  });
  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch { throw new Error(`Shopify returned non-JSON (${res.status})`); }
  if (!res.ok) throw new Error(`Shopify ${res.status}: ${text.slice(0, 300)}`);
  if (body.errors?.length) throw new Error(`Shopify GraphQL: ${JSON.stringify(body.errors).slice(0, 300)}`);
  return body.data;
}

/* userErrors are Shopify's "your request was valid JSON but wrong" channel and
   do not raise an HTTP error, so every mutation has to be checked by hand. */
function assertNoUserErrors(label, payload) {
  const errs = payload?.userErrors || payload?.customerUserErrors || [];
  if (errs.length) throw new Error(`${label}: ${errs.map((e) => e.message).join('; ')}`);
}

export default async (request) => {
  if (request.method !== 'POST') return json(405, { error: 'Use POST.' });

  const store = process.env.SHOPIFY_STORE_DOMAIN;
  const adminToken = process.env.SHOPIFY_ADMIN_TOKEN;
  const storefrontToken = process.env.SHOPIFY_STOREFRONT_TOKEN;
  const variantId = process.env.SHOPIFY_WHOLESALE_VARIANT_ID;

  if (!store || !adminToken) {
    /* Misconfiguration is ours, not the applicant's — say so plainly rather
       than pretending the application failed. */
    console.error('wholesale-apply: SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_TOKEN is not set');
    return json(503, { error: 'Wholesale signup is not switched on yet. Please email us instead.' });
  }

  const admin = `https://${store}/admin/api/${API_VERSION}/graphql.json`;
  const storefront = `https://${store}/api/${API_VERSION}/graphql.json`;

  /* ---------------------------------------------------------------- input -- */

  let form;
  try {
    form = await request.formData();
  } catch {
    return json(400, { error: 'That form could not be read. Please try again.' });
  }

  /* A field no human sees and every naive bot fills in. Answer 200 so the bot
     learns nothing from the response. */
  if (String(form.get('company_website_url') || '').trim()) {
    return json(200, { ok: true, redirect: null });
  }

  const field = (k) => String(form.get(k) ?? '').trim().slice(0, 500);
  const data = {};
  for (const k of [...REQUIRED, ...OPTIONAL]) data[k] = field(k);

  const missing = REQUIRED.filter((k) => !data[k]);
  if (missing.length) return json(400, { error: 'Some required details are missing.', fields: missing });

  if (!/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(data.email)) {
    return json(400, { error: 'That email address does not look right.', fields: ['email'] });
  }

  const permit = form.get('permit');
  if (!permit || typeof permit === 'string' || !permit.size) {
    return json(400, { error: 'Please attach your resale permit.', fields: ['permit'] });
  }
  if (permit.size > MAX_BYTES) {
    return json(400, { error: 'That file is over 10MB. A photo or a PDF scan is plenty.', fields: ['permit'] });
  }
  const ext = PERMIT_TYPES[permit.type];
  if (!ext) {
    return json(400, { error: 'Please send the permit as a PDF or a photo.', fields: ['permit'] });
  }

  const tag = process.env.REVIEW_ONLY === '1' ? 'wholesale-pending' : 'wholesale';

  try {
    /* ------------------------------------------------------- the permit -- */
    /* Staged upload: Shopify hands back a signed URL, we PUT the bytes
       straight at it, then register the result as a File. The permit never
       touches our own storage, which is one less thing holding tax documents. */
    const safeBusiness = data.business.replace(/[^\w .-]+/g, '').slice(0, 60) || 'applicant';
    const filename = `resale-permit-${safeBusiness}-${Date.now()}.${ext}`;

    const staged = await shopify(admin, adminToken, 'X-Shopify-Access-Token', `
      mutation stage($input: [StagedUploadInput!]!) {
        stagedUploadsCreate(input: $input) {
          stagedTargets { url resourceUrl parameters { name value } }
          userErrors { field message }
        }
      }`, {
      input: [{
        filename,
        mimeType: permit.type,
        resource: 'FILE',
        httpMethod: 'POST',
        fileSize: String(permit.size),
      }],
    });
    assertNoUserErrors('stagedUploadsCreate', staged.stagedUploadsCreate);

    const target = staged.stagedUploadsCreate.stagedTargets[0];
    const upload = new FormData();
    for (const p of target.parameters) upload.append(p.name, p.value);
    upload.append('file', permit, filename);
    const put = await fetch(target.url, { method: 'POST', body: upload });
    if (!put.ok) throw new Error(`permit upload failed (${put.status})`);

    const created = await shopify(admin, adminToken, 'X-Shopify-Access-Token', `
      mutation addFile($files: [FileCreateInput!]!) {
        fileCreate(files: $files) { files { id } userErrors { field message } }
      }`, {
      files: [{
        originalSource: target.resourceUrl,
        contentType: ext === 'pdf' ? 'FILE' : 'IMAGE',
        alt: `Resale permit — ${data.business}`,
      }],
    });
    assertNoUserErrors('fileCreate', created.fileCreate);
    const permitId = created.fileCreate.files[0]?.id;

    /* ------------------------------------------------------ the customer -- */
    /* Upsert rather than create: a shop that applies twice should end up with
       one customer, not a duplicate and a confusing "email taken" error. */
    const [firstName, ...rest] = data.contact.split(/\s+/);
    const addresses = [{
      address1: data.address1,
      address2: data.address2 || null,
      city: data.city,
      provinceCode: data.region || null,
      zip: data.postal,
      countryCode: (data.country || 'US').toUpperCase().slice(0, 2),
      company: data.business,
      phone: data.phone,
      firstName: firstName || data.business,
      lastName: rest.join(' ') || null,
    }];

    const metafields = [
      { namespace: 'wholesale', key: 'business_name', type: 'single_line_text_field', value: data.business },
      { namespace: 'wholesale', key: 'applied_at', type: 'date_time', value: new Date().toISOString() },
    ];
    if (data.taxId) metafields.push({ namespace: 'wholesale', key: 'tax_id', type: 'single_line_text_field', value: data.taxId });
    if (data.role) metafields.push({ namespace: 'wholesale', key: 'role', type: 'single_line_text_field', value: data.role });
    if (data.website) metafields.push({ namespace: 'wholesale', key: 'website', type: 'single_line_text_field', value: data.website });
    if (data.notes) metafields.push({ namespace: 'wholesale', key: 'notes', type: 'multi_line_text_field', value: data.notes.slice(0, 2000) });
    if (permitId) metafields.push({ namespace: 'wholesale', key: 'resale_permit', type: 'file_reference', value: permitId });

    const found = await shopify(admin, adminToken, 'X-Shopify-Access-Token', `
      query byEmail($q: String!) { customers(first: 1, query: $q) { nodes { id tags } } }`,
      { q: `email:"${data.email.replace(/"/g, '')}"` });
    const existing = found.customers.nodes[0];

    if (existing) {
      const tags = [...new Set([...(existing.tags || []), tag])];
      const updated = await shopify(admin, adminToken, 'X-Shopify-Access-Token', `
        mutation upd($input: CustomerInput!) {
          customerUpdate(input: $input) { customer { id } userErrors { field message } }
        }`, {
        input: { id: existing.id, phone: data.phone || null, tags, addresses, metafields },
      });
      assertNoUserErrors('customerUpdate', updated.customerUpdate);
    } else {
      const made = await shopify(admin, adminToken, 'X-Shopify-Access-Token', `
        mutation add($input: CustomerInput!) {
          customerCreate(input: $input) { customer { id } userErrors { field message } }
        }`, {
        input: {
          email: data.email,
          phone: data.phone || null,
          firstName: firstName || data.business,
          lastName: rest.join(' ') || null,
          tags: [tag],
          addresses,
          metafields,
          /* They asked for an account; that is consent to be emailed about it,
             and nothing more. Marketing consent is not implied and not set. */
          emailMarketingConsent: null,
        },
      });
      assertNoUserErrors('customerCreate', made.customerCreate);
    }

    /* ----------------------------------------------------------- the cart -- */
    /* A cart that already knows who they are and where it ships, with the
       minimum order in it. Storefront API, because the Admin API has no cart —
       and the Storefront token is the public kind, scoped to carts and
       products, so there is nothing secret riding along here. */
    let redirect = process.env.WHOLESALE_PORTAL_URL || null;

    if (storefrontToken && variantId) {
      try {
        const cart = await shopify(storefront, storefrontToken, 'X-Shopify-Storefront-Access-Token', `
          mutation newCart($input: CartInput!) {
            cartCreate(input: $input) { cart { checkoutUrl } userErrors { field message } }
          }`, {
          input: {
            lines: [{ quantity: 1, merchandiseId: variantId }],
            buyerIdentity: {
              email: data.email,
              phone: data.phone || null,
              countryCode: (data.country || 'US').toUpperCase().slice(0, 2),
              deliveryAddressPreferences: [{
                deliveryAddress: {
                  address1: data.address1,
                  address2: data.address2 || null,
                  city: data.city,
                  province: data.region || null,
                  zip: data.postal,
                  country: (data.country || 'US').toUpperCase().slice(0, 2),
                  company: data.business,
                  phone: data.phone,
                  firstName: firstName || data.business,
                  lastName: rest.join(' ') || null,
                },
              }],
            },
            attributes: [{ key: 'wholesale_application', value: data.business }],
          },
        });
        assertNoUserErrors('cartCreate', cart.cartCreate);
        redirect = cart.cartCreate.cart?.checkoutUrl || redirect;
      } catch (err) {
        /* The account is the thing that matters and it already exists. A cart
           we could not pre-fill is a worse landing page, not a failed signup. */
        console.error('wholesale-apply: cart prefill failed —', err.message);
      }
    }

    return json(200, { ok: true, redirect, pending: tag === 'wholesale-pending' });
  } catch (err) {
    /* Shopify's messages can name internal ids and fields. Log them, and give
       the applicant something true and actionable instead. */
    console.error('wholesale-apply failed:', err?.stack || err);
    return json(502, { error: 'Something went wrong setting up the account. Please email us and we will do it by hand.' });
  }
};
