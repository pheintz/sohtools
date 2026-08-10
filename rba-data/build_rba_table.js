/*
 * Build the authoritative Reverse Bottle Adventure (RBA) / Bottle Adventure (BA) offset model
 * straight from the OoT decomp at E:/oot, cross-checked against ZeldaSpeedRuns.
 *
 * MECHANIC (decomp-derived):
 *   z_player.c  Player_ProcessItemButtons : sItemButtons = { BTN_B, BTN_CLEFT, BTN_CDOWN, BTN_CRIGHT }
 *                                           this->heldItemButton = i   (0 when the B item is used)
 *   z_player_lib.c Player_UpdateBottleHeld: Inventory_UpdateBottleItem(play, item, this->heldItemButton)
 *   z_parameter.c  Inventory_UpdateBottleItem:
 *        if (items[cButtonSlots[button-1]] == ITEM_BOTTLE_MILK_FULL && item == ITEM_BOTTLE_EMPTY)
 *            item = ITEM_BOTTLE_MILK_HALF;
 *        items[cButtonSlots[button-1]] = item;
 *        buttonItems[button] = item;
 *
 *   ItemEquips = { u8 buttonItems[4] @0x00; u8 cButtonSlots[3] @0x04; u16 equipment @0x08 }
 *   => with the bottle on B, button == 0, so cButtonSlots[-1] is ItemEquips+0x03 == buttonItems[3],
 *      the ITEM ID on C-Right. That ID is used as a raw byte offset into Inventory.
 *
 *   NTSC 1.0: Inventory.items base = 0x11A644, ItemEquips base = 0x11A638.
 */
const fs = require('fs');
const path = require('path');

const OOT = 'E:/oot';
const OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });

const ITEMS_BASE_V10 = 0x11a644;

// ------------------------------------------------------------------ enums
const itemH = fs.readFileSync(path.join(OOT, 'include/item.h'), 'utf8');

function parseEnum(src, name) {
  const m = new RegExp(`typedef enum ${name} \\{([\\s\\S]*?)\\} ${name};`).exec(src);
  if (!m) throw new Error(`enum ${name} not found`);
  const out = [];
  for (const line of m[1].split('\n')) {
    const mm = /^\s*\/\*\s*0x([0-9A-Fa-f]+)\s*\*\/\s*([A-Z0-9_]+)/.exec(line);
    if (mm) out.push({ name: mm[2], value: parseInt(mm[1], 16) });
  }
  return out;
}

const ITEMS = parseEnum(itemH, 'ItemID');
const SLOTS = parseEnum(itemH, 'InventorySlot');
const itemById = new Map(ITEMS.map((e) => [e.value, e.name]));
const slotById = new Map(SLOTS.map((e) => [e.value, e.name]));
const pretty = (n) =>
  n.replace(/^(ITEM|SLOT)_/, '').toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

// ------------------------------------------------------------------ struct map
// Inventory (include/save.h), size 0x5E, lives at SaveInfo+0x58.
const INVENTORY_IN_SAVEINFO = 0x58;
const SCENEFLAGS_IN_SAVEINFO = 0xb8;
const SCENEFLAGS_ENTRY_SIZE = 0x1c; // SavedSceneFlags { chest, swch, clear, collect, unk, rooms, floors }
const SCENEFLAGS_FIELDS = ['chest', 'swch', 'clear', 'collect', 'unk(unused)', 'rooms', 'floors'];

const DUNGEONS = [
  'Deku Tree', "Dodongo's Cavern", 'Jabu-Jabu', 'Forest Temple', 'Fire Temple', 'Water Temple',
  'Spirit Temple', 'Shadow Temple', 'Bottom of the Well', 'Ice Cavern', "Ganon's Tower",
  'Gerudo Training Ground', "Thieves' Hideout", "Inside Ganon's Castle",
  "Ganon's Tower Collapse (interior)", "Inside Ganon's Castle Collapse", 'Treasure Box Shop',
  'Deku Tree Boss Room', "Dodongo's Cavern Boss Room", 'Jabu-Jabu Boss Room',
];
// scene ids 0..123 -> names for OOB sceneFlags decoding (only dungeons named; rest generic)
const SCENE_NAMES = DUNGEONS.slice();

