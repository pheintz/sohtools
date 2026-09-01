/*
 * Intended-route acquisition data: for each item / quest state a v10.6 bingo goal can assert,
 * where it legitimately comes from and what it depends on.
 *
 * Schema per entry:
 *   age        'child' | 'adult' | 'either'
 *   where      location string
 *   how        short description of the intended acquisition
 *   requires   list of prerequisite keys (other entries in this table) or literal gate names
 *   gates      timeline / warp gates (see GATES below)
 *   oneWay     true if the state can be lost or the opportunity missed
 *   notes      anything a router needs
 *
 * GATES is the small set of structural prerequisites that most bingo route reasoning turns on, * in particular the "second child era visit" (`child2`) that several goals need.
 */

const GATES = {
  doorOfTime: {
    name: 'Open the Door of Time',
    requires: ["Kokiri's Emerald", "Goron's Ruby", "Zora's Sapphire", "Song of Time", "Fairy Ocarina or Ocarina of Time"],
    notes: 'Normally the gate into the adult era. Speedrun routes skip it (Door of Time Skip), but the bingo goal list generally assumes the intended route unless a glitch synergy says otherwise.',
  },
  becomeAdult: {
    name: 'Pull the Master Sword',
    requires: ['doorOfTime'],
    notes:
      'Adult Reset (first time only, or any time you return swordless / with a blank B): Master Sword to B, Deku Nuts to C-Left if owned, Bombs ALWAYS to C-Down, the Ocarina slot contents to C-Right, Hylian Shield if owned, Kokiri Tunic + Boots.',
  },
  backInTime: {
    name: 'Return to the child era',
    requires: ['becomeAdult', 'Master Sword in the pedestal (Temple of Time)'],
    notes: 'Going back always puts the Kokiri Sword on B even if you never owned it. Travelling through time clears the Farore\'s Wind point and re-syncs all bottle / trade item values (this re-sync is what Bottle Adventure abuses).',
  },
  child2: {
    name: 'Second child era visit (bingo `child2`)',
    requires: ['becomeAdult', 'Prelude of Light'],
    notes:
      'The practical gate is Prelude of Light, which Sheik teaches in the Temple of Time once you have beaten the Forest Temple. Without Prelude you have to walk to the Temple of Time to swap eras, which is why bingo prices this as its own synergy. Goals carrying `child2` in v10.6: 10 Songs, Ocarina of Time, Fill all 4 Bottle Slots, Both Rusty Switches in Spirit Temple, Open the Final Door of Shadow/Water Trial, Win Bombchu Bowling Prize, Ruto\'s Letter, Frog\'s HP, All 4 Market area Skulltulas, Din\'s Fire, Forest Medallion, Defeat Phantom Ganon, Beat the Forest Temple, Saria\'s Song, Goron Bracelet, Green Gauntlets, and the child skulltula/bean/HP collections.',
    important:
      'EnXc_InitTempleOfTime (ovl_En_Xc/z_en_xc.c:2210) gates the Prelude cutscene on GET_EVENTCHKINF(EVENTCHKINF_48), NOT on CHECK_QUEST_ITEM(QUEST_MEDALLION_FOREST). EVENTCHKINF_48 is set by the Forest Temple blue warp (ovl_Door_Warp1/z_door_warp1.c:724). So RBA-ing the Forest Medallion bit does NOT unlock Prelude of Light, an RBA medallion satisfies the "Forest Medallion" goal but does not buy you the child2 warp.',
  },
  childReset: {
    name: 'Child reset to Link\'s house (bingo `childreset`)',
    requires: [],
    notes: 'Save-and-quit as child respawns you at Link\'s house; the cost is the walk back to the Temple of Time. Multiple goals needing it share that walk, which is the whole point of the synergy column.',
  },
  lacs: {
    name: 'Light Arrow CutScene',
    requires: ['Shadow Medallion', 'Spirit Medallion'],
    notes:
      'Holding Shadow + Spirit triggers Sheik\'s Temple of Time cutscene: Light Arrows plus the rainbow bridge. Reachable legitimately (`legitlacs`) or by Broken Goron\'s Sword RBA. Watching it also counts as travelling through time, so it can trigger Bottle Adventure and Adult Reset.',
  },
  magic: {
    name: 'Magic meter',
    requires: ["Great Fairy on Death Mountain Trail (child, needs a bomb/Goron's Bracelet to open the crawlspace boulder)"],
  },
};

