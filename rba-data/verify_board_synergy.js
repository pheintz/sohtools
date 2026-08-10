/*
 * Prove the SynergyCalculator port in board_synergy.js matches the real generator.
 *
 * Two independent checks, because a plausible-but-wrong synergy number is worse than none — it
 * would make the page confidently rank rows in the wrong order.
 *
 *  1. DIRECT. generateBingoBoard returns the generator's own squares, each carrying the
 *     `difficulty` and `desiredTime` it derived from the seed's magic square. Compare those against
 *     our generateMagicSquare / squaresFor for every square of every board. This pins the
 *     time-offset term, which is the part a URL alone could never supply.
 *
 *  2. INVARIANT. The generator refuses any placement that would push a line outside
 *     [minimumSynergy, maximumSynergy]. A line's last-placed square is evaluated with all five
 *     present, so every complete line of a finished board must satisfy those bounds. Recompute all
 *     12 lines with the port and assert it. A port that drifted would break this almost at once,
 *     since the bounds are tight (normal: -3 .. 7).
 *
 * Exit code 1 on any mismatch.
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'out');
const S = require('./board_synergy');

const boardData = JSON.parse(fs.readFileSync(path.join(OUT, 'board-data.json'), 'utf8'));
const generatorText = fs.readFileSync(path.join(OUT, 'board-generator.js'), 'utf8');

// board-generator.js is seedrandom + generator.js, exactly as the page will load it
const BingoLibrary = new Function(generatorText + '\nreturn BingoLibrary;')();

const SEEDS = [];
for (let i = 0; i < 250; i++) SEEDS.push(1 + Math.floor(Math.random() * 999999));
SEEDS.push(523297, 1, 999999);

const problems = [];
let boards = 0, squaresChecked = 0, linesChecked = 0;

for (const version of Object.keys(boardData.versions)) {
  const goalList = boardData.versions[version];
  for (const mode of ['normal', 'short']) {
    if (!goalList[mode]) continue;
    const profile = S.PROFILES[mode];
    const calc = new S.SynergyCalculator(
      profile,
      goalList[mode].rowtypes,
      S.parseSynergyFilters(goalList[mode].synfilters)
    );

    for (const seed of SEEDS) {
      const real = BingoLibrary.generateBingoBoard(goalList, mode, seed);
      if (!real) { problems.push(`v${version} ${mode} seed ${seed}: generator returned nothing`); continue; }
      boards++;

      const goals = real.squares.map((s) => s.goal);
      const mine = S.squaresFor(seed, mode, goals);

      /* ---- check 1: difficulty / desiredTime ---- */
      for (let i = 0; i < 25; i++) {
        squaresChecked++;
        if (mine[i].difficulty !== real.squares[i].difficulty) {
          problems.push(`v${version} ${mode} seed ${seed} sq${i}: difficulty ${mine[i].difficulty} vs real ${real.squares[i].difficulty}`);
          break;
        }
        if (Math.abs(mine[i].desiredTime - real.squares[i].desiredTime) > 1e-9) {
          problems.push(`v${version} ${mode} seed ${seed} sq${i}: desiredTime ${mine[i].desiredTime} vs real ${real.squares[i].desiredTime}`);
          break;
        }
      }

      /* ---- check 2: every line inside the profile bounds ---- */
      for (const line of S.linesOf(mine)) {
        const syn = calc.calculateSynergyOfSquares(line.squares);
        linesChecked++;
        if (syn > profile.maximumSynergy + 1e-9 || syn < profile.minimumSynergy - 1e-9) {
          problems.push(
            `v${version} ${mode} seed ${seed} ${line.label}: synergy ${syn.toFixed(2)} outside ` +
            `[${profile.minimumSynergy}, ${profile.maximumSynergy}]`
          );
        }
      }

      /* ---- the decomposition must reconstruct the total ---- */
      const line = S.linesOf(mine)[0];
      const ex = calc.explain(line.squares);
      if (!ex.exclusion) {
        const recomposed = ex.typeTotal + ex.rowtypeTotal + ex.timeDifference;
        if (Math.abs(recomposed - ex.total) > 1e-9) {
          problems.push(`v${version} ${mode} seed ${seed}: decomposition ${recomposed} != total ${ex.total}`);
        }
      }
    }
  }
}

