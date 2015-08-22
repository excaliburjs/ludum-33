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
game.setAntialiasing(false);

var loader = new ex.Loader();

// load up all resources in dictionary
_.forIn(Resources, (resource) => {
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

game.currentScene.camera.zoom(2);

game.start(loader).then(() => {
   
   // defend intro
   var defendIntro = new ex.UIActor(game.width/2, game.height/2, 858, 105);
   defendIntro.anchor.setTo(0.5, 0.5);
   // defendIntro.scale.setTo(0.6, 0.6); doesn't work
   defendIntro.addDrawing(Resources.TextureTextDefend);
   defendIntro.opacity = 0;   
   defendIntro.previousOpacity = 0;
   game.add(defendIntro);
   // fade don't work
   defendIntro.delay(1000).callMethod(() => defendIntro.opacity = 1).delay(2000).callMethod(() => defendIntro.kill());
   
   // magic here bro
   var map = new ex.Actor(0, 0, game.width, game.height);
   map.addDrawing(Resources.TextureMap);
   map.anchor.setTo(0, 0);
   game.add(map);

   monster = new Monster(game.width/2, game.height/2);
   game.add(monster);

   var hero = new Hero(50, 50, 50, 50, ex.Color.Red);
   game.add(hero);
   hero.setZIndex(1);
   
   var treasure = new Treasure(game.width - 50, game.height - 50, 50, 50, ex.Color.Yellow);
   game.add(treasure);
   
   hero.moveTo(treasure.x, treasure.y, 100);
   
});