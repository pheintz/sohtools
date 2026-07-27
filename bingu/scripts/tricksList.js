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
                "location": SPIRIT_TEMPLE,
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
            {
                "name": `Ledge cancel for silver boulder in zoras fountain`,
                "location": ZORAS_FOUNTAIN,
                "description": `
                    near jabu, climb up on the right
                    sidehop left
                    backflip, shield flick
                    shield drop chu, roll one frame later
                    hold up when the chu is halfway up the small fence
                    4 frame window to hold up until it gets to the top of the small fence
                    target and shield while climbing
                `,
                "tags": [BOMBCHU, BK_SKIP],
                "age": ADULT,
                "embed": "https://www.youtube.com/embed/jHlEENno2DU",
            },
            {
                "name": `forest hoverslide bk skip from bow room`,
                "location": FOREST_TEMPLE,
                "description": `
                    target wall
                    turn right
                    superslide into corner
                    equip hoverboots
                    unequp hoverboots once links shield is alinged with pillar
                    or up to 6 frames after
                `,
                "tags": [BOMBCHU, BK_SKIP],
                "age": ADULT,
                "embed": "https://www.youtube.com/embed/Y4KBFltmIOE",
            },
            {
                "name": `water temple dragonhead chu hovers`,
                "location": WATER_TEMPLE,
                "description": `
                    isg get in corner
                    backflip, sidehop right, roll retarget
                    back all the way up
                    equip hoverboots, 7 vertical hovers
                    equip kokiri boots, 4 angled hovers alternating directions
                    when ledge clipping after key, keep z held and hold up then upleft
                `,
                "tags": [BOMBCHU, BK_SKIP],
                "age": ADULT,
                "embed": "https://www.youtube.com/embed/o85sOjrdz68",
            },
            {
                "name": `DC hover`,
                "location": DODONGOS_CAVERN,
                "description": `
                    walk straight in from entrance
                    jump across, get isg, c-up to fix camera, then ess right
                    back all the way up, 4 sidehops left, keep target sideroll
                    walk all the way up
                    start shuffle hover
                    4 more ess hovers
                    1 first frame sideflip hover
                    backflip
                `,
                "tags": [BOMBCHU, BK_SKIP],
                "age": ADULT,
                "embed": "https://www.youtube.com/embed/o85sOjrdz68",
            },
            {
                "name": `truth spinner skip with bombchu`,
                "location": SHADOW_TEMPLE,
                "description": `
                    line up with spinner, crouch stab
                    backwalk to edge
                    climb up holding z to turn around
                    2 shielded horizontal slashes
                    sidehop right, pull chu
                    shield drop and roll on 8th black
                    neutral mega no control stick input
                `,
                "tags": [BOMBCHU],
                "age": ADULT,
                "embed": "https://www.youtube.com/embed/aMaOo5-Ci0c",
            },
            {
                "name": `truth spinner skip with bombs`,
                "location": SHADOW_TEMPLE,
                "description": `
                        backwalk off
                        climb up and turn right
                        2x backflip, sidehop left, sideroll keeping z held
                        backflip and drop bomb during the backflip and release shield before landing
                        keep z held
                        roll on 1st frame of 3rd fast black flash
                        hold left to backflip on lean back frame
                `,
                "tags": [BOMBS],
                "age": ADULT,
                "embed": "https://youtu.be/cu7sp5ifRHM",
            },
            {
                "name": `serenade cs skip with bombchu`,
                "location": ICE_CAVERN,
                "description": `
                    target boots chest
                    turn left, sidehop left
                    turn left, backflip and shield drop chu
                    hold down and buffer to first frame of seeing links head
                    press A out of unpause
                `,
                "tags": [BOMBCHU],
                "age": ADULT,
                "embed": "https://www.youtube.com/embed/vcsbaa2XHxA",
            },
            {
                "name": `7 gtg keys child and adult route`,
                "location": GERUDO_TRAINING_GROUNDS,
                "description": `
                    watch video for route
                `,
                "tags": [BOMBCHU],
                "age": ADULT,
                "embed": "https://www.youtube.com/embed/vcsbaa2XHxA",
            },
            {
                "name": `Enter GTG with Hoverboots`,
                "location": GERUDO_TRAINING_GROUNDS,
                "description": `
                    equip hoverboots
                    climb up from the right side
                    vertical slash + R
                    turn right, crouch stab and wait for momentum to settle
                    jumpslash and wait for hoverboots to expire
                    jumpslash again and hold R in the air
                `,
                "tags": [BOMBCHU],
                "age": ADULT,
                "embed": "https://www.youtube.com/embed/bcCYAhsI8bY",
            },
            {
                "name": `Jumpslash Clip into Water Temple (master sword, non-initial)`,
                "location": LAKE_HYLIA,
                "description": `
                    from slate, start middle-middle left
                    hop up with neutral stick sidehop right, left (against wall)
                    sidehop right, sideroll untarget
                    turn left, 1ess left
                    3x sidehop right
                    vertical slash + shield
                    backwalk
                    jumpslash in frame window rolling stick from down to up-right making sure to keep full input
                    release target during jumpslash
                `,
                "tags": [BOMBCHU],
                "age": ADULT,
                "embed": "https://youtu.be/_0_2zGF59_Q",
            },
        ]
    };
}
