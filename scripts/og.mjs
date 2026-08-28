#!/usr/bin/env node
/**
 * The Reel Deal Deck — Open Graph / icon asset generator.
 *
 *   node scripts/og.mjs
 *
 * Writes into static/ (which build.mjs copies verbatim to the dist root):
 *
 * ⚠ DO NOT RUN THIS CASUALLY. The PNGs committed under static/og/ are better
 * than what this script emits: they use the real logo and real card artwork,
 * while this generator falls back to a built-in bitmap font and a drawn R♦
 * mark. Running it replaced every OG image with the inferior version and had
 * to be reverted. Treat the committed files as the artwork and this script as
 * a last-resort fallback for a page that has none.
 *
 *   static/og/<page>.svg   hand-authored 1200x630 templates
 *   static/og/<page>.png   a real, valid, self-contained PNG fallback
 *   static/apple-touch-icon.png
 *   static/icon-192.png  static/icon-512.png
 *
 * WHY TWO FORMATS
 * ---------------
 * Facebook, LinkedIn, iMessage, Slack and X do not render SVG in link previews.
 * head.html points og:image at /og/<page>.png, so a PNG *must* exist at that
 * path or every share of the site shows a broken card. This project has zero
 * dependencies and no network, so there is no rasteriser available — instead we
 * encode PNGs by hand with node:zlib (a PNG is just zlib-deflated scanlines plus
 * four CRC32-checked chunks) and compose them from primitives: rectangles, a
 * diamond suit glyph, and an anti-aliased bitmap typeface defined below.
 *
 * The result is a genuine, correct, on-brand image — not a placeholder colour
 * block — but its lettering is geometric rather than the site's serif. When you
 * are ready to ship the nicer artwork, export the matching SVG to PNG once and
 * drop it over the generated file. See docs/DEPLOY.md → "Upgrading the OG images".
 *
 * Node built-ins only. No dependencies, ever.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(readFileSync(path.join(ROOT, 'data/site.json'), 'utf8'));

/* ------------------------------------------------------------- palette --- */
/* Mirrors src/styles/tokens.css. Kept as literals because a PNG encoder
   cannot read CSS custom properties; if tokens.css changes, change these. */