const UPGRADES = [
  { name: 'UPG_QUIVER', shift: 0, bits: 3, caps: [0, 30, 40, 50], label: 'Quiver' },
  { name: 'UPG_BOMB_BAG', shift: 3, bits: 3, caps: [0, 20, 30, 40], label: 'Bomb Bag' },
  { name: 'UPG_STRENGTH', shift: 6, bits: 3, caps: null, label: 'Strength' },
  { name: 'UPG_SCALE', shift: 9, bits: 3, caps: null, label: 'Scale / dive meter' },
  { name: 'UPG_WALLET', shift: 12, bits: 2, caps: [99, 200, 500, 500], label: 'Wallet' },
  { name: 'UPG_BULLET_BAG', shift: 14, bits: 3, caps: [0, 30, 40, 50], label: 'Bullet Bag' },
  { name: 'UPG_DEKU_STICKS', shift: 17, bits: 3, caps: [0, 10, 20, 30], label: 'Deku Stick capacity' },
  { name: 'UPG_DEKU_NUTS', shift: 20, bits: 3, caps: [0, 20, 30, 40], label: 'Deku Nut capacity' },
];
// gUpgradeCapacities[UPG_MAX][4] flattened, so an out-of-range index reads the next row.
const CAP_TABLE_FLAT = [
  0, 30, 40, 50, /* QUIVER */ 0, 20, 30, 40, /* BOMB_BAG */ 0, 0, 0, 0, /* STRENGTH */
  0, 0, 0, 0, /* SCALE */ 99, 200, 500, 500, /* WALLET */ 0, 30, 40, 50, /* BULLET_BAG */
  0, 10, 20, 30, /* DEKU_STICKS */ 0, 20, 30, 40, /* DEKU_NUTS */
];
const capacityFor = (upgIndex, value) => {
  const flat = upgIndex * 4 + value;
  return flat < CAP_TABLE_FLAT.length ? CAP_TABLE_FLAT[flat] : undefined;
};
// Strength upgrade values 4..7 have no capacity, they render gItemIcons[ITEM_STRENGTH_GORONS_BRACELET + v - 1]
const STRENGTH_NAMES = {
  0: 'none', 1: "Goron's Bracelet", 2: 'Silver Gauntlets', 3: 'Golden Gauntlets',
  4: 'BLACK GAUNTLETS (icon: Silver Scale)', 5: 'GREEN GAUNTLETS (icon: Golden Scale)',
  6: 'BLUE GAUNTLETS (icon: Giant\'s Knife)', 7: 'BRONZE GAUNTLETS (icon: Adult\'s Wallet)',
};
const SCALE_NAMES = {
  0: 'none (dive distance 3)', 1: 'Silver Scale', 2: 'Golden Scale',
  3: "broken Giant's Knife icon, dive distance 1", 4: "Adult's Wallet icon, dive distance 1 (JP text)",
  5: "Giant's Wallet icon, dive distance 1 (JP text)", 6: 'Deku Seeds icon, dive distance 1 (JP text)',
  7: 'Fishing Rod icon, dive distance 1 (JP text)',
};
const WALLET_NAMES = { 0: '99 rupees', 1: "Adult's Wallet (200)", 2: "Giant's Wallet (500)", 3: 'holds 500 but count is hidden' };

const QUEST_BITS = {
  0: 'Forest Medallion', 1: 'Fire Medallion', 2: 'Water Medallion', 3: 'Spirit Medallion',
  4: 'Shadow Medallion', 5: 'Light Medallion', 6: 'Minuet of Forest', 7: 'Bolero of Fire',
  8: 'Serenade of Water', 9: 'Requiem of Spirit', 10: 'Nocturne of Shadow', 11: 'Prelude of Light',
  12: "Zelda's Lullaby", 13: "Epona's Song", 14: "Saria's Song", 15: "Sun's Song",
  16: 'Song of Time', 17: 'Song of Storms', 18: "Kokiri's Emerald", 19: "Goron's Ruby",
  20: "Zora's Sapphire", 21: 'Stone of Agony', 22: "Gerudo's Card", 23: 'Gold Skulltula count icon flag',
};
const EQUIP_BITS = {
  0: 'Kokiri Sword', 1: 'Master Sword', 2: "Biggoron's Sword / Giant's Knife", 3: '"Broken" sword flag',
  4: 'Deku Shield', 5: 'Hylian Shield', 6: 'Mirror Shield', 7: '(unused)',
  8: 'Kokiri Tunic', 9: 'Goron Tunic', 10: 'Zora Tunic', 11: '(unused)',
  12: 'Kokiri Boots', 13: 'Iron Boots', 14: 'Hover Boots', 15: '(unused)',
};

