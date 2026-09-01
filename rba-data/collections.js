/*
 * Collection-goal location data for OoT Bingo v10.6.
 *
 * GOLD SKULLTULAS: the complete 100-token list, transcribed from
 * zeldaspeedruns.com/oot/generalknowledge/gold-skulltulas-locations-and-methods (updated 2026-07-26).
 * The per-area totals below sum to exactly 100 and every bingo skulltula goal's stated count is
 * reproduced by the area groupings in SKULL_AREA_GROUPS, see `verifyCounts()` at the bottom, which
 * the build runs as an assertion.
 *
 * age: 'child' | 'adult' | 'both'
 */

const SKULLS = [
  // --- Bottom of the Well (3)
  { area: 'Bottom of the Well', name: 'Room with invisible floors', age: 'child', req: 'Small Key, Boomerang or Hovering' },
  { area: 'Bottom of the Well', name: 'Room with Deku Baba', age: 'child', req: 'Small Key, Boomerang or Hovering' },
  { area: 'Bottom of the Well', name: 'In the Like Like cage', age: 'child', req: "Small Key OR explosive OR Zelda's Lullaby" },
  // --- Death Mountain Crater (2)
  { area: 'Death Mountain Crater', name: 'Soil patch', age: 'child', req: 'Bugs', softSoil: true },
  { area: 'Death Mountain Crater', name: 'Crate at top', age: 'child', req: 'None' },
  // --- Death Mountain Trail (4)
  { area: 'Death Mountain Trail', name: 'Behind soft rock wall', age: 'both', req: 'Explosive or clip' },
  { area: 'Death Mountain Trail', name: "Soft soil patch outside Dodongo's Cavern", age: 'child', req: 'Bugs (practically an explosive)', softSoil: true },
  { area: 'Death Mountain Trail', name: 'Rockslide area', age: 'adult', req: 'None' },
  { area: 'Death Mountain Trail', name: "Bomb flower area above Dodongo's Cavern", age: 'adult', req: 'Hookshot OR Hammer OR Hover Boots OR Bombs' },
  // --- Deku Tree (4)
  { area: 'Deku Tree', name: 'Compass room', age: 'both', req: 'None' },
  { area: 'Deku Tree', name: 'Basement near switch (vines)', age: 'both', req: 'None' },
  { area: 'Deku Tree', name: 'Basement near switch (gate)', age: 'both', req: 'None' },
  { area: 'Deku Tree', name: 'Back room behind bombable wall', age: 'both', req: 'Explosive' },
  // --- Desert Colossus (3)
  { area: 'Desert Colossus', name: 'Soil near Spirit entrance', age: 'child', req: 'Bugs', softSoil: true },
  { area: 'Desert Colossus', name: 'On top of rock', age: 'adult', req: 'Magic Bean OR Hookshot OR hovering; night' },
  { area: 'Desert Colossus', name: 'Up a palm tree', age: 'adult', req: 'Hookshot or hovering; night' },
  // --- Dodongo's Cavern (5)
  { area: "Dodongo's Cavern", name: 'Vines above staircase', age: 'both', req: 'None' },
  { area: "Dodongo's Cavern", name: 'Alcove above staircase', age: 'both', req: 'Boomerang/Hookshot OR hovering' },
  { area: "Dodongo's Cavern", name: 'Baby Dodongo corridor (armos)', age: 'both', req: 'None' },
  { area: "Dodongo's Cavern", name: 'Baby Dodongo corridor (bombable wall)', age: 'both', req: 'Explosive' },
  { area: "Dodongo's Cavern", name: 'Room behind the head', age: 'both', req: 'Explosive' },
  // --- Fire Temple (5)
  { area: 'Fire Temple', name: 'Above Song of Time block', age: 'adult', req: 'Song of Time or hovering' },
  { area: 'Fire Temple', name: 'Spinning tiles room', age: 'adult', req: 'Hammer OR a source of damage' },
  { area: 'Fire Temple', name: 'Boulder maze', age: 'adult', req: 'Explosive' },
  { area: 'Fire Temple', name: 'Near the top of a tower', age: 'adult', req: 'Scarecrow Song + Hookshot OR extensive hovering' },
  { area: 'Fire Temple', name: 'Top of the tower', age: 'adult', req: 'Scarecrow Song + Hookshot OR extensive hovering' },
  // --- Forest Temple (5)
  { area: 'Forest Temple', name: 'First room', age: 'adult', req: 'None' },
  { area: 'Forest Temple', name: 'Main room', age: 'adult', req: 'None' },
  { area: 'Forest Temple', name: 'Right courtyard', age: 'adult', req: 'None (hookshot from the bottom)' },
  { area: 'Forest Temple', name: 'Left courtyard', age: 'adult', req: 'Hookshot' },
  { area: 'Forest Temple', name: 'Basement', age: 'adult', req: 'Bottled catchable item OR beat the four Poes OR extensive hovering' },
  // --- Ganon's Tower / Outside Ganon's Castle (1)
  { area: "Ganon's Tower", name: 'Stone arch', age: 'adult', req: 'None' },
  // --- Gerudo Fortress (2)
  { area: 'Gerudo Fortress', name: 'Back wall', age: 'adult', req: 'Night' },
  { area: 'Gerudo Fortress', name: 'Far end of horseback archery', age: 'adult', req: 'Hookshot OR extensive hovering; night' },
  // --- Gerudo Valley (4)
  { area: 'Gerudo Valley', name: 'Near wooden bridge', age: 'child', req: 'Boomerang or hovering; night' },
  { area: 'Gerudo Valley', name: 'Soil on lowest ledge near river', age: 'child', req: 'Bugs', softSoil: true },
  { area: 'Gerudo Valley', name: "Behind the carpenters' tent", age: 'adult', req: 'Hookshot or hovering; night' },
  { area: 'Gerudo Valley', name: 'On stone pillar near large rocks', age: 'adult', req: 'Hookshot or hovering; night' },
  // --- Goron City (2)
  { area: 'Goron City', name: 'Back of central upper platform', age: 'adult', req: 'None' },
  { area: 'Goron City', name: 'Room of rocks', age: 'child', req: 'Explosives' },
  // --- Graveyard (2)
  { area: 'Graveyard', name: "Wall behind Dampé's house", age: 'child', req: 'Boomerang OR extensive hovering; dark' },
  { area: 'Graveyard', name: 'Soft soil in graveyard', age: 'child', req: 'Bugs', softSoil: true },
  // --- Haunted Wasteland (1)
  { area: 'Haunted Wasteland', name: 'Building in the centre', age: 'both', req: 'None' },
  // --- Hyrule Castle Area (3)
  { area: 'Hyrule Castle Area', name: 'Room with all the pots (guard house)', age: 'child', req: 'None' },
  { area: 'Hyrule Castle Area', name: 'First tree', age: 'child', req: 'None' },
  { area: 'Hyrule Castle Area', name: 'Grotto in corner by tree, near Talon', age: 'child', req: 'Song of Storms + explosive' },
  // --- Hyrule Field (2)
  { area: 'Hyrule Field', name: 'Tree grotto left of the Kakariko bridge', age: 'both', req: 'Explosive' },
  { area: 'Hyrule Field', name: 'Rock circle near Gerudo Valley', age: 'both', req: "Explosive, Din's Fire OR Fire Arrow, Hammer as adult, then Boomerang/Hookshot OR hovering" },
  // --- Ice Cavern (3)
  { area: 'Ice Cavern', name: 'Spinning blades room', age: 'adult', req: 'Hookshot or hovering' },
  { area: 'Ice Cavern', name: 'Sliding block room', age: 'adult', req: 'Hookshot or hovering; clip or Blue Fire the red ice' },
  { area: 'Ice Cavern', name: 'Compass room', age: 'adult', req: 'Hookshot or hovering; clip or Blue Fire the red ice' },
  // --- Jabu Jabu's Belly (4)
  { area: "Jabu Jabu's Belly", name: 'Basement room with rising water', age: 'child', req: 'None' },
  { area: "Jabu Jabu's Belly", name: 'Room with holes in the floor (1)', age: 'child', req: 'Boomerang' },
  { area: "Jabu Jabu's Belly", name: 'Room with holes in the floor (2)', age: 'child', req: 'Boomerang' },
  { area: "Jabu Jabu's Belly", name: 'Outside the boss room', age: 'child', req: 'None' },
  // --- Kakariko Village (6)
  { area: 'Kakariko Village', name: 'House of Skulltula', age: 'child', req: 'Night' },
  { area: 'Kakariko Village', name: 'Tree in centre of town', age: 'child', req: 'Night' },
  { area: 'Kakariko Village', name: 'The unfinished building', age: 'child', req: 'Night' },
  { area: 'Kakariko Village', name: 'Near the adult bazaar, next to pots', age: 'child', req: 'Night' },
  { area: 'Kakariko Village', name: 'Ladder of the lookout tower', age: 'child', req: 'Night' },
  { area: 'Kakariko Village', name: "Roof of Impa's house", age: 'adult', req: 'Hookshot or hovering; night' },
  // --- Kokiri Forest (3)
  { area: 'Kokiri Forest', name: "Know-It-All Brothers' house", age: 'child', req: 'Dark' },
  { area: 'Kokiri Forest', name: 'Soft soil near shop', age: 'child', req: 'Bugs', softSoil: true },
  { area: 'Kokiri Forest', name: "The Twins' house", age: 'adult', req: 'Hookshot or hovering; dark' },
  // --- Lake Hylia (5)
  { area: 'Lake Hylia', name: 'Fire Arrow island', age: 'child', req: 'Dark' },
  { area: 'Lake Hylia', name: 'Soft soil patch', age: 'child', req: 'Bugs', softSoil: true },
  { area: 'Lake Hylia', name: 'Back of the Lakeside Laboratory', age: 'child', req: 'Dark' },
  { area: 'Lake Hylia', name: 'Inside the laboratory', age: 'adult', req: 'Iron Boots and Hookshot' },
  { area: 'Lake Hylia', name: 'Tree above Water Temple entrance', age: 'adult', req: 'Longshot OR extensive hovering; dark' },
  // --- Lon Lon Ranch (4)
  { area: 'Lon Lon Ranch', name: "Outside of Talon's house", age: 'child', req: 'Boomerang OR extensive hovering; night' },
  { area: 'Lon Lon Ranch', name: 'The tree', age: 'child', req: 'Night' },
  { area: 'Lon Lon Ranch', name: 'Back of the ranch', age: 'child', req: 'Night' },
  { area: 'Lon Lon Ranch', name: 'Building towards the back of the ranch', age: 'child', req: 'Boomerang OR extensive hovering; night' },
  // --- Lost Woods (3)
  { area: 'Lost Woods', name: 'Soft soil patch near Deku Scrubs', age: 'child', req: 'Bugs', softSoil: true },
  { area: 'Lost Woods', name: 'Soft soil near Lost Woods bridge', age: 'child', req: 'Bugs', softSoil: true },
  { area: 'Lost Woods', name: 'Near Forest Stage', age: 'adult', req: 'Hookshot + Bombchu OR planted bean OR hovering; dark' },
  // --- Sacred Forest Meadow (1)
  { area: 'Sacred Forest Meadow', name: 'On right wall', age: 'adult', req: 'Hookshot or hovering; dark' },
  // --- Shadow Temple (5)
  { area: 'Shadow Temple', name: 'Room with invisible spinning blades', age: 'adult', req: 'None' },
  { area: 'Shadow Temple', name: 'Falling spikes room', age: 'adult', req: 'None' },
  { area: 'Shadow Temple', name: 'Room with single blue-flamed skull', age: 'adult', req: 'None' },
  { area: 'Shadow Temple', name: 'Ship room', age: 'adult', req: 'Scarecrow Song + (strength & Hookshot | Longshot | Hover Boots+Bombs+shield) OR extensive hovering' },
  { area: 'Shadow Temple', name: 'Blue spinning skulls room', age: 'adult', req: 'None' },
  // --- Spirit Temple (5)
  { area: 'Spirit Temple', name: 'Room before child Iron Knuckle', age: 'both', req: 'Boomerang/Hookshot OR extensive hovering' },
  { area: 'Spirit Temple', name: 'Child side after tunnel', age: 'both', req: 'Nothing as child; Hover Boots + bombs as adult' },
  { area: 'Spirit Temple', name: 'Near Chu chest', age: 'both', req: 'None' },
  { area: 'Spirit Temple', name: 'Main statue room', age: 'both', req: 'Hookshot OR hovering OR Hover Boots OR Longshot' },
  { area: 'Spirit Temple', name: 'Boulder room', age: 'adult', req: 'Song of Time' },
  // --- Water Temple (5)
  { area: 'Water Temple', name: 'Behind gate with four pots', age: 'adult', req: 'Hookshot or explosive' },
  { area: 'Water Temple', name: 'Room with all the moving platforms', age: 'adult', req: 'Longshot OR ISG + Hookshot' },
  { area: 'Water Temple', name: 'Waterfall with rocks room', age: 'adult', req: 'None' },
  { area: 'Water Temple', name: 'Vortex room after Longshot', age: 'adult', req: 'Song of Time, Iron Boots, Longshot' },
  { area: 'Water Temple', name: 'Inside the main pillar', age: 'adult', req: 'Longshot' },
  // --- Zora's Domain (1)
  { area: "Zora's Domain", name: 'Top of waterfall', age: 'adult', req: "Explosive OR Zelda's Lullaby OR Hover Boots to enter; night" },
  // --- Zora's Fountain (3)
  { area: "Zora's Fountain", name: 'Island with lone tree', age: 'child', req: 'None' },
  { area: "Zora's Fountain", name: 'Giant log', age: 'child', req: 'Boomerang or hovering; night' },
  { area: "Zora's Fountain", name: 'Large hidden alcove', age: 'adult', req: 'Silver Gauntlets or greater, hovering, or Weird Shot' },
  // --- Zora's River (4)
  { area: "Zora's River", name: 'Tree near entrance', age: 'child', req: 'None' },
  { area: "Zora's River", name: 'Ladder near top', age: 'child', req: 'Night' },
  { area: "Zora's River", name: 'Area with two grottos', age: 'adult', req: 'Hookshot or hovering; night' },
  { area: "Zora's River", name: 'Above the bridge', age: 'adult', req: 'Hookshot OR extensive hovering; night' },
];

