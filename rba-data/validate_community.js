/*
 * Cross-check the community location data against things this repo already knows.
 *
 * Community data cannot be regenerated from source, so the only defence against a bad line is
 * consistency with independent evidence. Two sources are available and neither was involved in
 * producing the lists:
 *
 *   1. bingo's own synergy categories. A goal that needs Shadow Temple carries `shadow`. So the set
 *      of AREAS a location list names should match the set of area categories the corresponding
 *      goals carry — and the counts should track how the synergy scales with the goal's number.
 *   2. collections.js, whose gold skulltula data was assembled separately and is already asserted.
 *
 * This is how the Dodongo's Cavern silver-rupee guess and the "DMC Song of Time" gold-rupee guess
 * were caught. Exit code 1 on a contradiction; softer observations are printed as notes.
 */
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, 'out');

const C = require('./community_locations');
const { SKULLS } = require('./collections');
const goals = JSON.parse(fs.readFileSync(path.join(OUT, 'goals-v10.6.json'), 'utf8'));

const problems = [];
const notes = [];

const byName = new Map(goals.map((g) => [g.name, g]));
/* Per MODE. Merging normal and short lets the short value overwrite the normal one, which made the
   spirit-scaling check read 4→6, 6→3.5 and report a contradiction that was not there. A goal is
   priced separately in each mode and the two are not comparable. */
const catsOf = (g, mode = 'normal') => {
  const out = {};
  for (const kind of ['types', 'subtypes']) Object.assign(out, (g.synergy[kind][mode] || {}));
  delete out.selfsynergy; delete out.endon;
  return out;
};
const numberIn = (name) => { const m = name.match(/\d+/); return m ? Number(m[0]) : null; };
const total = (a) => a.reduce((t, x) => t + (x.count || 1), 0);

/* ---------- 1. silver rupee rooms ---------- */
{
  const rooms = C.SILVER_RUPEE_ROOMS;
  const listed = new Set(rooms.map((r) => r.cat));
  const gs = goals.filter((g) => /Silver Rupee Rooms/.test(g.name));
  // the ganon trials are priced as aganon / bganon / cganon rather than one category
  const norm = (c) => (/^[abc]ganon$/.test(c) ? 'ganon' : c);
  const AREA_CATS = new Set(['shadow', 'ice', 'spirit', 'botw', 'gtg', 'ganon']);
  const fromGoals = new Set();
  for (const g of gs) for (const c of Object.keys(catsOf(g))) if (AREA_CATS.has(norm(c))) fromGoals.add(norm(c));

  for (const c of listed) if (!fromGoals.has(c)) problems.push(`silver rupees: list names area "${c}" but no Clear-N-Silver-Rupee-Rooms goal carries that synergy`);
  for (const c of fromGoals) if (!listed.has(c)) problems.push(`silver rupees: goals carry synergy "${c}" but the list has no room there`);
  for (const g of gs) {
    const n = numberIn(g.name);
    if (n !== null && n > rooms.length) problems.push(`silver rupees: "${g.name}" needs ${n} but only ${rooms.length} rooms exist`);
  }
  // spirit should scale with the goal's number — it is the area you dig deeper into for a bigger count
  const spiritBy = gs.map((g) => ({ n: numberIn(g.name), v: catsOf(g).spirit })).filter((x) => x.n && x.v !== undefined)
    .sort((a, b) => a.n - b.n);
  const monotone = spiritBy.every((x, i) => i === 0 || x.v >= spiritBy[i - 1].v);
  notes.push(`silver rupees: ${rooms.length} rooms across ${new Set(rooms.map((r) => r.area)).size} areas; ` +
    `spirit synergy ${monotone ? 'rises' : 'does NOT rise'} with the goal count (${spiritBy.map((x) => x.n + '→' + x.v).join(', ')})`);
  if (!monotone) problems.push('silver rupees: spirit synergy does not scale with the goal count, which contradicts three Spirit rooms');
}

/* ---------- 2. gold rupee chests ---------- */
{
  const chests = C.GOLD_RUPEE_CHESTS;
  const gs = goals.filter((g) => /Gold Rupee Chests/.test(g.name));
  const all6 = gs.find((g) => /All 6/.test(g.name));
  if (all6 && chests.length !== 6) problems.push(`gold rupees: "${all6.name}" implies 6 chests, list has ${chests.length}`);
  for (const g of gs) {
    const n = numberIn(g.name);
    if (n !== null && n > chests.length) problems.push(`gold rupees: "${g.name}" needs ${n} but only ${chests.length} chests exist`);
  }
  const cats = new Set(chests.map((c) => c.cat).filter(Boolean));
  const goalCats = new Set(gs.flatMap((g) => Object.keys(catsOf(g))));
  const corroborated = [...cats].filter((c) => goalCats.has(c));
  const uncorroborated = [...cats].filter((c) => !goalCats.has(c));
  notes.push(`gold rupees: ${corroborated.length}/${cats.size} chest areas corroborated by goal synergy (${corroborated.join(', ')})`);
  for (const c of uncorroborated) notes.push(`gold rupees: chest area "${c}" has no matching goal synergy — worth a second look`);
}

