/// <reference path="config.ts" />
/// <reference path="analytics.ts" />
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
_.forIn(Resources, (resource) => {
   loader.addResource(resource);
});

// game settings
var logger = ex.Logger.getInstance();
document.getElementById("toggle-sounds").addEventListener("click", () => {
   SoundManager.stop();
   Options.sound = !Options.sound;
   SoundManager.start();
   // logger.info('toggling sounds to '  + Options.sound);
});

document.getElementById("toggle-music").addEventListener("click", () => {
   SoundManager.stop();
   Options.music = !Options.music;
   SoundManager.start();
   // logger.info('toggling music to ' + Options.music);
});

document.getElementById("toggle-blood").addEventListener("click", () => {
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
var heroTimer: ex.Timer;

game.start(loader).then(() => {
   
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
   var defendIntro = new ex.UIActor(game.width/2, game.height/2, 858, 105);
   defendIntro.anchor.setTo(0.5, 0.5);
   // defendIntro.scale.setTo(0.6, 0.6); doesn't work
   defendIntro.addDrawing(Resources.TextureTextDefend);
   defendIntro.opacity = 0;   
   defendIntro.previousOpacity = 0;
   game.add(defendIntro);
   // fade don't work
   defendIntro.delay(1000).callMethod(() => {
      defendIntro.opacity = 1; 
      Resources.AnnouncerDefend.play();      
   }).delay(2000).callMethod(() => {
      defendIntro.kill(); 
      HeroSpawner.spawnHero();       
   });
         
   heroTimer = new ex.Timer(() => HeroSpawner.spawnHero(), Config.HeroSpawnInterval, true);
   game.add(heroTimer);    
});