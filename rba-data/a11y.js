const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
/*
 * Shared accessibility gates for the generated pages.
 *
 * The design rule these enforce: colour is never the only channel for meaning,
 * and every fg/bg pair clears WCAG AA in BOTH themes. The colour half is
 * checkable, so it is checked on every build rather than asserted in a comment.
 * (The glyph/wording half is a review discipline, not something a linter sees.)
 */

function toLin(c) {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function lum(hex) {
  const h = hex.replace('#', '');
  return 0.2126 * toLin(parseInt(h.slice(0, 2), 16))
    + 0.7152 * toLin(parseInt(h.slice(2, 4), 16))
    + 0.0722 * toLin(parseInt(h.slice(4, 6), 16));
}
function ratio(a, b) {
  const la = lum(a), lb = lum(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/* Declarations are not one-per-line and some are var(--other), so match
   globally then resolve indirection against the base :root block. */
function rawTokens(css, blockRe) {
  const m = blockRe.exec(css);
  if (!m) throw new Error('token block not found: ' + blockRe);
  const out = {};
  for (const [, name, value] of m[1].matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/g)) out[name] = value.trim();
  return out;
}

function resolve(scope, base) {
  const out = {};
  const lookup = (name, depth) => {
    if (depth > 8) throw new Error('var() cycle on --' + name);
    const v = scope[name] !== undefined ? scope[name] : base[name];
    if (v === undefined) return undefined;
    const ref = /^var\(\s*--([a-z0-9-]+)\s*\)$/.exec(v);
    if (ref) return lookup(ref[1], depth + 1);
    return /^#[0-9a-fA-F]{6}$/.test(v) ? v : undefined;
  };
  for (const name of new Set([...Object.keys(base), ...Object.keys(scope)])) {
    const hex = lookup(name, 0);
    if (hex) out[name] = hex;
  }
  return out;
}

/* The DEFAULT dark theme lives in @media (prefers-color-scheme: dark), not in the [data-theme]
   block — and that media block is what most readers actually get, since the theme attribute is only
   set when someone uses the toggle. This used to check only the attribute blocks, so the default
   rendering was ungated; it passed because the two dark blocks happen to be hand-duplicated. Parse
   the media block AND assert the two agree, so the duplication cannot silently drift apart. */
function themes(html) {
  const css = /<style>([\s\S]*?)<\/style>/.exec(html)[1];
  const base = rawTokens(css, /:root\s*\{([\s\S]*?)\}/);
  const mediaDark = rawTokens(css, /@media\s*\(prefers-color-scheme:\s*dark\)\s*\{\s*:root\s*\{([\s\S]*?)\}/);
  const attrDark = rawTokens(css, /:root\[data-theme="dark"\]\s*\{([\s\S]*?)\}/);

  const drift = [...new Set([...Object.keys(mediaDark), ...Object.keys(attrDark)])]
    .filter((k) => mediaDark[k] !== attrDark[k]);
  if (drift.length) {
    throw new Error(
      'the two dark themes have drifted apart, so one of them is unchecked: ' +
      drift.map((k) => `--${k} is "${mediaDark[k]}" under prefers-color-scheme but "${attrDark[k]}" under [data-theme]`).join('; ')
    );
  }

  return {
    light: resolve(rawTokens(css, /:root\[data-theme="light"\]\s*\{([\s\S]*?)\}/), base),
    dark: resolve(attrDark, base),
    'dark (prefers-color-scheme)': resolve(mediaDark, base),
  };
}

/* Pairs the CSS actually produces, for rules that declare a colour AND a background in the same
   block — those are self-contained, so no cascade guesswork is involved. This does not replace the
   hand list (most text inherits its background from an ancestor, which cannot be resolved
   statically), but it means a new self-contained pairing is checked without anyone remembering to
   add it. */
function pairsFromCss(html, min = 4.5) {
  const css = /<style>([\s\S]*?)<\/style>/.exec(html)[1];
  const out = [];
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const fg = /(?:^|[;\s])color\s*:\s*var\(--([a-z0-9-]+)\)/.exec(m[2]);
    const bg = /background(?:-color)?\s*:\s*var\(--([a-z0-9-]+)\)/.exec(m[2]);
    if (fg && bg && fg[1] !== bg[1]) out.push([fg[1], bg[1], min, m[1].trim()]);
  }
  return out;
}

/** pairs: [fgToken, bgToken, minRatio][] — 4.5 for text, 3.0 for UI boundaries */
function checkContrast(html, pairs) {
  const all = themes(html);
  /* Hand-listed pairs plus every self-contained pairing the CSS declares, deduped. The hand list
     alone had drifted between the two pages and was missing a pair that genuinely renders. */
  const merged = new Map();
  for (const [fg, bg, req, why] of [...pairs, ...pairsFromCss(html)]) {
    const key = fg + '|' + bg;
    const prev = merged.get(key);
    if (!prev || req > prev[2]) merged.set(key, [fg, bg, req, why]);
  }
  const failures = [];
  let checked = 0;
  for (const themeName of Object.keys(all)) {
    const t = all[themeName];
    for (const [fg, bg, req, why] of merged.values()) {
      if (!t[fg] || !t[bg]) { failures.push(`${themeName}: missing token ${!t[fg] ? fg : bg}`); continue; }
      checked++;
      const r = ratio(t[fg], t[bg]);
      if (r < req) {
        failures.push(`${themeName}: ${fg} on ${bg} = ${r.toFixed(2)}, need ${req}${why ? '  (' + why + ')' : ''}`);
      }
    }
  }
  return { failures, checked, themes: Object.keys(all).length, pairs: merged.size };
}

/** every visible form control needs an accessible name, and no label may dangle */
function checkFormNames(html) {
  const body = html.replace(/<style>[\s\S]*?<\/style>/, '').replace(/<script[\s\S]*?<\/script>/g, '');
  const failures = [];
  const controls = [...body.matchAll(/<(input|select|textarea)\b([^>]*)>/g)];
  for (const [, tag, attrs] of controls) {
    const id = (/id="([^"]+)"/.exec(attrs) || [])[1];
    const type = (/type="([^"]+)"/.exec(attrs) || [])[1] || 'text';
    if (type === 'hidden') continue;
    const hasAria = /aria-label(ledby)?=/.test(attrs);
    const hasLabel = id && new RegExp(`<label[^>]*for="${id}"`).test(body);
    if (!hasAria && !hasLabel) failures.push(`no accessible name: <${tag}${id ? ' id="' + id + '"' : ''}>`);
  }
  for (const [, forId] of body.matchAll(/<label[^>]*for="([^"]+)"/g)) {
    if (!new RegExp(`id="${forId}"`).test(body)) failures.push(`<label for="${forId}"> targets no element`);
  }
  return { failures, checked: controls.length };
}

