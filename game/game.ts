/// <reference path="config.ts" />
/// <reference path="util.ts" />
/// <reference path="map.ts" />
/// <reference path="blood.ts" />
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

var map = new Map(game);

game.start(loader).then(() => {
   
   // load map
   game.add("map", map);
   game.goToScene("map");
   
   // set zoom
   game.currentScene.camera.zoom(1.7);
   
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

   var heroTimer = new ex.Timer(() => HeroSpawner.spawnHero(), Config.HeroSpawnInterval, true);
   game.add(heroTimer);
   
   HeroSpawner.spawnHero();  
});