// ------------------------------------------------------------------ modifiers
/* Seven code paths write this byte. Exactly one (z_player.c:14114) writes what
   you caught; the other six all write ITEM_BOTTLE_EMPTY. So these six values are
   really two verbs, and the `empty` half is a write you did not ask for. */
const MODIFIERS = [
  { value: 0x14, name: 'Empty bottle', item: 'ITEM_BOTTLE_EMPTY', verb: 'empty',
    trigger: 'Empty the bottle: drink a potion/milk, release a fish/bug/blue fire, sell a Poe or Big Poe (En_Gb), give a bottled thing to the Hylian beggar (En_Hy), or auto-use a bottled fairy on death.' },
  { value: 0x18, name: 'Fairy', item: 'ITEM_BOTTLE_FAIRY', verb: 'catch', trigger: 'Catch a fairy (ACTOR_EN_ELF).' },
  { value: 0x19, name: 'Fish', item: 'ITEM_BOTTLE_FISH', verb: 'catch', trigger: 'Catch a fish (ACTOR_EN_FISH).' },
  { value: 0x1c, name: 'Blue fire', item: 'ITEM_BOTTLE_BLUE_FIRE', verb: 'catch', trigger: 'Catch blue fire (ACTOR_EN_ICE_HONO). Child can reach Ice Cavern by hovering.' },
  { value: 0x1d, name: 'Bug', item: 'ITEM_BOTTLE_BUG', verb: 'catch', trigger: 'Catch bugs (ACTOR_EN_INSECT).' },
  { value: 0x1f, name: 'Half milk', item: 'ITEM_BOTTLE_MILK_HALF', verb: 'empty',
    conditional: true,
    trigger: 'Empty the bottle WHILE the target byte already reads 0x1A (26). Inventory_UpdateBottleItem substitutes MILK_HALF for EMPTY based on the value at the TARGET address, not on what is on B.' },
];

// ------------------------------------------------------------------ reachability of a C-Right item id
// The C-Right item id is items[cButtonSlots[2]] as written by the pause menu, so only values that can
// legitimately live in an inventory slot are reachable (plus the Bomb Bag (20) upgrade oddity).
function reachability(id) {
  const R = (group, age, how, notes) => ({ reachable: true, group, age, how, notes });
  if (id >= 0x00 && id <= 0x13) {
    // ordinary C-items; note the ones the pause menu never actually puts on a button
    if (id === 0x04 || id === 0x0c || id === 0x12) {
      return R('Magic arrows (needs setup)', 'either (needs setup)',
        'Bare elemental-arrow item. Equipping a magic arrow with a bow puts ITEM_BOW_FIRE/ICE/LIGHT (0x38-0x3A) on the button instead. Two known setups: (a) empty 6th inventory column, equip-swap a bottle/trade item over the arrow slot, time travel twice; (b) RBA a bottle over the magic arrow slot, equip it on a C button as adult, obtain the matching magic arrow, time travel twice (does NOT work for Fire Arrow).',
        'ZSR marks these with a dagger.');
    }
    return R('Items', 'either (age-restricted item rules apply)', 'Normal pause-menu equip of the item that lives in this slot.');
  }
  if (id >= 0x14 && id <= 0x20) return R('Bottles', 'either', 'Equip a bottle whose contents have that id (bottle slots 18-21).');
  if (id >= 0x21 && id <= 0x2c) return R('Child trade / masks', 'child', 'Child trade / mask slot (SLOT_TRADE_CHILD). Only one child trade item exists at a time.');
  if (id >= 0x2d && id <= 0x37) return R('Adult trade', 'adult', 'Adult trade slot (SLOT_TRADE_ADULT). Only one adult trade item exists at a time; the sequence is one-way.');
  if (id >= 0x38 && id <= 0x3a) return R('Bow + magic arrow', 'adult', 'Equip Fire/Ice/Light Arrow to C-Right while owning the Fairy Bow: the button stores ITEM_BOW_FIRE/ICE/LIGHT.');
  if (id === 0x4d) return R('Upgrade oddity', 'either', 'Bomb Bag (20) lands in the BOMBCHU inventory slot via the Dodongo\'s Cavern Upgrade Oddity (open the DC bomb bag chest while already owning any bomb bag). It can then be equipped to C-Right.', 'This permanently blocks ever obtaining Bombchus; it also acts as Eyedrops for Biggoron.');
  return { reachable: false, group: null, age: null, how: 'No known way to place this item id on C-Right.', notes: 'Row is theoretical (address mnemonic only).' };
}

