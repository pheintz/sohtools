/*
 * TKC's per-goal strategy notes.
 *
 * Source: `sources/tkc-strategies.md`, a pandoc conversion of an English translation of
 * TKC's OoT Bingo goal-strategy post (v10.5). The markdown is vendored rather than converted at
 * build time so the build needs neither pandoc nor the original .docx.
 *
 * This is community strategy writing, not derived fact: it is kept separate from the decomp model,
 * carries `src: 'tkc'`, and the page attributes it. Nothing in it is treated as instructions to
 * this pipeline, it is parsed as data.
 *
 * The document is v10.5 and the dataset is v10.6, so headings are matched three ways:
 *   1. exact goal name (152 of 174 headings)
 *   2. an `N` template, "N Songs" covers 3/4/6/7/8/9/10 Songs, expanded by regex
 *   3. a small hand-checked alias list for goals v10.6 renamed, each verified by reading the
 *      section body rather than by string similarity
 *
 * Output: out/tkc-tips.json
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'out');
const SRC = path.join(__dirname, 'sources', 'tkc-strategies.md');

const CREDIT = {
  author: 'TKC',
  what: "OoT Bingo — Various Goal Strategies (v10.5)",
  original: 'https://hackmd.io/@tkc014/r1RLk09YJe',
  profile: 'https://hackmd.io/@tkc014',
  fullArticle: 'https://hackmd.io/@tkc014/HJNHz27tyl',
  note: 'English translation of a Japanese post; the translation is imperfect and some link labels were mangled in conversion, so labels are regenerated from the URL where the original text was lost.',
};

/* ---------- heading -> v10.6 goal names ---------- */

// "N" stands in for the number in the source. Each expands to every matching v10.6 goal.
const TEMPLATES = [
  ['N Songs', /^\d+ Songs$/],
  ['N Different Skulltulas (No duping)', /^\d+ Different Skulltulas$/],
  ['N Boss Keys', /^\d+ Boss Keys$/],
  ['Open N Boss Key Doors', /^Open \d+ Boss Key Doors$/],
  ['Clear N Silver Rupee Rooms', /^Clear \d+ Silver Rupee Rooms$/],
  ['Open N Gold Rupee Chests', /Gold Rupee Chests$/],
  ['N Compasses', /^\d+ Compasses$/],
  ['N Maps', /^\d+ Maps$/],
  ['N Hearts', /^\d+ Hearts/],
  ['Obtain N Different Heart Pieces (No Duping)', /^Obtain \d+ Different Heart Pieces$/],
  ['Obtain N Different Heart Containers', /^Obtain \d+ Different Heart Containers$/],
  ['Exactly N Deku Sticks', /^Exactly \d+ Deku Sticks$/],
  ['Quiver (N)', /^Quiver \(\d+\)$/],
  ['Bullet Bag (N)', /^Bullet Bag \(\d+\)$/],
  ['N Magic Beans', /^\d+ Magic Beans$/],
  ['N Unused Keys in Gerudo Training Grounds', /Unused Keys in Gerudo Training Grounds$/],
];

/* Renamed between v10.5 and v10.6. Every one of these was checked by reading the section body,
   not by string similarity, "Defeat Shadow Link" is the Japanese name for Dark Link, and its
   section describes the Water Temple room. */
const ALIASES = {
  'At least 1 Skulltula from each Child Dungeon': ['1 Skulltula from each Child Dungeon'],
  '2 Skulltulas in Lon Lon Ranch': ['2 Lon Lon Ranch area Skulltulas'],
  '3 Skulltulas in Lake Hylia': ['3 Lake Hylia area Skulltulas'],
  'Plant beans in Death Mountain Crater soil': ['Plant bean in Death Mountain Crater'],
  'Defeat Shadow Link': ['Defeat Dark Link'],
  // the body lists all five and labels which are child-only, so it serves the child goal too
  'All 5 Lake Hylia Skulltulas': ['All 5 Lake Hylia area Skulltulas', 'All 3 Child Lake Hylia area Skulltulas'],
};

/* ---------- inline parsing ---------- */

/* pandoc wraps every link label in <u>…</u> and escapes markdown characters. Undo both, and fold
   the trailing-backslash hard breaks so a link split across two lines becomes one token. */
function normalize(text) {
  return text
    // CRLF first: the file is Windows-encoded, so a hard break is "\ \r \n" and matching "\ \n"
    // silently folds nothing, which also leaves links split across two lines unparseable
    .replace(/\r\n/g, '\n')
    .replace(/<\/?u>/g, '')
    .replace(/\\\n/g, ' ')
    // any escaped punctuation, not a fixed list, pandoc also escapes > < | ^ " and more, and a
    // missed one shows up as a stray backslash in the rendered prose
    .replace(/\\([^A-Za-z0-9\s])/g, '$1');
}

const YT = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([A-Za-z0-9_-]{6,})/;

/* Some URLs in the source use `&t=` where it should be `?t=`, and one has the label text glued to
   the id. Take the id as the run of id-safe characters and pull a timestamp from either form. */
function youtube(url) {
  const m = YT.exec(url);
  if (!m) return null;
  const id = m[1];
  const t = /[?&]t=(\d+)/.exec(url);
  return t ? { id, t: Number(t[1]) } : { id };
}

const isBareUrl = (s) => /^https?:\/\//i.test(s.trim());

function labelFor(text, url, yt) {
  const clean = text.trim();
  // conversion mangled some labels into the URL itself; regenerate rather than show a broken one
  if (!clean || isBareUrl(clean)) {
    if (yt) return 'video';
    try { return new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return 'link'; }
  }
  return clean;
}

