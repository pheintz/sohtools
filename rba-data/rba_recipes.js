/*
 * Curated RBA "recipes" for OoT Bingo v10.6.
 *
 * Every entry is derived from the decomp model in out/rba-offsets.json and cross-checked against
 * zeldaspeedruns.com (see out/research-zsr.md). Fields:
 *
 *   key            stable id
 *   cRight         { itemId, name, offsetHex, target }   -- the C-Right item that selects the byte
 *   stage          adult/child trade-sequence position, if applicable
 *   age            'child' | 'adult' | 'either'
 *   modifiers      per usable bottle value: what it grants and what it destroys
 *   satisfies      v10.6 goal names this recipe can complete outright
 *   enables        v10.6 goal names it makes much cheaper (with the follow-up step spelled out)
 *   destroys       v10.6 goal names it can invalidate  (the "RBA traps")
 *   permanentLoss  state that can NEVER be rewritten by any modifier
 *   notes          ordering constraints, verification status
 *
 * `confidence` values: 'decomp' (proved from source), 'zsr' (community-documented, consistent with
 * source), 'inferred' (my reasoning from the two, flagged for verification).
 */

const MOD = { EMPTY: 20, FAIRY: 24, FISH: 25, BLUEFIRE: 28, BUG: 29, HALFMILK: 31 };