const ITEMS = {
  // ---------------- child-era core
  'Kokiri Sword': { age: 'child', where: 'Kokiri Forest training ground', how: 'Crawl into the maze chest', requires: [] },
  'Deku Shield': { age: 'child', where: 'Kokiri Shop', how: 'Buy for 40 rupees (or find one in the Deku Tree)', requires: [] },
  'Fairy Slingshot': { age: 'child', where: 'Inside the Great Deku Tree', how: 'Chest after the first spider room', requires: [], notes: 'Also always awards the Bullet Bag (30) into the first left-side equipment slot.' },
  "Kokiri's Emerald": { age: 'child', where: 'Great Deku Tree', how: 'Defeat Queen Gohma', requires: ['Fairy Slingshot'], rbaAlternative: 'quest-stones' },
  "Goron's Ruby": { age: 'child', where: "Dodongo's Cavern", how: 'Defeat King Dodongo, then talk to Darunia', requires: ["Zelda's Letter or Goron Bracelet route", 'Bombs / Bomb Flowers'], rbaAlternative: 'quest-stones' },
  "Zora's Sapphire": { age: 'child', where: "Inside Jabu-Jabu's Belly", how: "Defeat Barinade; carry Ruto out", requires: ["Ruto's Letter", 'Bottle', 'a fish'], rbaAlternative: 'quest-stones' },
  'Goron Bracelet': { age: 'child', where: 'Goron City', how: 'Darunia gives it after Saria\'s Song', requires: ["Saria's Song", "Zelda's Letter"], oneWay: true, notes: 'Darunia only hands it over if the strength slot reads 0. After any RBA that sets a strength bit he gives nothing.' },
  "Zelda's Letter": { age: 'child', where: 'Hyrule Castle courtyard', how: 'Talk to Zelda', requires: ['Weird Egg', 'Cucco'] },
  "Zelda's Lullaby": { age: 'child', where: 'Hyrule Castle courtyard', how: 'Impa teaches it on the way out', requires: ["Zelda's Letter"], rbaAlternative: 'quest-songs', bingoCategory: 'czl' },
  "Saria's Song": { age: 'child', where: 'Sacred Forest Meadow', how: 'Saria teaches it at the end of the maze', requires: [], rbaAlternative: null, notes: 'CANNOT be RBA\'d: bit 64 of the songs byte is unwritable. Any Poacher\'s Saw RBA deletes it.' },
  "Epona's Song": { age: 'child', where: 'Lon Lon Ranch', how: 'Malon teaches it by the corral', requires: [], rbaAlternative: null, notes: 'Bit 32 of the songs byte is unwritable, and deleted by any Poacher\'s Saw RBA.' },
  "Sun's Song": { age: 'child', where: 'Graveyard (Royal Family\'s Tomb)', how: 'Play Zelda\'s Lullaby on the grave, read the tablet', requires: ["Zelda's Lullaby"], rbaAlternative: null, notes: 'Bit 128, unwritable, deleted by Poacher\'s Saw RBA.' },
  'Song of Time': { age: 'child', where: 'Hyrule Castle Town / Temple of Time', how: 'Zelda teaches it through the moat cutscene', requires: ["Zelda's Letter"], rbaAlternative: 'quest-stones (bit 1 of the stones byte)' },
  'Song of Storms': { age: 'either', where: 'Windmill, Kakariko', how: 'Play the ocarina to the Windmill Man as adult, then learn it', requires: ['Ocarina'], rbaAlternative: 'quest-stones (bit 2)' },
  'Fairy Ocarina': { age: 'child', where: 'Kokiri Forest bridge', how: 'Saria gives it as you leave the forest', requires: [] },
  'Ocarina of Time': { age: 'child', where: 'Hyrule Castle moat', how: 'Zelda throws it in after the Ganondorf cutscene', requires: ['all three spiritual stones'], bingoCategory: 'child2' },

  // ---------------- adult-era core
  'Master Sword': { age: 'child->adult', where: 'Temple of Time', how: 'Pull it from the pedestal', requires: ['doorOfTime'] },
  'Fairy Bow': { age: 'adult', where: 'Forest Temple', how: 'Chest after the Stalfos twins', requires: ['Forest Temple access'], notes: 'If you already own a Quiver the chest degrades to a small chest (one arrow) and just puts the bow in its slot.' },
  'Hookshot': { age: 'adult', where: 'Kakariko Graveyard (Dampé race)', how: 'Beat Dampé\'s race', requires: [] },
  'Longshot': { age: 'adult', where: 'Water Temple', how: 'Chest in the central tower after Dark Link', requires: ['Water Temple access', 'Iron Boots', 'Zora Tunic'] },
  'Megaton Hammer': { age: 'adult', where: 'Fire Temple', how: 'Chest in the boss key area', requires: ['Fire Temple access', 'Goron Tunic'] },
  'Iron Boots': { age: 'adult', where: "Ice Cavern", how: 'Chest at the end', requires: [], destroyedBy: ['equip-tunics-boots (Goron Mask RBA)'] },
  'Hover Boots': { age: 'adult', where: 'Shadow Temple', how: 'Chest past the first hub room', requires: ['Shadow Temple access'], destroyedBy: ['equip-tunics-boots (Goron Mask RBA)'] },
  'Goron Tunic': { age: 'adult', where: 'Goron City / Death Mountain Crater', how: 'Buy for 200 rupees, or free from the Goron in DMC (Goron Link)', requires: [], rbaAlternative: 'equip-tunics-boots' },
  'Zora Tunic': { age: 'adult', where: "Zora's Fountain", how: 'King Zora gives it after being thawed with Blue Fire', requires: ['Blue Fire', 'Bottle'], rbaAlternative: 'equip-tunics-boots' },
  'Mirror Shield': { age: 'adult', where: 'Spirit Temple', how: 'Chest past the Iron Knuckle in the adult half', requires: ['Spirit Temple access', 'Silver Gauntlets'], destroyedBy: ['equip-swords-shields (Zora Mask RBA)'] },
  'Silver Gauntlets': { age: 'adult', where: 'Spirit Temple (child half)', how: 'Chest at the end of the child section', requires: [], notes: 'Opening this chest overrides ANY previous strength value, including coloured gauntlets.' },
  'Golden Gauntlets': { age: 'adult', where: "Ganon's Castle (Shadow Trial)", how: 'Chest in the Shadow Trial', requires: ["Ganon's Castle access"], notes: 'Same override behaviour as the Silver Gauntlets chest.' },
  'Silver Scale': { age: 'child', where: "Zora's Domain", how: 'Win the diving game', requires: [], notes: 'Always overwrites the 4th equipment slot, even over a Golden Scale or a glitched dive meter.', destroyedBy: ['upg-wallet-scale-strength-hi (Pocket Cucco RBA)'] },
  'Golden Scale': { age: 'either', where: 'Lake Hylia Fishing Pond', how: 'Catch a big enough fish', requires: ['Fishing Pond'], notes: 'Obtainable early as child. Always overwrites the 4th equipment slot. This is the repair for a dive meter wrecked by Pocket Cucco RBA.' },
  "Adult's Wallet": { age: 'child', where: 'Kakariko Gold Skulltula House', how: 'Give 10 Gold Skulltula tokens to the guy on the right', requires: ['10 Gold Skulltula tokens'], rbaAlternative: 'upg-wallet-scale-strength-hi' },
  "Giant's Wallet": { age: 'child', where: 'Kakariko Gold Skulltula House', how: 'Give 30 tokens to the guy at the back', requires: ['30 Gold Skulltula tokens'], rbaAlternative: "upg-wallet-scale-strength-hi then the 10-token guy (he upgrades a 200 wallet to Giant's)", notes: "Bingo's own tracker uses a /10 skulltula counter for this goal, confirming the RBA-assisted route is the expected one." },
  'Stone of Agony': { age: 'child', where: 'Kakariko Gold Skulltula House', how: '20 Gold Skulltula tokens', requires: ['20 tokens'], destroyedBy: ['quest-stones (Odd Potion RBA)'] },
  "Gerudo's Card": { age: 'adult', where: "Gerudo's Fortress", how: 'Rescue all four carpenters', requires: ['Longshot or Hover Boots or bow'], destroyedBy: ['quest-stones (Odd Potion RBA)'] },
  "Giant's Knife": { age: 'adult', where: 'Goron City', how: 'Buy from the Goron shop for 200 rupees', requires: ["Adult's Wallet (200-rupee capacity)"], notes: 'Shares the equipment bit with Biggoron\'s Sword; breaks after 8 swings.' },
  "Biggoron's Sword": { age: 'adult', where: 'Death Mountain Trail', how: 'Finish the whole adult trade sequence, then wait 3 days and give Biggoron the Claim Check', requires: ['adult trade sequence complete'], notes: 'Mutually antagonistic with parking the trade sequence at any earlier stage for RBA. Bingo prices this as chucojiro:-1.5.' },
  'Din\'s Fire': { age: 'child', where: 'Hyrule Castle Town (Great Fairy above the castle)', how: 'Play Zelda\'s Lullaby at the Triforce wall', requires: ["Zelda's Lullaby", 'magic'], bingoCategory: 'child2' },
  "Farore's Wind": { age: 'child', where: 'Zora\'s Fountain Great Fairy', how: "Play Zelda's Lullaby at the fairy fountain", requires: ["Zelda's Lullaby", 'magic'] },
  "Nayru's Love": { age: 'adult', where: 'Desert Colossus Great Fairy', how: "Play Zelda's Lullaby", requires: ["Zelda's Lullaby", 'Requiem of Spirit', 'magic'] },
  'Fire Arrows': { age: 'adult', where: 'Lake Hylia', how: "Play the Sun's Song on the island at dawn after Water Temple", requires: ['Water Temple beaten', "Sun's Song", 'Fairy Bow'] },
  'Ice Arrows': { age: 'adult', where: 'Gerudo Training Ground', how: 'Chest at the end of the Silver Rupee route', requires: ["Gerudo's Card", 'Fairy Bow', 'Longshot / Hover Boots'] },
  'Light Arrows': { age: 'adult', where: 'Temple of Time', how: 'Light Arrow CutScene', requires: ['lacs'], bingoCategory: 'legitlacs / inclacs' },
  'Lens of Truth': { age: 'child', where: 'Bottom of the Well', how: 'Chest in the deep part', requires: ['Bottom of the Well access (Song of Storms at the windmill)'] },
  'Boomerang': { age: 'child', where: "Inside Jabu-Jabu's Belly", how: 'Chest in the big octo room', requires: ['Jabu access'] },
  'Bomb Bag': { age: 'child', where: "Dodongo's Cavern", how: 'Chest in the upper area', requires: ['DC access'], notes: 'If you already own any bomb bag this chest instead drops Bomb Bag (20) into the Bombchu slot (Upgrade Oddity) and permanently blocks Bombchus.' },
  'Bombchus': { age: 'child', where: 'Bombchu Bowling / Bombchu shop / Bottom of the Well', how: 'Various', requires: [], bingoCategory: 'chucojiro' },
  'Magic Bar': { age: 'child', where: 'Death Mountain Trail Great Fairy', how: 'Play Zelda\'s Lullaby at the fountain', requires: ["Zelda's Lullaby", 'a way past the crawlspace boulder'] },
  'Double Magic': { age: 'adult', where: 'Death Mountain Crater Great Fairy', how: "Play Zelda's Lullaby", requires: ["Zelda's Lullaby", 'DMC access'] },
  'Double Defense': { age: 'adult', where: "Ganon's Castle Great Fairy", how: "Play Zelda's Lullaby", requires: ["Zelda's Lullaby", "Ganon's Castle access", '20 hearts'] },
  'Keaton Mask': { age: 'child', where: 'Happy Mask Shop', how: 'Borrow it and sell it to the Kakariko guard', requires: ["Zelda's Letter"] },
  'Skull Mask': { age: 'child', where: 'Happy Mask Shop', how: 'Borrow after selling the Keaton Mask; sell to the Skull Kid in Lost Woods', requires: ['Keaton Mask sold'] },
};

