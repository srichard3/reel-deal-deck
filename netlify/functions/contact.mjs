/**
 * POST /api/contact — the contact form on /contact/.
 *
 * This exists because publishing an address is publishing it to harvesters.
 * reeldealdeck@gmail.com was rendered into the footer of all 98 pages, which is
 * 232 copies of it on a public site; the spam started within days of launch.
 * The address is now configuration, read here from the environment, and never
 * rendered into a page.
 *
 * It is NOT a mail relay. The recipient is fixed — always SUPPORT_EMAIL, never
 * anything a submitter can influence — so the worst an abuser can do is send
 * mail to the one inbox that was already public. The sender's address goes in
 * reply_to, so replying in Gmail reaches them.
 *
 * ZERO DEPENDENCIES, like the rest of the repo.
 */

export const config = { path: '/api/contact' };

const MAX = { name: 120, email: 200, topic: 40, message: 4000 };
const TOPICS = ['general', 'wholesale', 'press', 'correction', 'suggestion', 'other'];

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

export default async (request) => {
  if (request.method !== 'POST') return json(405, { error: 'Use POST.' });

  const to = process.env.SUPPORT_EMAIL;
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!to || !key || !from) {
    console.error('contact: SUPPORT_EMAIL, RESEND_API_KEY or RESEND_FROM is not set');
    return json(503, { error: 'The contact form is not switched on yet. Please try again later.' });
  }

  let form;
  try { form = await request.formData(); } catch {
    return json(400, { error: 'That form could not be read. Please try again.' });
  }

  /* A field no human sees and every naive bot fills in. 200 so the bot learns
     nothing from the response. */
  if (String(form.get('company_website_url') || '').trim()) return json(200, { ok: true });

  const field = (k) => String(form.get(k) ?? '').trim().slice(0, MAX[k] || 200);
  const name = field('name');
  const email = field('email').toLowerCase();
  const topic = TOPICS.includes(field('topic')) ? field('topic') : 'general';
  const message = field('message');

  /* A fly suggestion is the one thing worth taking from someone who does not
     want to leave an address — it is a gift, not a request, and nobody is
     waiting on a reply. Everything else needs a way to answer it. */
  const needsEmail = topic !== 'suggestion';
  if (!name || !message || (needsEmail && !email)) {
    return json(400, {
      error: needsEmail
        ? 'Please fill in your name, your email and a message.'
        : 'Please fill in your name and the suggestion.',
      fields: [!name && 'name', needsEmail && !email && 'email', !message && 'message'].filter(Boolean),
    });
  }
  if (email && !/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(email)) {
    return json(400, { error: 'That email address does not look right.', fields: ['email'] });
  }
  if (message.length < 10) {
    return json(400, { error: 'Please say a little more so we can help.', fields: ['message'] });
  }

  const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const text = `${topic.toUpperCase()} — from ${name}${email ? ` <${email}>` : ' (no reply address given)'}\n\n${message}`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
      body: JSON.stringify({
        from,
        /* Fixed recipient. Never read from the submission — that is the
           difference between a contact form and an open relay. */
        to: [to],
        /* So hitting reply in Gmail answers the person who wrote in. Omitted
           when there is nobody to answer — a reply_to of "" bounces. */
        ...(email ? { reply_to: email } : {}),
        subject: `[${topic}] ${name}`,
        text,
        html: `<p><strong>${esc(topic)}</strong> — from ${esc(name)}${email ? ` &lt;${esc(email)}&gt;` : ' <em>(no reply address given)</em>'}</p>`
          + `<p style="white-space:pre-wrap">${esc(message)}</p>`,
      }),
    });
    if (!res.ok) throw new Error(`resend ${res.status}: ${(await res.text()).slice(0, 200)}`);
  } catch (err) {
    /* Body only — never the Authorization header, which carries the key. */
    console.error('contact: send failed —', err.message);
    return json(502, { error: 'That did not go through. Please try again in a moment.' });
  }

  return json(200, { ok: true });
};
