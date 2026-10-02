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
  business: 'Henry’s Fork Anglers', contact: 'Sam Rivers', email: 'sam@example.com',
  phone: '208-555-0101', address1: '12 Main St', city: 'Eagle', region: 'ID',
  postal: '83616', country: 'US',
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
  ['missing address', () => fn(post(body({ address1: null }))), 400],
  ['malformed email', () => fn(post(body({ email: 'not-an-email' }))), 400],
  ['no permit attached', () => fn(post(body({}, null))), 400],
  ['permit over 10MB', () => fn(post(body({}, pdf(11 * 1024 * 1024)))), 400],
  ['permit of a disallowed type', () => fn(post(body({}, pdf(1024, 'application/zip')))), 400],
];

let fail = 0;
process.env.SHOPIFY_STORE_DOMAIN = 'test.myshopify.com';
process.env.SHOPIFY_ADMIN_TOKEN = 'shpat_test';
for (const [name, run, want] of cases) {
  const res = await run();
  const got = res.status;
  const j = await res.clone().json().catch(() => ({}));
  const ok = got === want;
  if (!ok) fail++;
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${String(got).padEnd(4)} (want ${want})  ${name}${j.error ? '  — "' + j.error + '"' : ''}`);
}

/* unset credentials must say so rather than pretending the application failed */
delete process.env.SHOPIFY_ADMIN_TOKEN;
const res = await fn(post(body()));
const ok = res.status === 503;
if (!ok) fail++;
console.log(`${ok ? '  ok  ' : ' FAIL '} ${res.status}  (want 503)  unconfigured says signup is off`);

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