// adult trade sequence order, for the "one-way cursor" planning constraint
const ADULT_TRADE_ORDER = [0x2d, 0x2e, 0x2f, 0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37];
const CHILD_TRADE_ORDER = [0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2a, 0x2b, 0x2c];

// ------------------------------------------------------------------ offset -> field
function describeOffset(off) {
  if (off < 0x18) return { region: 'items', kind: 'itemSlot', slot: off, field: `Inventory.items[${off}] = ${slotById.get(off)}` };
  if (off < 0x28) { const s = off - 0x18; return { region: 'ammo', kind: 'ammo', slot: s, field: `Inventory.ammo[${s}] = ammo for ${slotById.get(s)}` }; }
  if (off < 0x2a) return { region: 'equipment', kind: 'equipBitfield', byteIndex: off - 0x28, field: `Inventory.equipment byte ${off - 0x28}` };
  if (off < 0x2c) return { region: 'padding', kind: 'padding', field: `padding between Inventory.equipment and Inventory.upgrades (+0x${off.toString(16)}) — always zero, unused` };
  if (off < 0x30) return { region: 'upgrades', kind: 'upgradeBitfield', byteIndex: off - 0x2c, field: `Inventory.upgrades byte ${off - 0x2c}` };
  if (off < 0x34) return { region: 'questItems', kind: 'questBitfield', byteIndex: off - 0x30, field: `Inventory.questItems byte ${off - 0x30}` };
  if (off < 0x48) { const d = off - 0x34; return { region: 'dungeonItems', kind: 'dungeonItems', dungeon: d, field: `Inventory.dungeonItems[${d}] = ${DUNGEONS[d]}` }; }
  if (off < 0x5b) { const d = off - 0x48; return { region: 'dungeonKeys', kind: 'dungeonKeys', dungeon: d, field: `Inventory.dungeonKeys[${d}] = ${DUNGEONS[d]}` }; }
  if (off === 0x5b) return { region: 'defenseHearts', kind: 'scalar', field: 'Inventory.defenseHearts' };
  if (off < 0x5e) return { region: 'gsTokens', kind: 'scalar16', byteIndex: off - 0x5c, field: `Inventory.gsTokens byte ${off - 0x5c} (${off === 0x5c ? 'high' : 'low'})` };
  // past the Inventory struct -> SaveInfo
  const inSaveInfo = INVENTORY_IN_SAVEINFO + off;
  if (inSaveInfo < SCENEFLAGS_IN_SAVEINFO) return { region: 'saveInfoGap', kind: 'oob', field: `SaveInfo+0x${inSaveInfo.toString(16)} (between Inventory and sceneFlags)` };
  const rel = inSaveInfo - SCENEFLAGS_IN_SAVEINFO;
  const idx = Math.floor(rel / SCENEFLAGS_ENTRY_SIZE);
  const within = rel % SCENEFLAGS_ENTRY_SIZE;
  if (idx < 124) {
    const fieldName = SCENEFLAGS_FIELDS[Math.floor(within / 4)];
    const byteInWord = within % 4;
    return {
      region: 'sceneFlags', kind: 'oob',
      field: `SaveInfo.sceneFlags[${idx}]${SCENE_NAMES[idx] ? ` (${SCENE_NAMES[idx]})` : ''}.${fieldName} byte ${byteInWord} (bits ${31 - byteInWord * 8}..${24 - byteInWord * 8})`,
    };
  }
  return { region: 'beyondSceneFlags', kind: 'oob', field: `SaveInfo+0x${inSaveInfo.toString(16)} (past sceneFlags)` };
}

// ------------------------------------------------------------------ decode a write
const ASSIGNING = ['itemSlot', 'ammo', 'upgradeBitfield', 'dungeonKeys', 'scalar', 'scalar16'];

