/*
 * Community location and routing data (OoT Bingo Discord, relayed by the repo owner).
 *
 * Provenance matters here and is deliberately not blurred. Everything else in this project is
 * either derived from the decomp (`confidence: 'decomp'`) or from the bingo repo itself. This file
 * is neither: it is racer knowledge, unattributed and undated, and it cannot be regenerated from
 * source. It is kept in its own module so that stays obvious.
 *
 * What makes it trustworthy anyway is that most of it is CHECKABLE against data already here.
 * `validate_community.js` cross-references every list against bingo's own synergy categories and
 * goal counts, and against `collections.js`. Two of my earlier guesses died that way:
 *
 *   - I had listed Dodongo's Cavern as holding silver rupees. It holds none.
 *   - I had the sixth gold rupee chest as "DMC Song of Time block". It is Fire Temple after the
 *     elevator, and the missing one was Dead Hand's room in the Bottom of the Well.
 *
 * The BotW chest is a small vindication of a reasoned guess: open-questions.md had recorded that
 * the `ganonchu` anti-synergy on the gold rupee goals was "weak evidence that one of the six sits
 * somewhere a BotW trip covers".
 */

/* ---------------- silver rupee rooms ---------------- */
// Goals: Clear 4 / 6 / 8 / 9 / 10 Silver Rupee Rooms. 16 rooms, so even the 10-room goal has slack.
const SILVER_RUPEE_ROOMS = [
  { area: 'Shadow Temple', room: '1st Small Key Room', cat: 'shadow' },
  { area: 'Shadow Temple', room: 'Before Falling Spikes', cat: 'shadow' },
  { area: 'Shadow Temple', room: 'Before Urn Key', cat: 'shadow' },
  { area: 'Ice Cavern', room: 'Turning Guillotine', cat: 'ice' },
  { area: 'Ice Cavern', room: 'Block Puzzle Room', cat: 'ice' },
  { area: 'Spirit Temple', room: 'Adult Side Boulder Room', cat: 'spirit' },
  { area: 'Spirit Temple', room: 'Child Side first Small Key', cat: 'spirit' },
  { area: 'Spirit Temple', room: 'Child Side Sun Block Room', cat: 'spirit' },
  { area: 'Bottom of the Well', room: 'Basement', cat: 'botw' },
  { area: 'Gerudo Training Ground', room: 'Boulder maze', cat: 'gtg' },
  { area: 'Gerudo Training Ground', room: 'Lava Room', cat: 'gtg' },
  { area: 'Gerudo Training Ground', room: 'Under Water', cat: 'gtg' },
  { area: "Ganon's Castle", room: 'Spirit Trial', cat: 'ganon' },
  { area: "Ganon's Castle", room: 'Forest Trial', cat: 'ganon' },
  { area: "Ganon's Castle", room: 'Fire Trial', cat: 'ganon' },
  { area: "Ganon's Castle", room: 'Light Trial', cat: 'ganon' },
];

/* ---------------- gold rupee chests ---------------- */
// Goals: Open 3 / 5 / All 6 Gold Rupee Chests. Exactly six exist, so "All 6" is the whole set.
const GOLD_RUPEE_CHESTS = [
  { area: 'Bottom of the Well', where: "Dead Hand's Room", cat: 'botw' },
  { area: 'Kakariko Village', where: 'ReDead Grotto', cat: null, needs: 'explosive' },
  { area: 'Death Mountain Trail', where: 'Song of Storms Grotto', cat: 'storms', needs: 'Song of Storms' },
  { area: 'Goron City', where: 'Boulder Maze', cat: 'strength', needs: 'strength' },
  { area: 'Gerudo Training Ground', where: 'Like-Like Room', cat: 'gtg' },
  { area: 'Fire Temple', where: 'After the elevator', cat: 'fire' },
];

/* ---------------- stalfos ---------------- */
// Goals: Defeat 3 / 7 / 10 Different Stalfos. 15 individuals across 8 rooms.
const STALFOS = [
  { area: 'Forest Temple', room: 'Stalfos Small Key Room', count: 2, cat: 'forest' },
  { area: 'Forest Temple', room: 'Bow Room', count: 3, cat: 'forest' },
  { area: 'Shadow Temple', room: 'Cavernous Room', count: 1, cat: 'shadow' },
  { area: 'Shadow Temple', room: 'Boat Ride', count: 2, cat: 'shadow' },
  { area: 'Gerudo Training Ground', room: 'Stalfos Room', count: 2, cat: 'gtg' },
  { area: 'Spirit Temple', room: 'Child Side Green Bubble Room', count: 1, cat: 'spirit' },
  { area: "Ganon's Tower", room: 'Boss Key Room', count: 2, cat: 'ganon' },
  { area: "Ganon's Tower", room: 'Collapse', count: 2, cat: 'ganon' },
];

