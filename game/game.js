var Config = {
    PlayerCellSpawnX: 19,
    PlayerCellSpawnY: 19,
    MonsterHealth: 30,
    MonsterWidth: 48,
    MonsterHeight: 48,
    MonsterSpeed: 200,
    MonsterAttackRange: 90,
    CloseMonsterAttackRange: 50,
    MonsterProgressSize: 200,
    MonsterAttackTime: 300,
    BloodMaxAmount: 300,
    BloodMinFriction: 0.15,
    BloodMaxFriction: 0.40,
    BloodXYVariation: 6,
    BloodSplatterMinAngle: ex.Util.toRadians(20),
    BloodSplatterMaxAngle: ex.Util.toRadians(20),
    BloodSplatterAngleVariation: ex.Util.toRadians(15),
    BloodVelocityMin: 10,
    BloodVelocityMax: 40,
    CameraElasticity: 0.1,
    CameraFriction: 0.5,
    CameraShake: 0,
    CameraShakeDuration: 0,
    // Spawn interval
    HeroSpawnInterval: 10000,
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
    HeroAggroDistance: 100,
    HeroMeleeRange: 20,
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
    BloodSpatter: new ex.Sound('sounds/blood-splatter-1.wav'),
    AnnouncerDefend: new ex.Sound('sounds/defend.wav'),
    SoundMusic: new ex.Sound('sounds/music.mp3'),
    TextureHero: new ex.Texture("images/hero.png"),
    TextureHeroLootIndicator: new ex.Texture("images/loot-indicator.png"),
    TextureMonsterDown: new ex.Texture("images/minotaurv2.png"),
    TextureMonsterRight: new ex.Texture("images/minotaurv2right.png"),
    TextureMonsterUp: new ex.Texture("images/minotaurv2back.png"),
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
        this._cameraVel = new ex.Vector(0, 0);
        this._treasures = [];
    }
    Map.prototype.onInitialize = function () {
        this._map = new ex.Actor(0, 0, 960, 960);
        this._map.anchor.setTo(0, 0);
        this._map.addDrawing(Resources.TextureMap);
        this.add(this._map);
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
        // copy from exported Tiled JSON "walls" layer
        var data = [58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 58, 58, 58, 58, 58, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 58, 58, 58, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 58, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 199, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 199, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 58, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 58, 58, 58, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 58, 58, 58, 58, 58, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58];
        var x, y, cell, wall;
        for (x = 0; x < 40; x++) {
            for (y = 0; y < 40; y++) {
                cell = data[x + y * 40];
                if (cell == 58) {
                    wall = new ex.Actor(x * Map.CellSize, y * Map.CellSize, 24, 24);
                    wall.traits.length = 0;
                    wall.traits.push(new ex.Traits.OffscreenCulling());
                    wall.anchor.setTo(0, 0);
                    wall.addDrawing(Resources.TextureWall);
                    wall.collisionType = ex.CollisionType.Fixed;
                    this.add(wall);
                }
            }
        }
    };
    Map.prototype.getCellPos = function (x, y) {
        return new ex.Point(Map.CellSize * x, Map.CellSize * y);
    };
    Map.prototype.update = function (engine, delta) {
        _super.prototype.update.call(this, engine, delta);
        // update treasure indicator
        var total = this._treasures.length * Config.TreasureHoardSize;
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
    Map.prototype._gameOver = function (type) {
        //TODO
        console.log('game over');
        isGameOver = true;
        game.goToScene('gameover');
        gameOver.setType(type);
    };
    Map.prototype.onDeactivate = function () {
        SoundManager.stop();
    };
    Map.CellSize = 24;
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
        this._emitters.push(new SplatterEmitter(x, y, sprite, amount, force, angle - ex.Util.toRadians(15), angle + ex.Util.toRadians(15)));
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
        var vMin = Config.BloodVelocityMin;
        var vMax = force * Config.BloodVelocityMax;
        var xMin = x - Config.BloodXYVariation;
        var yMin = y - Config.BloodXYVariation;
        var xMax = x + Config.BloodXYVariation;
        var yMax = y + Config.BloodXYVariation;
        // curve in direction
        var av = ex.Util.randomInRange(-Config.BloodSplatterAngleVariation, Config.BloodSplatterAngleVariation);
        for (var i = 0; i < pixelAmount; i++) {
            this._particles.push({
                x: ex.Util.randomIntInRange(xMin, xMax),
                y: ex.Util.randomIntInRange(yMin, yMax),
                f: ex.Util.randomInRange(Config.BloodMinFriction, Config.BloodMaxFriction),
                d: ex.Vector.fromAngle(ex.Util.randomInRange(minAngle, maxAngle)),
                v: ex.Util.randomIntInRange(vMin, vMax),
                av: av,
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
        this.color = ex.Color.Red;
        this._mouseX = 0;
        this._mouseY = 0;
        this._rays = new Array();
        this._closeRays = new Array();
        this._attackable = new Array();
        this.anchor = new ex.Point(0.35, 0.35);
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
        var downSpriteSheet = new ex.SpriteSheet(Resources.TextureMonsterDown, 14, 1, 96, 96);
        var rightSpriteSheet = new ex.SpriteSheet(Resources.TextureMonsterRight, 14, 1, 96, 96);
        var upSpriteSheet = new ex.SpriteSheet(Resources.TextureMonsterUp, 14, 1, 96, 96);
        var attackDownAnim = downSpriteSheet.getAnimationBetween(engine, 9, 13, Config.MonsterAttackTime / 4);
        attackDownAnim.scale.setTo(2, 2);
        attackDownAnim.loop = true;
        this.addDrawing("attackDown", attackDownAnim);
        var walkDownAnim = downSpriteSheet.getAnimationByIndices(engine, [2, 3, 4, 5, 6, 7], 150);
        walkDownAnim.scale.setTo(2, 2);
        walkDownAnim.loop = true;
        this.addDrawing("walkDown", walkDownAnim);
        var attackUpAnim = upSpriteSheet.getAnimationBetween(engine, 9, 13, Config.MonsterAttackTime / 4);
        attackUpAnim.scale.setTo(2, 2);
        attackUpAnim.loop = true;
        this.addDrawing("attackUp", attackUpAnim);
        var walkUpAnim = upSpriteSheet.getAnimationByIndices(engine, [2, 3, 4, 5, 6, 7], 150);
        walkUpAnim.scale.setTo(2, 2);
        walkUpAnim.loop = true;
        this.addDrawing("walkUp", walkUpAnim);
        var attackRightAnim = rightSpriteSheet.getAnimationBetween(engine, 9, 13, Config.MonsterAttackTime / 4);
        attackRightAnim.scale.setTo(2, 2);
        attackRightAnim.loop = true;
        this.addDrawing("attackRight", attackRightAnim);
        var walkRightAnim = rightSpriteSheet.getAnimationByIndices(engine, [2, 3, 4, 5, 6, 7], 150);
        walkRightAnim.scale.setTo(2, 2);
        walkRightAnim.loop = true;
        this.addDrawing("walkRight", walkRightAnim);
        var attackLeftAnim = rightSpriteSheet.getAnimationBetween(engine, 9, 13, Config.MonsterAttackTime / 4);
        attackLeftAnim.flipHorizontal = true;
        attackLeftAnim.scale.setTo(2, 2);
        attackLeftAnim.loop = true;
        this.addDrawing("attackLeft", attackLeftAnim);
        var walkLeftAnim = rightSpriteSheet.getAnimationByIndices(engine, [2, 3, 4, 5, 6, 7], 150);
        walkLeftAnim.flipHorizontal = true;
        walkLeftAnim.scale.setTo(2, 2);
        walkLeftAnim.loop = true;
        this.addDrawing("walkLeft", walkLeftAnim);
        var idleAnim = downSpriteSheet.getAnimationBetween(engine, 0, 2, 500);
        idleAnim.loop = true;
        idleAnim.scale.setTo(2, 2);
        this.addDrawing("idleDown", idleAnim);
        var idleUpAnim = upSpriteSheet.getAnimationBetween(engine, 0, 2, 500);
        idleUpAnim.loop = true;
        idleUpAnim.scale.setTo(2, 2);
        this.addDrawing("idleUp", idleUpAnim);
        var idleRightAnim = rightSpriteSheet.getAnimationBetween(engine, 0, 2, 500);
        idleRightAnim.scale.setTo(2, 2);
        idleRightAnim.loop = true;
        this.addDrawing("idleRight", idleRightAnim);
        var idleLeftAnim = rightSpriteSheet.getAnimationBetween(engine, 0, 2, 500);
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
            that._attack();
            that._isAttacking = true;
            that._timeLeftAttacking = Config.MonsterAttackTime;
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
    Monster.prototype.update = function (engine, delta) {
        var _this = this;
        _super.prototype.update.call(this, engine, delta);
        if (this.health <= 0) {
            map._gameOver(GameOverType.Slain);
        }
        this._attackable.length = 0;
        this._detectAttackable();
        // clear move
        this.dx = 0;
        this.dy = 0;
        var prevRotation = this._rotation;
        this._rotation = ex.Util.canonicalizeAngle(new ex.Vector(this._mouseX - this.x, this._mouseY - this.y).toAngle());
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
                this.setDrawing("walkLeft");
            }
        }
        if (engine.input.keyboard.isKeyPressed(ex.Input.Keys.D) ||
            engine.input.keyboard.isKeyPressed(ex.Input.Keys.Right)) {
            if (!this._isAttacking) {
                this.dx = Config.MonsterSpeed;
                this.setDrawing("walkRight");
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
        this.setZIndex(this.y);
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
            game.currentScene.camera.shake(2, 2, 200);
            hero.Health--;
            hitHero = true;
            var origin = new ex.Vector(hero.x, hero.y);
            var dest = new ex.Vector(_this.x, _this.y);
            var a = origin.subtract(dest).toAngle();
            blood.splatter(hero.x, hero.y, Blood.BloodPixel, 0.7, 0.8, a);
        });
        if (hitHero) {
            Resources.AxeSwingHit.play();
        }
        else {
            Resources.AxeSwing.play();
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
})(HeroStates || (HeroStates = {}));
var HeroSpawner = (function () {
    function HeroSpawner() {
    }
    HeroSpawner.spawnHero = function () {
        HeroSpawner._spawned++;
        // todo better spawning logic
        for (var i = 0; i < Math.min(Config.HeroSpawnPoolMax, HeroSpawner._spawned); i++) {
            var spawnPoints = map.getSpawnPoints();
            var spawnPoint = Util.pickRandom(spawnPoints);
            var hero = new Hero(spawnPoint.x, spawnPoint.y);
            game.add(hero);
            this._heroes.push(hero);
        }
    };
    HeroSpawner.getHeroes = function () {
        return this._heroes;
    };
    HeroSpawner.despawn = function (h, blood) {
        if (blood === void 0) { blood = false; }
        if (blood) {
            var tombstone = new ex.Actor(h.x, h.y, 24, 24);
            var sprites = [Resources.TextureHeroDead, Resources.TextureHeroDead2, Resources.TextureHeroDead3];
            tombstone.traits.length = 0;
            // todo bug with actor scaling
            var sprite = Util.pickRandom(sprites).asSprite();
            sprite.scale.setTo(2, 2);
            tombstone.addDrawing("default", sprite);
            game.add(tombstone);
        }
        h.kill();
        _.remove(this._heroes, h);
    };
    HeroSpawner.reset = function () {
        HeroSpawner._spawned = 0;
    };
    HeroSpawner._spawned = 0;
    HeroSpawner._heroes = [];
    return HeroSpawner;
})();
var Hero = (function (_super) {
    __extends(Hero, _super);
    function Hero(x, y) {
        _super.call(this, x, y, 24, 24);
        this.Health = Config.HeroHealth;
        this._treasure = 0;
        this._attackCooldown = Config.HeroAttackCooldown;
        this._hasHitMinotaur = false;
        this._fsm = new TypeState.FiniteStateMachine(HeroStates.Searching);
        // declare valid state transitions
        this._fsm.from(HeroStates.Searching).to(HeroStates.Attacking, HeroStates.Looting);
        this._fsm.from(HeroStates.Attacking).to(HeroStates.Searching);
        this._fsm.from(HeroStates.Looting).to(HeroStates.Fleeing);
        this._fsm.on(HeroStates.Searching, this.onSearching.bind(this));
        this._fsm.on(HeroStates.Looting, this.onLooting.bind(this));
        this._fsm.on(HeroStates.Fleeing, this.onFleeing.bind(this));
        this._fsm.on(HeroStates.Attacking, this.onAttacking.bind(this));
    }
    Hero.prototype.onInitialize = function (engine) {
        this.setZIndex(1);
        this._lootIndicator = new ex.Actor(5, -24, 24, 24);
        this._lootIndicator.addDrawing(Resources.TextureHeroLootIndicator);
        this._lootIndicator.scale.setTo(1.5, 1.5);
        this._lootIndicator.moveBy(5, -32, 200).moveBy(5, -24, 200).repeatForever();
        var spriteSheet = new ex.SpriteSheet(Resources.TextureHero, 3, 1, 28, 28);
        var idleAnim = spriteSheet.getAnimationForAll(engine, 300);
        idleAnim.loop = true;
        idleAnim.scale.setTo(2, 2);
        this.addDrawing("idle", idleAnim);
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
                    var monster = e.other;
                    monster.health--;
                    Stats.damageTaken++;
                    hero._attackCooldown = Config.HeroAttackCooldown;
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
            HeroSpawner.despawn(this, Options.blood);
        }
        this.setZIndex(this.y);
        this._attackCooldown = Math.max(this._attackCooldown - delta, 0);
        var heroVector = new ex.Vector(this.x, this.y);
        var monsterVector = new ex.Vector(map._player.x, map._player.y);
        switch (this._fsm.currentState) {
            case HeroStates.Searching:
                if (heroVector.distance(monsterVector) < Config.HeroAggroDistance) {
                    this._fsm.go(HeroStates.Attacking);
                }
                break;
            case HeroStates.Attacking:
                if (heroVector.distance(monsterVector) > Config.HeroAggroDistance) {
                    this.clearActions();
                    this._fsm.go(HeroStates.Searching);
                }
                else if (heroVector.distance(monsterVector) < Config.HeroMeleeRange) {
                    this.clearActions();
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
    Hero.prototype.onSearching = function (from) {
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
        if (this._hoard > 0) {
            this._hoard -= Config.TreasureStealAmount;
            return Config.TreasureStealAmount;
        }
        else {
            return 0;
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
            SoundManager.toggleMusic();
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
            SoundManager.toggleSoundEffects();
        });
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
        this._labelHeroesKilled = new ex.Label(null, 219, 340, "36px Arial");
        this._labelHeroesKilled.textAlign = ex.TextAlign.Center;
        this._labelHeroesEscaped = new ex.Label(null, 402, 340, "36px Arial");
        this._labelHeroesEscaped.textAlign = ex.TextAlign.Center;
        this._labelGoldLost = new ex.Label(null, 570, 340, "36px Arial");
        this._labelGoldLost.textAlign = ex.TextAlign.Center;
        this._labelDamageTaken = new ex.Label(null, 743, 340, "36px Arial");
        this._labelDamageTaken.textAlign = ex.TextAlign.Center;
        this._labelHeroesKilled.color = ex.Color.White;
        this._labelHeroesEscaped.color = ex.Color.White;
        this._labelGoldLost.color = ex.Color.White;
        this._labelDamageTaken.color = ex.Color.White;
        this.add(this._labelHeroesKilled);
        this.add(this._labelHeroesEscaped);
        this.add(this._labelGoldLost);
        this.add(this._labelDamageTaken);
        var retryButton = new ex.Actor(game.width / 2, 423, 252, 56);
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
            game.goToScene('map');
        });
    };
    GameOver.prototype.update = function (engine, delta) {
        this._labelHeroesKilled.text = Stats.numHeroesKilled.toString();
        this._labelHeroesEscaped.text = Stats.numHeroesEscaped.toString();
        this._labelGoldLost.text = Stats.goldLost.toString();
        this._labelDamageTaken.text = Stats.damageTaken.toString();
        // center labels
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
        // make sure volume is set for sounds
        _.forIn(Resources, function (resource) {
            if (resource instanceof ex.Sound) {
                resource.setVolume(1);
            }
        });
        SoundManager.setSoundEffectLevels();
        Resources.SoundMusic.play();
        Resources.SoundMusic.setLoop(true);
    };
    SoundManager.setSoundEffectLevels = function () {
        Resources.AxeSwingHit.setVolume(0.2);
        Resources.SoundMusic.setVolume(0.05);
    };
    SoundManager.toggleSoundEffects = function () {
        var volume;
        if (Options.music) {
            volume = 0;
        }
        else {
            volume = 1;
        }
        _.forIn(Resources, function (resource) {
            if (resource instanceof ex.Sound && (resource != Resources.SoundMusic)) {
                resource.setVolume(volume);
            }
        });
        if (volume == 1) {
            SoundManager.setSoundEffectLevels();
        }
    };
    SoundManager.toggleMusic = function () {
        var volume;
        if (Options.sound) {
            volume = 0;
        }
        else {
            volume = 1;
        }
        Resources.SoundMusic.setVolume(volume);
    };
    SoundManager.stop = function () {
        // make sure volume is set for sounds
        _.forIn(Resources, function (resource) {
            if (resource instanceof ex.Sound) {
                resource.setVolume(0);
                resource.stop();
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
    }).delay(2000).callMethod(function () { return defendIntro.kill(); });
    heroTimer = new ex.Timer(function () { return HeroSpawner.spawnHero(); }, Config.HeroSpawnInterval, true);
    game.add(heroTimer);
    HeroSpawner.spawnHero();
});