/* Bits RBA can never be the first to set.
   5-7: no writable value contains them.
   1  : only 31 contains it, and 31 requires the target byte to already read
        26 (0b00011010), which already has bit 1 — so the precondition is
        circular. Proved in validate_claims.js, which gates the build. */
const UNREACHABLE_BITS = new Set([1, 5, 6, 7]);
const unreachable = (b) => UNREACHABLE_BITS.has(b);

function decodeWrite(desc, value) {
  const grants = [];
  const erases = [];
  const permanent = []; // cleared bits living in 5-7, which no modifier can ever set again
  const notes = [];
  // 'flags' bytes hold independent switches, so gained/lost is meaningful.
  // 'assign' bytes hold a value; whether a write helps depends on what you had,
  // so the page must not call it a gain.
  let mode = ASSIGNING.indexOf(desc.kind) !== -1 ? 'assign' : 'flags';
  if (desc.kind === 'questBitfield' && desc.byteIndex === 0) mode = 'assign'; // heart piece count
  switch (desc.kind) {
    case 'itemSlot':
      grants.push(`${slotById.get(desc.slot)} now holds ${itemById.get(value)} (0x${value.toString(16)})`);
      erases.push(`whatever item was in ${slotById.get(desc.slot)} is gone`);
      if (desc.slot >= 0x12 && desc.slot <= 0x15) notes.push('This is already a bottle slot, so the write is close to normal behaviour.');
      else notes.push('A bottle written into a non-bottle slot cannot be equipped by an age that cannot use that slot.');
      break;
    case 'ammo':
      grants.push(`ammo for ${slotById.get(desc.slot)} := ${value} (written raw, not capped)`);
      break;
    case 'equipBitfield': {
      const base = desc.byteIndex === 0 ? 8 : 0;
      for (let b = 0; b < 8; b++) {
        const nm = EQUIP_BITS[base + b];
        if (nm === '(unused)') continue;
        if (value & (1 << b)) grants.push(nm);
        else (unreachable(b) ? permanent : erases).push(nm);
      }
      break;
    }
    case 'upgradeBitfield': {
      const bitBase = (3 - desc.byteIndex) * 8;
      for (let ui = 0; ui < UPGRADES.length; ui++) {
        const u = UPGRADES[ui];
        const lo = u.shift, hi = u.shift + u.bits - 1;
        if (hi < bitBase || lo > bitBase + 7) continue;
        const oLo = Math.max(lo, bitBase), oHi = Math.min(hi, bitBase + 7);
        const n = oHi - oLo + 1;
        const chunk = (value >> (oLo - bitBase)) & ((1 << n) - 1);
        if (n !== u.bits) {
          notes.push(`${u.label}: bits ${oLo}-${oHi} of ${lo}-${hi} := ${chunk} (PARTIAL — combines with the bits held in the neighbouring byte)`);
          if (oLo >= 5) permanent.push(`${u.label} bits ${oLo}-${oHi} — RBA can only ever write 0 here`);
        } else if (u.name === 'UPG_STRENGTH') {
          grants.push(`Strength := ${chunk} → ${STRENGTH_NAMES[chunk]}`);
        } else if (u.name === 'UPG_SCALE') {
          grants.push(`Scale := ${chunk} → ${SCALE_NAMES[chunk]}`);
          if (chunk > 2) erases.push('Silver/Golden Scale (dive meter broken to distance 1)');
        } else if (u.name === 'UPG_WALLET') {
          grants.push(`Wallet := ${chunk} → ${WALLET_NAMES[chunk]}`);
        } else {
          const cap = capacityFor(ui, chunk);
          const oor = chunk > 3;
          const line = `${u.label} := ${chunk}${oor ? ` (OUT OF RANGE — gUpgradeCapacities read spills into the next row → capacity ${cap})` : ` (capacity ${cap})`}`;
          // capacity 0 means the upgrade is effectively gone, however the raw
          // field value compares — a quiver at index 4 reads 0 arrows, not more
          (cap === 0 ? erases : grants).push(line);
        }
      }
      break;
    }
    case 'questBitfield': {
      if (desc.byteIndex === 0) {
        grants.push(`Heart Piece count (bits 28-31) := ${(value >> 4) & 0xf}`);
        notes.push('Low nibble (bits 24-27) is unused.');
      } else {
        const bitBase = (3 - desc.byteIndex) * 8;
        for (let b = 0; b < 8; b++) {
          const nm = QUEST_BITS[bitBase + b];
          if (!nm) continue;
          if (value & (1 << b)) grants.push(nm);
          else (unreachable(b) ? permanent : erases).push(nm);
        }
      }
      break;
    }
    case 'dungeonItems': {
      const g = [];
      if (value & 1) g.push('Boss Key');
      if (value & 2) g.push('Compass');
      if (value & 4) g.push('Map');
      grants.push(`${DUNGEONS[desc.dungeon]}: ${g.join(' + ') || 'nothing'}`);
      // the Compass is bit 1, so RBA can clear it but never set it again
      const lost = ['Boss Key', 'Map'].filter((n, i) => !(value & (1 << [0, 2][i])));
      if (lost.length) erases.push(`${DUNGEONS[desc.dungeon]}: ${lost.join(', ')}`);
      if (!(value & 2)) permanent.push(`${DUNGEONS[desc.dungeon]}: Compass`);
      notes.push(`bits 3-7 := ${value >> 3} (unused by the game)`);
      break;
    }
    case 'dungeonKeys':
      grants.push(`${DUNGEONS[desc.dungeon]} small key count := ${value}`);
      break;
    case 'scalar':
    case 'scalar16':
      grants.push(`byte := ${value}`);
      break;
    default:
      notes.push('No gameplay effect (unused/padding byte).');
  }
  return { value, dec: value, mode, grants, erases, permanent, notes };
}