const RECIPES = [
  // ------------------------------------------------------------------ items / ammo
  {
    key: 'itemslot-generic',
    // reaching 31 needs the TARGET byte to already read 26, different on every byte
    halfMilk: { ok: false, how: "Not useful here. A real bottle slot is the only place full milk can sit, so there is nothing to set up." },
    cRight: { itemId: '0x00-0x17', name: 'any C-item / bottle / potion', offsetHex: '0x00-0x17', target: 'Inventory.items[id]' },
    age: 'either',
    summary: 'Writes a bottle item id over the inventory slot whose index equals the C-Right item id. The slot written is NOT the slot the C-Right item lives in. It is `items[<item id>]`.',
    modifiers: {
      [MOD.EMPTY]: 'slot := Empty Bottle', [MOD.FAIRY]: 'slot := Bottled Fairy', [MOD.FISH]: 'slot := Bottled Fish',
      [MOD.BLUEFIRE]: 'slot := Bottled Blue Fire', [MOD.BUG]: 'slot := Bottled Bug', [MOD.HALFMILK]: 'slot := Half Milk (needs target == 26)',
    },
    /* 'Bottled Fairy' and 'Blue Fire' used to be listed here and were circular. The value this
       recipe writes IS a bottle content, so to write blue fire you must already be holding blue
       fire in the bottle on B -- at which point the goal is done and no RBA happened. What the
       write genuinely does is put a bottle content into a slot that is not a bottle, which fills
       slots and duplicates contents; it cannot obtain a content you do not already have. */
    satisfies: ['Fill 20 Item Inventory Slots', 'Fill all 4 Bottle Slots'],
    enables: ['7 Different Bottled Contents'],
    enablesNotes: {
      '7 Different Bottled Contents':
        'RBA is what makes this reachable at all: writing bottle ids into non-bottle slots is the only way to hold more than four contents , but it cannot finish the goal alone. ' +
        'The official clarification says the empty bottle does not count, which rules out modifier 20, and half milk (31) is unreachable on an item slot because there is no way to leave the target byte reading 26. ' +
        'That leaves four counting contents from RBA: fairy, fish, blue fire, bug. The remaining three must be genuinely obtained, milk, a potion, a poe, a big poe or Ruto’s letter.',
    },
    destroys: [],
    keyMappings: [
      ['Ocarina of Time (0x08)', 'Bombchu slot'],
      ['Bombchus (0x09)', 'Hookshot / Longshot slot'],
      ['Hookshot (0x0A)', 'Ice Arrow slot'],
      ['Longshot (0x0B)', "Farore's Wind slot"],
      ['Farore\'s Wind (0x0D)', 'Lens of Truth slot'],
      ['Boomerang (0x0E)', 'Magic Bean slot'],
      ['Lens of Truth (0x0F)', 'Megaton Hammer slot'],
      ['Magic Bean (0x10)', 'Light Arrow slot'],
      ['Megaton Hammer (0x11)', "Nayru's Love slot"],
      ['Light Arrow (0x12)', 'Bottle #1'],
      ["Nayru's Love (0x13)", 'Bottle #2'],
      ['Empty Bottle (0x14)', 'Bottle #3'],
      ['Red Potion (0x15)', 'Bottle #4'],
      ['Green Potion (0x16)', 'ADULT TRADE slot'],
      ['Blue Potion (0x17)', 'CHILD TRADE slot'],
    ],
    traps: [
      'Green Potion on C-Right overwrites the ADULT TRADE item, this can strand the adult trade sequence and kill every later trade-stage RBA plus Biggoron\'s Sword.',
      'Blue Potion on C-Right overwrites the CHILD TRADE item (masks).',
      'A bottle written into a slot the current age cannot use (e.g. Hookshot as child) cannot be equipped by that age.',
    ],
    confidence: 'decomp',
  },
  {
    key: 'ammo-bombchu',
    // reaching 31 needs the TARGET byte to already read 26, different on every byte
    halfMilk: { ok: true, how: "Get the Bombchu count to exactly 26, then empty the bottle. Swap C-Right straight after, or re-catching resets it." },
    cRight: { itemId: '0x20', name: 'Bottled Poe', offsetHex: '0x20', target: 'Inventory.ammo[SLOT_BOMBCHU]' },
    age: 'either',
    summary: 'Bombchu ammo count := modifier. The canonical demo: catch a fairy on the B bottle with a bottled Poe on C-Right → 24 Bombchus.',
    modifiers: { 20: '20 chus', 24: '24 chus', 25: '25 chus', 28: '28 chus', 29: '29 chus', 31: '31 chus (needs 26 first)' },
    satisfies: [],
    enables: ['Win Bombchu Bowling Prize', 'Get Bombchu chest in Spirit Temple', 'Open Bombchu chest in Spirit Temple'],
    notes: ['Requires a Poe in a bottle, i.e. the Poe salesman / Poe actors. Ammo is written raw, not clamped.'],
    confidence: 'decomp+zsr',
  },
  {
    key: 'ammo-beans',
    // reaching 31 needs the TARGET byte to already read 26, different on every byte
    halfMilk: { ok: true, how: "Get the bean count to exactly 26, then empty the bottle." },
    cRight: { itemId: '0x26', name: 'Spooky Mask', offsetHex: '0x26', target: 'Inventory.ammo[SLOT_MAGIC_BEAN]' },
    stage: { sequence: 'child mask', position: 6 },
    age: 'child',
    summary: 'Magic Bean count := modifier. 20-31 beans from a single write.',
    modifiers: { 20: '20 beans', 24: '24 beans', 25: '25 beans', 28: '28 beans', 29: '29 beans', 31: '31 beans (needs 26 first)' },
    satisfies: ['5 Magic Beans', '6 Magic Beans', '7 Magic Beans', '8 Magic Beans'],
    enables: ['Plant 3 Magic Beans', 'Plant 4 Magic Beans', 'Plant 5 Magic Beans', 'Plant 6 Magic Beans', 'Plant 7 Magic Beans', 'Plant bean in Death Mountain Crater'],
    display:
      'You must already own at least one Magic Bean before the write. KaleidoScope_DrawItemPage draws an ammo count only when `inventory.items[i] != ITEM_NONE` (z_kaleido_item.c:533), so an RBA bean count on an empty bean slot displays nothing at all, and the official clarification is that the item must display visually in inventory to count. Buy one bean (10 rupees) first, then write the count.',
    notes: [
      'Bingo marks all bean goals with incbeans:100, so only one bean goal can appear per row/board.',
      'Requires being at the Spooky Mask stage of the child mask trade sequence.',
      'Ammo-writing recipes in general inherit the z_kaleido_item.c:533 rule: the count renders only if the slot holds a real item.',
    ],
    confidence: 'decomp+zsr',
  },
  {
    key: 'ammo-beans-bought',
    // reaching 31 needs the TARGET byte to already read 26, different on every byte
    halfMilk: { ok: true, how: "Get the counter to exactly 26 first, though anything above 9 has already stopped the seller." },
    cRight: { itemId: '0x27', name: 'Bunny Hood', offsetHex: '0x27', target: 'Inventory.ammo[SLOT_HAMMER] == BEANS_BOUGHT' },
    stage: { sequence: 'child mask', position: 7 },
    age: 'child',
    summary: 'The bean salesman\'s price counter (`BEANS_BOUGHT` = AMMO(ITEM_MAGIC_BEAN + 1) = ammo[SLOT_HAMMER]).',
    destroys: [],
    traps: ['Any modifier sets this to 20-31. Values above 9 make the Zora\'s River bean seller refuse to sell beans at all, this permanently blocks buying beans for the rest of the run.'],
    confidence: 'decomp+zsr',
  },

  // ------------------------------------------------------------------ equipment (child masks)
  {
    key: 'equip-tunics-boots',
    // reaching 31 needs the TARGET byte to already read 26, different on every byte
    halfMilk: {
      ok: true,
      needs: 26,
      how: "Byte must read 26 = Goron Tunic + Kokiri Boots + bit 3. Bit 3 is unused by the game, so it is 0 until an RBA write sets it, and the write assigns the whole byte rather than OR-ing. Then empty.",
    },
    cRight: { itemId: '0x28', name: 'Goron Mask', offsetHex: '0x28', target: 'Inventory.equipment high byte (tunics bits 8-11, boots bits 12-15)' },
    stage: { sequence: 'child mask', position: 8 },
    age: 'child',
    summary: 'Rewrites the owned-tunic and owned-boot flags. Bit values: Kokiri Tunic 1, Goron Tunic 2, Zora Tunic 4, Kokiri Boots 16, Iron Boots 32, Hover Boots 64.',
    modifiers: {
      20: 'Zora Tunic + Kokiri Boots',
      24: 'Kokiri Boots only (NO tunic owned)',
      25: 'Kokiri Tunic + Kokiri Boots',
      28: 'Zora Tunic + Kokiri Boots',
      29: 'Kokiri Tunic + Zora Tunic + Kokiri Boots',
      31: 'Kokiri + Goron + Zora Tunic + Kokiri Boots (needs target == 26 = Goron Tunic + bit3 + Kokiri Boots)',
    },
    // Goron Tunic is bit 1 of this byte: only the value 31 sets it, and 31 needs the
    // byte to already read 26, which contains bit 1. So RBA can never grant it, but
    // "3 Tunics" is still reachable, because 31 adds the Kokiri and Zora tunics on top
    // of the Goron Tunic the precondition already required.
    satisfies: ['Zora Tunic', '3 Tunics'],
    practicality: 'MECHANICALLY TRUE, NOT A KNOWN BINGO ROUTE. None of Goron Tunic, Zora Tunic, 3 Tunics, Iron Boots or 3 Boots carries any mask/equipment-RBA synergy in v10.6 (they use gtunic / zfadult / inctunic / dmc), so the goal list does not treat this as a strategy, presumably because it needs the child mask sequence far enough to borrow the Goron Mask. Treat the satisfies/destroys lists here as theoretical.',
    permanentLoss: ['Iron Boots (bit 32)', 'Hover Boots (bit 64)'],
    destroys: ['Iron Boots', 'Goron Tunic', '3 Boots', '3 Tunics & 3 Boots', '3 Shields & 3 Boots', '3 Swords & 3 Boots', '3 Swords, Tunics, Boots, and Shields'],
    // every one of these needs Iron or Hover Boots, and neither can be written back
    destroysPermanently: ['Iron Boots', '3 Boots', '3 Tunics & 3 Boots', '3 Shields & 3 Boots', '3 Swords & 3 Boots', '3 Swords, Tunics, Boots, and Shields'],
    traps: [
      'No modifier reaches 32 or 64, so Iron Boots and Hover Boots are ALWAYS erased and can only come back by re-collecting them.',
      'Only "3 Tunics" is reachable and only via half-milk, which needs the byte to already read 26.',
      'Oddity: delete the Kokiri Tunic then let a Like-Like eat the remaining tunic, the game re-equips the Kokiri Tunic you do not own.',
    ],
    confidence: 'decomp+zsr',
  },
  {
    key: 'equip-swords-shields',
    // reaching 31 needs the TARGET byte to already read 26, different on every byte
    halfMilk: {
      ok: true,
      needs: 26,
      how: "Byte must read 26 = Master Sword + broken-sword flag + Deku Shield, nothing else. The Kokiri Sword bit is the obstacle: normal play never clears it, and the write assigns the whole byte rather than OR-ing. Then empty.",
    },
    cRight: { itemId: '0x29', name: 'Zora Mask', offsetHex: '0x29', target: 'Inventory.equipment low byte (swords bits 0-3, shields bits 4-7)' },
    stage: { sequence: 'child mask', position: 9 },
    age: 'child',
    summary: "Rewrites owned swords and shields. Kokiri Sword 1, Master Sword 2, Biggoron's Sword / Giant's Knife 4, \"Broken\" flag 8, Deku Shield 16, Hylian Shield 32, Mirror Shield 64.",
    modifiers: {
      20: "Biggoron's Sword + Deku Shield (loses Kokiri and Master Sword)",
      24: 'Broken flag + Deku Shield only (SWORDLESS)',
      25: 'Kokiri Sword + Broken flag + Deku Shield',
      28: "Biggoron's Sword + Broken flag + Deku Shield",
      29: "Kokiri Sword + Biggoron's Sword + Broken flag + Deku Shield",
      31: "Kokiri + Master + Biggoron's + Broken + Deku Shield (needs target == 26 = Master + Broken + Deku Shield)",
    },
    // Shields are bits 4-6 and only Deku (bit 4) is reachable, so no write can ever
    // leave you holding two. "3 Swords" is fine: 31 sets Kokiri, Master and Biggoron.
    satisfies: ['3 Swords'],
    practicality: 'MECHANICALLY TRUE, NOT A KNOWN BINGO ROUTE. 3 Swords is priced on cuccorba / silverscale / bulletbag / wallet and Mirror Shield on gfadult / spirit / spirithover, neither carries a Zora-Mask signal, so v10.6 does not consider this a strategy. Theoretical.',
    permanentLoss: ['Hylian Shield (bit 32)', 'Mirror Shield (bit 64)'],
    destroys: ['Mirror Shield', '3 Shields', '2 Shields', '3 Swords & 3 Shields', '3 Shields & 3 Tunics', '3 Shields & 3 Boots', '3 Swords, Tunics, Boots, and Shields'],
    // all of these need Hylian and/or Mirror Shield, which sit in the dead bits
    destroysPermanently: ['Mirror Shield', '3 Shields', '2 Shields', '3 Swords & 3 Shields', '3 Shields & 3 Tunics', '3 Shields & 3 Boots', '3 Swords, Tunics, Boots, and Shields'],
    traps: [
      'Hylian and Mirror Shield are ALWAYS erased (no modifier reaches 32/64).',
      'Most modifiers clear the Master Sword bit → swordless adult, which changes Adult Reset behaviour on time travel.',
      "Biggoron's Sword and Giant's Knife share bit 2; a separate flag (playerData.swordHealth / bgsFlag) decides which one it acts as.",
      'Setting only the "Broken" flag draws a broken-sword icon the cursor skips over.',
    ],
    confidence: 'decomp+zsr',
  },

  // ------------------------------------------------------------------ upgrades (adult trade)
  {
    key: 'upg-sticks-nuts',
    // reaching 31 needs the TARGET byte to already read 26, different on every byte
    halfMilk: { ok: false, how: "ZSR lists Pocket Egg as impossible to half-milk. No reachable state leaves this byte at 26." },
    cRight: { itemId: '0x2D', name: 'Pocket Egg', offsetHex: '0x2D', target: 'Inventory.upgrades byte 1 (nut cap bits 20-22, stick cap bits 17-19, bullet-bag bit 16)' },
    stage: { sequence: 'adult trade', position: 1 },
    age: 'adult',
    summary: 'Deku Nut capacity, Deku Stick capacity, and the top bit of the Bullet Bag value.',
    modifiers: {
      20: 'Stick cap := 2 (20 sticks), Nut cap := 1 (20 nuts), bullet-bag bit16 := 0',
      24: 'Stick cap := 4 (0, cannot pick up sticks), Nut cap := 1 (20)',
      25: 'Stick cap := 4 (0), Nut cap := 1 (20), bullet-bag bit16 := 1',
      28: 'Stick cap := 6 (30 sticks), Nut cap := 1 (20)',
      29: 'Stick cap := 6 (30 sticks), Nut cap := 1 (20), bullet-bag bit16 := 1',
      31: 'Stick cap := 7 (40 sticks), Nut cap := 1 (20), bullet-bag bit16 := 1, unreachable: it would need the byte to read 26 first',
    },
    satisfies: ['Exactly 20 Deku Sticks'],
    display:
      'Modifier 20 writes stick capacity index 2, a legitimate in-game value whose icon renders normally, so the count displays and the "must display visually" clarification is met. Index 6 (30 sticks) is the one with the wrong icon, which is why "Exactly 30 Deku Sticks" is not claimed here.',
    destroys: ['30 Deku Nuts'],
    traps: [
      'Every modifier forces Deku Nut capacity to 1 (20 nuts), so this always destroys a 30/40-nut upgrade.',
      'Stick capacity index 4 means you cannot pick up or buy sticks at all, that also blocks the Deku Stick bottle-dupe setup.',
      'Bingo marks "Exactly 20 Deku Sticks" and "Exactly 30 Deku Sticks" with incsticks:100 (mutually exclusive).',
      'Stick capacity 30 via index 6 (blue fire / bug) shows a wrong icon. The official clarification, "Item must display visually in inventory to count", is the governing text, and it points away from accepting it, but it does not address a wrong CAPACITY icon specifically. Still open; "Exactly 30 Deku Sticks" is deliberately not claimed.',
    ],
    confidence: 'decomp+zsr',
  },
  {
    key: 'upg-wallet-scale-strength-hi',
    // reaching 31 needs the TARGET byte to already read 26, different on every byte
    halfMilk: { ok: false, how: "ZSR lists Pocket Cucco as impossible to half-milk. No reachable state leaves this byte at 26." },
    cRight: { itemId: '0x2E', name: 'Pocket Cucco', offsetHex: '0x2E', target: 'Inventory.upgrades byte 2 (bullet-bag bits 14-15, wallet bits 12-13, scale bits 9-11, strength bit 8)' },
    stage: { sequence: 'adult trade', position: 2 },
    age: 'adult',
    bingoCategory: 'cuccorba',
    summary: 'The single most valuable RBA in bingo. Every modifier sets Wallet := 1 (Adult\'s Wallet, 200 rupees). Odd modifiers additionally set strength bit 8, producing the coloured gauntlets.',
    modifiers: {
      20: "Wallet := Adult's (200); Scale := 2 (GOLDEN SCALE); strength bit8 := 0; bullet-bag bits 14-15 := 0",
      24: "Wallet := Adult's; Scale := 4 (dive meter broken, distance 1); strength bit8 := 0; bullet-bag bits 14-15 := 0",
      25: "Wallet := Adult's; Scale := 4 (broken); strength bit8 := 1 → COLOURED GAUNTLETS; bullet-bag bits 14-15 := 0",
      28: "Wallet := Adult's; Scale := 6 (broken); strength bit8 := 0; bullet-bag bits 14-15 := 0",
      29: "Wallet := Adult's; Scale := 6 (broken); strength bit8 := 1 → COLOURED GAUNTLETS; bullet-bag bits 14-15 := 0",
      31: "Wallet := Adult's; Scale := 7 (broken); strength bit8 := 1; needs target == 26 (ZSR says impossible in practice)",
    },
    satisfies: ["Adult's Wallet", 'Golden Scale', 'Green Gauntlets', 'Blue Gauntlets', 'Bronze Gauntlets'],
    satisfiesNotes: { 'Golden Scale': 'empty-bottle modifier only (scale := 2); every other modifier writes an invalid scale' },
    enables: ["Giant's Wallet", '500 Rupees', "Giant's Knife", '200 Rupees'],
    enablesNotes: {
      "Giant's Wallet":
        "RBA to Adult's Wallet (200), then the 10-token guy in the Kakariko Skulltula House upgrades 200 → Giant's. Bingo's own tracker confirms this: the Giant's Wallet and 500 Rupees goals show a /10 skulltula counter instead of /30.",
      '500 Rupees': 'Same 10-token route as the Giant’s Wallet.',
      "Giant's Knife": 'The 200-rupee Goron City purchase needs a 200-rupee wallet.',
    },
    /* Structured, not prose. The page used to regex this apart to build a table, which broke on the
       one row with a trailing bracket, the same "parse the display string" trap that cost three
       goals their RBA links earlier. Give the consumer fields. */
    gauntletColours: {
      rule: 'strength = (cucco bit 0 << 2) | (existing bits 6-7). The write always adds 4; the colour you end up with is decided by the strength upgrade you ALREADY own.',
      strengthEffect: 'Every coloured gauntlet lifts everything, exactly like the Golden Gauntlets. Only the icon and the goal name differ.',
      values: [
        { strength: 4, colour: 'Black Gauntlets',  prior: null,                 icon: 'Silver Scale',    isGoal: false },
        { strength: 5, colour: 'Green Gauntlets',  prior: "Goron's Bracelet",   icon: 'Golden Scale',    isGoal: true },
        { strength: 6, colour: 'Blue Gauntlets',   prior: 'Silver Gauntlets',   icon: "Giant's Knife",   isGoal: true },
        { strength: 7, colour: 'Bronze Gauntlets', prior: 'Golden Gauntlets',   icon: "Adult's Wallet",  isGoal: true },
      ],
    },
    destroys: ['Silver Scale', 'Golden Scale', 'Bullet Bag (40)', 'Bullet Bag (50)'],
    traps: [
      'Scale: only the empty-bottle modifier leaves a sane value (2 = Golden Scale). Every other modifier writes 4/6/7 → dive distance 1 and a nonsense icon. This is exactly the silverscale:-6 anti-synergy bingo puts on Giant\'s Wallet and the coloured-gauntlet goals.',
      'Bullet Bag: bits 14-15 are always zeroed, so a Bullet Bag (40)/(50) collapses. Combined with the Pocket Egg byte (bit 16) the whole Bullet Bag value can end up in the Quiver-icon range.',
      'Repair path for a wrecked dive meter: the Fishing Pond Golden Scale always overwrites the 4th equipment slot, even over a glitched value. The diving-game Silver Scale likewise always overwrites it.',
      'ORDERING: Pocket Cucco is adult trade stage 2 and Cojiro is stage 3. Once you trade the Cucco away you can never redo this byte, so the coloured-gauntlet write must happen while you still hold the Cucco, and you must already own the strength upgrade that picks the colour.',
    ],
    confidence: 'decomp+zsr',
  },
  {
    key: 'upg-quiver-bombbag-strength-lo',
    // reaching 31 needs the TARGET byte to already read 26, different on every byte
    halfMilk: { ok: true, how: "Hold Bomb Bag (40) and Quiver (40) (= 26), then empty." },
    cRight: { itemId: '0x2F', name: 'Cojiro', offsetHex: '0x2F', target: 'Inventory.upgrades byte 3 (strength bits 6-7, bomb bag bits 3-5, quiver bits 0-2)' },
    stage: { sequence: 'adult trade', position: 3 },
    age: 'adult',
    bingoCategory: 'chucojiro / quiverrba',
    summary: 'The explosives-and-arrows RBA. This is bingo\'s `chucojiro` category: a row either gets explosives from this RBA or from grabbing Bombchus as a child, and being forced to do both is anti-synergy.',
    modifiers: {
      20: 'Quiver := 4 (capacity 0), Bomb Bag := 2 (30 bombs), strength bits 6-7 := 0',
      24: 'Quiver := 0 (none), Bomb Bag := 3 (40 bombs), strength bits 6-7 := 0',
      25: 'Quiver := 1 (30 arrows), Bomb Bag := 3 (40 bombs), strength bits 6-7 := 0',
      28: 'Quiver := 4 (capacity 0), Bomb Bag := 3 (40 bombs), strength bits 6-7 := 0',
      29: 'Quiver := 5 (capacity 20), Bomb Bag := 3 (40 bombs), strength bits 6-7 := 0',
      31: 'Quiver := 7 (capacity 40), Bomb Bag := 3 (40 bombs); needs target == 26 first',
    },
    satisfies: ['Bomb Bag (30)'],
    enables: ['Quiver (40)', 'Quiver (50)'],
    enablesNotes: {
      'Quiver (40)': 'RBA with a fish (25) gives Quiver (30) for free; the Kakariko Shooting Gallery then upgrades 30→40.',
      'Quiver (50)': 'The Gerudo Fortress archery game then upgrades 40→50. BALANCING.md names this route explicitly.',
    },
    alsoEnables: ["Free bombs without doing Dodongo's Cavern: after a bomb-bag write, Adult Reset always equips Bombs to C-Down, so you can pick up and use bombs."],
    permanentLoss: ['strength bits 6-7 can only ever be written as 00'],
    destroys: ['Goron Bracelet', 'Silver Gauntlets', 'Golden Gauntlets', 'Green Gauntlets', 'Blue Gauntlets', 'Bronze Gauntlets'],
    traps: [
      'THE gauntlet trap. Every modifier is < 64, so strength bits 6-7 are always written as 00. If you already made Green/Blue/Bronze Gauntlets with the Pocket Cucco (stage 2), a Cojiro RBA (stage 3) drops you to strength 4 = Black Gauntlets and the goal is lost. Because the trade sequence only moves forward, you cannot redo the Cucco byte to fix it.',
      'Likewise a plain Goron\'s Bracelet / Silver / Golden Gauntlets is wiped. Darunia will NOT re-give the bracelet unless the strength slot reads 0, and after a Cucco write with bit8 set it does not.',
      'Silver/Gold Gauntlet chests DO override any strength value, including coloured gauntlets, so opening one after setting up coloured gauntlets destroys them too.',
      'Quiver values 4 and 5 render as Bomb Bag icons; ZSR reports capacities 0 and 20 which matches the decomp gUpgradeCapacities over-read. The equivalent bomb-bag over-read (values 4-7) is where ZSR and the decomp disagree, see research-zsr.md.',
    ],
    confidence: 'decomp+zsr',
  },

  // ------------------------------------------------------------------ quest status (adult trade)
  {
    key: 'quest-heartpieces',
    // reaching 31 needs the TARGET byte to already read 26, different on every byte
    halfMilk: { ok: false, how: "Not reachable in practice: no writable value leaves this byte at 26, and heart pieces add 16 at a time, so the low nibble can never land on 1010. (Derived here, not stated by ZSR.)" },
    cRight: { itemId: '0x30', name: 'Odd Mushroom', offsetHex: '0x30', target: 'Inventory.questItems byte 0 (heart piece count, bits 28-31)' },
    stage: { sequence: 'adult trade', position: 4 },
    age: 'adult',
    summary: 'Heart-piece counter. Every modifier is in 0x14-0x1F, so `value >> 4` is always 1, so the count is ALWAYS set to exactly 1.',
    modifiers: { 20: 'HP count := 1', 24: 'HP count := 1', 25: 'HP count := 1', 28: 'HP count := 1', 29: 'HP count := 1', 31: 'HP count := 1' },
    satisfies: [],
    destroys: ['5 Hearts', '6 Hearts', '7 Hearts (no duping)', '8 Hearts (no duping)', '9 Hearts (no duping)'],
    traps: [
      'Almost pure downside for bingo: it can only lower a count of 2 or 3 back to 1.',
      'z_message.c converts the nibble to a Heart Container when it reaches 4, so resetting to 1 throws away up to 3 pieces of progress.',
      'It does NOT affect the "Obtain N Different Heart Pieces" goals, which are scored on collected scene flags, only on the actual heart total.',
      'ZSR\'s "23.5 hearts" trick uses this byte deliberately; irrelevant to any v10.6 goal.',
    ],
    confidence: 'decomp+zsr',
  },
  {
    key: 'quest-stones',
    // reaching 31 needs the TARGET byte to already read 26, different on every byte
    halfMilk: {
      ok: true,
      needs: 26,
      how: "Byte must read 26: Song of Storms + Goron’s Ruby + Zora’s Sapphire, nothing else. Then empty.",
    },
    cRight: { itemId: '0x31', name: 'Odd Potion', offsetHex: '0x31', target: 'Inventory.questItems byte 1 (Song of Time 1, Song of Storms 2, Kokiri 4, Goron 8, Zora 16, Agony 32, Gerudo Card 64, GS icon 128)' },
    stage: { sequence: 'adult trade', position: 5 },
    age: 'adult',
    bingoCategory: 'rbastones',
    summary: 'The spiritual-stones RBA. This is bingo\'s `rbastones` synergy (only on the three stone goals).',
    modifiers: {
      20: "Kokiri's Emerald + Zora's Sapphire",
      24: "Goron's Ruby + Zora's Sapphire",
      25: "Song of Time + Goron's Ruby + Zora's Sapphire",
      28: 'ALL THREE STONES',
      29: 'Song of Time + ALL THREE STONES  ← best single write',
      31: "Song of Time + Song of Storms + ALL THREE STONES (needs target == 26 = Song of Storms + Goron's Ruby + Zora's Sapphire)",
    },
    satisfies: ["Kokiri's Emerald", "Goron's Ruby", "Zora's Sapphire"],
    permanentLoss: ['Stone of Agony (32)', "Gerudo's Card (64)", 'Gold Skulltula count icon flag (128)'],
    destroysPermanently: ['Stone of Agony', "Gerudo's Card"],
    destroys: ['Stone of Agony', "Gerudo's Card"],
    traps: [
      'Stone of Agony and Gerudo\'s Card can never be written back, any Odd Potion RBA erases both.',
      'Song of Time is erased unless you use fish (25), bug (29) or half-milk (31). Losing SoT mid-run means no Door of Time and no Song of Time blocks.',
      'The Gold Skulltula icon flag being cleared just hides the token counter, it does not reset `Inventory.gsTokens`.',
    ],
    confidence: 'decomp+zsr',
  },
  {
    key: 'quest-songs',
    // reaching 31 needs the TARGET byte to already read 26, different on every byte
    halfMilk: {
      ok: true,
      needs: 26,
      how: "Byte must read 26: Requiem of Spirit + Prelude of Light + Zelda’s Lullaby, nothing else. Then empty.",
    },
    cRight: { itemId: '0x32', name: "Poacher's Saw", offsetHex: '0x32', target: 'Inventory.questItems byte 2 (Serenade 1, Requiem 2, Nocturne 4, Prelude 8, Lullaby 16, Epona 32, Saria 64, Sun 128)' },
    stage: { sequence: 'adult trade', position: 6 },
    age: 'adult',
    bingoCategory: 'poachers',
    summary: 'The song RBA. This is bingo\'s `poachers` category, carried by 67 goals. Every modifier grants Zelda\'s Lullaby, which is why `poachers` is one of the two documented ways to "have ZL".',
    modifiers: {
      20: "Nocturne + Zelda's Lullaby",
      24: "Prelude + Zelda's Lullaby",
      25: "Serenade + Prelude + Zelda's Lullaby",
      28: "Nocturne + Prelude + Zelda's Lullaby",
      29: "Serenade + Nocturne + Prelude + Zelda's Lullaby  ← 4 songs in one write",
      31: "Serenade + Requiem + Nocturne + Prelude + Zelda's Lullaby  ← 5 songs (needs target == 26 = Requiem + Prelude + Lullaby)",
    },
    // Requiem of Spirit is bit 1, reachable only through 31, whose precondition
    // already contains it. The song-count goals are fine: 29 sets four songs at once.
    satisfies: ['3 Songs', '4 Songs'],
    enables: ['6 Songs', '7 Songs', '8 Songs', '9 Songs', '10 Songs'],
    permanentLoss: ["Requiem of Spirit (bit 1)", "Epona's Song (32)", "Saria's Song (64)", "Sun's Song (128)"],
    destroys: ["Epona's Song", "Saria's Song", '5 Top Row Songs', 'Requiem of Spirit'],
    /* Requiem is bit 1, so RBA can never write it back, and the teach is one-time, every Sheik song in the codebase is gated the same way (Minuet EVENTCHKINF_50,
       Bolero _51, Serenade _52, each with the actor killing itself once the flag is
       set), and the song itself is granted by ocarina playback at z_message.c:3619
       rather than by anything that re-fires. So the loss is permanent.
       Epona and Saria ARE re-learnable in game, but they sit in bits 5-7, so RBA can
       never restore them either, same verdict by a different route. */
    destroysPermanently: ["Epona's Song", "Saria's Song", '5 Top Row Songs', 'Requiem of Spirit'],
    destroysNotes: {
      '5 Top Row Songs': "The top row is ZL / Epona / Saria / Sun / Song of Time / Song of Storms. This RBA grants only ZL out of that row and deletes Epona, Saria and Sun, leaving at most ZL + SoT + SoS = 3. Bingo agrees: '5 Top Row Songs' carries czl / saria / sariattg / suns / storms and NO poachers type, i.e. the list treats the top row as a legit-only collection.",
    },
    traps: [
      "Epona's Song, Saria's Song and Sun's Song are ALWAYS erased and can never be written back, this is why bingo keeps `czl` (child Zelda's Lullaby) and `poachers` as separate synergy columns, and why Saria's Song carries `chuczl`.",
      'Cow in House needs Epona\'s Song; the goal is unreachable after this RBA unless you relearn it at Lon Lon Ranch.',
      'Also erases whichever of Serenade/Requiem/Nocturne/Prelude the chosen modifier does not set.',
      'Side effect from the decomp: obtaining the Poacher\'s Saw itself sets ITEMGETINF_FOREST_STAGE_NUT_UPGRADE (an acknowledged //! @bug), permanently blocking the Forest Stage Deku Nut upgrade, the only missable item in the game.',
    ],
    confidence: 'decomp+zsr',
  },
  {
    key: 'quest-medallions',
    // reaching 31 needs the TARGET byte to already read 26, different on every byte
    halfMilk: {
      ok: true,
      needs: 26,
      how: "Byte must read 26: Fire + Spirit + Shadow Medallions, nothing else. Then empty.",
    },
    cRight: { itemId: '0x33', name: "Broken Goron's Sword", offsetHex: '0x33', target: 'Inventory.questItems byte 3 (Forest 1, Fire 2, Water 4, Spirit 8, Shadow 16, Light 32, Minuet 64, Bolero 128)' },
    stage: { sequence: 'adult trade', position: 7 },
    age: 'adult',
    bingoCategory: 'legitlacs / inclacs',
    summary: 'The medallion RBA. Granting Shadow + Spirit is what triggers the Light Arrow CutScene (LACS) and the rainbow bridge, the basis of the old Any% / "No Wrong Warp" route that skipped every adult dungeon.',
    modifiers: {
      20: 'Water + Shadow Medallion',
      24: 'Spirit + Shadow Medallion  ← LACS trigger',
      25: 'Forest + Spirit + Shadow Medallion',
      28: 'Water + Spirit + Shadow Medallion',
      29: 'Forest + Water + Spirit + Shadow Medallion',
      31: 'Forest + Fire + Water + Spirit + Shadow Medallion (needs target == 26 = Fire + Spirit + Shadow)',
    },
    // Fire Medallion is bit 1, same closed loop. Forest (bit 0) and Water (bit 2)
    // are genuinely reachable.
    satisfies: ['Forest Medallion', 'Water Medallion'],
    enables: ['Light Arrows'],
    permanentLoss: ['Light Medallion (32)', 'Minuet of Forest (64)', 'Bolero of Fire (128)'],
    /* Fire Medallion is the third permanent loss here, and it takes two facts to
       show it: it is bit 1, so RBA can never write it back, AND the Fire Temple
       blue warp is guarded by EVENTCHKINF_49 (z_door_warp1.c:739) rather than by
       the quest bit, so revisiting the boss room will not re-give it.
       Forest and Water are bits 0 and 2, so RBA can simply rewrite them; Spirit
       and Shadow are additionally re-given because their warps check
       CHECK_QUEST_ITEM instead of an event flag. */
    destroysPermanently: ['Minuet of Forest', 'Bolero of Fire', 'Fire Medallion'],
    destroys: ['Minuet of Forest', 'Bolero of Fire', 'Fire Medallion'],
    traps: [
      'ZSR states it plainly: doing Broken Goron\'s Sword RBA permanently deletes your Light Medallion, because no modifier reaches 32. By the same argument Minuet of Forest and Bolero of Fire are also permanently deleted.',
      'Losing Bolero means no Death Mountain Crater warp; losing Minuet means no Sacred Forest Meadow warp. Both are heavily used route warps.',
      'An RBA Forest Medallion does NOT unlock Prelude of Light. EnXc_InitTempleOfTime gates the Prelude cutscene on EVENTCHKINF_48, which is set by the Forest Temple blue warp (Door_Warp1), not by the questItems bit. So this recipe completes the "Forest Medallion" goal without buying the child2 warp.',
      'Bingo separates `legitlacs` (medallions the honest way) from the RBA route precisely because of this.',
    ],
    confidence: 'decomp+zsr',
  },

  // ------------------------------------------------------------------ dungeon items
  {
    key: 'dungeon-items',
    // reaching 31 needs the TARGET byte to already read 26, different on every byte
    halfMilk: {
      ok: true,
      needs: 26,
      how: "26 = Compass + bits 3-4. Bits 3-4 are unused by the game, so nothing but an RBA write ever sets them, and the write assigns the whole byte, so it clears Boss Key, Compass and Map as it goes.",
      /* Unlike the quest and equipment bytes, 26 cannot occur naturally here: bits 3-4 are unused, so the player has to put them there. That makes one ordering the only one that works, which is worth stating -- as a route, kept out of `how`, which validate_claims.js holds to the byte condition alone. */
      route: [
        "Catch a fairy → 24 is the only write that leaves the byte able to reach 26.",
        "Collect that dungeon's Compass. The byte now reads 26.",
        "Empty the bottle on B → writes 31: Boss Key, Compass and Map.",
      ],
    },
    cRight: { itemId: '0x34-0x3A', name: 'Prescription / Eyeball Frog / Eyedrops / Claim Check / Fire Arrow / Ice Arrow / Light Arrow', offsetHex: '0x34-0x3A', target: 'Inventory.dungeonItems[0..6]' },
    stage: { sequence: 'adult trade', position: '8-11 for 0x34-0x37; magic-arrow buttons for 0x38-0x3A' },
    age: 'adult',
    summary: 'Boss Key (1), Compass (2), Map (4) flags for one dungeon per C-Right item.',
    mapping: [
      ['Prescription (0x34)', 'Deku Tree', 'adult trade stage 8'],
      ["Eyeball Frog (0x35)", "Dodongo's Cavern", 'adult trade stage 9 (timed)'],
      ['Eyedrops (0x36)', 'Jabu-Jabu', 'adult trade stage 10 (timed)'],
      ['Claim Check (0x37)', 'Forest Temple', 'adult trade stage 11'],
      ['Fire Arrow (0x38)', 'Fire Temple', 'equip Fire Arrows to C-Right while owning the bow'],
      ['Ice Arrow (0x39)', 'Water Temple', 'equip Ice Arrows to C-Right while owning the bow'],
      ['Light Arrow (0x3A)', 'Spirit Temple', 'equip Light Arrows to C-Right while owning the bow'],
    ],
    modifiers: {
      20: 'Map only  (erases Boss Key + Compass)',
      24: 'NOTHING (erases all three)',
      25: 'Boss Key only  (erases Compass + Map)',
      28: 'Map only  (erases Boss Key + Compass)',
      29: 'Boss Key + Map  (erases Compass)',
      31: 'Boss Key + Compass + Map , the full set; needs target == 26, reached by writing 24 with a fairy then picking up that dungeon\'s Compass',
    },
    /* PROVED FROM THE DECOMP: the Compass bit is a closed loop.
       DUNGEON_COMPASS = 1 (item.h), and the only code in retail that sets a
       dungeon-item bit is Item_Give's `dungeonItems[mapIndex] |= gBitFlags[...]`
       (z_parameter.c:1495), an OR, never a clear. RBA instead assigns the whole
       byte. Of the six writable values only 31 has bit 1, and 31 only lands when
       the byte already reads 26 (0b00011010), which already has bit 1.
       => RBA can never grant a Compass you do not already hold.
       => Every other writable value wipes it, and En_Box returns early on
          Flags_GetTreasure, so the chest cannot be re-opened. */
    satisfies: [
      'Water Temple Boss Key', 'Fire Temple Boss Key', 'Spirit Temple Boss Key', 'Forest Temple Boss Key',
      '2 Boss Keys', '3 Boss Keys',
      '3 Maps', '4 Maps', '5 Maps', '6 Maps', '7 Maps',
    ],
    enables: [
      'Open 2 Boss Key Doors', 'Open 3 Boss Key Doors', 'Open Forest Temple Boss Key Door',
      'Map & Compass in Water Temple', 'Map & Compass in Fire Temple', 'Map & Compass in Spirit Temple',
      'Map & Compass in Forest Temple', 'Map & Compass in Deku Tree', "Map & Compass in Dodongo's Cavern",
      'Map & Compass in Jabu-Jabu',
    ],
    enablesNotes: {
      'Map & Compass in Water Temple': 'RBA writes the Map half only. The Compass has to come from the real chest in that dungeon.',
      'Map & Compass in Fire Temple': 'RBA writes the Map half only. The Compass has to come from the real chest.',
      'Map & Compass in Spirit Temple': 'RBA writes the Map half only. The Compass has to come from the real chest.',
      'Map & Compass in Forest Temple': 'RBA writes the Map half only. The Compass has to come from the real chest.',
      'Map & Compass in Deku Tree': 'RBA writes the Map half only. The Compass has to come from the real chest.',
      "Map & Compass in Dodongo's Cavern": 'RBA writes the Map half only. The Compass has to come from the real chest.',
      'Map & Compass in Jabu-Jabu': 'RBA writes the Map half only. The Compass has to come from the real chest.',
    },
    destroys: [
      '3 Compasses', '4 Compasses', '5 Compasses', '6 Compasses', '7 Compasses',
      'Map & Compass in Water Temple', 'Map & Compass in Fire Temple', 'Map & Compass in Spirit Temple',
      'Map & Compass in Forest Temple', 'Map & Compass in Deku Tree', "Map & Compass in Dodongo's Cavern",
      'Map & Compass in Jabu-Jabu',
    ],
    destroysPermanently: [
      '3 Compasses', '4 Compasses', '5 Compasses', '6 Compasses', '7 Compasses',
      'Map & Compass in Water Temple', 'Map & Compass in Fire Temple', 'Map & Compass in Spirit Temple',
      'Map & Compass in Forest Temple', 'Map & Compass in Deku Tree', "Map & Compass in Dodongo's Cavern",
      'Map & Compass in Jabu-Jabu',
    ],
    notes: [
      'BALANCING.md: "The first 2 boss keys a player would normally get are very fast (Fire, and Water through Ice Arrow RBA)", the Ice Arrow RBA with a fish (25) is the canonical Water Temple Boss Key.',
      'Shadow Temple, Bottom of the Well, Ice Cavern, Ganon\'s Tower, GTG and the rest map to item ids 0x3B+ which cannot be placed on C-Right, so their dungeon items are NOT RBA-able.',
    ],
    traps: [
      'THE COMPASS IS A CLOSED LOOP. Only the value 31 sets the Compass bit, and 31 only lands when the byte already reads 26, which already contains it. So RBA can never grant a Compass, while the five other values all wipe it. A dungeon has exactly one Compass chest and En_Box will not re-open it, so a wiped Compass is gone for good.',
      'A careless write erases the Map/Compass/Boss Key you already had in that dungeon, e.g. writing 25 for a Boss Key destroys that dungeon\'s Map and Compass, which can undo a "N Maps" or "Map & Compass in X" goal.',
      'Getting the bare Fire/Ice/Light Arrow item (0x04/0x0C/0x12) onto C-Right is a different, much harder setup than the Bow+Arrow ids (0x38-0x3A), do not confuse the two rows.',
    ],
    confidence: 'decomp+zsr',
  },
  {
    key: 'water-temple-keys',
    // reaching 31 needs the TARGET byte to already read 26, different on every byte
    halfMilk: { ok: true, how: "Get the Water Temple key count to exactly 26, then empty." },
    cRight: { itemId: '0x4D', name: 'Bomb Bag (20)', offsetHex: '0x4D', target: 'Inventory.dungeonKeys[5] (Water Temple)' },
    age: 'either',
    summary: 'The ONLY small-key count RBA that is actually reachable, because Bomb Bag (20) is the only upgrade item that can end up in an inventory slot.',
    howToGetOnCRight: "Open the Dodongo's Cavern bomb bag chest while already owning any bomb bag. Item_Give falls through to `INV_CONTENT(item) = item` with an out-of-bounds gItemSlots read that lands on SLOT_BOMBCHU, so Bomb Bag (20) appears in the Bombchu slot and can be equipped to C-Right.",
    modifiers: { 20: '20 keys', 24: '24 keys', 25: '25 keys', 28: '28 keys', 29: '29 keys', 31: '31 keys (needs 26 first)' },
    satisfies: [],
    enables: ['1 Unused Small Key in each Adult Dungeon'],
    enablesNotes: { '1 Unused Small Key in each Adult Dungeon': 'covers the Water Temple part only' },
    traps: [
      'Taking the Bomb Bag (20) into the Bombchu slot permanently blocks ever obtaining Bombchus. Chus already on a C button survive for a while.',
      'Bomb Bag (20) also acts as Eyedrops for Biggoron.',
      'Every other dungeon\'s small key count needs an item id (Bullet Bag / Quiver / Bomb Bag 30-40 / gauntlets / scales / Giant\'s Knife) that cannot be put on C-Right. In particular the Gerudo Training Grounds and Forest Temple "unused keys" goals are NOT RBA-able.',
    ],
    confidence: 'decomp+zsr',
  },
];


