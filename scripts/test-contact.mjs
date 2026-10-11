/**
 * scripts/test-contact.mjs — the guard rails on /api/contact.
 *
 * The thing worth testing here is not validation, it is that this cannot be
 * turned into an open relay. The recipient must always be the configured
 * inbox and never anything a submitter can influence; otherwise a public
 * endpoint that sends mail on demand is a gift to a spammer.
 *
 * Zero dependencies. Run with: npm run test:contact
 */

process.env.SUPPORT_EMAIL = 'owner@example.com';
process.env.RESEND_API_KEY = 'test-key';
process.env.RESEND_FROM = 'Test <hello@example.com>';

const mod = await import('../netlify/functions/contact.mjs');
const fn = mod.default;

const good = { name: 'Sam Rivers', email: 'sam@example.com', topic: 'general', message: 'Hello there, this is long enough.' };
function body(fields = {}) {
  const fd = new FormData();
  for (const [k, v] of Object.entries({ ...good, ...fields })) if (v !== null) fd.append(k, v);
  return fd;
}
const post = (b) => new Request('http://x/api/contact', { method: 'POST', body: b });

let fail = 0;
let sentPayloads = [];
const okRes = () => new Response('{"id":"1"}', { status: 200 });
globalThis.fetch = async (url, init) => {
  if (String(url).includes('api.resend.com')) { sentPayloads.push(JSON.parse(String(init.body))); return okRes(); }
  throw new Error('unexpected call to ' + url);
};

const cases = [
  ['GET is rejected', () => fn(new Request('http://x/api/contact')), 405],
  ['no message', () => fn(post(body({ message: null }))), 400],
  ['no name', () => fn(post(body({ name: null }))), 400],
  ['no email on a general message', () => fn(post(body({ email: null }))), 400],
  ['a malformed email', () => fn(post(body({ email: 'nope' }))), 400],
  ['a one-word message', () => fn(post(body({ message: 'hi' }))), 400],
  ['a valid message', () => fn(post(body())), 200],
  ['a suggestion with no email', () => fn(post(body({ topic: 'suggestion', email: null }))), 200],
];

for (const [name, run, want] of cases) {
  const res = await run();
  const got = res.status;
  const j = await res.clone().json().catch(() => ({}));
  const ok = got === want;
  if (!ok) fail++;
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${String(got).padEnd(4)} (want ${want})  ${name}${j.error ? '  — "' + j.error + '"' : ''}`);
}

/* THE RECIPIENT IS NOT NEGOTIABLE. Every field a submitter controls is tried
   as a way to redirect the mail; the `to` must still be the configured inbox
   on every single send. This is the difference between a contact form and a
   spam relay. */
{
  sentPayloads = [];
  for (const attack of [
    { email: 'victim@elsewhere.test' },
    { to: 'victim@elsewhere.test' },
    { recipient: 'victim@elsewhere.test' },
    { name: 'victim@elsewhere.test' },
    { message: 'Please send this to victim@elsewhere.test instead, long enough.' },
  ]) await fn(post(body(attack)));

  const everyToIsOwner = sentPayloads.length > 0
    && sentPayloads.every((p) => Array.isArray(p.to) && p.to.length === 1 && p.to[0] === 'owner@example.com');
  if (!everyToIsOwner) fail++;
  console.log(`${everyToIsOwner ? '  ok  ' : ' FAIL '} the recipient is always the configured inbox (${sentPayloads.length} sends checked)`);
}

/* The sender's address belongs in reply_to so a reply reaches them — and must
   be absent, not empty, when a suggestion came in without one. */
{
  sentPayloads = [];
  await fn(post(body()));
  await fn(post(body({ topic: 'suggestion', email: null })));
  const [withEmail, without] = sentPayloads;
  const good2 = withEmail.reply_to === 'sam@example.com' && !('reply_to' in without);
  if (!good2) fail++;
  console.log(`${good2 ? '  ok  ' : ' FAIL '} reply_to carries the sender, and is omitted when there is none`);
}

/* A filled honeypot answers 200 so the bot learns nothing, and sends nothing. */
{
  sentPayloads = [];
  const r = await fn(post(body({ company_website_url: 'http://spam.test' })));
  const trapped = r.status === 200 && sentPayloads.length === 0;
  if (!trapped) fail++;
  console.log(`${trapped ? '  ok  ' : ' FAIL '} a filled honeypot answers 200 and sends nothing`);
}

/* Unconfigured says so rather than pretending to have sent. */
{
  const key = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;
  const origError = console.error;
  console.error = () => {};
  const r = await fn(post(body()));
  console.error = origError;
  process.env.RESEND_API_KEY = key;
  const ok = r.status === 503;
  if (!ok) fail++;
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${r.status}  (want 503)  unconfigured says the form is off`);
}

/* The API key must not reach a response or a log line. */
{
  const seen = [];
  const origError = console.error;
  console.error = (...a) => seen.push(a.map(String).join(' '));
  globalThis.fetch = async () => new Response('upstream boom', { status: 500 });
  const r = await fn(post(body()));
  const text = await r.text();
  console.error = origError;
  const leaked = text.includes('test-key') || seen.some((l) => l.includes('test-key'));
  if (leaked) fail++;
  console.log(`${leaked ? ' FAIL ' : '  ok  '} the Resend key reaches neither a log line nor a response`);
}

console.log(fail ? `\n${fail} FAILED` : '\nall passed');
process.exit(fail ? 1 : 0);
