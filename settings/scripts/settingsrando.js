const topRowSongs = [
    "CVars.gRandoSettings.StartingEponasSong",
    "CVars.gRandoSettings.StartingSariasSong",
    "CVars.gRandoSettings.StartingSongOfStorms",
    "CVars.gRandoSettings.StartingSongOfTime",
    "CVars.gRandoSettings.StartingZeldasLullaby",
    "CVars.gRandoSettings.StartingSunsSong",
];

const bottomRowSongs = [
    "CVars.gRandoSettings.StartingBoleroOfFire",
    "CVars.gRandoSettings.StartingMinuetOfForest",
    "CVars.gRandoSettings.StartingNocturneOfShadow",
    "CVars.gRandoSettings.StartingPreludeOfLight",
    "CVars.gRandoSettings.StartingRequiemOfSpirit",
    "CVars.gRandoSettings.StartingSerenadeOfWater"
]
function renderInputs(obj, parentKey = '') {
    let html = '';
    for (const key in obj) {
        const fullKey = parentKey ? `${parentKey}.${key}` : key;
        const value = obj[key];

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            if (key !== 'InjectItemCounts' && key !== 'CVars' && key !== 'gEnhancements' && key !== 'ExtraTraps') {
                html += `<strong>${key}</strong>`;
            }
            html += renderInputs(value, fullKey);
            continue;
        }

        if (typeof value === 'string') {
            const parts = value.split('-');
            const min = parts[0] ?? '';
            const max = parts.length > 1 ? parts[1] : '';
            const name = putSpacesInCamelCase(key);

            const isNum = s => /^-?\d+$/.test(String(s));
            const isBooleanRange = min === '0' && max === '1';
            const isNumericRange = isNum(min) && isNum(max) && !isBooleanRange;

            html += `<div class="setting-row" style="margin-left:20px;">`;

            // hidden data node (the single source of truth)
            html += `
        <input style="display:none"
               id="${fullKey}"
               name="${fullKey}"
               data-min="${min}"
               data-max="${max}"
               type="hidden"
               class="randomize-data">`;

            // label
            html += `<label for="${fullKey}">${name}:</label>`;

            if (isBooleanRange) {
                // Boolean: Randomized + Enabled pair
                const randomizedId = `${fullKey}-rand`;
                const enabledId = `${fullKey}-enabled`;
                const isRandom = (min === '0' && max === '1');
                const isPinned1 = (min === max && min === '1');

                html += `
          <div class="bool-row">
            <div class="check-container">
                <input type="checkbox"
                       id="${randomizedId}"
                       class="rand-toggle"
                       data-target="${fullKey}"
                       ${isRandom ? 'checked' : ''}
                       onchange="onRandomToggle('${fullKey}', this)">
                <label for="${randomizedId}">Randomized</label>
            </div>
            <div class="check-container">
                <input type="checkbox"
                       id="${enabledId}"
                       class="enabled-toggle"
                       data-target="${fullKey}"
                       ${isPinned1 ? 'checked' : ''}
                       ${isRandom ? 'disabled' : ''}
                       onchange="onEnabledToggle('${fullKey}', this)">
                <label for="${enabledId}">Enabled</label>

            </div>
          </div>`;
            } else if (isNumericRange) {
                // Non-bool numeric: show min/max inputs again ✅
                html += `
          <div class="range-row">
            <label>min:</label>
            <input type="number"
                   step="1"
                   min="${min}"
                   max="${max}"
                   value="${min}"
                   onchange="UpdateMin('${fullKey}', this.value)">

            <label>max:</label>
            <input type="number"
                   step="1"
                   min="${min}"
                   max="${max}"
                   value="${max}"
                   onchange="UpdateMax('${fullKey}', this.value)">
          </div>`;
            } else {
                html += `
                      <div class="string-row">
                        <label>Enter value:</label>
                        <input type="text" style="max-width: 200px;"
                               class="string-input"
                               id="${fullKey}-string"
                               data-target="${fullKey}"
                               value="${min}"
                               onchange="UpdateString('${fullKey}', this.value)">
                      </div>`;
            }

            html += `</div>`;
        }
    }
    return html;
}

function UpdateString(fullKey, value) {
    const hidden = document.getElementById(fullKey);
    hidden.setAttribute('data-min', value);
    hidden.setAttribute('data-max', value);
}

function SwitchOnOff(fullKey) {
    const hidden = document.getElementById(fullKey); const isChecked = checkbox.checked;
    const max = checkbox.getAttribute('data-max');

    if (max == 0) {
        hidden.setAttribute('data-max', '1');
    }
    else {
        hidden.setAttribute('data-max', '0');
    }
}

function onRandomToggle(fullKey, el) {
    const hidden = document.getElementById(fullKey);
    const enabledEl = document.querySelector(`.enabled-toggle[data-target="${fullKey}"]`);

    if (el.checked) {
        // Randomization: allow 0..1
        hidden.setAttribute('data-min', '0');
        hidden.setAttribute('data-max', '1');
        if (enabledEl) enabledEl.disabled = true;
    } else {
        // Deterministic: pin to enabled checkbox
        if (enabledEl) {
            enabledEl.disabled = false;
            const v = enabledEl.checked ? '1' : '0';
            hidden.setAttribute('data-min', v);
            hidden.setAttribute('data-max', v);
        }
    }
}