// ------------------------------------------------- combinations across bytes
// Some goals are not decided by a single byte. These are the pairings that matter.
const COMBINATIONS = [
  {
    "key": "songs-across-bytes",
    "title": "Odd Potion + Poacher's Saw: the song engine",
    "recipes": [
      "quest-stones",
      "quest-songs"
    ],
    "detail": "Songs do not live in one byte. Song of Time and Song of Storms sit in the stones byte (Odd Potion, 0x31); Serenade, Requiem, Nocturne, Prelude, Lullaby, Epona, Saria and Sun sit in the songs byte (Poacher's Saw, 0x32); Minuet and Bolero sit in the medallions byte (Broken Goron's Sword, 0x33). Odd Potion is adult trade stop 5 and Poacher's Saw is stop 6 - consecutive - so both writes fit in one run, in that order.",
    "bestPair": [
      "0x31 <- 29 (bug): Song of Time + all three spiritual stones. Costs Song of Storms, Stone of Agony, Gerudo's Card.",
      "0x32 <- 29 (bug): Serenade + Nocturne + Prelude + Zelda's Lullaby. Costs Requiem, Epona, Saria, Sun."
    ],
    "grantable": [
      "Song of Time",
      "Serenade of Water",
      "Nocturne of Shadow",
      "Prelude of Light",
      "Zelda's Lullaby"
    ],
    "ungrantable": {
      "Song of Storms": "stones byte bit 1",
      "Requiem of Spirit": "songs byte bit 1",
      "Epona's Song": "songs byte bit 5",
      "Saria's Song": "songs byte bit 6",
      "Sun's Song": "songs byte bit 7",
      "Minuet of Forest": "medallions byte bit 6",
      "Bolero of Fire": "medallions byte bit 7"
    },
    "ceiling": "RBA can newly grant at most FIVE songs. Minuet and Bolero survive only if you never write the medallions byte at stop 7, which puts the ceiling at seven songs without re-learning anything afterwards. Epona, Saria and Sun are re-learnable in game, so 8-10 song goals need those picked up AFTER the Poacher's Saw write, never before - the write would wipe them.",
    "consequences": [
      "\"3 Songs\" and \"4 Songs\" are satisfiable by the Poacher's Saw write alone.",
      "\"6 Songs\" and \"7 Songs\" need Minuet and/or Bolero already in hand, so the medallions byte must stay untouched.",
      "\"8 Songs\" and above cannot be reached by RBA alone; the extra songs have to be learned after the write.",
      "\"5 Top Row Songs\" is actively hurt: the top row is ZL / Epona / Saria / Sun / Song of Time / Song of Storms, and RBA can only ever supply ZL and Song of Time out of those six."
    ]
  }
];

