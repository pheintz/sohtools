/*
 * Check recipe claims against ootbingo's OFFICIAL goal clarifications.
 *
 * Everything else in this pipeline validates mechanics: can the bytes actually reach this state.
 * That is necessary and not sufficient. A goal can be mechanically reachable by RBA and still not
 * count, because the rules say so — the rules are what a race is judged on, not the memory map.
 *
 * This step exists because exactly that gap produced a wrong claim: `itemslot-generic` said RBA
 * *satisfies* "7 Different Bottled Contents". Mechanically it writes bottle ids into non-bottle
 * slots, which is the only way to hold more than four contents. But the clarification says the
 * empty bottle does not count, which kills modifier 20, and half milk is unreachable on an item
 * slot — leaving four counting contents, not seven.
 *
 * The rule texts are read back out of the bingo repo rather than copied here, so if ootbingo edits
 * a clarification the build says so instead of silently validating against a stale rule.
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'out');
const INFO = 'C:/Users/lloyd/source/repos/bingo/lib/components/info.js';
const { RECIPES } = require('./rba_recipes');

const info = fs.readFileSync(INFO, 'utf8');

/* Each entry pins a fragment of the official text and says what it means for RBA claims.
     excluded    - RBA cannot be used to complete goals matching `applies`
     allowed     - the rules explicitly bless RBA here (a positive confirmation, not a constraint)
     constrained - RBA can contribute but something about it is limited; the recipe must say how */
const RULES = [
  {
    id: 'bottled-contents-empty',
    text: ': Empty bottle does not count',
    applies: /Different Bottled Contents/i,
    effect: 'constrained',
    because: 'modifier 20 (empty bottle) does not count toward the total',
  },
  {
    id: 'different-heart-pieces',
    text: ': Using RBA to modify Heart Piece count does not count as a Heart Piece',
    applies: /Different Heart Pieces/i,
    effect: 'excluded',
    because: 'the rules explicitly refuse an RBA-written heart piece count for this goal',
  },
  {
    id: 'hearts-no-duping',
    text: ': Using RBA to modify Heart Piece count is not considered duping and is allowed',
    applies: /Hearts \(no duping\)/i,
    effect: 'allowed',
    because: 'RBA heart piece counts are explicitly permitted here',
  },
  {
    id: 'boss-keys-rba',
    text: ': Boss Keys for Child Dungeons obtained through RBA count',
    applies: /Boss Key/i,
    effect: 'allowed',
    because: 'child-dungeon boss keys via RBA are explicitly permitted',
  },
  {
    /* Not a blunt constraint: whether an RBA-written count displays is a per-modifier fact, and a
       legitimate capacity index renders fine. What the build CAN enforce is that a recipe touching
       this rule has actually thought about it, rather than assuming the count shows.
       The precondition that makes this bite: KaleidoScope_DrawItemPage draws an ammo count only
       when `inventory.items[i] != ITEM_NONE` (z_kaleido_item.c:533), so writing an ammo byte for an
       item you do not own displays nothing at all. */
    id: 'must-display-visually',
    text: ': Item must display visually in inventory to count',
    applies: /Deku Stick|Deku Nut|Magic Beans/i,
    effect: 'acknowledge',
    field: 'display',
    because: 'an RBA-written count only counts if the item still displays in the inventory, and an ammo count renders only when the item slot is non-empty',
  },
];

/* RBA is not on the banned list. The entire dataset rests on that, so assert it rather than
   assuming it. These are the tricks that ARE banned. */
const BANNED = [
  'Using Deku Stick as adult',
  'Using Bombchus out of bounds',
  'Obtaining the Eyeball Frog without presenting the Prescription (Hold R)',
  'Jumpslash Quick Putaway (QPA)',
  'Get Item Manipulation (GIM)',
  'Stale Reference Manipulation (SRM)',
  'Arbitrary Code Execution (ACE)',
];

