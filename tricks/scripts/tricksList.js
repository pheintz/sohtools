// Items
const DEKU_STICKS = "deku sticks";
const BOMBS = "bombs";
const BOMBCHU = "bombchu";
const ITEMLESS = "itemless";
const HOVER_BOOTS = "hover boots";
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
const GERUDO_VALLEY = "Gerudo Valley";
const GERUDO_TRAINING_GROUNDS = "Gerudo Training Grounds";
const FOREST_TEMPLE = "Forest Temple";
const FIRE_TEMPLE = "Fire Temple";
const WATER_TEMPLE = "Water Temple";
const SHADOW_TEMPLE = "Shadow Temple";
const KOKIRI_FOREST = "Kokiri Forest";
const LOST_WOODS = "Lost Woods";
const OGC = "Outside Ganon's Castle";
const SACRED_FOREST_MEADOW = "Sacred Forest Meadow";
const DMC = "Death Mountain Crater";
const GC = "Ganon's Castle";
const BOTW = "Bottom of the Well";
const TEMPLE_OF_TIME = "Temple of Time";
const HAUNTED_WASTELAND = "Haunted Wasteland";
const KAKARIKO_VILLAGE = "Kakariko Village";

// Ages
const ADULT = "adult";
const CHILD = "child";
const ANY_AGE = "any age";