const C = {
  paper: [0xfb, 0xfa, 0xf7],
  paper2: [0xf2, 0xf0, 0xea],
  paper3: [0xe7, 0xe3, 0xda],
  ink: [0x16, 0x19, 0x1c],
  ink2: [0x4a, 0x51, 0x57],
  ink3: [0x7c, 0x85, 0x8c],
  red: [0xa3, 0x2b, 0x33],
  egg: [0xd9, 0x80, 0x32],
  river: [0x2b, 0x4a, 0x55],
  riffle: [0x5e, 0x7a, 0x6b],
};
const hex = ([r, g, b]) =>
  '#' + [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('');

/* ============================================================== PNG ===== */

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, 'latin1'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

/** Encode an RGB canvas as a valid 8-bit truecolour PNG. */
function encodePng(cv) {
  const { w, h, px } = cv;
  const stride = w * 3;
  const raw = Buffer.alloc((stride + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (stride + 1)] = 0; // filter: None — keeps this encoder trivially correct
    px.copy ? px.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride)
            : Buffer.from(px.buffer, y * stride, stride).copy(raw, y * (stride + 1) + 1);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // colour type 2 = truecolour RGB
  ihdr[10] = 0; // deflate
  ihdr[11] = 0; // adaptive filtering
  ihdr[12] = 0; // no interlace
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/* =========================================================== canvas ===== */

function canvas(w, h, bg) {
  const px = Buffer.alloc(w * 3 * h);
  const cv = { w, h, px };
  fillRect(cv, 0, 0, w, h, bg, 1);
  return cv;
}

function blend(cv, x, y, color, a) {
  if (a <= 0 || x < 0 || y < 0 || x >= cv.w || y >= cv.h) return;
  const i = (y * cv.w + x) * 3;
  const k = a > 1 ? 1 : a;
  cv.px[i] = cv.px[i] + (color[0] - cv.px[i]) * k;
  cv.px[i + 1] = cv.px[i + 1] + (color[1] - cv.px[i + 1]) * k;
  cv.px[i + 2] = cv.px[i + 2] + (color[2] - cv.px[i + 2]) * k;
}

function fillRect(cv, x, y, w, h, color, a = 1) {
  const x0 = Math.max(0, Math.round(x)), y0 = Math.max(0, Math.round(y));
  const x1 = Math.min(cv.w, Math.round(x + w)), y1 = Math.min(cv.h, Math.round(y + h));
  for (let yy = y0; yy < y1; yy++) for (let xx = x0; xx < x1; xx++) blend(cv, xx, yy, color, a);
}

/** Hairline rectangle outline. */
function strokeRect(cv, x, y, w, h, t, color, a = 1) {
  fillRect(cv, x, y, w, t, color, a);
  fillRect(cv, x, y + h - t, w, t, color, a);
  fillRect(cv, x, y, t, h, color, a);
  fillRect(cv, x + w - t, y, t, h, color, a);
}

/** Diamond suit glyph, 4x supersampled so the edges are clean. */
function diamond(cv, cx, cy, rx, ry, color, a = 1) {
  for (let y = Math.floor(cy - ry) - 1; y <= Math.ceil(cy + ry) + 1; y++) {
    for (let x = Math.floor(cx - rx) - 1; x <= Math.ceil(cx + rx) + 1; x++) {
      let hits = 0;
      for (let sy = 0; sy < 4; sy++) {
        for (let sx = 0; sx < 4; sx++) {
          const px = x + (sx + 0.5) / 4 - cx;
          const py = y + (sy + 0.5) / 4 - cy;
          if (Math.abs(px) / rx + Math.abs(py) / ry <= 1) hits++;
        }
      }
      if (hits) blend(cv, x, y, color, (hits / 16) * a);
    }
  }
}

/* ============================================================== type ==== */
/* A 5x7 uppercase typeface. Rendered at scale, then blurred and remapped
   through a smoothstep so the strokes come out anti-aliased and rounded
   instead of blocky. Not the site's serif — see the header note. */

const GLYPHS = {
  A: '.###.,#...#,#...#,#####,#...#,#...#,#...#',
  B: '####.,#...#,#...#,####.,#...#,#...#,####.',
  C: '.###.,#...#,#....,#....,#....,#...#,.###.',
  D: '####.,#...#,#...#,#...#,#...#,#...#,####.',
  E: '#####,#....,#....,####.,#....,#....,#####',
  F: '#####,#....,#....,####.,#....,#....,#....',
  G: '.###.,#...#,#....,#.###,#...#,#...#,.###.',
  H: '#...#,#...#,#...#,#####,#...#,#...#,#...#',
  I: '#####,..#..,..#..,..#..,..#..,..#..,#####',
  J: '..###,...#.,...#.,...#.,...#.,#..#.,.##..',
  K: '#..##,#.##.,###..,##...,###..,#.##.,#..##',
  L: '#....,#....,#....,#....,#....,#....,#####',
  M: '#...#,##.##,#.#.#,#.#.#,#...#,#...#,#...#',
  N: '#...#,##..#,##..#,#.#.#,#..##,#..##,#...#',
  O: '.###.,#...#,#...#,#...#,#...#,#...#,.###.',
  P: '####.,#...#,#...#,####.,#....,#....,#....',
  Q: '.###.,#...#,#...#,#...#,#.#.#,#..#.,.##.#',
  R: '####.,#...#,#...#,####.,#.##.,#..##,#...#',
  S: '.####,#....,#....,.###.,....#,....#,####.',
  T: '#####,..#..,..#..,..#..,..#..,..#..,..#..',
  U: '#...#,#...#,#...#,#...#,#...#,#...#,.###.',
  V: '#...#,#...#,#...#,#...#,#...#,.###.,..#..',
  W: '#...#,#...#,#...#,#.#.#,#.#.#,##.##,#...#',
  X: '#...#,#...#,.###.,..#..,.###.,#...#,#...#',
  Y: '#...#,#...#,.###.,..#..,..#..,..#..,..#..',
  Z: '#####,....#,...#.,..#..,.#...,#....,#####',
  0: '.###.,#...#,#..##,#.#.#,##..#,#...#,.###.',
  1: '..#..,.##..,..#..,..#..,..#..,..#..,.###.',
  2: '.###.,#...#,....#,...#.,..#..,.#...,#####',
  3: '####.,....#,...#.,..##.,....#,#...#,.###.',
  4: '...#.,..##.,.#.#.,#..#.,#####,...#.,...#.',
  5: '#####,#....,####.,....#,....#,#...#,.###.',
  6: '..##.,.#...,#....,####.,#...#,#...#,.###.',
  7: '#####,....#,...#.,..#..,.#...,.#...,.#...',
  8: '.###.,#...#,#...#,.###.,#...#,#...#,.###.',
  9: '.###.,#...#,#...#,.####,....#,...#.,.##..',
  '.': '.....,.....,.....,.....,.....,.##..,.##..',
  ',': '.....,.....,.....,.....,.##..,.##..,.#...',
  "'": '..#..,..#..,.....,.....,.....,.....,.....',
  '-': '.....,.....,.....,.####,.....,.....,.....',
  ':': '.....,.##..,.##..,.....,.##..,.##..,.....',
  '!': '..#..,..#..,..#..,..#..,..#..,.....,..#..',
  '+': '.....,..#..,..#..,#####,..#..,..#..,.....',
  ' ': '.....,.....,.....,.....,.....,.....,.....',
};

const GW = 5, GH = 7;

/** PNG-safe uppercasing: the typeface has no lowercase or ampersand. */
const normalise = (s) =>
  String(s).toUpperCase().replace(/&/g, ' AND ').replace(/[‘’]/g, "'")
    .replace(/[—–]/g, '-').replace(/\s+/g, ' ')
    .split('').filter((c) => c in GLYPHS).join('');

function measure(text, scale, tracking) {
  const t = normalise(text);
  if (!t.length) return 0;
  return t.length * GW * scale + (t.length - 1) * tracking;
}

function boxBlur(src, w, h, r) {
  const tmp = new Float32Array(w * h);
  const out = new Float32Array(w * h);
  const d = r * 2 + 1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let s = 0;
      for (let k = -r; k <= r; k++) {
        const xx = Math.min(w - 1, Math.max(0, x + k));
        s += src[y * w + xx];
      }
      tmp[y * w + x] = s / d;
    }
  }
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      let s = 0;
      for (let k = -r; k <= r; k++) {
        const yy = Math.min(h - 1, Math.max(0, y + k));
        s += tmp[yy * w + x];
      }
      out[y * w + x] = s / d;
    }
  }
  return out;
}