const problems = [];
const notes = [];

/* ---------- 1. the rule texts must still be there ---------- */
for (const r of RULES) {
  if (!info.includes(r.text)) {
    problems.push(`clarification "${r.id}" is no longer in ${path.basename(INFO)} — its text changed, so the check below is stale`);
  }
}
for (const b of BANNED) {
  if (!info.includes(b)) notes.push(`banned-trick text moved or changed: "${b}"`);
}
// the load-bearing assumption of this whole project
if (/<li>\$\{localize\("[^"]*\bRBA\b[^"]*"\)\}<\/li>/.test(info.split('Banned Tricks')[1] || '')) {
  problems.push('RBA now appears in the Banned Tricks list — the premise of this dataset no longer holds');
}

/* ---------- 2. recipe claims vs the rules ---------- */
const goals = JSON.parse(fs.readFileSync(path.join(OUT, 'goals-v10.6.json'), 'utf8')).map((g) => g.name);

for (const rule of RULES) {
  const matching = goals.filter((n) => rule.applies.test(n));
  for (const r of RECIPES) {
    const claimed = (r.satisfies || []).filter((n) => rule.applies.test(n));
    const enabled = (r.enables || []).filter((n) => rule.applies.test(n));

    if (rule.effect === 'excluded') {
      for (const n of [...claimed, ...enabled]) {
        problems.push(`${r.key} claims "${n}", but the official clarification excludes RBA: ${rule.because}`);
      }
    }
    if (rule.effect === 'constrained') {
      // a constrained goal may be enabled (with an explanation) but not satisfied outright
      for (const n of claimed) {
        problems.push(`${r.key} claims to SATISFY "${n}" outright, but ${rule.because} — move it to enables and say how`);
      }
      for (const n of enabled) {
        const note = (r.enablesNotes || {})[n];
        if (!note) problems.push(`${r.key} enables "${n}" under a constrained rule but gives no enablesNotes explaining ${rule.because}`);
      }
    }
    if (rule.effect === 'acknowledge' && (claimed.length || enabled.length)) {
      if (!r[rule.field]) {
        problems.push(
          `${r.key} claims ${claimed.length + enabled.length} goal(s) under "${rule.id}" but has no \`${rule.field}\` field. ` +
          `Record why the count displays: ${rule.because}`
        );
      } else {
        notes.push(`${r.key}: ${claimed.length + enabled.length} claim(s) under "${rule.id}" — display accounted for`);
      }
    }
    if (rule.effect === 'allowed' && (claimed.length || enabled.length)) {
      notes.push(`${r.key}: ${claimed.length + enabled.length} claim(s) on "${rule.id}" are explicitly permitted by the rules`);
    }
  }
  if (!matching.length) notes.push(`no v10.6 goal matches rule "${rule.id}" — the clarification may predate this goal list`);
}

/* ---------- report ---------- */
let txt = 'OFFICIAL RULES VALIDATION\n' + '='.repeat(74) + '\n\n';
txt += `source: ${INFO}\n\n`;
txt += 'Clarifications checked (text pinned against the bingo repo):\n';
for (const r of RULES) txt += `  ${r.id.padEnd(24)} ${r.effect.padEnd(12)} ${r.because}\n`;
txt += `\nBanned tricks confirmed present: ${BANNED.length}. RBA is NOT among them.\n`;
txt += '\n' + '='.repeat(74) + '\n';
txt += problems.length
  ? `\nRULE VIOLATIONS (${problems.length}):\n  ` + problems.join('\n  ') + '\n'
  : '\nNo recipe claims a goal the official clarifications forbid or limit.\n';
if (notes.length) txt += `\nNotes (${notes.length}):\n  ` + notes.join('\n  ') + '\n';

fs.writeFileSync(path.join(OUT, 'rules-validation.txt'), txt);
console.log(txt.trim());
if (problems.length) process.exit(1);
