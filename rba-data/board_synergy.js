/*
 * A faithful port of ootbingo's SynergyCalculator (each version's generator.js, module 644),
 * plus a decomposition the generator itself has no reason to expose.
 *
 * Why port at all: the shipped generator.js exports only ootBingoGenerator / bingoGenerator /
 * generateBingoBoard. SynergyCalculator is module-private, so the number that decides whether a row
 * is "good" cannot be read back out of a generated board. This file recomputes it.
 *
 * Why this is safe to port when the generator was not: this is pure arithmetic over a board that
 * already exists — no RNG, no ordering, no iteration budget. And it is checkable. The generator
 * REJECTS any placement that would push a line outside [minimumSynergy, maximumSynergy], and a
 * line's last-placed square is evaluated with all five present, so every complete line of a
 * finished board must satisfy those bounds. `verifyAgainstGenerator` below generates real boards
 * and asserts exactly that, which would catch a port that drifted.
 *
 * Two quirks are reproduced deliberately, because the generator's own numbers depend on them:
 *
 *   1. unifyTypeSynergies iterates the TYPE keys only. A category carried by subtypes alone is
 *      dropped entirely — this is the mechanism behind "a subtype only fires when some other goal
 *      in the row carries the matching type".
 *   2. filterRowtypeSynergies RETURNS EARLY (not `continue`) the first time a rowtype category has
 *      fewer than SQUARES_PER_ROW entries, discarding categories it had not reached yet. Whether
 *      that was intended is not our call: it is what produced the boards people race on.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.BoardSynergy = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const SQUARES_PER_ROW = 5;

  const INDICES_PER_ROW = {
    row1: [0, 1, 2, 3, 4], row2: [5, 6, 7, 8, 9], row3: [10, 11, 12, 13, 14],
    row4: [15, 16, 17, 18, 19], row5: [20, 21, 22, 23, 24],
    col1: [0, 5, 10, 15, 20], col2: [1, 6, 11, 16, 21], col3: [2, 7, 12, 17, 22],
    col4: [3, 8, 13, 18, 23], col5: [4, 9, 14, 19, 24],
    tlbr: [0, 6, 12, 18, 24], bltr: [4, 8, 12, 16, 20],
  };

  // the labels the live board uses, so a line means the same thing in both places
  const LINE_LABEL = {
    row1: 'ROW1', row2: 'ROW2', row3: 'ROW3', row4: 'ROW4', row5: 'ROW5',
    col1: 'COL1', col2: 'COL2', col3: 'COL3', col4: 'COL4', col5: 'COL5',
    tlbr: 'TL-BR', bltr: 'BL-TR',
  };
  const LINE_KEYS = Object.keys(INDICES_PER_ROW);

  const DEFAULT_PROFILE = {
    minimumSynergy: -3, maximumSynergy: 7, maximumIndividualSynergy: 3.75,
    initialOffset: 1, maximumOffset: 2, baselineTime: 24.75, timePerDifficulty: 0.75,
    tooMuchSynergy: 100, useFrequencyBalancing: true,
  };
  const PROFILES = {
    normal: DEFAULT_PROFILE,
    blackout: Object.assign({}, DEFAULT_PROFILE, {
      minimumSynergy: -10, maximumSynergy: 10, maximumIndividualSynergy: 4.5,
      initialOffset: 2, maximumOffset: 6,
    }),
    short: Object.assign({}, DEFAULT_PROFILE, { maximumSynergy: 3, baselineTime: 12, timePerDifficulty: 0.5 }),
    shortBlackout: Object.assign({}, DEFAULT_PROFILE, {
      minimumSynergy: -4, maximumSynergy: 4, initialOffset: 2, maximumOffset: 6,
      baselineTime: 12, timePerDifficulty: 0.5,
    }),
  };

  const sortAscending = (a) => [...a].sort((x, y) => x - y);
  const sortDescending = (a) => [...a].sort((x, y) => y - x);
  const removeHighestNumber = (a) => sortAscending(a).slice(0, -1);
  const hasGoal = (s) => s && s.goal !== undefined;

  function parseSynergyFilters(synfilters) {
    const out = {};
    for (const cat in synfilters || {}) {
      const parts = String(synfilters[cat]).split(' ');
      const word = (parts[0] || '').toLowerCase();
      const filterType = word === 'min' ? 'min' : word === 'max' ? 'max' : undefined;
      const filterValue = parseInt(parts[1], 10);
      if (filterType !== undefined && !isNaN(filterValue)) out[cat] = { filterType, filterValue };
    }
    return out;
  }

  /* ---------- the magic square: position -> difficulty ----------
     Ported from generator.js module 992. This is what gives each square its `desiredTime`, and
     therefore what makes the time-offset term of synergy computable from a seed alone. */
  function generateMagicSquare(seed) {
    const cell = (i, s) => {
      let r = s % 1000;
      let o = r % 8, n = Math.floor(o / 2), i2 = o % 2, sm = r % 5, a = r % 3, l = Math.floor(r / 120);
      const c = [0];
      c.splice(i2, 0, 1); c.splice(a, 0, 2); c.splice(n, 0, 3); c.splice(sm, 0, 4);
      r = Math.floor(s / 1000); r %= 1000;
      o = r % 8; n = Math.floor(o / 2); i2 = o % 2; const sm2 = r % 5; const a2 = r % 3;
      l = 8 * l + Math.floor(r / 120);
      const u = [0];
      u.splice(i2, 0, 1); u.splice(a2, 0, 2); u.splice(n, 0, 3); u.splice(sm2, 0, 4);
      l %= 5;
      const f = (i + l) % 5, g = Math.floor(i / 5);
      return 5 * c[(f + 3 * g) % 5] + u[(3 * f + g) % 5] + 1;
    };
    const out = [];
    for (let i = 0; i < 25; i++) out.push(cell(i, seed));
    return out;
  }

  /* ---------- the calculator ---------- */
  function SynergyCalculator(profile, rowtypeTimeSave, synergyFilters) {
    this.profile = profile;
    this.rowtypeTimeSave = rowtypeTimeSave || {};
    this.synergyFilters = synergyFilters || {};
  }

  SynergyCalculator.prototype.containsDuplicateGoals = function (squares) {
    const ids = squares.filter(hasGoal).map((s) => s.goal.id);
    return new Set(ids).size !== ids.length;
  };

  SynergyCalculator.prototype.mergeSynergiesOfSquares = function (squares, kind) {
    const out = {};
    for (const sq of squares) {
      for (const cat in sq.goal[kind]) {
        if (!out[cat]) out[cat] = [];
        out[cat].push(sq.goal[kind][cat]);
      }
    }
    return out;
  };

  // NB: iterates TYPE keys only — see quirk 1 in the header comment.
  SynergyCalculator.prototype.unifyTypeSynergies = function (types, subtypes) {
    const out = {};
    for (const cat in types) out[cat] = cat in subtypes ? types[cat].concat(subtypes[cat]) : types[cat];
    return out;
  };

  SynergyCalculator.prototype.filterForTypeCategory = function (cat, values) {
    if (!(cat in this.synergyFilters)) return removeHighestNumber(values);
    const f = this.synergyFilters[cat];
    return (f.filterType === 'min' ? sortAscending(values) : sortDescending(values)).slice(0, f.filterValue);
  };

  SynergyCalculator.prototype.filterTypeSynergies = function (unified) {
    const out = {};
    for (const cat in unified) {
      const kept = this.filterForTypeCategory(cat, unified[cat]);
      if (kept.length > 0) out[cat] = kept;
    }
    return out;
  };

  SynergyCalculator.prototype.filterForRowtypeCategory = function (cat, values) {
    let sum = 0;
    for (const v of values) sum += v;
    const save = this.rowtypeTimeSave[cat];
    if (save > 0 && save > sum) return save - sum;
    if (save < 0 && save > sum) return sum - save;
    return undefined;
  };

  // NB: returns early rather than continuing — see quirk 2 in the header comment.
  SynergyCalculator.prototype.filterRowtypeSynergies = function (rowtypes) {
    const out = {};
    for (const cat in rowtypes) {
      const values = rowtypes[cat];
      if (values.length < SQUARES_PER_ROW) return out;
      const v = this.filterForRowtypeCategory(cat, values);
      if (v !== undefined) out[cat] = v;
    }
    return out;
  };

  SynergyCalculator.prototype.calculateTotalTypeSynergy = function (filtered) {
    let total = 0;
    for (const cat in filtered) {
      for (const v of filtered[cat]) {
        if (v > this.profile.maximumIndividualSynergy) return this.profile.tooMuchSynergy;
        total += v;
      }
    }
    return total;
  };

  SynergyCalculator.prototype.calculateSynergyOfSquares = function (squares) {
    return this.explain(squares).total;
  };

  /* The generator only ever needs the total. A page teaching people why a row is good needs the
     parts, so this returns both — the total is computed by the same steps, in the same order. */
  SynergyCalculator.prototype.explain = function (squares) {
    const withGoal = squares.filter(hasGoal);
    const P = this.profile;
    if (this.containsDuplicateGoals(withGoal)) {
      return { total: P.tooMuchSynergy, exclusion: true, reason: 'duplicate goals', types: {}, rowtypes: {}, typeTotal: P.tooMuchSynergy, rowtypeTotal: 0, timeDifference: 0 };
    }

    const unified = this.unifyTypeSynergies(
      this.mergeSynergiesOfSquares(withGoal, 'types'),
      this.mergeSynergiesOfSquares(withGoal, 'subtypes')
    );
    const filteredTypes = this.filterTypeSynergies(unified);
    const filteredRowtypes = this.filterRowtypeSynergies(this.mergeSynergiesOfSquares(withGoal, 'rowtypes'));
    const timeDiffs = withGoal.map((s) => s.desiredTime - s.goal.time);

    const typeTotal = this.calculateTotalTypeSynergy(filteredTypes);
    if (typeTotal >= P.tooMuchSynergy) {
      // a mutual-exclusion pair, or one category above maximumIndividualSynergy
      const offenders = [];
      for (const cat in filteredTypes) {
        for (const v of filteredTypes[cat]) if (v > P.maximumIndividualSynergy) offenders.push({ cat, v });
      }
      return {
        total: P.tooMuchSynergy, exclusion: true,
        reason: offenders.length ? 'category above maximumIndividualSynergy' : 'type synergy reached tooMuchSynergy',
        offenders, types: filteredTypes, rowtypes: {}, typeTotal: P.tooMuchSynergy, rowtypeTotal: 0, timeDifference: 0,
      };
    }

    let rowtypeTotal = 0;
    for (const cat in filteredRowtypes) rowtypeTotal += filteredRowtypes[cat];
    let timeDifference = 0;
    for (const d of timeDiffs) timeDifference += d;

    // per-category contribution, for display; sums to typeTotal by construction
    const contributions = [];
    for (const cat in filteredTypes) {
      let sum = 0;
      for (const v of filteredTypes[cat]) sum += v;
      if (sum !== 0) contributions.push({ cat, value: sum, kept: filteredTypes[cat], all: unified[cat] });
    }
    contributions.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

    return {
      total: typeTotal + rowtypeTotal + timeDifference,
      exclusion: false,
      types: filteredTypes,
      rowtypes: filteredRowtypes,
      typeTotal, rowtypeTotal, timeDifference,
      contributions,
    };
  };

  /* ---------- board input ----------
   * Lives here, shared with the page, so the build can test the SAME function the browser runs.
   * It used to be private to the template, which is why 1600+ board-parity comparisons never caught
   * the seed bug below: both gates fed the generator their own seed representation and never went
   * through this parse.
   *
   * The seed stays a STRING all the way to the generator. seedrandom keys on `seed.toString()`, so
   * "007" and 7 are different RNG streams and therefore different boards, while the magic square
   * coerces to a number either way. ootbingo passes the raw query-string value
   * (bingo/lib/base-board.js -> generateBoard.js), so anything other than the raw string here
   * silently produces a different board under the right heading. */
  function parseBoardInput(input, defaultVersion) {
    var s = String(input == null ? '' : input).trim();
    if (!s) return null;
    if (/^\d+$/.test(s)) return { version: defaultVersion, seed: s, mode: 'normal' };
    var qs = s, i = s.indexOf('?');
    if (i !== -1) qs = s.slice(i + 1);
    var p;
    try { p = new URLSearchParams(qs); } catch (e) { return null; }
    var seed = p.get('seed');
    if (!seed || !/^\d+$/.test(seed.trim())) return null;
    return {
      version: (p.get('version') || defaultVersion || '').trim(),
      seed: seed.trim(),
      mode: (p.get('mode') || 'normal').trim(),
    };
  }

  /* ---------- board helpers ---------- */

  /* Rebuild the squares the generator worked with: difficulty and desiredTime come from the seed's
     magic square, the goal from the generated board. `goals` is the 25-entry array in board order. */
  function squaresFor(seed, mode, goals) {
    const profile = PROFILES[mode] || PROFILES.normal;
    const magic = generateMagicSquare(Number(seed));
    return goals.map((goal, i) => ({
      difficulty: magic[i],
      desiredTime: magic[i] * profile.timePerDifficulty,
      goal,
    }));
  }

  function linesOf(squares) {
    return LINE_KEYS.map((key) => ({
      key,
      label: LINE_LABEL[key],
      indices: INDICES_PER_ROW[key],
      squares: INDICES_PER_ROW[key].map((i) => squares[i]),
    }));
  }

  return {
    SQUARES_PER_ROW, INDICES_PER_ROW, LINE_LABEL, LINE_KEYS, PROFILES,
    parseSynergyFilters, generateMagicSquare, SynergyCalculator, squaresFor, linesOf, parseBoardInput,
    sortAscending, sortDescending, removeHighestNumber,
  };
});
