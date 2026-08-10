/*
 * Icon + tracker data for the stream popout.
 *
 * ootbingo draws item icons next to some goals ("Beat Dodongo's Cavern & Fire Temple" gets the two
 * medallions, "Open 3 Gold Rupee Chests" gets a gold rupee and a counter). Those rules live in
 * lib/item-tracker/, and the icons are 82 .ico files plus 2 PNGs that were given a .ico extension.
 *
 * Two things are done here rather than at page load:
 *
 *  1. The .ico frames are 32bpp bottom-up DIBs. A browser can render a whole .ico, but the files
 *     carry a 16x16 frame as well and `slot.ico` carries six frames up to 256x256 (115 KB for one
 *     icon). Pulling just the 32x32 frame out and re-encoding it as PNG takes the whole icon set
 *     from ~550 KB of base64 down to something a popout can carry inline.
 *
 *  2. trackerData.js is an ordered list of regexes — order matters, as its own first line says — so
 *     it is imported and re-serialised rather than retyped. Retyping it would be a second copy to
 *     keep in sync, which is the mistake this project keeps finding elsewhere.
 *
 * Output: out/popout-data.json
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { pathToFileURL } = require('url');

const OUT = path.join(__dirname, 'out');
const BINGO = 'C:/Users/lloyd/source/repos/bingo';
const ICONS = path.join(BINGO, 'lib/item-tracker/icons');

/* ---------------- PNG encoding ---------------- */

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
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

/* 8-bit RGBA, no interlacing. Every scanline gets filter byte 0 — these are 32x32 pixel-art
   sprites, so a smarter filter buys almost nothing and costs a lot of code. */
function encodePng(width, height, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 6;   // colour type: RGBA
  const raw = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/* ---------------- ICO reading ---------------- */

/* Pick the frame closest to 32x32 without going under: these are pixel-art sprites shown at roughly
   64-80 px on a stream overlay, so a 32x32 source doubled with image-rendering:pixelated is exactly
   right, while the 16x16 frame would be visibly mushy. */
function bestFrame(buf) {
  const count = buf.readUInt16LE(4);
  let best = null;
  for (let i = 0; i < count; i++) {
    const o = 6 + i * 16;
    const w = buf[o] || 256;
    const h = buf[o + 1] || 256;
    const size = buf.readUInt32LE(o + 8);
    const off = buf.readUInt32LE(o + 12);
    if (w !== h) continue;
    const score = w >= 32 ? w - 32 : 1000 + (32 - w);
    if (!best || score < best.score) best = { w, h, size, off, score };
  }
  return best;
}

function frameToPng(buf, frame) {
  const slice = buf.slice(frame.off, frame.off + frame.size);
  if (slice.slice(1, 4).toString('ascii') === 'PNG') return slice; // already a PNG frame

  // BITMAPINFOHEADER; biHeight counts the XOR and AND masks together, so the real height is half
  const headerSize = slice.readUInt32LE(0);
  const width = slice.readInt32LE(4);
  const height = Math.abs(slice.readInt32LE(8)) / 2;
  const bpp = slice.readUInt16LE(14);
  if (bpp !== 32) throw new Error(`unsupported ${bpp}bpp frame`);

  const px = slice.slice(headerSize);
  const rgba = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    const src = (height - 1 - y) * width * 4; // DIB rows run bottom-up
    for (let x = 0; x < width; x++) {
      const s = src + x * 4;
      const d = (y * width + x) * 4;
      rgba[d] = px[s + 2];      // B G R A  ->  R G B A
      rgba[d + 1] = px[s + 1];
      rgba[d + 2] = px[s];
      rgba[d + 3] = px[s + 3];
    }
  }
  return encodePng(width, height, rgba);
}

/* ---------------- main ---------------- */

(async () => {
  const trackerDataMod = await import(pathToFileURL(path.join(BINGO, 'lib/item-tracker/trackerData.js')).href);
  const defaultsMod = await import(pathToFileURL(path.join(BINGO, 'lib/item-tracker/trackerDefaults.js')).href);
  const trackerData = trackerDataMod.trackerData;
  const trackerDefaults = defaultsMod.trackerDefaults;

  /* RegExp cannot survive JSON, and the list is order-sensitive, so keep it an array and carry
     source + flags across. */
  /* A token row entry is normally an icon name, but a few are `{filename, selected}` — the items
     Link already owns when the goal starts, e.g. the Kokiri tunic and boots in a "3 Tunics" goal.
     Normalised to one shape here so the page never has to branch on the type. */
  const token = (t) => (typeof t === 'object'
    ? { icon: t.filename, on: !!t.selected }
    : { icon: t, on: false });

  const rules = trackerData.map((d) => ({
    re: d.regex.source,
    fl: d.regex.flags,
    rows: (d.options.tokens && d.options.tokens.rows)
      ? d.options.tokens.rows.map((row) => row.map(token))
      : null,
    tokenIcon: (d.options.tokens && d.options.tokens.icon) || null,
    counterIcon: (d.options.counter && d.options.counter.icon) || null,
    denominator: (d.options.counter && d.options.counter.denominator) || null,
  }));

  // only ship icons some rule can actually ask for
  const wanted = new Set();
  for (const r of rules) {
    if (r.tokenIcon) wanted.add(r.tokenIcon);
    if (r.counterIcon) wanted.add(r.counterIcon);
    for (const row of r.rows || []) for (const t of row) wanted.add(t.icon);
  }

  const icons = {};
  const missing = [];
  let rawBytes = 0, pngBytes = 0;
  for (const name of [...wanted].sort()) {
    const file = path.join(ICONS, `${name}.ico`);
    if (!fs.existsSync(file)) { missing.push(name); continue; }
    const buf = fs.readFileSync(file);
    rawBytes += buf.length;
    let png;
    if (buf.slice(1, 4).toString('ascii') === 'PNG') {
      png = buf;                                   // goldrupee / silverrupee are PNGs named .ico
    } else {
      const frame = bestFrame(buf);
      if (!frame) { missing.push(name); continue; }
      png = frameToPng(buf, frame);
    }
    pngBytes += png.length;
    icons[name] = 'data:image/png;base64,' + png.toString('base64');
  }

  /* A rule naming an icon that does not exist would render an empty box on stream, which is worse
     than showing nothing at all. Fail the build instead. */
  if (missing.length) {
    console.error(`ICONS MISSING (${missing.length}): ${missing.join(', ')}`);
    process.exit(1);
  }

  const payload = { rules, defaults: trackerDefaults, icons };
  fs.writeFileSync(path.join(OUT, 'popout-data.json'), JSON.stringify(payload));

  console.log(`tracker rules   ${rules.length}`);
  console.log(`tracked goals   ${Object.keys(trackerDefaults).length}`);
  console.log(`icons           ${Object.keys(icons).length} (${(rawBytes / 1024).toFixed(0)} KB of .ico -> ${(pngBytes / 1024).toFixed(0)} KB of PNG)`);
})().catch((e) => { console.error(e); process.exit(1); });
