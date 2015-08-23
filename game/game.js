var Config = {
    MonsterHealth: 30,
    MonsterWidth: 48,
    MonsterHeight: 48,
    MonsterSpeed: 200,
    MonsterAttackRange: 80,
    CameraElasticity: 0.05,
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
    HeroAttackCooldown: 2000,
    // The maximum distance a hero will aggro to the monster
    HeroAggroDistance: 100,
    // Amount of gold heroes can carry
    TreasureStealAmount: 1,
    // Amount of gold in each treasure stash
    TreasureHoardSize: 5,
    // Treasure progress indicator width (in px)
    TreasureProgressSize: 600
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
        var playerSpawn = this.getCellPos(19, 19);
        this._player = new Monster(playerSpawn.x, playerSpawn.y);
        this.add(this._player);
    };
    Map.prototype.getPlayer = function () {
        return this._player;
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
                if (cell !== 0 && cell !== 199) {
                    wall = new ex.Actor(x * Map.CellSize, y * Map.CellSize, 24, 24 /*, ex.Color.Red*/);
                    wall.anchor.setTo(0, 0);
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
        if ((curr + looting) <= 0) {
            this._gameOver();
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
    Map.prototype._gameOver = function () {
        //TODO
        console.log('game over');
        game.goToScene('gameover');
    };
    Map.CellSize = 24;
    return Map;
})(ex.Scene);
var BloodEmitter = (function (_super) {
    __extends(BloodEmitter, _super);
    function BloodEmitter(x, y) {
        _super.call(this, x, y);
        this.amount = 0.5;
        this.force = 0.5;
        this.angle = 0;
        this._bleedTimer = 0;
        this._splatterTimer = 0;
        this._particles = [];
    }
    BloodEmitter.prototype.splatter = function () {
        this._splatterTimer = 200;
        this._particles.length = 0;
        var pixelAmount = this.amount * 500;
        var vMin = 5;
        var vMax = 100;
        for (var i = 0; i < pixelAmount; i++) {
            this._particles.push({
                x: this.x,
                y: this.y,
                d: ex.Vector.fromAngle(this.angle + ex.Util.randomInRange(-Math.PI / 4, Math.PI / 4)),
                v: ex.Util.randomIntInRange(vMin, vMax)
            });
        }
    };
    BloodEmitter.prototype.bleed = function (duration) {
        this._bleedTimer = duration;
    };
    BloodEmitter.prototype.draw = function (ctx, delta) {
        _super.prototype.draw.call(this, ctx, delta);
        // todo
    };
    BloodEmitter.prototype.update = function (engine, delta) {
        this._bleedTimer = Math.max(0, this._bleedTimer - delta);
        this._splatterTimer = Math.max(0, this._splatterTimer - delta);
        // update particle positions
        var particle, i, ray;
        for (i = 0; i < this._particles.length; i++) {
            particle = this._particles[i];
            ray = new ex.Ray(new ex.Point(particle.x, particle.y), ex.Vector.fromAngle(particle.d));
            particle.x = (this.force * (this._splatterTimer * particle.v));
        }
    };
    return BloodEmitter;
})(ex.Actor);
/// <reference path="game.ts" />
/// <reference path="config.ts" />
var Monster = (function (_super) {
    __extends(Monster, _super);
    function Monster(x, y) {
        _super.call(this, x, y, Config.MonsterWidth, Config.MonsterHeight);
        this.health = Config.MonsterHealth;
        this.color = ex.Color.Red;
        this._mouseX = 0;
        this._mouseY = 0;
        this._rays = new Array();
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
        var spriteSheet = new ex.SpriteSheet(Resources.TextureMonsterDown, 6, 1, 72, 72);
        var attackDownAnim = spriteSheet.getAnimationBetween(engine, 3, 6, 100);
        attackDownAnim.scale.setTo(2, 2);
        attackDownAnim.loop = true;
        this.addDrawing("attackDown", attackDownAnim);
        var idleAnim = spriteSheet.getAnimationBetween(engine, 0, 2, 500);
        idleAnim.loop = true;
        idleAnim.scale.setTo(2, 2);
        this.addDrawing("idleDown", idleAnim);
        var sprite = Resources.TextureMonsterRight.asSprite().clone();
        sprite.scale.setTo(2, 2);
        this.addDrawing("idleRight", sprite);
        this.setDrawing("idleRight");
        var yValues = new Array(-0.62, -0.25, 0, 0.25, 0.62);
        _.forIn(yValues, function (yValue) {
            var rayVector = new ex.Vector(1, yValue);
            var rayPoint = new ex.Point(_this.x, _this.y);
            var ray = new ex.Ray(rayPoint, rayVector);
            that._rays.push(ray);
        });
        // attackda
        engine.input.pointers.primary.on("down", function (evt) {
            that._attack();
            that.setDrawing("attackDown");
        });
    };
    Monster.prototype.update = function (engine, delta) {
        var _this = this;
        _super.prototype.update.call(this, engine, delta);
        if (this.health <= 0) {
            map._gameOver();
        }
        this._attackable.length = 0;
        this._detectAttackable();
        // clear move
        this.dx = 0;
        this.dy = 0;
        // WASD
        if (engine.input.keyboard.isKeyPressed(ex.Input.Keys.W) ||
            engine.input.keyboard.isKeyPressed(ex.Input.Keys.Up)) {
            this.dy = -Config.MonsterSpeed;
        }
        if (engine.input.keyboard.isKeyPressed(ex.Input.Keys.S) ||
            engine.input.keyboard.isKeyPressed(ex.Input.Keys.Down)) {
            this.dy = Config.MonsterSpeed;
        }
        if (engine.input.keyboard.isKeyPressed(ex.Input.Keys.A) ||
            engine.input.keyboard.isKeyPressed(ex.Input.Keys.Left)) {
            this.dx = -Config.MonsterSpeed;
        }
        if (engine.input.keyboard.isKeyPressed(ex.Input.Keys.D) ||
            engine.input.keyboard.isKeyPressed(ex.Input.Keys.Right)) {
            this.dx = Config.MonsterSpeed;
        }
        var prevRotation = this.rotation;
        this.rotation = new ex.Vector(this._mouseX - this.x, this._mouseY - this.y).toAngle();
        // updating attack rays
        _.forIn(this._rays, function (ray) {
            ray.pos = new ex.Point(_this.x, _this.y);
            var rotationAmt = _this.rotation - prevRotation;
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
    };
    Monster.prototype._attack = function () {
        _.forIn(this._attackable, function (hero) {
            // hero.blink(500, 500, 5); //can't because moving already (no parallel actions support)
            game.currentScene.camera.shake(3, 3, 300);
            hero.Health--;
        });
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
    };
    return Monster;
})(ex.Actor);
var Resources = {
    // SomeSound: new ex.Sound('../sounds/foo.mp3')
    TextureHero: new ex.Texture("images/hero.png"),
    TextureHeroLootIndicator: new ex.Texture("images/loot-indicator.png"),
    TextureMonsterDown: new ex.Texture("images/minotaurv2.png"),
    TextureMonsterRight: new ex.Texture("images/minotaurv2right.png"),
    TextureTreasure: new ex.Texture("images/treasure.png"),
    TextureTreasureIndicator: new ex.Texture("images/treasure-indicator.png"),
    TextureMap: new ex.Texture("images/map.png"),
    TextureTextDefend: new ex.Texture("images/text-defend.png")
};
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
    HeroSpawner.despawn = function (h) {
        h.kill();
        _.remove(this._heroes, h);
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
        var _this = this;
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
                if (e.actor._treasure === 0) {
                    e.actor._treasure = e.other.steal();
                    e.actor._fsm.go(HeroStates.Looting);
                }
            }
            else if (e.other instanceof Monster) {
                if (_this._attackCooldown == 0) {
                    var monster = e.other;
                    monster.health--;
                    _this._attackCooldown = Config.HeroAttackCooldown;
                }
            }
        });
        this.onSearching();
    };
    Hero.prototype.update = function (engine, delta) {
        _super.prototype.update.call(this, engine, delta);
        if (this.Health <= 0) {
            map.getTreasures()[0].return(this._treasure);
            HeroSpawner.despawn(this);
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
                if (heroVector.distance(monsterVector) > Config.HeroAggroDistance)
                    this.clearActions();
                this._fsm.go(HeroStates.Searching);
                // console.log('stopping attack');
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
        var treasure = Resources.TextureTreasure.asSprite().clone();
        this.addDrawing(treasure);
        this.collisionType = ex.CollisionType.Passive;
    };
    Treasure.prototype.getAmount = function () {
        return this._hoard;
    };
    Treasure.prototype.steal = function () {
        this._hoard -= Config.TreasureStealAmount;
        return Config.TreasureStealAmount;
    };
    Treasure.prototype.return = function (amount) {
        this._hoard += amount;
    };
    return Treasure;
})(ex.Actor);
var GameOver = (function (_super) {
    __extends(GameOver, _super);
    function GameOver() {
        _super.apply(this, arguments);
    }
    GameOver.prototype.onInitialize = function (engine) {
        game.backgroundColor = ex.Color.Black;
    };
    return GameOver;
})(ex.Scene);
/// <reference path="config.ts" />
/// <reference path="util.ts" />
/// <reference path="map.ts" />
/// <reference path="blood.ts" />
/// <reference path="monster.ts" />
/// <reference path="resources.ts" />
/// <reference path="hero.ts" />
/// <reference path="treasure.ts" />
/// <reference path="gameover.ts" />
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
var map = new Map(game);
var gameOver = new GameOver(game);
game.start(loader).then(function () {
    game.backgroundColor = ex.Color.Black;
    // load map
    game.add('map', map);
    game.goToScene('map');
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
    defendIntro.delay(1000).callMethod(function () { return defendIntro.opacity = 1; }).delay(2000).callMethod(function () { return defendIntro.kill(); });
    var heroTimer = new ex.Timer(function () { return HeroSpawner.spawnHero(); }, Config.HeroSpawnInterval, true);
    game.add(heroTimer);
    HeroSpawner.spawnHero();
});
