/// <reference path="config.ts" />
/// <reference path="monster.ts" />
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


var monster: Monster = null;

// mess with camera to lerp to the monster
var cameraVel = new ex.Vector(0, 0);
game.on('update', function(){
	if(monster) {
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


game.start(loader).then(() => {
   // magic here
   var monster = new Monster(game.width/2, game.height/2);
   game.add(monster);   
});