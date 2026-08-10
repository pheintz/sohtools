/*
 * Board generation data.
 *
 * The goal index can take a real bingo.html URL (version + seed + mode) and reproduce the exact
 * board the site would show. To do that offline — and inside an Artifact, where a strict CSP blocks
 * every external request — the page has to carry the generator and the goal lists itself.
 *
 * Two decisions worth stating:
 *
 *  1. The generator is embedded VERBATIM, not reimplemented. Board generation is a seeded RNG walk
 *     over a weighted shuffle; a faithful-looking port that diverges on one comparison produces a
 *     plausible board that is silently the wrong one. Shipping ootbingo's own generator.js removes
 *     that whole class of bug.
 *  2. The goal lists are trimmed but not restructured. Only `jp` is dropped (display-only — the
 *     generator never reads it). Everything the generator touches — id, name, time, weight, types,
 *     subtypes, rowtypes, plus each mode's rowtypes / synfilters — is copied through unchanged.
 *
 * Both claims are then *checked* rather than asserted: this script generates boards from the real
 * untouched pipeline and from the trimmed payload, over many seeds and both modes, and fails the
 * build if a single square differs.
 */
const fs = require('fs');
const path = require('path');

const BINGO = 'C:/Users/lloyd/source/repos/bingo';
const OUT = path.join(__dirname, 'out');

/* Which versions the page can generate. v10.6 is what the RBA dataset is built against; v10.5.1 is
   still widely linked and shares 252 of its 256 goals with v10.6, so nearly everything stays
   annotated. Adding a version here is the only change needed — the page reads this list. */
const BOARD_VERSIONS = ['10.6', '10.5.1'];
const DEFAULT_VERSION = '10.6';

const availableVersions = JSON.parse(fs.readFileSync(path.join(BINGO, 'api/v1/available_versions.json'), 'utf8'));

const generatorSrc = (v) => fs.readFileSync(path.join(BINGO, availableVersions.versions[v], 'generator.js'), 'utf8');
const goalListSrc = (v) => fs.readFileSync(path.join(BINGO, availableVersions.versions[v], 'goal-list.js'), 'utf8');
const seedrandomSrc = fs.readFileSync(path.join(BINGO, 'lib/seedrandom-min.js'), 'utf8');

const loadGoalList = (v) => new Function(goalListSrc(v) + '\nreturn bingoList;')();
const loadGenerator = (v) =>
  new Function(
    generatorSrc(v) + "\nreturn typeof BingoLibrary === 'undefined' ? ootBingoGenerator : BingoLibrary.ootBingoGenerator;"
  )();

/* ---------- trim ---------- */
// exactly the fields generator.js reads, and nothing else
const trimGoal = (g) => ({
  id: g.id,
  name: g.name,
  time: g.time,
  weight: g.weight,
  types: g.types,
  subtypes: g.subtypes,
  rowtypes: g.rowtypes,
});

function trimBingoList(bl) {
  const out = { info: bl.info };
  for (const mode of Object.keys(bl)) {
    if (mode === 'info') continue;
    const src = bl[mode];
    const m = { rowtypes: src.rowtypes, synfilters: src.synfilters };
    for (let d = 1; d <= 25; d++) m[d] = (src[d] || []).map(trimGoal);
    out[mode] = m;
  }
  return out;
}

/* ---------- parity check ---------- */
// seedrandom is global state; each generator call re-seeds it, so order does not leak between runs.
new Function(seedrandomSrc)();

const namesFor = (generator, list, seed, mode) => {
  const board = generator(list, { seed, mode, lang: 'name' });
  return board ? board.slice(1).map((g) => g.name) : null;
};

const SEEDS = [];
for (let i = 0; i < 400; i++) SEEDS.push(String(1 + Math.floor(Math.random() * 999999)));
SEEDS.push('523297', '1', '999999', '0');

const problems = [];
const payloadVersions = {};
let comparisons = 0;

for (const v of BOARD_VERSIONS) {
  if (!availableVersions.versions[v]) {
    problems.push(`version ${v} is not in available_versions.json`);
    continue;
  }
  const generator = loadGenerator(v);
  const real = loadGoalList(v);
  const trimmed = trimBingoList(real);
  // round-trip through JSON exactly as the page will receive it
  const asShipped = JSON.parse(JSON.stringify(trimmed));

  for (const mode of ['normal', 'short']) {
    if (!real[mode]) continue;
    for (const seed of SEEDS) {
      const a = namesFor(generator, real, seed, mode);
      const b = namesFor(generator, asShipped, seed, mode);
      comparisons++;
      if (!a || !b) {
        problems.push(`v${v} ${mode} seed ${seed}: generator returned nothing`);
        break;
      }
      if (a.length !== 25 || b.length !== 25) {
        problems.push(`v${v} ${mode} seed ${seed}: expected 25 squares, got ${a.length}/${b.length}`);
        break;
      }
      const diff = a.findIndex((n, i) => n !== b[i]);
      if (diff !== -1) {
        problems.push(`v${v} ${mode} seed ${seed}: square ${diff + 1} differs — real "${a[diff]}" vs trimmed "${b[diff]}"`);
        break;
      }
    }
  }
  payloadVersions[v] = asShipped;
}

if (problems.length) {
  console.error(`BOARD PARITY FAILED (${problems.length}):\n  ` + problems.slice(0, 10).join('\n  '));
  process.exit(1);
}

/* ---------- emit ---------- */
// One generator serves every version here: v10.5.1 and v10.6 ship byte-identical generator.js.
const generatorTexts = new Map();
for (const v of BOARD_VERSIONS) {
  const src = generatorSrc(v);
  if (!generatorTexts.has(src)) generatorTexts.set(src, []);
  generatorTexts.get(src).push(v);
}
if (generatorTexts.size !== 1) {
  console.error(
    'The selected versions do not share one generator.js, so a single embedded generator is not safe:\n  ' +
      [...generatorTexts.values()].map((vs) => vs.join(', ')).join('\n  ')
  );
  process.exit(1);
}

fs.writeFileSync(
  path.join(OUT, 'board-data.json'),
  JSON.stringify({ defaultVersion: DEFAULT_VERSION, versions: payloadVersions }, null, 0)
);
fs.writeFileSync(path.join(OUT, 'board-generator.js'), seedrandomSrc + '\n' + [...generatorTexts.keys()][0]);

const kb = (p) => (fs.statSync(path.join(OUT, p)).size / 1024).toFixed(1) + ' KB';
console.log(`versions embedded : ${BOARD_VERSIONS.join(', ')} (default ${DEFAULT_VERSION})`);
console.log(`board parity      : ${comparisons} boards compared, every square identical`);
console.log(`board-data.json   : ${kb('board-data.json')}`);
console.log(`board-generator.js: ${kb('board-generator.js')}`);