/* ---------- 3. stalfos ---------- */
{
  const n = total(C.STALFOS);
  const gs = goals.filter((g) => /Different Stalfos/.test(g.name));
  for (const g of gs) {
    const need = numberIn(g.name);
    if (need !== null && need > n) problems.push(`stalfos: "${g.name}" needs ${need} but only ${n} exist`);
  }
  const forest = C.STALFOS.filter((s) => s.area === 'Forest Temple').reduce((t, s) => t + s.count, 0);
  notes.push(`stalfos: ${n} individuals across ${C.STALFOS.length} rooms; ${forest} are in Forest Temple`);
  // jjump is an inferred category on the 7/10 goals and on Fairy Bow — the Bow Room holds 3 Stalfos
  const jj = gs.filter((g) => 'jjump' in catsOf(g)).map((g) => g.name);
  if (jj.length) notes.push(`stalfos: "jjump" (still inferred) sits on ${jj.join(', ')}; the Forest Temple Bow Room — where the Fairy Bow is — holds 3 of the 15`);
}

/* ---------- 4. bean patches vs the soft soil skulltulas ---------- */
{
  const patches = C.BEAN_PATCHES;
  const withSkull = patches.filter((p) => p.skulltula);
  const soil = SKULLS.filter((s) => s.softSoil);
  if (withSkull.length !== soil.length) {
    problems.push(`bean patches: ${withSkull.length} patches marked as having a skulltula, but collections.js has ${soil.length} soft-soil tokens`);
  }
  const areaCount = (arr, key) => arr.reduce((m, x) => (m[x[key]] = (m[x[key]] || 0) + 1, m), {});
  const a = areaCount(withSkull, 'area');
  const b = areaCount(soil, 'area');
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    if ((a[k] || 0) !== (b[k] || 0)) problems.push(`bean patches: area "${k}" has ${a[k] || 0} skulltula patches but collections.js has ${b[k] || 0}`);
  }
  for (const g of goals.filter((g) => /Plant \d+ Magic Beans/.test(g.name))) {
    const need = numberIn(g.name);
    if (need !== null && need > patches.length) problems.push(`bean patches: "${g.name}" needs ${need} but only ${patches.length} patches exist`);
  }
  const noSkull = patches.filter((p) => !p.skulltula).map((p) => p.area);
  notes.push(`bean patches: ${patches.length} patches, ${withSkull.length} with a skulltula — matching "All 9 Soft Soil Skulltulas". ` +
    `The odd one out is ${noSkull.join(', ')}, which is why the plant goals go higher than the skulltula goals.`);
}

/* ---------- 5. heart piece costs ---------- */
{
  const HPC = C.HEART_PIECE_COSTS;
  const unmapped = new Set();
  let mapped = 0;
  for (const mode of ['tq', 'notq']) {
    for (const e of HPC[mode]) {
      if (!e.mapsTo) { unmapped.add(e.label); continue; }
      mapped++;
      if (!byName.has(e.mapsTo)) problems.push(`heart piece costs: ${mode} "${e.label}" maps to "${e.mapsTo}", which is not a v10.6 goal`);
    }
  }
  /* The point of the two columns: what does committing to the trade quest cost per piece?
     Pairing is by label, with one explicit alias — the trade-quest column writes "cow HP sw" where
     the other writes "cow HP". What the "sw" qualifier means is not stated in the source, so it is
     recorded rather than interpreted. */
  const ALIAS = { 'cow HP sw': 'cow HP' };
  const idx = (arr) => arr.reduce((m, e) => (m[ALIAS[e.label] || e.label] = e, m), {});
  const A = idx(HPC.tq), B = idx(HPC.notq);
  const deltas = [];
  for (const k of Object.keys(A)) {
    if (!(k in B)) continue;
    const d = A[k].seconds - B[k].seconds;
    if (d !== 0) deltas.push({ label: k, tq: A[k].seconds, notq: B[k].seconds, delta: d });
  }
  deltas.sort((x, y) => x.delta - y.delta);
  notes.push(`heart piece costs: ${mapped} entries mapped to a goal, ${unmapped.size} labels unmapped (${[...unmapped].join(', ')})`);
  for (const d of deltas) {
    notes.push(`  trade quest ${d.delta < 0 ? 'SAVES' : 'COSTS'} ${Math.abs(d.delta)}s on "${d.label}" (${d.tq}s tq vs ${d.notq}s no-tq)`);
  }
  const onlyNoTq = HPC.notq.filter((e) => !(e.label in A)).map((e) => e.label);
  if (onlyNoTq.length) notes.push(`  routes priced only without the trade quest: ${onlyNoTq.join('; ')}`);
}

/* ---------- report ---------- */
let txt = 'COMMUNITY DATA CROSS-CHECK\n' + '='.repeat(74) + '\n\n';
txt += `source     : ${C.PROVENANCE.source}\nconfidence : ${C.PROVENANCE.confidence}\n\n`;
txt += C.PROVENANCE.caveat + '\n\n' + '='.repeat(74) + '\n';
txt += problems.length
  ? `\nCONTRADICTIONS (${problems.length}):\n  ` + problems.join('\n  ') + '\n'
  : '\nNo contradiction between the community lists, bingo\'s synergy data and collections.js.\n';
txt += `\nObservations (${notes.length}):\n  ` + notes.join('\n  ') + '\n';

fs.writeFileSync(path.join(OUT, 'community-validation.txt'), txt);
console.log(txt.trim());
if (problems.length) process.exit(1);
