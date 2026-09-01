**Paraphrased from [OoT Bingo Tutorial, RBA Traps (Part 1)](https://youtu.be/n-5KSqjEJ2A) and
[Part 2](https://youtu.be/jWXcpqeJkzE) by [triforce3250](https://www.youtube.com/@triforce3250).**

These are the routing notes only, what you have to do before or after a write. What each write
actually gives and takes is decoded from the game and lives in `rba-offsets.json`; nothing in this
file restates it. Every `assert` line below is checked against that data at build time, so a note
cannot quietly drift away from the bytes it describes.

Part 1 covers the first three adult-trade bytes, Part 2 the remaining four.

---

## Pocket Egg (0x2D)

source: n-5KSqjEJ2A
subjects: Deku Stick capacity, Deku Nut capacity, Bullet Bag
assert: bug grants Deku Stick capacity := 6
assert: bug grants Bullet Bag += 4
assert: empty grants Deku Stick capacity := 2

- 30 Deku Sticks and a 40 or 50 Bullet Bag cannot both survive. The write that reaches 30 sticks
  also sets the Bullet Bag's top bit, which glitches it.

## Pocket Cucco (0x2E)

source: n-5KSqjEJ2A
subjects: Strength, Scale, Wallet, Bullet Bag
assert: every grants Wallet := 1
assert: every permanent Bullet Bag bits 14-15
assert: empty grants Scale := 2
assert: bug grants Strength += 4

- The gauntlet colour comes from what you already own, not from the write: Goron's Bracelet gives
  Green, Silver gives Blue, Gold gives Bronze, nothing gives Black.
- Writing again with an empty bottle restores your original strength. The scale never returns to
  Silver and the wallet never returns to Giant's.

## Cojiro (0x2F)

source: n-5KSqjEJ2A
subjects: Quiver, Bomb Bag, Strength
assert: every permanent Strength bits 6-7
assert: fish grants Quiver := 1
assert: empty erases Quiver := 4
assert: bug grants Bomb Bag := 3

- For a Quiver 40 or 50 goal, write with a fish. That leaves a real Quiver 30, which upgrades
  normally; the glitched quiver from an empty bottle or bugs does not.

## Odd Mushroom (0x30)

source: jWXcpqeJkzE
subjects: Heart Piece count
archetypes: heart-collection
assert: every grants Heart Piece count

- Odd Mushroom overwrites your heart pieces and sets the count to 1.

## Odd Potion (0x31)

source: jWXcpqeJkzE
subjects: Stone of Agony, Gerudo's Card, Song of Storms, Song of Time
archetypes: song-collection
assert: every permanent Stone of Agony
assert: every permanent Gerudo's Card
assert: bug grants Song of Time

- Stone of Agony and Gerudo's Card are removed by RBA with Odd Potion on C-Right, whatever the
  bottle holds. Collect them afterwards.
- Song of Storms survives only on half milk, so take the windmill afterwards.

## Poacher's Saw (0x32)

source: jWXcpqeJkzE
subjects: Epona's Song, Saria's Song, Sun's Song, Zelda's Lullaby
archetypes: song-collection
assert: every permanent Epona's Song
assert: every permanent Saria's Song
assert: every permanent Sun's Song
assert: every grants Zelda's Lullaby

- Epona's Song, Saria's Song and Sun's Song are removed by RBA with Poacher's Saw on C-Right,
  whatever the bottle holds. On a songs row they have to be relearned afterwards, which means
  going back in time.

## Broken Goron's Sword (0x33)

source: jWXcpqeJkzE
subjects: Light Medallion, Minuet of Forest, Bolero of Fire, Spirit Medallion, Shadow Medallion
archetypes: song-collection, dungeon-clear
assert: every permanent Light Medallion
assert: every permanent Minuet of Forest
assert: every permanent Bolero of Fire
assert: bug grants Shadow Medallion
assert: bug grants Spirit Medallion

- Bugs give Forest, Water, Spirit and Shadow. Spirit plus Shadow is what triggers the Light Arrow
  cutscene and the rainbow bridge.
- Light Medallion, Minuet of Forest and Bolero of Fire are removed by RBA with Broken Goron's
  Sword on C-Right, whatever the bottle holds. Learn the two songs afterwards, or leave this
  byte alone on a songs row.
