// Enumerate every synergy type / subtype / rowtype used in v10.6 and which goals use them.
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, 'out');
const goals = JSON.parse(fs.readFileSync(path.join(OUT, 'goals.json'), 'utf8'));

const buckets = { types: new Map(), subtypes: new Map(), rowtypes: new Map() };

for (const g of goals) {
  for (const kind of ['types', 'subtypes', 'rowtypes']) {
    for (const mode of ['normal', 'short']) {
      const m = g[`${kind}_${mode}`] || {};
      for (const [k, v] of Object.entries(m)) {
        if (!buckets[kind].has(k)) buckets[kind].set(k, []);
        buckets[kind].get(k).push({ goal: g.name, mode, value: v });
      }
    }
  }
}

let outTxt = '';
for (const kind of ['types', 'subtypes', 'rowtypes']) {
  outTxt += `\n########## ${kind.toUpperCase()} (${buckets[kind].size}) ##########\n`;
  const sorted = [...buckets[kind].entries()].sort((a, b) => a[0].localeCompare(b[0]));
  for (const [k, uses] of sorted) {
    const names = [...new Set(uses.map((u) => u.goal))];
    outTxt += `\n=== ${k}  (${names.length} goals)\n`;
    for (const n of names) {
      const vals = [...new Set(uses.filter((u) => u.goal === n).map((u) => u.value))].join('/');
      outTxt += `    ${n}  [${vals}]\n`;
    }
  }
}
fs.writeFileSync(path.join(OUT, 'synergy-categories.txt'), outTxt);

const summary = {};
for (const kind of ['types', 'subtypes', 'rowtypes']) {
  summary[kind] = [...buckets[kind].entries()]
    .map(([k, v]) => [k, new Set(v.map((x) => x.goal)).size])
    .sort((a, b) => b[1] - a[1]);
}
fs.writeFileSync(path.join(OUT, 'synergy-summary.json'), JSON.stringify(summary, null, 1));
console.log('types:', buckets.types.size, 'subtypes:', buckets.subtypes.size, 'rowtypes:', buckets.rowtypes.size);
console.log('\nTYPES:', summary.types.map(([k, n]) => `${k}(${n})`).join(' '));
console.log('\nSUBTYPES:', summary.subtypes.map(([k, n]) => `${k}(${n})`).join(' '));
console.log('\nROWTYPES:', summary.rowtypes.map(([k, n]) => `${k}(${n})`).join(' '));