/*
 * How bingo groups those areas. Every entry's `expect` was checked against the count stated in the
 * goal name; `verifyCounts()` fails the build if a group stops matching.
 */
const SKULL_AREA_GROUPS = {
  'Kokiri Forest area': { areas: ['Kokiri Forest'], expect: 3, childExpect: 2 },
  'Lost Woods area': { areas: ['Lost Woods', 'Sacred Forest Meadow'], expect: 4, childExpect: 2 },
  'Market area': {
    areas: ['Hyrule Castle Area', "Ganon's Tower"], expect: 4,
    note: "3 child-era Castle-grounds tokens plus the adult-era Outside Ganon's Castle token. Needing both eras is why this goal carries child2:5.",
  },
  'Hyrule Field area': { areas: ['Hyrule Field'], expect: 2 },
  'Lon Lon Ranch area': { areas: ['Lon Lon Ranch'], expect: 4 },
  'Kakariko area': { areas: ['Kakariko Village', 'Graveyard'], expect: 8, childExpect: 7 },
  'Death Mountain area': { areas: ['Death Mountain Trail', 'Death Mountain Crater', 'Goron City'], expect: 8, childExpect: 5 },
  "Zora's Domain area": { areas: ["Zora's Domain", "Zora's Fountain", "Zora's River"], expect: 8, childExpect: 4, adultExpect: 4 },
  'Lake Hylia area': { areas: ['Lake Hylia'], expect: 5, childExpect: 3 },
  'Gerudo Valley area': { areas: ['Gerudo Valley'], expect: 4, childExpect: 2 },
  "Gerudo's Fortress area": { areas: ['Gerudo Fortress'], expect: 2 },
  'Wasteland/ Colossus area': { areas: ['Haunted Wasteland', 'Desert Colossus'], expect: 4, childExpect: 2 },
};