// ---------------------------------------------------------------- the ordering constraint
const TRADE_SEQUENCE_CONSTRAINT = {
  title: 'The adult trade sequence is a one-way cursor over the RBA target bytes',
  detail:
    'ITEM_POCKET_EGG(0x2D) … ITEM_CLAIM_CHECK(0x37) are consecutive item ids AND consecutive Inventory bytes, ' +
    'and the trade sequence advances through them in exactly that order. Because SLOT_TRADE_ADULT holds only one item ' +
    'at a time and trades are irreversible, each RBA target byte is available for exactly one window of the run, ' +
    'and the windows are strictly ordered.',
  order: [
    { stage: 1, item: 'Pocket Egg (0x2D)', byte: 'upgrades b1, stick/nut capacity', timed: false },
    { stage: 2, item: 'Pocket Cucco (0x2E)', byte: 'upgrades b2, wallet / scale / strength hi', timed: false },
    { stage: 3, item: 'Cojiro (0x2F)', byte: 'upgrades b3, quiver / bomb bag / strength lo', timed: false },
    { stage: 4, item: 'Odd Mushroom (0x30)', byte: 'quest b0, heart piece count', timed: true },
    { stage: 5, item: 'Odd Potion (0x31)', byte: 'quest b1, spiritual stones / agony / gerudo card', timed: true },
    { stage: 6, item: "Poacher's Saw (0x32)", byte: 'quest b2, Serenade..Sun\'s Song', timed: false },
    { stage: 7, item: "Broken Goron's Sword (0x33)", byte: 'quest b3, medallions / Minuet / Bolero', timed: false },
    { stage: 8, item: 'Prescription (0x34)', byte: 'dungeonItems[0] Deku Tree', timed: false },
    { stage: 9, item: 'Eyeball Frog (0x35)', byte: "dungeonItems[1] Dodongo's Cavern", timed: true },
    { stage: 10, item: 'Eyedrops (0x36)', byte: 'dungeonItems[2] Jabu-Jabu', timed: true },
    { stage: 11, item: 'Claim Check (0x37)', byte: 'dungeonItems[3] Forest Temple', timed: false },
  ],
  consequences: [
    "Biggoron's Sword requires finishing the whole sequence (Claim Check + 3 days), so it is mutually antagonistic with parking at any earlier stage. That is exactly the chucojiro:-1.5 anti-synergy bingo puts on Biggoron's Sword.",
    'Any goal needing Cojiro RBA (explosives, quiver) freezes the sequence at stage 3, blocking the stones / songs / medallions / dungeon-item RBAs downstream.',
    'The coloured gauntlets are made at stage 2 and unmade at stage 3, and stage 3 is downstream, so a gauntlet-colour goal and a Cojiro RBA in the same run are in direct conflict.',
    'Failing a timed trade (Odd Mushroom, Odd Potion, Eyeball Frog, Eyedrops) resets that step, and if you were using the Lon Lon "stick on B" method it also blanks your B button.',
  ],
};

