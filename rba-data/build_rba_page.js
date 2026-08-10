/*
 * Build the RBA design/teaching page. It carries its own decomp-derived constants
 * rather than consuming dataset.json, so this step only gates and wraps it.
 * Output: out/rba-design.html (standalone) + out/rba-design.fragment.html
 */
const fs = require('fs');
const path = require('path');
const { checkContrast, checkFormNames, wrapStandalone, wrapSitePage } = require('./a11y');

const OUT = path.join(__dirname, 'out');
const tpl = fs.readFileSync(path.join(__dirname, 'rba-design.template.html'), 'utf8');

const PAIRS = [
  ['fg', 'bg', 4.5], ['fg', 'bg-slab', 4.5], ['fg', 'surface', 4.5],
  ['fg-muted', 'bg', 4.5], ['fg-muted', 'bg-slab', 4.5], ['fg-muted', 'surface', 4.5],
  ['fg-faint', 'bg', 4.5], ['fg-faint', 'bg-slab', 4.5], ['fg-faint', 'surface', 4.5],
  ['accent', 'bg', 4.5], ['accent', 'bg-slab', 4.5], ['accent', 'surface', 4.5], ['accent', 'accent-soft', 4.5],
  ['accent-fg', 'accent', 4.5],
  ['gain', 'gain-soft', 4.5], ['gain', 'bg-slab', 4.5], ['gain', 'surface', 4.5],
  ['loss', 'loss-soft', 4.5], ['loss', 'bg-slab', 4.5], ['loss', 'surface', 4.5],
  ['perm', 'perm-soft', 4.5], ['perm', 'bg-slab', 4.5], ['perm', 'surface', 4.5],
  ['rule-strong', 'bg-slab', 3.0], ['rule-strong', 'surface', 3.0],
  ['focus', 'bg', 3.0], ['focus', 'bg-slab', 3.0],
];

/* Every offset a C-Right item can reach. The page used to carry seven of these written out by
   hand; this is the whole set, decoded from the decomp by build_rba_table.js. Keys are one letter
   because it inlines into the page. */
const offsets = JSON.parse(fs.readFileSync(path.join(OUT, 'rba-offsets.json'), 'utf8'));
const reachable = offsets.rows.filter((r) => r.reachable);
const payload = JSON.stringify(reachable.map((r) => ({
  o: r.offset,
  n: r.cRightItemName,
  t: r.target,
  a: r.ntsc10Address,
  r: r.region,
  age: r.age,
  how: r.howToGetOnCRight,
  gr: r.itemGroup,
  b: r.bits,
  w: Object.fromEntries(r.writes.map((w) => [w.value, { g: w.grants, e: w.erases, p: w.permanent, x: w.notes, m: w.mode }])),
}))).replace(/</g, '\u003c');   // "</" would close the JSON script tag early

if (!tpl.includes('/*__OFFSETS__*/')) {
  console.error('template is missing /*__OFFSETS__*/');
  process.exit(1);
}

const c = checkContrast(tpl, PAIRS);
const f = checkFormNames(tpl);
const failures = [...c.failures, ...f.failures];
if (failures.length) {
  console.error('ACCESSIBILITY CHECK FAILED:\n  ' + failures.join('\n  '));
  process.exit(1);
}

// `$` is special in String.replace patterns, so inject through a function replacer
const page = tpl.replace('/*__OFFSETS__*/', () => payload);

fs.writeFileSync(path.join(OUT, 'rba-design.fragment.html'), page);
fs.writeFileSync(path.join(OUT, 'rba-design.html'), wrapStandalone(page, 'Reverse Bottle Adventure'));

/* The site copy. soh.tools is served straight from the repo by GitHub Pages with no build step,
   so the published page has to be committed at its final path rather than assembled on deploy. */
const SITE = path.join(__dirname, '..', 'rba');
fs.mkdirSync(SITE, { recursive: true });
fs.writeFileSync(path.join(SITE, 'index.html'), wrapSitePage(page, {
  title: 'Reverse Bottle Adventure — soh.tools',
  description: 'What Reverse Bottle Adventure actually does: the six values it can write, the byte each C-Right item points at, and what every write costs you.',
  url: 'https://soh.tools/rba/',
}));

console.log(`contrast checks: ${c.checked} (${c.pairs} pairs) across ${c.themes} themes — all pass`);
console.log(`form controls checked:  ${f.checked}`);
console.log(`C-Right items:   ${reachable.length} reachable offsets (${(payload.length / 1024).toFixed(0)} KB inlined)`);
console.log(`page written:           out/rba-design.html + .fragment.html`);
console.log(`site page written:      rba/index.html (https://soh.tools/rba/)`);
