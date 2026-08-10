/*
 * Classify every v10.6 bingo goal and link it to the RBA offset model.
 * Input : out/goals.json (from parse_goals.js), out/rba-offsets.json (from build_rba_table.js)
 * Output: out/goals-v10.6.json, out/goals-v10.6.tsv, out/goal-archetypes.txt
 */
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, 'out');

const goals = JSON.parse(fs.readFileSync(path.join(OUT, 'goals.json'), 'utf8'));

// ---------------------------------------------------------------- archetypes
// order matters, first match wins
const ARCHETYPES = [
  { id: 'skulltula-collection', re: /Skulltula/i },
  { id: 'heart-collection', re: /\b(HPs?|Heart Pieces?|Heart Containers?|Hearts)\b/i },
  { id: 'song-collection', re: /\bSongs\b/i },
  { id: 'song-single', re: /^(Minuet|Bolero|Serenade|Requiem|Nocturne|Prelude|Zelda's Lullaby|Epona's Song|Saria's Song|Sun's Song|Song of Time|Song of Storms)/i },
  { id: 'dungeon-item-collection', re: /\b(Compasses|Maps|Boss Keys)\b/i },
  { id: 'dungeon-item-single', re: /^(Map & Compass|.*Boss Key$)/i },
  { id: 'small-keys', re: /\b(Small Keys?|Unused Keys?|Unused Small Key)\b/i },
  { id: 'dungeon-clear', re: /^Beat /i },
  { id: 'boss-kill', re: /^Defeat (Queen Gohma|King Dodongo|Barinade|Phantom Ganon|Volvagia|Morpha|Bongo-Bongo|Twinrova|Dark Link|Big Octo|Nabooru-Knuckle|Amy|Meg)/i },
  { id: 'enemy-kill', re: /^Defeat /i },
  { id: 'bean', re: /Magic Beans?|Plant .*bean/i },
  { id: 'equipment-set', re: /^\d Swords|^\d Shields|^\d Tunics|^\d Boots|^\d Swords, Tunics/i },
  { id: 'rupees', re: /Rupees$/i },
  { id: 'silver-rupees', re: /Silver Rupee Rooms/i },
  { id: 'gold-rupee-chests', re: /Gold Rupee Chests|50 Rupee chest/i },
  { id: 'trial-door', re: /Final Door of .* Trial/i },
  { id: 'boss-key-door', re: /Boss Key Door/i },
  { id: 'bottle-contents', re: /Bottled Contents|Bottles of Milk|Fill all 4 Bottle Slots/i },
  { id: 'inventory-slots', re: /Item Inventory Slots/i },
  { id: 'event', re: /^(Open|Clear|Free|Fill the Oasis|Summon|Win|Get|Cow in House|Both Trips|Both Rusty|Plant)/i },
  { id: 'item', re: /.*/ },
];