/* ---------------- bean patches / soft soil ----------------
   Ten patches. Nine carry a gold skulltula; Zora's River is the one that does not — which is
   exactly why the bingo goal is "All 9 Soft Soil Skulltulas" while "Plant 7 Magic Beans" tops out
   below ten. collections.js already held the nine; the tenth was missing until now. */
const BEAN_PATCHES = [
  { area: 'Kokiri Forest', skulltula: true },
  { area: 'Lost Woods', note: 'near the Deku Scrubs', skulltula: true },
  { area: 'Lost Woods', note: 'near the bridge', skulltula: true },
  { area: 'Graveyard', skulltula: true },
  { area: 'Death Mountain Trail', note: 'outside Dodongo’s Cavern', skulltula: true },
  { area: 'Death Mountain Crater', skulltula: true },
  { area: 'Lake Hylia', skulltula: true },
  { area: 'Gerudo Valley', skulltula: true },
  { area: 'Desert Colossus', skulltula: true },
  { area: "Zora's River", skulltula: false, note: 'the only patch with no gold skulltula' },
];

/* ---------------- scarecrow (Pierre) spots ----------------
   Not tied to a goal directly — the rules only mention Scarecrow's Song to say it does not count
   toward "X Songs" — but Pierre spots are hookshot anchors, so they matter for reaching several
   heart pieces and skulltulas. */
const SCARECROW_SPOTS = [
  { area: 'Death Mountain Crater', count: 2 },
  { area: "Gerudo's Fortress", count: 1 },
  { area: 'Lake Hylia', count: 3 },
  { area: 'Sacred Forest Meadow', count: 1 },
  { area: "Zora's Fountain", count: 1 },
  { area: "Dodongo's Cavern", count: 1 },
  { area: 'Forest Temple', count: 1 },
  { area: 'Fire Temple', count: 1 },
  { area: 'Water Temple', count: 1 },
  { area: 'Shadow Temple', count: 2 },
  { area: 'Spirit Temple', count: 1 },
  { area: 'Gerudo Training Ground', count: 1 },
];

/* ---------------- heart piece routing costs ----------------
 * Seconds per heart piece, split by whether the run is doing the adult TRADE QUEST.
 *
 * That split is the reason this belongs in an RBA dataset at all: every adult-trade RBA parks the
 * trade sequence at a stop, which puts the run in the `tq` column. So choosing an RBA route
 * silently re-prices the heart pieces, and this is the table that says by how much.
 *
 * Qualifiers are kept rather than flattened: `approx` (~), `atLeast` (+), `each` (x — the line
 * prices more than one piece at that rate). `mapsTo` is filled in ONLY where the shorthand is
 * unambiguous against collections.js; the rest keep their raw label and are listed by the
 * validator as unmapped rather than guessed at.
 */
const HP = (label, seconds, o = {}) => Object.assign({ label, seconds }, o);