/* Split a line into plain-text and link runs, preserving order so the page can render the links
   inline exactly where the author put them. */
function runs(line) {
  const out = [];
  const re = /\[([^\]]*)\]\(([^)\s]+)\)/g;
  let last = 0, m;
  while ((m = re.exec(line))) {
    if (m.index > last) {
      const t = line.slice(last, m.index);
      if (t.trim()) out.push({ text: t });
    }
    const url = m[2];
    const yt = youtube(url);
    out.push(yt ? { text: labelFor(m[1], url, yt), url, yt } : { text: labelFor(m[1], url, null), url });
    last = m.index + m[0].length;
  }
  if (last < line.length) {
    const t = line.slice(last);
    if (t.trim()) out.push({ text: t });
  }
  /* The conversion lost the space on either side of some links ("…example: [video]Or you can…").
     Restore it, so the prose does not run into the link text when rendered as inline anchors. */
  for (let i = 1; i < out.length; i++) {
    const prev = out[i - 1], cur = out[i];
    if (!/\s$/.test(prev.text) && !/^[\s.,;:)\]]/.test(cur.text)) {
      if (prev.url) cur.text = ' ' + cur.text;
      else if (cur.url) prev.text = prev.text + ' ';
    }
  }
  return out.length ? out : null;
}

/* ---------- document walk ---------- */

const raw = fs.readFileSync(SRC, 'utf8');
const lines = normalize(raw).split('\n');

const sections = [];      // { section, heading, blocks }
let section = null, current = null;

const pushBlock = (b) => { if (current && b) current.blocks.push(b); };

let listBuf = null;       // { t:'ul'|'ol', items:[] }
const flushList = () => { if (listBuf && listBuf.items.length) pushBlock(listBuf); listBuf = null; };

for (const rawLine of lines) {
  const line = rawLine.replace(/\s+$/, '');

  const h1 = /^# (.+)$/.exec(line);
  if (h1) { flushList(); section = h1[1].trim(); current = null; continue; }

  const h2 = /^## (.+)$/.exec(line);
  if (h2) {
    flushList();
    current = { section, heading: h2[1].trim(), blocks: [] };
    sections.push(current);
    continue;
  }
  if (!current) continue;

  const h3 = /^### (.+)$/.exec(line);
  if (h3) { flushList(); pushBlock({ t: 'h', runs: runs(h3[1].trim()) }); continue; }

  const ul = /^[-*]\s+(.*)$/.exec(line);
  const ol = /^\d+[.)]\s+(.*)$/.exec(line);
  if (ul || ol) {
    const want = ul ? 'ul' : 'ol';
    if (!listBuf || listBuf.t !== want) { flushList(); listBuf = { t: want, items: [] }; }
    const r = runs((ul || ol)[1].trim());
    if (r) listBuf.items.push(r);
    continue;
  }

  if (!line.trim()) { flushList(); continue; }

  flushList();
  pushBlock({ t: 'p', runs: runs(line.trim()) });
}
flushList();

/* ---------- match headings to goals ---------- */

const goalNames = JSON.parse(fs.readFileSync(path.join(OUT, 'goals-v10.6.json'), 'utf8')).map((g) => g.name);
const goalSet = new Set(goalNames);

function targetsFor(heading) {
  if (goalSet.has(heading)) return [heading];
  if (ALIASES[heading]) return ALIASES[heading];
  const tpl = TEMPLATES.find(([label]) => label === heading);
  if (tpl) return goalNames.filter((n) => tpl[1].test(n));
  return [];
}

const tips = {};          // goal name -> [section index, ...]
const sectionIndex = [];  // deduped section bodies
const unmatched = [];
let blockCount = 0, linkCount = 0, videoCount = 0;

for (const s of sections) {
  if (!s.blocks.length) continue;
  const targets = targetsFor(s.heading);
  if (!targets.length) { unmatched.push(s.heading); continue; }

  for (const b of s.blocks) {
    blockCount++;
    const rs = b.t === 'ul' || b.t === 'ol' ? [].concat(...b.items) : b.runs || [];
    for (const r of rs) { if (r.url) linkCount++; if (r.yt) videoCount++; }
  }
  /* One heading often serves many goals, "N Songs" covers seven, and the three
     "N Different Skulltulas" goals share the same 54 blocks. Store each section ONCE and let goals
     reference it by index; inlining it per goal roughly quadrupled the payload. */
  const idx = sectionIndex.length;
  sectionIndex.push({ heading: s.heading, section: s.section, blocks: s.blocks });
  for (const goal of targets) (tips[goal] ??= []).push(idx);
}

/* ---------- assert, then emit ---------- */
const problems = [];
if (unmatched.length) {
  problems.push(`${unmatched.length} heading(s) match no v10.6 goal:\n    ` + unmatched.join('\n    '));
}
if (Object.keys(tips).length < 150) {
  problems.push(`only ${Object.keys(tips).length} goals got notes, the parse probably broke`);
}
if (problems.length) {
  console.error('TKC TIPS PARSE FAILED:\n  ' + problems.join('\n  '));
  process.exit(1);
}

fs.writeFileSync(path.join(OUT, 'tkc-tips.json'), JSON.stringify({ credit: CREDIT, sections: sectionIndex, tips }, null, 1));

console.log(`headings parsed : ${sections.length}`);
console.log(`goals covered   : ${Object.keys(tips).length} of ${goalNames.length}`);
console.log(`blocks / links  : ${blockCount} / ${linkCount} (${videoCount} videos)`);
console.log(`unmatched       : none`);