const CHILD_SEQUENCE_CONSTRAINT = {
  title: 'The child mask sequence is the second one-way cursor',
  order: [
    { stage: 1, item: 'Weird Egg (0x21)', byte: 'ammo[9] hookshot, unused' },
    { stage: 2, item: 'Cucco (0x22)', byte: 'ammo[10] ice arrow, unused' },
    { stage: 3, item: "Zelda's Letter (0x23)", byte: "ammo[11] Farore's Wind, unused" },
    { stage: 4, item: 'Keaton Mask (0x24)', byte: 'ammo[12] boomerang, unused' },
    { stage: 5, item: 'Skull Mask (0x25)', byte: 'ammo[13] lens, unused' },
    { stage: 6, item: 'Spooky Mask (0x26)', byte: 'ammo[14] MAGIC BEAN COUNT' },
    { stage: 7, item: 'Bunny Hood (0x27)', byte: 'ammo[15] beans-bought counter' },
    { stage: 8, item: 'Goron Mask (0x28)', byte: 'equipment hi, tunics / boots' },
    { stage: 9, item: 'Zora Mask (0x29)', byte: 'equipment lo, swords / shields' },
    { stage: 10, item: 'Gerudo Mask (0x2A)', byte: 'padding, no effect (except the fake stick counter)' },
    { stage: 11, item: 'Mask of Truth (0x2B)', byte: 'padding, no effect' },
    { stage: 12, item: 'Sold Out (0x2C)', byte: 'upgrades b0, entirely unused bits' },
  ],
  notes: [
    'Only stages 6, 8 and 9 have gameplay effect.',
    'Unlike the adult trade sequence this is probably NOT strictly one-way. In ovl_En_GirlA (z_en_girla.c) `sMaskShopItems` stocks all eight masks, and `EnGirlA_TrySetMaskItemDescription` marks a mask out of stock only while `INV_CONTENT(ITEM_TRADE_CHILD)` already equals that mask, holding a different mask does not block borrowing another. Masks you have already sold become free to borrow via ITEMGETINF_38/39/3A/3B.',
    'OPEN QUESTION: which masks the shop actually spawns at a given point is decided by the shopkeeper actor (En_Ossan) and the shop scene setup, not by EnGirlA_CanBuy_*. Confirm there before treating Spooky/Goron/Zora mask RBA as freely repeatable.',
  ],
};