const smoothstep = (a, b, v) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Draw text with its left edge at x and its cap-top at y. */
function drawText(cv, text, x, y, scale, color, { tracking = null, alpha = 1 } = {}) {
  const t = normalise(text);
  if (!t.length) return 0;
  const tr = tracking == null ? Math.max(1, Math.round(scale * 1.5)) : tracking;
  const width = t.length * GW * scale + (t.length - 1) * tr;
  const pad = Math.max(2, Math.round(scale * 1.6));
  const mw = Math.ceil(width) + pad * 2;
  const mh = GH * scale + pad * 2;
  const mask = new Float32Array(mw * mh);

  t.split('').forEach((ch, i) => {
    const rows = GLYPHS[ch].split(',');
    const ox = pad + i * (GW * scale + tr);
    for (let gy = 0; gy < GH; gy++) {
      for (let gx = 0; gx < GW; gx++) {
        if (rows[gy][gx] !== '#') continue;
        for (let sy = 0; sy < scale; sy++) {
          const my = pad + gy * scale + sy;
          const rowOff = my * mw;
          for (let sx = 0; sx < scale; sx++) mask[rowOff + Math.round(ox + gx * scale + sx)] = 1;
        }
      }
    }
  });

  const r = Math.max(1, Math.round(scale * 0.24));
  const blurred = boxBlur(boxBlur(mask, mw, mh, r), mw, mh, r);
  for (let my = 0; my < mh; my++) {
    for (let mx = 0; mx < mw; mx++) {
      const a = smoothstep(0.28, 0.62, blurred[my * mw + mx]);
      if (a > 0.004) blend(cv, Math.round(x - pad + mx), Math.round(y - pad + my), color, a * alpha);
    }
  }
  return width;
}

function drawTextCentred(cv, text, cx, y, scale, color, opts = {}) {
  const tr = opts.tracking == null ? Math.max(1, Math.round(scale * 1.5)) : opts.tracking;
  const w = measure(text, scale, tr);
  return drawText(cv, text, cx - w / 2, y, scale, color, { ...opts, tracking: tr });
}

/** The brand mark: a card-corner index — R above a diamond. */
function brandMark(cv, x, y, scale, inkColor, suitColor) {
  drawText(cv, 'R', x, y, scale, inkColor, { tracking: 0 });
  const w = GW * scale;
  diamond(cv, x + w / 2, y + GH * scale + scale * 3.4, w * 0.42, w * 0.58, suitColor);
}

/* ======================================================== OG artwork ==== */

