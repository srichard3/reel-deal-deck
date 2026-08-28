/**
 * scripts/instagram.mjs — refresh data/instagram.json and static/instagram/.
 *
 * WHY THIS EXISTS AT ALL
 * ----------------------
 * There is no honest way to put a live Instagram feed on this site.
 *
 *   - Third-party widgets (Elfsight, SnapWidget, Curator) mean a CDN script and
 *     a tracker on every page. This site has neither, on purpose.
 *   - Instagram's own oEmbed and Graph endpoints need an access token; there is
 *     no anonymous feed API.
 *   - Scraping server-side does not work. Instagram serves og: tags to
 *     recognised crawlers and to real browser sessions, and returns a bare app
 *     shell to a plain fetch — verified, it comes back with no og:title at all.
 *   - Its CDN URLs are signed and expire within days, so hotlinking a thumbnail
 *     produces a broken image by the end of the week.
 *
 * So the feed is a COMMITTED SNAPSHOT: post metadata in data/instagram.json,
 * thumbnails downloaded into static/instagram/ and served from our own origin.
 * Zero external requests, zero third-party tracking, and it cannot break when
 * someone else's script changes. The cost is that it is only as fresh as the
 * last run of this script.
 *
 * USAGE
 * -----
 *   IG_TOKEN=<access-token> node scripts/instagram.mjs
 *
 * Get a token from a Meta app with instagram_graph_user_profile and
 * instagram_graph_user_media (Instagram Basic Display, or the Instagram Login
 * flow on the Graph API). A long-lived token lasts 60 days and is refreshable,
 * which makes this a sensible thing to run from a scheduled CI job later.
 *
 * Optional:
 *   IG_USER_ID   defaults to "me"
 *   IG_LIMIT     how many posts to keep (default 12)
 *
 * Without a token this script explains itself and changes nothing.
 *
 * NOTE ON CAPTIONS: captions are stored but deliberately not rendered. See the
 * captionNote field in data/instagram.json for the reason.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.join(ROOT, 'data', 'instagram.json');
const IMGDIR = path.join(ROOT, 'static', 'instagram');

const TOKEN = process.env.IG_TOKEN;
const USER = process.env.IG_USER_ID || 'me';
const LIMIT = Number(process.env.IG_LIMIT || 12);

if (!TOKEN) {
  console.log(`
  No IG_TOKEN set, so nothing was changed.

  data/instagram.json is a committed snapshot, and the site renders whatever is
  in it. To refresh it:

    1. Create a Meta app and connect the @reeldealdeck Instagram account.
    2. Generate a long-lived user access token with media read permission.
    3. IG_TOKEN=<token> node scripts/instagram.mjs
    4. npm run build && npm run check, then commit data/instagram.json and
       whatever landed in static/instagram/.

  To add or remove a post by hand instead, edit data/instagram.json directly and
  drop the matching image into static/instagram/. The strip renders straight
  from that file and needs at least four posts to appear at all.
`);
  process.exit(0);
}

/* ------------------------------------------------------------------ fetch -- */

const FIELDS = 'id,permalink,media_type,media_url,thumbnail_url,timestamp,caption';
const url = `https://graph.instagram.com/${encodeURIComponent(USER)}/media` +
  `?fields=${FIELDS}&limit=${LIMIT}&access_token=${encodeURIComponent(TOKEN)}`;

const res = await fetch(url);
if (!res.ok) {
  console.error(`Instagram API returned ${res.status}: ${(await res.text()).slice(0, 300)}`);
  process.exit(1);
}
const { data = [] } = await res.json();
if (!data.length) {
  console.error('The API returned no media. Nothing written.');
  process.exit(1);
}

/* Keep the hand-maintained tags across a refresh — they drive which strip a
   post appears in, and the API knows nothing about them. */
const previous = existsSync(DATA) ? JSON.parse(await readFile(DATA, 'utf8')) : { posts: [] };
const tagsById = new Map((previous.posts || []).map((p) => [p.id, p.tags || []]));

await mkdir(IMGDIR, { recursive: true });

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];

const posts = [];
for (const m of data) {
  /* A video's own media_url is the MP4; thumbnail_url is the still we want. */
  const src = m.media_type === 'VIDEO' ? (m.thumbnail_url || m.media_url) : m.media_url;
  if (!src) { console.warn(`  skipped ${m.id}: no image URL`); continue; }

  const img = await fetch(src);
  if (!img.ok) { console.warn(`  skipped ${m.id}: image ${img.status}`); continue; }
  const buf = Buffer.from(await img.arrayBuffer());
  const file = `${m.id}.jpg`;
  await writeFile(path.join(IMGDIR, file), buf);

  const d = new Date(m.timestamp);
  posts.push({
    id: m.id,
    url: m.permalink,
    date: d.toISOString().slice(0, 10),
    dateLabel: `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`,
    image: `/instagram/${file}`,
    width: 360,
    height: 640,
    tags: tagsById.get(m.id) || [],
    caption: String(m.caption || '').split('\n')[0].trim(),
  });
  console.log(`  ${m.id}  ${(buf.length / 1024).toFixed(0)} kB`);
}

const out = { ...previous, capturedAt: new Date().toISOString().slice(0, 10), posts };
await writeFile(DATA, JSON.stringify(out, null, 2) + '\n');

console.log(`
  Wrote ${posts.length} posts to data/instagram.json.

  Images are saved as .jpg because this repo has no image encoder and adding a
  dependency for one is not worth it. The committed set was converted to .webp
  by hand (about 25% smaller); if you want to do that again, convert the files
  and change the "image" extensions in data/instagram.json to match. The site
  renders whatever path the JSON gives, so either works.

  Check any new post for tags — an untagged post only shows in the default
  strip, not the ones filtered to "deck", "makers" or "conservation".
`);