/**
 * The Artifact host supplies its own <head>; a plain static server does not, and
 * without a charset every em dash and glyph mojibakes. So emit both shapes.
 */
function wrapStandalone(fragment, fallbackTitle) {
  const title = (/<title>([\s\S]*?)<\/title>/.exec(fragment) || [, fallbackTitle])[1];
  return '<!doctype html>\n<html lang="en">\n<head>\n'
    + '<meta charset="utf-8">\n'
    + '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
    + `<title>${title}</title>\n`
    + '</head>\n<body>\n'
    + fragment.replace(/<title>[\s\S]*?<\/title>\n?/, '')
    + '\n</body>\n</html>\n';
}


/* A page shell for the soh.tools site, as opposed to wrapStandalone's bare one.
 *
 * It links css/site-header.css and nothing else. It deliberately does NOT link css/site.css: that
 * file sets body{padding:20px; height:50vh; display:flex} for the legacy tool layout and carries
 * global element rules, all of which would fight the generated page's own CSS and break the
 * contrast pairs its build asserts. The header stylesheet was split out for exactly this.
 *
 * scripts/site-header.js derives its own base path from its src attribute, so the nav links stay
 * correct however deep the page sits.
 */
/* The two shared assets these pages carry, stamped with their own content hash.
   stamp_assets.js deliberately skips generated directories, so without this the published pages
   would reference site-header.css and site-header.js with no query and cache them forever —
   exactly the bug the inert `?v=<!-- VERSION -->` placeholder caused everywhere else. Hashing at
   build time keeps them correct without a second pass over the output. */
function stamped(base, rel) {
  const hash = crypto.createHash('sha1')
    .update(fs.readFileSync(path.join(__dirname, '..', rel)))
    .digest('hex').slice(0, 8);
  return `${base}${rel}?v=${hash}`;
}

function wrapSitePage(fragment, { title, description, url, base = '../' }) {
  const pageTitle = (/<title>([\s\S]*?)<\/title>/.exec(fragment) || [, title])[1];
  const esc = (v) => String(v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  return '<!doctype html>\n<html lang="en">\n<head>\n'
    + '<meta charset="utf-8">\n'
    + '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
    + `<title>${esc(pageTitle)}</title>\n`
    + '<meta property="og:type" content="website">\n'
    + '<meta property="og:site_name" content="soh.tools">\n'
    + `<meta property="og:title" content="${esc(title)}">\n`
    + `<meta property="og:description" content="${esc(description)}">\n`
    + `<meta property="og:url" content="${esc(url)}">\n`
    + '<meta name="theme-color" content="#673AB7">\n'
    + `<link rel="stylesheet" href="${esc(stamped(base, 'css/site-header.css'))}">\n`
    + '</head>\n<body>\n'
    + `<script src="${esc(stamped(base, 'scripts/site-header.js'))}"></script>\n`
    + fragment.replace(/<title>[\s\S]*?<\/title>\n?/, '')
    + '\n</body>\n</html>\n';
}

module.exports = { ratio, themes, pairsFromCss, checkContrast, checkFormNames, wrapStandalone, wrapSitePage };
