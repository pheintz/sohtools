/*
 * Stamp a content hash into every local CSS/JS reference in the site's HTML.
 *
 * The pages shipped with `?v=<!-- VERSION -->`, which nothing ever substituted. An HTML comment is
 * not special inside an attribute value, so the browser requested a literal, constant query string
 * and cached the file against it forever. The cache-busting looked present and did nothing: during
 * the restyle the browser twice served a stale site.css and site-header.js, and a deploy would do
 * the same to anyone who had visited before.
 *
 * A content hash is used rather than a date or a counter, because it changes exactly when the file
 * changes. Editing nothing and re-running this rewrites nothing, so it is safe to run on every
 * commit and it never invalidates a cache without cause.
 *
 * Run: node stamp_assets.js          stamp, and report what moved
 *      node stamp_assets.js --check  exit 1 if anything is out of date, change nothing
 *
 * GitHub Pages serves this repo directly with no build step, so the stamped HTML has to be
 * committed like any other source.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const CHECK = process.argv.includes('--check');

/* The site is one HTML file per tool directory, plus the landing page. Generated output under
   bingo/ and rba/ is deliberately skipped: those pages inline everything they need, so they have
   no external asset to stamp. */
const SKIP_DIRS = new Set(['.git', '.vs', '.github', '.claude', 'node_modules', 'rba-data', 'bingo', 'rba', 'img', 'yamlGen']);

function htmlFiles(dir, depth = 0) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name) || depth >= 2) continue;
      out.push(...htmlFiles(path.join(dir, entry.name), depth + 1));
    } else if (entry.name.endsWith('.html')) {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

const hashCache = new Map();
function hashOf(file) {
  if (!hashCache.has(file)) {
    hashCache.set(file, crypto.createHash('sha1').update(fs.readFileSync(file)).digest('hex').slice(0, 8));
  }
  return hashCache.get(file);
}

/* Matches href/src on a local .css or .js, with or without an existing query. Absolute URLs are
   left alone — a CDN's cache is not ours to bust. */
const REF = /((?:href|src)=")([^"?#]+\.(?:css|js))(\?[^"]*)?(")/g;

let stamped = 0, stale = 0, missing = [];
for (const file of htmlFiles(ROOT)) {
  const before = fs.readFileSync(file, 'utf8');
  const dir = path.dirname(file);

  const after = before.replace(REF, (whole, pre, url, query, post) => {
    if (/^(https?:)?\/\//.test(url)) return whole;
    const target = path.resolve(dir, url);
    if (!fs.existsSync(target)) {
      missing.push(`${path.relative(ROOT, file)} -> ${url}`);
      return whole;
    }
    const want = `?v=${hashOf(target)}`;
    if (query !== want) stale++;
    return pre + url + want + post;
  });

  if (after !== before) {
    stamped++;
    if (!CHECK) fs.writeFileSync(file, after);
    console.log(`${CHECK ? 'out of date' : 'stamped'}: ${path.relative(ROOT, file)}`);
  }
}

/* A reference to a file that is not there is always a bug — it is a 404 on a live page — so it
   fails whether or not this is a check run. */
if (missing.length) {
  console.error(`\nreferences to files that do not exist (${missing.length}):`);
  for (const m of missing) console.error('  ' + m);
  process.exit(1);
}

if (!stamped) {
  console.log('every asset reference is already current');
} else if (CHECK) {
  console.error(`\n${stamped} file(s) carry a stale asset hash — run: node stamp_assets.js`);
  process.exit(1);
} else {
  console.log(`\n${stamped} file(s) updated, ${stale} reference(s) re-stamped`);
}
