/*
 * Per-goal RBA writeups: one prose entry for every v10.6 goal that RBA can route, help or break.
 * Output: out/rba-writeups.md
 */
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, 'out');

// dataset.json is the joined copy — goals-v10.6.json has rba/intendedRoute still null.
const goals = JSON.parse(fs.readFileSync(path.join(OUT, 'dataset.json'), 'utf8')).goals;
const { RECIPES, TRADE_SEQUENCE_CONSTRAINT, noteMarkdown } = require('./rba_recipes');
const conflicts = JSON.parse(fs.readFileSync(path.join(OUT, 'conflicts.json'), 'utf8'));

const MOD_NAMES = { 20: 'empty bottle', 24: 'fairy', 25: 'fish', 28: 'blue fire', 29: 'bug', 31: 'half-milk' };

const BOTTLE_ON_B =
  'Get a bottle onto B. Fastest current method is the water quickdraw: drop your bugs/fish, pull out the ' +
  'empty bottle, quickdraw with the sword on a downward slope into deep water (Hyrule Field or Lake Hylia), ' +
  'then hold Z+R plus the bottle\'s C button and release R for a shield swipe. Alternatives: Time Stop or a ' +
  'text box while swimming, shielded-damage quickdraw (child bombchu / adult bomb-from-wall setups), or ' +
  'stealing the Fishing Rod and duping a bottle over it. **Put the bottle you are duplicating on C-Right ' +
  'first** — the dupe itself fires an RBA write.';

function fmtModifier(v) {
  return `**${MOD_NAMES[v]}** (${v})`;
}

function goalRelations(name) {
  const out = { satisfies: [], enables: [], destroys: [] };
  for (const r of RECIPES) {
    if ((r.satisfies || []).includes(name)) out.satisfies.push(r);
    if ((r.enables || []).includes(name)) out.enables.push(r);
    if ((r.destroys || []).includes(name)) out.destroys.push(r);
  }
  return out;
}

function recipeBlock(r, name, relation) {
  let s = '';
  const note =
    (relation === 'satisfies' && (r.satisfiesNotes || {})[name]) ||
    (relation === 'enables' && (r.enablesNotes || {})[name]) ||
    (relation === 'destroys' && (r.destroysNotes || {})[name]) ||
    null;

  s += `**${r.cRight.name} on C-Right** — \`${r.cRight.offsetHex}\` → ${r.cRight.target} (${r.age})\n\n`;
  if (r.stage) {
    const st = typeof r.stage === 'object' ? `${r.stage.sequence} stage ${r.stage.position}` : r.stage;
    s += `Requires being at **${st}**.\n\n`;
  }
  if (note) s += `${noteMarkdown(note)}\n\n`;
  s += 'Writes:\n\n';
  for (const [v, effect] of Object.entries(r.modifiers || {})) {
    s += `- ${fmtModifier(Number(v))} → ${effect}\n`;
  }
  s += '\n';
  if (r.practicality) s += `> ⚠ ${r.practicality}\n\n`;
  if (r.permanentLoss && r.permanentLoss.length) {
    s += `Cannot be written back by any modifier: ${r.permanentLoss.map((x) => `\`${x}\``).join(', ')}\n\n`;
  }
  if (r.traps && r.traps.length) {
    s += 'Traps:\n\n';
    for (const t of r.traps) s += `- ${t}\n`;
    s += '\n';
  }
  return s;
}

const linked = goals.filter((g) => g.rba);
linked.sort((a, b) => a.name.localeCompare(b.name));

let md = `# Per-goal RBA writeups — OoT Bingo v10.6\n\n`;
md += `Generated from \`dataset.json\`. ${linked.length} of ${goals.length} goals have an RBA relationship.\n\n`;
md += `## Before any of this: bottle on B\n\n${BOTTLE_ON_B}\n\n`;
md += `The offset RBA writes to is the **item ID sitting on C-Right**, and the value written is the new ` +
  `bottle content. Only six values are writable: 20 empty, 24 fairy, 25 fish, 28 blue fire, 29 bug, and ` +
  `31 half-milk (which only happens when the target byte already reads 26).\n\n`;
