/// <reference path="game.ts" />
/// <reference path="config.ts" />

class Monster extends ex.Actor {
   private _mouseX: number;
   private _mouseY: number;
   
   private _rays: ex.Ray[];
   
   constructor(x, y){
      super(x, y, Config.MonsterWidth * 3, Config.MonsterHeight * 3);
      this.color = ex.Color.Red;
      this._mouseX = 0;
      this._mouseY = 0;
      this._rays = new Array<ex.Ray>();
   }
   
   onInitialize(engine: ex.Engine): void {
      var that = this;
      
      // set the rotation of the actor when the mouse moves
      engine.input.pointers.primary.on('move', (ev: PointerEvent) => {
         this._mouseX = ev.x;
         this._mouseY = ev.y;
         
      });
      var spriteSheet = new ex.SpriteSheet(Resources.TextureMonster, 3, 1, 40, 36);
      var idleAnim = spriteSheet.getAnimationForAll(engine, 500);
      idleAnim.loop = true;
      idleAnim.scale.setTo(2, 2);
      this.addDrawing("idle", idleAnim);
      var sprite = Resources.TextureMonster.asSprite().clone();
      sprite.scale.setTo(3, 3);
      this.addDrawing(sprite);
      
      var yValues = new Array<number>(-0.62, -0.25, 0, 0.25, 0.62);
      for (var i = 0; i < yValues.length; i++) {
         var rayVector = new ex.Vector(1, yValues[i]);
         var rayPoint = new ex.Point(this.x, this.y);
         var ray = new ex.Ray(rayPoint, rayVector);
         that._rays.push(ray);
      }
   }
   
   public update(engine: ex.Engine, delta: number): void {
      super.update(engine, delta);
      
      // clear move
      this.dx = 0;
      this.dy = 0;
      
      // WASD
      if(engine.input.keyboard.isKeyPressed(ex.Input.Keys.W) || 
         engine.input.keyboard.isKeyPressed(ex.Input.Keys.Up)) {
         this.dy = -Config.MonsterSpeed;
      }
      
      if(engine.input.keyboard.isKeyPressed(ex.Input.Keys.S) ||
         engine.input.keyboard.isKeyPressed(ex.Input.Keys.Down)) {
         this.dy = Config.MonsterSpeed;
      }
      
      if(engine.input.keyboard.isKeyPressed(ex.Input.Keys.A) ||
         engine.input.keyboard.isKeyPressed(ex.Input.Keys.Left)) {
         this.dx = -Config.MonsterSpeed;
      }
      
      if(engine.input.keyboard.isKeyPressed(ex.Input.Keys.D) ||
         engine.input.keyboard.isKeyPressed(ex.Input.Keys.Right)) {
         this.dx = Config.MonsterSpeed;
      }

      var prevRotation = this.rotation;
      this.rotation = new ex.Vector(this._mouseX - this.x, this._mouseY - this.y).toAngle();
      //updating attack rays
      for (var i = 0; i < this._rays.length; i++) {
         this._rays[i].pos = new ex.Point(this.x, this.y);
         var rotationAmt = this.rotation - prevRotation;
         this._rays[i].dir = this._rays[i].dir.rotate(rotationAmt, new ex.Point(0, 0));
      }
   }
  
   public debugDraw(ctx: CanvasRenderingContext2D): void {
      super.debugDraw(ctx);

      //Debugging draw for LOS rays on the enemy
      for (var i = 0; i < this._rays.length; i++) {
         ctx.beginPath();
         ctx.moveTo(this._rays[i].pos.x, this._rays[i].pos.y);
         var end = this._rays[i].getPoint(100);
         ctx.lineTo(end.x, end.y);
         ctx.strokeStyle = ex.Color.Chartreuse.toString();
         ctx.stroke();
         ctx.closePath();
      }
   }
}