const SKULL_DUNGEON_GROUPS = {
  'Deku Tree': { expect: 4 }, "Dodongo's Cavern": { expect: 5 }, 'Jabu-Jabu': { area: "Jabu Jabu's Belly", expect: 4 },
  'Forest Temple': { expect: 5 }, 'Fire Temple': { expect: 5 }, 'Water Temple': { expect: 5 },
  'Spirit Temple': { expect: 5 }, 'Shadow Temple': { expect: 5 },
  'Bottom of the Well': { expect: 3 }, 'Ice Cavern': { expect: 3 },
};

const SOFT_SOIL_NOTE =
  'The 9 soft-soil (bug) tokens are: Death Mountain Crater, Death Mountain Trail (outside DC), ' +
  'Desert Colossus, Gerudo Valley, Graveyard, Kokiri Forest, Lake Hylia, Lost Woods (Deku Scrubs), ' +
  'Lost Woods (bridge). All are child-only and all need bugs in a bottle. Bingo goals: ' +
  '"5 / 7 Different Soft Soil Skulltulas" and "All 9 Soft Soil Skulltulas".';

/*
 * NAMED heart-piece goals. The "Obtain N Different Heart Pieces" goals accept any N, so they need no
 * location list; these are the ones that name a specific piece or area.
 */