/*
 * SPAWN_WINDOWS, goals whose target only EXISTS during a window of game state.
 *
 * This is not a prerequisite. There is nothing to collect and no gate to open: outside the
 * window the actor deletes itself in Init, so the room is simply empty. A router who does not
 * know the window concludes the goal is broken, or burns the trip and comes back later.
 *
 * Kept separate from ITEMS because the failure mode is the opposite of a missing prerequisite, * making MORE quest progress is what closes the window.
 */
const SPAWN_WINDOWS = {
  'Defeat a Skull Kid': {
    actor: 'En_Skj',
    where: 'Lost Woods',
    gate: 'ovl_En_Skj/z_en_skj.c:422, Actor_Kill(&this->actor) in EnSkj_Init when INV_CONTENT(ITEM_TRADE_ADULT) < ITEM_POACHERS_SAW',
    reads: 'Inventory.items[22] (SLOT_TRADE_ADULT, item.h:149), compared as u8 against ITEM_POACHERS_SAW = 0x32 = 50',
    // The gate exempts params 0/1/2, but those can never satisfy the goal anyway: their action
    // funcs set unk_2D3 = 0 (z_en_skj.c:340), which makes EnSkj_CollisionCheck return early
    // (:607) and suppresses CollisionCheck_SetAC (:1355). They have no damage collider at all.
    appliesTo: 'every Skull Kid except params 0 (Saria\u2019s Song / Skull Mask trade) and 1-2 (the ocarina memory game), and those three are undamageable, so every KILLABLE Skull Kid is behind this gate',
    closed: 'while the adult trade slot holds Pocket Egg (45) through Odd Potion (49), adult trade stops 1-5',
    open: 'before the adult trade quest starts (slot reads ITEM_NONE = 0xFF = 255, and 255 < 50 is false) and again from Poacher\u2019s Saw (50) onward',
    table: [
      { slot: 'ITEM_NONE (quest not started)', value: 255, spawns: true },
      { slot: 'ITEM_POCKET_EGG', value: 45, spawns: false },
      { slot: 'ITEM_POCKET_CUCCO', value: 46, spawns: false },
      { slot: 'ITEM_COJIRO', value: 47, spawns: false },
      { slot: 'ITEM_ODD_MUSHROOM', value: 48, spawns: false },
      { slot: 'ITEM_ODD_POTION', value: 49, spawns: false },
      { slot: 'ITEM_POACHERS_SAW', value: 50, spawns: true },
      { slot: 'ITEM_BROKEN_GORONS_SWORD .. ITEM_CLAIM_CHECK', value: '51-55', spawns: true },
    ],
    whyItExists:
      'INFERRED design intent, not stated by the code. Trade stops 3-5 are the Lost Woods chain: Cojiro is handed over in the woods, Odd Mushroom is received there and is one of only three timed items (gSpoilingItems), and Odd Potion is carried back in to Fado for the Saw. Clearing the hostile Skull Kids across that stretch keeps them from interrupting the timed run. The window is wider than it needs to be, it also covers stops 1-2, where no Lost Woods trip is involved, because the check is one `<` threshold against Poacher’s Saw rather than a range.',
    spoiling:
      'gSpoilingItems / gSpoilingItemReverts (z_parameter.c:152-153) revert Odd Mushroom -> Cojiro and Eyeball Frog / Eye Drops -> Prescription. Neither revert crosses the 50 boundary, so a spoiled trade item never changes whether Skull Kids spawn.',
    bingoPricing:
      'v10.6 prices this correctly: the goal carries poachers 0.5 and rowtype gclw 1 / ms 1. The `poachers` synergy is NOT about the songs RBA route, it is this spawn gate. Poacher\u2019s Saw is the first trade stop where the Skull Kids come back.',
    rbaTrap:
      'Green Potion (ITEM_BOTTLE_POTION_GREEN, 0x16 = 22) on C-Right targets SLOT_TRADE_ADULT itself. All six writable values (20, 24, 25, 28, 29, 31) are below 50, so any such write despawns the Skull Kids AND puts the trade slot off-sequence, since every trade NPC tests INV_CONTENT(ITEM_TRADE_ADULT) == a specific item id.',
    rbaRecovery:
      'Partly recoverable. En_Niw_Lady (the Kakariko Cucco Lady) re-gives as adult: Pocket Egg while ITEMGETINF_2C is clear, then Cojiro while ITEMGETINF_2E is clear (z_en_niw_lady.c:486, :498-501). After both flags are set she gives nothing and the adult trade quest is unrecoverable for the run. Either re-give lands below 50, so the Skull Kids stay gone until you trade back up to Poacher\u2019s Saw.',
    routing:
      'Kill the Skull Kid before starting the adult trade quest, or after reaching Poacher\u2019s Saw. Every adult-trade RBA parked at stops 1-5, including the Odd Potion write that reaches the spiritual-stones byte, sits inside the dead window.',
    dropsOnDeath:
      'Item_DropCollectible(ITEM00_RUPEE_ORANGE) at z_en_skj.c:1343, which Item_Give maps to ITEM_RUPEE_GOLD = 200 rupees (z_en_item00.c:556). Unconditional, not a random drop table.',
    confidence: 'decomp',
    unverified:
      'Which scene setups actually place a killable Skull Kid is not checkable here, E:/oot has no extracted scene data (see open-questions A). The spawn gate is proven from code; the placement is not.',
  },
};