// item-ish goal names -> the concrete game state they assert
const ITEM_STATE = {
  "Adult's Wallet": { kind: 'upgrade', upgrade: 'UPG_WALLET', value: 1 },
  "Giant's Wallet": { kind: 'upgrade', upgrade: 'UPG_WALLET', value: 2 },
  'Goron Bracelet': { kind: 'upgrade', upgrade: 'UPG_STRENGTH', value: 1 },
  'Silver Gauntlets': { kind: 'upgrade', upgrade: 'UPG_STRENGTH', value: 2 },
  'Golden Gauntlets': { kind: 'upgrade', upgrade: 'UPG_STRENGTH', value: 3 },
  'Black Gauntlets': { kind: 'upgrade', upgrade: 'UPG_STRENGTH', value: 4, rbaOnly: true },
  'Green Gauntlets': { kind: 'upgrade', upgrade: 'UPG_STRENGTH', value: 5, rbaOnly: true },
  'Blue Gauntlets': { kind: 'upgrade', upgrade: 'UPG_STRENGTH', value: 6, rbaOnly: true },
  'Bronze Gauntlets': { kind: 'upgrade', upgrade: 'UPG_STRENGTH', value: 7, rbaOnly: true },
  'Silver Scale': { kind: 'upgrade', upgrade: 'UPG_SCALE', value: 1 },
  'Golden Scale': { kind: 'upgrade', upgrade: 'UPG_SCALE', value: 2 },
  'Bomb Bag (30)': { kind: 'upgrade', upgrade: 'UPG_BOMB_BAG', value: 2 },
  'Quiver (40)': { kind: 'upgrade', upgrade: 'UPG_QUIVER', value: 2 },
  'Quiver (50)': { kind: 'upgrade', upgrade: 'UPG_QUIVER', value: 3 },
  'Bullet Bag (40)': { kind: 'upgrade', upgrade: 'UPG_BULLET_BAG', value: 2 },
  'Bullet Bag (50)': { kind: 'upgrade', upgrade: 'UPG_BULLET_BAG', value: 3 },
  'Exactly 20 Deku Sticks': { kind: 'upgrade', upgrade: 'UPG_DEKU_STICKS', value: 2 },
  'Exactly 30 Deku Sticks': { kind: 'upgrade', upgrade: 'UPG_DEKU_STICKS', value: 3 },
  '30 Deku Nuts': { kind: 'upgrade', upgrade: 'UPG_DEKU_NUTS', value: 2 },
  "Kokiri's Emerald": { kind: 'quest', bit: 18 },
  "Goron's Ruby": { kind: 'quest', bit: 19 },
  "Zora's Sapphire": { kind: 'quest', bit: 20 },
  'Stone of Agony': { kind: 'quest', bit: 21 },
  "Gerudo's Card": { kind: 'quest', bit: 22 },
  'Forest Medallion': { kind: 'quest', bit: 0 },
  'Fire Medallion': { kind: 'quest', bit: 1 },
  'Water Medallion': { kind: 'quest', bit: 2 },
  'Minuet of Forest': { kind: 'quest', bit: 6 },
  'Bolero of Fire': { kind: 'quest', bit: 7 },
  'Requiem of Spirit': { kind: 'quest', bit: 9 },
  "Epona's Song": { kind: 'quest', bit: 13 },
  "Saria's Song": { kind: 'quest', bit: 14 },
  'Goron Tunic': { kind: 'equip', bit: 9 },
  'Zora Tunic': { kind: 'equip', bit: 10 },
  'Iron Boots': { kind: 'equip', bit: 13 },
  'Mirror Shield': { kind: 'equip', bit: 6 },
  "Biggoron's Sword": { kind: 'equip', bit: 2 },
  "Giant's Knife": { kind: 'equip', bit: 2 },
  'Fairy Bow': { kind: 'itemSlot', slot: 3 },
  'Fairy Slingshot': { kind: 'itemSlot', slot: 6 },
  'Fairy Ocarina': { kind: 'itemSlot', slot: 7 },
  'Ocarina of Time': { kind: 'itemSlot', slot: 7 },
  'Boomerang': { kind: 'itemSlot', slot: 12 },
  'Lens of Truth': { kind: 'itemSlot', slot: 13 },
  'Megaton Hammer': { kind: 'itemSlot', slot: 15 },
  'Longshot': { kind: 'itemSlot', slot: 9 },
  "Din's Fire": { kind: 'itemSlot', slot: 5 },
  "Farore's Wind": { kind: 'itemSlot', slot: 11 },
  "Nayru's Love": { kind: 'itemSlot', slot: 17 },
  'Fire Arrows': { kind: 'itemSlot', slot: 4 },
  'Ice Arrows': { kind: 'itemSlot', slot: 10 },
  'Light Arrows': { kind: 'itemSlot', slot: 16 },
  'Blue Fire': { kind: 'bottleContent', item: 0x1c },
  'Bottled Fairy': { kind: 'bottleContent', item: 0x18 },
  'Bottled Poe': { kind: 'bottleContent', item: 0x20 },
  'Red Potion': { kind: 'bottleContent', item: 0x15 },
  'Green Potion': { kind: 'bottleContent', item: 0x16 },
  'Blue Potion': { kind: 'bottleContent', item: 0x17 },
  'Milk': { kind: 'bottleContent', item: 0x1a },
  "Ruto's Letter": { kind: 'bottleContent', item: 0x1b },
  'Keaton Mask': { kind: 'childTrade', item: 0x24 },
  'Skull Mask': { kind: 'childTrade', item: 0x25 },
  'Magic Bar': { kind: 'playerData', field: 'magicLevel/isMagicAcquired' },
  'Double Magic': { kind: 'playerData', field: 'isDoubleMagicAcquired' },
  'Double Defense': { kind: 'playerData', field: 'isDoubleDefenseAcquired (Inventory.defenseHearts)' },
};

