/// <reference path="config.ts" />
/// <reference path="resources.ts" />
/// <reference path="util.ts" />
/// <reference path="map.ts" />
/// <reference path="blood.ts" />
/// <reference path="monster.ts" />
/// <reference path="hero.ts" />
/// <reference path="treasure.ts" />
/// <reference path="stats.ts" />
/// <reference path="gameover.ts" />

var game = new ex.Engine({
   canvasElementId: "game",
   width: 960,
   height: 640
});
game.setAntialiasing(false);

var loader = new ex.Loader();

// load up all resources in dictionary
_.forIn(Resources, (resource) => {
   loader.addResource(resource);
});

var blood = new Blood();
var map = new Map(game);
var gameOver = new GameOver(game);
var isGameOver = false;

game.start(loader).then(() => {
   
   game.backgroundColor = ex.Color.Black;
   // Resources.AxeSwing.setVolume(1);
   
   // load map   
   game.add('map', map);
   game.goToScene('map');
   game.add('gameover', gameOver);
   
   // set zoom
   game.currentScene.camera.zoom(1.5);
   
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