const HEART_PIECE_COSTS = {
  note: 'Do the river during the egg hatch.',
  tq: [
    HP('roofguy', 5),
    HP('cow HP sw', 11),
    HP('fountain HP', 13, { condition: 'assuming Ice Cavern', mapsTo: "Both Zora's Fountain HPs" }),
    HP('box HP', 13, { atLeast: true }),
    HP('above DC', 15, { condition: 'trade quest route' }),
    HP('HF scrub HP', 23, { mapsTo: 'Both Hyrule Field HPs' }),
    HP('lower crater', 15, { approx: true, condition: 'trade quest route', mapsTo: 'Both HPs in Death Mountain Crater' }),
    HP('upper crater', 25, { approx: true, mapsTo: 'Both HPs in Death Mountain Crater' }),
    HP('ice cavern HP', 27, { mapsTo: 'Ice Cavern HP' }),
    HP('colossus HP', 20, { atLeast: true, condition: 'after hover', mapsTo: 'Desert Colossus HP' }),
    HP('richard HP', 30, { mapsTo: 'Lost Dog HP' }),
    HP('windmill HP from odd potion', 26),
    HP('windmill HP from GY', 26),
    HP('dampe + windmill', 42, { each: true }),
    HP('dampe alone', 58),
    HP('top of river from lake > domain', 39, { mapsTo: '5 Zora area HPs' }),
    HP('up river', 40, { each: true, condition: 'trade quest route', mapsTo: '5 Zora area HPs' }),
    HP('valley', 40, { each: true, mapsTo: 'Both Gerudo Valley HPs' }),
    HP('lab tower HP', 48, { mapsTo: '2 Different Lake Hylia HPs' }),
    HP('lab dive HP', 50, { mapsTo: '2 Different Lake Hylia HPs' }),
    HP('fortress HP', 51, { mapsTo: '37th Heart Piece (Child Fortress)' }),
    HP('suns HP', 67, { condition: 'backtrack from song, OI' }),
    HP('HF dive HP from lake', 57, { mapsTo: 'Both Hyrule Field HPs' }),
    HP('HF dive HP from ToT', 36, { mapsTo: 'Both Hyrule Field HPs' }),
  ],
  notq: [
    HP('roofguy', 5),
    HP('fountain HP', 13, { condition: 'assuming Ice Cavern', mapsTo: "Both Zora's Fountain HPs" }),
    HP('cow HP', 20),
    HP('above DC', 26, { condition: 'no trade quest' }),
    HP('box HP', 13, { atLeast: true }),
    HP('HF scrub HP', 23, { mapsTo: 'Both Hyrule Field HPs' }),
    HP('lower crater', 10, { approx: true, condition: 'no trade quest', mapsTo: 'Both HPs in Death Mountain Crater' }),
    HP('upper crater', 25, { approx: true, mapsTo: 'Both HPs in Death Mountain Crater' }),
    HP('ice cavern HP', 27, { mapsTo: 'Ice Cavern HP' }),
    HP('colossus HP', 20, { atLeast: true, condition: 'after hover with Silver Scale', mapsTo: 'Desert Colossus HP' }),
    HP('richard HP', 30, { mapsTo: 'Lost Dog HP' }),
    HP('windmill HP from odd potion', 26),
    HP('windmill HP from GY', 26),
    HP('dampe + windmill', 42, { each: true }),
    HP('dampe alone', 58),
    HP('top of river from lake > domain', 39, { mapsTo: '5 Zora area HPs' }),
    HP('up river', 40, { each: true, mapsTo: '5 Zora area HPs' }),
    HP('top of river from Lost Woods, domain after', 16, { mapsTo: '5 Zora area HPs' }),
    HP('both in river from Lost Woods, domain after', 42, { each: true, mapsTo: '5 Zora area HPs' }),
    HP('bottom river as an extra', 68),
    HP('both in river, no domain after', 25, { each: true, approx: true, mapsTo: '5 Zora area HPs' }),
    HP('valley', 40, { each: true, mapsTo: 'Both Gerudo Valley HPs' }),
    HP('lab tower HP', 48, { mapsTo: '2 Different Lake Hylia HPs' }),
    HP('lab dive HP', 50, { mapsTo: '2 Different Lake Hylia HPs' }),
    HP('fortress HP', 51, { mapsTo: '37th Heart Piece (Child Fortress)' }),
    HP('suns HP', 67, { condition: 'backtrack from song, OI' }),
    HP('HF dive HP from lake', 57, { mapsTo: 'Both Hyrule Field HPs' }),
    HP('HF dive HP from ToT', 36, { mapsTo: 'Both Hyrule Field HPs' }),
  ],
};

const PROVENANCE = {
  source: 'OoT Bingo community (Discord), relayed by the repo owner',
  confidence: 'community',
  caveat:
    'Not derivable from the decomp or the bingo repo. Heart piece times are routing estimates, not measurements, and carry their original qualifiers (~ approximate, + at least, x each). Cross-checked against bingo synergy categories and goal counts by validate_community.js.',
};

module.exports = {
  SILVER_RUPEE_ROOMS, GOLD_RUPEE_CHESTS, STALFOS, BEAN_PATCHES, SCARECROW_SPOTS,
  HEART_PIECE_COSTS, PROVENANCE,
};

if (require.main === module) {
  const fs = require('fs');
  const path = require('path');
  const OUT = path.join(__dirname, 'out');
  const total = (a) => a.reduce((t, x) => t + (x.count || 1), 0);
  fs.writeFileSync(
    path.join(OUT, 'community-locations.json'),
    JSON.stringify({
      provenance: PROVENANCE,
      silverRupeeRooms: SILVER_RUPEE_ROOMS,
      goldRupeeChests: GOLD_RUPEE_CHESTS,
      stalfos: STALFOS,
      beanPatches: BEAN_PATCHES,
      scarecrowSpots: SCARECROW_SPOTS,
      heartPieceCosts: HEART_PIECE_COSTS,
    }, null, 1)
  );
  console.log(`silver rupee rooms : ${SILVER_RUPEE_ROOMS.length}`);
  console.log(`gold rupee chests  : ${GOLD_RUPEE_CHESTS.length}`);
  console.log(`stalfos            : ${total(STALFOS)} across ${STALFOS.length} rooms`);
  console.log(`bean patches       : ${BEAN_PATCHES.length} (${BEAN_PATCHES.filter((b) => b.skulltula).length} with a skulltula)`);
  console.log(`scarecrow spots    : ${total(SCARECROW_SPOTS)}`);
  console.log(`heart piece costs  : ${HEART_PIECE_COSTS.tq.length} tq / ${HEART_PIECE_COSTS.notq.length} no-tq entries`);
}
