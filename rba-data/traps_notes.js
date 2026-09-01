/*
 * Parse the sourced RBA trap notes and check every claim they make against the decoded bytes.
 * sources/rba-traps-triforce3250.md -> out/traps-notes.json
 *
 * The old traps section was removed because it asserted conclusions nobody could check. This is the
 * same content class brought back under a gate: the prose is routing advice, credited to the video
 * it came from, and each note carries `assert` lines that are re-derived from rba-offsets.json here.
 * A note that stops matching the data FAILS THE BUILD rather than going quietly stale.
 *
 * Attachment to goals is by subject name and by counting archetype, never by hand:
 *   subjects    the things the note is about -> goals whose name mentions one
 *   archetypes  counting goals ("10 Songs" names no song, but every song-collection goal is
 *               affected by anything that deletes one)
 * Expanding into the `item` archetype was tried and is wrong -- it staples the Deku Stick note onto
 * "Adult's Wallet" -- so only genuine collection archetypes are permitted.
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'out');
const SRC = path.join(__dirname, 'sources', 'rba-traps-triforce3250.md');

const offsets = JSON.parse(fs.readFileSync(path.join(OUT, 'rba-offsets.json'), 'utf8'));
const goals = JSON.parse(fs.readFileSync(path.join(OUT, 'web-goals.json'), 'utf8')).goals;
const dataset = JSON.parse(fs.readFileSync(path.join(OUT, 'dataset.json'), 'utf8'));

/* offset -> recipe, derived rather than hand-listed. A recipe's offsetHex is either a single byte
   or a range ("0x34-0x3A"), and the trap bytes are all single. */
const recipeByHex = {};
for (const r of dataset.recipes) {
  const hex = String(r.cRight.offsetHex).toUpperCase();
  if (/^0X[0-9A-F]{2}$/.test(hex)) recipeByHex[hex.replace('0X', '0x')] = r;
}

const BOTTLE = { empty: 20, fairy: 24, fish: 25, 'blue fire': 28, bug: 29, 'half milk': 31 };
const VALUES = [20, 24, 25, 28, 29, 31];

/* Only counting archetypes may be expanded into. `item` goals are individually named, so the
   subject match already reaches them; expanding it adds 39 wrong attachments. */
const COUNTING = new Set(['song-collection', 'heart-collection', 'dungeon-item-collection',
  'skulltula-collection', 'rupees', 'equipment-set', 'small-keys', 'bottle-contents',
  'dungeon-clear', 'bean', 'inventory-slots']);

/* ---------- parse ---------- */
const text = fs.readFileSync(SRC, 'utf8');
const problems = [];
const notes = [];

