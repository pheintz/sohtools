// ============================================================================
// Constants
// ============================================================================

// The 0-100 bias controls how a randomized value leans:
//   50 = uniform, > 50 favors the high end, < 50 favors the low end.
// For a 0-1 boolean, the bias is literally the percent chance of rolling 1.
const NEUTRAL_BIAS = 50;

// Songs are randomized as a group: a row either grants one random song or none.
const TOP_ROW_SONGS = [
    "CVars.gRandoSettings.StartingEponasSong",
    "CVars.gRandoSettings.StartingSariasSong",
    "CVars.gRandoSettings.StartingSongOfStorms",
    "CVars.gRandoSettings.StartingSongOfTime",
    "CVars.gRandoSettings.StartingZeldasLullaby",
    "CVars.gRandoSettings.StartingSunsSong",
];

const BOTTOM_ROW_SONGS = [
    "CVars.gRandoSettings.StartingBoleroOfFire",
    "CVars.gRandoSettings.StartingMinuetOfForest",
    "CVars.gRandoSettings.StartingNocturneOfShadow",
    "CVars.gRandoSettings.StartingPreludeOfLight",
    "CVars.gRandoSettings.StartingRequiemOfSpirit",
    "CVars.gRandoSettings.StartingSerenadeOfWater",
];

// Settings whose values are derived from custom logic instead of a plain roll.
const TRIFORCE_TOTAL_KEY = "CVars.gRandoSettings.TriforceHuntTotalPieces";
const TRIFORCE_REQUIRED_KEY = "CVars.gRandoSettings.TriforceHuntRequiredPieces";
const ITEM_POOL_KEY = "CVars.gRandoSettings.ItemPool";
const STARTING_HEARTS_KEY = "CVars.gRandoSettings.StartingHearts";

// Scrub prices are a [min, max] pair rolled independently, so the output must be
// ordered to avoid min > max.
const SCRUBS_PRICE_RANGE_MIN_KEY = "CVars.gRandoSettings.ScrubsPriceRange1";
const SCRUBS_PRICE_RANGE_MAX_KEY = "CVars.gRandoSettings.ScrubsPriceRange2";

// UI-only toggles for special randomization behavior. These live in memory and
// are never written to the output config; they only gate the special logic in
// rollSpecialValues().
const customBehavior = {
    randomizeSongs: true,
};

const MAX_TRIFORCE_PIECES = 99;
const ITEM_POOL_OPTION_COUNT = 4; // values 0..3
const ITEM_POOL_SCARCE = 2;
const ITEM_POOL_MINIMAL = 3;
const MIN_STARTING_HEARTS = 3;
const MAX_STARTING_HEARTS = 20;

// Presets / persistence.
const STORAGE_KEY = 'sohtools.settingsrando';
const PRESET_VERSION = 1;

// Which base config is currently loaded, and a copy of it. Owned here so that
// generation, capture and preset loading all share one source of truth.
let usingExtraModes = false;
let currentConfig = window.getConfig();

// ============================================================================
// Rendering: turn the config object into HTML controls
// ============================================================================

// Walks the config recursively. Leaf settings (range strings like "0-5") become
// editable rows; nested objects become collapsible <details> groups.
function renderInputs(settings, parentKey = '') {
    let fieldsMarkup = '';
    let groupsMarkup = '';

    for (const key in settings) {
        const fullKey = parentKey ? `${parentKey}.${key}` : key;
        const value = settings[key];

        const isNestedObject = typeof value === 'object' && value !== null && !Array.isArray(value);
        if (isNestedObject) {
            const childMarkup = renderInputs(value, fullKey);
            if (!childMarkup) continue; // nothing editable inside (e.g. all-number objects)

            // "CVars" is just a namespace wrapper, so render its children directly.
            groupsMarkup += key === 'CVars'
                ? childMarkup
                : `
        <details class="settings-group" open>
            <summary>${putSpacesInCamelCase(key)}</summary>
            ${childMarkup}
        </details>`;
            continue;
        }

        const isRandomizableSetting = typeof value === 'string';
        if (isRandomizableSetting) {
            fieldsMarkup += renderRow(key, value, fullKey);
        }
    }

    let html = '';
    if (fieldsMarkup) html += `<div class="settings-grid">${fieldsMarkup}</div>`;
    html += groupsMarkup;
    return html;
}

