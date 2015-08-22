/// <reference path="resources.ts" />

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
   
   // magic here bro
   
});