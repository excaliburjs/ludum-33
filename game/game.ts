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
_.forIn(Resources, (resource) => {
   loader.addResource(resource);
});

game.start(loader).then(() => {
   
   // magic here bro
   var map = new ex.Actor(0, 0, game.width, game.height);
   map.addDrawing(Resources.TextureMap);
   map.anchor.setTo(0, 0);
   game.add(map);

   var hero = new Hero(50, 50, 50, 50, ex.Color.Red);
   game.add(hero);
   
   var treasure = new Treasure(game.width - 50, game.height - 50, 50, 50, ex.Color.Yellow);
   game.add(treasure);
   hero.setZIndex(1);
   
   hero.moveTo(treasure.x, treasure.y, 100);
   
});