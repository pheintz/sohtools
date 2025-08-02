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
const DMT = "Death Mountain Trail";
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
                "name": "Ice Cavern West Red Ice Bomb Push",
                "location": ICE_CAVERN,
                "description": `
                            line up to the wall left of the red ice
                            sidehop right, roll and retarget after the roll is finished
                            shield drop 2 bombs overhead
                            hold z and backwalk 4 frames
                            let go of z but hold down 1 frame, link turns around
                            re press Z and keep holding down at least 5 frames
                            backflip and backwalk
                                `,
                "tags": [BOMBS],
                "age": ADULT,
                "embed": "https://youtube.com/embed/dU9R5smlQfc", 
            },
            {
                "name": "Ice Cavern East Ice Wall Clip Jumpslash Bomb Push",
                "location": ICE_CAVERN,
                "description": `
                        C-Up a little right of the seam
                        you can check if your angle is right by jumpslashing - link will clip into the wall a little bit
                        sidehop right, overhead shield drop bomb
                        get into seam
                        jumpslash on big blue
                                `,
                "tags": [BOMBS],
                "age": ADULT,
                "embed": "https://youtube.com/embed/8R1Fnn2zTiM",
            },
            {
                "name": "Freezard Room Skip Hookshot",
                "location": ICE_CAVERN,
                "description": `
                                line up with the gate
                                have hookshout third person ready
                                when the freezard charges and pushes you:
                                aim down and move left a bit and hookshot
                                `,
                "tags": [HOOKSHOT],
                "age": ADULT,
                "embed": "https://youtube.com/embed/dU9R5smlQfc",
            },
            {
                "name": "Reverse Ice Cavern w/ Iron Boots",
                "location": ICE_CAVERN,
                "description": `
                                target wall and turn around
                                line up between the X of the shard and the wall
                                backflip and hold left while you fall and for about a second after hitting water
                                let go of everything and float up
                                swim to clip into the last room
                                put on iron boots and open door
                                `,
                "tags": ["Iron Boots"],
                "age": ADULT,
                "embed": "https://youtube.com/embed/Q0Ff25N6JTI",
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
                "name": "5 Chu Hover Into Ice Cavern",
                "location": ZORAS_FOUNTAIN,
                "description": `
                        from right pillar near the sign
                        2x backflip, roll, get isg
                        target the sign, then c-up to set the camera
                        walk forward to break sign

                        hold angle and get into corner
                        backflip, sidehop left, sidhop right, sideroll
                        downroll and start twisted hover until you're on the ledge
                                `,
                "tags": [BOMBCHU],
                "age": CHILD,
                "embed": "https://youtube.com/embed/tizMvSnis_c",
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
                "age": ADULT,
                "embed": "https://youtube.com/embed/jUvkmsHJLaY",
                
            },
            {
                "name": "ZD to LH Jumpslash Clip Sticks",
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
                "name": "ZD to LH Unloaded Water",
                "location": ZORAS_DOMAIN,
                "description": `
                        zora clip, turn around, sidehop left and jumpslash
                        take a second to jumpslash if you need more time to swim

                        come up from the water under the torches in front of zora
                        turn left at the second torch and fall down off the ledge
                        run into the entrance (south/southwest-ish, video shows unloaded area)                                `,
                "tags": [ONEHW, TWOHW],
                "age": ADULT,
                "embed": "https://youtube.com/embed/BsAvkchECjY",
            },
            {
                "name": "Alternate ZR Lower Freestanding Itemless (no octo)",
                "location": ZORAS_RIVER,
                "description": `
                        align wall
                        5 backflips
                        turn right
                        backflip
                        roll + retarget
                        2x sidehop left
                        forward roll (up and a on the same frame)
                                `,
                "tags": [ITEMLESS],
                "age": ADULT,
                "embed": "https://www.youtube.com/embed/6pheqOCSwLw",
            },
            {
                "name": "ZR Lower Freestanding Itemless",
                "location": ZORAS_RIVER,
                "description": `
                            jump onto the corner of the left pillar
                            backwalk off to ledge grab
                            climb up, 2 rolls
                            c-up and align with left side of corner next platform
                            roll and jump
                                `,
                "tags": [ITEMLESS],
                "age": ADULT,
                "embed": "https://youtube.com/embed/rcKcEpwXTZI",
            },
            {
                "name": "Itemless Frestanding Heart Near Domain",
                "location": ZORAS_RIVER,
                "description": `
                                align with wall, turn right
                                backwalk off edge, climb up while holding Z
                                once up, 2x sidehop right, sidehop left
                                run forward
                                `,
                "tags": [ITEMLESS],
                "age": ADULT,
                "embed": "https://youtube.com/embed/Sg6RxMqyIcs",
            },
            {
                "name": "ZR Boulders Skip Child Jumpslash Clip",
                "location": ZORAS_RIVER,
                "description": `
                                get into corner
                                backflip
                                sidehop left, roll + retarget
                                2x sidehop left

                                position such that the grass behind you will push you to the left when you backwalk
                                backwalk off the ledge and climb back up
                                retarget
                                2x sidehop left
                                2ess left
                                unsheath
                                sidehop left
                                jumpslash on the frame the bottom of links hand touches the corner of the grass

                                swim forward and cut the corner of the waterfall to fall down a bit
                                follow the river on the minimap so you can swim upstream far enough
                                `,
                "tags": [ONEHW, DEKU_STICKS],
                "age": ADULT,
                "embed": "https://youtube.com/embed/KrJUuOkbA0c",
            },
            {
                "name": "Bombs Sidehop Into Zoras Domain Waterfall",
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
                "name": "Bombchu Sidehop Into Zoras Domain Waterfall",
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
                "name": "Fire Temple Hookshot Jump Skip Zombie Walk Bunny Hood Edition",
                "location": FIRE_TEMPLE,
                "description": `
                            Version for SoH with bunny hood speed
                            Instructions taken from dotzo video https://www.youtube.com/watch?v=y9oKuPYwBGQ but i'll write them here too.

                            this is to show the visual cues for bunny hood without Z targeting during the hookshot jump

                            Get ledge cancel:
                            Climb up 3rd step, roll, overhead drop bomb and backwalk off
                            2nd fast red flash climb back up with Z and R

                            Fix the camera:
                            Drop a chu on the door on 7th black
                            3rd Explosion Frame: Z + R + C-Up

                            Get ISG.

                            throw a bomb and side hop to hover across the first platform so you keep ledge cancel
                            jump on big blue, red, or explosion frame. Other frames not tested

                            sidehop over the second platform (walk up, turn left, ess left one to get a sidehop angle easily)

                            hookshot across. You can hit the hookshot point by tapping down and letting the hookshot settle.
                            hold z and down during the hookshot or you'll grab the ledge

                            target the hookshot pillar, sidehop right, left and unsheath
                            Z Up and B to forward stab and hold R during the swing to cancel

                            do the steps relatively quickly or the camera will be off:
                            turn right and z target to stick the angle to the pillar, ess left 2

                            then you can wait for the camera to settle and crouch stab

                            drop chu on the 7th red, 1 frame after the brightest flash
                            keep Z held and hold the hookshot button until
                            visual cue: the chu stops moving
                            audio cue: the hookshot clicks

                            keep everything held. now hold down on control stick for 7 Frames
                            visual cue: hookshot lines up halfway up the ring drawn on the hookshot point

                            move stick to neutral for 1 frame

                            let go of everything and hold down on control stick only
                            there's 3 frames where you can switch to up-left from holding down to automatically go in and die

                            <img src="https://i.ibb.co/HDcyjHkP/fireshot.png" alt="fireshot" border="0" />
                            audio cue for switching directions: flame jets from the upstairs room loading in

                            notes:

                            If you mess up and move too early, just run towards the hole you're supposed to die in, you can sidehop in or bonk the wall, or if you're running you'll just die in there and revive

                            main thing is to make sure you touch the central pillar such that the room loads in
                            the trick relies on camera manipulation so if the room is not loading, it's best to retry the setup from the hookshot platform                                `,
                "tags": [BOMBCHU, HOVER_BOOTS],
                "age": ADULT,
                "embed": "https://youtube.com/embed/wfT95HrrxK8",
            },
            {
                "name": "Fire Temple BK Skip 0 Keys Hovers 25 Chus",
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
                "name": "Spirit Temple Silver Block Clip Bombchu Mega Sidehop",
                "location": SPIRIT_TEMPLE,
                "description": `
                                align with block
                                backflip and roll without retarget, ess turn right
                                retarget and backwalk into corner

                                shield drop chu on 9th black
                                roll next frame, hold right during the roll
                                sidehop right when you hit the bomb

                                turn left, backup a bit and then run forward                                `,
                "tags": [BOMBCHU, ONEHW, TWOHW],
                "age": ADULT,
                "embed": "https://youtube.com/embed/mbCzNn1BdZE",
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
                "name": "Water Temple Glitchless Jump Boulder Waterfall",
                "location": WATER_TEMPLE,
                "description": `
                            from door open
                            2 sidehops left, roll and retarget
                            2 sidehops right, 1 left, roll and retarget
                            2 sidehops right, start running forward
                            keep holding up and roll`,
                "tags": [ITEMLESS],
                "age": ADULT,
                "embed": "https://youtube.com/embed/RU1Y8ECQRWs",
            },
            {
                "name": "Hookshotless Water Temple Moving Platforms Room HESS, Chus, Hoverboots",
                "location": WATER_TEMPLE,
                "description": `
                            for angle backflip against the ledge, releasing Z in the air
                            retarget, feet outside of the waterfall
                            let camera reset
                            as soon as entire moving platform (not counting the part inside the water) is on screen pull bombchu

                            hess down-left angle
                            retarget once or twice to turn during hess. don't go for a straight line

                            Once against the platform
                            put on hover boots
                            frame 1: Z + Down Right
                            frame 2: Down Right + A

                            hold down right while climbing up

                            after turning when you climb up:
                            frame 1: C-UP
                            frame 2-8: Right on control stick
                            frame 9: A
                            frame 10: Z + Up

                            HESS Frames:
                            1: shield drop 9th black
                            2: Z + R
                            3: Z + R  + Roll

                            hold ess down-right during roll, releasing other inputs
                            Z + R + ESS position first frame inside the explosion                            `,
                "tags": [BOMBCHU, HOVER_BOOTS],
                "age": ADULT,
                "embed": "https://youtube.com/embed/RU1Y8ECQRWs",
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
                "name": "Open Water Temple With Hookshot Only",
                "location": LAKE_HYLIA,
                "description": `
                            line up with pillar, hold forward and R
                            when shield stops you from moving:
                            turn around, 4 sidehops left, 1 right, roll without retargeting                                `,
                "tags": [HOOKSHOT],
                "age": ADULT,
                "embed": "https://youtube.com/embed/RU1Y8ECQRWs",
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

                                watch the top of the screen where the angle of the water texture changes (check video @ 32 seconds, the water texture near the glitch tick).
                                the first frame that corner goes off screen switch to holding Z and Right and hold until you hit the water

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
                "name": "Forest Temple Entry Bombchu Shuffle Method",
                "location": SACRED_FOREST_MEADOW,
                "description": `
                            get isg
                            get into gossip stone corner and align with right wall
                            5x sidehop right, backflip, turn right
                            4x sidehop right
                            2ess right

                            start ess shuffle

                            c-down out of the shuffle
                            backflip and wait a frame and shield drop chu

                            5 more hovers

                            you can ess shuffle or do the regular turn method for all the next hovers
                            (pull chu, walk up-right, 3 frames idle, hold down on control stick, backflip + R)

                            do one more except just backflip out of it without a bombchu
                `,
                "tags": [BOMBCHU],
                "age": ANY_AGE,
                "embed": "https://youtube.com/embed/GNYdiQWnoGs",
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
                "name": "GTG Block Skip Bombchu Death Clip",
                "location": GERUDO_TRAINING_GROUNDS,
                "description": `
                            get isg, low health, and a fairy
                            backflip onto box and walk forward a bit so you dont roll off
                            2 twisted hovers
                            2 ess hovers
                            reset camera with first person item or by targeting the bombchu

                            frame 1: shield drop 10th black
                            frame 2: Z + B
                            frame 3, 4: Wait
                            frame 5: Press A to jumpslash
                `,
                "tags": [BOMBS, GATE_CLIP],
                "age": ANY_AGE,
                "embed": "https://youtube.com/embed/wzF3y5CYsUg",
            },
            {
                "name": "GTG Block Skip Hammer",
                "location": GERUDO_TRAINING_GROUNDS,
                "description": `
                                facing the invisible wall, get into left corner facing the left wall
                                backflip, shield flick, roll
                                turn left, backflip, turn right
                                2 ess left, roll, z target the wall
                                5 ess left (dont z target or change camera angle)
                                crouch stab wall with hammer,
                                equip hover boots when link starts moving back
                                hold right                `,
                "tags": [HAMMER, HOVER_BOOTS],
                "age": ADULT,
                "embed": "https://youtube.com/embed/8BmiHuD0BE8",
            },
            {
                "name": "GTG Block Skip Inverted Camera",
                "location": GERUDO_TRAINING_GROUNDS,
                "description": `
                                left corner near door
                                down roll and retarget
                                2 ess right

                                ! important ! DO NOT PRE HOLD Z
                                inverse camera angle left: (z, no inputs 3 frames, left, z)

                                frame 1: no inputs
                                frame 2: Z
                                frame 3, 4, 5: no inputs
                                frame 6: left
                                frame 7: hold z to keep angle

                                don't forget to shield flick during the setup
                                bombs: backflip, sidehop right, megaflip
                                chus: 2x backflip, sidehop right, shieldflick, megaflip

                                equip hoverboots in the air
                                hold right

                                if you're coming up short it's because you forgot to flick shield before rolling on the megaflip
                                `,
                "tags": [BOMBCHU, BOMBS, HOVER_BOOTS],
                "age": ADULT,
                "embed": "https://youtube.com/embed/dD_pubh4Hbw",
            },
            {
                "name": "Distance Megaflip Gerudo Valley Bridge",
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
                "age": ADULT,
                "embed": "https://youtube.com/embed/sdOLkSfFevY",
            },
            {
                "name": "GV Bridge Sideroll Megaflip Bombchu",
                "location": GERUDO_VALLEY,
                "description": `
                            it's rough and you can eyeball it but here's a setup

                            get isg
                            align with pillar, 4ess left

                            hold angle and walk on the right side of the post and let it push you right
                            4x downroll, backwalk all the way
                            sidehop left, sideroll without retarget, backwalk all the way
                            sidehop left, backwalk all the way,
                            pull chu and walk downright (somewhere between 30 and 50 on stick to get a sideroll)
                            shield drop and roll on 8th black, megaflip like normal
                `,
                "tags": [BOMBCHU],
                "age": ADULT,
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
                "name": "Skip Gerudo Valley Gate Megaflip",
                "location": GERUDO_VALLEY,
                "description": `
                    Line up in the right corner, move a little to the left so the camera doesn't get weird.

                    Buffer inputs or you'll talk to guard if you're in range

                    Bombs: Backflip, turn around, roll, shield drop bomb, backflip, megaflip
                    Chus: Backflip, turn around, megaflip
                `,
                "tags": [BOMBS, BOMBCHU],
                "age": ANY_AGE,
                "embed": "https://youtube.com/embed/i2At5Fg1Hz8",
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
                "name": "Child BK (231) Skip",
                "location": DEKU_TREE,
                "description": `
                    from the upper door in deku
                    align on the left side of the left wall near the corner
                    2x sidehop right, walkforward a bit and roll
                    sidehop left, sideroll
                    sidehop right, sidehop left, sideroll
                    backflip, sidehop left, backflip
                    megaflip

                    in the air:
                    hold right the whole time
                    pull stick out
                    when the edge of links left hand lines up with the edge of the water texture
                    let go of everything and jumpslash`,
                "tags": [BK_SKIP],
                "age": CHILD,
                "embed": "https://youtube.com/embed/LLoVxPkepD4",
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
                "description": `
                    ISG, target stump right of twins house doorway
                    hop into the corner behind the house

                    backflip, sidehop left, backwalk until you stop
                    sidehop left and immediately release Z before you land
                    down left turn and backflip
                    turn around and z target the left stump and sidewalk all the way left
                    two sidehops right, turn around, 1ess left

                    the second backflip and the roll take some timing
                    I count "one oneth" and cut off there
                    megaflip off skul damage

                    sidehop near the right turn headed to deku tree
                    cancel isg
                    target the angled wall on the left and turn left and backwalk
                `,
                "tags": [MASTER_SWORD, TWOHW],
                "age": ADULT,
                "embed": "https://youtube.com/embed/5m5F8ortxM0",
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
                "name": "Explosiveless Clip Into Dodongo Head",
                "location": DODONGOS_CAVERN,
                "description": `
                            backwalk, climb up, turn right, backwalk
                            jumpslash, sidehop left, 2ess left
                            sidehop right
                            climb up, walk up to the curb and target it

                            jumpslash, turn left, backflip (dont release Z)
                            downroll and hold right during the roll with Z held

                            for the easy open (turn right then open the door):
                            hold right for the first 2 frames link's feet aren't touching the ground, then switch to neutral stick

                            pull stick/bgs in the air, then jumpslash 2nd frame links head is clipped in the door

                            if you don't get the easy open you can wiggle to try to get position
                                `,
                "tags": [BOMBCHU],
                "age": ADULT,
                "embed": "https://youtube.com/embed/Q3bNq_az6aM",
            },
            {
                "name": "DDC Lobby Switch Beamos Recoil Jump",
                "location": DODONGOS_CAVERN,
                "description": `
                            get to wall with beamos beam as close to the ledge as you can

                            start ess shuffle: during ess turn in any direction hold Z and keep holding ESS direction

                            minimum 4 frames holding ESS and Z to be in the shuffle

                            once you're in shuffle state and the beam is close enough:
                            frame 1: Z and Down
                            frame 2: Z and R
                            Frame 3: Z R and Backflip (control stick up-left)
                                `,
                "tags": [ITEMLESS],
                "age": ANY_AGE,
                "embed": "https://youtube.com/embed/iTuFxTjvuq8",
            },
            {
                "name": "Jabu Map Chest w/ QPA and Hovers",
                "location": JABUS_BELLY,
                "description": `
                                You can get QPA on the teeth in the start of jabu or on a chest
                                get QPA and ISG

                                from the first corner on the left:
                                2x sidehop right, turn right, sidehop right

                                staircase setup for chus:
                                start sidehop and then pull chu 1 frame later and shield drop as soon as possible
                                when links feet hit the ground backflip with Z and R
                                release R while link appears to be frozen so you can drop the next chu immediately when links feet are upright
                                as soon as next chu drops backflip with Z and R again

                                Z target the tentacle to unlock your turning, turn facing parallel to the wall and z target

                                the first chu to start the side hovers cannot be dropped on the first frame available, buffer at least one frame to avoid throwing it on the wall

                                turn parallel with wall, do twisted hovers until you're on top of the tentacle
                                it might be a different number of hovers than the video depending on what frames you drop your chus
                                `,
                "tags": [DEKU_STICKS],
                "age": CHILD,
                "embed": "https://youtube.com/embed/MEFXWAWeAJ0",
            },
            {
                "name": "Jabu Octo QPA for Cubes or Tentacles",
                "location": JABUS_BELLY,
                "description": `
                                press A on the same frame the rock hits to get putaway interrupted
                                jump slash on the teeth, if you lose your stick you have glitched damage value
                                `,
                "tags": [DEKU_STICKS],
                "age": CHILD,
                "embed": "https://youtube.com/embed/MEFXWAWeAJ0",
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
                "name": "Biri Hover to Lower the Platform in JJB",
                "location": JABUS_BELLY,
                "description": `
                            get isg and get into the corner
                            Z and R
                            after the biri hits the shield spam backflips with Z and R held
                            the camera will reset automatically once you're high enough
                        `,
                "tags": [ITEMLESS],
                "age": ADULT,
                "embed": "https://youtube.com/embed/j7azpD8x_is",
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
                "name": "Lost Woods Aqua Escape Child",
                "location": LOST_WOODS,
                "description": "Target around texture shown, 1 ess right, Sidehop left, Backflip, (Slash stick and sidehop)for position, time jumpslash to clip",
                "tags": [ONEHW, TWOHW],
                "age": CHILD,
                "embed": "https://www.youtube.com/embed/D3RSZ1WyB5A",
            },
            {
                "name": "Lost Woods Aqua Escape Adult",
                "location": LOST_WOODS,
                "description": `
                    align with the pillar as left as possible
                    climb up, turn right
                    swing and hold ess up while falling
                    as soon as the ripples are gone press A then swing one frame later

                    don't press A too early or late or it won't work

                    works with master sword
                `,
                "tags": [ONEHW, TWOHW],
                "age": ADULT,
                "embed": "https://youtube.com/embed/x9TPHd1YhDE",
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
                "name": "Forest Temple Shuffle Sidehop Jumpslash to Courtyard Chest and GS",
                "location": FOREST_TEMPLE,
                "description": `
                            climb up on the left
                            C-Up and aim toward first brick from the top wall
                            start ESS shuffle
                            turn down-right from shuffle
                            sidehop up out of shuffle and hold up
                            jumpslash 2nd frame you can see the corner of the upper ledge
                        `,
                "tags": [ONEHW, TWOHW],
                "age": ANY_AGE,
                "embed": "https://youtube.com/embed/dFa6wSTjzx4",
            },
            {
                "name": "Forest Temple Courtyard Hookshot Vines Near Well Switch",
                "location": FOREST_TEMPLE,
                "description": `
                            A nice time save. Position is very rough.
                            backflip, flick, roll, aim up
                        `,
                "tags": [HOOKSHOT],
                "age": ANY_AGE,
                "embed": "https://youtube.com/embed/CyhTYaKWmzY",
            },
            {
                "name": "Forest Lobby GS Jumpslash",
                "location": FOREST_TEMPLE,
                "description": `
                            if you're broke you can use this method

                            turn right after targeting the wall
                            2 ess left
                            keep Z held and walk up left to grab vines and retain angle
                        `,
                "tags": [ONEHW, TWOHW],
                "age": ANY_AGE,
                "embed": "https://youtube.com/embed/uiwUNBKW3jw",
            },
            {
                "name": "Forest Skip to Basement w/ Hoverboots Megasidehop Deku Stick",
                "location": FOREST_TEMPLE,
                "description": `
                            target wall, sidehop left sideroll releasing target, 3 ess left
                            jumpslash clip through, turn around
                            3 frames backwalk, 4ess right
                            inverted camera*
                            equip hoverboots, pull bomb,
                            roll on big blue
                            hold right mash A during the roll and  to mega sidehop

                            unequip hoverboots frame link's head is below the balcony floor
                            release everything and start to pull stick out
                            wait 10 frames or so (big window), link needs to be below the ground of upstairs

                            visual cue: elevator shaft will load in the bottom of the screen

                            equip hoverboots and jumpslash on the same frame

                            *for inverted camera:

                            1 frame z
                            3 frames nothing
                            1 frame down
                            re press Z and hold

                            with master sword do one horizontal slash interrupted by shield instead of the 3 backwalk frames
                            `,
                "tags": [BOMBS, HOVER_BOOTS],
                "age": ANY_AGE,
                "embed": "https://youtube.com/embed/qbVh-BVVWOc",
            },
            {
                "name": "Forest Temple Courtyard Moon Jump Skip 1st Key",
                "location": FOREST_TEMPLE,
                "description": `
                        equip iron boots 1 frame before grabbing vines
                        setup is not required but do 1ess right

                        hold up-right to get around the corner then just up
                        you have tons of time so it doesn't really matter
                        `,
                "tags": [IRON_BOOTS, HOOKSHOT],
                "age": ANY_AGE,
                "embed": "https://youtube.com/embed/7tEdOkPHjnk",
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
                "name": "Sideroll Megaflip Forest Balcony to Scarecrow",
                "location": FOREST_TEMPLE,
                "description": `
                                get isg
                                climb up balcony, turn right, without retargeting 1ess right
                                pull chu, hold Z, walk downleft enough to down-sideroll, around 30-50 stick value
                                shield drop and roll on 8th black
                                `,
                "tags": [BOMBCHU, MEGAFLIP],
                "age": ANY_AGE,
                "embed": "https://youtube.com/embed/G0TCBAVcdxo",
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
                "name": "Glitchless Skip Fire Temple Push Block",
                "location": FIRE_TEMPLE,
                "description": `
                            climb up
                            targeted horizontal slash (z+b+right)
                            shield cancel the slash
                            sidehop left, turn right
                            c-up and move the camera right a bit
                            forward roll and hold left
                `,
                "tags": [MASTER_SWORD],
                "age": ADULT,
                "embed": "https://youtube.com/embed/1zJCmzz2fkA",
            },
            {
                "name": "Child Statue Climb",
                "location": SPIRIT_TEMPLE,
                "description": `
                    Get ISG. align facing the head on the shoulder, turn left
                    z, take a few side steps down to drop bomb. get back up
                    backflip on big blue.
                    do one more vertical hover
                    side hop up to the platform
                    *make sure weapon is out*
                    3 sidehops left and hold up+jumpslash and shield the landing
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
                "name": "Spirit Temple 2nd Crawlspace as Adult EPG",
                "location": SPIRIT_TEMPLE,
                "description": `
                        to get EPG:

                        from torches room align on the door
                        frame 1: shield drop chu
                        frame 2: do nothing
                        frame 3: vertical slash

                        open the door the first frame you take damage

                        put away sword (you can pull first person item)
                        turn around, then z target, sidehop left and roll

                        EPG is set.

                        void out with torch clip. on respawn turn and aim on the corner.
                        Up + Roll
                        watch links feet
                        the first frame BOTH of links feet are touching the void zone:
                        jumpslash

                        with bomb, get as far away from door as possible where you can still open it
                        A-Drop bomb and open on the first damage frame
                `,
                "tags": [BOMBS, BOMBCHU, HOOKSHOT],
                "age": ADULT,
                "embed": "https://youtube.com/embed/Q3bNq_az6aM",
            },
            {
                "name": "Spirit 1st Child Crawlspace as Adult w/ Bombchu",
                "location": SPIRIT_TEMPLE,
                "description": `
                        target pillar right of the crawlspace on the left side
                        3x sidehop sideroll retarget
                        sidehop right and backwalk into corner

                        frame 1: Shield drop bombchu 9th black
                        frame 2: Do nothing
                        frame 3: Shield+A+Roll
                        hold left during the roll

                        first frame link's shield is out:
                        Hold R Only

                        line up glitch tick / hookshot with the top crease of the pillar
                        megaflip with bombchu

                        sidehop left after landing
                        `,
                "tags": [BOMBCHU],
                "age": ADULT,
                "embed": "https://youtube.com/embed/gvtW6C5AVuc",
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
                "name": "Shadow Boat GS With Ground Jump",
                "location": SHADOW_TEMPLE,
                "description": `
                                gate clip using your preferred method, try to align with wall
                                back away from wall and quick shield drop a bomb and get a ground jump stored
                                turn around and go to the boat side of the fence against the wall, turn left
                                3ess right, ground jump and hold up,
                                when you climb up you'll be floating on the right, so just walk to the left
                `,
                "tags": [BOMBS],
                "age": ADULT,
                "embed": "https://youtube.com/embed/jheVehYusb8",
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
                "name": "Shadow Temple BK Skip Nut Bombchu",
                "location": SHADOW_TEMPLE,
                "description": `
                            get ISG
                            get into left corner and align with door
                            turn around, 1ess right

                            cancel isg

                            frame 1: shield drop chu
                            frame 2: nut

                            wait for explosion

                            explosion frame 1 and 2: do nothing
                            explosion frame 3, 4, 5: down-right notch
                            explosion frame 6: press Z to ledge clip
                `,
                "tags": [BOMBCHU, BK_SKIP],
                "age": ADULT,
                "embed": "https://youtube.com/embed/gDaSYaw-zOE",
            },
            {
                "name": "[Alternate] Faster Boatkey",
                "location": SHADOW_TEMPLE,
                "description": `
                        back left corner
                        backflip
                        3x sidehop right
                        roll + retarget
                        turn right
                        1ess left
                        megaflip
                        down+z in the air

                        let go of everything after clip

                        after landing
                        hold z and walk down-left notch off ledge

                        climb back up, turn right, sidehop left

                        up+a roll to jump
                        roll 2x
                        2ess left, turn around

                        megaflip:
                        bombs: drop, roll, backflip
                        chus: roll backflip shieldflick

                        turn downleft, run forward
                `,
                "tags": [BOMBCHU, BK_SKIP],
                "age": ADULT,
                "embed": "https://youtube.com/embed/CTcKAwgbigA",
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
                "name": "Darunia Statue Clip A-Slide W/ Bombs",
                "location": GORON_CITY,
                "description": `
                        target wall, turn left, and walk into corner
                        instant drop bomb, backflip roll
                        roll on big blue, red, or explosion frame
                        roll with Z and R and hold down during the r
                `,
                "tags": [BOMBS, DMC],
                "age": CHILD,
                "embed": "https://youtube.com/embed/nNvnVbKBs0c",
            },
            {
                "name": "Darunia Statue Clip Bombchu",
                "location": GORON_CITY,
                "description": `
                        target wall, backflip into corner, 1 neutral roll
                        shield drop chu and roll with Z and R
                        hold left once link's shield is out
                `,
                "tags": [BOMBCHU, DMC],
                "age": CHILD,
                "embed": "https://youtube.com/embed/6BGX_u8c3oc",
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
                "name": "Darunia Pot Push Shuffle Method",
                "location": GORON_CITY,
                "description": `
                        line up with wall + get a pot
                        sidewalk left
                        stop in the corner, turn left
                        start ess shuffle
                        right on control stick
                        roll and hold right the next frame
                        jumpslash when clipped through the wall
                        `,
                "tags": [ITEMLESS, DMC],
                "age": CHILD,
                "embed": "https://youtube.com/embed/h2jYyYhCzkk",
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
                "name": "BOTW Backshot Master Sword Setup",
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
                "name": "Clip Into BotW Bombchu Ledge Clip",
                "location": KAKARIKO_VILLAGE,
                "description": `
                            backwalk off ledge and climb up
                            2ess right
                            2 sidehop left

                            pull bombchu and start backwalking one frame later
                            backwalk off ledge
                            climb back up and turn left
                            sidehop right, left, and roll
                            Z on ledge grab frame to ledge clip
                            keep Z held to retain the angle
                `,
                "tags": [BOMBCHU, BOTW],
                "age": ADULT,
                "embed": "https://youtube.com/embed/Hk0dRNLgTLw",
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
                                backflip
                                shield flick
                                roll
                                weirdshot with bombs, dropping the bomb overhead for the weirdshot

                                out of unpause from hitting the explosion:
                                Z+R+Down 3 frames
                                Z+Down+Hookshot for 3 frames
                                release everything

                                17 frames holding left on control stick | link yaw value: 0x7ae
                                steady and release hookshot
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
                "name": "DMT Wall GS Lunge Storage",
                "location": DMT,
                "description": `
                        for sticks get a broken stick
                        get lunge storage (swing + up on the same frame next to a ledge, notice link looks like he's falling backwards)
                        align with left side of the bombable wall
                        side hop right, left, right, left,
                        jumpslash
                        `,
                "tags": [MASTER_SWORD, TWOHW],
                "age": ADULT,
                "embed": "https://youtube.com/embed/ByAsSAozcU0",
            },
            {
                "name": "DMT Chest Jumpslash Clip",
                "location": DMT,
                "description": `
                    go above the bombable wall and backwalk off the edge, can be finicky make sure you have enough backwards velocity
                    climb back up, sidehop right and jumpslash
                    a ton of locations will clip you through,
                    make sure if using sticks to hold shield the landing or you'll get knocked out if you hit the chest or wall
                `,
                "tags": [MASTER_SWORD, TWOHW],
                "age": ADULT,
                "embed": "https://youtube.com/embed/_N6I1gyorDE",
            },
            {
                "name": "DMT Lower Boulder GS Jumpslash Clip",
                "location": DMT,
                "description": `
                    kill the GS
                    get into left corner, sidehop right and sideroll, releasing target
                    swing weapon
                    z target the item and jumpslash

                    doesn't work with sticks
                `,
                "tags": [MASTER_SWORD, TWOHW],
                "age": ADULT,
                "embed": "https://youtube.com/embed/8Cvix--ClTE",
            },
            {
                "name": "DMT Chest Hookshot Clip",
                "location": DMT,
                "description": `
                    get into the left corner between where the two boulders are above the bombable wall

                    backflip, 3ess left, sidehop right
                    pull hookshot and you'll be able to see through the ground
                `,
                "tags": [HOOKSHOT],
                "age": ADULT,
                "embed": "https://youtube.com/embed/cdRp1Q_hdk0",
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
                "name": "Light Trial Block Skip Superslide",
                "location": GC,
                "description": `
                            align with wall left of the strength block
                            sidehop right and roll releasing target
                            let the roll fully finish before retargeting

                            backwalk far enough away, past the stairs and enough room to do sidehops
                            superslide with 2 bombs (roll on big blue on the first bomb and mash A)
                            while sliding release z and hold Up and R

                            for child: after clipped, roll and sidehop left out of the roll
                `,
                "tags": [BOMBS],
                "age": ANY_AGE,
                "embed": "https://youtube.com/embed/-mxbSjpOHFU",
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
            {
                "name": "Itemless Child Door of Time Skip",
                "location": TEMPLE_OF_TIME,
                "description": `
                                target corner
                                sidehop right, roll and retarget
                                downroll and retarget
                                get into door corner and backflip
                                downroll to the left and hold down
                                frame link's head is barely on the bottom left (same as twisted hover frame):
                                 Down + A to sidehop
                                keep holding Z and down until link's hand
                                release everything and buffer 2 frames (visual cue: door of time corner and clipped)
                                hold Z for three frames (visual cue: black out of bounds on bottom of screen)
                                hold Z and left for the rest                `,
                "tags": [ITEMLESS],
                "age": CHILD,
                "embed": "https://youtube.com/embed/RG1-rqV0OjU",
            },
        ]
    };
}