// Renders one setting. The control shown depends on the range:
//   "0-1"   -> boolean (Randomized / Enabled / % chance)
//   "a-b"   -> numeric range (min / max / bias slider)
//   other   -> free-text input (CSV lists, single values, etc.)
function renderRow(key, rangeText, fullKey) {
    const { min, max } = parseRange(rangeText);
    const label = putSpacesInCamelCase(key);

    const isBoolean = min === '0' && max === '1';
    const isNumericRange = !isBoolean && isIntegerString(min) && isIntegerString(max);

    let control;
    if (isBoolean) {
        control = renderBooleanControl(fullKey);
    } else if (isNumericRange) {
        control = renderNumericRangeControl(fullKey, min, max);
    } else {
        control = renderTextControl(fullKey, min);
    }

    return `
        <div class="setting-row">
            ${renderDataNode(fullKey, min, max)}
            <label for="${fullKey}">${label}:</label>
            ${control}
        </div>`;
}

// Hidden input that holds the single source of truth for a setting: the rollable
// range (data-min / data-max) and the weighting (data-bias).
function renderDataNode(fullKey, min, max) {
    return `<input type="hidden"
               id="${fullKey}"
               name="${fullKey}"
               class="randomize-data"
               data-min="${min}"
               data-max="${max}"
               data-bias="${NEUTRAL_BIAS}"
               style="display:none">`;
}

function renderBooleanControl(fullKey) {
    const randomizedId = `${fullKey}-randomized`;
    const enabledId = `${fullKey}-enabled`;

    // Booleans default to Randomized: the Enabled checkbox is disabled and the
    // % chance input is active. Toggling Randomized off swaps which one applies.
    return `
          <div class="bool-row">
            <div class="check-container">
                <input type="checkbox" id="${randomizedId}"
                       class="rand-toggle" data-target="${fullKey}" checked
                       onchange="onRandomizedToggle('${fullKey}', this)">
                <label for="${randomizedId}">Randomized</label>
            </div>
            <div class="check-container">
                <input type="checkbox" id="${enabledId}"
                       class="enabled-toggle" data-target="${fullKey}" disabled
                       onchange="onEnabledToggle('${fullKey}', this)">
                <label for="${enabledId}">Enabled</label>
            </div>
            ${renderWeightControl(fullKey, { topLabel: '% chance on:', controlClass: 'chance-control' })}
          </div>`;
}

function renderNumericRangeControl(fullKey, min, max) {
    return `
          <div class="range-row">
            <div class="range-field">
                <label>min:</label>
                <input type="number" step="1" min="${min}" max="${max}" value="${min}"
                       class="range-min" data-target="${fullKey}"
                       onchange="updateMin('${fullKey}', this.value)">
            </div>
            <div class="range-field">
                <label>max:</label>
                <input type="number" step="1" min="${min}" max="${max}" value="${max}"
                       class="range-max" data-target="${fullKey}"
                       onchange="updateMax('${fullKey}', this.value)">
            </div>
            ${renderWeightControl(fullKey, { topLabel: 'weight:', lowLabel: 'low', highLabel: 'high' })}
          </div>`;
}

function renderTextControl(fullKey, value) {
    return `
          <div class="string-row">
            <label>Enter value:</label>
            <input type="text" class="string-input" id="${fullKey}-string"
                   data-target="${fullKey}" value="${value}" style="max-width: 200px;"
                   onchange="updateStringValue('${fullKey}', this.value)">
          </div>`;
}