/* ---------- check 3: the page's OWN input path ----------
 * The two checks above feed the generator a seed this file chose. The page feeds it whatever came
 * out of parseBoardInput, and for a long time coerced it with Number() first — so "?seed=007"
 * silently produced a different 25-square board under a heading reading "Board 007", and neither
 * gate noticed because neither went through the parse. seedrandom keys on `seed.toString()`, so the
 * seed has to reach the generator as the raw string ootbingo passes.
 *
 * Seeds where String(Number(s)) !== s are the ones that matter: leading zeros, and digit strings
 * long enough to lose precision as a double. */
const PARSE_SEEDS = ['007', '0523297', '000001', '523297', '1', '99999999999999999999'];
let parseChecked = 0;
for (const version of Object.keys(boardData.versions)) {
  const goalList = boardData.versions[version];
  for (const raw of PARSE_SEEDS) {
    const spec = S.parseBoardInput('https://ootbingo.github.io/bingo/bingo.html?version=' +
      version + '&seed=' + raw + '&mode=normal', boardData.defaultVersion);
    if (!spec) { problems.push(`parseBoardInput rejected a valid link for seed ${raw}`); continue; }
    if (spec.seed !== raw) { problems.push(`parseBoardInput mangled seed ${raw} -> ${spec.seed}`); continue; }

    // what ootbingo would produce for this URL, and what the page's spec produces
    const theirs = BingoLibrary.generateBingoBoard(goalList, spec.mode, raw);
    const ours = BingoLibrary.generateBingoBoard(goalList, spec.mode, spec.seed);
    parseChecked++;
    if (!theirs || !ours) { problems.push(`v${version} seed ${raw}: generator returned nothing`); continue; }
    const diff = theirs.squares.findIndex((sq, i) => sq.goal.name !== ours.squares[i].goal.name);
    if (diff !== -1) {
      problems.push(`v${version} seed "${raw}": square ${diff + 1} differs from the ootbingo link — ` +
        `"${theirs.squares[diff].goal.name}" vs "${ours.squares[diff].goal.name}"`);
    }
    /* Canary: for a seed where String(Number(s)) !== s, the coerced board must differ from the
       string board — otherwise this seed has stopped exercising the bug and the check above is
       passing for the wrong reason. Compare the WHOLE board: two different boards share any single
       given square roughly one time in two hundred, so checking one square makes the canary itself
       flaky. */
    if (String(Number(raw)) !== raw) {
      const coerced = BingoLibrary.generateBingoBoard(goalList, spec.mode, Number(raw));
      const identical = coerced && theirs.squares.every((sq, i) => sq.goal.name === coerced.squares[i].goal.name);
      if (identical) {
        problems.push(`seed "${raw}" no longer distinguishes a string seed from a coerced one — this check has gone blind`);
      }
    }
  }
}

let txt = 'BOARD SYNERGY VERIFICATION\n' + '='.repeat(70) + '\n\n';
txt += `seed parse path  : ${parseChecked} board(s) built from a real bingo.html URL, seed kept as a string\n`;
txt += `boards generated : ${boards}\n`;
txt += `squares compared : ${squaresChecked}  (difficulty + desiredTime vs the generator's own)\n`;
txt += `lines checked    : ${linesChecked}  (against each profile's [min, max] synergy bounds)\n\n`;
txt += problems.length
  ? `MISMATCHES (${problems.length}):\n  ` + problems.slice(0, 15).join('\n  ') + '\n'
  : 'The port reproduces the generator exactly: every magic-square value matches, and every\n' +
    'complete line of every generated board falls inside the bounds the generator enforces.\n';

fs.writeFileSync(path.join(OUT, 'board-synergy-verification.txt'), txt);
console.log(txt.trim());
if (problems.length) process.exit(1);
