/*
 * Build the goals explorer page: inject the data slice into the template, then
 * run the accessibility checks the template's own CSS comment promises.
 *
 * The build FAILS if a colour pair regresses below WCAG AA, or if a form control
 * loses its accessible name. Those are the two things most likely to rot silently.
 *
 * Output: out/goals-page.html
 */
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, 'out');

const tpl = fs.readFileSync(path.join(__dirname, 'goals-page.template.html'), 'utf8');
const data = fs.readFileSync(path.join(OUT, 'web-goals.json'), 'utf8');

/* ---------------- accessibility gates ---------------- */
const { checkContrast, checkFormNames, wrapStandalone, wrapSitePage } = require('./a11y');

// text pairs need 4.5:1; UI boundaries need 3:1
const PAIRS = [
  ['fg', 'bg', 4.5], ['fg', 'bg-slab', 4.5], ['fg', 'surface', 4.5],
  ['fg-muted', 'bg', 4.5], ['fg-muted', 'bg-slab', 4.5], ['fg-muted', 'surface', 4.5],
  ['fg-faint', 'bg', 4.5], ['fg-faint', 'bg-slab', 4.5], ['fg-faint', 'surface', 4.5],
  ['accent', 'bg', 4.5], ['accent', 'surface', 4.5], ['accent', 'accent-soft', 4.5],
  ['accent-fg', 'accent', 4.5],
  ['gain', 'surface', 4.5], ['gain', 'bg', 4.5],
  ['loss', 'surface', 4.5], ['loss', 'bg', 4.5],
  ['perm', 'perm-soft', 4.5], ['perm', 'surface', 4.5],
  // the 'overwrites this' marker sits on the row ground and on the expanded row
  ['perm', 'bg', 4.5], ['perm', 'accent-soft', 4.5],
  ['loss', 'accent-soft', 4.5], ['gain', 'accent-soft', 4.5], ['accent', 'bg-slab', 4.5],
  ['rule-strong', 'bg', 3.0], ['rule-strong', 'bg-slab', 3.0], ['rule-strong', 'surface', 3.0],
  ['focus', 'bg', 3.0], ['focus', 'surface', 3.0],
  /* Tinted-background pairs the hand list missed. Only combinations the CSS actually produces —
     `.card li` inherits fg-muted and is used inside `.trap` (perm-soft), and the index digit on an
     unrecognised goal sits on loss-soft. Speculative pairs were tried here and removed: fg-faint on
     gain-soft fails at 3.65 but never renders, since `.rowalert.ok` only ever shows --gain and --fg.
     Asserting a pairing that does not exist would force a palette change for nothing. */
  ['fg-muted', 'loss-soft', 4.5], ['fg-muted', 'perm-soft', 4.5], ['fg', 'perm-soft', 4.5],
];

const contrast = checkContrast(tpl, PAIRS);
const names = checkFormNames(tpl);
const failures = [...contrast.failures, ...names.failures];

/* ---------------- emit ---------------- */
if (failures.length) {
  console.error('ACCESSIBILITY CHECK FAILED:\n  ' + failures.join('\n  '));
  process.exit(1);
}

// "</" inside a <script type="application/json"> would close the tag early
const safe = data.replace(/</g, '\\u003c');

/* The board feature carries three more payloads: ootbingo's generator (verbatim), the goal lists
   it needs, and the SynergyCalculator port. `$` is special in String.replace patterns, so every
   injection goes through a function replacer — a literal "$&" inside minified code would otherwise
   splice the match back into itself. */
const boardData = fs.readFileSync(path.join(OUT, 'board-data.json'), 'utf8').replace(/</g, '\\u003c');
const boardGenerator = fs.readFileSync(path.join(OUT, 'board-generator.js'), 'utf8');
const boardSynergy = fs.readFileSync(path.join(__dirname, 'board_synergy.js'), 'utf8');

for (const [marker, payload] of [
  ['/*__BOARD_GENERATOR__*/', boardGenerator],
  ['/*__BOARD_SYNERGY__*/', boardSynergy],
]) {
  if (!tpl.includes(marker)) {
    console.error(`template is missing ${marker}`);
    process.exit(1);
  }
  if (payload.includes('</script')) {
    console.error(`payload for ${marker} contains "</script" and would close the tag early`);
    process.exit(1);
  }
}

const fragment = tpl
  .replace('/*__DATA__*/', () => safe)
  .replace('/*__BOARD_DATA__*/', () => boardData)
  .replace('/*__BOARD_GENERATOR__*/', () => boardGenerator)
  .replace('/*__BOARD_SYNERGY__*/', () => boardSynergy);

// Two outputs on purpose:
//  - the fragment is what the Artifact host wants; it supplies its own <head>
//  - the standalone needs its own charset, or every em dash and glyph mojibakes
//    when a plain static server serves it without one
const standalone = wrapStandalone(fragment, 'OoT Bingo v10.6');

fs.writeFileSync(path.join(OUT, 'goals-page.fragment.html'), fragment);
fs.writeFileSync(path.join(OUT, 'goals-page.html'), standalone);

/* The site copy. soh.tools is served straight from the repo by GitHub Pages with no build step,
   so the published page has to be committed at its final path rather than assembled on deploy. */
const SITE = path.join(__dirname, '..', 'bingo');
fs.mkdirSync(SITE, { recursive: true });
fs.writeFileSync(path.join(SITE, 'index.html'), wrapSitePage(fragment, {
  title: 'OoT Bingo goal index - soh.tools',
  description: 'OoT Bingo v10.6 goal list and board.',
  url: 'https://soh.tools/bingo/',
}));

console.log(`contrast checks: ${contrast.checked} (${contrast.pairs} pairs) across ${contrast.themes} themes — all pass`);
console.log(`form controls checked:  ${names.checked} — all have an accessible name`);
console.log(`page written:           out/goals-page.html (${(standalone.length / 1024).toFixed(0)} KB standalone)`);
console.log(`                        out/goals-page.fragment.html (for Artifact publishing)`);
console.log(`site page written:      bingo/index.html (https://soh.tools/bingo/)`);
