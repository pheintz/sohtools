/*
 * Join everything into one dataset: out/dataset.json
 *   goals (269) x RBA recipes x intended-route prerequisites x the offset model.
 */
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, 'out');

const goals = JSON.parse(fs.readFileSync(path.join(OUT, 'goals-v10.6.json'), 'utf8'));
const offsets = JSON.parse(fs.readFileSync(path.join(OUT, 'rba-offsets.json'), 'utf8'));
const { RECIPES, TRADE_SEQUENCE_CONSTRAINT, CHILD_SEQUENCE_CONSTRAINT } = require('./rba_recipes');
const { GATES, ITEMS, SPAWN_WINDOWS } = require('./prerequisites');
const COMMUNITY = require('./community_locations');
const { SKULLS, SKULL_AREA_GROUPS, SKULL_DUNGEON_GROUPS, SOFT_SOIL_NOTE, HEART_PIECES, UNSOURCED, verifyCounts } = require('./collections');

/* Exit, do not merely set exitCode. This used to set `process.exitCode = 1` and then fall through
   to the writeFileSync below, so a failing check aborted the pipeline while still leaving a wrong
   dataset.json on disk — which any later step run on its own would happily consume. The README
   said this step "refuses to write a dataset when a check is failing"; now it does. */
const countProblems = verifyCounts();
if (countProblems.length) {
  console.error('collections.js count check FAILED:\n  ' + countProblems.join('\n  '));
  process.exit(1);
}

const byName = new Map(goals.map((g) => [g.name, g]));

// attach recipes to goals
for (const r of RECIPES) {
  const push = (name, relation, note) => {
    const g = byName.get(name);
    if (!g) return;
    (g.rba ??= { satisfiedBy: [], enabledBy: [], destroyedBy: [] });
    const bucket = { satisfies: 'satisfiedBy', enables: 'enabledBy', destroys: 'destroyedBy' }[relation];
    g.rba[bucket].push({
      recipe: r.key,
      cRight: r.cRight.name,
      offset: r.cRight.offsetHex,
      age: r.age,
      stage: r.stage ?? null,
      note: note ?? null,
    });
  };
  for (const n of r.satisfies || []) push(n, 'satisfies', (r.satisfiesNotes || {})[n]);
  for (const n of r.enables || []) push(n, 'enables', (r.enablesNotes || {})[n]);
  for (const n of r.destroys || []) push(n, 'destroys');
}

// attach intended-route info
for (const g of goals) {
  const direct = ITEMS[g.name];
  if (direct) g.intendedRoute = direct;
  const window = SPAWN_WINDOWS[g.name];
  if (window) g.spawnWindow = window;
}

const dataset = {
  meta: {
    generated: new Date().toISOString().slice(0, 10),
    bingoVersion: 'v10.6',
    sources: {
      goalList: 'C:/Users/lloyd/source/repos/bingo/versions/v10/v10.6/goal-list.js',
      generator: 'C:/Users/lloyd/source/repos/bingo/versions/v10/v10.6/generator.js',
      itemTracker: 'C:/Users/lloyd/source/repos/bingo/lib/item-tracker/trackerData.js',
      decomp: 'E:/oot',
      community: 'zeldaspeedruns.com/oot/ba/*, github.com/ootbingo/oot-bingo-generator/doc/BALANCING.md',
    },
    counts: {
      goals: goals.length,
      goalsWithRbaLink: goals.filter((g) => g.rba).length,
      goalsWithIntendedRoute: goals.filter((g) => g.intendedRoute).length,
      goalsWithSpawnWindow: goals.filter((g) => g.spawnWindow).length,
      recipes: RECIPES.length,
      goldSkulltulasMapped: SKULLS.length,
      offsetRows: offsets.rows.length,
      reachableOffsets: offsets.rows.filter((r) => r.reachable).length,
    },
  },
  mechanic: {
    name: 'Reverse Bottle Adventure',
    statement:
      'With a bottle on B, Inventory_UpdateBottleItem is called with button == 0, so cButtonSlots[-1] reads ' +
      'ItemEquips+0x03 == buttonItems[3] — the ITEM ID on C-Right. That id is used as a raw byte offset into ' +
      'Inventory, and the new bottle-content id is written there.',
    writableValues: offsets.modifiers,
    addresses: offsets.addresses,
  },
  gates: GATES,
  spawnWindows: SPAWN_WINDOWS,
  adultTradeSequence: TRADE_SEQUENCE_CONSTRAINT,
  childMaskSequence: CHILD_SEQUENCE_CONSTRAINT,
  recipes: RECIPES,
  collections: {
    skulls: SKULLS,
    skullAreaGroups: SKULL_AREA_GROUPS,
    skullDungeonGroups: SKULL_DUNGEON_GROUPS,
    softSoilNote: SOFT_SOIL_NOTE,
    heartPieces: HEART_PIECES,
    unsourced: UNSOURCED,
  },
  /* Kept as its own top-level key rather than folded into `collections` — this is community
     knowledge, not decomp- or repo-derived, and the split should stay visible to a consumer. */
  community: {
    provenance: COMMUNITY.PROVENANCE,
    silverRupeeRooms: COMMUNITY.SILVER_RUPEE_ROOMS,
    goldRupeeChests: COMMUNITY.GOLD_RUPEE_CHESTS,
    stalfos: COMMUNITY.STALFOS,
    beanPatches: COMMUNITY.BEAN_PATCHES,
    scarecrowSpots: COMMUNITY.SCARECROW_SPOTS,
    heartPieceCosts: COMMUNITY.HEART_PIECE_COSTS,
  },
  offsets: offsets.rows,
  goals,
};

fs.writeFileSync(path.join(OUT, 'dataset.json'), JSON.stringify(dataset, null, 1));

// coverage report
const linked = goals.filter((g) => g.rba);
const lines = [];
lines.push('RBA <-> GOAL COVERAGE (v10.6)');
lines.push('='.repeat(80));
for (const kind of ['satisfiedBy', 'enabledBy', 'destroyedBy']) {
  const set = linked.filter((g) => g.rba[kind].length);
  lines.push(`\n### ${kind} (${set.length} goals)`);
  for (const g of set.sort((a, b) => a.name.localeCompare(b.name))) {
    for (const e of g.rba[kind]) {
      lines.push(`  ${g.name.padEnd(42)} <- ${e.recipe} [C-Right ${e.cRight} ${e.offset}, ${e.age}]${e.note ? `  — ${e.note}` : ''}`);
    }
  }
}
fs.writeFileSync(path.join(OUT, 'rba-goal-coverage.txt'), lines.join('\n'));

console.log(JSON.stringify(dataset.meta.counts, null, 1));
