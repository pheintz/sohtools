/* Run the whole pipeline in order. */
const { execFileSync } = require('child_process');
const steps = [
  'parse_goals.js',        // bingo goal-list.js  -> out/goals.json
  'analyze_types.js',      //                     -> out/synergy-categories.txt
  'build_rba_table.js',    // E:/oot decomp       -> out/rba-offsets.json
  'build_goal_dataset.js', //                     -> out/goals-v10.6.json
  'rba_recipes.js',        //                     -> out/rba-recipes.json (validates goal names)
  'prerequisites.js',      //                     -> out/prerequisites.json
  'collections.js',        //                     -> out/collections.json (asserts skulltula counts)
  'community_locations.js',//                     -> out/community-locations.json
  'validate_community.js', //                     -> out/community-validation.txt (FAILS on a contradiction)
  'validate_claims.js',    //                     -> out/claim-validation.txt (FAILS on an overclaim)
  'validate_rules.js',     // bingo info.js       -> out/rules-validation.txt (FAILS on a rules violation)
  'build_merged.js',       //                     -> out/dataset.json
  'build_conflicts.js',    //                     -> out/conflicts.json
  'build_writeups.js',     //                     -> out/rba-writeups.md
  'build_board_data.js',   // bingo generator     -> out/board-data.json (ASSERTS board parity)
  'verify_board_synergy.js', //                   -> out/board-synergy-verification.txt (FAILS on drift)
  'tkc_tips.js',           // sources/tkc-*.md    -> out/tkc-tips.json (FAILS on an unmatched heading)
  'build_web_data.js',     //                     -> out/web-goals.json
  'build_goals_page.js',   //                     -> out/goals-page.html
  'build_rba_page.js',     //                     -> out/rba-design.html
  'validate_rba_page.js', //                    -> out/rba-page-validation.txt (FAILS on page/generator drift)
  'build_popout_data.js',  // bingo item-tracker  -> out/popout-data.json (FAILS on a missing icon)
  'build_popout_page.js',  //                     -> out/popout.html
];
for (const s of steps) {
  process.stdout.write(`\n== ${s}\n`);
  process.stdout.write(execFileSync(process.execPath, [s], { cwd: __dirname, encoding: 'utf8' }));
}