// A 0-100 weight control: an editable number box plus a slider on its own row,
// kept in sync with each other and the setting's data-bias. `controlClass` lets
// callers tag both inputs (e.g. so the boolean control can disable them together).
function renderWeightControl(fullKey, { topLabel = '', lowLabel = '', highLabel = '', controlClass = '' } = {}) {
    const tag = controlClass ? ' ' + controlClass : '';
    return `
            <div class="weight-top">
                ${topLabel ? `<label>${topLabel}</label>` : ''}
                <input type="number" min="0" max="100" step="1" value="${NEUTRAL_BIAS}"
                       class="weight-input${tag}" data-target="${fullKey}"
                       oninput="updateBias('${fullKey}', this.value)">
            </div>
            <div class="weight-slider-row">
                ${lowLabel ? `<span class="bias-end">${lowLabel}</span>` : ''}
                <input type="range" min="0" max="100" step="1" value="${NEUTRAL_BIAS}"
                       class="weight-slider${tag}" data-target="${fullKey}"
                       oninput="updateBias('${fullKey}', this.value)">
                ${highLabel ? `<span class="bias-end">${highLabel}</span>` : ''}
            </div>`;
}

// A UI-only group appended below the config-driven groups. Its toggles update
// `customBehavior` and gate the special logic in rollSpecialValues(); none of
// them are written to the output config.
function renderCustomBehavior() {
    return `
        <details class="settings-group" open>
            <summary>Custom Behavior</summary>
            <div class="settings-grid">
                ${renderCustomToggle(
                    'randomizeSongs',
                    'Randomize Starting Songs',
                    'Grant one random song per ocarina row (overrides the individual starting-song toggles)'
                )}
            </div>
        </details>`;
}

function renderCustomToggle(behaviorKey, label, description) {
    const checked = customBehavior[behaviorKey] ? 'checked' : '';
    return `
                <div class="setting-row">
                    <label>${label}:</label>
                    <div class="check-container">
                        <input type="checkbox" ${checked}
                               onchange="setCustomBehavior('${behaviorKey}', this.checked)">
                        <label>${description}</label>
                    </div>
                </div>`;
}

// ============================================================================
// Search filter
// ============================================================================

// Hides rows that don't match the query and collapses groups with no matches.
// While filtering, every group with a match is auto-expanded.
function filterSettings(query) {
    const normalizedQuery = (query || '').trim().toLowerCase();
    const container = document.getElementById('RandomContainer');
    if (!container) return;

    const rows = container.querySelectorAll('.setting-row');
    const groups = container.querySelectorAll('details.settings-group');

    if (!normalizedQuery) {
        rows.forEach(row => row.classList.remove('filter-hidden'));
        groups.forEach(group => {
            group.classList.remove('filter-hidden');
            group.open = true;
        });
        return;
    }

    rows.forEach(row => {
        const label = row.querySelector('label');
        const labelText = label ? label.textContent.toLowerCase() : '';
        row.classList.toggle('filter-hidden', !labelText.includes(normalizedQuery));
    });

    groups.forEach(group => {
        const hasVisibleRow = !!group.querySelector('.setting-row:not(.filter-hidden)');
        group.classList.toggle('filter-hidden', !hasVisibleRow);
        if (hasVisibleRow) group.open = true;
    });
}

// ============================================================================
// Control event handlers (referenced from the generated markup)
// ============================================================================

function updateMin(fullKey, value) {
    getDataNode(fullKey).setAttribute('data-min', value);
}

function updateMax(fullKey, value) {
    getDataNode(fullKey).setAttribute('data-max', value);
}

function updateBias(fullKey, value) {
    const bias = clampBias(value);
    getDataNode(fullKey).setAttribute('data-bias', bias);
    syncWeightControls(fullKey, bias);
}

function clampBias(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return NEUTRAL_BIAS;
    return Math.max(0, Math.min(100, number));
}

// Keeps a setting's weight textbox and slider showing the same value. The input
// the user is actively editing is left alone so typing/dragging isn't disrupted.
function syncWeightControls(fullKey, value) {
    findControls('.weight-input', fullKey).forEach(el => setValueUnlessActive(el, value));
    findControls('.weight-slider', fullKey).forEach(el => setValueUnlessActive(el, value));
}

