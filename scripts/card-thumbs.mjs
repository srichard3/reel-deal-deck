/**
 * scripts/card-thumbs.mjs — the -240 card variants, for the homepage fan.
 *
 * The fan on the homepage shows all 54 printed faces at once. At the -400 size
 * that is 1.6MB of webp for one section, which is too much to ask of a phone
 * for a decorative-but-delightful block.
 *
 * So each card also gets a 240px variant, and the fan declares both in a
 * srcset with sizes="124px". A 1x screen then takes the 240 (~12kB) and a 2x
 * screen takes the 400, including when a hovered card scales up to ~186 CSS px
 * — 186 x 1 still fits inside 240, and 186 x 2 does not, which is exactly the
 * split we want.
 *
 * SOURCE IS static/cards/<slug>-400.webp, which is ALREADY WATERMARKED.
 * Downscaling a marked file to a new filename does not stack a second mark the
 * way re-running scripts/watermark.mjs over its own output would — the mark
 * simply scales with the card, which is the same thing the -400 does to the
 * -800. This script is therefore safe to re-run, unlike watermark.mjs.
 *
 * Requires Python 3 with Pillow.
 */

import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const PY = `
import glob, os, sys
from PIL import Image

OUT_W = 240
src_dir = os.path.join(sys.argv[1], 'static', 'cards')
made = skipped = 0

for src in sorted(glob.glob(os.path.join(src_dir, '*-400.webp'))):
    dst = src.replace('-400.webp', '-240.webp')
    if os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src):
        skipped += 1
        continue
    im = Image.open(src).convert('RGBA')
    w, h = im.size
    out = im.resize((OUT_W, round(h * OUT_W / w)), getattr(Image, "Resampling", Image).LANCZOS)
    out.save(dst, 'WEBP', quality=82, method=6)
    made += 1

print(f'{made} written, {skipped} already current')
`;

const out = execFileSync('python3', ['-c', PY, ROOT], { encoding: 'utf8' });
process.stdout.write(out);
