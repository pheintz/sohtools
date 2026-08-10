/*
 * Synergy-aware conflict matrix.
 *
 * For every ordered goal pair (A, B) where some RBA recipe both routes A and destroys B, ask what
 * bingo's own synergy data says about that pair. Three outcomes:
 *
 *   CONFIRMED  bingo already prices the pair negatively (shared category with a negative value on
 *              one side, or a shared 100-value exclusion type)
 *   UNPRICED   the RBA model says they fight but bingo gives them no negative signal at all
 *   POSITIVE   bingo actually gives the pair *positive* synergy — worth a look either way
 *
 * The point is not that bingo is wrong. Most UNPRICED pairs will be cases where the RBA route is
 * simply not the fast way to do that goal, so there is nothing to price. The interesting rows are
 * the ones where the RBA route IS standard.
 */
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, 'out');

const goals = JSON.parse(fs.readFileSync(path.join(OUT, 'goals-v10.6.json'), 'utf8'));
const { RECIPES } = require('./rba_recipes');
const byName = new Map(goals.map((g) => [g.name, g]));

// --- how bingo prices a pair -------------------------------------------------
// selfsynergy and endon are bookkeeping columns carried by every goal; they say nothing about a pair.
const STRUCTURAL = new Set(['selfsynergy', 'endon']);

function mergedCats(g, mode) {
  const out = {};
  for (const kind of ['types', 'subtypes']) {
    const m = g.synergy[kind][mode] || {};
    for (const [k, v] of Object.entries(m)) {
      if (STRUCTURAL.has(k)) continue;
      (out[k] ??= []).push({ kind, v });
    }
  }
  return out;
}

function priceOfPair(a, b) {
  const signals = [];
  for (const mode of ['normal', 'short']) {
    if (!a.modes[mode] || !b.modes[mode]) continue;
    const A = mergedCats(a, mode);
    const B = mergedCats(b, mode);
    for (const cat of Object.keys(A)) {
      if (!(cat in B)) continue;
      const av = A[cat];
      const bv = B[cat];
      // exclusion: both sides carry a type of 100
      const aExcl = av.some((x) => x.kind === 'types' && x.v === 100);
      const bExcl = bv.some((x) => x.kind === 'types' && x.v === 100);
      if (aExcl && bExcl) { signals.push({ mode, cat, kind: 'EXCLUSION', detail: 'both carry a type of 100' }); continue; }
      // the default merge drops the highest value, so a subtype only fires against a matching type
      const aType = av.find((x) => x.kind === 'types');
      const bType = bv.find((x) => x.kind === 'types');
      const aSub = av.find((x) => x.kind === 'subtypes');
      const bSub = bv.find((x) => x.kind === 'subtypes');
      const fires = [];
      if (aType && bSub) fires.push({ owner: a.name, value: bSub.v });
      if (bType && aSub) fires.push({ owner: b.name, value: aSub.v });
      if (aType && bType) fires.push({ owner: 'both types', value: Math.min(aType.v, bType.v) });
      for (const f of fires) {
        signals.push({ mode, cat, kind: f.value < 0 ? 'NEGATIVE' : f.value > 0 ? 'POSITIVE' : 'NEUTRAL', value: f.value, activatedBy: f.owner });
      }
    }
  }
  return signals;
}

// --- RBA-implied conflicts ---------------------------------------------------
const rows = [];
for (const r of RECIPES) {
  const routed = [...(r.satisfies || []), ...(r.enables || [])];
  const wrecked = r.destroys || [];
  for (const aName of routed) {
    for (const bName of wrecked) {
      if (aName === bName) continue; // e.g. Golden Scale: granted by one modifier, destroyed by others
      const a = byName.get(aName);
      const b = byName.get(bName);
      if (!a || !b) continue;
      const signals = priceOfPair(a, b);
      const neg = signals.filter((s) => s.kind === 'NEGATIVE' || s.kind === 'EXCLUSION');
      const pos = signals.filter((s) => s.kind === 'POSITIVE');
      rows.push({
        recipe: r.key,
        cRight: r.cRight.name,
        practicality: r.practicality || null,
        route: aName,
        breaks: bName,
        verdict: neg.length ? 'CONFIRMED' : pos.length ? 'POSITIVE' : 'UNPRICED',
        negativeSignals: neg,
        positiveSignals: pos,
      });
    }
  }
}