const HEART_PIECES = {
  '2 Different Lake Hylia HPs': { area: 'Lake Hylia', note: 'Lake Hylia has more than two pieces; any two count.' },
  '5 Zora area HPs': { area: "Zora's River / Domain / Fountain", note: 'Spans the whole Zora chain.' },
  'Both Gerudo Valley HPs': { area: 'Gerudo Valley', count: 2 },
  'Both Hyrule Field HPs': { area: 'Hyrule Field', count: 2 },
  'Both HPs in Death Mountain Crater': { area: 'Death Mountain Crater', count: 2 },
  "Both Zora's Fountain HPs": { area: "Zora's Fountain", count: 2 },
  'Desert Colossus HP': { area: 'Desert Colossus', count: 1 },
  "Frog's HP": { area: "Zora's River", count: 1, note: "The frog choir reward; needs the Song of Storms and the frogs' song sequence." },
  'Ice Cavern HP': { area: 'Ice Cavern', count: 1 },
  'Lon Lon Ranch HP': { area: 'Lon Lon Ranch', count: 1, note: 'Bingo splits Lon Lon into llrday / llrnight / llrboth synergies; this piece is reachable in either.' },
  'Lost Dog HP': { area: 'Kakariko Village', count: 1, note: 'Return Richard the dog at night.' },
  '37th Heart Piece (Child Fortress)': { area: "Gerudo's Fortress", count: 1, note: 'The child-era Gerudo Fortress piece, the one that pushes a 100% file past 36.' },
};

