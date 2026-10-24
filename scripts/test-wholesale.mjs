/**
 * scripts/test-wholesale.mjs — the guard rails on /api/wholesale-apply.
 *
 * The function is the only server-side code in the project and its input
 * validation is the security boundary, so it gets the only test suite here.
 * Everything below runs with no Shopify store and no network: validation
 * happens before the first fetch, and the one case that gets past it stubs
 * fetch to prove it reached the Admin API and leaked nothing on the way back.
 *
 * Zero dependencies, like everything else. Run with: npm run test:wholesale
 */

const mod = await import('../netlify/functions/wholesale-apply.mjs');
const fn = mod.default;

const good = {
  business: 'Henry’s Fork Anglers', firstName: 'Sam', lastName: 'Rivers',
  email: 'sam@example.com', phone: '208-555-0101', address1: '12 Main St',
  city: 'Eagle', region: 'ID', postal: '83616', country: 'US',
};
const pdf = (bytes = 1024, type = 'application/pdf') =>
  new File([new Uint8Array(bytes)], 'permit.pdf', { type });

function body(fields = {}, permit = pdf()) {
  const fd = new FormData();
  for (const [k, v] of Object.entries({ ...good, ...fields })) if (v !== null) fd.append(k, v);
  if (permit) fd.append('permit', permit, 'permit.pdf');
  return fd;
}
const post = (fd) => new Request('https://x/api/wholesale-apply', { method: 'POST', body: fd });

const cases = [
  ['GET is rejected', () => fn(new Request('https://x/api/wholesale-apply')), 405],
  ['honeypot filled is a silent no-op', () => fn(post(body({ company_website_url: 'http://spam' }))), 200],
  ['missing business name', () => fn(post(body({ business: null }))), 400],
  ['missing last name', () => fn(post(body({ lastName: null }))), 400],
  ['missing address', () => fn(post(body({ address1: null }))), 400],
  ['malformed email', () => fn(post(body({ email: 'not-an-email' }))), 400],
  /* Shopify validates the province and nothing else: it saved "abc" as a zip
     and "banana" as a phone without complaint, and rejected province "XX" with
     an error the applicant read as "something went wrong". */
  ['a state that does not exist', () => fn(post(body({ region: 'XX' }))), 400],
  ['a province in the wrong country', () => fn(post(body({ region: 'ON', country: 'US' }))), 400],
  ['a zip that is not a zip', () => fn(post(body({ postal: 'abc' }))), 400],
  ['a zip that is too short', () => fn(post(body({ postal: '1' }))), 400],
  ['a Canadian postal code in a US address', () => fn(post(body({ postal: 'K1A 0B1' }))), 400],
  ['a phone with no area code', () => fn(post(body({ phone: '555-0101' }))), 400],
  ['no permit attached', () => fn(post(body({}, null))), 400],
  ['permit over 10MB', () => fn(post(body({}, pdf(11 * 1024 * 1024)))), 400],
  ['permit of a disallowed type', () => fn(post(body({}, pdf(1024, 'application/zip')))), 400],
];

