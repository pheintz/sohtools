/*
 * Validate every "RBA can do this" claim against what the six writable values can
 * actually put in a byte.
 *
 * The rule this exists to enforce, derived from the writable set {20,24,25,28,29,31}:
 *
 *   bit 0  set by 25, 29, 31            -> settable
 *   bit 1  set ONLY by 31               -> and 31 requires the target byte to already
 *                                          read 26 = 0b00011010, which HAS bit 1.
 *                                          So RBA can never be what first sets bit 1.
 *   bit 2  set by 20, 28, 29, 31        -> settable
 *   bit 3  set by 24, 25, 28, 29, 31    -> settable
 *   bit 4  set by all six               -> settable
 *   bits 5-7 set by none                -> never settable
 *
 * Bits 1 and 5-7 are therefore unreachable-from-zero. Whatever those bits mean in a
 * given byte is something RBA can destroy but never grant. This is what made the
 * dungeon Compass a closed loop, and it is not specific to dungeon items.
 *
 * Exit code 1 if any recipe claims to satisfy a goal whose state lives in an
 * unreachable bit.
 */
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, 'out');
const { RECIPES } = require('./rba_recipes');
const RECIPES_EARLY = RECIPES;

const WRITABLE = [20, 24, 25, 28, 29, 31];
const HALF_MILK = 31;
const HALF_MILK_PRECONDITION = 26;

/* ---------- prove the bit rule ---------- */
const direct = WRITABLE.filter((v) => v !== HALF_MILK);
const bitReport = [];
const settable = new Set();
for (let b = 0; b < 8; b++) {
  const byDirect = direct.filter((v) => (v >> b) & 1);
  const by31 = (HALF_MILK >> b) & 1;
  const preconditionHasBit = (HALF_MILK_PRECONDITION >> b) & 1;
  let verdict, why;
  if (byDirect.length) {
    verdict = 'settable';
    why = 'set by ' + byDirect.join(', ');
  } else if (by31 && preconditionHasBit) {
    verdict = 'UNREACHABLE';
    why = 'only 31 sets it, and 31 needs the byte to already read 26, which already has this bit — circular';
  } else if (by31) {
    verdict = 'settable (via 31 only)';
    why = 'only 31 sets it; 26 does not contain it, so the precondition is not circular';
  } else {
    verdict = 'UNREACHABLE';
    why = 'no writable value sets it';
  }
  if (verdict.startsWith('settable')) settable.add(b);
  bitReport.push({ bit: b, verdict, why });
}
const unreachableBits = bitReport.filter((r) => r.verdict === 'UNREACHABLE').map((r) => r.bit);

/* ---------- bit meanings per target byte ---------- */
const EQUIP_LOW = ['Kokiri Sword', 'Master Sword', "Biggoron's Sword / Giant's Knife", '"Broken" sword flag',
  'Deku Shield', 'Hylian Shield', 'Mirror Shield', null];
const EQUIP_HIGH = ['Kokiri Tunic', 'Goron Tunic', 'Zora Tunic', null,
  'Kokiri Boots', 'Iron Boots', 'Hover Boots', null];
const QUEST_STONES = ['Song of Time', 'Song of Storms', "Kokiri's Emerald", "Goron's Ruby",
  "Zora's Sapphire", 'Stone of Agony', "Gerudo's Card", 'Gold Skulltula icon'];
const QUEST_SONGS = ['Serenade of Water', 'Requiem of Spirit', 'Nocturne of Shadow', 'Prelude of Light',
  "Zelda's Lullaby", "Epona's Song", "Saria's Song", "Sun's Song"];
const QUEST_MEDALLIONS = ['Forest Medallion', 'Fire Medallion', 'Water Medallion', 'Spirit Medallion',
  'Shadow Medallion', 'Light Medallion', 'Minuet of Forest', 'Bolero of Fire'];
const DUNGEON = ['Boss Key', 'Compass', 'Map', null, null, null, null, null];

const FLAG_BYTES = {
  'equip-swords-shields': EQUIP_LOW,
  'equip-tunics-boots': EQUIP_HIGH,
  'quest-stones': QUEST_STONES,
  'quest-songs': QUEST_SONGS,
  'quest-medallions': QUEST_MEDALLIONS,
  'dungeon-items': DUNGEON,
};

/* which labels can RBA never newly grant, per byte */
const ungrantable = {};
for (const [key, labels] of Object.entries(FLAG_BYTES)) {
  ungrantable[key] = unreachableBits
    .map((b) => ({ bit: b, label: labels[b] }))
    .filter((x) => x.label);
}

