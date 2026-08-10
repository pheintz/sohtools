/*
 * Contrast audit of the hand-written site: css/site.css + css/site-header.css.
 *
 * The generated pages under /bingo/ and /rba/ fail their build if any colour pair drops below WCAG
 * AA. Nothing has ever checked the other five pages. This reports where they stand, so the restyle
 * starts from a known baseline instead of assuming the current palette is fine.
 *
 * Every pair below is one the CSS actually produces — a rule that sets a colour on a known ground,
 * or a documented pairing like nav-current-on-header. Speculative pairs are not invented: asserting
 * a combination nothing renders would force a palette change for nothing.
 *
 * Run: node audit_site_css.js
 */
const fs = require('fs');
const path = require('path');
const { ratio } = require('./a11y');

const REPO = path.join(__dirname, '..');

/* The shared sheets, AND every page's own stylesheet.
 *
 * Page sheets are included because the shared tokens are not the whole story, and leaving them out
 * let a real failure through: settings/css/rando.css filled the primary button with
 * --secondary-color and put white on it. That was 7.33 while both purple tokens were the same
 * value, and became 3.75 the moment --secondary-color moved to the lighter ink accent. Nothing
 * here caught it — it was found by hand. */
const SHEETS = [
  'css/site.css',
  'css/site-header.css',
  'tricks/css/tricks.css',
  'bingu/css/tricks.css',
  'dev/css/tricks.css',
  'settings/css/rando.css',
];
const css = SHEETS.map((f) => fs.readFileSync(path.join(REPO, f), 'utf8')).join('\n');

/* Resolve the :root tokens. Several are declared as var(--other) now, so this follows the
   indirection rather than only matching literal hex — the first version silently found nothing
   for those and threw on the first lookup. */
const raw = {};
const root = /:root\s*\{([\s\S]*?)\}/.exec(css);
for (const [, name, value] of root[1].matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)) raw[name] = value.trim();

const tokens = {};
const expand = (name, depth = 0) => {
  if (depth > 8) throw new Error('var() cycle on ' + name);
  const v = raw[name];
  if (v === undefined) return undefined;
  const ref = /^var\(\s*(--[a-z0-9-]+)\s*\)$/.exec(v);
  if (ref) return expand(ref[1], depth + 1);
  const hex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(v);
  if (!hex) return undefined;
  return hex[1].length === 3
    ? '#' + hex[1].split('').map((c) => c + c).join('')
    : '#' + hex[1];
};
for (const name of Object.keys(raw)) {
  const hex = expand(name);
  if (hex) tokens[name] = hex;
}
// the current-nav colour was a hardcoded literal in two files; it is the accent token now
tokens['--nav-current'] = tokens['--secondary-color'];

const C = (n) => {
  const v = tokens[n];
  if (!v) throw new Error('unknown token ' + n);
  return v;
};

/* fg, bg, minimum, and where it renders */
/* Only check a pairing the CSS actually produces. The brand-mark square is deliberately absent:
   WCAG 1.4.11 exempts logotypes, and the wordmark beside it already names the site, so demanding
   3:1 there would force a brand change to satisfy a rule that does not apply. */
/* `color:` only, on a property boundary. Matching the bare substring also caught `accent-color`
   and `outline-color`, which tint a control rather than set text. */
const usesPrimaryAsInk = /(?:^|[;{\s])color:\s*var\(--primary-color\)/m.test(css);

const PAIRS = [
  ['--text-color', '--background-color', 4.5, 'body text'],
  ['--text-color', '--input-bg-color', 4.5, 'text on inputs, cards and the site header'],
  ['--text-color', '--result-highlight', 4.5, 'text on a highlighted result row'],
  ['--text-color', '--hover-color', 4.5, 'text on a hovered row or nav item'],
  ['--text-color', '--primary-color', 4.5, 'text on a filled primary button'],
  ...(usesPrimaryAsInk ? [
    ['--primary-color', '--background-color', 4.5, 'primary used AS TEXT on the page ground'],
    ['--primary-color', '--input-bg-color', 4.5, 'primary used as text on a card'],
  ] : []),
  ['--nav-current', '--input-bg-color', 4.5, 'the current nav link in the header'],
  ['--input-action', '--background-color', 4.5, 'the action/confirm green on the page ground'],
  ['--input-action', '--input-bg-color', 4.5, 'the action/confirm green on a card'],
  ['--input-border-color', '--background-color', 3.0, 'input and card borders (UI boundary)'],
  ['--input-border-color', '--input-bg-color', 3.0, 'border between a card and its own ground'],
  ['--secondary-color', '--background-color', 3.0, 'checked-checkbox boundary against the page'],
];

/* Rules that declare BOTH a colour and a background are self-contained: no cascade guesswork is
   needed to know what they render. Pull those out of every sheet and check them alongside the
   hand-listed token pairs. `white`/`black` keywords are resolved; anything else non-hex is skipped
   rather than guessed. */
const KEYWORD = { white: '#ffffff', black: '#000000' };
const derived = [];
for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
  const fg = /(?:^|[;\s])color:\s*([^;]+)/.exec(body);
  const bg = /background(?:-color)?:\s*([^;]+)/.exec(body);
  if (!fg || !bg) continue;
  const val = (raw) => {
    const t = raw.trim().toLowerCase();
    if (KEYWORD[t]) return KEYWORD[t];
    if (/^#[0-9a-f]{6}$/.test(t)) return t;
    const v = /^var\(\s*(--[a-z0-9-]+)/.exec(t);
    return v ? tokens[v[1]] : undefined;
  };
  const f = val(fg[1]), b = val(bg[1]);
  if (!f || !b) continue;
  derived.push([f, b, 4.5, 'rule: ' + selector.trim().replace(/\s+/g, ' ').slice(0, 44)]);
}

const rows = [...PAIRS, ...derived].map(([fg, bg, min, where]) => {
  // hand-listed pairs arrive as token names; derived ones arrive as literals
  const fgHex = fg.startsWith('#') ? fg : C(fg);
  const bgHex = bg.startsWith('#') ? bg : C(bg);
  const r = ratio(fgHex, bgHex);
  return { fg, bg, fgHex, bgHex, min, where, r, pass: r >= min };
});

const fails = rows.filter((r) => !r.pass);

const pad = (s, n) => String(s).padEnd(n);
console.log('contrast audit — css/site.css + css/site-header.css\n');
console.log(pad('foreground', 22) + pad('background', 22) + pad('ratio', 8) + pad('needs', 7) + 'renders as');
console.log('-'.repeat(100));
for (const r of rows) {
  console.log(
    pad(r.fgHex, 22)
    + pad(r.bgHex, 22)
    + pad(r.r.toFixed(2) + (r.pass ? '' : '  X'), 8)
    + pad(r.min.toFixed(1), 7)
    + r.where
  );
}
console.log('\n' + (fails.length
  ? `${fails.length} of ${rows.length} pairs fail WCAG AA:`
  : `all ${rows.length} pairs pass`));
for (const f of fails) {
  console.log(`  - ${f.where}: ${f.r.toFixed(2)} against a minimum of ${f.min.toFixed(1)}`);
}
