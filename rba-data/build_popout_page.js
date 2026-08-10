/*
 * Build the stream popout: inject the icon/tracker payload, the board generator and the goal
 * lists, then run the same accessibility gates the other two pages run.
 *
 * Output: out/popout.html
 */
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, 'out');

const tpl = fs.readFileSync(path.join(__dirname, 'popout.template.html'), 'utf8');
const { checkContrast, checkFormNames, wrapStandalone } = require('./a11y');

/* The popout draws far fewer colour combinations than the explorer, so this list is short — but it
   is the combinations this page actually paints, checked in all three themes. */
const PAIRS = [
  ['fg', 'bg', 4.5], ['fg', 'bg-slab', 4.5],
  ['fg-muted', 'bg', 4.5], ['fg-muted', 'bg-slab', 4.5],
  ['fg-faint', 'bg', 4.5],
  ['accent', 'bg-slab', 4.5],
  // square states paint their text on their own tinted ground
  ['gain', 'gain-soft', 4.5], ['loss', 'loss-soft', 4.5],
  // the clock sits on the slab; its running colour is the gain green
  ['perm', 'bg-slab', 4.5], ['gain', 'bg-slab', 4.5],
  ['rule-strong', 'bg-slab', 3.0], ['rule-strong', 'bg', 3.0],
  ['focus', 'bg', 3.0], ['focus', 'bg-slab', 3.0],
];

/* OBS Window Capture matches on the window title, so it has to be the same string for every line
   and every input shape — otherwise the source goes blank the moment a streamer switches lines.
   The runtime sets it and the wrapper sets it; both are asserted here so they cannot drift, and so
   nobody reintroduces the line label by interpolating into it. */
const WINDOW_TITLE = 'OoT Bingo Popout';
if (!tpl.includes(`document.title = "${WINDOW_TITLE}";`)) {
  console.error(`the popout must set a constant document.title of "${WINDOW_TITLE}" — OBS matches windows by title`);
  process.exit(1);
}

const contrast = checkContrast(tpl, PAIRS);
const names = checkFormNames(tpl);
const failures = [...contrast.failures, ...names.failures];
if (failures.length) {
  console.error('ACCESSIBILITY CHECK FAILED:\n  ' + failures.join('\n  '));
  process.exit(1);
}

const popData = fs.readFileSync(path.join(OUT, 'popout-data.json'), 'utf8').replace(/</g, '\\u003c');
const boardData = fs.readFileSync(path.join(OUT, 'board-data.json'), 'utf8').replace(/</g, '\\u003c');
const boardGenerator = fs.readFileSync(path.join(OUT, 'board-generator.js'), 'utf8');

for (const [marker, payload] of [
  ['/*__POPOUT_DATA__*/', popData],
  ['/*__BOARD_DATA__*/', boardData],
  ['/*__BOARD_GENERATOR__*/', boardGenerator],
]) {
  if (!tpl.includes(marker)) {
    console.error(`template is missing ${marker}`);
    process.exit(1);
  }
  if (payload.includes('</script')) {
    console.error(`payload for ${marker} contains "</script" and would close the tag early`);
    process.exit(1);
  }
}

// `$` is special in String.replace patterns, so every injection goes through a function replacer
const fragment = tpl
  .replace('/*__POPOUT_DATA__*/', () => popData)
  .replace('/*__BOARD_DATA__*/', () => boardData)
  .replace('/*__BOARD_GENERATOR__*/', () => boardGenerator);

// same string as the runtime sets, so the title never differs before the script runs
const standalone = wrapStandalone(fragment, WINDOW_TITLE);

fs.writeFileSync(path.join(OUT, 'popout.fragment.html'), fragment);
fs.writeFileSync(path.join(OUT, 'popout.html'), standalone);

/* Beside the goal index on purpose: that page builds the link with
   new URL("popout.html", location.href), so the two must be siblings. No site header here — this is
   a stream overlay, and a nav bar would be captured into someone's scene. */
const SITE = path.join(__dirname, '..', 'bingo');
fs.mkdirSync(SITE, { recursive: true });
fs.writeFileSync(path.join(SITE, 'popout.html'), standalone);

console.log(`contrast checks: ${contrast.checked} (${contrast.pairs} pairs) across ${contrast.themes} themes — all pass`);
console.log(`form controls checked:  ${names.checked} — all have an accessible name`);
console.log(`page written:           out/popout.html (${(standalone.length / 1024).toFixed(0)} KB standalone)`);
console.log(`window title:           "${WINDOW_TITLE}" — constant, for OBS title matching`);
console.log(`site page written:      bingo/popout.html (no site header — stream overlay)`);
