var Resources = {
    // SomeSound: new ex.Sound('../sounds/foo.mp3')
    TextureHero: new ex.Texture("images/hero.png"),
    TextureMonster: new ex.Texture("images/monster.png"),
    TextureTreasure: new ex.Texture("images/treasure.png"),
    TextureMap: new ex.Texture("images/map.png")
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Hero = (function (_super) {
    __extends(Hero, _super);
    function Hero(x, y, width, height, color) {
        _super.call(this, x, y, width, height, color);
        // this.addDrawing(Resources.TextureHero);
    }
    Hero.prototype.onInitialize = function () {
        this.addDrawing(Resources.TextureHero);
    };
    return Hero;
})(ex.Actor);
var Treasure = (function (_super) {
    __extends(Treasure, _super);
    function Treasure(x, y, width, height, color) {
        _super.call(this, x, y, width, height, color);
    }
    return Treasure;
})(ex.Actor);
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
game.start(loader).then(function () {
    // magic here bro
    var map = new ex.Actor(0, 0, game.width, game.height);
    map.addDrawing(Resources.TextureMap);
    map.anchor.setTo(0, 0);
    game.add(map);
    var hero = new Hero(50, 50, 50, 50, ex.Color.Red);
    game.add(hero);
    var treasure = new Treasure(game.width - 50, game.height - 50, 50, 50, ex.Color.Yellow);
    game.add(treasure);
    treasure.setZIndex(-1);
    hero.moveTo(treasure.x, treasure.y, 100);
});
