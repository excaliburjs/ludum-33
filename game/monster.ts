/// <reference path="game.ts" />
/// <reference path="config.ts" />

class Monster extends ex.Actor {
   
   constructor(x, y){
      super(x, y, Config.MonsterWidth, Config.MonsterHeight);
      this.color = ex.Color.Red;
   }
   
   onInitialize(engine: ex.Engine): void {
      var that = this;
      
      // set the rotation of the actor when the mouse moves
      engine.input.pointers.primary.on('move', (ev) => {
         that.rotation = new ex.Vector(ev.x - that.x, ev.y - that.y).toAngle();
      });
      
   }
   
   public update(engine: ex.Engine, delta: number): void {
      super.update(engine, delta);
      
      // WASD
      if(engine.input.keyboard.isKeyPressed(ex.Input.Keys.Up)) {
         this.dy = -Config.MonsterSpeed;
      }
      
      if(engine.input.keyboard.isKeyPressed(ex.Input.Keys.Down)) {
         this.dy = Config.MonsterSpeed;
      }
      
      if(engine.input.keyboard.isKeyPressed(ex.Input.Keys.Left)) {
         this.dx = -Config.MonsterSpeed;
      }
      
      if(engine.input.keyboard.isKeyPressed(ex.Input.Keys.Right)) {
         this.dx = Config.MonsterSpeed;
      }
      
   }
}