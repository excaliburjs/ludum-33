var Config = {
    MonsterWidth: 48,
    MonsterHeight: 48,
    MonsterSpeed: 300,
    CameraElasticity: .01,
    CameraFriction: .21,
    CameraShake: 7,
    CameraShakeDuration: 800
};
/// <reference path="game.ts" />
/// <reference path="config.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Monster = (function (_super) {
    __extends(Monster, _super);
    function Monster(x, y) {
        _super.call(this, x, y, Config.MonsterWidth, Config.MonsterHeight);
        this.color = ex.Color.Red;
        this._mouseX = 0;
        this._mouseY = 0;
    }
    Monster.prototype.onInitialize = function (engine) {
        var _this = this;
        var that = this;
        // set the rotation of the actor when the mouse moves
        engine.input.pointers.primary.on('move', function (ev) {
            _this._mouseX = ev.x;
            _this._mouseY = ev.y;
        });
    };
    Monster.prototype.update = function (engine, delta) {
        _super.prototype.update.call(this, engine, delta);
        // clear move
        this.dx = 0;
        this.dy = 0;
        // WASD
        if (engine.input.keyboard.isKeyPressed(ex.Input.Keys.W)) {
            this.dy = -Config.MonsterSpeed;
        }
        if (engine.input.keyboard.isKeyPressed(ex.Input.Keys.S)) {
            this.dy = Config.MonsterSpeed;
        }
        if (engine.input.keyboard.isKeyPressed(ex.Input.Keys.A)) {
            this.dx = -Config.MonsterSpeed;
        }
        if (engine.input.keyboard.isKeyPressed(ex.Input.Keys.D)) {
            this.dx = Config.MonsterSpeed;
        }
        this.rotation = new ex.Vector(this._mouseX - this.x, this._mouseY - this.y).toAngle();
    };
    return Monster;
})(ex.Actor);
var Resources = {
    // SomeSound: new ex.Sound('../sounds/foo.mp3')
    TextureHero: new ex.Texture("images/hero.png"),
    TextureMonster: new ex.Texture("images/monster.png"),
    TextureTreasure: new ex.Texture("images/treasure.png"),
    TextureMap: new ex.Texture("images/map.png")
};
var Hero = (function (_super) {
    __extends(Hero, _super);
    function Hero(x, y, width, height, color) {
        _super.call(this, x, y, width, height, color);
        this.addDrawing(Resources.TextureHero);
    }
    return Hero;
})(ex.Actor);
var Treasure = (function (_super) {
    __extends(Treasure, _super);
    function Treasure(x, y, width, height, color) {
        _super.call(this, x, y, width, height, color);
        this.addDrawing(Resources.TextureTreasure);
    }
    return Treasure;
})(ex.Actor);
/// <reference path="config.ts" />
/// <reference path="monster.ts" />
/// <reference path="resources.ts" />
/// <reference path="hero.ts" />
/// <reference path="treasure.ts" />
var game = new ex.Engine({
    canvasElementId: "game",
    width: 960,
    height: 480
});
var loader = new ex.Loader();
// load up all resources in dictionary
_.forIn(Resources, function (resource) {
    loader.addResource(resource);
});
var monster = null;
// mess with camera to lerp to the monster
var cameraVel = new ex.Vector(0, 0);
game.on('update', function () {
    if (monster) {
        var focus = game.currentScene.camera.getFocus().toVector();
        var position = new ex.Vector(monster.x, monster.y);
        var stretch = position.minus(focus).scale(Config.CameraElasticity);
        cameraVel = cameraVel.plus(stretch);
        var friction = cameraVel.scale(-1).scale(Config.CameraFriction);
        cameraVel = cameraVel.plus(friction);
        focus = focus.plus(cameraVel);
        game.currentScene.camera.setFocus(focus.x, focus.y);
    }
});
game.start(loader).then(function () {
    // magic here bro
    var map = new ex.Actor(0, 0, game.width, game.height);
    map.addDrawing(Resources.TextureMap);
    map.anchor.setTo(0, 0);
    game.add(map);
    var monster = new Monster(game.width / 2, game.height / 2);
    game.add(monster);
    var hero = new Hero(50, 50, 50, 50, ex.Color.Red);
    game.add(hero);
    var treasure = new Treasure(game.width - 50, game.height - 50, 50, 50, ex.Color.Yellow);
    game.add(treasure);
    hero.setZIndex(1);
    hero.moveTo(treasure.x, treasure.y, 100);
});