// same-recipe self-conflicts: a goal a recipe both routes and destroys (modifier-dependent)
const selfConflicts = [];
for (const r of RECIPES) {
  const routed = new Set([...(r.satisfies || []), ...(r.enables || [])]);
  for (const b of r.destroys || []) if (routed.has(b)) selfConflicts.push({ recipe: r.key, goal: b });
}

// trade-sequence conflicts: two recipes that need different adult trade stages
const stageOf = (r) => (r.stage && r.stage.sequence === 'adult trade' ? r.stage.position : null);
const staged = RECIPES.filter((r) => typeof stageOf(r) === 'number');
const stageConflicts = [];
for (let i = 0; i < staged.length; i++) {
  for (let j = i + 1; j < staged.length; j++) {
    const A = staged[i];
    const B = staged[j];
    for (const aName of [...(A.satisfies || []), ...(A.enables || [])]) {
      for (const bName of [...(B.satisfies || []), ...(B.enables || [])]) {
        if (aName === bName) continue;
        stageConflicts.push({
          goalA: aName, stageA: stageOf(A), recipeA: A.key,
          goalB: bName, stageB: stageOf(B), recipeB: B.key,
          note: 'both goals want an adult-trade RBA, at different stages — doable in one run only in stage order, and only if nothing in between is required',
        });
      }
    }
  }
}

const summary = {
  pairs: rows.length,
  theoreticalOnly: rows.filter((r) => r.practicality).length,
  confirmed: rows.filter((r) => r.verdict === 'CONFIRMED').length,
  unpriced: rows.filter((r) => r.verdict === 'UNPRICED').length,
  positive: rows.filter((r) => r.verdict === 'POSITIVE').length,
  selfConflicts: selfConflicts.length,
  stagePairs: stageConflicts.length,
};

fs.writeFileSync(path.join(OUT, 'conflicts.json'), JSON.stringify({ summary, rows, selfConflicts, stageConflicts }, null, 1));

let txt = 'RBA-IMPLIED GOAL CONFLICTS vs BINGO SYNERGY DATA (v10.6)\n' + '='.repeat(96) + '\n';
txt += JSON.stringify(summary, null, 1) + '\n';
for (const verdict of ['CONFIRMED', 'POSITIVE', 'UNPRICED']) {
  const set = rows.filter((r) => r.verdict === verdict);
  txt += `\n\n######## ${verdict} (${set.length})\n`;
  for (const r of set.sort((x, y) => x.route.localeCompare(y.route))) {
    txt += `\n  route "${r.route}" via ${r.recipe} (C-Right ${r.cRight})\n      breaks "${r.breaks}"\n`;
    if (r.practicality) txt += `      *** THEORETICAL ONLY: ${r.practicality.split('.')[0]}\n`;
    for (const s of [...r.negativeSignals, ...r.positiveSignals]) {
      txt += `      bingo: ${s.mode}.${s.cat} ${s.kind}${s.value !== undefined ? ` ${s.value}` : ''}${s.activatedBy ? ` (activated by ${s.activatedBy})` : ''}${s.detail ? ` — ${s.detail}` : ''}\n`;
    }
  }
}
txt += `\n\n######## MODIFIER-DEPENDENT SELF-CONFLICTS (${selfConflicts.length})\n`;
txt += 'A goal the same recipe can both grant and destroy, depending which bottle value you write.\n';
for (const s of selfConflicts) txt += `  ${s.recipe}: ${s.goal}\n`;
fs.writeFileSync(path.join(OUT, 'conflicts.txt'), txt);

console.log(JSON.stringify(summary, null, 1));
