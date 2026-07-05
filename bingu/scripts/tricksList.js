// Items
const DEKU_STICKS = "deku sticks";
const BOMBS = "bombs";
const BOMBCHU = "bombchu";
const ITEMLESS = "itemless";
const HOVER_BOOTS = "hover boots";
const IRON_BOOTS = "iron boots";
const HOOKSHOT = "hookshot";
const BOW = "bow";
const HAMMER = "megaton hammer";
const KOKIRI_SWORD = "kokiri sword";
const MASTER_SWORD = "master sword";

// Concepts
const WEIRDSHOT = "weirdshot";
const WEIRDSLIDE = "weirdslide";
const MEGAFLIP = "megaflip";
const GATE_CLIP = "gate clip";
const SUPERSLIDE = "superslide";
const BK_SKIP = "BK skip";
const OI = "ocarina items";
const LUNGE_STORAGE = "lunge storage";
const MEGA_SIDEHOP = "mega sidehop";
const VINE_CLIP = "vine clip";

// General Equipment
const ONEHW = "1HW";
const TWOHW = "2HW";

// Locations
const GENERAL = "General";
const DEKU_TREE = "Deku Tree";
const GORON_CITY = "Goron City";
const DODONGOS_CAVERN = "Dodongo's Cavern";
const JABUS_BELLY = "Jabu's Belly";
const ZORAS_RIVER = "Zora's River";
const ZORAS_DOMAIN = "Zora's Domain";
const ZORAS_FOUNTAIN = "Zora's Fountain";
const ICE_CAVERN = "Ice Cavern";
const GRAVEYARD = "Graveyard";
const SPIRIT_TEMPLE = "Spirit Temple";
const DESERT_COLOUSUS = "Desert Colossus";
const LAKE_HYLIA = "Lake Hylia";
const HYRULE_FIELD = "Hyrule Field";
const HYRULE_CASTLE = "Hyrule Castle";
const GERUDO_VALLEY = "Gerudo Valley";
const GERUDO_TRAINING_GROUNDS = "Gerudo Training Grounds";
const GF = "Gerudo Fortress";
const FOREST_TEMPLE = "Forest Temple";
const FIRE_TEMPLE = "Fire Temple";
const WATER_TEMPLE = "Water Temple";
const SHADOW_TEMPLE = "Shadow Temple";
const KOKIRI_FOREST = "Kokiri Forest";
const LOST_WOODS = "Lost Woods";
const OGC = "Outside Ganon's Castle";
const SACRED_FOREST_MEADOW = "Sacred Forest Meadow";
const DMC = "Death Mountain Crater";
const DMT = "Death Mountain Trail";
const GC = "Ganon's Castle";
const BOTW = "Bottom of the Well";
const TEMPLE_OF_TIME = "Temple of Time";
const HAUNTED_WASTELAND = "Haunted Wasteland";
const KAKARIKO_VILLAGE = "Kakariko Village";
const HYRULE_MARKET = "Hyrule Market";

// Ages
const ADULT = "adult";
const CHILD = "child";
const ANY_AGE = "any age";


window.getTricks = function getTricks() {
    return {
        "tricks": [
            {
                "name": "default grotto damage rba",
                "location": GENERAL,
                "description": `
                        turn right
                        5 sidehop left
                        backflip
                        damage RBA
                `,
                "tags": [BOMBCHU, BK_SKIP],
                "age": ADULT,
                "embed": "https://www.youtube.com/embed/LAxfSrp2qdU",
            },
            {
                "name": "adult chu wall RBA",
                "location": GENERAL,
                "description": `
                    crouch stab wall
                    drop chu on 8th red or black
                    quickdraw
                    press b on links head jerk to the right
                `,
                "tags": [BOMBCHU, BK_SKIP],
                "age": ADULT,
                "embed": "https://www.youtube.com/embed/PkBxmhIHaC4",
            },
            {
                "name": `Shoot torch in Spirit Temple sun block room with bow`,
                "location": SPIRIT_TEMPLE,
                "description": `
                    collect rupes
                    climb near gray line on ledge
                    aim towards torch
                    shot arrow on last frame with space between link/bow
                    visual cue, bow is facing straight down to the ground
                `,
                "tags": [BOMBCHU, BK_SKIP],
                "age": ADULT,
                "embed": "https://www.youtube.com/embed/AuqYffWrXWM",
            },
            {
                "name": `OoT Swordless Deathless Bolero CS Skip`,
                "location": DMC,
                "description": `
                    from darunia

                    DO NOT TARGET
                    ess turn down
                    2 backflips, sidehop right, 2 backflips
                    ess turn down
                    hookshot the bridge, aim straight down top of 3rd plank
                    tap up to climb
                    target and roll
                    ess turn left
                    target
                    hold hookshot aim full up, relase as soon as full up
                    roll, 2ess right
                    sidehop and release everything
                    press a when shiek starts standing up
                `,
                "tags": [BOMBCHU, BK_SKIP],
                "age": ADULT,
                "embed": "https://www.youtube.com/embed/IbwwTxWHGdo",
            },
            {
                "name": `GTG Chus With Hookshot and 1 Key`,
                "location": GERUDO_TRAINING_GROUNDS,
                "description": `
                    open right door
                    get into right corner
                    1 shielded vertical
                    2 right crouch stabs
                    3 shielded vertical
                    walk to wall
                    backflip, turn around
                    roll, sidehop right, turn right
                    hookshot extension
                    aim for bottom of far fence
                `,
                "tags": [BOMBCHU, BK_SKIP],
                "age": ADULT,
                "embed": "https://www.youtube.com/embed/PtVTQdoctDU",
            },
            {
                "name": `Spirit SoT Skulltula`,
                "location": DMC,
                "description": `
                    get against wall, dot on wall to the right of the door
                    turn right
                    downroll
                    hold shield until megaflip frame
                    A + Up-left
                    keep holding direction
                `,
                "tags": [BOMBCHU, BK_SKIP],
                "age": ADULT,
                "embed": "https://www.youtube.com/embed/AGseVkEmM-A",
            },
        ]
    };
}