// synergy categories that flag a route/technique requirement
const TAG_FROM_CATEGORY = {
  chucojiro: 'explosives-via-cojiro-rba-or-child-chus',
  chuczl: 'child-zelda-lullaby-corner-case',
  czl: 'child-zeldas-lullaby',
  poachers: 'songs-via-poachers-saw-rba',
  bothzl: 'zl-double-count-fix',
  cuccorba: 'pocket-cucco-rba',
  quiverrba: 'cojiro-rba-quiver',
  rbastones: 'odd-potion-rba-stones',
  silverscale: 'silver-scale-route',
  silverscalechild2: 'silver-scale-plus-second-child',
  bulletbag: 'bullet-bag-route',
  bulletbagchild2: 'bullet-bag-plus-second-child',
  legitlacs: 'lacs-legit-medallions',
  inclacs: 'lacs-exclusive',
  child2: 'second-child-era-visit',
  childreset: 'child-reset-to-links-house',
  aganon: 'ganons-castle-adult',
  bganon: 'ganons-castle-both',
  cganon: 'ganons-castle-child',
  ganonchu: 'ganons-castle-chus-vs-botw',
  botw: 'bottom-of-the-well',
  hovers: 'hover-boots',
  irons: 'iron-boots',
  longshot: 'longshot',
  strength: 'strength-upgrade',
  wallet: 'wallet-upgrade',
  magic: 'magic',
  beans: 'magic-beans',
  bottle: 'bottle',
  bottleslot: 'bottle-slots',
  claimcheck: 'claim-check-bgs',
  softsoil: 'soft-soil',
  goldrupee: 'gold-rupee-chests',
  silverrupee: 'silver-rupee-rooms',
  bosskey: 'boss-keys-tier1',
  bosskey2: 'boss-keys-tier2',
  hearts3: 'hearts-tier1',
  hearts4: 'hearts-tier2',
};