function setValueUnlessActive(element, value) {
    if (element !== document.activeElement && element.value !== String(value)) {
        element.value = value;
    }
}

function updateStringValue(fullKey, value) {
    setFixedValue(getDataNode(fullKey), value);
}

function setCustomBehavior(behaviorKey, enabled) {
    customBehavior[behaviorKey] = enabled;
    if (behaviorKey === 'randomizeSongs') applySongOverrideState();
}

// While "Randomize Starting Songs" is on, the 12 individual song controls are
// overridden at generation, so disable them to make that obvious. When off, the
// controls are restored to their normal interactive state.
function applySongOverrideState() {
    const overridden = customBehavior.randomizeSongs;
    for (const songKey of [...TOP_ROW_SONGS, ...BOTTOM_ROW_SONGS]) {
        if (overridden) {
            findControls('.rand-toggle', songKey).forEach(el => { el.disabled = true; });
            findControls('.enabled-toggle', songKey).forEach(el => { el.disabled = true; });
            findControls('.chance-control', songKey).forEach(el => { el.disabled = true; });
        } else {
            findControls('.rand-toggle', songKey).forEach(el => { el.disabled = false; });
            syncControlsToData(songKey); // restores the correct enabled/chance disabled states
        }
        const row = getDataNode(songKey) ? getDataNode(songKey).closest('.setting-row') : null;
        if (row) row.classList.toggle('overridden', overridden);
    }
}

function onRandomizedToggle(fullKey, randomizedCheckbox) {
    const dataNode = getDataNode(fullKey);
    const enabledCheckbox = findControl('.enabled-toggle', fullKey);
    const randomized = randomizedCheckbox.checked;

    if (randomized) {
        // Randomized: value rolls between 0 and 1, weighted by the % chance control.
        dataNode.setAttribute('data-min', '0');
        dataNode.setAttribute('data-max', '1');
    } else {
        // Not randomized: pin the value to whatever the Enabled checkbox says.
        if (enabledCheckbox) setFixedValue(dataNode, enabledCheckbox.checked ? '1' : '0');
    }

    if (enabledCheckbox) enabledCheckbox.disabled = randomized;
    setChanceControlsDisabled(fullKey, !randomized);
}

// The % chance textbox + slider are only relevant while a boolean is randomized.
function setChanceControlsDisabled(fullKey, disabled) {
    findControls('.chance-control', fullKey).forEach(control => { control.disabled = disabled; });
}

function onEnabledToggle(fullKey, enabledCheckbox) {
    const randomizedCheckbox = findControl('.rand-toggle', fullKey);
    const isRandomized = randomizedCheckbox && randomizedCheckbox.checked;
    if (isRandomized) return; // the Enabled checkbox is ignored while randomizing

    setFixedValue(getDataNode(fullKey), enabledCheckbox.checked ? '1' : '0');
}

// ============================================================================
// Generating the downloadable config
// ============================================================================

function generateConfigForDownload() {
    const output = structuredClone(currentConfig);
    const specialValues = rollSpecialValues(); // computed up front; no DOM mutation

    document.querySelectorAll('input.randomize-data[data-min][data-max][name]').forEach(dataNode => {
        const path = dataNode.getAttribute('name');
        const value = path in specialValues ? specialValues[path] : rollSettingValue(dataNode);
        setNestedValue(output, path, value);
    });

    orderScrubPriceRange(output);
    downloadJsonAsFile(output, 'settingsrando.json');
}

// Scrub prices use a [min, max] pair; rolled independently they can come out
// reversed, so make sure the lower value is the min.
function orderScrubPriceRange(output) {
    const min = getNestedValue(output, SCRUBS_PRICE_RANGE_MIN_KEY);
    const max = getNestedValue(output, SCRUBS_PRICE_RANGE_MAX_KEY);
    if (typeof min === 'number' && typeof max === 'number' && min > max) {
        setNestedValue(output, SCRUBS_PRICE_RANGE_MIN_KEY, max);
        setNestedValue(output, SCRUBS_PRICE_RANGE_MAX_KEY, min);
    }
}