module.exports = { MOD, RECIPES, COMBINATIONS, TRADE_SEQUENCE_CONSTRAINT, CHILD_SEQUENCE_CONSTRAINT };

if (require.main === module) {
  const fs = require('fs');
  const path = require('path');
  const OUT = path.join(__dirname, 'out');
  fs.writeFileSync(
    path.join(OUT, 'rba-recipes.json'),
    JSON.stringify({ recipes: RECIPES, combinations: COMBINATIONS, adultTradeSequence: TRADE_SEQUENCE_CONSTRAINT, childMaskSequence: CHILD_SEQUENCE_CONSTRAINT }, null, 1),
  );
  /*
   * Sanity: every goal name referenced must be an EXACT v10.6 goal name.
   *
   * This used to strip a ", explanation" suffix before comparing, which meant a
   * "Goal name, why" entry passed validation while every consumer (build_merged,
   * build_conflicts) matched on the raw string and silently dropped it. That cost
   * Giant's Wallet, 500 Rupees and Giant's Knife their RBA links entirely. Prose
   * belongs in the *Notes maps, so the suffix form is now a hard error.
   *
   * alsoEnables is deliberately not checked, it is documented free-text.
   */
  const goals = new Set(JSON.parse(fs.readFileSync(path.join(OUT, 'goals-v10.6.json'), 'utf8')).map((g) => g.name));
  const bad = [];
  for (const r of RECIPES) {
    for (const k of ['satisfies', 'enables', 'destroys', 'destroysPermanently']) {
      for (const n of r[k] || []) {
        if (goals.has(n)) continue;
        const base = n.split(', ')[0].trim();
        bad.push(
          goals.has(base)
            ? `${r.key}.${k}: "${base}" carries an inline ", " note; move it to ${k}Notes`
            : `${r.key}.${k}: "${n}" is not a v10.6 goal name`
        );
      }
    }
    // a Notes map must not invent keys the corresponding list does not contain
    for (const k of ['satisfies', 'enables', 'destroys']) {
      const list = new Set(r[k] || []);
      for (const n of Object.keys(r[`${k}Notes`] || {})) {
        if (!list.has(n)) bad.push(`${r.key}.${k}Notes: "${n}" has no matching entry in ${k}`);
      }
    }
  }
  console.log(`recipes: ${RECIPES.length}`);
  if (bad.length) {
    console.error(`UNMATCHED GOAL NAMES (${bad.length}):\n  ` + bad.join('\n  '));
    process.exit(1);
  }
  console.log('all referenced goal names exist in v10.6, exactly');
}
