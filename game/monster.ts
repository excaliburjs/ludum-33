/// <reference path="game.ts" />
/// <reference path="config.ts" />

class Monster extends ex.Actor {
   private _mouseX: number;
   private _mouseY: number;
   
   constructor(x, y){
      super(x, y, Config.MonsterWidth * 3, Config.MonsterHeight * 3);
      this.color = ex.Color.Red;
      this._mouseX = 0;
      this._mouseY = 0;
      
   }
   
   onInitialize(engine: ex.Engine): void {
      var that = this;
      
      // set the rotation of the actor when the mouse moves
      engine.input.pointers.primary.on('move', (ev: PointerEvent) => {
         this._mouseX = ev.x;
         this._mouseY = ev.y;
         
      });
      var sprite = Resources.TextureMonster.asSprite().clone();
      sprite.scale.setTo(3, 3);
      this.addDrawing(sprite);
   }
   
   public update(engine: ex.Engine, delta: number): void {
      super.update(engine, delta);
      
      // clear move
      this.dx = 0;
      this.dy = 0;
      
      // WASD
      if(engine.input.keyboard.isKeyPressed(ex.Input.Keys.W)) {
         this.dy = -Config.MonsterSpeed;
      }
      
      if(engine.input.keyboard.isKeyPressed(ex.Input.Keys.S)) {
         this.dy = Config.MonsterSpeed;
      }
      
      if(engine.input.keyboard.isKeyPressed(ex.Input.Keys.A)) {
         this.dx = -Config.MonsterSpeed;
      }
      
      if(engine.input.keyboard.isKeyPressed(ex.Input.Keys.D)) {
         this.dx = Config.MonsterSpeed;
      }
      this.rotation = new ex.Vector(this._mouseX - this.x, this._mouseY - this.y).toAngle();
   }
}