// Rolls the final value for one setting from its data-min/data-max/data-bias.
// Non-numeric settings (text / CSV lists) are passed through unchanged.
function rollSettingValue(dataNode) {
    const min = dataNode.getAttribute('data-min');
    const max = dataNode.getAttribute('data-max');
    if (!isIntegerString(min) || !isIntegerString(max)) return min;

    const low = Math.min(parseInt(min, 10), parseInt(max, 10));
    const high = Math.max(parseInt(min, 10), parseInt(max, 10));
    return weightedRandomInt(low, high, readBias(dataNode));
}

function readBias(dataNode) {
    const bias = parseFloat(dataNode.getAttribute('data-bias'));
    return Number.isFinite(bias) ? bias : NEUTRAL_BIAS;
}

// Writes `value` into a nested object following a dotted path, creating any
// missing objects along the way (e.g. "CVars.gRandoSettings.DoorOfTime").
function setNestedValue(target, dottedPath, value) {
    const keys = dottedPath.split('.');
    const lastKey = keys.pop();

    let node = target;
    for (const key of keys) {
        if (!(key in node)) node[key] = {};
        node = node[key];
    }
    node[lastKey] = value;
}

function getNestedValue(target, dottedPath) {
    return dottedPath.split('.').reduce((node, key) => (node == null ? node : node[key]), target);
}

function downloadJsonAsFile(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}

// ============================================================================
// Special-case randomization
// ============================================================================

// Computes values for the settings that don't use a plain weighted roll, keyed
// by config path. Returned to the generator instead of mutating the page, so a
// roll never disturbs the user's saved ranges.
function rollSpecialValues() {
    const values = {};

    // Triforce: pick a total, and require no more than that total.
    const totalPieces = randomInt(0, MAX_TRIFORCE_PIECES);
    values[TRIFORCE_TOTAL_KEY] = totalPieces;
    values[TRIFORCE_REQUIRED_KEY] = randomInt(0, totalPieces);

    if (customBehavior.randomizeSongs) {
        Object.assign(values, rollSongRow(TOP_ROW_SONGS));
        Object.assign(values, rollSongRow(BOTTOM_ROW_SONGS));
    }

    // Item pool drives the starting-hearts roll.
    const itemPool = randomInt(0, ITEM_POOL_OPTION_COUNT - 1);
    values[ITEM_POOL_KEY] = itemPool;
    values[STARTING_HEARTS_KEY] = rollStartingHearts(itemPool);

    return values;
}

function rollSongRow(songKeys) {
    const grantedIndex = randomInt(0, songKeys.length - 1);

    const values = {};
    songKeys.forEach((songKey, index) => {
        values[songKey] = index === grantedIndex ? 1 : 0;
    });
    return values;
}

// Seeds start with the default 3 hearts unless a bonus roll is granted. A first
// coin flip decides whether to roll for bonus hearts at all. Scarce/minimal item
// pools always qualify; richer pools must also win a second coin flip.
function rollStartingHearts(itemPool) {
    if (!coinFlip()) return MIN_STARTING_HEARTS;

    const scarcePool = itemPool === ITEM_POOL_SCARCE || itemPool === ITEM_POOL_MINIMAL;
    if (scarcePool) return randomInt(MIN_STARTING_HEARTS, MAX_STARTING_HEARTS);

    return coinFlip()
        ? MIN_STARTING_HEARTS
        : randomInt(MIN_STARTING_HEARTS, MAX_STARTING_HEARTS);
}

// ============================================================================
// Weighted random selection
// ============================================================================