function onEnabledToggle(fullKey, el) {
    const hidden = document.getElementById(fullKey);
    const randEl = document.querySelector(`.rand-toggle[data-target="${fullKey}"]`);

    // Only apply when not randomized
    if (!randEl || !randEl.checked) {
        const v = el.checked ? '1' : '0';
        hidden.setAttribute('data-min', v);
        hidden.setAttribute('data-max', v);
    }
}


function RollExtraLogic() {
    RandomizeTriforcePieces();
    RandomizeSongs();
    RollItemPoolForStartingHearts();
}

function generateConfigForDownload(objectToReplace) {
    RollExtraLogic();
    const outputJSON = structuredClone(objectToReplace);

    const knobs = document.querySelectorAll('input.randomize-data[data-min][data-max][name]');
    knobs.forEach(checkbox => {
        const path = checkbox.getAttribute('name');
        const min = checkbox.getAttribute('data-min');
        const max = checkbox.getAttribute('data-max');

        const isNum = s => /^-?\d+$/.test(String(s));
        let value;

        if (isNum(min) && isNum(max)) {
            value = Math.floor(Math.random() * (parseInt(max) - parseInt(min) + 1)) + parseInt(min);
        } else {
            value = min;
        }

        const keys = path.split('.');
        let current = outputJSON;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!(keys[i] in current)) current[keys[i]] = {};
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
    });

    downloadJsonAsFile(outputJSON, 'settingsrando.json');
}

function downloadJsonAsFile(jsonData, filename) {
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function putSpacesInCamelCase(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1 $2');
};

function RandomizeSongs() {
    // Randomize top row songs
    var shuffleTopSongs = coinToss();
    const topLength = topRowSongs.length;
    const topRandomIndex = Math.floor(Math.random() * topLength);
    topRowSongs.forEach((song, index) => {
        const element = document.querySelector(`[id="${song}"]`);
        if (element) {
            let minmax;
            if (shuffleTopSongs) {
                minmax = (index === topRandomIndex) ? "1" : "0";
            } else {
                minmax = "0";
            }
            element.setAttribute('data-min', minmax);
            element.setAttribute('data-max', minmax);
        }
    });

    // Randomize bottom row songs
    var shuffleBottomSongs = coinToss();
    const bottomLength = bottomRowSongs.length;
    const bottomRandomIndex = Math.floor(Math.random() * bottomLength);
    bottomRowSongs.forEach((song, index) => {
        const element = document.querySelector(`[id="${song}"]`);
        if (element) {
            let minmax;
            if (shuffleBottomSongs) {
                minmax = (index === bottomRandomIndex) ? "1" : "0";
            } else {
                minmax = "0";
            }
            element.setAttribute('data-min', minmax);
            element.setAttribute('data-max', minmax);
        }
    });
}

function RandomizeTriforcePieces() {
    const max = Math.floor(Math.random() * 100);
    const min = Math.floor(Math.random() * (max + 1)); // 0..max inclusive
    const maxEl = document.getElementById("CVars.gRandoSettings.TriforceHuntTotalPieces");
    const minEl = document.getElementById("CVars.gRandoSettings.TriforceHuntRequiredPieces");
    maxEl.setAttribute('data-min', max); maxEl.setAttribute('data-max', max);
    minEl.setAttribute('data-min', min); minEl.setAttribute('data-max', min);
}

function coinToss() {
    return Math.floor(Math.random() * 2) == 0;
}

// had hearts it set to a yes/no on whether to roll for extra hearts, then
// if yes, a number rolled 0 - 100, if item pool was scarce or minimal and that number was under 50 - start with 3 hearts,
// if 50 - 100, randbetween 3 & 20, if item pool was not scarce or minimal, that limit was 75 instead(so under 75, start with 3, over 75, start with randbetween 1 & 20).

// had hearts it set to a yes/no on whether to roll for extra hearts, then
// if yes, a number rolled 0 - 100, if item pool was scarce or minimal and that number was under 50 - start with 3 hearts,
// if 50 - 100, randbetween 3 & 20, if item pool was not scarce or minimal, that limit was 75 instead(so under 75, start with 3, over 75, start with randbetween 1 & 20).

function RollItemPoolForStartingHearts() {
    const itemPoolType = document.querySelector(`[id="CVars.gRandoSettings.ItemPool"]`);
    let rolledValue = Math.floor(Math.random() * 4);
    itemPoolType.setAttribute('data-min', rolledValue);
    itemPoolType.setAttribute('data-max', rolledValue);
    const numStartingHearts = RandomizeStartingHearts(rolledValue);
    const startingHearts = document.querySelector(`[id="CVars.gRandoSettings.StartingHearts"]`);
    startingHearts.setAttribute('data-min', numStartingHearts);
    startingHearts.setAttribute('data-max', numStartingHearts);
}

function RandomizeStartingHearts(itemPoolType) {
    let startingHearts = 3;

    // 1st coin flip for any extra hearts
    if (coinToss()) {
        if (itemPoolType === 2 || itemPoolType === 3) {
            startingHearts = Math.floor(Math.random() * (20 - 3 + 1)) + 3;
        }
        else {
            // must win a second coin toss if item pool is balanced or plentiful
            if (coinToss()) {
                startingHearts = 3;
            } else {
                startingHearts = Math.floor(Math.random() * (20 - 3 + 1)) + 3;
            }
        }
    }
    return startingHearts;
}

function UpdateMin(fullKey, v) {
    document.getElementById(fullKey).setAttribute('data-min', v);
}
function UpdateMax(fullKey, v) {
    document.getElementById(fullKey).setAttribute('data-max', v);
}
