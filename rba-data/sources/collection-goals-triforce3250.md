**Paraphrased from [OoT Bingo Tutorial, Collection Goals](https://youtu.be/hRQsPL3JBr4) by
[triforce3250](https://www.youtube.com/@triforce3250).**

Routing notes for the collection goal families: what the cheap baseline block is, which entries are
fast, and which are traps. Same author as `rba-traps-triforce3250.md`.

Counts and locations here are cross-checked against `collections.js` and `community_locations.js`.
`assert` lines name an offset and are checked against `rba-offsets.json` at build time, so a note
cannot drift away from the bytes it describes. Nothing here restates what a write gives or takes;
that is decoded, not sourced.

---

## Gold Skulltulas

archetypes: skulltula-collection
goals: 15 Different Skulltulas, 20 Different Skulltulas, 30 Different Skulltulas

- The child block is the baseline. Kakariko holds seven as child, six of which are quick, with the
  graveyard next door. A reset to Kokiri Forest then picks up the Lost Woods soft soils, the river
  ladder, the tree, and the pots room before the Market. That lands around 13, or 14 counting the
  one by the Hylian Shield chest, and racers drill that whole stretch as one routine.
- Night matters. Several only spawn at night, while soft soil tokens ignore the time of day, so the
  usual shape is one full night cycle as child before going adult.
- The cheapest adult additions are Death Mountain Trail on the way to a hookshot, the two remaining
  Lost Woods tokens (one needs a boomerang or hookshot to kill), Ice Cavern, Jabu-Jabu, and Gerudo
  Valley at night. Dungeons are dense enough to fill any remaining gap.
- 30 is not always worse than 20. It commits the row to a skulltula route, and once committed the
  dungeon and area skulltula goals on the same row come nearly free.

## Heart Pieces and Hearts

archetypes: heart-collection
assert: 0x30 every grants Heart Piece count
assert: 0x2E empty grants Scale := 2
assert: 0x2E bug grants Strength += 4

- Odd Mushroom RBA sets the heart piece count to 1 whatever the bottle holds, so doing it at 0 of 4
  is free progress, and it repeats. Bingo's own clarifications allow this for the Hearts (no duping)
  goals and refuse it for the Different Heart Pieces goals.
- Trading the mushroom away ends the write. An equip swap keeps a duplicate: hold the real mushroom
  on the C button to the left of the swapped copy, C-Down and C-Right in practice. Trading in
  updates the left button to the Odd Potion and leaves the copy, which still writes. Nothing may be
  equipped over the copy afterwards.
- Kakariko is the heart piece baseline, roughly four counting the graveyard box.
- Other cheap pieces: two on Zora's River reachable with basic movement while hatching the egg, the
  windmill, Dampe when a 16 goal needs the safety margin, Gerudo Valley's two, Lake Hylia, the lab
  dive, a business scrub grotto near Gerudo Valley for 10 rupees, a tree on the way there, Ice
  Cavern, and the Iron Boots one.
- The lab dive piece needs the dive meter, which is the Pocket Cucco trade-off. An empty bottle
  writes the wallet plus a working Golden Scale; bugs write strength instead. Strength is worth it
  when the row needs pushing or bomb flowers, otherwise the dive meter opens more heart pieces.

## Heart Containers

archetypes: boss-kill, heart-collection
goals: Obtain 3 Different Heart Containers, Obtain 4 Different Heart Containers

- Take whichever the row already pays for: King Dodongo if real bombs are on the route, Bongo Bongo
  if hover boots are, Morpha if Serenade is. Phantom Ganon is reasonable. The Shadow boat skip is
  what keeps Bongo Bongo cheap.

## Songs

archetypes: song-collection, song-single
assert: 0x31 bug grants Song of Time
assert: 0x32 bug grants Serenade of Water
assert: 0x32 bug grants Nocturne of Shadow
assert: 0x32 bug grants Prelude of Light
assert: 0x32 bug grants Zelda's Lullaby

- The trade quest to the Poacher's Saw is the song engine, roughly three and a half to four minutes
  from Kokiri. Odd Potion gives Song of Time, the Saw gives four more, and the Kakariko windmill
  gives Song of Storms, so six songs is close to free on any row already running the trade quest.
- Order matters. The Odd Potion write erases Song of Storms, so take the windmill after the write.
- Minuet and Bolero bring it to eight. Nine and ten then need Sun's Song and Requiem, and Requiem is
  the long pole.
- Without the trade quest, four is the comfortable ceiling. Seven or more effectively forces the Saw.

## Maps and Boss Keys

archetypes: dungeon-item-collection, dungeon-item-single
assert: 0x39 bug grants Water Temple: Boss Key + Map
assert: 0x39 empty grants Water Temple: Map
assert: 0x39 fish grants Water Temple: Boss Key
assert: 0x38 bug grants Fire Temple: Boss Key + Map
assert: 0x3a bug grants Spirit Temple: Boss Key + Map

- The elemental arrows line up with their own temples: Ice Arrow writes Water, Fire Arrow writes
  Fire, Light Arrow writes Spirit.
- Do the write before collecting that dungeon's compass, since every value except half milk clears
  a compass you already had.
- Water's boss key through the Ice Arrow write usually beats taking it in the dungeon, unless the
  row already has you deep in Water with keys.
- Fire's boss key and boss door are both straightforward once you are inside. Shadow is reasonable
  when the row already has Zelda's Lullaby. Spirit's key and door are both slower than they look.
  Forest is slow unless the row already climbs it.

## Compasses

archetypes: dungeon-item-collection

- No RBA route, so every compass is collected in its dungeon and the goal is pure dungeon routing.
- Roughly fastest first: Bottom of the Well (a hop in and out; the map is in the basement and needs
  bombchus), Dodongo's Cavern (both fast and usually already on the route), Shadow Temple (both fast
  when hover boots are already paid for), Ice Cavern (compass fast, map reasonable), Jabu-Jabu
  (compass beats the map, which needs a boomerang, and the compass side skips the Ruto sequence),
  then Water Temple.
- The slow ones are Fire Temple map and compass, Spirit Temple map, and Forest Temple compass. All
  four sit deep in the dungeon behind item requirements.

## Silver Rupee Rooms

archetypes: silver-rupees
counts: 16 rooms

- Fastest first: Bottom of the Well's basement (no bombchus needed), Shadow Temple's three, Ice
  Cavern's two on the way to the Iron Boots, and two of Gerudo Training Ground's.
- GTG has three rooms, but the underwater one is slow enough that racers plan around two.
- Spirit Temple adds three, one adult side and two child side.
- Ganon's Castle holds the last four. Spirit Trial is very fast. Fire Trial needs almost no
  equipment but the timer and the void-outs make it frustrating. Light Trial wants Zelda's Lullaby
  and a way past the block. Forest Trial is the hardest, needing a fire source or a child route, and
  its wolfos are a nuisance best handled with deku nuts since killing them costs a long cutscene.
- 10 rooms is one of the longest goals on the board.

## Gold Rupee Chests

archetypes: gold-rupee-chests
counts: 6 chests

- Fastest first: Bottom of the Well in Dead Hand's room, the Kakariko ReDead grotto, the Death
  Mountain Trail grotto opened with Song of Storms near Goron City, and the back of the Goron City
  boulder maze.
- The last two cost more: the back of Gerudo Training Ground, and Fire Temple, which needs a hover.
- Strength is the clean way through the Goron City maze. Without it the route is a momentum setup.

## Stalfos

archetypes: enemy-kill
counts: 15
goals: Defeat 3 Different Stalfos, Defeat 7 Different Stalfos, Defeat 10 Different Stalfos

- Forest Temple has five, two low and three high, and they stay dead.
- Two respawn instead: one in Shadow Temple by the guillotines, one on the Spirit Temple child side.
- Shadow's boat pair needs Zelda's Lullaby and has to actually be killed, since they can fall off
  the boat instead.
- A ten without Zelda's Lullaby is usually five in Forest, two in Gerudo Training Ground, one in
  Shadow, and two in Ganon's. The remaining five are row dependent.

## Reading the board

- The bingo timing sheet is the source of truth for how long a goal takes, and its difficulty column
  is a bucket rather than a difficulty rating. Measured against the sheet itself, the chain is
  `#timey` (raw route time) + `skill` (an execution surcharge, 0 to 1.75) = `time`, and `difficulty`
  is then a contiguous bucketing of `time`: the identity holds for all 251 goals and difficulty
  correlates with time at 0.9991. So difficulty is length, and skill is the part that is actually
  difficulty.
- He adds that collection goals cluster high on skill. That is a lean rather than a cluster: 76% of
  collection-shaped goals carry a non-zero skill against 63% of the rest, mean 0.46 against 0.37.
- Every row has at least one long goal and often that is a collection goal. Identifying it first is
  what makes the rest of the row fall out.
- In race chat, `!silver`, `!gold` and `!stalfos` return these location lists.

---

## Not recorded

- The remark about Forest Temple stalfos needing all of them killed before any count was not clear
  enough in the source to write down as a rule.
- The video puts the Fire Temple gold rupee chest at the top of the dungeon behind a hover from the
  maze room. `community_locations.js` records it as "After the elevator". These may be the same
  chest described differently, so nothing was changed.