md += `## The ordering constraint\n\n${TRADE_SEQUENCE_CONSTRAINT.detail}\n\n`;
for (const c of TRADE_SEQUENCE_CONSTRAINT.consequences) md += `- ${c}\n`;
md += '\n---\n\n';

// index
md += '## Index\n\n';
const bucket = (g) => {
  const r = g.rba;
  if (r.satisfiedBy.length) return 'Routed by RBA';
  if (r.enabledBy.length) return 'Helped by RBA';
  return 'Broken by RBA';
};
for (const label of ['Routed by RBA', 'Helped by RBA', 'Broken by RBA']) {
  const set = linked.filter((g) => bucket(g) === label);
  md += `\n**${label}** (${set.length}): ` + set.map((g) => g.name).join(' · ') + '\n';
}
md += '\n---\n\n';

for (const g of linked) {
  const rel = goalRelations(g.name);
  const n = g.modes.normal;
  const sh = g.modes.short;
  md += `## ${g.name}\n\n`;
  const bits = [];
  if (n) bits.push(`normal: difficulty ${n.difficulty}, ${n.time} min`);
  if (sh) bits.push(`short: difficulty ${sh.difficulty}, ${sh.time} min`);
  md += `*${bits.join(' · ')}*\n\n`;

  if (g.classification.gameState) {
    md += `Asserts: \`${JSON.stringify(g.classification.gameState)}\`\n\n`;
  }
  if (g.classification.rbaOnlyItem) {
    md += `> **This item does not exist in normal play.** It is only reachable through RBA.\n\n`;
  }

  if (rel.satisfies.length) {
    md += `### Routed by RBA\n\n`;
    for (const r of rel.satisfies) md += recipeBlock(r, g.name, 'satisfies');
  }
  if (rel.enables.length) {
    md += `### Made cheaper by RBA\n\n`;
    for (const r of rel.enables) md += recipeBlock(r, g.name, 'enables');
    for (const r of rel.enables) for (const x of r.alsoEnables || []) md += `- ${x}\n`;
    md += '\n';
  }
  if (rel.destroys.length) {
    md += `### Broken by RBA\n\n`;
    for (const r of rel.destroys) md += recipeBlock(r, g.name, 'destroys');
  }

  if (g.intendedRoute) {
    const ir = g.intendedRoute;
    md += `### Intended route\n\n`;
    md += `- **Age**: ${ir.age}\n- **Where**: ${ir.where}\n- **How**: ${ir.how}\n`;
    if (ir.requires && ir.requires.length) md += `- **Requires**: ${ir.requires.join('; ')}\n`;
    if (ir.notes) md += `- **Note**: ${ir.notes}\n`;
    if (ir.rbaAlternative) md += `- **RBA alternative**: ${ir.rbaAlternative}\n`;
    md += '\n';
  }

  const tags = g.classification.routeTags;
  const excl = g.classification.exclusionGroups;
  if (tags.length || excl.length) {
    md += `### What bingo itself says\n\n`;
    if (tags.length) md += `- Route tags: ${tags.map((t) => `\`${t}\``).join(', ')}\n`;
    if (excl.length) md += `- Mutually exclusive group(s): ${excl.map((t) => `\`${t}\``).join(', ')}\n`;
    const rows = conflicts.rows.filter((c) => c.route === g.name || c.breaks === g.name);
    const confirmed = rows.filter((c) => c.verdict === 'CONFIRMED');
    if (confirmed.length) {
      md += `- Pairs bingo already prices negatively: ` +
        confirmed.map((c) => `${c.route} ↮ ${c.breaks}`).slice(0, 6).join('; ') +
        (confirmed.length > 6 ? ` (+${confirmed.length - 6} more)` : '') + '\n';
    }
    md += '\n';
  }
  md += '---\n\n';
}

fs.writeFileSync(path.join(OUT, 'rba-writeups.md'), md);
console.log(`wrote ${linked.length} goal writeups, ${Math.round(md.length / 1024)} KB`);
