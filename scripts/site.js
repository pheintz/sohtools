$(document).ready(function () {
    Array.prototype.random = function () {
        return this[Math.floor(Math.random() * this.length)];
    };

    let locations = {};
    let jsonItemList = [];
    let clickedItems = JSON.parse(localStorage.getItem("clickedItems")) || {};

    const goModeItems = [
        "Light Arrows",
        "Master Sword",
        "Progressive Magic Meter",
        "Progressive Bow"
    ];

    const keyItems = [
        "Megaton Hammer",
        "Mirror Shield",
        "Boomerang",
        "Progressive Hookshot"
    ];

    $("#jsonUpload").on("change", function (event) {
        $("#ResultContainer").html("");
        $("#autocomplete").val("").prop("disabled", true);
        clickedItems = {};
        localStorage.clear();

        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                try {
                    const parsedData = JSON.parse(e.target.result);
                    if (parsedData.locations && typeof parsedData.locations === "object") {
                        locations = parsedData.locations;

                        jsonItemList = [...new Set(
                            Object.values(locations).map(val => val?.item || val)
                        )];

                        LoadKeyItems(goModeItems, "GoModeItemContainer");
                        LoadKeyItems(keyItems, "KeyItemContainer");

                        $("#autocomplete").prop("disabled", false);

                        $("#autocomplete").autocomplete({
                            source: jsonItemList,
                            minLength: 2,
                            delay: 100,
                            select: function (event, ui) {
                                const matchingKeys = getMatchingKeys(ui.item.value);
                                AppendMatchingItems(matchingKeys, "ResultContainer");
                                $("#ResultHeader").html(ui.item.value);
                            }
                        });
                    } else {
                        alert("Uploaded JSON must contain a 'locations' object.");
                    }
                } catch (error) {
                    alert("Error parsing JSON. Ensure the file contains valid JSON.");
                }
            };

            reader.readAsText(file);
        } else {
            alert("No file selected.");
        }
    });

    function getMatchingKeys(searchValue) {
        return Object.keys(locations).filter(key => {
            const val = locations[key];
            return val?.item === searchValue || val === searchValue;
        });
    }

    // Ordered exact area -> location-name prefixes, roughly geographic.
    // First match wins, so where prefixes overlap the more specific area must
    // precede the broader one (Gerudo Training Ground before its "Gerudo"
    // catch, Ganon's Castle before the "Ganon" boss).
    const REGION_MAP = [
        ["Kokiri Forest", ["KF"]],
        ["Deku Tree", ["Deku Tree"]],
        ["Lost Woods", ["LW"]],
        ["Sacred Forest Meadow", ["SFM"]],
        ["Forest Temple", ["Forest Temple"]],
        ["Hyrule Field", ["HF"]],
        ["Hyrule Castle", ["HC"]],
        ["Market", ["Market"]],
        ["Temple of Time", ["ToT", "Temple of Time"]],
        ["Lon Lon Ranch", ["LLR"]],
        ["Kakariko Village", ["Kak"]],
        ["Graveyard", ["Graveyard"]],
        ["Bottom of the Well", ["Bottom of the Well"]],
        ["Shadow Temple", ["Shadow Temple"]],
        ["Death Mountain Trail", ["DMT"]],
        ["Goron City", ["GC"]],
        ["Death Mountain Crater", ["DMC"]],
        ["Dodongo's Cavern", ["Dodongos Cavern", "Dodongo's Cavern"]],
        ["Fire Temple", ["Fire Temple"]],
        ["Zora's River", ["ZR"]],
        ["Zora's Domain", ["ZD"]],
        ["Zora's Fountain", ["ZF"]],
        ["Jabu Jabu's Belly", ["Jabu Jabus", "Jabu Jabu"]],
        ["Ice Cavern", ["Ice Cavern"]],
        ["Lake Hylia", ["LH"]],
        ["Water Temple", ["Water Temple"]],
        ["Gerudo Valley", ["GV"]],
        ["Gerudo's Fortress", ["GF"]],
        ["Gerudo Training Ground", ["Gerudo Training Ground", "Gerudo"]],
        ["Haunted Wasteland", ["Wasteland"]],
        ["Desert Colossus", ["Colossus"]],
        ["Spirit Temple", ["Spirit Temple"]],
        ["Outside Ganon's Castle", ["OGC"]],
        ["Ganon's Castle", ["Ganon's Castle", "Ganons Castle"]],
        ["Songs", ["Song ", "Sheik"]],
        ["Free Rewards", ["Link's Pocket", "Gift from"]],
        ["Bosses", ["Queen Gohma", "King Dodongo", "Barinade", "Phantom Ganon", "Volvagia", "Morpha", "Bongo", "Twinrova", "Ganon"]]
    ];

    function classifyRegion(name) {
        for (const [region, prefixes] of REGION_MAP) {
            if (prefixes.some(p => name.startsWith(p))) {
                return region;
            }
        }
        return "Other";
    }

    // Reveals every matching location and re-renders them grouped by region.
    function RenderGroupedResults(matchingKeys, containerList) {
        matchingKeys.forEach(key => { clickedItems[key] = true; });
        localStorage.setItem("clickedItems", JSON.stringify(clickedItems));

        const groups = {};
        matchingKeys.forEach(key => {
            const region = classifyRegion(key);
            (groups[region] = groups[region] || []).push(key);
        });

        containerList.empty();
        const order = REGION_MAP.map(r => r[0]).concat("Other");
        order.forEach(region => {
            const keys = groups[region];
            if (!keys || !keys.length) return;

            const section = $("<div class='result-group'></div>");
            section.append(`<h4 class="result-group-header">${region} <span class="result-group-count">(${keys.length})</span></h4>`);
            keys.forEach(key => {
                section.append(`<div class="result shown" data-key="${key}">${key}</div>`);
            });
            containerList.append(section);
        });
    }

    function LoadKeyItems(items, containerId) {
        const container = $("#" + containerId);
        container.empty(); // Clear previous content
        items.forEach((listItem, index) => {
            const headerId = `${containerId}-header-${index}`;
            const subContainerId = `${containerId}-sub-${index}`;

            container.append(`<div class='key-category'><h3 id="${headerId}">${listItem}</h3><div id="${subContainerId}" class="sub-container"></div></div>`);
            const matchingItems = getMatchingKeys(listItem);
            AppendMatchingItems(matchingItems, subContainerId);
        });
    }

    function AppendMatchingItems(matchingKeys, containerId) {
        const containerList = $("#" + containerId);
        containerList.empty(); // Clear previous content
        if (matchingKeys.length > 0) {
            if (containerId === "ResultContainer" && matchingKeys.length > 1) {
                containerList.append(`<button type="button" class="reveal-all">Reveal All Locations</button>`);
            }
            matchingKeys.forEach((key, index) => {
                const displayValue = locations[key]?.item || locations[key];
                const isClicked = clickedItems[key] || false;

                containerList.append(`
                                <div id="${containerId}-item-${index}"
                                    class="result ${isClicked ? 'shown' : ''}"
                                    data-key="${key}">
                                    ${isClicked ? key : "Reveal Item Location"}
                                </div>
                            `);
            });

            // Attach click event listener dynamically
            containerList.find(".result").off("click").on("click", function () {
                const key = $(this).data("key");
                if (!clickedItems[key]) {
                    clickedItems[key] = true;
                    localStorage.setItem("clickedItems", JSON.stringify(clickedItems));
                    $(this).html(key).addClass("shown");
                }
            });

            // Reveal every location at once, regrouped by region
            containerList.find(".reveal-all").off("click").on("click", function () {
                RenderGroupedResults(matchingKeys, containerList);
            });
        } else {
            containerList.append("<div class='no-results'>No matching keys found.</div>");
        }
    }
});

function ChangeCounter(num) {
    var current = parseInt($("#hint-number").html());
    current += num;
    if (current < 0)
        current = 0;
    $("#hint-number").html(current);
}