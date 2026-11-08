/* Checks every outbound source URL cited in the blog.
 *
 * NOT part of `npm run check`, deliberately. The quality gate runs on every
 * build and in CI, and it must not depend on the internet: a build that fails
 * because somebody else's server is having a bad afternoon is a build you
 * learn to ignore. Run this by hand, every month or two.
 *
 *   npm run check:links
 *
 * IT REPORTS, IT DOES NOT JUDGE. A dead link and a server refusing robots look
 * nearly identical from here, and three of the URLs in this repo have been
 * each at different times. 403 and 503 in particular are usually bot-blocking
 * or maintenance, not death — takemefishing.org serves 403 to everything
 * automated, idfg.idaho.gov served a maintenance page for hours. Only 404 and
 * 410 are called DEAD. Everything else is CHECK, meaning open it in a browser
 * before you touch the citation.
 *
 * That distinction is the whole point of the script. An earlier sweep with
 * plain curl called seven URLs dead; a browser found four of them alive, and
 * acting on the curl result would have removed working citations.
 */
import { readdir, readFile } from 'node:fs/promises';

const DIR = 'src/content/blog';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
         + '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const TIMEOUT = 20000;

const files = (await readdir(DIR)).filter((f) => f.endsWith('.mjs'));
const sources = new Map();          /* url -> [slug, …] */

for (const f of files) {
  const text = await readFile(`${DIR}/${f}`, 'utf8');
  const block = /sources:\s*\[([\s\S]*?)\n\s*\],/.exec(text);
  if (!block) continue;
  for (const m of block[1].matchAll(/url:\s*'(https?:\/\/[^']+)'/g)) {
    if (!sources.has(m[1])) sources.set(m[1], []);
    sources.get(m[1]).push(f.replace(/\.mjs$/, ''));
  }
}

async function probe(url) {
  /* GET, not HEAD: plenty of sites answer HEAD with 405 or 404 while serving
     the page perfectly well to a reader. */
  const ctl = AbortSignal.timeout(TIMEOUT);
  try {
    const res = await fetch(url, { redirect: 'follow', signal: ctl, headers: { 'user-agent': UA } });
    return { status: res.status, final: res.url };
  } catch (err) {
    return { status: 0, error: err.name === 'TimeoutError' ? 'timed out' : err.message };
  }
}

const results = await Promise.all(
  [...sources.keys()].map(async (url) => ({ url, ...(await probe(url)) })),
);

const DEAD = (r) => r.status === 404 || r.status === 410;
const OK = (r) => r.status >= 200 && r.status < 300;

results.sort((a, b) => Number(OK(a)) - Number(OK(b)) || a.url.localeCompare(b.url));

const line = '─'.repeat(78);
console.log(`\n${line}\n  SOURCE LINKS  ${results.length} urls · ${files.length} articles\n${line}\n`);

let dead = 0;
let check = 0;
for (const r of results) {
  const where = sources.get(r.url);
  const tag = OK(r) ? '  ok  ' : DEAD(r) ? ' DEAD ' : ' CHECK';
  if (DEAD(r)) dead++;
  else if (!OK(r)) check++;
  const status = r.status || r.error;
  console.log(`${tag} ${String(status).padEnd(9)} ${r.url}`);
  if (!OK(r)) console.log(`         cited by ${where.length}: ${where.join(', ')}`);
  if (OK(r) && r.final && r.final !== r.url) console.log(`         → redirects to ${r.final}`);
}

console.log(`\n${line}`);
console.log(`  ${dead} dead   ${check} to check by hand   ${results.length - dead - check} ok`);
if (check) console.log('  CHECK means the server refused us, not that the page is gone. Open it.');
console.log(`${line}\n`);

/* Exit 0 even with dead links. This is a report you read, not a gate: making
   it fail would tempt somebody to wire it into CI, which is the one thing the
   header asks you not to do. */