/*
 * NOT YET SOURCED. These need a verified list before they go in the dataset; the counts below come
 * from the goal names themselves, which is all that is currently certain.
 */
/*
 * Silver rupee rooms and gold rupee chests used to live here as the two biggest gaps. Both are now
 * enumerated in `community_locations.js` and cross-checked by `validate_community.js`.
 *
 * Worth keeping in mind that the guesses recorded here were partly WRONG, which is why they moved
 * to a sourced list rather than being promoted in place:
 *   - silver rupees were listed as existing in Dodongo's Cavern. They do not.
 *   - the gold rupee set had "DMC Song of Time block" as one of the six. It is Fire Temple after
 *     the elevator, and the one that could not be confirmed is Dead Hand's room in the Bottom of
 *     the Well, which the recorded `ganonchu` reasoning had in fact pointed at.
 */
const UNSOURCED = {
  smallKeys: {
    goals: ['1 Unused Small Key in each Adult Dungeon', '2/3/4/5 Unused Keys in Gerudo Training Grounds', '6/7/8 Different Unused Keys in Gerudo Training Grounds', '4 Unused Keys in Forest Temple', 'Obtain all 5 Small Keys in Forest Temple', 'Obtain all 5 Small Keys in Shadow Temple', 'Obtain all 8 Small Keys in Fire Temple'],
    note: 'Totals per dungeon are fixed (Forest 5, Fire 8, Water 6, Spirit 5, Shadow 5, BotW 3, GTG 9, Ganon\'s Castle 2, Thieves\' Hideout 4). Only the Water Temple count is RBA-writable (Bomb Bag (20) on C-Right); the GTG and Forest Temple goals are legit-only.',
    openQuestion: 'What "Different" adds in "N Different Unused Keys in Gerudo Training Grounds" versus the plain "N Unused Keys" form. No rules text found.',
  },
};