window.getTricks = function getTricks() {
    return {
        "tricks": [
            {
                "name": "Ice Cavern Red Ice Bomb Push",
                "location": ICE_CAVERN,
                "description": `
                                4 frames backwalk after dropping bombs
                                turn around and backwalk
                                backflip when the camera re centers
                                `,
                "tags": [BOMBS],
                "age": ADULT,
                "embed": "https://youtube.com/embed/dU9R5smlQfc", 
            },
            {
                "name": "King Zora Itemless Skip",
                "location": ZORAS_DOMAIN,
                "description": `
                                climb up next to the pillar
                                roll, sidehop left, roll+retarget
                                sidehop left, roll+retarget
                                backflip and without retargeting roll 3x
                                sidehop left, roll+retarget
                                roll, sidehop left x2 and hold foward
                                `,
                "tags": [ITEMLESS],
                "age": ADULT,
                "embed": "https://youtube.com/embed/Hvq95fTEaGQ",
            },
            {
                "name": "Zora Shop Clip Master Sword Shieldless",
                "location": ZORAS_DOMAIN,
                "description": `

                                `,
                "tags": [MASTER_SWORD],
                "age": ADULT,
                "embed": "",
            },
            {
                "name": "Zora Shop Clip Master Sword Shielded",
                "location": ZORAS_DOMAIN,
                "description": `
                                kill sign
                                align with right side of red ice 1ess right
                                shielded vertical slash
                                left sidehop
                                shielded horizontal slash
                                jumpslash
                                `,
                "tags": [MASTER_SWORD],
                "age": ADULT,
                "embed": "",
            },
            {
                "name": "Zora Shop Clip 2 Handed (not sticks)",
                "location": ZORAS_DOMAIN,
                "description": `
                                tested with hammer, bgs, giants knife

                                target ice, get into right corner while holding z
                                1 ess left
                                with Z: backflip, sidehop left, roll,
                                roll with forward and bonk
                                jumpslash
                                `,
                "tags": [TWOHW],
                "age": ADULT,
                "embed": "https://youtube.com/embed/fTEsCG40gvM",
            },
            {
                "name": "qpa hover into ice cavern",
                "location": ZORAS_FOUNTAIN,
                "description": `
                                get QPA and ISG
                                Align with pillar and turn around
                                without retargeting: sidehop left, roll, roll
                                pull stick
                                frame 1: Z+R+Down
                                frame 2: Bomb+Z+R
                                keep holding Z+R
                                frame link is standing: backflip again onto railing
                                align with landing zone from on railing
                                qpa hover like before until you make it:
                                pull stick, 1 frame backflip, Unpause with  Bomb+Z+R
                                `,
                "tags": [BOMBS, BOMBCHU],
                "age": CHILD,
                "embed": "https://youtube.com/embed/Jg4vIiGzJCY",
            },
            {
                "name": "Skip Dampe Windmill SoT Block w/ bombs/chus",
                "location": GRAVEYARD,
                "description": `
                                align wall on right against the block
                                bombs: 1ess right
                                chus: 2ess right
                                `,
                "tags": [BOMBS, BOMBCHU],
                "age": CHILD,
                "embed": "https://youtube.com/embed/jUvkmsHJLaY",
                
            },
            {
                "name": "child clip into lake hylia from zoras domain with sticks",
                "location": ZORAS_DOMAIN,
                "description": `
                                align with wall, turn right
                                backwalk and sidehop into seam
                                retarget, roll, 2x sidehop right, backflip, jumpslash
                                turn right and retarget, swim backwards off the ledge and back up
                                `,
                "tags": [DEKU_STICKS],
                "age": CHILD,
                "embed": "https://youtube.com/embed/Nl9dUk5E9jA",
            },
            {
                "name": "Bombs Sidehop Into Zoras Domain Waterfall Skip",
                "location": ZORAS_RIVER,
                "description": `
                                ISG, target wall, 2ess left, hold angle, get into corner
                                Z+A+R on 9th red (frame before big blue)
                                hold Z + right and mash A                                `,
                "tags": [BOMBS],
                "age": ANY_AGE,
                "embed": "https://youtube.com/embed/Q7XjNM6AIog",
            },
            {
                "name": " Bombchu Sidehop Into Zoras Domain Waterfall Skip",
                "location": ZORAS_RIVER,
                "description": `
                                ISG, target wall, 2ess left, hold angle, get into corner
                                On the same frame shield drop chu and roll
                                hold Z + right and mash A                                `,
                "tags": [BOMBCHU],
                "age": ANY_AGE,
                "embed": "",
            },
            {
                "name": "Bombchu Mega Sidehop From Zoras Domain to Lost Woods",
                "location": ZORAS_RIVER,
                "description": `
                                backwalk off the edge,
                                2x sidehop right, sidehop left, sidehop right
                                2ess right
                                from 10th red:
                                frame 1: shield drop
                                frame 2: roll
                                hold right during roll until link is standing
                                sidehop right
                                `,
                "tags": [BOMBCHU],
                "age": CHILD,
                "embed": "https://youtube.com/embed/bYZAdqDIHBY",
            },
            {
                "name": "Chu + Hoverboots up to Spirit Temple Hand Chest",
                "location": DESERT_COLOUSUS,
                "description": `
                                get isg
                                align with wall, backflip, roll and retarget
                                roll into seam, 2x sidehop left, shield flick, roll
                                backwalk and drop bomb at bottom of the stairs
                                walk to the top of the stairs
                                backflip on 1st explosion frame you can see from off screen
                                now in the air standing:
                                equip hover boots
                                4x vertical hover (drop bomb and backflip on the same frame)
                                on the 5th, have Z unpressed buffer 2 frames after dropping the bomb then press Z to target the chu. camera will unlock
                                walk slightly up-right forward (see how link is walking in video), no input for two frames, then control stick down, you want link backwalking then retarget
                                5x vertical hovers
                                unequip hover boots
                                2x backflip target the seam and walk up
                                hookshot the chest
                                `,
                "tags": [BOMBCHU, HOVER_BOOTS],
                "age": ADULT,
                "embed": "https://youtube.com/embed/tDZH1-jFqh4",
            },
            {
                "name": "Fire Temple BK Skip 0 Keys Hovers Chus",
                "location": FIRE_TEMPLE,
                "description": `
                                get isg
                                target wall, turn left, sidehop right
                                equip hovers
                                backflip hover 1x
                                26? vertical hovers (R+A+Backflip)
                                unequip hovers, sidehop left
                                `,
                "tags": [BOMBCHU, HOVER_BOOTS],
                "age": ADULT,
                "embed": "https://youtube.com/embed/YkSziqIy2_k",
            },
            {
                "name": "Weirdshot Into Child Spirit Temple From Crates Room",
                "location": SPIRIT_TEMPLE,
                "description": `
                                see: universal weirdshot,
                                you can hookshot the torch to get in
                                `,
                "tags": [HOOKSHOT, BOMBS, WEIRDSHOT],
                "age": ADULT,
                "embed": "https://youtube.com/embed/c3FUQPX-qL8",
            },
            {
                "name": "Spirit Temple Silver Block Clip ISG and Bombs",
                "location": SPIRIT_TEMPLE,
                "description": `
                                get isg
                                line up with wall
                                sidehop right, 2ess left
                                get into corner
                                shield drop 2 bombs overhead
                                roll, backflip with Z and R and wait for bombs to blow up
                                you should be clipped through the wall here, back up to the ledge
                                cancel isg
                                line up with block at the edge of the drawing and run forward
                                `,
                "tags": [BOMBS, ONEHW, TWOHW],
                "age": ADULT,
                "embed": "https://youtube.com/embed/C6A5pH_G0_k",
            },
            {
                "name": "Spirit Temple Triple Slash Silver Block Skip",
                "location": SPIRIT_TEMPLE,
                "description": `
                                    line up with wall
                                    backflip, roll and retarget
                                    sidehop left, roll and retarget
                                    line up roughly between the two columns
                                    backwalk into corner

                                    triple slash (if you mess up you can just try again, no need to re set up)
                                    hold Z during the third slash
                                    once the sword hits the right wall (blue sparks)
                                    buffer 3 frames, links sword will be nearly vertical at this point
                                    from here:
                                    frame 1: pull first person item
                                    2, 3, 4: hold Z
                                    out of next unpause Z and shield

                                    release everything
                                    horizontal slash with shield cancel

                                    you can turn right and backflip immediately, no need to step forward in the video but I found some distances make it easier in real time

                                    hold Z and Down during the backflip. You'll see link snap up to the edge and then start falling, then snap up again. On this second snap up you can release all inputs.

                                    turn around and jump across the gap

                                    alternatively, after the shielded horizontal slash, hold z and take half a sidestep away from the block
                                    c-up and aim to the left of the corner, if you're just barely to the left it's not good enough. aim more to the left like the video
                                    forward roll and hold up and you'll make it
                                `,
                "tags": [MASTER_SWORD, BOW, HOOKSHOT],
                "age": ADULT,
                "embed": "https://youtube.com/embed/1yTzv6i6X_M",
            },
            {
                "name": "Ledge Clip Into Water Temple Entrance",
                "location": LAKE_HYLIA,
                "description": `
                            the water has to be lowered

                            To ledge clip:
                            sidehop right then left again
                            roll and release Z after roll
                            repress z on the ledge grab frame shown to clip in

                            swim towards the seam
                            your camera should re adjust when you hit it
                            once that happens turn left and swim into the temple entrance
                                `,
                "tags": [ITEMLESS],
                "age": ADULT,
                "embed": "https://youtube.com/embed/0i-tlC7SB7E",
            },
            {
                "name": "Adult LH to ZD Bombchu Dive",
                "location": LAKE_HYLIA,
                "description": `
                                climb up
                                2 ess right
                                backflip
                                turn around
                                3x hold up while rolling
                                for chus: roll, backflip, shieldflick, megaflip
                                hold left in the air

                                *for bombs: shield drop bomb, roll, backflip, megaflip
                                `,
                "tags": [BOMBCHU],
                "age": ADULT,
                "embed": "https://youtube.com/embed/G6XVwXbBo8s",
            },
            {
                "name": "Water Temple Entry Jumpslash Clip",
                "location": LAKE_HYLIA,
                "description": `
                                line up with sun side of slate
                                sidehop right, side roll, turn left
                                roll up to slate
                                backflip, 3ess right, 3 sidehop right
                                have weapon out
                                backwalk (keep holding down until jumpslash),
                                pause around where you hit the ledge below(links head will be coming back on screen),
                                keep holding z and down and waiting for link to leave the screen again
                                5th frame links head is off the screen again: jumpslash out of the unpause rotate the stick from down to up
                                `,
                "tags": [WATER_TEMPLE],
                "age": ADULT,
                "embed": "https://youtube.com/embed/XXGKidCP1pg",
            },
            {
                "name": "Hookshot Jump Tree Skultulla Lake Hylia",
                "location": LAKE_HYLIA,
                "description": `
                                have hookshot in hand
                                target tree
                                hold angle and roll into corner
                                backflip, sidehop right, sidehop left, roll without retargeting
                                bonk tree and mash hookshot
                                if you want to buffer:
                                frame of red dot showing: press hookshot button
                                release one frame later
                                `,
                "tags": [HOOKSHOT],
                "age": ADULT,
                "embed": "https://youtube.com/embed/x_wv4TWVpEs",
            },
            {
                "name": "Enter Water Temple As Child w Sticks",
                "location": LAKE_HYLIA,
                "description": `
                                hold z until you hit the water at the very bottom
                                1 sidehop left, 4 backflips,
                                downroll (roll without retarget)
                                hold left the entire time for the roll

                                check for the frame where link pops up and pull stick and jumpslash as soon as stick is out.

                                keep holding Z and Left and you'll fall off, and keep holding Z and Left until:

                                watch the top of the screen where the angle of the water texture changes (there's a 'peak'). the first frame that corner goes off screen switch to holding Z and Right and hold until you hit the water

                                swim
                                `,
                "tags": [DEKU_STICKS],
                "age": CHILD,
                "embed": "https://youtube.com/embed/rXNEoKCei-Y",
            },
            {
                "name": "Water Temple BK Skip Bombchu",
                "location": WATER_TEMPLE,
                "description": `
                                get isg
                                face the right pillar
                                turn right, sidehop right, turn right
                                sidehop right, on 2nd frame of sidehop shielddrop chu (keep holding Z+R)
                                on the frame link touches the ground, Z+R+Backflip
                                on the frame link 'freezes' in the air (shield will rotate left a bit) release all inputs
                                once upright, shield drop chu (Z+R+Bombchu)
                                3 frames later hold shield and backflip
                                shield drop chu on 8th red, swing/unsheath on 1st explosion frame
                                `,
                "tags": [BOMBCHU, BK_SKIP],
                "age": ANY_AGE,
                "embed": "https://youtube.com/embed/pHanWnYieYc",
            },
            {
                "name": "Spirit Temple BK Skip Bombchu",
                "location": SPIRIT_TEMPLE,
                "description": `
                                Get ISG off boss door, face the center lock,
                                turn right, sidehop right, turn left,
                                hold target and shield drop a bombchu on the 9th red
                                release target and shield and hold down
                                when link is facing the camera (2 frames), release down and hold target and shield
                                (keep Z+R) when camera has centered behind link (4 frames), backflip out of the unpause
                                when link’s legs are sticking up, release target and shield
                                once upright, shield drop a chu (Z+R+Bombchu)
                                3 frames later hold shield and backflip,
                                refocus camera, shield drop chu on 8th red, swing/unsheath on 1st explosion frame
                                `,
                "tags": [BOMBCHU, BK_SKIP],
                "age": ANY_AGE,
                "embed": "https://youtube.com/embed/HdzPVbpwoEI",
            },
            {
                "name": "Spirit Temple 0 Keys Unloaded Statue Climb",
                "location": SPIRIT_TEMPLE,
                "description": `
                                to get here see: "HESS Clip Into Child Side As Adult Spirit Temple""
                                Boost with hovers on to fence
                                unequip hovers and backflip immediately when you climb up to get into lobby

                                try to take a hit from the keese so it gets bugged out trying to re light itself on the torch

                                get QPA on the wall to the left from where you backflipped up

                                the climbable wall (on child side lobby spirit temple) is directly behind where you backflipped up
                                get keese aggro and climb up, ISG on keese

                                keep walking forward relative from where you climbed up into the wall
                                align with wall and sidehop left until you hit the left wall
                                walk all the way forward, you're now halfway up the child side ramp in the corner
                                turn right 3 QPA hovers and then backflip OR chus: sidehop right 2x and downroll into twisted hover 4x
                                you're now on the adult side ramp
                                turn around and run forward to the wall
                                cancel isg, turn left and put on hovers

                                run forward (where the hammer switch is) across the gap
                                run all the way to the wall

                                remove hoverboots, backflip, roll, roll, turn left
                                put on hoverboots, run forward and land
                                remove hoverboots, turn right and get up against the statue shoulder

                                do statue climb: (for sticks setup is sidehop left, roll, gainer, shielded jumpslash, 2x shielded slashes)

                                for the hoverboots method to clip into the head:
                                don't move when you land from the jumpslash
                                turn down-right
                                backflip and backflip again on the first frame you can do the second backflip
                                about halfway through the second backflip hold down left without z
                                you'll run to the boss door and you can do bk skip
                                `,
                "tags": [BOMBS, BK_SKIP, DEKU_STICKS],
                "age": ADULT,
                "embed": "https://youtube.com/embed/BbNn0zLLwNE",
            },
            {
                "name": "Child Shadow Temple Gate Clip",
                "location": SHADOW_TEMPLE,
                "description": `
                                (see video) get into corner in pit and align
                                turn around,  2 ess left, backflip, shield scoot
                                if you want to buffer shield scoot it's 3 frames unshielded
                                turn right, 2x jumpslash
                                `,
                "tags": [DEKU_STICKS],
                "age": CHILD,
                "embed": "https://youtube.com/embed/tFbHGK8Wl6c",
            },
            {
                "name": "Shadow Temple Gate Clip Deku Stick",
                "location": SHADOW_TEMPLE,
                "description": `
                            align with gate wall in the corner, move to the left a bit
                            downroll and retarget for angle
                            turn left, 1ess right
                            sidehop right, sideroll to get into corner
                            3x sidehop left
                            z+swing
                            spam jumpslash and hold up during slash
                                `,
                "tags": [DEKU_STICKS, GATE_CLIP],
                "age": ADULT,
                "embed": "https://youtube.com/embed/CuVYxwIHsPM",
            },
            {
                "name": "Shadow Temple Gate Clip Crouch Stab Method",
                "location": SHADOW_TEMPLE,
                "description": `
                for two handers including sticks
                above ledge align with the left wall and turn right
                walk forward and jump off
                make sure you're against wall
                sidehop left, sideroll and let go of target
                2x crouch stab
                jumpslash
                                `,
                "tags": [DEKU_STICKS, GATE_CLIP],
                "age": ADULT,
                "embed": "https://youtube.com/embed/86SkMxtQEO8",
            },
            {
                "name": "Weirdshot Shadow Temple LikeLike Chest",
                "location": SHADOW_TEMPLE,
                "description": `
                                some positions you won't go underground but next to the wall facing right seems to work
                                see: universal weirdshot
                                `,
                "tags": [DEKU_STICKS],
                "age": CHILD,
                "embed": "https://youtube.com/embed/YuANSzTuDDE",
            },
            {
                "name": "Child Water Temple Entry Superslide",
                "location": LAKE_HYLIA,
                "description": `
                                Align as shown.
                                Legs between blade of grass, glitch tick on the brick line
                                1 Roll, turn right
                                Chu on 8th black
                                frames
                                1 Z+R
                                2-4 right on stick
                                5 right+A
                                6.... Z+R+Mash A
                                When links head is below the bush release R
                                Swim under bushes turn right and realign camera
                                10 swims (without B) just left of the left pillar
                                A and dive up+right

                                note: won't work if you have any strength upgrades
                `,
                "tags": [BOMBCHU, SUPERSLIDE],
                "age": CHILD,
                "embed": "https://youtube.com/embed/_1fHdyn595U",
            },
            {
                "name": "Enter Jabu As Adult w/ Bombchu",
                "location": ZORAS_FOUNTAIN,
                "description": `
                                get isg
                                get into corner
                                2x backflip, roll + retarget
                                left sidehop, roll + retarget
                                right sidehop, no retarget + roll
                                walk forward (up notch) until link stops at the ledge

                                9th red out of pause: Z+R+A+Right, let go of right until landing
                                hold, not quite up-right notch, up a little more, X value in the 30s (see note)

                                while holding angle, on 8th black chu: R+Right out of unpause and hold the inputs
                                buffer 4 frames (on 4th frame links shield moves to the right)
                                On 4th frame: R+A with no stick input.

                                During the roll: keep holding R. watch for explosion frame 
                                1st frame: you will see the hilt of link's sword clearly sticking out
                                2nd frame: bigger explosion, hilt no longer visible
                                On this frame: Z+R+A+Left and unpause and let link go

                                note: (ship setting on input viewer: analog angle values or dev tools: value viewer)
                `,
                "tags": [BOMBCHU, JABUS_BELLY],
                "age": ADULT,
                "embed": "https://youtube.com/embed/xDLnTnV9UcY",
            },
            {
                "name": "Adult Jabu Entry Master Sword Bombs and Hovers",
                "location": ZORAS_FOUNTAIN,
                "description": `
                            line up with wall
                            get to sidehop right, roll+retarget angle however you want and hold that angle
                            walk up and let fence push you to the left
                            link's right foot halfway on the ice

                            have hoverboots equipped

                            pull bomb
                            out of unpause from big blue
                            Z+R+Roll
                            hold right during the roll

                            1st damage frame: link is standing up and toes pointing up-right
                            2nd damage frame: feet in neutral position: sidehop right with Z+R

                            let go of R after the explosion clears because you need to jumpslash soon

                            watch link's momentum:
                            link will look like he's falling straight down like normal,
                            then one frame you get pushed/slide - pause here

                            unequip hovers

                            frame 1: jumpslash
                            frame 2: equip hovers

                            note: if you're blowing up instead of side hopping you're probably too far forward on the ice
                `,
                "tags": [MASTER_SWORD, BOMBS, HOVER_BOOTS, JABUS_BELLY],
                "age": ADULT,
                "embed": "https://youtube.com/embed/TmVpDyLiXrk",
            },
            {
                "name": "Child Statue Climb From Child Side",
                "location": SPIRIT_TEMPLE,
                "description": `
                    Ailgn with wall, ess left, backflip, roll retarget for angle, roll into corner
                    with z held 4x backflip, roll, 2x left sidehop, roll, left sidehop, roll and release z
                    with z held 4x left sidehop, roll, left sidehop
                    retarget, roll, left sidehop
                    retarget, roll, 1ess right

                    hold z the rest of the time 
                    roll, up+roll
                    hold up until the frame where link is obviously coming down (frame after link's foot is parallel with the ground)
                    from unpause, pull stick and hold left until frame where links stick is pointing forward 
                    if you're paused on that frame jumpslash out of the unpause with no control stick inputs`,
                "tags": [DEKU_STICKS],
                "age": CHILD,
                "embed": "https://youtube.com/embed/TiTWNFPGImA",
            },
            {
                "name": "Bomb QPA Hover Into Forest",
                "location": SACRED_FOREST_MEADOW,
                "description": `
                                get QPA and ISG (see: "Adult Stick Nut QPA"))
                                get into corner
                                3 sidehop left and roll with target held
                                turn right. 4 sidehops right, turn left, 2 ess left
                                9 bomb hovers, backflip, jump to main ledge
                `,
                "tags": [BOMBS],
                "age": ADULT,
                "embed": "https://youtube.com/embed/mZ41KgN2TF8",
            },
            {
                "name": "Adult Stick Nut QPA (Quick Putaway)",
                "location": GENERAL,
                "description": `target wall
                                backflip sidehop right
                                roll+retarget, 2ess right
                                walk left against wall
                                frame 1: put away
                                frame 2: deku nut
                                jumpslash
                                if your stick breaks you have glitched damage value
                `,
                "tags": [DEKU_STICKS],
                "age": ADULT,
                "embed": "https://youtube.com/embed/C5gYslOuxlU",
            },
            {
                "name": "GTG Gate Clip Bombs",
                "location": GERUDO_TRAINING_GROUNDS,
                "description": `
                                go into corner. A drop bomb get on fence and climb sideways one over into the corner
                                to clip right: hold right on big red
                                to clip left: hold left on first explosion frame
                `,
                "tags": [BOMBS, GATE_CLIP],
                "age": ANY_AGE,
                "embed": "https://youtube.com/embed/k-oAPiO8mPM",
            },
            {
                "name": "Distance Megaflip Gerudo Valley",
                "location": GERUDO_VALLEY,
                "description": `
                            align on pillar black line
                            left sidehop, shield flick, right sidehop
                            backflip, roll, bonk (Z+Roll+Hold Up)
                            left sidehop, roll+retarget
                            left sidehop, roll+retarget
                            2x backflip, sidehop right
                            bomb, roll, backflip
                            roll on big red

                            for distance megaflip:
                            1st frame when link has shield out: Z+R+Down
                            2nd frame link has shield out, backflip: Z+R+Down+A
                `,
                "tags": [BOMBS],
                "age": ANY_AGE,
                "embed": "https://youtube.com/embed/sdOLkSfFevY",
            },
            {
                "name": "Bombs or Bombchu Clip Into Gerudo Valley Boulder Grotto",
                "location": GERUDO_VALLEY,
                "description": `
                            For the angle: after turning around, use the top of the ridge where the angle changes.

                            chus: 3 rolls and megaflip
                            bombs: 4 rolls, bomb, shield drop, roll, backflip, megaflip
                `,
                "tags": [BOMBS, BOMBCHU],
                "age": ANY_AGE,
                "embed": "https://youtube.com/embed/nxLp15RctiQ",
            },
            {
                "name": "Gerudo Valley Cucko Jump w/ Sticks",
                "location": GERUDO_VALLEY,
                "description": `
                                remove bunny hood
                                get quickdraw (cancel draw stick animation while falling in water)
                                align with wall, turn left and backwalk all the way
                                throw cucko, turn around and re center camera and pause
                                to keep from speaking to guard pause is required
                                backflip out of the pause, then backflip again out of another pause
                                shield flick, roll, let go of Z and pick up the cucko
                                Z and release if you need to again to ess turn right
                                hold Z, 5 frames backwalk, on the 5th unpause let go of all inputs
                                once you come to a stop, one frame up and then hold left
                                when link is no longer visible
                                1 frame stick pull due to quickdraw
                                1 frame no inputs
                                1 frame stick jumpslash
                    `,
                "tags": [DEKU_STICKS],
                "age": CHILD,
                "embed": "https://youtube.com/embed/OSGjX3cGAEU",
            },
            {
                "name": "Lensless Wasteland w/ Fast Bunny Hood",
                "location": HAUNTED_WASTELAND,
                "description": `
                            Cross the sand on the left side
                            for the second portion:

                            Watch the flags on the left, backwalk until the poles line up
                            start side hopping to the right. Watch the flags on the right, when the two furthest right line up sidehop right 4 more times
                            turn down left then backwalk
                            when you see the third set of levers spawn turn around and run to the flags
                `,
                "tags": [ITEMLESS],
                "age": ANY_AGE,
                "embed": "https://youtube.com/embed/UAyj--7RGys",
            },
            {
                "name": "Deku Adult BK (231) Skip",
                "location": DEKU_TREE,
                "description": `
                    Align with wall, turn around,
                    hold z forever:
                    hop to corner, 2x left sidehop, backflip, walk forward max speed.
                    A to drop then pull stick+jumpslash on 4th frame or sword immediately.`,
                "tags": [TWOHW, ONEHW, BK_SKIP],
                "age": ADULT,
                "embed": "https://www.youtube.com/embed/4jmnz6FM3kU",
            },
            {
                "name": "Bombchu Hover to Deku Basement GS",
                "location": DEKU_TREE,
                "description": `
                    get jumpslash storage to 1 shot the GS
                    get isg

                    align with wall
                    ess left, sidehop left, ess left
                    sidehop left and right again quickly to avoid z targeting the big skultulla
                    shield drop chu on 2nd frame of sidehop,
                    backflip immedately on landing
                    shield drop 2nd chu immediately when upright and backflip

                    z target the big skultulla to unlock angle
                    let go of z and turn and put your back to the skultulla
                    Z+R+Backflip, wait a second and backflip again
                    GS should die automatically and backflip if needed to collect the token`,
                "tags": [BOMBCHU],
                "age": ANY_AGE,
                "embed": "https://youtube.com/embed/QUHP5JwA__I",
            },
            {
                "name": "Enter Closed Deku As Adult",
                "location": KOKIRI_FOREST,
                "description": "",
                "tags": [HOVER_BOOTS, BOMBS],
                "age": ADULT,
                "embed": "",
            },
            {
                "name": "Deku Tree B1 Skip",
                "location": DEKU_TREE,
                "description": `
                            align with wall. I look at links left pant leg to just overlap the left corner.
                            turn left
                            without letting go of Z: sidehop left, roll and pause
                            release Z
                            start holding up on the first frame link is diving forward (3rd frame of roll)
                `,
                "tags": [ITEMLESS],
                "age": CHILD,
                "embed": "https://youtube.com/embed/wuZiqjfhChQ",
            },
            {
                "name": "Dodongo Eyes Early Boss Bombchu",
                "location": DODONGOS_CAVERN,
                "description": `
                                get into corner
                                backflip, roll, turn left
                                for 1st eye shield drop instantly
                                2nd eye shield drop around 2nd red`,
                "tags": [BOMBCHU],
                "age": ANY_AGE,
                "embed": "",
            },
            {
                "name": "Jabu Blue Switch Child Skip",
                "location": JABUS_BELLY,
                "description": `
                                bonk the switch and then jumpslash
                                hold R if cutscenes are off when landing on the switch
                                frame to open door is first frame link's hand is off the ground, leaning left
                                no need to hold z at any point
                                buffer A- button on the final unpause`,
                "tags": [DEKU_STICKS],
                "age": CHILD,
                "embed": "",
                
            },
            {
                "name": "Jabu Blue Switch Adult Skip",
                "location": JABUS_BELLY,
                "description": `
                                frame to open door is first frame link's hand is off the ground, leaning left
                                no need to hold z at any point
                                buffer A-button on the final unpause
                                `,
                "tags": [ITEMLESS],
                "age": ADULT,
                "embed": "https://www.youtube.com/embed/G9cNyW5K8Vc",
                
            },
            {
                "name": "Megaflip w/ bombs to Jabu Switch",
                "location": JABUS_BELLY,
                "description": `Roll, backflip, shieldflick/retarget
                                on big red - from unpause:
                                Frame 1: A+Z+R
                                Frame 2: Z+R+Hold down the entire rest of the way
                                On the 2nd frame that link is entirely inside the explosion: A+Z+R+Down`,
                "tags": [BOMBS, MEGAFLIP],
                "age": ANY_AGE,
                "embed": "https://www.youtube.com/embed/T7A5vm4iXJw",
                
            },
            {
                "name": "Lost Woods Aqua Escape",
                "location": LOST_WOODS,
                "description": "Target around texture shown, 1 ess right, Sidehop left, Backflip, (Slash stick and sidehop)for position, time jumpslash to clip",
                "tags": [ONEHW, TWOHW],
                "age": CHILD,
                "embed": "https://www.youtube.com/embed/D3RSZ1WyB5A",
            },
            {
                "name": "Forest Temple Skip 1st Key with Hover Boots and Chus",
                "location": FOREST_TEMPLE,
                "description": `
                            backwalk off, climb up, and turn around
                            move away from the corner half step or so after climbing up the ledge
                            equip hoverboots after 2nd damage frame
                            hold up-left after equipping
                        `,
                "tags": [HOVER_BOOTS, BOMBCHU],
                "age": ADULT,
                "embed": "https://youtube.com/embed/g5lHRC8kaPw",
            },
            {
                "name": "Forest Temple BK Skip First Person Items",
                "location": FOREST_TEMPLE,
                "description": `
                                Get on the stairs and turn right and face wall
                                easier if you're higher up the stairs

                                master sword setup : shielded horizontal slash
                                sticks: bonk the wall, turn around, swing stick, turn around

                                quickdraw first person item
                                on the same frame: backflip and first person item
                                walk left to clip
                        `,
                "tags": [BOW, HOOKSHOT, BK_SKIP],
                "age": ADULT,
                "embed": "https://youtube.com/embed/nFFwVpiELh0",
            },
            {
                "name": "Forest Temple BK Skip",
                "location": FOREST_TEMPLE,
                "description": `
                                Align with texture
                                backflip
                                pull yourself up
                                with Z: Sidehop left, Roll
                                during roll: release z and repress to clip
                                A to drop
                                face door and sidehop left once
                                run forward
                        `,
                "tags": [ITEMLESS, BK_SKIP],
                "age": ADULT,
                "embed": "https://youtube.com/embed/GOBxO-VOJCY",
            },
            {
                "name": "Forest Temple Skip 1st Key Hover Boots and Bombs",
                "location": FOREST_TEMPLE,
                "description": `
                                backwalk off, climb up, and turn around
                                Pause on 2nd damage frame (2nd frame that link moves)
                                equip hoverboots
                                Hold Up-Left
                        `,
                "tags": [HOVER_BOOTS, BOMBS],
                "age": ADULT,
                "embed": "https://youtube.com/embed/TWyMT0S_duU",
            },
            {
                "name": "Forest Temple Skip Song of Time Block",
                "location": FOREST_TEMPLE,
                "description": `
                            To ledge clip:
                            sidehop right then left again
                            roll and release Z after roll
                            repress z on the ledge grab frame shown to clip in
                        `,
                "tags": [ITEMLESS],
                "age": ADULT,
                "embed": "https://youtube.com/embed/j98GnVeib8Q",
            },
            {
                "name": "Child Forest Temple BK Skip Bombchu",
                "location": FOREST_TEMPLE,
                "description": `
                            vine clip frames:
                            Hold Z
                            1: A+Z
                            2: Z+Down
                            3: Z+Bombchu
                            4+: Z+R+Up`,
                "tags": [BOMBCHU, BK_SKIP, VINE_CLIP],
                "age": CHILD,
                "embed": "https://youtube.com/embed/f0l6W0blyUw",
            },
            {
                "name": "Forest Temple Mega Backflip to Scarecrow",
                "location": FOREST_TEMPLE,
                "description": `
                                get in corner next to switch, 
                                turn around and walk forward to climb up railing
                                turn right and sidestep until links right heel is touching the railing
                                c-up to line up backflip landing zone
                                turn around and megaflip`,
                "tags": [BOMBCHU, MEGAFLIP],
                "age": ANY_AGE,
                "embed": "https://youtube.com/embed/dVfhIBN8Q7E",
            },
            {
                "name": "Forest Temple First Green Block Skip",
                "location": FOREST_TEMPLE,
                "description": "sidehop, roll, get into corner, crouchstab 2x, jumpslash",
                "tags": [ONEHW, TWOHW],
                "age": ADULT,
                "embed": "https://youtube.com/embed/xqUVH-3T9Nw",
            },
            {
                "name": "Forest Temple Block Room to Courtyard",
                "location": FOREST_TEMPLE,
                "description": "Align glitch tick w/ texture shown and jumpslash",
                "tags": [ONEHW, TWOHW],
                "age": ADULT,
                "embed": "https://youtube.com/embed/KW9U3UyDZr4",
                
            },
            {
                "name": "Weirdshot Fire Temple BK Chest",
                "location": FIRE_TEMPLE,
                "description": `see: "Universal Weirshot"
                `,
                "tags": [HOOKSHOT, WEIRDSHOT],
                "age": ADULT,
                "embed": "https://www.youtube.com/embed/IPpPgkgMnPw",
            },
            {
                "name": "Child Statue Climb",
                "location": SPIRIT_TEMPLE,
                "description": `
                    Get ISG. align facing the head on the shoulder, turn left
                    z, take a few side steps down to drop bomb. get back up
                    backflip on big blue.
                    shield drop+2nd backflip on second exhale (watch link's feet or bottom of tunic movement)
                    *make sure weapon is out* side hop up, 3 sidehops left and hold up+jumpslash and shield the landing.
                    (see video, but a few frames worked for me for the jumpslash)
                    get link's head in the wall as much as you can, then backflip
                `,
                "tags": [BOMBS],
                "age": CHILD,
                "embed": "https://www.youtube.com/embed/9llUpjaAUrI",
            },
            {
                "name": "Spirit/Water Temple Bombs BK Skip",
                "location": SPIRIT_TEMPLE,
                "description": `
                Get ISG on door. Z target door. (drop as fast as you can) Shield drop, sidehop, shield drop.
                With shield: backflip on big blue then backflip again. You should be hovering at this point.
                Pull bomb and press a to drop. If 2handed weapon unsheath.
                On big red either unsheath master sword or swing your two hander.
                `,
                "tags": [BOMBS, BK_SKIP, WATER_TEMPLE],
                "age": ANY_AGE,
                "embed": "https://youtube.com/embed/GJOHtcVqUQg",
            },
            {
                "name": "Child Skip King Zora Deku Sticks",
                "location": ZORAS_DOMAIN,
                "description": `Z target right wall on staircase
                            sidehop left, roll and retarget, 1 ess left, hold angle
                            from corner(see video) 2x sidehop right, backflip, sidehop left
                            when stick starts burning out, hold left and walk off the edge
                            jumpslash on first frame the top link's head is below the ledge
                `,
                "tags": [DEKU_STICKS],
                "age": ANY_AGE,
                "embed": "https://www.youtube.com/embed/kqV5v6fUIuk",
            },
            {
                "name": "Shadow Temple No Hovers to Boss Door",
                "location": SHADOW_TEMPLE,
                "description": `from entrance:
                                z target door and turn around
                                run straight forward and jump to platform
                                when land turn around and backwalk off the edge
                                pull yourself back up, ess/shieldturn right run forward and grab next ledge
                                climb up and turn left. megaflip to land on the next platform.
                                ess/shieldturn right and backwalk off the ledge
                                climb up and turn right. run forward and jump forward and slightly to the right
                                Roll foward and target until you align with the boss door
                `,
                "tags": [BOMBCHU, BK_SKIP],
                "age": ANY_AGE,
                "embed": "https://youtube.com/embed/G8ASlsOYLak",
            },
            {
                "name": "Shadow Temple Gate Clip to Boat Master Sword",
                "location": SHADOW_TEMPLE,
                "description": `from corner:
                                target wall 
                                3 sidehop left,
                                2x vertical slash cancel with shield,
                                1 vertical slash no cancel,
                                2x jumpslash
                `,
                "tags": [MASTER_SWORD],
                "age": ADULT,
                "embed": "https://youtube.com/embed/buUV_5gnukM",
            },
            {
                "name": "Shadow Temple BK Skip",
                "location": SHADOW_TEMPLE,
                "description": `Backwalk off edge on 3rd blue
                                hold up to climb up immediately.
                                hold left during climbing animation.
                                You can start pause buffering once link has turned left.
                                On frame once links feet are separated (see video) hold down left and buffer one frame.
                                keep holding down-left and roll
                                press z on ledge clip frame.
                `,
                "tags": [BOMBCHU, BK_SKIP],
                "age": ADULT,
                "embed": "https://youtube.com/embed/VOgoEvUMNBI",
            },
            {
                "name": "Setup for Boatkey",
                "location": SHADOW_TEMPLE,
                "description": `
                                deadhand room
                                get into back right corner
                                2 left sidehop
                                backflip
                                shield/ess turn right
                                roll forward, backflip
                                3ess right
                                megabackflip
                `,
                "tags": [BOMBCHU, BK_SKIP],
                "age": ADULT,
                "embed": "https://youtube.com/embed/EIBctPHYEvE",
            },
            {
                "name": "Distance Megaflip Across Start of Shadow Temple",
                "location": SHADOW_TEMPLE,
                "description": `
                                shield drop on 9th black
                                when link brings the shield up:
                                hold Z+R+Down on the control stick
                                backflip the next frame
                `,
                "tags": [BOMBCHU],
                "age": ADULT,
                "embed": "https://youtube.com/embed/Hcqqj5o-icI",
            },
            {
                "name": "OGC Fairy Strength Block Skip",
                "location": OGC,
                "description": `
                                Get into corner, turn right
                                1 ess right for bomb
                                2 for chu
                `,
                "tags": [BOMBCHU, BOMBS],
                "age": ADULT,
                "embed": "https://youtube.com/embed/CN0MsBqPfFM",
            },
            {
                "name": "DDC Backflip OI Push Block Skip",
                "location": DODONGOS_CAVERN,
                "description": `
                                get bottle out for OI
                                backwalk down from door on the right wall
                                drop down and target the wall where you dropped
                                z+downroll retarget for angle
                                2 sidehop left
                                3 sidehop right
                                backflip OI. cancel ocarina after some time
                                door seems to stay open longer if you wait a bit
                                door will eventually close so you have to go
                `,
                "tags": [BOMBCHU, BOMBS, OI],
                "age": ADULT,
                "embed": "https://youtube.com/embed/CN0MsBqPfFM",
            },
            {
                "name": "Volvagia Quick Kill Weirdshot w/ Bow",
                "location": FIRE_TEMPLE,
                "description": `
                            see: "Universal Weirdshot"
                `,
                "tags": [BOW, HAMMER, WEIRDSHOT],
                "age": ADULT,
                "embed": "https://youtube.com/embed/9zBMVo0dgEs",
            },
            {
                "name": "HESS Clip Into Child Side As Adult Spirit Temple",
                "location": SPIRIT_TEMPLE,
                "description": `
                                break the pots because they will mess up your slide

                                from between the pillars:
                                shield drop bomb, sidehop left shield, drop bomb
                                backflip, shield flick, roll
                                hold Z+R
                                wait for big blue, buffer in your roll then mash A
                                equip hover boots
                                from the corner: hold left on stick, 1 frame release R, 1 frame re-hold R
                                once you stop in the tunnel start running immediately or you'll fall
                `,
                "tags": [HOVER_BOOTS, BOMBS, SUPERSLIDE],
                "age": ADULT,
                "embed": "https://youtube.com/embed/AZhbxW-TCwg",
            },
            {
                "name": "Bow Shoot Bombs From LW to GC",
                "location": GORON_CITY,
                "description": `
                                arrows can clip through the left boulder and shoot the bomb
                `,
                "tags": [BOW, LOST_WOODS],
                "age": ADULT,
                "embed": "https://youtube.com/embed/qIDecQi_Qwc",
            },
            {
                "name": "Pot Push Into DMC From Goron City",
                "location": GORON_CITY,
                "description": `
                                target wall, turn right, backwalk into corner and come to a stop
                                7 frames walking forward, let go of control stick and come to a stop
                                7 frames backwalk, out of the unpause Z+R+Down
                `,
                "tags": [ITEMLESS, DMC],
                "age": CHILD,
                "embed": "https://youtube.com/embed/un_s31uOhlM",
            },
            {
                "name": "Clip into DMC from Goron City Chus",
                "location": GORON_CITY,
                "description": `
                                Target wall behind torch
                                turn left
                                roll into corner
                                with Z: backflip, roll
                                Shield drop chu on 8th red
                                R+Z+Roll on black chu to the right
                `,
                "tags": [BOMBCHU, DMC],
                "age": CHILD,
                "embed": "https://youtube.com/embed/yZcLZ4H6biY",
            },
            {
                "name": "Clip into DMC from Goron City Bombs",
                "location": GORON_CITY,
                "description": `
                                Target wall behind torch
                                turn left
                                roll into corner
                                shield drop bomb
                                with Z: backflip, roll
                                R+Z+Roll on explosion frame
                                R+Z+down on control stick for the rest
                `,
                "tags": [BOMBS, DMC],
                "age": CHILD,
                "embed": "https://youtube.com/embed/BGQS_VSnrtw",
            },
            {
                "name": "Bombs Mega Sidehop Into Darunia's Room",
                "location": GORON_CITY,
                "description": `
                                Target wall, turn right, sidehop, roll and retarget.
                                Press forward to move along fence for angle.
                                Turn around, Roll 2x, shield drop, roll, backflip, z+r+roll on big blue
                                hold down the whole time
                                sidehop 2nd frame link is in the explosion
                `,
                "tags": [BOMBS, MEGA_SIDEHOP],
                "age": CHILD,
                "embed": "https://youtube.com/embed/THbUU1wWTsE",
                
            },
            {
                "name": "Bombchu Mega Sidehop Into Darunia's Room",
                "location": GORON_CITY,
                "description": `
                    target wall, turn right, sidehop right, roll + retarget
                    hold angle and walk forward and let fence push you
                    turn around at the edge and do one roll
                    pull chu, shield drop and roll on 10th red
                    hold right during the roll
                    sidehop on 4th explosion frame (where link is upright)
                `,
                "tags": [BOMBCHU, MEGA_SIDEHOP],
                "age": CHILD,
                "embed": "https://youtube.com/embed/ElAAh5NIZk8",
            },
            {
                "name": "Bombchu Megaflip Demonstration",
                "location": GENERAL,
                "description": `
                                hold Z+R the whole time after shield drop
                                Z+R with no stick input until the backflip:

                                A couple of ways depending on comfort

                                method 1: on 7th black shield drop and roll the next frame
                                method 2: on 8th red shield drop and roll on the same frame

                                backflip on the frame link is leaning back
                `,
                "tags": [BOMBCHU],
                "age": ANY_AGE,
                "embed": "https://youtube.com/embed/Qxu9AYyk7rI",
            },
            {
                "name": "Bombchu Distance Megaflip Demonstration",
                "location": GENERAL,
                "description": `
                            on 9th black:
                            Z+R+A with no input on control stick

                            when link shields the explosion:
                            frame 1: Z+R+Down on control stick
                            frame 2: Backflip
                `,
                "tags": [BOMBCHU],
                "age": ANY_AGE,
                "embed": "https://youtube.com/embed/BAFlskmKSZ8",
            },
            {
                "name": "Bombs Megaflip Demonstration",
                "location": GENERAL,
                "description": `
                                hold Z+R the whole time
                                roll on big red
                                hold down on control stick during the roll
                                you can backflip the first or second frame link is inside the explosion
                `,
                "tags": [BOMBS],
                "age": ANY_AGE,
                "embed": "https://youtube.com/embed/-qzW1NNoc78",
            },
            {
                "name": "Bombs Distance Megaflip Demonstration",
                "location": GENERAL,
                "description": `
                            Z+R+Roll on big blue (no stick input)

                            First frame links shields the damage:
                            frame 1: Z+R+Down
                            frame 2: Z+R+Backflip
                `,
                "tags": [BOMBS],
                "age": ANY_AGE,
                "embed": "https://youtube.com/embed/z9FNVvGRgdA",
            },
            {
                "name": "Universal Weirdshot Bombchu",
                "location": GENERAL,
                "description": `
                            keep holding Z until the end:

                            shield drop chu on 9th red
                            pull hookshot and cancel with shield
                            roll on 1st explosion frame
                            hold down during the roll

                            Exact inputs from unpause on big red:
                            Frame 1: Z+R+Roll
                            Frame 2+: Z+R+Down on control stick until you hit the explosion

                            On unpause from hitting the explosion frame:
                            Frame 1-3: Z+R+Down
                            Frame 4-6: Z+Hookshot+Down
                            Frame 7: Let go of everything
                `,
                "tags": [BOMBCHU, WEIRDSHOT, HOOKSHOT, BOW],
                "age": ADULT,
                "embed": "https://youtube.com/embed/Cq51orFglUg",
            },
            {
                "name": "Universal Weirdshot Bombs",
                "location": GENERAL,
                "description": `
                                keep holding Z until the end:

                                shield drop bomb, roll, backflip
                                pull hookshot and cancel with shield
                                roll on big red

                                Exact inputs from unpause on big red:
                                Frame 1: Z+R+Roll
                                Frame 2+: Z+R+Down on control stick until you hit the explosion

                                On unpause from hitting the explosion frame:
                                Frame 1-3: Z+R+Down
                                Frame 4-6: Z+Hookshot+Down
                                Frame 7: Let go of everything
                `,
                "tags": [BOMBS, WEIRDSHOT, HOOKSHOT, BOW],
                "age": ADULT,
                "embed": "https://youtube.com/embed/V4DpneFDTjM",
            },
            {
                "name": "BOTW As Adult w/ Hookshot and Master Sword",
                "location": BOTW,
                "description": `
                                go to corner
                                turn around
                                4 rolls
                                backflip
                                turn around
                                2 unshielded slashes
                                10 shielded slashes
                                turn right
                                backflip
                                roll

                                weirdshot inputs
                                roll on big red

                                out of unpause from hitting the explosion:
                                Z+R+Down 3 frames
                                Z+Down+Hookshot for 3 frames
                                release everything

                                17 frames holding left on control stick | link yaw value: 0x7ae
                                steady and release hookshot
                `,
                "tags": [MASTER_SWORD, HOOKSHOT],
                "age": ADULT,
                "embed": "https://youtube.com/embed/O4xELdc76PY",
            },
            {
                "name": "Clip Into Bottom of the Well Master Sword",
                "location": KAKARIKO_VILLAGE,
                "description": `
                           align with well (one segment counter clockwise to the ladder)
                            keep angle and get into the front corner of the left post

                            horizontal slash
                            2x sidehop right
                            turn right

                            Z+B+Right on control stick for horizontal slash
                            Z+Down during the swing to backwalk
                            Hold A during the ledge grab to queue up letting go

                            first frame link falls, can't see link's hand - Z+UP
                            the rest of the way: Down+Shield
                            after landing:
                            5ess left or c-up to the second line on the wall
                            sidehop left, jumpslash to land
                `,
                "tags": [MASTER_SWORD, BOTW],
                "age": ADULT,
                "embed": "https://youtube.com/embed/_rKyUrn6txk",
            },
            {
                "name": "Bottom of the Well Actor Deload",
                "location": BOTW,
                "description": `
                                open the door as fast as possible after exiting crawlspace
                                you should come out of the door into the same room you entered from
                                go back through the crawlspace you came from
                                water will be deloaded and you can go crawl to deadhand room
                `,
                "tags": [ITEMLESS],
                "age": CHILD,
                "embed": "https://youtube.com/embed/Y9DnpdHWLhs",
            },
            {
                "name": "Blank A For Bottom of the Well Underwater Chests",
                "location": BOTW,
                "description": `
                    can't have kokiri sword equipped
                    go to crawlspace where it says 'enter' and pull stick out

                    frame 1: A (enter)
                    frame 2: throw deku nut

                    you should be glitched now
                    reset again for 2nd chest

                    note: you can't go to deadhand with blank a
                `,
                "tags": [DEKU_STICKS, "deku nuts"],
                "age": CHILD,
                "embed": "https://youtube.com/embed/Y9DnpdHWLhs",
            },
            {
                "name": "[Alternate] Adult BotW Weirdshot Past Crawlspace Bombs Sticks",
                "location": BOTW,
                "description": `
                                face wall
                                backflip
                                neutral slash
                                turn around
                                shielded slash
                                jumpslash
                                turn left
                                sidehop
                                walk to wall
                                2x backflip
                                roll
                                weirdshot with bombs
                                let go of everything as soon as you are underground
                `,
                "tags": [HOOKSHOT, BOMBS, DEKU_STICKS],
                "age": ADULT,
                "embed": "https://youtube.com/embed/Ju1H81yONyE",
            },
            {
                "name": "Adult BotW Weirdshot Past Crawlspace Chus Sticks",
                "location": BOTW,
                "description": `
                                2x Backflip
                                Jumpslash
                                3x Shielded Slash
                                1ess right
                                2 neutral slash
                                1ess left
                                turn right
                                Sidehop

                                weirdshot inputs:
                                backflip shield flick, roll, roll, backflip, Z+hookshot then shield
                                drop on 9th black then
                                frames for hookshot quickdraw:
                                1: Z+Hookshot 
                                2: Z+Shield

                                4 frames until roll, the frame before the explosion where bombchu doesn't move


                                with hookshot: 17 pauses hold left or start buffering when you're close
                `,
                "tags": [HOOKSHOT, BOMBCHU, DEKU_STICKS],
                "age": ADULT,
                "embed": "https://youtube.com/embed/PillrC3YHTA",
            },
            {
                "name": "Adult BotW Weirdshot Past Crawlspace Bombs Sticks",
                "location": BOTW,
                "description": `
                                bonk
                                swing to break stick
                                turn around 
                                jumpslash
                                roll
                                turn left 
                                sidehop left
                                walk to wall
                                backflip
                                roll
                                weirdshot with bombs (see: universal weirdshot)
                `,
                "tags": [HOOKSHOT, BOMBS, DEKU_STICKS],
                "age": ADULT,
                "embed": "https://youtube.com/embed/IulJd7P04z8",
            },
            {
                "name": "Vine Clip to Deadhand",
                "location": BOTW,
                "description": `
                                frames for clip to get as deep in the water as possible:

                                feet above the brick line (2 climbs up after grabbing the wall)
                                hold Z the whole time:
                                frame 1: A+Z
                                frame 2: Down+Z
                                frame 3: Z
                                frame 4: Z
                                frame 5: Z + Bombchu
                                frame 6 and on: Z+R+UP

                                there's not a lot of time for:
                                Up-leftish and retarget in the water
                                swim under the track
                                up-right out of the water and jumpslash towards the corner of the room
                `,
                "tags": [ITEMLESS],
                "age": ADULT,
                "embed": "https://youtube.com/embed/SGmPuPiSFLo",
            },
            {
                "name": "DMC Fairy Boulder Skip w/ Bombchu",
                "location": DMC,
                "description": `
                    target wall turn left shield drop chu while backwalking
                `,
                "tags": [BOMBCHU],
                "age": CHILD,
                "embed": "https://youtube.com/embed/OrFZVADl1O8",
            },
            {
                "name": "DMC Pot Push To Bolero",
                "location": DMC,
                "description": `
                climb down the bridge on the right, back up, hold angle and walk forward,
                let the right post push you to the left
                backwalk off again
                2 rolls holding up during the roll
                2 sidehops left
                pick up pot
                25 frames sidewalk right or use mark on the wall as a reference

                reference:
                during the sidewalk the mark looks like a T,
                the post part of the T should be on the left lip of the pot

                backwalk from here until the first frame you can see the boards on the ground
                from that frame unpause:

                frame 1: Z+R+Down
                frame 2+ release everything and hold down until you grab, then climb up
                `,
                "tags": [BOMBCHU],
                "age": CHILD,
                "embed": "https://youtube.com/embed/5qZGcaPYKOU",
            },
            {
                "name": "DMC Weirdslide Into Boulder Grotto",
                "location": DMC,
                "description": `
                                target wall and roll into corner
                                backflip, sidehop left, backflip, sidehop left
                                drop bomb and backflip don't let go of z,
                                roll, roll, shieldcancel hookshot or bow
                                do weirdshot but never let go of Z.
                                see: "how to weirdshot"
                `,
                "tags": [BOMBS, HOOKSHOT, BOW, WEIRDSHOT, WEIRDSLIDE],
                "age": ADULT,
                "embed": "https://youtube.com/embed/UtxxHi8Ox0s",
            },
            {
                "name": "Child Light Trial Block Skip",
                "location": GC,
                "description": `
                `,
                "tags": [BOMBCHU],
                "age": CHILD,
                "embed": "https://clips.twitch.tv/embed?clip=FrigidDepressedTitanDoritosChip-yMZMygiNziiIz4e2",
            },
            {
                "name": "Adult Light Trial Block Skip Bombs",
                "location": GC,
                "description": `
                                target wall
                                back away
                                3 ess right
                                get into seam
                                turn around
                                re target
                                A-drop bomb
                                ess left
                `,
                "tags": [BOMBS],
                "age": ADULT,
                "embed": "https://youtube.com/embed/1XOCs1ibRac",
            },
            {
                "name": "Adult Light Trial Block Skip Bombchu",
                "location": GC,
                "description": `
                                target wall
                                back away
                                1 ess right
                                get into seam
                                ess turn right until camera clicks after a second
                                ess up
                                1 ess right
                                pull chu
                `,
                "tags": [BOMBS],
                "age": ADULT,
                "embed": "https://youtube.com/embed/afbmH7fRt9o",
            },
            {
                "name": "Ganon's Castle Barrier Skip Bombchu",
                "location": GC,
                "description": `
                                get isg, line up roughly with the water trial door, turn around and go to the wall
                                turn right, sidehop right, turn right
                                sidehop left, on 2nd frame of sidehop shielddrop chu (keep holding Z+R)
                                on the frame link touches the ground, Z+R+Backflip
                                on the frame link 'freezes' in the air (shield will rotate left a bit) release all inputs
                                once upright, shield drop chu (Z+R+Bombchu)
                                3 frames later hold shield and backflip
                                backflip again
                `,
                "tags": [BOMBCHU],
                "age": ADULT,
                "embed": "https://youtube.com/embed/rXESrlG7nE4",
            },
            {
                "name": "Door of Time Skip w/ Lunge Storage",
                "location": TEMPLE_OF_TIME,
                "description": `
                                inputs for lunge storage:
                                crouch stab
                                Z+A+R (jumpslash with shield landing)
                                let go of everything
                                (input out of unpause or on the same frame) UP + B

                                inputs for skip:
                                go to door, sidehop left, roll+retarget for angle
                                roll into corner.
                                while holding z. sidehop right, roll, sidehop right, sidehop left, roll
                                b+r unsheath, 1ess right, jumpslash
                `,
                "tags": [KOKIRI_SWORD, LUNGE_STORAGE],
                "age": CHILD,
                "embed": "https://www.youtube.com/embed/XV1Bdq0MXNQ",
            },
        ]
    };
}
