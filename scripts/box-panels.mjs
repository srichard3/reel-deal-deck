/**
 * scripts/box-panels.mjs — cut the six tuck-box panels out of the printer's
 * dieline, for the interactive 3D box on the homepage.
 *
 * Source: "new assets/Fly_Deck_Box T-020_v8.pdf" (gitignored, from USPCC).
 * Output: static/brand/box3d-{front,back,left,right,top}.webp
 *
 * WHY THESE NUMBERS
 * -----------------
 * The dieline prints its fold and cut lines in cyan, so the panel boundaries
 * are measurable rather than guessed. Detecting the cyan dashes at 300dpi puts
 * the vertical folds at x = 449, 646, 1415, 1621, 2390 and the horizontal ones
 * at y = 581, 778, 1846. That gives:
 *
 *     front / back   769 x 1068
 *     spine (depth)  ~200 wide
 *     top flap       769 x 197   (= the depth, which is the check that the
 *                                 reading is right: the flap that folds over
 *                                 the top is exactly as deep as the box)
 *
 * so W : H : D = 1 : 1.389 : 0.26. A real poker tuck is 2.5 x 3.5 x 0.65in,
 * which is 1 : 1.4 : 0.26. The CSS in components.css uses the same ratios.
 *
 * Two fixes are applied on the way out:
 *   - the cyan score lines cross the printed artwork, so they are painted out
 *     by filling each cyan pixel from the nearest clean pixel above or below;
 *   - the top flap is printed upside down on the dieline, because it folds
 *     over, so it is rotated 180 degrees.
 *
 * Both spines are emitted at the same width even though the measured crops
 * differ by 9px. They are the same panel on the real box, and a box whose two
 * sides disagree does not close.
 *
 * Requires ghostscript (`gs`) and Python 3 with Pillow.
 * Usage: node scripts/box-panels.mjs
 */

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PDF = path.join(ROOT, 'new assets', 'Fly_Deck_Box T-020_v8.pdf');
const OUT = path.join(ROOT, 'static', 'brand');

if (!existsSync(PDF)) {
  console.error(`\n  Dieline not found:\n    ${PDF}\n\n  It is gitignored (printer source). Nothing written.\n`);
  process.exit(1);
}

const tmp = mkdtempSync(path.join(tmpdir(), 'box-'));
const sheet = path.join(tmp, 'sheet.png');

const gs = spawnSync('gs', ['-q', '-dNOPAUSE', '-dBATCH', '-sDEVICE=png16m', '-r300',
  `-sOutputFile=${sheet}`, PDF], { stdio: 'inherit' });
if (gs.status !== 0) { console.error('ghostscript failed'); process.exit(1); }

const py = `
import sys
import numpy as np
from PIL import Image

sheet, out = sys.argv[1], sys.argv[2]
im = Image.open(sheet).convert('RGB')

# Fold/cut lines measured from the cyan die layer at 300dpi.
XF = [449, 646, 1415, 1621, 2390]
YF = [581, 778, 1846]
I  = 4                                  # inset past the dash itself

PANELS = {
  'front': (XF[1], YF[1], XF[2], YF[2]),
  'back':  (XF[3], YF[1], XF[4], YF[2]),
  'left':  (XF[0], YF[1], XF[1], YF[2]),
  'right': (XF[2], YF[1], XF[3], YF[2]),
  'top':   (XF[1], YF[0], XF[2], YF[1]),
}

# Output sizes hold the real ratios exactly: D/W = 200/769 = 0.26.
W, H = 600, 836
D = round(W * 200 / 769)
SIZES = {'front': (W, H), 'back': (W, H), 'left': (D, H), 'right': (D, H), 'top': (W, D)}

# Ghostscript renders the PANTONE 364 C separation at #4A7637 no matter which
# colour flags it is given — blue 55 where the ink is 43, which reads grey
# beside the site's green. The panels are the ink over white, so every pixel of
# the printed field lies on the line between them: recover how much ink is on
# each pixel, then lay the same amount of the RIGHT green down instead.
#
# Only pixels that actually sit on that line are touched, within a tight
# tolerance, which leaves the three full-colour card faces on the box front
# alone — a brown hackle is nowhere near the white-to-green line.
GS_INK    = (0x4A, 0x76, 0x37)   # what ghostscript gives us
TRUE_INK  = (0x4A, 0x76, 0x2B)   # --c-green, and PANTONE 364 C to within 2/255
TOLERANCE = 8

def fix_ink(arr):
    a = arr.astype(float)
    # coverage from the channel with the most range between white and ink
    t = (255.0 - a[:, :, 2]) / (255.0 - GS_INK[2])
    t = np.clip(t, 0.0, 1.0)
    pred = np.stack([255.0 + t * (GS_INK[i] - 255.0) for i in range(3)], axis=2)
    on_line = np.max(np.abs(a - pred), axis=2) <= TOLERANCE
    fixed = np.stack([255.0 + t * (TRUE_INK[i] - 255.0) for i in range(3)], axis=2)
    out = np.where(on_line[:, :, None], fixed, a)
    return np.clip(out, 0, 255).astype('uint8'), int(on_line.sum()), on_line.size


def strip_cyan(arr):
    """Paint out the cyan score lines by pulling each bad pixel down from the
    nearest clean one above it, then up from below for anything still unfilled.
    The lines are thin and horizontal, so a vertical fill is invisible."""
    a = arr.astype(int)
    bad = (a[:,:,2] > 140) & (a[:,:,2] - a[:,:,0] > 60) & (a[:,:,1] - a[:,:,0] > 30)
    if not bad.any():
        return arr
    out = arr.copy()
    for _ in range(2):
        for step in (1, -1):
            rows = range(1, out.shape[0]) if step == 1 else range(out.shape[0] - 2, -1, -1)
            for y in rows:
                m = bad[y]
                if m.any():
                    out[y][m] = out[y - step][m]
                    bad[y][m] = bad[y - step][m]
    return out

for name, (x0, y0, x1, y1) in PANELS.items():
    c = im.crop((x0 + I, y0 + I, x1 - I, y1 - I))
    arr, n_fixed, n_total = fix_ink(strip_cyan(np.asarray(c)))
    c = Image.fromarray(arr)
    print('    %-6s ink pixels recoloured: %5.1f%%' % (name, n_fixed / n_total * 100))
    if name == 'top':
        c = c.rotate(180)               # printed inverted; it folds over
    c = c.resize(SIZES[name], getattr(Image, 'Resampling', Image).LANCZOS)
    p = '%s/box3d-%s.webp' % (out, name)
    # Lossy, deliberately. webp's colour transform lands the flat ink on
    # #4A772A rather than #4A762B at every quality up to 100 — only lossless
    # holds it exactly, and that doubles these files (the front panel, which is
    # the LCP image, goes 139kB -> 326kB). The residual error is deltaE 1.06,
    # about the just-noticeable threshold for two patches touching each other —
    # and the box and the button never touch. The two errors that were actually
    # visible were deltaE 6.1 (ghostscript rendering the spot wrong) and 27.6
    # (the dark-mode button lightening); both are fixed.
    c.save(p, 'WEBP', quality=88, method=6)
    print('  box3d-%-6s %4dx%-4d' % (name, c.size[0], c.size[1]))

print('  ratios W:H:D = 1 : %.3f : %.3f' % (H / W, D / W))
`;

const r = spawnSync('python3', ['-c', py, sheet, OUT], { stdio: 'inherit' });
process.exit(r.status ?? 1);