// Which v10.6 goals are gated on a second child visit / child reset, straight from the synergy data.
const GATE_TAGGED_GOALS = {
  note: 'derived from goals-v10.6.json classification.routeTags; see build_goal_dataset.js',
  child2: 'second-child-era-visit',
  childreset: 'child-reset-to-links-house',
};

module.exports = { GATES, ITEMS, SPAWN_WINDOWS, GATE_TAGGED_GOALS };

if (require.main === module) {
  const fs = require('fs');
  const path = require('path');
  const OUT = path.join(__dirname, 'out');

  // Assert every spawn-window key is a real v10.6 goal, the same way rba_recipes.js does.
  const goals = JSON.parse(fs.readFileSync(path.join(OUT, 'goals-v10.6.json'), 'utf8'));
  const names = new Set(goals.map((g) => g.name));
  const missing = Object.keys(SPAWN_WINDOWS).filter((n) => !names.has(n));
  if (missing.length) {
    console.error('SPAWN_WINDOWS references goals that are not in v10.6:\n  ' + missing.join('\n  '));
    process.exit(1);
  }

  fs.writeFileSync(
    path.join(OUT, 'prerequisites.json'),
    JSON.stringify({ gates: GATES, items: ITEMS, spawnWindows: SPAWN_WINDOWS }, null, 1)
  );
  console.log(
    `gates: ${Object.keys(GATES).length}, items: ${Object.keys(ITEMS).length}, spawnWindows: ${Object.keys(SPAWN_WINDOWS).length}`
  );
}