// ------------------------------------------------------------------ emit
/* The eight switches living in a bitfield byte, bit 0 first, null where the game leaves a bit
   unused. These labels already exist above as QUEST_BITS / EQUIP_BITS / the dungeon-item bits; they
   are emitted so a consumer can render a labelled byte instead of re-deriving the mapping by
   parsing the grants/erases prose. Deriving names from display strings is exactly the mistake the
   gauntlet table taught this project not to repeat.

   Null for everything else on purpose: an ammo count or a key count is a NUMBER, not eight
   switches, and drawing labelled bits over it would invent a meaning the byte does not have. */
function bitLabelsFor(desc) {
  switch (desc.kind) {
    case 'equipBitfield': {
      const base = desc.byteIndex === 0 ? 8 : 0;
      return Array.from({ length: 8 }, (_, b) => {
        const nm = EQUIP_BITS[base + b];
        return !nm || nm === '(unused)' ? null : nm;
      });
    }
    case 'questBitfield': {
      if (desc.byteIndex === 0) return null; // heart-piece count: a number in the high nibble
      const base = (3 - desc.byteIndex) * 8;
      return Array.from({ length: 8 }, (_, b) => QUEST_BITS[base + b] || null);
    }
    case 'dungeonItems':
      return ['Boss Key', 'Compass', 'Map', null, null, null, null, null];
    default:
      return null;
  }
}

const rows = [];
for (let off = 0; off <= 0xff; off++) {
  const itemName = itemById.get(off);
  const desc = describeOffset(off);
  const reach = reachability(off);
  if (!itemName && !reach.reachable && off > 0x5e) continue; // trim the long unreachable tail
  const writes = MODIFIERS.map((m) => ({
    modifier: m.name,
    modifierValue: `0x${m.value.toString(16)} (${m.value})`,
    conditional: m.conditional
      ? 'only if the target byte currently reads 0x1A (26)'
      : undefined,
    ...decodeWrite(desc, m.value),
  }));
  rows.push({
    offset: off,
    offsetHex: `0x${off.toString(16).padStart(2, '0')}`,
    cRightItemId: itemName || `(no ItemID 0x${off.toString(16)})`,
    cRightItemName: itemName ? pretty(itemName) : null,
    ntsc10Address: `0x${(ITEMS_BASE_V10 + off).toString(16).toUpperCase()}`,
    target: desc.field,
    region: desc.region,
    bits: bitLabelsFor(desc),
    reachable: reach.reachable,
    age: reach.age,
    howToGetOnCRight: reach.how,
    itemGroup: reach.group,
    reachabilityNotes: reach.notes,
    adultTradeStage: ADULT_TRADE_ORDER.indexOf(off) >= 0 ? ADULT_TRADE_ORDER.indexOf(off) + 1 : undefined,
    childTradeStage: CHILD_TRADE_ORDER.indexOf(off) >= 0 ? CHILD_TRADE_ORDER.indexOf(off) + 1 : undefined,
    writes,
  });
}

