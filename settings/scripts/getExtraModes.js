window.getExtraModes = function getExtraModes() {
    const config = window.getConfig();
    const enh = config.CVars.gEnhancements;

    enh.MirroredWorldMode = "0-8";
    enh.RandomizedEnemies = "0-1";
    enh.RandomizedEnemySizes = "0-1";
    enh.ShadowTag = "0-1";

    enh.ExtraTraps = {
        "Ammo": "0-1",
        "Bomb": "0-1",
        "Burn": "0-1",
        "Enabled": "0-1",
        "Ice": "0-1",
        "Kill": "0-1",
        "Knockback": "0-1",
        "Shock": "0-1",
        "Speed": "0-1",
        "Teleport": "0-1",
        "Void": "0-1"
    };

    enh.RandomizedEnemyList = {
        "All": "0-1",
        "Armos": "0-1",
        "Arwing": "0-1",
        "BabyDodongo": "0-1",
        "Bari": "0-1",
        "Beamos": "0-1",
        "BigSkulltula": "0-1",
        "BigStalchild": "0-1",
        "Biri": "0-1",
        "BlackKnuckle": "0-1",
        "BlueTektite": "0-1",
        "Bubble": "0-1",
        "ClubMoblin": "0-1",
        "DarkLink": "0-1",
        "Dinolfos": "0-1",
        "Dodongo": "0-1",
        "FireKeese": "0-1",
        "FloorTile": "0-1",
        "Floormaster": "0-1",
        "FlyingPeahat": "0-1",
        "FlyingPot": "0-1",
        "Freezard": "0-1",
        "Gibdo": "0-1",
        "GohmaLarva": "0-1",
        "Guay": "0-1",
        "IceKeese": "0-1",
        "InvisSkulltula": "0-1",
        "Keese": "0-1",
        "LargeBaba": "0-1",
        "LikeLike": "0-1",
        "Lizalfos": "0-1",
        "MadScrub": "0-1",
        "NormalWolfos": "0-1",
        "PeahatLarva": "0-1",
        "RedTektite": "0-1",
        "Redead": "0-1",
        "Shabom": "0-1",
        "ShellBlade": "0-1",
        "Skulltula": "0-1",
        "SmallBaba": "0-1",
        "SmallStalchild": "0-1",
        "Spike": "0-1",
        "Stalfos": "0-1",
        "Stinger": "0-1",
        "Tailparasan": "0-1",
        "TorchSlug": "0-1",
        "Wallmaster": "0-1",
        "WhiteKnuckle": "0-1",
        "WhiteWolfos": "0-1",
        "WitheredBaba": "0-1"
    };

    return config;
};