function verifyCounts() {
  const problems = [];
  const inArea = (a) => SKULLS.filter((s) => s.area === a);
  for (const [label, g] of Object.entries(SKULL_AREA_GROUPS)) {
    const set = g.areas.flatMap(inArea);
    if (set.length !== g.expect) problems.push(`${label}: ${set.length} tokens, goal says ${g.expect}`);
    if (g.childExpect !== undefined) {
      const c = set.filter((s) => s.age === 'child' || s.age === 'both').length;
      if (c !== g.childExpect) problems.push(`${label} (child): ${c}, goal says ${g.childExpect}`);
    }
    if (g.adultExpect !== undefined) {
      const a = set.filter((s) => s.age === 'adult' || s.age === 'both').length;
      if (a !== g.adultExpect) problems.push(`${label} (adult): ${a}, goal says ${g.adultExpect}`);
    }
  }
  for (const [label, g] of Object.entries(SKULL_DUNGEON_GROUPS)) {
    const set = inArea(g.area || label);
    if (set.length !== g.expect) problems.push(`${label}: ${set.length}, goal says ${g.expect}`);
  }
  const soil = SKULLS.filter((s) => s.softSoil).length;
  if (soil !== 9) problems.push(`soft soil: ${soil}, expected 9`);
  if (SKULLS.length !== 100) problems.push(`total skulls: ${SKULLS.length}, expected 100`);
  return problems;
}

module.exports = { SKULLS, SKULL_AREA_GROUPS, SKULL_DUNGEON_GROUPS, SOFT_SOIL_NOTE, HEART_PIECES, UNSOURCED, verifyCounts };

if (require.main === module) {
  const fs = require('fs');
  const path = require('path');
  const OUT = path.join(__dirname, 'out');
  const problems = verifyCounts();
  console.log(`skulls: ${SKULLS.length}, soft soil: ${SKULLS.filter((s) => s.softSoil).length}`);

  /* Fail before writing, not after. This step is documented as asserting the skulltula counts and
     for a long time did not: it printed the mismatches and exited 0, leaving a wrong
     collections.json on disk for every later step to consume. A check that only prints is not a
     check. */
  if (problems.length) {
    console.error(`COUNT MISMATCHES (${problems.length}):\n  ${problems.join('\n  ')}`);
    process.exit(1);
  }

  fs.writeFileSync(
    path.join(OUT, 'collections.json'),
    JSON.stringify({ skulls: SKULLS, skullAreaGroups: SKULL_AREA_GROUPS, skullDungeonGroups: SKULL_DUNGEON_GROUPS, softSoilNote: SOFT_SOIL_NOTE, heartPieces: HEART_PIECES, unsourced: UNSOURCED }, null, 1),
  );
  console.log('all bingo skulltula counts reproduced');
}
