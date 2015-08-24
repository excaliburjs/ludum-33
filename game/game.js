var Config = {
    PlayerCellSpawnX: 10,
    PlayerCellSpawnY: 19,
    MonsterHealth: 30,
    MonsterWidth: 48,
    MonsterHeight: 48,
    MonsterSpeed: 200,
    MonsterWalkFrameSpeed: 100,
    MonsterAttackRange: 90,
    MonsterDashSpeed: 700,
    MonsterDashDuration: 700,
    MonsterDashCooldown: 10000,
    CloseMonsterAttackRange: 50,
    MonsterProgressSize: 200,
    MonsterSpecialProgressSize: 125,
    MonsterAttackTime: 300,
    MonsterAttackCooldown: 500,
    KnockBackForce: 200,
    BloodMaxAmount: 300,
    BloodMinFriction: 0.15,
    BloodMaxFriction: 0.40,
    BloodXYVariation: 6,
    BloodSplatterAngleVariation: ex.Util.toRadians(40),
    BloodSplatterAngleModOverTime: 0.05,
    BloodSplatterBackSplashAmount: 0.15,
    BloodSplatterBackSplashVelocityModifier: 0.6,
    BloodVelocityMin: 10,
    BloodVelocityMax: 40,
    RedVignetteDuration: 500,
    MonsterDamageCameraShakeDuration: 300,
    CameraElasticity: 0.1,
    CameraFriction: 0.5,
    CameraShake: 0,
    CameraShakeDuration: 0,
    // Spawn interval
    HeroSpawnInterval: 10000,
    HeroSpawnIntervalEasy: 7500,
    HeroSpawnIntervalMed: 6000,
    HeroSpawnIntervalHard: 4000,
    // the thresholds where we decrease the spawn interval
    EasyThreshold: 10,
    MedThreshold: 20,
    HardThreshold: 30,
    // Max heroes to spawn at once
    HeroSpawnPoolMax: 5,
    // How much health a hero has
    HeroHealth: 3,
    // Hero speed (in px/s)
    HeroSpeed: 100,
    // Hero with loot speed (in px/s)
    HeroFleeingSpeed: 80,
    // The cooldown amount for a hero's attack
    HeroAttackCooldown: 1500,
    // The maximum distance a hero will aggro to the monster
    HeroAggroDistance: 150,
    HeroMeleeRange: 30,
    HeroStunnedTime: 100,
    // Amount of gold heroes can carry
    TreasureStealAmount: 1,
    // Amount of gold in each treasure stash
    TreasureHoardSize: 5,
    // Treasure progress indicator width (in px)
    TreasureProgressSize: 600
};
var Resources = {
    AxeSwing: new ex.Sound('sounds/axe-swing.wav'),
    AxeSwingHit: new ex.Sound('sounds/axe-swing-hit-2.wav'),
    BloodSpatter: new ex.Sound('sounds/hero-slain.wav'),
    HeroSwing: new ex.Sound('sounds/hero-swing.wav'),
    AnnouncerDefend: new ex.Sound('sounds/defend.wav'),
    Fireball: new ex.Sound('sounds/fireball.wav'),
    SoundMusic: new ex.Sound('sounds/music.mp3'),
    GameOver: new ex.Sound('sounds/fail.mp3'),
    TextureShift: new ex.Texture("images/shift.png"),
    TextureVignette: new ex.Texture("images/vignette.png"),
    TextureHero: new ex.Texture("images/hero.png"),
    TextureHeroLootIndicator: new ex.Texture("images/loot-indicator.png"),
    TextureMonsterDown: new ex.Texture("images/minotaurv2.png"),
    TextureMonsterRight: new ex.Texture("images/minotaurv2right.png"),
    TextureMonsterUp: new ex.Texture("images/minotaurv2back.png"),
    TextureMonsterAim: new ex.Texture("images/aiming.png"),
    TextureMonsterCharge: new ex.Texture("images/fireball.png"),
    TextureTreasure: new ex.Texture("images/treasure.png"),
    TextureTreasureEmpty: new ex.Texture("images/treasure-empty.png"),
    TextureTreasureIndicator: new ex.Texture("images/treasure-indicator.png"),
    TextureMonsterIndicator: new ex.Texture("images/mino-indicator.png"),
    TextureMap: new ex.Texture("images/map.png"),
    TextureWall: new ex.Texture("images/wall.png"),
    TextureTextDefend: new ex.Texture("images/text-defend.png"),
    TextureBloodPixel: new ex.Texture("images/blood-pixel.png"),
    TextureBloodPixelGreen: new ex.Texture("images/blood-pixel-green.png"),
    TextureHeroDead: new ex.Texture("images/hero-dead.png"),
    TextureHeroDead2: new ex.Texture("images/hero-dead-2.png"),
    TextureHeroDead3: new ex.Texture("images/hero-dead-3.png"),
    TextureHeroDead4: new ex.Texture("images/hero-dead-4.png"),
    TextureGameOverBg: new ex.Texture("images/game-over-bg.png"),
    TextureGameOverSlain: new ex.Texture("images/game-over-slain.png"),
    TextureGameOverHoard: new ex.Texture("images/game-over-hoard.png"),
    TextureGameOverRetry: new ex.Texture("images/try-again.png")
};
var Util = (function () {
    function Util() {
    }
    Util.pickRandom = function (arr) {
        return arr[ex.Util.randomIntInRange(0, arr.length - 1)];
    };
    return Util;
})();
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Map = (function (_super) {
    __extends(Map, _super);
    function Map(engine) {
        _super.call(this, engine);
        this._damageEffectTimeLeft = 0;
        this._takingDamage = false;
        this._survivalTimer = 0;
        this._cameraVel = new ex.Vector(0, 0);
        // exported from Tiled JSON
        this._walls = [179, 179, 179, 179, 179, 179, 179, 179, 179, 186, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 187, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 179, 179, 179, 179, 292, 293, 293, 179, 179, 179, 179, 179, 179, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 179, 179, 179, 179, 179, 179, 179, 179, 509, 179, 179, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 179, 179, 179, 179, 179, 179, 179, 179, 179, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 179, 179, 179, 179, 179, 179, 509, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 291, 179, 179, 179, 179, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 179, 179, 179, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 291, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 185, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 185, 739, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1131, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 739, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1131, 183, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 183, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 179, 179, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 291, 179, 179, 179, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 179, 179, 179, 179, 179, 179, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 179, 179, 179, 179, 509, 179, 179, 179, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 291, 179, 179, 179, 179, 179, 179, 179, 179, 179, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 179, 179, 179, 179, 295, 179, 179, 179, 179, 179, 179, 179, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 179, 179, 179, 179, 179, 296, 179, 179, 179, 179, 179, 179, 179, 179, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 179, 179, 179, 179, 179, 179, 300, 179, 179, 179, 179, 298, 299, 179, 179, 179, 188, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 189, 179, 179, 179, 179, 179, 179, 179, 179, 179];
        this._treasures = [];
    }
    Map.prototype.damageEffect = function () {
        this._takingDamage = true;
        this._vg.setDrawing("red");
        this.camera.shake(3, 3, 200);
        this._damageEffectTimeLeft = Config.RedVignetteDuration;
    };
    Map.prototype.onInitialize = function (engine) {
        this._map = new ex.Actor(0, 0, 960, 960);
        this._map.anchor.setTo(0, 0);
        this._map.addDrawing(Resources.TextureMap);
        this.add(this._map);
        // vignette
        this._vg = new ex.UIActor(0, 0, game.getWidth(), game.getHeight());
        var blackVignette = Resources.TextureVignette.asSprite().clone();
        var redVignette = Resources.TextureVignette.asSprite().clone();
        redVignette.colorize(new ex.Color(70, 0, 0));
        var anim = new ex.Animation(engine, [], 100, false);
        this._vg.addDrawing("red", redVignette);
        this._vg.addDrawing("black", blackVignette);
        this._vg.setDrawing("black");
        this.add(this._vg);
        // Initialize blood
        this.add(blood);
        this.buildWalls();
        // show GUI
        var progressBack = new ex.UIActor(60, 23, Config.TreasureProgressSize + 4, 40);
        progressBack.anchor.setTo(0, 0);
        progressBack.color = ex.Color.Black;
        this.add(progressBack);
        this._treasureProgress = new ex.UIActor(60, 27, Config.TreasureProgressSize, 32);
        this._treasureProgress.anchor.setTo(0, 0);
        this._treasureProgress.color = ex.Color.fromHex("#eab600");
        this.add(this._treasureProgress);
        this._lootProgress = new ex.UIActor(60, 27, 0, 32);
        this._lootProgress.anchor.setTo(0, 0);
        this._lootProgress.color = ex.Color.fromHex("#f25500");
        this.add(this._lootProgress);
        var treasureIndicator = new ex.UIActor(10, 10, 64, 64);
        treasureIndicator.addDrawing(Resources.TextureTreasureIndicator);
        this.add(treasureIndicator);
        var monsterProgressBack = new ex.UIActor(game.getWidth() - 66, 23, Config.MonsterProgressSize + 4, 40);
        monsterProgressBack.anchor.setTo(1, 0);
        monsterProgressBack.color = ex.Color.Black;
        this.add(monsterProgressBack);
        this._monsterProgress = new ex.UIActor(game.getWidth() - 66, 27, Config.MonsterProgressSize, 32);
        this._monsterProgress.anchor.setTo(1, 0);
        this._monsterProgress.color = ex.Color.fromHex("#ab2800");
        this.add(this._monsterProgress);
        var specialProgressBack = new ex.UIActor(game.getWidth() - 50, 46, Config.MonsterSpecialProgressSize + 4, 24);
        specialProgressBack.anchor.setTo(1, 0);
        specialProgressBack.color = ex.Color.Black;
        this.add(specialProgressBack);
        this._monsterSpecialProgress = new ex.UIActor(game.getWidth() - 50, 50, Config.MonsterSpecialProgressSize, 16);
        this._monsterSpecialProgress.anchor.setTo(1, 0);
        this._monsterSpecialProgress.color = ex.Color.fromHex("#6b1191");
        this.add(this._monsterSpecialProgress);
        var monsterIndicator = new ex.UIActor(game.getWidth() - 74, 10, 64, 64);
        monsterIndicator.addDrawing(Resources.TextureMonsterIndicator);
        this.add(monsterIndicator);
        //
        // todo load from Tiled
        //     
        var treasures = [
            this.getCellPos(19, 2),
            this.getCellPos(20, 2),
            this.getCellPos(19, 37),
            this.getCellPos(20, 37)
        ];
        for (var i = 0; i < treasures.length; i++) {
            var treasure = new Treasure(treasures[i].x, treasures[i].y);
            this.addTreasure(treasure);
        }
        var playerSpawn = this.getCellPos(Config.PlayerCellSpawnX, Config.PlayerCellSpawnY);
        this._player = new Monster(playerSpawn.x, playerSpawn.y);
        this.add(this._player);
    };
    Map.prototype.onActivate = function () {
        // start sounds
        SoundManager.start();
        game.canvas.className = "playing";
        this._survivalTimer = 0;
    };
    Map.prototype.onDeactivate = function () {
        game.canvas.className = "";
    };
    Map.prototype.getPlayer = function () {
        return this._player;
    };
    Map.prototype.resetPlayer = function () {
        this._player.health = Config.MonsterHealth;
        var playerSpawn = this.getCellPos(Config.PlayerCellSpawnX, Config.PlayerCellSpawnY);
        this._player.x = playerSpawn.x;
        this._player.y = playerSpawn.y;
    };
    Map.prototype.getTreasures = function () {
        return this._treasures;
    };
    Map.prototype.getSpawnPoints = function () {
        // todo get from tiled
        return [
            this.getCellPos(0, 19),
            this.getCellPos(39, 19)
        ];
    };
    Map.prototype.buildWalls = function () {
        var x, y, cell, wall;
        for (x = 0; x < Map.MapSize; x++) {
            for (y = 0; y < Map.MapSize; y++) {
                cell = this._walls[x + y * Map.MapSize];
                if (cell !== 0) {
                    wall = new ex.Actor(x * Map.CellSize, y * Map.CellSize, Map.CellSize, Map.CellSize);
                    wall.traits.length = 0;
                    wall.traits.push(new ex.Traits.OffscreenCulling());
                    wall.anchor.setTo(0, 0);
                    wall.collisionType = ex.CollisionType.Fixed;
                    this.add(wall);
                }
            }
        }
    };
    Map.prototype.isWall = function (x, y) {
        var cellX = Math.floor(x / Map.CellSize);
        var cellY = Math.floor(y / Map.CellSize);
        // oob
        if (cellX < 0 || cellX > Map.MapSize || cellY < 0 || cellY > Map.MapSize)
            return true;
        return this._walls[cellX + cellY * Map.MapSize] !== 0;
    };
    Map.prototype.getCellPos = function (x, y) {
        return new ex.Point(Map.CellSize * x, Map.CellSize * y);
    };
    Map.prototype.getSurvivalTime = function () {
        return this._survivalTimer;
    };
    Map.prototype.update = function (engine, delta) {
        _super.prototype.update.call(this, engine, delta);
        this._survivalTimer += delta;
        if (this._takingDamage) {
            this._damageEffectTimeLeft -= delta;
            if (this._damageEffectTimeLeft <= 0) {
                this._takingDamage = false;
                this._vg.setDrawing("black");
            }
        }
        // update treasure indicator
        var total = this.getHoardAmount();
        var looting = _.sum(HeroSpawner.getHeroes(), function (x) { return x.getLootAmount(); });
        var curr = _.sum(this._treasures, function (x) { return x.getAmount(); });
        // % being looted right now
        var lootProgress = looting / total;
        // % level of hoard, if looting succeeds
        var lossProgress = curr / total;
        var progressWidth = Math.floor(lossProgress * Config.TreasureProgressSize);
        var lootWidth = Math.floor(lootProgress * Config.TreasureProgressSize);
        this._treasureProgress.setWidth(progressWidth);
        this._lootProgress.x = this._treasureProgress.getRight();
        this._lootProgress.setWidth(lootWidth);
        // update monster health bar
        var monsterHealth = this._player.health;
        var progress = monsterHealth / Config.MonsterHealth;
        this._monsterProgress.setWidth(Math.floor(progress * Config.MonsterProgressSize));
        // todo set special
        this._monsterSpecialProgress.setWidth((this._player.dashLevel / Config.MonsterDashCooldown) * Config.MonsterSpecialProgressSize);
        if ((curr + looting) <= 0) {
            this._gameOver(GameOverType.Hoard);
        }
        var focus = game.currentScene.camera.getFocus().toVector();
        var position = new ex.Vector(this._player.x, this._player.y);
        var stretch = position.minus(focus).scale(Config.CameraElasticity);
        this._cameraVel = this._cameraVel.plus(stretch);
        var friction = this._cameraVel.scale(-1).scale(Config.CameraFriction);
        this._cameraVel = this._cameraVel.plus(friction);
        focus = focus.plus(this._cameraVel);
        game.currentScene.camera.setFocus(focus.x, focus.y);
    };
    Map.prototype.addTreasure = function (t) {
        this._treasures.push(t);
        this.add(t);
    };
    Map.prototype.getHoardAmount = function () {
        return this._treasures.length * Config.TreasureHoardSize;
    };
    Map.prototype._gameOver = function (type) {
        isGameOver = true;
        game.goToScene('gameover');
        gameOver.setType(type);
    };
    Map.CellSize = 24;
    Map.MapSize = 40;
    return Map;
})(ex.Scene);
var Blood = (function (_super) {
    __extends(Blood, _super);
    function Blood() {
        _super.call(this, 0, 0);
        this._bleedTimer = 0;
        this._emitters = [];
        this._scvs = document.createElement('canvas');
        this._scvs.width = 960;
        this._scvs.height = 960;
        this._sctx = this._scvs.getContext('2d');
        this._sctx.globalCompositeOperation = 'source-over';
        this.traits.length = 0;
        this._sprayEmitter = new ex.ParticleEmitter(0, 0, 100, 100);
    }
    Blood.prototype.onInitialize = function () {
        Blood.BloodPixel = Resources.TextureBloodPixel.asSprite();
        Blood.BloodPixelGreen = Resources.TextureBloodPixelGreen.asSprite();
    };
    Blood.prototype.splatter = function (x, y, sprite, amount, force, angle) {
        if (amount === void 0) { amount = 0.4; }
        if (force === void 0) { force = 0.5; }
        if (angle === void 0) { angle = 0; }
        this._emitters.push(new SplatterEmitter(x, y, sprite, amount, force, angle - Config.BloodSplatterAngleVariation, angle + Config.BloodSplatterAngleVariation));
    };
    Blood.prototype.pop = function (x, y, sprite, amount, force) {
        if (amount === void 0) { amount = 0.4; }
        if (force === void 0) { force = 0.5; }
        this._emitters.push(new SplatterEmitter(x, y, sprite, amount, force, 0, Math.PI * 2));
    };
    Blood.prototype.bleed = function (duration) {
        this._bleedTimer = duration;
    };
    Blood.prototype.draw = function (ctx, delta) {
        if (Options.blood) {
            _super.prototype.draw.call(this, ctx, delta);
            // update particle positions
            var emitter, i;
            for (i = 0; i < this._emitters.length; i++) {
                this._emitters[i].draw(this._sctx, delta);
            }
            // draw shadow ctx
            ctx.drawImage(this._scvs, 0, 0);
        }
    };
    Blood.prototype.update = function (engine, delta) {
        _super.prototype.update.call(this, engine, delta);
        if (Options.blood) {
            this._bleedTimer = Math.max(0, this._bleedTimer - delta);
            // update particle positions
            var emitter, i;
            for (i = this._emitters.length - 1; i >= 0; i--) {
                emitter = this._emitters[i];
                emitter.update(engine, delta);
                if (emitter.done) {
                    this._emitters.splice(i, 1);
                }
            }
        }
    };
    return Blood;
})(ex.Actor);
var SplatterEmitter = (function () {
    /**
     *
     */
    function SplatterEmitter(x, y, sprite, amount, force, minAngle, maxAngle) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.amount = amount;
        this.force = force;
        this.minAngle = minAngle;
        this.maxAngle = maxAngle;
        this._particles = [];
        this._stopTimer = 200;
        this.done = false;
        var pixelAmount = amount * Config.BloodMaxAmount;
        var backsplashAmount = pixelAmount * Config.BloodSplatterBackSplashAmount;
        var vMin = Config.BloodVelocityMin;
        var vMax = force * Config.BloodVelocityMax;
        var xMin = x - Config.BloodXYVariation;
        var yMin = y - Config.BloodXYVariation;
        var xMax = x + Config.BloodXYVariation;
        var yMax = y + Config.BloodXYVariation;
        for (var i = 0; i < pixelAmount; i++) {
            this._particles.push({
                x: ex.Util.randomIntInRange(xMin, xMax),
                y: ex.Util.randomIntInRange(yMin, yMax),
                f: ex.Util.randomInRange(Config.BloodMinFriction, Config.BloodMaxFriction),
                d: ex.Vector.fromAngle(ex.Util.randomInRange(minAngle, maxAngle)),
                v: ex.Util.randomIntInRange(vMin, vMax),
                av: 0,
                s: ex.Util.randomInRange(1, 2)
            });
        }
        for (var i = 0; i < backsplashAmount; i++) {
            this._particles.push({
                x: ex.Util.randomIntInRange(xMin, xMax),
                y: ex.Util.randomIntInRange(yMin, yMax),
                f: ex.Util.randomInRange(Config.BloodMinFriction, Config.BloodMaxFriction),
                d: ex.Vector.fromAngle(ex.Util.randomInRange(minAngle, maxAngle)).scale(-1),
                v: Config.BloodSplatterBackSplashVelocityModifier * ex.Util.randomIntInRange(vMin, vMax),
                av: 0,
                s: ex.Util.randomInRange(1, 2)
            });
        }
    }
    SplatterEmitter.prototype.update = function (engine, delta) {
        var i, particle, currPos, d, vel, f;
        this._stopTimer -= delta;
        if (this._stopTimer < 0) {
            this.done = true;
            return;
        }
        for (i = 0; i < this._particles.length; i++) {
            particle = this._particles[i];
            if (particle.d.y > 0) {
                particle.av -= Config.BloodSplatterAngleModOverTime;
            }
            else if (particle.d.y < 0) {
                particle.av += Config.BloodSplatterAngleModOverTime;
            }
            currPos = new ex.Vector(particle.x, particle.y);
            d = particle.d.rotate(particle.av, ex.Vector.Zero);
            vel = d.scale(particle.v);
            f = vel.scale(-1).scale(particle.f);
            vel = vel.plus(f);
            currPos = currPos.plus(vel);
            particle.x = currPos.x;
            particle.y = currPos.y;
            particle.v = vel.distance();
        }
    };
    SplatterEmitter.prototype.draw = function (ctx, delta) {
        var i, particle;
        for (i = 0; i < this._particles.length; i++) {
            particle = this._particles[i];
            if (map.isWall(particle.x, particle.y))
                continue;
            this.sprite.scale.setTo(particle.s, particle.s);
            this.sprite.draw(ctx, particle.x, particle.y);
        }
    };
    return SplatterEmitter;
})();
/// <reference path="game.ts" />
/// <reference path="config.ts" />
var Monster = (function (_super) {
    __extends(Monster, _super);
    function Monster(x, y) {
        _super.call(this, x, y, Config.MonsterWidth, Config.MonsterHeight);
        this.health = Config.MonsterHealth;
        this._rotation = 0;
        this._isAttacking = false;
        this._timeLeftAttacking = 0;
        this._direction = "none";
        this._lastSwing = 0;
        this._timeLeftDashing = 0;
        this._isDashing = false;
        this._canDash = false;
        this.dashLevel = 0;
        this.color = ex.Color.Red;
        this._mouseX = 0;
        this._mouseY = 0;
        this._rays = new Array();
        this._closeRays = new Array();
        this._attackable = new Array();
        //this.anchor = new ex.Point(0.35, 0.35);
        this.collisionType = ex.CollisionType.Active;
    }
    Monster.prototype.onInitialize = function (engine) {
        var _this = this;
        var that = this;
        // set the rotation of the actor when the mouse moves
        engine.input.pointers.primary.on('move', function (ev) {
            _this._mouseX = ev.x;
            _this._mouseY = ev.y;
        });
        this._aimSprite = Resources.TextureMonsterAim.asSprite();
        this._aimSprite.scale.setTo(2, 2);
        this._aimSprite.anchor = new ex.Point(.25, .25);
        this._aimSprite.opacity(.7);
        this._aimSprite.colorize(ex.Color.Green);
        this._aimSprite.colorize(ex.Color.Green);
        var shiftButton = new ex.SpriteSheet(Resources.TextureShift, 3, 1, 48, 48);
        var shiftAnimation = shiftButton.getAnimationForAll(engine, 100);
        shiftAnimation.loop = true;
        shiftAnimation.scale.setTo(1, 1);
        this._shiftIndicator = new ex.Actor(7, 70, 24, 24);
        this._shiftIndicator.addDrawing("shift", shiftAnimation);
        var chargeSpriteSheet = new ex.SpriteSheet(Resources.TextureMonsterCharge, 3, 1, 96, 96);
        var chargeAnim = chargeSpriteSheet.getAnimationForAll(engine, 100);
        chargeAnim.loop = true;
        chargeAnim.scale.setTo(2, 2);
        this.addDrawing("charge", chargeAnim);
        var downSpriteSheet = new ex.SpriteSheet(Resources.TextureMonsterDown, 14, 1, 96, 96);
        var rightSpriteSheet = new ex.SpriteSheet(Resources.TextureMonsterRight, 14, 1, 96, 96);
        var upSpriteSheet = new ex.SpriteSheet(Resources.TextureMonsterUp, 14, 1, 96, 96);
        var attackDownAnim = downSpriteSheet.getAnimationBetween(engine, 9, 13, Config.MonsterAttackTime / 4);
        attackDownAnim.scale.setTo(2, 2);
        attackDownAnim.loop = true;
        this.addDrawing("attackDown", attackDownAnim);
        var walkDownAnim = downSpriteSheet.getAnimationByIndices(engine, [2, 3, 4, 5, 6, 7], Config.MonsterWalkFrameSpeed);
        walkDownAnim.scale.setTo(2, 2);
        walkDownAnim.loop = true;
        this.addDrawing("walkDown", walkDownAnim);
        var attackUpAnim = upSpriteSheet.getAnimationBetween(engine, 9, 13, Config.MonsterAttackTime / 4);
        attackUpAnim.scale.setTo(2, 2);
        attackUpAnim.loop = true;
        this.addDrawing("attackUp", attackUpAnim);
        var walkUpAnim = upSpriteSheet.getAnimationByIndices(engine, [2, 3, 4, 5, 6, 7], Config.MonsterWalkFrameSpeed);
        walkUpAnim.scale.setTo(2, 2);
        walkUpAnim.loop = true;
        this.addDrawing("walkUp", walkUpAnim);
        var attackRightAnim = rightSpriteSheet.getAnimationBetween(engine, 9, 13, Config.MonsterAttackTime / 4);
        attackRightAnim.scale.setTo(2, 2);
        attackRightAnim.loop = true;
        this.addDrawing("attackRight", attackRightAnim);
        var walkRightAnim = rightSpriteSheet.getAnimationByIndices(engine, [2, 3, 4, 5, 6, 7], Config.MonsterWalkFrameSpeed);
        walkRightAnim.scale.setTo(2, 2);
        walkRightAnim.loop = true;
        this.addDrawing("walkRight", walkRightAnim);
        var attackLeftAnim = rightSpriteSheet.getAnimationBetween(engine, 9, 13, Config.MonsterAttackTime / 4);
        attackLeftAnim.flipHorizontal = true;
        attackLeftAnim.scale.setTo(2, 2);
        attackLeftAnim.loop = true;
        this.addDrawing("attackLeft", attackLeftAnim);
        var walkLeftAnim = rightSpriteSheet.getAnimationByIndices(engine, [2, 3, 4, 5, 6, 7], Config.MonsterWalkFrameSpeed);
        walkLeftAnim.flipHorizontal = true;
        walkLeftAnim.scale.setTo(2, 2);
        walkLeftAnim.loop = true;
        this.addDrawing("walkLeft", walkLeftAnim);
        var idleAnim = downSpriteSheet.getAnimationBetween(engine, 0, 2, 400);
        idleAnim.loop = true;
        idleAnim.scale.setTo(2, 2);
        this.addDrawing("idleDown", idleAnim);
        var idleUpAnim = upSpriteSheet.getAnimationBetween(engine, 0, 2, 400);
        idleUpAnim.loop = true;
        idleUpAnim.scale.setTo(2, 2);
        this.addDrawing("idleUp", idleUpAnim);
        var idleRightAnim = rightSpriteSheet.getAnimationBetween(engine, 0, 2, 400);
        idleRightAnim.scale.setTo(2, 2);
        idleRightAnim.loop = true;
        this.addDrawing("idleRight", idleRightAnim);
        var idleLeftAnim = rightSpriteSheet.getAnimationBetween(engine, 0, 2, 400);
        idleLeftAnim.flipHorizontal = true;
        idleLeftAnim.scale.setTo(2, 2);
        idleLeftAnim.loop = true;
        this.addDrawing("idleLeft", idleLeftAnim);
        var sprite = Resources.TextureMonsterRight.asSprite().clone();
        sprite.scale.setTo(2, 2);
        this.addDrawing("idleRight", sprite);
        this.setDrawing("idleDown");
        var yValues = new Array(-0.62, -0.25, 0, 0.25, 0.62);
        _.forIn(yValues, function (yValue) {
            var rayVector = new ex.Vector(1, yValue);
            var rayPoint = new ex.Point(_this.x, _this.y);
            var ray = new ex.Ray(rayPoint, rayVector);
            that._rays.push(ray);
        });
        var closeXValues = new Array(1, 0.71, 0, -0.71, -1); //(1, 0.86, 0.71, 0.5, 0, -0.5, -0.71, -0.86, -1)
        var closeYValues = new Array(0, 0.71, 1, -0.71, 0);
        _.forIn(closeYValues, function (closeYValue) {
            _.forIn(closeXValues, function (closeXValue) {
                var rayVector = new ex.Vector(closeXValue, closeYValue);
                var rayPoint = new ex.Point(_this.x, _this.y);
                var ray = new ex.Ray(rayPoint, rayVector);
                that._closeRays.push(ray);
            });
        });
        // attack
        engine.input.pointers.primary.on("down", function (evt) {
            var currentTime = Date.now();
            if (currentTime - that._lastSwing > Config.MonsterAttackCooldown) {
                that._attack();
                that._isAttacking = true;
                that._timeLeftAttacking = Config.MonsterAttackTime;
                that._lastSwing = currentTime;
            }
        });
        // keyboad
        engine.input.keyboard.on("down", function (evt) {
            if (evt.key === ex.Input.Keys.Shift) {
                that.dash();
            }
        });
    };
    Monster.prototype._findFirstValidPad = function (engine) {
        var gamePad;
        for (var i = 1; i < 5; i++) {
            gamePad = engine.input.gamepads.at(i);
            if (gamePad && gamePad._buttons && gamePad._buttons.length > 0) {
                return gamePad;
            }
        }
    };
    Monster.prototype.dash = function () {
        if (this._canDash) {
            this.removeChild(this._shiftIndicator);
            this._canDash = false;
            this.dashLevel = 0;
            var dashVector = ex.Vector.fromAngle(this._rotation).scale(Config.MonsterDashSpeed);
            this._isDashing = true;
            this._timeLeftDashing = Config.MonsterDashDuration;
            this.dx = dashVector.x;
            this.dy = dashVector.y;
            this.setDrawing("charge");
            //this.currentDrawing.anchor = new ex.Point(.35, .35);
            this.rotation = this._rotation;
            Resources.Fireball.play();
        }
    };
    Monster.prototype.update = function (engine, delta) {
        var _this = this;
        _super.prototype.update.call(this, engine, delta);
        if (this.health <= 0) {
            map._gameOver(GameOverType.Slain);
        }
        this._attackable.length = 0;
        this._detectAttackable();
        if (this._isDashing) {
            this._attack();
            this._timeLeftDashing -= delta;
            if (this._timeLeftDashing <= 0) {
                this._isDashing = false;
                this.rotation = 0;
            }
        }
        var prevRotation = this._rotation;
        this._rotation = ex.Util.canonicalizeAngle(new ex.Vector(this._mouseX - this.x, this._mouseY - this.y).toAngle());
        // updating attack rays
        _.forIn(this._rays, function (ray) {
            ray.pos = new ex.Point(_this.x, _this.y);
            var rotationAmt = _this._rotation - prevRotation;
            ray.dir = ray.dir.rotate(rotationAmt, new ex.Point(0, 0));
        });
        _.forIn(this._closeRays, function (ray) {
            ray.pos = new ex.Point(_this.x, _this.y);
            var rotationAmt = _this._rotation - prevRotation;
            ray.dir = ray.dir.rotate(rotationAmt, new ex.Point(0, 0));
        });
        if (!this._isDashing) {
            // add to dash cooldown
            this.dashLevel = Math.min(this.dashLevel + delta, Config.MonsterDashCooldown);
            if (this.dashLevel >= Config.MonsterDashCooldown) {
                this._canDash = true;
                this.addChild(this._shiftIndicator);
            }
            // clear move
            this.dx = 0;
            this.dy = 0;
            // Controller input
            var pad = this._findFirstValidPad(engine);
            if (pad) {
                // sticks
                var leftAxisY = pad.getAxes(ex.Input.Axes.LeftStickY);
                var leftAxisX = pad.getAxes(ex.Input.Axes.LeftStickX);
                var rightAxisX = pad.getAxes(ex.Input.Axes.RightStickX);
                var rightAxisY = pad.getAxes(ex.Input.Axes.RightStickY);
                var leftVector = new ex.Vector(leftAxisX, leftAxisY);
                var rightVector = new ex.Vector(rightAxisX, rightAxisY);
                if (pad.getButton(ex.Input.Buttons.RightTrigger) > .2 ||
                    pad.getButton(ex.Input.Buttons.Face1) > 0) {
                    this._attack();
                    this._isAttacking = true;
                    this._timeLeftAttacking = Config.MonsterAttackTime;
                }
                if (leftVector.distance() > .2) {
                    this._rotation = ex.Util.canonicalizeAngle(leftVector.normalize().toAngle());
                    if (!this._isAttacking) {
                        var speed = leftVector.scale(Config.MonsterSpeed);
                        this.dx = speed.x;
                        this.dy = speed.y;
                        if (Math.abs(this.dx) > Math.abs(this.dy) && this.dx > 0) {
                            if (this._direction !== "walkRight") {
                                this.setDrawing("walkRight");
                                this._direction = "walkRight";
                            }
                        }
                        if (Math.abs(this.dy) > Math.abs(this.dx) && this.dy < 0) {
                            if (this._direction !== "walkUp") {
                                this.setDrawing("walkUp");
                                this._direction = "walkUp";
                            }
                        }
                        if (Math.abs(this.dx) > Math.abs(this.dy) && this.dx < 0) {
                            if (this._direction !== "walkLeft") {
                                this.setDrawing("walkLeft");
                                this._direction = "walkLeft";
                            }
                        }
                        if (Math.abs(this.dy) > Math.abs(this.dx) && this.dy > 0) {
                            if (this._direction !== "walkDown") {
                                this.setDrawing("walkDown");
                                this._direction = "walkDown";
                            }
                        }
                    }
                }
            }
            // WASD
            if (engine.input.keyboard.isKeyPressed(ex.Input.Keys.W) ||
                engine.input.keyboard.isKeyPressed(ex.Input.Keys.Up)) {
                if (!this._isAttacking) {
                    this.dy = -Config.MonsterSpeed;
                    this.setDrawing("walkUp");
                }
            }
            if (engine.input.keyboard.isKeyPressed(ex.Input.Keys.S) ||
                engine.input.keyboard.isKeyPressed(ex.Input.Keys.Down)) {
                if (!this._isAttacking) {
                    this.dy = Config.MonsterSpeed;
                    this.setDrawing("walkDown");
                }
            }
            if (engine.input.keyboard.isKeyPressed(ex.Input.Keys.A) ||
                engine.input.keyboard.isKeyPressed(ex.Input.Keys.Left)) {
                if (!this._isAttacking) {
                    this.dx = -Config.MonsterSpeed;
                    if (this.dy === 0) {
                        this.setDrawing("walkLeft");
                    }
                }
            }
            if ((engine.input.keyboard.isKeyPressed(ex.Input.Keys.D) ||
                engine.input.keyboard.isKeyPressed(ex.Input.Keys.Right))) {
                if (!this._isAttacking) {
                    this.dx = Config.MonsterSpeed;
                    if (this.dy === 0) {
                        this.setDrawing("walkRight");
                    }
                }
            }
            if (this.dx == 0 && this.dy == 0 && !this._isAttacking) {
                this.setDrawing("idleDown");
            }
            if (this._isAttacking) {
                if (this._rotation < Math.PI / 4 || this._rotation > Math.PI * (7 / 4)) {
                    this.setDrawing("attackRight");
                }
                if (this._rotation > Math.PI / 4 && this._rotation < Math.PI * (3 / 4)) {
                    this.setDrawing("attackDown");
                }
                if (this._rotation > Math.PI * (3 / 4) && this._rotation < Math.PI * (5 / 4)) {
                    this.setDrawing("attackLeft");
                }
                if (this._rotation > Math.PI * (5 / 4) && this._rotation < Math.PI * (7 / 4)) {
                    this.setDrawing("attackUp");
                }
                this._direction = "attack";
                this._timeLeftAttacking -= delta;
                if (this._timeLeftAttacking <= 0) {
                    this._isAttacking = false;
                }
            }
        }
        this.setZIndex(this.y);
    };
    Monster.prototype.draw = function (ctx, delta) {
        _super.prototype.draw.call(this, ctx, delta);
        this._aimSprite.rotation = this._rotation;
        this._aimSprite.draw(ctx, this.x, this.y);
    };
    Monster.prototype._detectAttackable = function () {
        var _this = this;
        _.forIn(HeroSpawner.getHeroes(), function (hero) {
            if (_this._isHeroAttackable(hero)) {
                _this._attackable.push(hero);
            }
        });
    };
    Monster.prototype._isHeroAttackable = function (hero) {
        var heroLines = hero.getLines();
        for (var i = 0; i < this._rays.length; i++) {
            for (var j = 0; j < heroLines.length; j++) {
                var distanceToIntersect = this._rays[i].intersect(heroLines[j]);
                if ((distanceToIntersect > 0) && (distanceToIntersect <= Config.MonsterAttackRange)) {
                    return true;
                }
            }
        }
        for (var i = 0; i < this._closeRays.length; i++) {
            for (var j = 0; j < heroLines.length; j++) {
                var distanceToIntersect = this._closeRays[i].intersect(heroLines[j]);
                if ((distanceToIntersect > 0) && (distanceToIntersect <= Config.CloseMonsterAttackRange)) {
                    return true;
                }
            }
        }
    };
    Monster.prototype._attack = function () {
        var _this = this;
        var hitHero = false;
        _.forIn(this._attackable, function (hero) {
            // hero.blink(500, 500, 5); //can't because moving already (no parallel actions support)
            game.currentScene.camera.shake(5, 5, 200);
            hero.Health--;
            hitHero = true;
            var origin = new ex.Vector(hero.x, hero.y);
            var dest = new ex.Vector(_this.x, _this.y);
            var vectorBetween = origin.subtract(dest);
            hero.stun(vectorBetween);
            blood.splatter(hero.x, hero.y, Blood.BloodPixel, hero.Health <= 0 ? 0.7 : 0.4, hero.Health <= 0 ? 0.8 : 0.3, vectorBetween.toAngle());
        });
        if (!this._isDashing) {
            if (hitHero) {
                Resources.AxeSwingHit.play();
            }
            else {
                Resources.AxeSwing.play();
            }
        }
    };
    Monster.prototype.getRotation = function () {
        return this._rotation;
    };
    Monster.prototype.debugDraw = function (ctx) {
        _super.prototype.debugDraw.call(this, ctx);
        // Debugging draw for attack rays
        _.forIn(this._rays, function (ray) {
            ctx.beginPath();
            ctx.moveTo(ray.pos.x, ray.pos.y);
            var end = ray.getPoint(Config.MonsterAttackRange);
            ctx.lineTo(end.x, end.y);
            ctx.strokeStyle = ex.Color.Chartreuse.toString();
            ctx.stroke();
            ctx.closePath();
        });
        _.forIn(this._closeRays, function (ray) {
            ctx.beginPath();
            ctx.moveTo(ray.pos.x, ray.pos.y);
            var end = ray.getPoint(Config.CloseMonsterAttackRange);
            ctx.lineTo(end.x, end.y);
            ctx.strokeStyle = ex.Color.Azure.toString();
            ctx.stroke();
            ctx.closePath();
        });
    };
    return Monster;
})(ex.Actor);
var HeroStates;
(function (HeroStates) {
    HeroStates[HeroStates["Searching"] = 0] = "Searching";
    HeroStates[HeroStates["Looting"] = 1] = "Looting";
    HeroStates[HeroStates["Attacking"] = 2] = "Attacking";
    HeroStates[HeroStates["Fleeing"] = 3] = "Fleeing";
    HeroStates[HeroStates["Stunned"] = 4] = "Stunned";
})(HeroStates || (HeroStates = {}));
var HeroSpawner = (function () {
    function HeroSpawner() {
    }
    HeroSpawner.spawnHero = function () {
        var i, spawnPoints, spawnPoint, hero;
        // todo better spawning logic
        for (i = 0; i < Math.min(Config.HeroSpawnPoolMax, HeroSpawner._spawned); i++) {
            spawnPoints = map.getSpawnPoints();
            spawnPoint = Util.pickRandom(spawnPoints);
            // increasing difficulty
            if (Stats.numHeroesKilled > Config.HardThreshold) {
                heroTimer.interval = Config.HeroSpawnIntervalHard;
            }
            else if (Stats.numHeroesKilled > Config.MedThreshold) {
                heroTimer.interval = Config.HeroSpawnIntervalMed;
            }
            else if (Stats.numHeroesKilled > Config.EasyThreshold) {
                heroTimer.interval = Config.HeroSpawnIntervalEasy;
            }
            HeroSpawner._spawn(spawnPoint);
            HeroSpawner._spawned++;
        }
        // rig first spawn
        if (HeroSpawner._spawned === 0) {
            spawnPoint = map.getSpawnPoints()[0];
            HeroSpawner._spawn(spawnPoint);
            HeroSpawner._spawned++;
        }
    };
    HeroSpawner._spawn = function (point) {
        var hero = new Hero(point.x, point.y);
        game.add(hero);
        this._heroes.push(hero);
    };
    HeroSpawner.getHeroes = function () {
        return this._heroes;
    };
    HeroSpawner.despawn = function (h, blood) {
        if (blood === void 0) { blood = false; }
        if (blood) {
            var tombstone = new ex.Actor(h.x, h.y, 24, 24);
            var sprites = [Resources.TextureHeroDead, Resources.TextureHeroDead2, Resources.TextureHeroDead3, Resources.TextureHeroDead4];
            tombstone.traits.length = 0;
            // todo bug with actor scaling
            var sprite = Util.pickRandom(sprites).asSprite();
            sprite.scale.setTo(1.5, 1.5);
            tombstone.addDrawing("default", sprite);
            game.add(tombstone);
            HeroSpawner._tombstones.push(tombstone);
        }
        h.kill();
        _.remove(this._heroes, h);
    };
    HeroSpawner.cleanupTombstones = function () {
        _.forIn(HeroSpawner._tombstones, function (tombstone) {
            tombstone.kill();
        });
    };
    HeroSpawner.toggleTombstones = function (bool) {
        _.forIn(HeroSpawner._tombstones, function (tombstone) {
            tombstone.visible = bool;
        });
    };
    HeroSpawner.reset = function () {
        HeroSpawner._spawned = 0;
    };
    HeroSpawner.getSpawnCount = function () {
        return HeroSpawner._spawned;
    };
    HeroSpawner._spawned = 0;
    HeroSpawner._heroes = [];
    HeroSpawner._tombstones = [];
    return HeroSpawner;
})();
var Hero = (function (_super) {
    __extends(Hero, _super);
    function Hero(x, y) {
        _super.call(this, x, y, 24, 24);
        this.Health = Config.HeroHealth;
        this._treasure = 0;
        this._attackCooldown = Config.HeroAttackCooldown;
        this._hasHitMinotaur = true;
        this._isAttacking = false;
        this._timeLeftAttacking = 0;
        this._stunnedTime = 0;
        this._fsm = new TypeState.FiniteStateMachine(HeroStates.Searching);
        // declare valid state transitions
        this._fsm.from(HeroStates.Searching).to(HeroStates.Attacking, HeroStates.Looting);
        this._fsm.from(HeroStates.Attacking).to(HeroStates.Searching);
        this._fsm.from(HeroStates.Looting).to(HeroStates.Fleeing);
        this._fsm.fromAny(HeroStates).to(HeroStates.Stunned);
        this._fsm.from(HeroStates.Stunned).toAny(HeroStates);
        this._fsm.on(HeroStates.Stunned, this.onStunned.bind(this));
        this._fsm.onExit(HeroStates.Stunned, this.onExitStunned.bind(this));
        this._fsm.on(HeroStates.Searching, this.onSearching.bind(this));
        this._fsm.on(HeroStates.Looting, this.onLooting.bind(this));
        this._fsm.on(HeroStates.Fleeing, this.onFleeing.bind(this));
        this._fsm.on(HeroStates.Attacking, this.onAttacking.bind(this));
    }
    Hero.prototype.onInitialize = function (engine) {
        var _this = this;
        this.setZIndex(1);
        this._lootIndicator = new ex.Actor(5, -24, 24, 24);
        this._lootIndicator.addDrawing(Resources.TextureHeroLootIndicator);
        this._lootIndicator.scale.setTo(1.5, 1.5);
        this._lootIndicator.moveBy(5, -32, 200).moveBy(5, -24, 200).repeatForever();
        var spriteSheet = new ex.SpriteSheet(Resources.TextureHero, 7, 1, 28, 28);
        var idleAnim = spriteSheet.getAnimationByIndices(engine, [0, 1, 2], 300);
        idleAnim.loop = true;
        idleAnim.scale.setTo(2, 2);
        this.addDrawing("idleLeft", idleAnim);
        var rightDamange = spriteSheet.getSprite(0).clone();
        rightDamange.flipHorizontal = true;
        rightDamange.lighten(100);
        rightDamange.scale.setTo(2, 2);
        this.addDrawing("damageRight", rightDamange);
        var leftDamage = rightDamange.clone();
        leftDamage.flipHorizontal = true;
        this.addDrawing("damageLeft", leftDamage);
        var rightAnim = spriteSheet.getAnimationByIndices(engine, [0, 1, 2], 300);
        rightAnim.flipHorizontal = true;
        rightAnim.loop = true;
        rightAnim.scale.setTo(2, 2);
        this.addDrawing("idleRight", rightAnim);
        var attackAnim = spriteSheet.getAnimationByIndices(engine, [3, 4, 5, 6], 100);
        attackAnim.loop = true;
        attackAnim.scale.setTo(2, 2);
        this.addDrawing("attackLeft", attackAnim);
        var attackRightAnim = spriteSheet.getAnimationByIndices(engine, [3, 4, 5, 6], 100);
        attackRightAnim.flipHorizontal = true;
        attackRightAnim.loop = true;
        attackRightAnim.scale.setTo(2, 2);
        this.addDrawing("attackRight", attackRightAnim);
        this.collisionType = ex.CollisionType.Passive;
        this.on('collision', function (e) {
            if (e.other instanceof Treasure) {
                var hero = e.actor;
                if (hero._treasure === 0) {
                    hero._treasure = e.other.steal();
                    if (hero._treasure === 0) {
                        hero._fsm.go(HeroStates.Searching);
                    }
                    else if (hero._fsm.canGo(HeroStates.Looting)) {
                        hero._fsm.go(HeroStates.Looting);
                    }
                }
            }
            else if (e.other instanceof Monster) {
                var hero = e.actor;
                if (hero._attackCooldown == 0 && hero._hasHitMinotaur) {
                    Resources.HeroSwing.play();
                    var monster = e.other;
                    monster.health--;
                    map.damageEffect();
                    Stats.damageTaken++;
                    hero._attackCooldown = Config.HeroAttackCooldown;
                    if (!hero._isAttacking) {
                        if (_this._direction === 'right') {
                            hero.setDrawing('attackRight');
                        }
                        else {
                            hero.setDrawing('attackLeft');
                        }
                        hero._isAttacking = true;
                        hero._timeLeftAttacking = 300;
                    }
                    var origin = new ex.Vector(hero.x, hero.y);
                    var dest = new ex.Vector(monster.x, monster.y);
                    var a = dest.subtract(origin).toAngle();
                    blood.splatter(monster.x, monster.y, Blood.BloodPixelGreen, 0.2, 0.2, a);
                }
                if (!hero._hasHitMinotaur) {
                    hero._hasHitMinotaur = true;
                    hero._attackCooldown = Config.HeroAttackCooldown;
                }
            }
        });
        this.onSearching();
    };
    Hero.prototype.update = function (engine, delta) {
        _super.prototype.update.call(this, engine, delta);
        if (this.Health <= 0) {
            Resources.BloodSpatter.play();
            Stats.numHeroesKilled++;
            // map.getTreasures()[0].return(this._treasure);
            this._chestLooted.return(this._treasure);
            // return the treasure stolen to a random chest to preven player camping
            // Util.pickRandom(map.getTreasures()).return(this._treasure);
            HeroSpawner.despawn(this, Options.blood);
        }
        this.setZIndex(this.y);
        this._attackCooldown = Math.max(this._attackCooldown - delta, 0);
        var heroVector = new ex.Vector(this.x, this.y);
        var monsterVector = new ex.Vector(map._player.x, map._player.y);
        if (this.dx > 0) {
            if (this._direction !== "right") {
                this._direction = "right";
                this.setDrawing("idleRight");
            }
        }
        if (this.dx < 0) {
            if (this._direction !== "left") {
                this._direction = "left";
                this.setDrawing("idleLeft");
            }
        }
        if (this._fsm.currentState === HeroStates.Stunned) {
            if (this._direction == "left") {
                this.setDrawing("damageLeft");
            }
            if (this._direction == "right") {
                this.setDrawing("damageRight");
            }
        }
        if (this._isAttacking) {
            this._timeLeftAttacking -= delta;
            if (this._timeLeftAttacking <= 0) {
                if (this._direction == "right") {
                    this.setDrawing("idleRight");
                }
                else {
                    this.setDrawing("idleLeft");
                }
                this._isAttacking = false;
            }
        }
        switch (this._fsm.currentState) {
            case HeroStates.Stunned:
                this._stunnedTime -= delta;
                if (this._stunnedTime <= 0) {
                    if (this._treasure > 0) {
                        this._fsm.go(HeroStates.Fleeing);
                    }
                    else {
                        this._fsm.go(HeroStates.Searching);
                    }
                }
                break;
            case HeroStates.Searching:
                if (heroVector.distance(monsterVector) <= Config.HeroAggroDistance) {
                    this._fsm.go(HeroStates.Attacking);
                }
                break;
            case HeroStates.Attacking:
                if (heroVector.distance(monsterVector) > Config.HeroAggroDistance) {
                    this.clearActions();
                    this._fsm.go(HeroStates.Searching);
                }
                else if (heroVector.distance(monsterVector) <= Config.HeroAggroDistance) {
                    this.clearActions();
                    this.meet(map._player, Config.HeroSpeed);
                    if (heroVector.distance(monsterVector) < Config.HeroMeleeRange) {
                        this.clearActions();
                    }
                }
                break;
        }
        if (this._treasure > 0) {
            this.addChild(this._lootIndicator);
        }
        else {
            this.removeChild(this._lootIndicator);
        }
    };
    Hero.prototype.getLootAmount = function () {
        return this._treasure;
    };
    Hero.prototype.getLines = function () {
        var lines = new Array();
        var beginPoint1 = new ex.Point(this.x, this.y);
        var endPoint1 = new ex.Point(this.x + this.getWidth(), this.y);
        var newLine1 = new ex.Line(beginPoint1, endPoint1);
        // beginPoint2 is endPoint1
        var endPoint2 = new ex.Point(endPoint1.x, endPoint1.y + this.getHeight());
        var newLine2 = new ex.Line(endPoint1, endPoint2);
        // beginPoint3 is endPoint2
        var endPoint3 = new ex.Point(this.x, this.y + this.getHeight());
        var newLine3 = new ex.Line(endPoint2, endPoint3);
        // beginPoint4 is endPoint3
        // endPoint4 is beginPoint1
        var newLine4 = new ex.Line(endPoint3, beginPoint1);
        lines.push(newLine1);
        lines.push(newLine2);
        lines.push(newLine3);
        lines.push(newLine4);
        return lines;
    };
    Hero.prototype.stun = function (direction) {
        this._fsm.go(HeroStates.Stunned);
        var dir = direction.normalize().scale(Config.KnockBackForce);
        this.dx = dir.x;
        this.dy = dir.y;
    };
    Hero.prototype.onSearching = function (from) {
        if (from != null && from === HeroStates.Searching) {
            return;
        }
        // find treasures
        var treasures = map.getTreasures();
        // random treasure for now
        var loot = Util.pickRandom(treasures);
        // move to it
        this.moveTo(loot.x, loot.y, Config.HeroSpeed);
        this._chestLooted = loot;
    };
    Hero.prototype.onLooting = function (from) {
        var _this = this;
        // play animation
        this.delay(2000).callMethod(function () { return _this._fsm.go(HeroStates.Fleeing); });
    };
    Hero.prototype.onFleeing = function (from) {
        var _this = this;
        // find an exit
        var exits = map.getSpawnPoints();
        var exit = Util.pickRandom(exits);
        this.moveTo(exit.x, exit.y, Config.HeroFleeingSpeed).callMethod(function () { return _this.onExit(); });
    };
    Hero.prototype.onAttacking = function (from) {
        // stop any actions
        this.clearActions();
        // TODO attack monster
        this.meet(map._player, Config.HeroSpeed);
    };
    Hero.prototype.onStunned = function (from) {
        this.clearActions();
        this._stunnedTime = Config.HeroStunnedTime;
    };
    Hero.prototype.onExitStunned = function (from) {
        if (this._direction === "left") {
            this.setDrawing("idleLeft");
        }
        if (this._direction === "right") {
            this.setDrawing("idleRight");
        }
        return true;
    };
    Hero.prototype.onExit = function () {
        // play negative sound or something
        Stats.goldLost += this._treasure;
        Stats.numHeroesEscaped++;
        HeroSpawner.despawn(this);
    };
    return Hero;
})(ex.Actor);
var Treasure = (function (_super) {
    __extends(Treasure, _super);
    function Treasure(x, y) {
        _super.call(this, x, y, 24, 24);
        this._hoard = Config.TreasureHoardSize;
        this.anchor.setTo(0, 0);
    }
    Treasure.prototype.onInitialize = function (engine) {
        this.addDrawing("notempty", Resources.TextureTreasure.asSprite());
        this.addDrawing("empty", Resources.TextureTreasureEmpty.asSprite());
        this.collisionType = ex.CollisionType.Passive;
    };
    Treasure.prototype.getAmount = function () {
        return this._hoard;
    };
    Treasure.prototype.steal = function () {
        var _this = this;
        var amount = 0;
        if (this._hoard > 0) {
            if (this._hoard >= Config.TreasureStealAmount) {
                amount = Config.TreasureStealAmount;
            }
            else {
                amount = this._hoard;
            }
            this._hoard -= amount;
            return amount;
        }
        else {
            //TODO steal from another non-empty chest
            _.first(map.getTreasures(), function (treasure) {
                if (treasure != _this) {
                    if (treasure.getAmount() > 0) {
                        amount = treasure.steal();
                        // console.log('stealing from another chest');
                        return true;
                    }
                }
                return false;
            });
            return amount;
        }
    };
    Treasure.prototype.return = function (amount) {
        this._hoard += amount;
    };
    Treasure.prototype.reset = function () {
        this._hoard = Config.TreasureHoardSize;
    };
    Treasure.prototype.update = function (engine, delta) {
        _super.prototype.update.call(this, engine, delta);
        if (this._hoard <= 0) {
            this.setDrawing("empty");
        }
        else {
            this.setDrawing("notempty");
        }
    };
    return Treasure;
})(ex.Actor);
var Stats = (function () {
    function Stats() {
    }
    Stats.numHeroesKilled = 0;
    Stats.numHeroesEscaped = 0;
    Stats.goldLost = 0;
    Stats.damageTaken = 0;
    return Stats;
})();
var Options = {
    blood: true,
    music: true,
    sound: true
};
var Settings = (function (_super) {
    __extends(Settings, _super);
    function Settings() {
        _super.apply(this, arguments);
    }
    Settings.prototype.onInitialize = function (engine) {
        var bloodToggle = new ex.Actor(game.width / 2, 100 + game.height / 2, 50, 50, ex.Color.Red);
        this.add(bloodToggle);
        bloodToggle.on('pointerdown', function (e) {
            if (Options.blood) {
                Options.blood = false;
                bloodToggle.color = ex.Color.DarkGray;
            }
            else {
                Options.blood = true;
                bloodToggle.color = ex.Color.Red;
            }
        });
        var musicToggle = new ex.Actor(game.width / 2, game.height / 2, 50, 50, ex.Color.Red);
        this.add(musicToggle);
        musicToggle.on('pointerdown', function (e) {
            if (Options.music) {
                Options.music = false;
                musicToggle.color = ex.Color.DarkGray;
            }
            else {
                Options.music = true;
                musicToggle.color = ex.Color.Red;
            }
        });
        var soundToggle = new ex.Actor(game.width / 2, -100 + game.height / 2, 50, 50, ex.Color.Red);
        this.add(soundToggle);
        soundToggle.on('pointerdown', function (e) {
            if (Options.sound) {
                Options.sound = false;
                soundToggle.color = ex.Color.DarkGray;
            }
            else {
                Options.sound = true;
                soundToggle.color = ex.Color.Red;
            }
        });
    };
    Settings.prototype.onDeactivate = function () {
        HeroSpawner.toggleTombstones(Options.blood);
    };
    return Settings;
})(ex.Scene);
var GameOverType;
(function (GameOverType) {
    GameOverType[GameOverType["Hoard"] = 0] = "Hoard";
    GameOverType[GameOverType["Slain"] = 1] = "Slain";
})(GameOverType || (GameOverType = {}));
var GameOver = (function (_super) {
    __extends(GameOver, _super);
    function GameOver() {
        _super.apply(this, arguments);
    }
    GameOver.prototype.onInitialize = function (engine) {
        game.backgroundColor = ex.Color.Black;
        var bg = new ex.Actor(0, 0, game.getWidth(), game.getHeight());
        bg.anchor.setTo(0, 0);
        bg.addDrawing(Resources.TextureGameOverBg);
        this.add(bg);
        this._type = new ex.Actor(0, 0, game.getWidth(), game.getHeight());
        this._type.anchor.setTo(0, 0);
        this._type.addDrawing("hoard", Resources.TextureGameOverHoard.asSprite());
        this._type.addDrawing("slain", Resources.TextureGameOverSlain.asSprite());
        this.add(this._type);
        // stats
        var statY = 420;
        this._labelSurvivalTime = new ex.Label(null, game.getWidth() / 2, 300, "bold 60px Arial");
        this._labelSurvivalTime.textAlign = ex.TextAlign.Center;
        this._labelHeroesKilled = new ex.Label(null, 223, statY, "30px Arial");
        this._labelHeroesKilled.textAlign = ex.TextAlign.Center;
        this._labelHeroesEscaped = new ex.Label(null, 408, statY, "30px Arial");
        this._labelHeroesEscaped.textAlign = ex.TextAlign.Center;
        this._labelGoldLost = new ex.Label(null, 575, statY, "30px Arial");
        this._labelGoldLost.textAlign = ex.TextAlign.Center;
        this._labelDamageTaken = new ex.Label(null, 748, statY, "30px Arial");
        this._labelDamageTaken.textAlign = ex.TextAlign.Center;
        this._labelSurvivalTime.color = ex.Color.fromHex("#e7a800");
        this._labelHeroesKilled.color = ex.Color.White;
        this._labelHeroesEscaped.color = ex.Color.White;
        this._labelGoldLost.color = ex.Color.White;
        this._labelDamageTaken.color = ex.Color.White;
        this.add(this._labelSurvivalTime);
        this.add(this._labelHeroesKilled);
        this.add(this._labelHeroesEscaped);
        this.add(this._labelGoldLost);
        this.add(this._labelDamageTaken);
        var retryButton = new ex.Actor(game.width / 2, 500, 252, 56);
        retryButton.addDrawing(Resources.TextureGameOverRetry);
        this.add(retryButton);
        retryButton.on('pointerdown', function (e) {
            isGameOver = false;
            Stats.numHeroesKilled = 0;
            Stats.numHeroesEscaped = 0;
            Stats.goldLost = 0;
            Stats.damageTaken = 0;
            map.resetPlayer();
            // heroTimer.cancel();
            // game.remove(heroTimer);
            // heroTimer = new ex.Timer(() => HeroSpawner.spawnHero(), Config.HeroSpawnInterval, true);
            // game.add(heroTimer);
            _.forEach(map.getTreasures(), function (treasure) {
                treasure.reset();
            });
            HeroSpawner.reset();
            for (var i = HeroSpawner.getHeroes().length - 1; i >= 0; i--) {
                HeroSpawner.despawn(HeroSpawner.getHeroes()[i], false);
            }
            HeroSpawner.cleanupTombstones();
            game.goToScene('map');
        });
    };
    GameOver.prototype.onActivate = function () {
        _super.prototype.onActivate.call(this);
        Resources.SoundMusic.stop();
        Resources.GameOver.play();
    };
    GameOver.prototype.onDeactivate = function () {
        _super.prototype.onDeactivate.call(this);
        Resources.GameOver.stop();
    };
    GameOver.prototype.update = function (engine, delta) {
        _super.prototype.update.call(this, engine, delta);
        this._labelHeroesKilled.text = Stats.numHeroesKilled.toString() + ' (' + Math.floor(100 * (Stats.numHeroesKilled / HeroSpawner.getSpawnCount())).toString() + '%)';
        this._labelHeroesEscaped.text = Stats.numHeroesEscaped.toString() + ' (' + Math.floor(100 * (Stats.numHeroesEscaped / HeroSpawner.getSpawnCount())).toString() + '%)';
        this._labelGoldLost.text = Math.floor(100 * (Stats.goldLost / map.getHoardAmount())).toString() + '%';
        this._labelDamageTaken.text = Math.floor(100 * (Stats.damageTaken / Config.MonsterHealth)).toString() + '%';
        var survival = map.getSurvivalTime(); // in ms
        var mins = Math.floor(survival / 1000 / 60);
        var secs = Math.floor((survival / 1000) - (60 * mins));
        this._labelSurvivalTime.text = mins.toString() + "m" + secs.toString() + "s";
    };
    GameOver.prototype.setType = function (type) {
        this._type.setDrawing(type === GameOverType.Hoard ? "hoard" : "slain");
    };
    return GameOver;
})(ex.Scene);
var SoundManager = (function () {
    function SoundManager() {
    }
    SoundManager.start = function () {
        // set all sound effect volumes
        if (Options.sound) {
            SoundManager.setSoundEffectLevels(1);
        }
        else {
            SoundManager.setSoundEffectLevels(0);
        }
        // set music volume
        if (Options.music) {
            Resources.SoundMusic.setVolume(0.03);
            if (!Resources.SoundMusic.isPlaying()) {
                Resources.SoundMusic.play();
                Resources.SoundMusic.setLoop(true);
            }
            Resources.GameOver.setVolume(0.1);
        }
        else {
            Resources.SoundMusic.setVolume(0);
            Resources.GameOver.setVolume(0);
        }
    };
    SoundManager.setSoundEffectLevels = function (volume) {
        _.forIn(Resources, function (resource) {
            if (resource instanceof ex.Sound && (resource != Resources.SoundMusic) && (resource != Resources.GameOver)) {
                resource.setVolume(volume);
            }
        });
    };
    SoundManager.stop = function () {
        // make sure volume is set for sounds
        _.forIn(Resources, function (resource) {
            if (resource instanceof ex.Sound) {
                resource.setVolume(0);
                if (resource != Resources.SoundMusic) {
                    resource.stop();
                }
            }
        });
    };
    return SoundManager;
})();
/// <reference path="config.ts" />
/// <reference path="resources.ts" />
/// <reference path="util.ts" />
/// <reference path="map.ts" />
/// <reference path="blood.ts" />
/// <reference path="monster.ts" />
/// <reference path="hero.ts" />
/// <reference path="treasure.ts" />
/// <reference path="stats.ts" />
/// <reference path="options.ts" />
/// <reference path="gameover.ts" />
/// <reference path="soundmanager.ts" />
var game = new ex.Engine({
    canvasElementId: "game",
    width: 960,
    height: 640
});
game.setAntialiasing(false);
var loader = new ex.Loader();
// load up all resources in dictionary
_.forIn(Resources, function (resource) {
    loader.addResource(resource);
});
// game settings
var logger = ex.Logger.getInstance();
document.getElementById("toggle-sounds").addEventListener("click", function () {
    SoundManager.stop();
    Options.sound = !Options.sound;
    SoundManager.start();
    // logger.info('toggling sounds to '  + Options.sound);
});
document.getElementById("toggle-music").addEventListener("click", function () {
    SoundManager.stop();
    Options.music = !Options.music;
    SoundManager.start();
    // logger.info('toggling music to ' + Options.music);
});
document.getElementById("toggle-blood").addEventListener("click", function () {
    Options.blood = !Options.blood;
    HeroSpawner.toggleTombstones(Options.blood);
    // logger.info('toggling blood to ' + Options.blood);
});
// enable game pad input
game.input.gamepads.enabled = true;
var blood = new Blood();
var map = new Map(game);
var settings = new Settings(game);
var gameOver = new GameOver(game);
var isGameOver = false;
var heroTimer;
game.start(loader).then(function () {
    game.backgroundColor = ex.Color.Black;
    // Resources.AxeSwing.setVolume(1);
    // load map   
    game.add('map', map);
    game.goToScene('map');
    game.add('settings', settings);
    game.add('gameover', gameOver);
    // set zoom
    game.currentScene.camera.zoom(1.5);
    // defend intro
    var defendIntro = new ex.UIActor(game.width / 2, game.height / 2, 858, 105);
    defendIntro.anchor.setTo(0.5, 0.5);
    // defendIntro.scale.setTo(0.6, 0.6); doesn't work
    defendIntro.addDrawing(Resources.TextureTextDefend);
    defendIntro.opacity = 0;
    defendIntro.previousOpacity = 0;
    game.add(defendIntro);
    // fade don't work
    defendIntro.delay(1000).callMethod(function () {
        defendIntro.opacity = 1;
        Resources.AnnouncerDefend.play();
    }).delay(2000).callMethod(function () {
        defendIntro.kill();
        HeroSpawner.spawnHero();
    });
    heroTimer = new ex.Timer(function () { return HeroSpawner.spawnHero(); }, Config.HeroSpawnInterval, true);
    game.add(heroTimer);
});
