/// <reference path="resources.ts" />
/// <reference path="hero.ts" />
/// <reference path="treasure.ts" />

var game = new ex.Engine({
   canvasElementId: "game",
   width: 800,
   height: 600
});
var loader = new ex.Loader();

// load up all resources in dictionary
_.forIn(Resources, (resource) => {
   loader.addResource(resource);
});

game.start(loader).then(() => {
   
   var hero = new Hero(50, 50, 50, 50, ex.Color.Red);
   game.add(hero);
   
   var treasure = new Treasure(game.width - 50, game.height - 50, 50, 50, ex.Color.Yellow);
   game.add(treasure);
   treasure.setZIndex(-1);
   
   hero.moveTo(treasure.x, treasure.y, 100);
   
});