const sections = text.split(/^## /m).slice(1);
for (const sec of sections) {
  const lines = sec.split(/\r?\n/);
  const head = lines.shift().trim();
  const m = /^(.+?)\s+\(0x([0-9A-Fa-f]{2})\)$/.exec(head);
  if (!m) { problems.push(`heading is not "Name (0xNN)": ${head}`); continue; }

  const offset = parseInt(m[2], 16);
  const row = offsets.rows.find((r) => r.offset === offset && r.reachable);
  if (!row) { problems.push(`0x${m[2]} (${m[1]}) is not a reachable C-Right byte`); continue; }

  const note = { offset, offsetHex: '0x' + m[2].toUpperCase(), item: row.cRightItemName,
    source: null, subjects: [], archetypes: [], asserts: [], lines: [] };

  for (const raw of lines) {
    const l = raw.trim();
    if (!l) continue;
    let k;
    if ((k = /^source:\s*(\S+)$/.exec(l))) note.source = k[1];
    else if ((k = /^subjects:\s*(.+)$/.exec(l))) note.subjects = k[1].split(',').map((s) => s.trim()).filter(Boolean);
    else if ((k = /^archetypes:\s*(.*)$/.exec(l))) note.archetypes = k[1].split(',').map((s) => s.trim()).filter(Boolean);
    else if ((k = /^assert:\s*(.+)$/.exec(l))) note.asserts.push(k[1].trim());
    else if (l.startsWith('- ')) note.lines.push(l.slice(2).trim());
    else if (note.lines.length) note.lines[note.lines.length - 1] += ' ' + l;  // wrapped prose
  }

  if (!note.source) problems.push(`${note.item}: no source: line`);
  if (!/^[\w-]{11}$/.test(note.source || '')) problems.push(`${note.item}: source is not an 11-character video id`);
  if (!note.lines.length) problems.push(`${note.item}: no note lines`);
  if (!note.asserts.length) problems.push(`${note.item}: no assert lines — every note must be checkable`);
  note.archetypes.forEach((a) => {
    if (!COUNTING.has(a)) problems.push(`${note.item}: "${a}" is not a counting archetype`);
  });

  notes.push(note);
}

/* ---------- check every assertion against the decoded bytes ---------- */
let checked = 0;
for (const note of notes) {
  const row = offsets.rows.find((r) => r.offset === note.offset);
  for (const a of note.asserts) {
    const m = /^(every|empty|fairy|fish|blue fire|bug|half milk)\s+(grants|permanent|erases)\s+(.+)$/.exec(a);
    if (!m) { problems.push(`${note.item}: cannot parse assert "${a}"`); continue; }
    const [, who, field, needle] = m;
    const vals = who === 'every' ? VALUES : [BOTTLE[who]];
    const key = field === 'grants' ? 'grants' : field === 'erases' ? 'erases' : 'permanent';

    const bad = vals.filter((v) => {
      const w = row.writes.find((x) => x.value === v) || {};
      return !(w[key] || []).some((s) => s.indexOf(needle) !== -1);
    });
    checked++;
    if (bad.length) {
      problems.push(`${note.item}: assert "${a}" fails for value(s) ${bad.join(', ')} — ` +
        `the data no longer says this`);
    }
  }
}

/* ---------- attach to goals ----------
   Three nets, because no one of them is sufficient and the gaps are not the same shape:

     recipe    the dataset already records which recipe can complete or help each goal (g.rba) and
               which goals it destroys permanently. This is the authoritative link and it catches
               what a word-match never could -- "Light Arrows" is helped by the medallion write
               because Spirit + Shadow triggers LACS, and the goal name contains no medallion.
     archetype counting goals. "10 Songs" names no song, but every song-collection goal is affected
               by anything that deletes one.
     subject   the plain name match, which still earns its place on the upgrade bytes: those
               recipes destroy capacities rather than goals, so nothing in the recipe model links
               the Pocket Egg write to "Bullet Bag (50)".

   Measured on the current data: recipe finds 35, archetype 41, subject 15, union 71 -- and 15 of
   the recipe hits are invisible to both other nets. */
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const byGoal = {};
const tally = { recipe: 0, archetype: 0, subject: 0 };

for (const note of notes) {
  const recipe = recipeByHex[note.offsetHex];
  if (!recipe) problems.push(`${note.item}: no recipe covers ${note.offsetHex}`);
  const key = recipe ? recipe.key : null;
  const destroys = (recipe && recipe.destroysPermanently) || [];
  const hit = new Set();
  const why = {};

  goals.forEach((g) => {
    const add = (route) => { hit.add(g.n); (why[g.n] = why[g.n] || []).push(route); };
    if (key && g.rba && ((g.rba.s || []).indexOf(key) !== -1 || (g.rba.e || []).indexOf(key) !== -1)) add('recipe');
    else if (destroys.indexOf(g.n) !== -1) add('recipe');
    if (note.archetypes.indexOf(g.a) !== -1) add('archetype');
    if (note.subjects.some((sub) => norm(g.n).indexOf(norm(sub)) !== -1)) add('subject');
  });

  Object.values(why).forEach((routes) => routes.forEach((r) => tally[r]++));
  note.goals = [...hit].sort();
  note.recipe = key;
  if (!note.goals.length) problems.push(`${note.item}: attaches to no goal — check subjects/archetypes`);
  note.goals.forEach((g) => (byGoal[g] = byGoal[g] || []).push(note.offsetHex));
}

if (problems.length) {
  console.error('RBA TRAP NOTES FAILED:\n  ' + problems.join('\n  '));
  process.exit(1);
}

fs.writeFileSync(path.join(OUT, 'traps-notes.json'), JSON.stringify({
  source: 'sources/rba-traps-triforce3250.md',
  credit: 'triforce3250 - OoT Bingo Tutorial - RBA Traps (parts 1 and 2)',
  notes,
  byGoal,
}, null, 1));

console.log(`notes           : ${notes.length}`);
console.log(`assertions      : ${checked} — all re-derived from rba-offsets.json`);
console.log(`goals reached   : ${Object.keys(byGoal).length} of ${goals.length}`);
console.log(`  by route      : recipe ${tally.recipe}, archetype ${tally.archetype}, subject ${tally.subject}`);
console.log(`goals with 2+   : ${Object.values(byGoal).filter((v) => v.length > 1).length}`);