// Weight for a single value given the 0-100 bias. A linear tilt across the range:
// neutral bias gives every value weight 1; leaning high/low ramps the weights up
// toward that end and down toward the other.
function weightForValue(value, low, high, bias) {
    if (high === low) return 1;
    const lean = (bias - NEUTRAL_BIAS) / NEUTRAL_BIAS; // 0..100 -> -1..1
    const position = (value - low) / (high - low);     // 0 at low .. 1 at high
    return 1 + lean * (2 * position - 1);
}

// Picks an integer in [low, high], biased by the 0-100 bias value.
function weightedRandomInt(low, high, bias) {
    if (high <= low) return low;

    const weights = [];
    let totalWeight = 0;
    for (let value = low; value <= high; value++) {
        const weight = Math.max(0, weightForValue(value, low, high, bias));
        weights.push(weight);
        totalWeight += weight;
    }
    if (totalWeight <= 0) return randomInt(low, high); // degenerate: fall back to uniform

    let target = Math.random() * totalWeight;
    for (let i = 0; i < weights.length; i++) {
        target -= weights[i];
        if (target < 0) return low + i;
    }
    return high;
}

// ============================================================================
// Small shared helpers
// ============================================================================

function getDataNode(fullKey) {
    return document.getElementById(fullKey);
}

function findControl(selector, fullKey) {
    return document.querySelector(`${selector}[data-target="${fullKey}"]`);
}

function findControls(selector, fullKey) {
    return document.querySelectorAll(`${selector}[data-target="${fullKey}"]`);
}

// Pins a setting to a single fixed value (data-min === data-max).
function setFixedValue(element, value) {
    element.setAttribute('data-min', value);
    element.setAttribute('data-max', value);
}

function parseRange(rangeText) {
    const parts = rangeText.split('-');
    return {
        min: parts[0] ?? '',
        max: parts.length > 1 ? parts[1] : '',
    };
}

function isIntegerString(text) {
    return /^-?\d+$/.test(String(text));
}

function randomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}

function coinFlip() {
    return Math.random() < 0.5;
}

function putSpacesInCamelCase(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1 $2');
}

function escapeHtml(text) {
    return String(text).replace(/[&<>"]/g, ch =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
}

function bindClick(id, handler) {
    const element = document.getElementById(id);
    if (element) element.onclick = handler;
}

// ============================================================================
// App orchestration
// ============================================================================

// Called once after the DOM is ready. Restores the previous session if there is
// one, wires up the controls, and fills the preset dropdown.
function initSettingsRandomizer() {
    const store = loadStore();
    if (store.autosave) {
        applyPreset(store.autosave);
    } else {
        loadBaseConfig(false);
        renderApp();
    }
    refreshPresetDropdown(store.lastLoaded);
    wireEvents();
}

function loadBaseConfig(useExtraModes) {
    usingExtraModes = !!useExtraModes;
    currentConfig = usingExtraModes ? window.getExtraModes() : window.getConfig();
}

// Rebuilds the settings UI from the current base config plus the custom-behavior group.
function renderApp() {
    const container = document.getElementById('RandomContainer');
    if (!container) return;
    container.innerHTML = renderInputs(currentConfig) + renderCustomBehavior();

    const search = document.getElementById('settingsSearch');
    filterSettings(search ? search.value : '');
    applySongOverrideState();
}

function onExtraModesToggle(useExtraModes) {
    loadBaseConfig(useExtraModes);
    renderApp();
    scheduleAutosave();
}

function wireEvents() {
    bindClick('generate', () => generateConfigForDownload());

    const extraModesCheckbox = document.getElementById('ExtraModes');
    if (extraModesCheckbox) {
        extraModesCheckbox.onclick = () => onExtraModesToggle(extraModesCheckbox.checked);
    }

    const search = document.getElementById('settingsSearch');
    if (search) search.oninput = () => filterSettings(search.value);

    // Any control change inside the settings area refreshes the autosave snapshot.
    const container = document.getElementById('RandomContainer');
    if (container) {
        container.addEventListener('input', scheduleAutosave);
        container.addEventListener('change', scheduleAutosave);
    }

    wirePresetControls();
}

function wirePresetControls() {
    const select = document.getElementById('presetSelect');
    const nameInput = document.getElementById('presetName');
    const presetString = document.getElementById('presetString');

    const saveCurrent = () => {
        const name = nameInput && nameInput.value.trim();
        if (name) {
            saveNamedPreset(name);
        } else if (nameInput) {
            nameInput.focus();
        }
    };

    bindClick('presetSave', saveCurrent);
    bindClick('presetLoad', () => loadNamedPreset(select && select.value));
    bindClick('presetDelete', () => deleteNamedPreset(select && select.value));
    bindClick('presetReset', resetToDefaults);

    // Pressing Enter in the name field saves, like clicking Save.
    if (nameInput) {
        nameInput.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                event.preventDefault();
                saveCurrent();
            }
        });
    }

    // Selecting a preset prefills the name field so Save updates that preset.
    if (select && nameInput) {
        select.addEventListener('change', () => {
            if (select.value) nameInput.value = select.value;
        });
    }

    bindClick('presetExport', () => {
        if (presetString) presetString.value = exportCurrentPreset();
    });
    bindClick('presetImport', () => {
        if (!presetString) return;
        try {
            importPresetString(presetString.value);
        } catch (error) {
            alert(error.message);
        }
    });
}

