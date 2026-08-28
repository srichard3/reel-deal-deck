/**
 * scripts/watermark.mjs — burn a watermark into the card face images.
 *
 * WHY BAKED IN, NOT CSS
 * ---------------------
 * A CSS overlay is theatre. The file at /cards/adams-800.webp is still one
 * right-click away, and the overlay itself is one devtools node deletion away.
 * The only watermark worth having is in the pixels, so this rewrites the
 * rasters in static/cards/.
 *
 * MASTERS
 * -------
 * Reads from "new assets/cards-clean/" and writes to static/cards/. That
 * directory is gitignored, holds the un-watermarked originals, and is what
 * makes this script idempotent: re-running never stacks a second watermark,
 * and changing the design below is a one-line edit plus a re-run rather than
 * an unpickable mess.
 *
 * If the masters are missing, this refuses rather than watermarking already
 * watermarked files. 106ab0a is the last commit with clean cards, so:
 *
 *   mkdir -p "new assets/cards-clean"
 *   for f in $(git show --pretty= --name-only 106ab0a -- static/cards | xargs -n1 basename); do :; done
 *   git ls-tree --name-only 106ab0a static/cards | while read p; do \
 *     git show 106ab0a:"$p" > "new assets/cards-clean/$(basename "$p")"; done
 *
 * The -400 variants are downscaled from the watermarked -800, so the mark
 * scales with the card instead of being applied twice at two sizes.
 *
 * Requires Python 3 with Pillow, which is how the other raster work in this
 * repo is done. Node has no image encoder and adding one is not worth it.
 *
 * Usage:  node scripts/watermark.mjs [--check]
 *         --check reports what would change and writes nothing.
 */

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLEAN = path.join(ROOT, 'new assets', 'cards-clean');
const OUT = path.join(ROOT, 'static', 'cards');

if (!existsSync(CLEAN)) {
  console.error(`
  No clean masters at:
    ${CLEAN}

  Refusing to run: watermarking the files already in static/cards/ would stack
  a second mark on top of the first. See the header of this file for how to
  restore the masters from git history.
`);
  process.exit(1);
}

const py = `
import os, sys, glob
from PIL import Image, ImageDraw, ImageFont

CLEAN = sys.argv[1]
OUT   = sys.argv[2]
CHECK = len(sys.argv) > 3 and sys.argv[3] == '--check'

# --- the mark ---------------------------------------------------------------
# Already printed on the info card in the deck, so it is the right thing to put
# on a leaked image: it says who made it and where to find them.
TEXT    = 'REELDEALDECK.COM'
ANGLE   = 30           # degrees, rising left-to-right
SIZE_800 = 21          # px at the 572x800 master
GAP_X   = 250
GAP_Y   = 132

# Dark ink with a light halo, rather than the brand green. Green looked better
# on the card faces, which are mostly white — and then vanished completely into
# the card back, which is dense green engraving and the single most copyable
# image here. Dark-plus-halo reads on any background the deck contains.
INK       = (26, 32, 24)     # near-black, warm
INK_A     = 30               # /255
HALO      = (255, 255, 255)
HALO_A    = 34
HALO_W    = 1

FONTS = [
    '/System/Library/Fonts/Supplemental/Arial Bold.ttf',
    '/System/Library/Fonts/Supplemental/Arial.ttf',
    '/Library/Fonts/Arial Bold.ttf',
]

def font(px):
    for f in FONTS:
        if os.path.exists(f):
            return ImageFont.truetype(f, px)
    return ImageFont.load_default()

def watermark(im):
    w, h = im.size
    # Build the tiled text on a layer big enough that rotating it still covers
    # the card at every corner, then crop back to the card.
    diag = int((w ** 2 + h ** 2) ** 0.5) + 2 * GAP_X
    layer = Image.new('RGBA', (diag, diag), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    f = font(SIZE_800)

    row = 0
    y = 0
    while y < diag:
        # Offset every other row so the tiling does not read as a grid.
        x = -GAP_X + (GAP_X // 2 if row % 2 else 0)
        while x < diag:
            d.text((x, y), TEXT, font=f, fill=INK + (INK_A,),
                   stroke_width=HALO_W, stroke_fill=HALO + (HALO_A,))
            x += GAP_X
        y += GAP_Y
        row += 1

    layer = layer.rotate(ANGLE, resample=Image.BICUBIC)
    left = (diag - w) // 2
    top = (diag - h) // 2
    layer = layer.crop((left, top, left + w, top + h))

    base = im.convert('RGBA')
    return Image.alpha_composite(base, layer).convert('RGB')

masters = sorted(glob.glob(os.path.join(CLEAN, '*-800.webp')))
if not masters:
    print('No *-800.webp masters found. Nothing to do.'); sys.exit(1)

n = 0
for src in masters:
    name = os.path.basename(src)
    slug = name[:-len('-800.webp')]
    im = Image.open(src).convert('RGB')
    if CHECK:
        print('  would mark %-28s %sx%s' % (slug, im.size[0], im.size[1])); n += 1; continue

    marked = watermark(im)
    marked.save(os.path.join(OUT, name), 'WEBP', quality=82, method=6)

    # The 400 comes from the marked 800 so the mark scales with the card.
    small_src = os.path.join(CLEAN, slug + '-400.webp')
    if os.path.exists(small_src):
        sw, sh = Image.open(small_src).size
        marked.resize((sw, sh), getattr(Image, "Resampling", Image).LANCZOS).save(
            os.path.join(OUT, slug + '-400.webp'), 'WEBP', quality=82, method=6)
    n += 1

print('%s %d card faces' % ('Would mark' if CHECK else 'Marked', n))
`;

const args = [CLEAN, OUT];
if (process.argv.includes('--check')) args.push('--check');

const r = spawnSync('python3', ['-c', py, ...args], { stdio: 'inherit' });
process.exit(r.status ?? 1);