const model = {
  /* Provenance, split by how it was actually established — this used to list seven decomp files as
     though the script read them all. It reads one. Everything else was read by hand once and then
     hardcoded here, which is a materially weaker guarantee: a struct field moving in the decomp
     would leave this parsing cleanly while every bit meaning silently went stale. Saying so is the
     honest version, and it is the open item that would close it. */
  generatedFrom: {
    decomp: OOT,
    parsedAtBuildTime: [
      'include/item.h — the ItemID and InventorySlot enums, re-read on every build',
    ],
    hardcodedFromReading: {
      note: 'read by hand from the decomp and transcribed into build_rba_table.js. NOT verified against source at build time.',
      files: [
        'include/save.h (Inventory / ItemEquips layout and offsets)',
        'src/code/z_inventory.c (gItemSlots, gUpgradeMasks/Shifts/Capacities, gEquipMasks/Shifts)',
        'src/code/z_parameter.c (Item_Give, Inventory_UpdateBottleItem, Inventory_ReplaceItem)',
        'src/code/z_player_lib.c (Player_UpdateBottleHeld)',
        'src/overlays/actors/ovl_player_actor/z_player.c (sItemButtons, sBottleCatchInfo)',
        'src/overlays/actors/ovl_En_Gb (Poe salesman), ovl_En_Hy (Hylian beggar)',
      ],
    },
    crossCheckedWith: 'zeldaspeedruns.com/oot/ba/* (see research-zsr.md)',
  },
  addresses: {
    version: 'NTSC 1.0',
    itemEquipsBase: '0x11A638',
    inventoryItemsBase: '0x11A644',
    note: 'offset used by RBA == the ITEM ID sitting on C-Right (buttonItems[3], 0x11A63B)',
  },
  modifiers: MODIFIERS,
  rows,
};

fs.writeFileSync(path.join(OUT, 'rba-offsets.json'), JSON.stringify(model, null, 1));

// ---- readable report
let txt = '';
txt += 'REVERSE BOTTLE ADVENTURE — full offset model (decomp-derived, NTSC 1.0 addresses)\n';
txt += '='.repeat(110) + '\n';
txt += 'items[ buttonItems[3] ] = <bottle value>   where buttonItems[3] is the ITEM ID on C-Right.\n';
txt += 'Writable values: 0x14 empty, 0x18 fairy, 0x19 fish, 0x1C blue fire, 0x1D bug, 0x1F half-milk*\n';
txt += '  * half-milk only when the target byte already reads 0x1A (26)\n';
txt += '='.repeat(110) + '\n';
for (const r of rows) {
  txt += `\n${r.offsetHex} (${r.offset})  C-Right = ${r.cRightItemName || r.cRightItemId}   @${r.ntsc10Address}\n`;
  txt += `    target : ${r.target}   [${r.region}]\n`;
  txt += `    reach  : ${r.reachable ? `YES (${r.age})` : 'NO'} — ${r.howToGetOnCRight}\n`;
  if (r.reachabilityNotes) txt += `             ${r.reachabilityNotes}\n`;
  if (r.adultTradeStage) txt += `    adult trade stage ${r.adultTradeStage}/11\n`;
  if (r.childTradeStage) txt += `    child trade stage ${r.childTradeStage}/12\n`;
  for (const w of r.writes) {
    if (!w.grants.length && !w.erases.length && !w.notes.length) continue;
    txt += `      ${w.modifier} (${w.modifierValue})${w.conditional ? ` [${w.conditional}]` : ''}:\n`;
    for (const g of w.grants) txt += `          + ${g}\n`;
    for (const e of w.erases) txt += `          - LOSES ${e}\n`;
    for (const n of w.notes) txt += `          . ${n}\n`;
  }
}
fs.writeFileSync(path.join(OUT, 'rba-offsets.txt'), txt);

console.log(`rows: ${rows.length}, reachable: ${rows.filter((r) => r.reachable).length}`);
console.log('regions reachable:', [...new Set(rows.filter((r) => r.reachable).map((r) => r.region))].join(', '));