const AREA_HINTS = [
  [/Kokiri Forest/i, 'Kokiri Forest'], [/Lost Woods/i, 'Lost Woods'], [/Sacred Forest/i, 'Sacred Forest Meadow'],
  [/Hyrule Field/i, 'Hyrule Field'], [/Lake Hylia/i, 'Lake Hylia'], [/Market/i, 'Market'],
  [/Lon Lon Ranch/i, 'Lon Lon Ranch'], [/Kakariko/i, 'Kakariko'], [/Graveyard|Windmill/i, 'Graveyard'],
  [/Death Mountain Crater|\bDMC\b/i, 'Death Mountain Crater'], [/Death Mountain/i, 'Death Mountain Trail'],
  [/Goron City/i, 'Goron City'], [/Zora's River/i, "Zora's River"], [/Zora's Domain|Zora area/i, "Zora's Domain"],
  [/Zora's Fountain/i, "Zora's Fountain"], [/Gerudo Valley/i, 'Gerudo Valley'], [/Gerudo's Fortress|Fortress/i, "Gerudo's Fortress"],
  [/Wasteland|Colossus/i, 'Wasteland / Colossus'], [/Temple of Time/i, 'Temple of Time'],
];
const DUNGEON_HINTS = [
  [/Deku Tree/i, 'Deku Tree'], [/Dodongo/i, "Dodongo's Cavern"], [/Jabu/i, 'Jabu-Jabu'],
  [/Forest Temple/i, 'Forest Temple'], [/Fire Temple/i, 'Fire Temple'], [/Water Temple/i, 'Water Temple'],
  [/Spirit Temple/i, 'Spirit Temple'], [/Shadow Temple/i, 'Shadow Temple'],
  [/Bottom of the Well/i, 'Bottom of the Well'], [/Ice Cavern/i, 'Ice Cavern'],
  [/Gerudo Training Grounds?/i, 'Gerudo Training Ground'], [/Ganon's Castle|Ganon's Tower|Trial/i, "Ganon's Castle"],
];

function classify(g) {
  const name = g.name;
  const archetype = ARCHETYPES.find((a) => a.re.test(name)).id;
  const numMatch = /(\d+)/.exec(name);
  const count = /^(All|Both|Exactly)?\s*\d+/i.test(name) || /^\D*\d+\s+\w/.test(name) ? (numMatch ? Number(numMatch[1]) : null) : null;

  const allCats = new Set([
    ...Object.keys(g.types_normal || {}), ...Object.keys(g.subtypes_normal || {}),
    ...Object.keys(g.types_short || {}), ...Object.keys(g.subtypes_short || {}),
  ]);
  const tags = [...allCats].filter((c) => TAG_FROM_CATEGORY[c]).map((c) => TAG_FROM_CATEGORY[c]).sort();
  const exclusionGroups = [...allCats].filter((c) => {
    const v = (g.types_normal || {})[c] ?? (g.types_short || {})[c];
    return v === 100;
  }).sort();

  const area = (AREA_HINTS.find(([re]) => re.test(name)) || [])[1] || null;
  const dungeon = (DUNGEON_HINTS.find(([re]) => re.test(name)) || [])[1] || null;

  let age = null;
  if (/Child/i.test(name)) age = 'child';
  else if (/Adult/i.test(name)) age = 'adult';

  return {
    archetype,
    count,
    area,
    dungeon,
    ageFromName: age,
    routeTags: tags,
    exclusionGroups,
    gameState: ITEM_STATE[name] || null,
    rbaOnlyItem: !!(ITEM_STATE[name] && ITEM_STATE[name].rbaOnly),
  };
}

const out = goals.map((g) => {
  const c = classify(g);
  return {
    id: g.id,
    name: g.name,
    jp: g.jp,
    modes: g.modes,
    synergy: {
      types: { normal: g.types_normal || null, short: g.types_short || null },
      subtypes: { normal: g.subtypes_normal || null, short: g.subtypes_short || null },
      rowtypes: { normal: g.rowtypes_normal || null, short: g.rowtypes_short || null },
    },
    classification: c,
    // to be filled by the curated pass
    rba: null,
    intendedRoute: null,
  };
});

fs.writeFileSync(path.join(OUT, 'goals-v10.6.json'), JSON.stringify(out, null, 1));

// TSV for eyeballing / spreadsheet import
const header = ['id', 'name', 'archetype', 'count', 'area', 'dungeon', 'age', 'normal_diff', 'normal_time', 'short_diff', 'short_time', 'routeTags', 'exclusionGroups'];
const lines = [header.join('\t')];
for (const g of out) {
  lines.push([
    g.id, g.name, g.classification.archetype, g.classification.count ?? '',
    g.classification.area ?? '', g.classification.dungeon ?? '', g.classification.ageFromName ?? '',
    g.modes.normal?.difficulty ?? '', g.modes.normal?.time ?? '',
    g.modes.short?.difficulty ?? '', g.modes.short?.time ?? '',
    g.classification.routeTags.join('|'), g.classification.exclusionGroups.join('|'),
  ].join('\t'));
}
fs.writeFileSync(path.join(OUT, 'goals-v10.6.tsv'), lines.join('\n'));

// archetype summary
const byArch = {};
for (const g of out) (byArch[g.classification.archetype] ??= []).push(g.name);
let txt = '';
for (const [k, v] of Object.entries(byArch).sort((a, b) => b[1].length - a[1].length)) {
  txt += `\n=== ${k} (${v.length})\n` + v.map((n) => `    ${n}`).join('\n') + '\n';
}
fs.writeFileSync(path.join(OUT, 'goal-archetypes.txt'), txt);

console.log(Object.entries(byArch).map(([k, v]) => `${k}:${v.length}`).sort().join('  '));
console.log('total', out.length);
