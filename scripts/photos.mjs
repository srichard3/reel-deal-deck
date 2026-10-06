/**
 * scripts/photos.mjs — the founders' photographs and the Trout Unlimited mark,
 * from the originals into the web assets the site actually serves.
 *
 * Source: logos-and-photos-new/  (gitignored, like "new assets/" — originals
 *         are large and the shipped files are generated from them)
 * Output: static/photos/*.webp, static/brand/trout-unlimited-*.webp
 *
 * TWO THINGS THIS DOES THAT MATTER
 * --------------------------------
 * 1. STRIPS METADATA. These are phone photographs, and phone photographs carry
 *    GPS coordinates. Ken and Audrey run this from home; publishing the EXIF
 *    would publish roughly where they live, to anyone who downloads an image.
 *    Pillow writes no metadata unless asked, and the check at the end proves
 *    the output carries none.
 *
 * 2. APPLIES ORIENTATION FIRST. Two of these are stored landscape with an EXIF
 *    rotation tag — ken-with-fish reports 4032x3024 and displays portrait. Strip
 *    the tag without baking in the rotation and the photo ships on its side.
 *    exif_transpose() rotates the pixels, and then the tag is not needed.
 *
 * HEIC is decoded by `sips`, which is built into macOS; Pillow has no HEIF
 * support here. Everything after that is Pillow.
 *
 * Requires: macOS (sips) and Python 3 with Pillow.
 * Usage: node scripts/photos.mjs
 */

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'logos-and-photos-new');
const PHOTOS = path.join(ROOT, 'static', 'photos');
const BRAND = path.join(ROOT, 'static', 'brand');

if (!existsSync(SRC)) {
  console.error(`\n  Source folder not found:\n    ${SRC}\n\n  It is gitignored (originals). Nothing written.\n`);
  process.exit(1);
}
mkdirSync(PHOTOS, { recursive: true });

/* Quality 76 after a sweep on the heaviest frame (a brick wall, which is the
   worst case here): 82 cost 420kB for PSNR 36.0, 76 costs 339kB for 33.8, and
   62 only reached 278kB — the detail is real, not encoder waste. 76 is where
   the curve flattens.

   Widths are what the layout really asks for. The prose column is 760px, so
   1400 covers it at 2x and 900/600 cover the narrower cases; portraits are
   never shown full-width so they stop at 900. */
const JOBS = [
  { in: 'ken-and-audrey-holding-deck.heic', out: 'ken-and-audrey-deck',  dir: PHOTOS, widths: [600, 900, 1400] },
  { in: 'ken-and-audrey-eagle-id.heic',     out: 'ken-and-audrey-eagle', dir: PHOTOS, widths: [600, 900] },
  { in: 'ken-with-fish.jpeg',               out: 'ken-with-trout',       dir: PHOTOS, widths: [600, 900] },
  { in: 'reel-in-photo-ken.jpeg',           out: 'ken-on-the-river',     dir: PHOTOS, widths: [900, 1400] },
  /* The white mark, because this site has one theme and it is dark. */
  /* The mark is small and has hard edges, so it gets a higher quality than the
     photographs; it costs ~20kB at the top size either way. */
  { in: 'trout-unlimited-logo-no-bg-white.png', out: 'trout-unlimited', dir: BRAND, widths: [160, 320], alpha: true, quality: 88 },
];

const tmp = mkdtempSync(path.join(tmpdir(), 'photos-'));

/* HEIC first: sips decodes it and bakes the orientation in on the way out. */
for (const job of JOBS) {
  if (!job.in.toLowerCase().endsWith('.heic')) continue;
  const out = path.join(tmp, job.out + '.png');
  const r = spawnSync('sips', ['-s', 'format', 'png', path.join(SRC, job.in), '--out', out], { stdio: 'pipe' });
  if (r.status !== 0) { console.error(`sips failed on ${job.in}`); process.exit(1); }
  job.decoded = out;
}

const py = `
import json, sys, io
from PIL import Image, ImageOps

jobs = json.loads(sys.argv[1])
for job in jobs:
    src = job.get('decoded') or job['src']
    im = Image.open(src)
    # Rotate the PIXELS to match the EXIF tag, so the tag can be thrown away.
    im = ImageOps.exif_transpose(im)
    im = im.convert('RGBA' if job.get('alpha') else 'RGB')
    w0, h0 = im.size
    for w in job['widths']:
        if w > w0:
            continue
        h = round(h0 * w / w0)
        out = im.resize((w, h), Image.Resampling.LANCZOS)
        p = '%s/%s-%d.webp' % (job['dir'], job['out'], w)
        # No exif=, no icc_profile=, no xmp= : nothing but pixels goes out.
        out.save(p, 'WEBP', quality=job.get('quality', 76), method=6)
        print('  %-34s %4dx%-4d' % ('%s-%d.webp' % (job['out'], w), w, h))

# Prove it: re-open everything written and assert there is no metadata left.
import glob, os
bad = []
for d in {j['dir'] for j in jobs}:
    for p in glob.glob(d + '/*.webp'):
        with Image.open(p) as c:
            if c.getexif() or c.info.get('exif') or c.info.get('xmp'):
                bad.append(os.path.basename(p))
print('\\n  metadata on output: %s' % (', '.join(bad) if bad else 'none'))
if bad:
    sys.exit(1)
`;

const payload = JOBS.map((j) => ({
  src: path.join(SRC, j.in),
  decoded: j.decoded,
  out: j.out,
  dir: j.dir,
  widths: j.widths,
  alpha: !!j.alpha,
  quality: j.quality,
}));

console.log('\n  Photographs and marks\n');
const r = spawnSync('python3', ['-c', py, JSON.stringify(payload)], { stdio: 'inherit' });
process.exit(r.status ?? 1);