let fail = 0;
process.env.SHOPIFY_STORE_DOMAIN = 'test.myshopify.com';
process.env.SHOPIFY_ADMIN_TOKEN = 'shpat_test';
/* Optional: it only pre-fills the cart. The account is Admin-only now. */
process.env.SHOPIFY_STOREFRONT_TOKEN = 'sfat_test';
for (const [name, run, want] of cases) {
  const res = await run();
  const got = res.status;
  const j = await res.clone().json().catch(() => ({}));
  const ok = got === want;
  if (!ok) fail++;
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${String(got).padEnd(4)} (want ${want})  ${name}${j.error ? '  — "' + j.error + '"' : ''}`);
}

/* NOTHING UNDECLARED REACHES SHOPIFY. There is no password to leak any more,
   so the risk moved: the danger is now a crafted POST smuggling a field onto
   the customer record — `tags` would be the prize, since the tag IS the trade
   price. REQUIRED and OPTIONAL are the whole input surface; this proves it by
   posting poison in several field names and reading the outbound GraphQL. */
{
  const POISON = 'zQ7-unmistakable-value';
  const sent = [];
  const origFetch2 = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    sent.push(String(init?.body || ''));
    throw new Error('blocked in test');
  };
  const origError = console.error;
  const seen = [];
  console.error = (...a) => seen.push(a.map(String).join(' '));

  const r = await fn(post(body({
    password: POISON, password2: POISON, tags: POISON, id: POISON,
    customerTag: POISON, metafields: POISON, role: POISON, taxId: POISON,
    contact: POISON,
  })));
  const text = await r.text();

  globalThis.fetch = origFetch2;
  console.error = origError;

  const inSent = sent.filter((b) => b.includes(POISON)).length;
  const inBody = text.includes(POISON) ? 1 : 0;
  const inLogs = seen.filter((l) => l.includes(POISON)).length;
  const okSmuggle = inSent === 0 && inBody === 0 && inLogs === 0;
  if (!okSmuggle) fail++;
  console.log(`${okSmuggle ? '  ok  ' : ' FAIL '} undeclared fields never reach Shopify (${inSent}), a response (${inBody}) or a log (${inLogs})`);
}

/* Two things that cost a real applicant a signup on 2026-10-06, both of which
   surfaced only as "something went wrong setting up the account":

   1. The permit was registered as IMAGE for anything that was not a PDF, so
      Shopify tried to DECODE it. A HEIC from an iPhone camera — the default
      format a phone produces — landed as a FAILED file and the metafield could
      not reference it. It is a tax document, never rendered; FILE always.

   2. The customer carried a phone number, and Shopify enforces a unique phone
      across customers. A second buyer at the same shop, or a shop that already
      exists as a retail customer, failed with "Phone has already been taken".
      The number belongs on the address, which has no such rule. */
{
  const sent = [];
  const origFetch = globalThis.fetch;
  /* Answer each Shopify call well enough to reach the next one, so the two
     payloads under test are actually built. A stub that throws immediately
     proves nothing — the first version of this test passed the phone check and
     failed the file check because fileCreate never ran. */
  globalThis.fetch = async (url, init) => {
    const b = String(init?.body || '');
    sent.push(b);
    const ok = (o) => new Response(JSON.stringify({ data: o }), {
      status: 200, headers: { 'content-type': 'application/json' } });
    if (!b.includes('{')) return new Response('', { status: 200 });   /* the staged PUT */
    if (b.includes('byEmail')) return ok({ customers: { nodes: [] } });
    if (b.includes('stagedUploadsCreate')) return ok({ stagedUploadsCreate: {
      stagedTargets: [{ url: 'https://example.invalid/upload', resourceUrl: 'x', parameters: [] }],
      userErrors: [] } });
    if (b.includes('fileCreate')) return ok({ fileCreate: {
      files: [{ id: 'gid://shopify/GenericFile/1' }], userErrors: [] } });
    if (b.includes('customerCreate')) return ok({ customerCreate: {
      customer: { id: 'gid://shopify/Customer/1' }, userErrors: [] } });
    throw new Error('blocked in test');
  };
  const origError = console.error;
  console.error = () => {};
  await fn(post(body({}, new File([new Uint8Array(64)], 'permit.heic', { type: 'image/heic' }))));
  globalThis.fetch = origFetch;
  console.error = origError;

  const fileCall = sent.find((b) => b.includes('fileCreate')) || '';
  const asFile = fileCall.includes('"contentType":"FILE"') && !fileCall.includes('"IMAGE"');
  if (!asFile) fail++;
  console.log(`${asFile ? '  ok  ' : ' FAIL '} a HEIC permit is registered as FILE, never IMAGE`);

  const custCall = sent.find((b) => b.includes('customerCreate')) || '';
  const noCustPhone = custCall !== '' && !/"phone":"[^"]*","tags"/.test(custCall);
  if (!noCustPhone) fail++;
  console.log(`${noCustPhone ? '  ok  ' : ' FAIL '} no customer-level phone (Shopify requires it unique)`);
}

/* An email that has ALREADY APPLIED is a sign-in, not a signup — and it is
   answered BEFORE the permit is staged, so a repeat applicant cannot leave an
   orphaned tax document in Shopify Files. (An existing account with no
   wholesale tag is a different case entirely, and is tested above.) */
{
  const calls = [];
  const origFetch3 = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    calls.push(String(init?.body || ''));
    return new Response(JSON.stringify({
      data: { customers: { nodes: [{ id: 'gid://shopify/Customer/1', tags: ['wholesale'], addresses: [] }] } },
    }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  const r = await fn(post(body()));
  globalThis.fetch = origFetch3;

  const okDup = r.status === 409;
  const noUpload = !calls.some((c) => c.includes('stagedUploadsCreate'));
  if (!okDup) fail++;
  if (!noUpload) fail++;
  console.log(`${okDup ? '  ok  ' : ' FAIL '} ${r.status}  (want 409)  an email that already applied is a sign-in`);
  console.log(`${noUpload ? '  ok  ' : ' FAIL '} the permit is not uploaded before that check (no orphan file)`);
}

/* A RETAIL BUYER UPGRADING. The likely path to a wholesale account is a shop
   owner who bought one deck to look at it — creating an account at checkout —
   and now wants to stock it. Refusing that left no way forward at all: the form
   said "sign in instead" and signing in gave them nothing, because an account
   without the tag is a retail account. Only an email that has ALREADY applied
   is refused now. */
function withExisting(nodes, sink) {
  const ok = (o) => new Response(JSON.stringify({ data: o }), {
    status: 200, headers: { 'content-type': 'application/json' } });
  return async (url, init) => {
    const b = String(init?.body || '');
    if (sink) sink.push(b);
    if (!b.includes('{')) return new Response('', { status: 200 });
    if (b.includes('byEmail')) return ok({ customers: { nodes } });
    if (b.includes('stagedUploadsCreate')) return ok({ stagedUploadsCreate: {
      stagedTargets: [{ url: 'https://example.invalid/upload', resourceUrl: 'x', parameters: [] }], userErrors: [] } });
    if (b.includes('fileCreate')) return ok({ fileCreate: { files: [{ id: 'gid://shopify/GenericFile/1' }], userErrors: [] } });
    if (b.includes('tagsAdd')) return ok({ tagsAdd: { node: { id: 'gid://shopify/Customer/9' }, userErrors: [] } });
    if (b.includes('customerUpdate')) return ok({ customerUpdate: { customer: { id: 'gid://shopify/Customer/9' }, userErrors: [] } });
    if (b.includes('customerCreate')) return ok({ customerCreate: { customer: { id: 'gid://shopify/Customer/9' }, userErrors: [] } });
    throw new Error('blocked in test');
  };
}

{
  const sent = [];
  const origFetch = globalThis.fetch;
  const origError = console.error;
  console.error = () => {};

  /* a retail customer: no wholesale tag, and an address already on file */
  globalThis.fetch = withExisting(
    [{ id: 'gid://shopify/Customer/9', tags: ['newsletter'], addresses: [{ id: 'a1' }] }], sent);
  const r = await fn(post(body()));
  globalThis.fetch = origFetch;
  console.error = origError;

  const accepted = r.status === 200;
  if (!accepted) fail++;
  console.log(`${accepted ? '  ok  ' : ' FAIL '} ${r.status}  (want 200)  a retail buyer with no wholesale tag can apply`);

  /* tagsAdd, not customerUpdate(tags:) — the latter REPLACES the tag list */
  const usedTagsAdd = sent.some((b) => b.includes('tagsAdd'));
  const upd = sent.find((b) => b.includes('customerUpdate')) || '';
  const keptTags = usedTagsAdd && !upd.includes('"tags"');
  if (!keptTags) fail++;
  console.log(`${keptTags ? '  ok  ' : ' FAIL '} their existing tags are added to, not replaced`);

  /* addresses REPLACES the address book, so it must not be sent when they
     already have one — a retail buyer's home address is not ours to overwrite */
  const keptAddress = !upd.includes('"addresses"');
  if (!keptAddress) fail++;
  console.log(`${keptAddress ? '  ok  ' : ' FAIL '} their existing address is left alone`);
}

{
  const origFetch = globalThis.fetch;
  const origError = console.error;
  console.error = () => {};
  globalThis.fetch = withExisting(
    [{ id: 'gid://shopify/Customer/9', tags: ['wholesale-pending'], addresses: [] }]);
  const r = await fn(post(body()));
  globalThis.fetch = origFetch;
  console.error = origError;
  const refused = r.status === 409;
  if (!refused) fail++;
  console.log(`${refused ? '  ok  ' : ' FAIL '} ${r.status}  (want 409)  an email that already applied is still refused`);
}

/* THE DUPLICATE RACE. Shopify's customer search index lags about five seconds
   behind customerCreate (measured 2026-10-06), so the pre-check can look up an
   email, find nothing, and be wrong — an applicant who double-clicks hits it.
   Shopify refuses the create itself, and that refusal has to read as "you
   already have an account", not as a server fault. Stubbed so the lookup finds
   NOTHING and the create reports the email taken: exactly the race. */
{
  const origFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    const b = String(init?.body || '');
    const ok = (o) => new Response(JSON.stringify({ data: o }), {
      status: 200, headers: { 'content-type': 'application/json' } });
    if (!b.includes('{')) return new Response('', { status: 200 });
    if (b.includes('byEmail')) return ok({ customers: { nodes: [] } });   /* index is behind */
    if (b.includes('stagedUploadsCreate')) return ok({ stagedUploadsCreate: {
      stagedTargets: [{ url: 'https://example.invalid/upload', resourceUrl: 'x', parameters: [] }],
      userErrors: [] } });
    if (b.includes('fileCreate')) return ok({ fileCreate: {
      files: [{ id: 'gid://shopify/GenericFile/1' }], userErrors: [] } });
    if (b.includes('customerCreate')) return ok({ customerCreate: {
      customer: null, userErrors: [{ field: ['email'], message: 'Email has already been taken' }] } });
    throw new Error('blocked in test');
  };
  const origError = console.error;
  console.error = () => {};
  const r = await fn(post(body()));
  const j = await r.clone().json().catch(() => ({}));
  globalThis.fetch = origFetch;
  console.error = origError;

  const good = r.status === 409 && j.existing === true;
  if (!good) fail++;
  console.log(`${good ? '  ok  ' : ' FAIL '} ${r.status}  (want 409)  a duplicate the search index missed still reads as a sign-in`);
}

/* The email is lowercased before anything compares it, because Shopify stores
   and matches it lowercased. Sam@Shop.com must not become a second account. */
{
  const seen = [];
  const origFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => { seen.push(String(init?.body || '')); throw new Error('blocked in test'); };
  const origError = console.error;
  console.error = () => {};
  await fn(post(body({ email: 'Sam.Rivers@Example.COM' })));
  globalThis.fetch = origFetch;
  console.error = origError;
  const q = seen.find((b) => b.includes('byEmail')) || '';
  const lower = q.includes('sam.rivers@example.com') && !q.includes('Sam.Rivers@Example.COM');
  if (!lower) fail++;
  console.log(`${lower ? '  ok  ' : ' FAIL '} the email is lowercased before it is looked up`);
}

/* THE WELCOME EMAIL. Only on a signup Shopify actually accepted — an email
   saying "your account is open" to somebody whose account was refused is worse
   than no email at all. And it must never be able to fail the signup: the
   account exists either way. */
{
  const origFetch = globalThis.fetch;
  const origError = console.error;
  console.error = () => {};
  process.env.RESEND_API_KEY = 'test-key';
  process.env.RESEND_FROM = 'Reel Deal <hello@send.example.com>';

  const resendCalls = () => sent.filter((u) => String(u).includes('api.resend.com')).length;
  let sent = [];
  let lastMail = null;
  process.env.SHOPIFY_SHOP_URL = 'https://shop.example.com';
  /* Bodies, not just URLs: the permit cleanup is a mutation, so proving it ran
     means reading what was actually sent. */
  let bodies = [];
  const deletedFileIds = () => bodies
    .filter((b) => b.includes('fileDelete'))
    .map((b) => { try { return JSON.parse(b).variables.fileIds; } catch { return []; } })
    .flat();
  const shop = (nodes, createErrors = []) => async (url, init) => {
    sent.push(url);
    bodies.push(String(init?.body || ''));
    if (String(url).includes('api.resend.com')) {
      try { lastMail = JSON.parse(String(init?.body || '{}')); } catch { lastMail = null; }
    }
    const b = String(init?.body || '');
    const ok = (o) => new Response(JSON.stringify({ data: o }), {
      status: 200, headers: { 'content-type': 'application/json' } });
    if (String(url).includes('api.resend.com')) return new Response('{"id":"1"}', { status: 200 });
    if (!b.includes('{')) return new Response('', { status: 200 });
    if (b.includes('byEmail')) return ok({ customers: { nodes } });
    if (b.includes('stagedUploadsCreate')) return ok({ stagedUploadsCreate: {
      stagedTargets: [{ url: 'https://example.invalid/upload', resourceUrl: 'x', parameters: [] }], userErrors: [] } });
    if (b.includes('fileCreate')) return ok({ fileCreate: { files: [{ id: 'gid://shopify/GenericFile/1' }], userErrors: [] } });
    if (b.includes('customerCreate')) return ok({ customerCreate: {
      customer: createErrors.length ? null : { id: 'gid://shopify/Customer/9' }, userErrors: createErrors } });
    if (b.includes('fileDelete')) return ok({ fileDelete: {
      deletedFileIds: ['gid://shopify/GenericFile/1'], userErrors: [] } });
    throw new Error('blocked in test');
  };

  /* 1. a signup Shopify accepted */
  sent = []; bodies = []; globalThis.fetch = shop([]);
  let r = await fn(post(body()));
  const sentOnSuccess = r.status === 200 && resendCalls() === 1;
  if (!sentOnSuccess) fail++;
  console.log(`${sentOnSuccess ? '  ok  ' : ' FAIL '} the welcome email is sent once, on a successful signup`);

  /* The sign-in link must carry return_url. A bare /account 302s to Shopify's
     hosted dashboard, which greets a trade buyer with a "Shop now" card for
     the RETAIL deck — the one place a new wholesaler must not be sent, and
     the exact thing this link was changed to avoid. */
  const want = 'https://shop.example.com/account/login?return_url=%2Fpages%2Fwholesale';
  const mailText = lastMail ? String(lastMail.text || '') : '';
  const mailHtml = lastMail ? String(lastMail.html || '') : '';
  const bareAccount = /shop\.example\.com\/account(?!\/login)/.test(mailText + mailHtml);
  const signInOk = mailText.includes(want) && mailHtml.includes(`href="${want}"`) && !bareAccount;
  if (!signInOk) fail++;
  console.log(`${signInOk ? '  ok  ' : ' FAIL '} the welcome email signs them in to the ordering page, never the bare /account dashboard`);

  /* 2. an email Shopify refused — nothing may be sent */
  sent = []; bodies = []; globalThis.fetch = shop([], [{ field: ['email'], message: 'Email has already been taken' }]);
  r = await fn(post(body()));
  const silentOnRefusal = r.status === 409 && resendCalls() === 0;
  if (!silentOnRefusal) fail++;
  console.log(`${silentOnRefusal ? '  ok  ' : ' FAIL '} ${r.status}  nothing is emailed when Shopify refuses the account`);

  /* 2b. Any detail Shopify refuses BY NAME is the applicant's to correct, so
         it must come back as a 400 marking that field — not the 502 "we could
         not set it up, email us" that blames the system and marks nothing.
         Shopify validates harder than this function and harder than the
         browser, so each of these passed both before being refused here.
         Shopify's own wording must never reach the page: it names internal
         fields and is not written for the person reading it. */
  const refusals = [
    { field: ['input', 'email'], message: 'Email is invalid', want: 'email' },
    { field: ['input', 'phone'], message: 'Phone is not a valid phone number', want: 'phone' },
    { field: ['input', 'addresses', '0', 'zip'], message: 'Zip is not valid for province', want: 'postal' },
    { field: ['input', 'addresses', '0', 'countryCode'], message: 'Country is not supported', want: 'country' },
  ];
  for (const c of refusals) {
    sent = []; bodies = []; globalThis.fetch = shop([], [{ field: c.field, message: c.message }]);
    r = await fn(post(body()));
    const j = await r.clone().json().catch(() => ({}));
    const ok = r.status === 400
      && Array.isArray(j.fields) && j.fields.includes(c.want)
      && !String(j.error || '').includes(c.message)
      && resendCalls() === 0
      /* and the permit that was uploaded before the create must not be left
         behind — they will send the whole form again, certificate and all. */
      && deletedFileIds().includes('gid://shopify/GenericFile/1');
    if (!ok) fail++;
    console.log(`${ok ? '  ok  ' : ' FAIL '} ${r.status}  Shopify refusing ${JSON.stringify(c.field)} marks "${c.want}" and discards the permit`);
  }

  /* And the other half of that rule: a refusal naming something this form has
     no input for must NOT be dressed up as a field error. Marking the wrong
     box sends somebody to re-type a detail that was never the problem, so an
     unrecognised field stays a 502 and the honest "email us". */
  sent = []; bodies = []; globalThis.fetch = shop([], [{ field: ['input', 'taxExemptions'], message: 'Not permitted' }]);
  r = await fn(post(body()));
  const unknownStays502 = r.status === 502 && resendCalls() === 0;
  if (!unknownStays502) fail++;
  console.log(`${unknownStays502 ? '  ok  ' : ' FAIL '} ${r.status}  a refusal naming no form field stays a 502 rather than marking the wrong one`);

  /* 2c. No orphaned tax document, on any path that gets past the upload.

         The permit reaches Shopify Files BEFORE the customer is created, so
         the record can be born complete in one call. The cost is that every
         later failure leaves a file no customer points at — and a resale
         certificate carries a tax ID on a CDN with no access check, so an
         orphan is somebody's tax paperwork sitting in a reachable place,
         attached to nothing. */

  /* the race: the pre-check could not see a record that already existed */
  sent = []; bodies = []; globalThis.fetch = shop(
    [{ id: 'gid://shopify/Customer/4', tags: ['wholesale'] }],
    [{ field: ['input', 'email'], message: 'Email has already been taken' }]);
  r = await fn(post(body()));
  const raceCleans = r.status === 409 && resendCalls() === 0;
  if (!raceCleans) fail++;
  console.log(`${raceCleans ? '  ok  ' : ' FAIL '} ${r.status}  an email taken before the upload is refused without one`);

  /* Shopify down mid-signup: the create throws rather than answering */
  sent = []; bodies = [];
  const base = shop([]);
  globalThis.fetch = async (url, init) => {
    const b = String(init?.body || '');
    if (b.includes('customerCreate')) {
      sent.push(url); bodies.push(b);
      return new Response('upstream exploded', { status: 500 });
    }
    return base(url, init);
  };
  r = await fn(post(body()));
  const throwCleans = r.status === 502
    && deletedFileIds().includes('gid://shopify/GenericFile/1')
    && resendCalls() === 0;
  if (!throwCleans) fail++;
  console.log(`${throwCleans ? '  ok  ' : ' FAIL '} ${r.status}  a signup that throws after the upload discards the permit`);

  /* 2d. The pre-filled cart must hold TWO bricks, not one. The wholesale unit
         is a single brick now and the minimum is two of them, so a cart
         pre-filled with one lands the applicant below the minimum the trade
         page states — the first screen of their account contradicting it. */
  sent = []; bodies = [];
  process.env.SHOPIFY_STOREFRONT_TOKEN = 'sf-test';
  process.env.SHOPIFY_WHOLESALE_VARIANT_ID = 'gid://shopify/ProductVariant/1';
  globalThis.fetch = async (url, init) => {
    const b = String(init?.body || '');
    if (b.includes('cartCreate')) {
      sent.push(url); bodies.push(b);
      return new Response(JSON.stringify({ data: { cartCreate: {
        cart: { checkoutUrl: 'https://shop.example.com/cart/c/abc' }, userErrors: [] } } }),
        { status: 200, headers: { 'content-type': 'application/json' } });
    }
    return shop([])(url, init);
  };
  r = await fn(post(body()));
  const cartCall = bodies.find((b) => b.includes('cartCreate')) || '';
  let prefillQty = null;
  try { prefillQty = JSON.parse(cartCall).variables.input.lines[0].quantity; } catch {}
  const twoBricks = r.status === 200 && prefillQty === 2;
  if (!twoBricks) fail++;
  console.log(`${twoBricks ? '  ok  ' : ' FAIL '} the pre-filled cart holds two bricks, the minimum order (got ${prefillQty})`);
  delete process.env.SHOPIFY_STOREFRONT_TOKEN;
  delete process.env.SHOPIFY_WHOLESALE_VARIANT_ID;

  /* 3. a submission rejected before Shopify is reached at all */
  sent = []; bodies = []; globalThis.fetch = shop([]);
  r = await fn(post(body({ postal: 'abc' })));
  const silentOnInvalid = r.status === 400 && resendCalls() === 0;
  if (!silentOnInvalid) fail++;
  console.log(`${silentOnInvalid ? '  ok  ' : ' FAIL '} ${r.status}  nothing is emailed when the form is invalid`);

  /* 4. Resend itself down — the account exists, so the signup still succeeds,
        and the failure must not drag the API key into a log line with it. */
  sent = [];
  const logged = [];
  console.error = (...a) => logged.push(a.map(String).join(' '));
  globalThis.fetch = async (url, init) => {
    if (String(url).includes('api.resend.com')) return new Response('upstream down', { status: 500 });
    return shop([])(url, init);
  };
  r = await fn(post(body()));
  const bodyText = await r.clone().text();
  console.error = () => {};
  const survives = r.status === 200;
  if (!survives) fail++;
  console.log(`${survives ? '  ok  ' : ' FAIL '} ${r.status}  (want 200)  a failed welcome email does not fail the signup`);

  const keyLeaked = logged.some((l) => l.includes('test-key')) || bodyText.includes('test-key');
  if (keyLeaked) fail++;
  console.log(`${keyLeaked ? ' FAIL ' : '  ok  '} the Resend key reaches neither a log line nor a response`);

  /* 5. unconfigured: no key, no email, no change */
  delete process.env.RESEND_API_KEY;
  delete process.env.RESEND_FROM;
  sent = []; bodies = []; globalThis.fetch = shop([]);
  r = await fn(post(body()));
  const offByDefault = r.status === 200 && resendCalls() === 0;
  if (!offByDefault) fail++;
  console.log(`${offByDefault ? '  ok  ' : ' FAIL '} with no RESEND_API_KEY nothing is sent and the signup is unaffected`);

  globalThis.fetch = origFetch;
  console.error = origError;
}

/* unset credentials must say so rather than pretending the application failed */
delete process.env.SHOPIFY_ADMIN_TOKEN;
const res = await fn(post(body()));
const ok = res.status === 503;
if (!ok) fail++;
console.log(`${ok ? '  ok  ' : ' FAIL '} ${res.status}  (want 503)  unconfigured says signup is off`);

/* Dev Dashboard apps have no permanent token: a client id and secret are
   exchanged for a 24-hour one. That path must satisfy the guard on its own,
   and the SECRET must never surface — it is the only long-lived credential
   left in the system now that the static token is optional. */
{
  const SECRET = 'shpss_zQ7-unmistakable-secret';
  delete process.env.SHOPIFY_ADMIN_TOKEN;
  process.env.SHOPIFY_CLIENT_ID = 'test-client-id';
  process.env.SHOPIFY_CLIENT_SECRET = SECRET;

  const seen = [];
  const origError = console.error;
  console.error = (...a) => seen.push(a.map(String).join(' '));
  const origFetch = globalThis.fetch;
  let exchanged = null;
  globalThis.fetch = async (url, init) => {
    if (String(url).endsWith('/admin/oauth/access_token')) {
      exchanged = String(init?.body || '');
      /* Fail the exchange, so the error path is the one under test. */
      return new Response('{"error":"invalid_client"}', { status: 401 });
    }
    throw new Error('blocked in test');
  };

  const r = await fn(post(body()));
  const text = await r.text();
  globalThis.fetch = origFetch;
  console.error = origError;

  const notOff = r.status !== 503;
  if (!notOff) fail++;
  console.log(`${notOff ? '  ok  ' : ' FAIL '} ${r.status}  (not 503)  client id + secret satisfy the guard on their own`);

  const tried = exchanged !== null && exchanged.includes('grant_type=client_credentials');
  if (!tried) fail++;
  console.log(`${tried ? '  ok  ' : ' FAIL '} it exchanges the client credentials for a token`);

  const leaked = text.includes(SECRET) || seen.some((l) => l.includes(SECRET));
  if (leaked) fail++;
  console.log(`${leaked ? ' FAIL ' : '  ok  '} the client secret reaches neither a response nor a log`);

  delete process.env.SHOPIFY_CLIENT_ID;
  delete process.env.SHOPIFY_CLIENT_SECRET;
  process.env.SHOPIFY_ADMIN_TOKEN = 'shpat_test';
}

/* The storefront token, by contrast, is OPTIONAL: it only pre-fills the cart.
   Without it the signup must still go through — the account is what earns the
   pricing, and a worse landing page is not a failed application. */
process.env.SHOPIFY_ADMIN_TOKEN = 'shpat_test';
delete process.env.SHOPIFY_STOREFRONT_TOKEN;
{
  const origFetch4 = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error('blocked in test'); };
  const origError = console.error;
  console.error = () => {};
  const resSf = await fn(post(body()));
  globalThis.fetch = origFetch4;
  console.error = origError;
  const okSf = resSf.status !== 503;
  if (!okSf) fail++;
  console.log(`${okSf ? '  ok  ' : ' FAIL '} ${resSf.status}  (not 503)  no storefront token still allows signup`);
}
process.env.SHOPIFY_STOREFRONT_TOKEN = 'sfat_test';

/* a valid application must get past validation and actually try Shopify */
process.env.SHOPIFY_ADMIN_TOKEN = 'shpat_test';
const origFetch = globalThis.fetch;
let reached = null;
globalThis.fetch = async (url) => { reached = String(url); throw new Error('blocked in test'); };
const r2 = await fn(post(body()));
globalThis.fetch = origFetch;
const ok2 = reached && reached.includes('/admin/api/') && r2.status === 502;
if (!ok2) fail++;
console.log(`${ok2 ? '  ok  ' : ' FAIL '} valid application reaches the Shopify Admin API (${reached ? 'called ' + reached.split('/admin')[0] + '/admin…' : 'never called'})`);

const leak = (await r2.json()).error;
const ok3 = !/blocked in test|shpat_|Error/.test(leak);
if (!ok3) fail++;
console.log(`${ok3 ? '  ok  ' : ' FAIL '} upstream failures are not leaked to the client — "${leak}"`);

console.log(fail ? `\n${fail} FAILED` : '\nall passed');
process.exit(fail ? 1 : 0);