const OG = [
  {
    name: 'default',
    lines: ['THE REEL DEAL', 'DECK'],
    sub: '54 flies. One deck worth owning.',
    kicker: 'Fly Fishing Playing Cards',
    accent: 'red',
    svgTitle: 'The Reel&nbsp;Deal Deck',
  },
  {
    name: 'deck',
    lines: ['THE DECK'],
    sub: '54 hand-drawn flies on genuine Bicycle stock.',
    kicker: 'The Product',
    accent: 'red',
    svgTitle: 'The Deck',
  },
  {
    name: 'flies',
    lines: ['THE FLY', 'LIBRARY'],
    sub: 'A free reference to all 54 flies in the deck.',
    kicker: 'Free Reference',
    accent: 'river',
    svgTitle: 'The Fly-brary',
  },
  {
    name: 'gifts',
    lines: ['FLY FISHING', 'GIFTS'],
    sub: 'For the angler who already owns enough gear.',
    kicker: 'Gift Guide',
    accent: 'egg',
    svgTitle: 'Fly Fishing Gifts',
  },
  {
    name: 'wholesale',
    lines: ['FLY SHOPS', 'AND GUIDES'],
    sub: 'Wholesale for shops, guides and lodges.',
    kicker: 'Wholesale',
    accent: 'river',
    svgTitle: 'Fly Shops &amp; Guides',
  },
  {
    name: 'story',
    lines: ['OUR STORY'],
    sub: 'A father and daughter in Eagle, Idaho.',
    kicker: 'About',
    accent: 'ink',
    svgTitle: 'Our Story',
  },
  {
    name: 'conservation',
    lines: ['CONSERVATION'],
    sub: 'A portion of every deck goes to Trout Unlimited.',
    kicker: 'Why It Matters',
    accent: 'riffle',
    svgTitle: 'Conservation',
  },
];

const W = 1200, H = 630;

function renderOgPng(spec) {
  const accent = C[spec.accent] || C.red;
  const cv = canvas(W, H, C.paper);

  // Card field: a hairline frame, the way a face card is bounded.
  strokeRect(cv, 34, 34, W - 68, H - 68, 2, C.paper3);
  strokeRect(cv, 42, 42, W - 84, H - 84, 1, C.paper3, 0.75);

  /* Fixed vertical bands. Every text run is auto-fitted into its band, so no
     title length can ever collide with the kicker, the rule, or the footer. */
  const BAND = { kicker: 150, titleTop: 214, titleBottom: 448, rule: 466, sub: 500, footer: 552 };

  // Card-corner indices, mirrored the way a face card is bounded. They sit
  // in the outer margins, clear of every centred text band.
  brandMark(cv, 86, 80, 9, C.ink, accent);
  brandMark(cv, W - 86 - GW * 9, 80, 9, C.ink, accent);

  // Kicker
  let kickScale = 4;
  while (kickScale > 2 && measure(spec.kicker, kickScale, 10) > W - 480) kickScale--;
  drawTextCentred(cv, spec.kicker, W / 2, BAND.kicker, kickScale, C.ink3, { tracking: 10 });

  // Title — one shared scale so multi-line titles stay optically even, fitted
  // to both the safe measure and the available height.
  const maxW = W - 260;
  const maxH = BAND.titleBottom - BAND.titleTop;
  const n = spec.lines.length;
  let scale = 26;
  const fits = (s) =>
    spec.lines.every((l) => measure(l, s, Math.round(s * 1.5)) <= maxW) &&
    GH * s * n + Math.round(s * 2.6) * (n - 1) <= maxH;
  while (scale > 4 && !fits(scale)) scale--;

  const lineH = GH * scale + Math.round(scale * 2.6);
  const blockH = lineH * n - Math.round(scale * 2.6);
  let ty = Math.round(BAND.titleTop + (maxH - blockH) / 2);
  for (const line of spec.lines) {
    drawTextCentred(cv, line, W / 2, ty, scale, C.ink);
    ty += lineH;
  }

  // Accent rule + subtitle
  fillRect(cv, W / 2 - 60, BAND.rule, 120, 5, accent);
  let subScale = 5;
  while (subScale > 2 && measure(spec.sub, subScale, 5) > W - 200) subScale--;
  drawTextCentred(cv, spec.sub, W / 2, BAND.sub, subScale, C.ink2, { tracking: 5 });

  // Footer line
  drawText(cv, 'REELDEALDECK.COM', 96, BAND.footer, 3, C.ink3, { tracking: 7 });
  const placeW = measure('EAGLE, IDAHO', 3, 7);
  drawText(cv, 'EAGLE, IDAHO', W - 96 - placeW, BAND.footer, 3, C.ink3, { tracking: 7 });

  return encodePng(cv);
}

/* ------------------------------------------------------------ SVG art --- */
/* The real artwork. System serif stack only — no webfonts, so this renders
   identically to the site's display face on the machine that exports it. */

