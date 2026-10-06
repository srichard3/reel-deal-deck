/**
 * scripts/card-thumbs.mjs — the small card variants, for the homepage fan.
 *
 * The fan shows all 54 printed faces at once, which makes it the whole image
 * budget of the homepage. The sizes here are not round numbers, they are what
 * the fan actually renders:
 *
 *   card width = clamp(76px, 13vw, 150px), and on a coarse pointer also capped
 *   at (100vw - 2rem) / 7.44 so the whole deck fits the screen.
 *
 *   phone  375px -> 46 css px -> 93 at 2x, 139 at 3x   -> 160w  (~7kB)
 *   laptop 1024  -> 133       -> 267 at 2x             -> 300w  (~19kB)
 *   large  1440+ -> 150 (cap) -> 300 at 2x             -> 300w
 *
 * The 240w this script used to make was the wrong size on both counts: phones
 * were buying it to paint 46 css px, and desktops skipped it for the 400w.
 * Measured, 160 + 300 cut the fan from 1.57MB to 1.03MB on a laptop and from
 * 756kB to 378kB on a phone.
 *
 * SOURCE IS static/cards/<slug>-800.webp, which is ALREADY WATERMARKED. Going
 * from the 800 rather than the 400 means a 300 is not a resize of a resize.
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

WIDTHS = (160, 300)
# 82 was inherited from the full-size card pipeline, where it is right. These
# are painted at 46-150 css px, so the browser downscales them again and hides
# what the encoder gives up. Checked by eye at the real render size on the four
# busiest cards AND on the engraved back at 2x zoom — q82 through q60 were
# indistinguishable, including in the hackle fibres and the engraving's line
# work. 70 takes most of the available saving and still leaves a wide margin.
QUALITY = 70
src_dir = os.path.join(sys.argv[1], 'static', 'cards')
made = skipped = 0

for src in sorted(glob.glob(os.path.join(src_dir, '*-800.webp'))):
    im = None
    for OUT_W in WIDTHS:
        dst = src.replace('-800.webp', f'-{OUT_W}.webp')
        if os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src):
            skipped += 1
            continue
        if im is None:
            im = Image.open(src).convert('RGBA')
        w, h = im.size
        out = im.resize((OUT_W, round(h * OUT_W / w)), getattr(Image, "Resampling", Image).LANCZOS)
        out.save(dst, 'WEBP', quality=QUALITY, method=6)
        made += 1

print(f'{made} written, {skipped} already current')
`;

const out = execFileSync('python3', ['-c', PY, ROOT], { encoding: 'utf8' });
process.stdout.write(out);