/* ---------- composite goals ----------
   After an RBA write the byte equals the written value EXACTLY, so the post-state
   is fully determined. A goal that needs N items from one byte is satisfiable only
   if some writable value's bit-set meets it. */
const COMPOSITE = {
  'equip-swords-shields': {
    '3 Swords': (own) => ['Kokiri Sword', 'Master Sword', "Biggoron's Sword / Giant's Knife"].every((x) => own.has(x)),
    '2 Shields': (own) => ['Deku Shield', 'Hylian Shield', 'Mirror Shield'].filter((x) => own.has(x)).length >= 2,
    '3 Shields': (own) => ['Deku Shield', 'Hylian Shield', 'Mirror Shield'].every((x) => own.has(x)),
  },
  'equip-tunics-boots': {
    '3 Tunics': (own) => ['Kokiri Tunic', 'Goron Tunic', 'Zora Tunic'].every((x) => own.has(x)),
    '3 Boots': (own) => ['Kokiri Boots', 'Iron Boots', 'Hover Boots'].every((x) => own.has(x)),
  },
};

function ownedAfter(labels, value) {
  const own = new Set();
  for (let b = 0; b < 8; b++) if (((value >> b) & 1) && labels[b]) own.add(labels[b]);
  return own;
}

const compositeProblems = [];
for (const [key, tests] of Object.entries(COMPOSITE)) {
  const labels = FLAG_BYTES[key];
  for (const [goalName, pred] of Object.entries(tests)) {
    const ok = WRITABLE.some((v) => pred(ownedAfter(labels, v)));
    const claimed = (RECIPES_EARLY.find((r) => r.key === key) || {}).satisfies || [];
    if (!ok && claimed.indexOf(goalName) !== -1) {
      compositeProblems.push(`${key} claims to SATISFY "${goalName}", but no writable value leaves that byte in a state meeting it`);
    }
  }
}

/* ---------- audit the recipes ---------- */

const problems = [];
const notes = [];
for (const r of RECIPES) {
  const bad = ungrantable[r.key];
  if (!bad || !bad.length) continue;
  const badLabels = new Set(bad.map((x) => x.label));
  for (const name of r.satisfies || []) {
    // a goal named exactly after an ungrantable flag cannot be satisfied by RBA
    if (badLabels.has(name)) {
      problems.push(`${r.key} claims to SATISFY "${name}", but that is bit ${bad.find((x) => x.label === name).bit} — RBA can never set it`);
    }
  }
  for (const name of r.enables || []) {
    if (badLabels.has(name)) {
      notes.push(`${r.key} lists "${name}" under enables; RBA cannot set that bit, so the note must say the state comes from elsewhere`);
    }
  }
}

/* ---------- report ---------- */
let txt = 'RBA CLAIM VALIDATION\n' + '='.repeat(78) + '\n\n';
txt += 'Bit reachability, derived from the writable set {20,24,25,28,29,31}:\n\n';
for (const r of bitReport) {
  txt += `  bit ${r.bit}  ${r.verdict.padEnd(22)} ${r.why}\n`;
}
txt += `\nUnreachable bits: ${unreachableBits.join(', ')}\n`;
txt += 'Anything living in those bits is state RBA can destroy but never grant.\n\n';
txt += 'What that means per target byte:\n';
for (const [key, list] of Object.entries(ungrantable)) {
  txt += `\n  ${key}\n`;
  for (const x of list) txt += `      bit ${x.bit}: ${x.label}\n`;
}
txt += '\n' + '='.repeat(78) + '\n';
const allProblems = [...problems, ...compositeProblems];
txt += allProblems.length ? `\nOVERCLAIMS (${allProblems.length}):\n  ` + allProblems.join('\n  ') + '\n'
  : '\nNo recipe claims to satisfy a goal that RBA cannot actually reach.\n';
if (notes.length) txt += `\nCheck the wording on these (${notes.length}):\n  ` + notes.join('\n  ') + '\n';

fs.writeFileSync(path.join(OUT, 'claim-validation.txt'), txt);
console.log(txt);

if (allProblems.length) process.exit(1);

