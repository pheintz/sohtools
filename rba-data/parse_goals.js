// Parse bingo v10.6 goal-list.js into structured JSON for analysis.
const fs = require('fs');
const path = require('path');

const SRC = 'C:/Users/lloyd/source/repos/bingo/versions/v10/v10.6/goal-list.js';
const OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });

const raw = fs.readFileSync(SRC, 'utf8');
// goal-list.js is `var bingoList = {...};` -- evaluate it directly.
const fn = new Function(raw + '\nreturn bingoList;');
const bingoList = fn();

const modes = Object.keys(bingoList).filter((k) => k !== 'info');
const report = { info: bingoList.info, modes: {} };

const allGoals = new Map(); // id -> goal (merged across modes/difficulties)

for (const mode of modes) {
  const list = bingoList[mode];
  const diffs = Object.keys(list)
    .filter((k) => /^\d+$/.test(k))
    .map(Number)
    .sort((a, b) => a - b);
  const modeInfo = { difficulties: {}, extraKeys: Object.keys(list).filter((k) => !/^\d+$/.test(k)), total: 0 };
  for (const d of diffs) {
    const goals = list[String(d)] || [];
    modeInfo.difficulties[d] = goals.length;
    modeInfo.total += goals.length;
    for (const g of goals) {
      const key = g.id;
      if (!allGoals.has(key)) {
        allGoals.set(key, {
          id: g.id,
          name: g.name,
          jp: g.jp || '',
          modes: {},
          types: g.types || {},
          subtypes: g.subtypes || {},
          rowtypes: g.rowtypes || {},
        });
      }
      const rec = allGoals.get(key);
      rec.modes[mode] = {
        difficulty: g.difficulty,
        time: g.time,
        skill: g.skill,
        weight: g.weight,
      };
      // Merge synergy maps (they can differ per mode; keep per-mode copies too)
      rec[`types_${mode}`] = g.types || {};
      rec[`subtypes_${mode}`] = g.subtypes || {};
      rec[`rowtypes_${mode}`] = g.rowtypes || {};
    }
  }
  report.modes[mode] = modeInfo;
  // capture non-numeric keys (rowtypes / synfilters config)
  for (const k of modeInfo.extraKeys) report.modes[mode][k] = list[k];
}

const goals = [...allGoals.values()].sort((a, b) => a.name.localeCompare(b.name));
report.uniqueGoalCount = goals.length;

fs.writeFileSync(path.join(OUT, 'goals.json'), JSON.stringify(goals, null, 1));
fs.writeFileSync(path.join(OUT, 'meta.json'), JSON.stringify(report, null, 2));

// Flat listing for eyeballing
const lines = goals.map((g) => {
  const m = Object.entries(g.modes)
    .map(([k, v]) => `${k}:d${v.difficulty}/t${v.time}/s${v.skill}`)
    .join(' ');
  return `${g.id}\t${g.name}\t${m}\ttypes=${Object.keys(g.types).join(',')}\tsubtypes=${Object.keys(g.subtypes).join(',')}`;
});
fs.writeFileSync(path.join(OUT, 'goals.tsv'), lines.join('\n'));

console.log(JSON.stringify(report.modes && Object.fromEntries(Object.entries(report.modes).map(([k, v]) => [k, { total: v.total, extraKeys: v.extraKeys }])), null, 2));
console.log('unique goals:', goals.length);
