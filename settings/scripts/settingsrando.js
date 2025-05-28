var outputJSON = {};
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
        } else if (typeof value === 'string') {
            var minMax = value.split('-');
            var min = minMax[0];
            var max = minMax.length > 1 ? minMax[1] : "";
            html += '<div style="margin-left: 20px;">';
            html += `<label for="${putSpacesInCamelCase(fullKey)}">${putSpacesInCamelCase(key)}: </label>`;
            html += `<input data-min="${min}" data-max="${max}" type="checkbox" id="${fullKey}" class='randomize-check' name="${fullKey}" ${value ? 'checked' : ''}><br>`;
            html += '</div>';
        }
        
    }
    return html;
}

function RollExtraLogic() {
    RandomizeTriforcePieces();
    RandomizeSongs();
    RollItemPoolForStartingHearts();
    RandomizeStartingHearts()
}

function generateConfigForDownload(objectToReplace) {

    RollExtraLogic();
    const outputJSON = structuredClone(objectToReplace);

    const checkboxes = document.querySelectorAll('.randomize-check');

    checkboxes.forEach(checkbox => {
        const path = checkbox.getAttribute('name'); 
        const min = checkbox.getAttribute('data-min');
        const max = checkbox.getAttribute('data-max');

        let value;
        if (min && max) {
            value = Math.floor(Math.random() * (parseInt(max) - parseInt(min) + 1)) + parseInt(min);
        }
        else if (path) { 
            if (path.includes('EnabledTricks')) {
                // Do nothing. Keep all tricks in logic.
                value = min;
            }
            else if (path.includes('ExcludedLocations')) {
                // frogs in the rain coin toss
                if (coinToss()) {
                    value = min;
                }
                else {
                    value = "";
                }
            }
        }
        const keys = path.split('.');
        let current = outputJSON;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!(keys[i] in current)) current[keys[i]] = {};
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
    });
    // validate triforce hunt
    
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
    const triforceHuntMin = document.querySelector(`[id="CVars.gRandoSettings.TriforceHuntRequiredPieces"]`);
    const triforceHuntMax = document.querySelector(`[id="CVars.gRandoSettings.TriforceHuntTotalPieces"]`);
    
    const maxpieces = Math.floor(Math.random() * 100);
    triforceHuntMax.setAttribute('data-min', maxpieces);
    triforceHuntMax.setAttribute('data-max', maxpieces);

    const minpieces = Math.floor(Math.random() * maxpieces);
    while (minpieces > maxpieces) {
        console.log(`rerolling triforce hunt min: ${minpieces}, max: ${maxpieces}`);
    }
    triforceHuntMin.setAttribute('data-min', minpieces);
    triforceHuntMin.setAttribute('data-max', minpieces);
}

function coinToss() {
    return Math.floor(Math.random() * 2) == 0;
}

const deepSearch = (target, value) => {
    if (typeof target === 'object') {
        for (let key in target) {
            if (typeof target[key] === 'object') {
                deepSearch(target[key]);
            } else {
                if (key === 'name') {
                    target[key] = value;
                }
            }
        }
    }
    return target
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
    numStartingHearts = RandomizeStartingHearts(rolledValue);
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
