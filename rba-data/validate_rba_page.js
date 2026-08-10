/*
 * Cross-check the RBA page's own arithmetic against the generated offset table.
 *
 * The page does not read grants/erases/permanent for a bitfield byte — it recomputes them from the
 * bit labels and a before/after byte. That is a second implementation of the same rules, and this
 * asserts the two agree for all 60 reachable items and all 6 values.
 *
 * It exists because a whole class of bug here is invisible on screen. Three real ones, all found
 * the same way:
 *   - Zelda's Lullaby never appeared for any value on the Poacher's Saw byte. It is bit 4, every
 *     value sets bit 4, so it neither gained nor lost and the panel printed nothing at all.
 *     Silence reads as missing data, not as safety.
 *   - the permanent-loss note said "sits in bits 5-7" for Requiem of Spirit, which is bit 1.
 *   - normalising the list shapes made one branch push objects where the renderer wanted strings,
 *     which showed up on the page as "[object Object]" rather than as a crash.
 *
 * Output: out/rba-page-validation.txt. Exits non-zero on any mismatch.
 */
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, 'out');

const offsets = JSON.parse(fs.readFileSync(path.join(OUT, 'rba-offsets.json'), 'utf8'));
const rows = offsets.rows.filter((r) => r.reachable);

/* The six values RBA can write. 31 is conditional -- it only lands when the byte already reads 26 --
   so it is excluded when working out which bits are permanently unreachable. */
const VALUES = [20, 24, 25, 28, 29, 31];
const UNCONDITIONAL = VALUES.filter((v) => v !== 31);

const problems = [];
const note = (msg) => problems.push(msg);

/* ---------- 1. the bits nothing can set ---------- */
let settable = 0;
for (const v of UNCONDITIONAL) settable |= v;
const never = [];
for (let b = 0; b < 8; b++) if (!((settable >> b) & 1)) never.push(b);

if (never.join(',') !== '1,5,6,7') {
  note(`the permanently unsettable bits are ${never.join(', ')}, but the page hardcodes 1, 5, 6, 7`);
}

/* ---------- 2. the page's model, reimplemented ---------- */
// mirrors tally() for a flags byte: everything owned beforehand, one whole-byte assign
function pageModel(labels, after) {
  const before = 0xff;
  const gains = [], losses = [], perm = [], kept = [];
  for (let b = 0; b < 8; b++) {
    const lab = labels[b];
    if (!lab) continue;
    const was = (before >> b) & 1, now = (after >> b) & 1;
    if (now && !was) gains.push(lab);
    else if (!now && was) (never.includes(b) ? perm : losses).push(lab);
    else if (now && was) kept.push(lab);
  }
  return { gains, losses, perm, kept };
}

const norm = (s) => String(s).replace(/[^a-z0-9]/gi, '').toLowerCase();
const sameSet = (a, b) => a.length === b.length && a.map(norm).sort().join('|') === b.map(norm).sort().join('|');

let checked = 0, flagRows = 0, skipped = 0;
for (const r of rows) {
  if (!r.bits) continue;
  flagRows++;
  for (const w of r.writes) {
    checked++;
    const mine = pageModel(r.bits, w.value);

    /* ---------- 3. every labelled bit is accounted for ---------- */
    const named = r.bits.filter(Boolean).length;
    const seen = mine.gains.length + mine.losses.length + mine.perm.length + mine.kept.length;
    if (seen !== named) {
      note(`${r.cRightItemName} (${r.offsetHex}) value ${w.value}: ${seen} of ${named} labelled bits reported`);
    }

    /* ---------- 4. the page and the generator agree ----------
       Only where a name-level comparison is meaningful. The dungeonItems branch of the generator
       composes prose -- one entry reading "Deku Tree: Boss Key + Map" for two bits, with the
       dungeon prefixed -- while the page lists each labelled bit on its own. Comparing those two
       means parsing a display string to recover the bits, which is the mistake this project keeps
       relearning. Those rows still get the completeness and invariant checks above; they just skip
       this one, and that is recorded rather than hidden. */
    if (r.region === 'dungeonItems') { skipped++; continue; }

    if (!sameSet(mine.perm, w.permanent || [])) {
      note(`${r.cRightItemName} (${r.offsetHex}) value ${w.value}: permanent differs\n`
        + `      page:      ${mine.perm.join(', ') || '(none)'}\n`
        + `      generator: ${(w.permanent || []).join(', ') || '(none)'}`);
    }
    if (!sameSet(mine.losses, w.erases || [])) {
      note(`${r.cRightItemName} (${r.offsetHex}) value ${w.value}: erases differs\n`
        + `      page:      ${mine.losses.join(', ') || '(none)'}\n`
        + `      generator: ${(w.erases || []).join(', ') || '(none)'}`);
    }
    /* The generator reports every SET bit as a grant, because it describes the write in isolation.
       The page starts from "you already own all of these", so a bit that was already set is kept
       rather than gained. Union of the two must still be the generator's grant list. */
    const pageSets = [...mine.gains, ...mine.kept];
    if (!sameSet(pageSets, w.grants || [])) {
      note(`${r.cRightItemName} (${r.offsetHex}) value ${w.value}: set bits differ\n`
        + `      page gains+kept: ${pageSets.join(', ') || '(none)'}\n`
        + `      generator grants: ${(w.grants || []).join(', ') || '(none)'}`);
    }
  }
}

/* ---------- 5. nothing in the page renders as a stringified object ---------- */
const page = fs.readFileSync(path.join(OUT, 'rba-design.html'), 'utf8');
if (page.includes('[object Object]')) {
  note('the built page contains "[object Object]" — a value is being concatenated instead of read');
}

/* ---------- 6. the permanent-loss note must not claim a bit range it does not know ----------
   Checked against the page with comments stripped: the first version of this matched the comment
   that explains the fix, and reported the bug it was describing as still present. */
const live = page.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/<!--[\s\S]*?-->/g, ' ');
if (/sits in bits 5.7/.test(live)) {
  note('the page still hardcodes "sits in bits 5-7" for permanent losses; bit 1 is permanent too and needs its own reason');
}

/* ---------- 7. every custom property the page uses is defined ---------- */
// an undefined token makes font-size fall back to inherited, which silently inverted the picker's
// type hierarchy: the category row rendered larger than the items it filters
const css = /<style>([\s\S]*?)<\/style>/.exec(page)[1];
const defined = new Set([...css.matchAll(/^\s*(--[a-z0-9-]+)\s*:/gim)].map((m) => m[1]));
const used = new Set([...css.matchAll(/var\(\s*(--[a-z0-9-]+)/g)].map((m) => m[1]));
const undef = [...used].filter((v) => !defined.has(v));
if (undef.length) note(`CSS custom properties used but never defined: ${undef.join(', ')}`);

/* ---------- report ---------- */
const lines = [
  `reachable items      ${rows.length}`,
  `bitfield bytes       ${flagRows}`,
  `item x value checks  ${checked}`,
  `name cross-checks    ${checked - skipped} (${skipped} dungeonItems rows compare bits only — the generator writes those as prose)`,
  `permanently unsettable bits: ${never.join(', ')}`,
  '',
  problems.length ? `PROBLEMS (${problems.length}):` : 'no mismatches',
  ...problems.map((p) => '  - ' + p),
];
fs.writeFileSync(path.join(OUT, 'rba-page-validation.txt'), lines.join('\n') + '\n');
console.log(lines.join('\n'));
if (problems.length) process.exit(1);
