/*
 * Flesch-Kincaid grade level for the prose on the generated pages.
 *
 * Run: node reading_level.js [file...]     (defaults to the RBA page template)
 *
 * This is a rough instrument and it is worth saying how rough. FK counts syllables and sentence
 * length and nothing else, so it cannot tell that "byte" is easier than "adventure" (one syllable
 * versus three). Terms this page cannot avoid — inventory, equipment, Gerudo — push the number up
 * no matter how plain the sentences around them are.
 *
 * It is still worth having, because the things it DOES catch are the things that actually made this
 * page hard: sentences that run past 25 words, and clauses stacked behind em dashes and semicolons.
 * Use it to find the paragraphs to look at, not as a target to optimise.
 */
const fs = require('fs');
const path = require('path');

/* Strip markup, scripts and styles, then split into the blocks a reader meets. Attribute text and
   code samples are excluded: nobody reads a class name, and code should not be scored as prose. */
function blocks(html) {
  const body = html.slice(Math.max(0, html.indexOf('<div class="wrap">')));
  const stripped = body
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<code[\s\S]*?<\/code>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');

  const out = [];
  const re = /<(p|li|h1|h2|h3)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let m;
  while ((m = re.exec(stripped))) {
    const text = decode(m[2].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
    if (text.split(/\s+/).length >= 12) out.push({ tag: m[1].toLowerCase(), text });
  }
  return out;
}

function decode(s) {
  return s
    .replace(/&mdash;/g, '—').replace(/&ndash;/g, '–').replace(/&middot;/g, '·')
    .replace(/&ldquo;|&rdquo;/g, '"').replace(/&rsquo;|&lsquo;/g, "'")
    .replace(/&nbsp;|&#8209;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&hellip;/g, '...')
    .replace(/&[a-z]+;/gi, ' ');
}

/* Vowel-group counting with the usual silent-e correction. Wrong on maybe one word in twenty, which
   is fine at paragraph scale and hopeless on a single word — another reason not to chase the score. */
function syllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  const groups = w.replace(/e$/, '').match(/[aeiouy]+/g);
  return Math.max(1, groups ? groups.length : 1);
}

function score(text) {
  const sentences = text.split(/[.!?]+(?:\s|$)/).filter((s) => s.trim().length > 1);
  const words = text.match(/[A-Za-z][A-Za-z'-]*/g) || [];
  if (!sentences.length || !words.length) return null;
  const syl = words.reduce((n, w) => n + syllables(w), 0);
  const wps = words.length / sentences.length;
  const spw = syl / words.length;
  return {
    grade: 0.39 * wps + 11.8 * spw - 15.59,
    words: words.length,
    sentences: sentences.length,
    wordsPerSentence: wps,
    longest: Math.max(...sentences.map((s) => (s.match(/[A-Za-z][A-Za-z'-]*/g) || []).length)),
  };
}

const files = process.argv.slice(2);
if (!files.length) files.push(path.join(__dirname, 'rba-design.template.html'));

for (const file of files) {
  const bs = blocks(fs.readFileSync(file, 'utf8'));
  const scored = bs.map((b) => ({ ...b, ...score(b.text) })).filter((b) => b.grade != null);
  const totalWords = scored.reduce((n, b) => n + b.words, 0);
  const weighted = scored.reduce((n, b) => n + b.grade * b.words, 0) / totalWords;

  console.log(`\n=== ${path.basename(file)} ===`);
  console.log(`blocks ${scored.length} · ${totalWords} words · weighted grade ${weighted.toFixed(1)}`);
  const over = scored.filter((b) => b.grade > 8).sort((a, b) => b.grade - a.grade);
  console.log(`above grade 8: ${over.length} of ${scored.length}\n`);
  for (const b of over) {
    console.log(`  grade ${b.grade.toFixed(1)} · ${b.wordsPerSentence.toFixed(0)} w/sentence · longest ${b.longest}`);
    console.log(`    ${b.text.slice(0, 150)}${b.text.length > 150 ? '…' : ''}`);
  }
}