function renderOgSvg(spec) {
  const accent = hex(C[spec.accent] || C.red);
  const titleLines = spec.svgTitle.split('|');
  const size = titleLines.length > 1 ? 108 : 128;
  const startY = 340 - (titleLines.length - 1) * (size * 0.55);
  const title = titleLines
    .map((l, i) => `      <tspan x="600" y="${Math.round(startY + i * size * 1.06)}">${l}</tspan>`)
    .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${spec.svgTitle.replace(/&nbsp;/g, ' ')} — The Reel Deal Deck">
  <title>${spec.svgTitle.replace(/&nbsp;/g, ' ')} — The Reel Deal Deck</title>
  <defs>
    <style>
      .paper { fill: ${hex(C.paper)} }
      .rule  { stroke: ${hex(C.paper3)}; fill: none }
      .ink   { fill: ${hex(C.ink)} }
      .ink2  { fill: ${hex(C.ink2)} }
      .ink3  { fill: ${hex(C.ink3)} }
      .suit  { fill: ${accent} }
      .display { font-family: ui-serif, "Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif; }
      .body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
      .index { font-size: 64px; font-weight: 600; letter-spacing: 0.02em }
      .kicker { font-size: 24px; letter-spacing: 0.16em; text-transform: uppercase }
      .title { font-size: ${size}px; letter-spacing: -0.02em }
      .sub { font-size: 34px; letter-spacing: 0 }
      .meta { font-size: 21px; letter-spacing: 0.16em; text-transform: uppercase }
    </style>
    <g id="index">
      <text class="display index ink" x="0" y="52" text-anchor="middle">R</text>
      <path class="suit" d="M0 66 L17 88 L0 110 L-17 88 Z"/>
    </g>
  </defs>

  <rect class="paper" width="1200" height="630"/>
  <rect class="rule" x="34.5" y="34.5" width="1131" height="561" stroke-width="2"/>
  <rect class="rule" x="43.5" y="43.5" width="1113" height="543" stroke-width="1" opacity="0.7"/>

  <use href="#index" x="110" y="86"/>
  <use href="#index" x="1090" y="86" transform="rotate(180 1090 200)"/>

  <text class="body kicker ink3" x="600" y="188" text-anchor="middle">${spec.kicker}</text>
  <text class="display title ink" text-anchor="middle">
${title}
  </text>
  <rect class="suit" x="540" y="${Math.round(startY + (titleLines.length - 1) * size * 1.06) + 44}" width="120" height="5"/>
  <text class="body sub ink2" x="600" y="${Math.round(startY + (titleLines.length - 1) * size * 1.06) + 110}" text-anchor="middle">${spec.sub}</text>

  <text class="body meta ink3" x="96" y="556">reeldealdeck.com</text>
  <text class="body meta ink3" x="1104" y="556" text-anchor="end">Eagle, Idaho</text>
</svg>
`;
}

/* --------------------------------------------------------------- icons -- */

function renderIcon(size, { bg = C.paper, ink = C.ink, suit = C.red, frame = true } = {}) {
  const cv = canvas(size, size, bg);
  const s = size / 180;
  if (frame) strokeRect(cv, 8 * s, 8 * s, size - 16 * s, size - 16 * s, Math.max(1, Math.round(2 * s)), C.paper3);
  const glyphScale = Math.max(2, Math.round(10 * s));
  const gw = GW * glyphScale;
  const totalH = GH * glyphScale + glyphScale * 3.4 + GW * glyphScale * 0.58;
  const x = Math.round(size / 2 - gw / 2);
  const y = Math.round(size / 2 - totalH / 2);
  brandMark(cv, x, y, glyphScale, ink, suit);
  return encodePng(cv);
}

/* ---------------------------------------------------------------- main -- */

const outOg = path.join(ROOT, 'static', 'og');
await mkdir(outOg, { recursive: true });

const written = [];
for (const spec of OG) {
  const png = renderOgPng(spec);
  const svg = renderOgSvg(spec);
  await writeFile(path.join(outOg, `${spec.name}.png`), png);
  await writeFile(path.join(outOg, `${spec.name}.svg`), svg);
  written.push([`og/${spec.name}.png`, png.length], [`og/${spec.name}.svg`, Buffer.byteLength(svg)]);
}

for (const [file, size] of [
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
]) {
  const buf = renderIcon(size);
  await writeFile(path.join(ROOT, 'static', file), buf);
  written.push([file, buf.length]);
}

const total = written.reduce((n, [, s]) => n + s, 0);
console.log(`og.mjs → static/  (${site.name})`);
for (const [f, s] of written) console.log(`  ${f.padEnd(28)} ${(s / 1024).toFixed(1)} kB`);
console.log(`  ${'total'.padEnd(28)} ${(total / 1024).toFixed(1)} kB`);