// ============================================================================
// Presets: capture & apply
// ============================================================================

// A snapshot of everything a preset needs: which base config, the custom-behavior
// toggles, and only the settings the user changed from their defaults.
function captureCurrentPreset() {
    return {
        version: PRESET_VERSION,
        extraModes: usingExtraModes,
        customBehavior: { randomizeSongs: customBehavior.randomizeSongs },
        overrides: collectOverrides(),
    };
}

// Returns { path: { min, max, bias } } for every setting that differs from the
// default range / neutral bias of the current base config.
function collectOverrides() {
    const defaults = flattenDefaults(currentConfig);
    const overrides = {};

    document.querySelectorAll('input.randomize-data[name]').forEach(node => {
        const key = node.getAttribute('name');
        const min = node.getAttribute('data-min');
        const max = node.getAttribute('data-max');
        const bias = Number(node.getAttribute('data-bias'));
        const def = defaults[key];

        const unchanged = def && min === def.min && max === def.max && bias === NEUTRAL_BIAS;
        if (!unchanged) overrides[key] = { min, max, bias };
    });

    return overrides;
}

// Flattens a config to { path: { min, max } } from each setting's default range.
function flattenDefaults(config) {
    const defaults = {};
    (function walk(obj, parentKey) {
        for (const key in obj) {
            const fullKey = parentKey ? `${parentKey}.${key}` : key;
            const value = obj[key];
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                walk(value, fullKey);
            } else if (typeof value === 'string') {
                defaults[fullKey] = parseRange(value);
            }
        }
    })(config, '');
    return defaults;
}

// Loads a preset into the UI: switches base config, restores custom behavior,
// re-renders defaults, then applies the saved per-setting overrides.
function applyPreset(preset) {
    if (!preset) return;

    loadBaseConfig(preset.extraModes);
    const extraModesCheckbox = document.getElementById('ExtraModes');
    if (extraModesCheckbox) extraModesCheckbox.checked = usingExtraModes;

    customBehavior.randomizeSongs = preset.customBehavior
        ? !!preset.customBehavior.randomizeSongs
        : true;

    renderApp();

    const overrides = preset.overrides || {};
    for (const key in overrides) applySettingOverride(key, overrides[key]);

    applySongOverrideState(); // re-assert after overrides may have re-enabled song rows
}

// Writes one override into its data node and syncs the visible controls to match.
function applySettingOverride(key, override) {
    const node = getDataNode(key);
    if (!node) return; // setting no longer exists in this config version

    node.setAttribute('data-min', override.min);
    node.setAttribute('data-max', override.max);
    node.setAttribute('data-bias', override.bias);
    syncControlsToData(key);
}