/* ---------- half-milk reachability ----------
 * Added after a recipe shipped an unreachable setup. `equip-swords-shields` said "hold the Master
 * Sword, the broken-sword flag and the Deku Shield and nothing else (= 26), then empty" — correct
 * arithmetic, impossible instruction, because "nothing else" means no Kokiri Sword and normal play
 * never clears that bit. It was tried in game and did not work.
 *
 * The general rule, derived rather than asserted: writing 31 needs the target byte to already read
 * 26, and RBA cannot write 26. So the byte has to arrive at 26 as (writable value) OR (bits gained
 * in game). That only works if some writable value's bits ALL fall inside 26 — and exactly one
 * does, 24. Since 26 - 24 = 2, the missing piece is always bit 1 of whatever byte is targeted.
 *
 * Therefore every truthful `halfMilk.how` on a flags byte is the same shape: write 24, obtain bit 1
 * legitimately, empty. A `how` that does not mention 24 is describing a state, not a route.
 */
const HALF_MILK_STEP = WRITABLE.filter((v) => (v & ~HALF_MILK_PRECONDITION & 0xff) === 0);
const halfMilkProblems = [];
if (HALF_MILK_STEP.length !== 1 || HALF_MILK_STEP[0] !== 24) {
  halfMilkProblems.push(`expected 24 to be the unique writable subset of 26, got [${HALF_MILK_STEP}]`);
}
/* Bit 1 per flags byte.
 *
 * This deliberately stops at the transaction. An earlier version also judged whether the GAME would
 * grant bit 1 back — Song of Storms is a one-time teach, the Fire blue warp is event-flag guarded,
 * and so on — and used that to mark half milk "impossible". That is inference about a run, not a
 * fact about a write, and it is the player's call. The table states what the write does; what is
 * re-obtainable on a given file is not ours to decide.
 *
 * What stays is checkable and purely mechanical: 26 is not writable, exactly one writable value (24)
 * has no bits outside 26, and 26 - 24 = 2, so bit 1 always has to come from somewhere other than RBA.
 * A `how` that omits that is describing an end state rather than the transaction.
 */
const BIT1 = {
  'equip-swords-shields': 'Master Sword', 'equip-tunics-boots': 'Goron Tunic',
  'dungeon-items': 'Compass', 'quest-stones': 'Song of Storms',
  'quest-songs': 'Requiem of Spirit', 'quest-medallions': 'Fire Medallion',
};
for (const r of RECIPES) {
  const item = BIT1[r.key];
  if (!item || !r.halfMilk || r.halfMilk.ok !== true) continue;
  /* `how` states the byte CONDITION, not a route. An earlier version prescribed steps ("catch a
     fairy, open the Compass chest, empty") — which reads as a recipe, smuggles in an assumption
     about what the player can still obtain, and was wrong about which step was load-bearing. The
     condition is the fact; getting there is the player's problem. */
  if (r.halfMilk.needs !== 26) {
    halfMilkProblems.push(`${r.key}.halfMilk.needs should be 26 — the value the write tests for`);
  }
  const how = String(r.halfMilk.how || '');
  if (!/26/.test(how)) {
    halfMilkProblems.push(`${r.key}.halfMilk.how should state what 26 means on this byte`);
  }
  if (/catch a fairy|save and quit|buy the|learn /i.test(how)) {
    halfMilkProblems.push(
      `${r.key}.halfMilk.how prescribes a route. State the byte condition instead — how the player ` +
      `reaches it, and whether they still can, is not this table's call`
    );
  }
}

txt += '\n' + '='.repeat(78) + '\n\nHALF MILK (31)\n';
txt += `  26 is not writable. Writable values whose bits all fall inside 26: ${HALF_MILK_STEP.join(', ') || 'none'}\n`;
txt += `  26 - 24 = 2, so the missing piece is always bit 1 of the target byte:\n`;
for (const [k, v] of Object.entries(BIT1)) txt += `      ${k.padEnd(22)} bit 1 = ${v}\n`;
txt += '\n  Bit 1 always has to come from outside RBA. Whether it is obtainable on a given file is a\n';
txt += '  routing question for the player, not a claim this table makes.\n';
txt += halfMilkProblems.length
  ? `\n  UNREACHABLE SETUPS (${halfMilkProblems.length}):\n    ` + halfMilkProblems.join('\n    ') + '\n'
  : '\n  Every halfMilk.ok recipe states the byte condition rather than prescribing a route.\n';

fs.writeFileSync(path.join(OUT, 'claim-validation.txt'), txt);
console.log(txt.slice(txt.indexOf('HALF MILK (31)')));
if (halfMilkProblems.length) process.exit(1);