// Updates the on-screen controls for a setting to reflect its data node values.
function syncControlsToData(key) {
    const node = getDataNode(key);
    if (!node) return;

    const min = node.getAttribute('data-min');
    const max = node.getAttribute('data-max');
    const bias = node.getAttribute('data-bias');

    const randomizedCheckbox = findControl('.rand-toggle', key);
    if (randomizedCheckbox) {
        const enabledCheckbox = findControl('.enabled-toggle', key);
        const randomized = min === '0' && max === '1';

        randomizedCheckbox.checked = randomized;
        if (enabledCheckbox) {
            enabledCheckbox.disabled = randomized;
            enabledCheckbox.checked = !randomized && min === '1';
        }
        setChanceControlsDisabled(key, !randomized);
        syncWeightControls(key, bias);
        return;
    }

    const minInput = findControl('.range-min', key);
    if (minInput) {
        const maxInput = findControl('.range-max', key);
        minInput.value = min;
        if (maxInput) maxInput.value = max;
        syncWeightControls(key, bias);
        return;
    }

    const stringInput = findControl('.string-input', key);
    if (stringInput) stringInput.value = min;
}

// ============================================================================
// Persistence (localStorage) and named presets
// ============================================================================

function loadStore() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
        return {};
    }
}

function saveStore(store) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch {
        // storage unavailable or full: nothing else we can do
    }
}

let autosaveTimer = null;
// Debounced: records the current working state so it is restored on the next visit.
function scheduleAutosave() {
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(() => {
        const store = loadStore();
        store.autosave = captureCurrentPreset();
        saveStore(store);
    }, 300);
}

function saveNamedPreset(name) {
    if (!name) return;
    const store = loadStore();
    store.presets = store.presets || {};
    store.presets[name] = captureCurrentPreset();
    store.lastLoaded = name;
    saveStore(store);
    refreshPresetDropdown(name);
}

function loadNamedPreset(name) {
    if (!name) return;
    const store = loadStore();
    const preset = store.presets && store.presets[name];
    if (!preset) return;

    applyPreset(preset);
    store.lastLoaded = name;
    saveStore(store);
    scheduleAutosave();
}

function deleteNamedPreset(name) {
    if (!name) return;
    const store = loadStore();
    if (store.presets) delete store.presets[name];
    if (store.lastLoaded === name) delete store.lastLoaded;
    saveStore(store);
    refreshPresetDropdown();
}

// Restores everything to the default (regular) config.
function resetToDefaults() {
    applyPreset({
        version: PRESET_VERSION,
        extraModes: false,
        customBehavior: { randomizeSongs: true },
        overrides: {},
    });
    scheduleAutosave();
}

// Repopulates the preset <select> from storage.
function refreshPresetDropdown(selectedName) {
    const select = document.getElementById('presetSelect');
    if (!select) return;

    const store = loadStore();
    const names = Object.keys(store.presets || {}).sort();
    const options = ['<option value="">— select preset —</option>'];
    for (const name of names) {
        const selected = name === selectedName ? ' selected' : '';
        options.push(`<option value="${escapeHtml(name)}"${selected}>${escapeHtml(name)}</option>`);
    }
    select.innerHTML = options.join('');
}

// ============================================================================
// Export / import strings (diff-only preset as Base64-encoded JSON)
// ============================================================================

function exportCurrentPreset() {
    return encodePreset(captureCurrentPreset());
}

function encodePreset(preset) {
    return btoa(JSON.stringify(preset));
}

function decodePreset(text) {
    let preset;
    try {
        preset = JSON.parse(atob(String(text).trim()));
    } catch {
        throw new Error('That preset string could not be read.');
    }
    if (!preset || preset.version !== PRESET_VERSION) {
        throw new Error('That preset string is not a supported version.');
    }
    return preset;
}

function importPresetString(text) {
    const preset = decodePreset(text); // throws on bad input
    applyPreset(preset);
    scheduleAutosave();
}
