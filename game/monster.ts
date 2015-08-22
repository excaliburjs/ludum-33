/// <reference path="game.ts" />
/// <reference path="config.ts" />

class Monster extends ex.Actor {
   private _mouseX: number;
   private _mouseY: number;
   
   private _rays: ex.Ray[];
   private _attackable: Hero[]; // heroes that can be attacked during current update loop
   
   constructor(x, y){
      super(x, y, Config.MonsterWidth, Config.MonsterHeight);
      this.color = ex.Color.Red;
      this._mouseX = 0;
      this._mouseY = 0;
      this._rays = new Array<ex.Ray>();
      this._attackable = new Array<Hero>();
      this.anchor = new ex.Point(0.35, 0.35);
      this.collisionType = ex.CollisionType.Active;
   }
   
   onInitialize(engine: ex.Engine): void {
      var that = this;
      
      // set the rotation of the actor when the mouse moves
      engine.input.pointers.primary.on('move', (ev: PointerEvent) => {
         this._mouseX = ev.x;
         this._mouseY = ev.y;
         
      });
      var spriteSheet = new ex.SpriteSheet(Resources.TextureMonsterDown, 6, 1, 72, 72);
      
      var attackDownAnim = spriteSheet.getAnimationBetween(engine, 3, 6, 100);
      attackDownAnim.scale.setTo(2, 2);
      attackDownAnim.loop = true;
      this.addDrawing("attackDown", attackDownAnim);
      
      var idleAnim = spriteSheet.getAnimationBetween(engine, 0, 2, 500);
      idleAnim.loop = true;
      idleAnim.scale.setTo(2, 2);
      this.addDrawing("idleDown", idleAnim);
      
      
      var sprite = Resources.TextureMonsterRight.asSprite().clone();
      sprite.scale.setTo(2, 2);
      this.addDrawing("idleRight", sprite);
      this.setDrawing("idleRight");
      
      var yValues = new Array<number>(-0.62, -0.25, 0, 0.25, 0.62);
      _.forIn(yValues, (yValue) => {
         var rayVector = new ex.Vector(1, yValue);
         var rayPoint = new ex.Point(this.x, this.y);
         var ray = new ex.Ray(rayPoint, rayVector);
         that._rays.push(ray);
      });
      
      // attackda
      engine.input.pointers.primary.on("down", function (evt) {
         that._attack();
         that.setDrawing("attackDown");
      });
   }
   
   public update(engine: ex.Engine, delta: number): void {
      super.update(engine, delta);
      
      this._attackable.length = 0;
      this._detectAttackable();
      
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
      // updating attack rays
      _.forIn(this._rays, (ray: ex.Ray) =>{
         ray.pos = new ex.Point(this.x, this.y);
         var rotationAmt = this.rotation - prevRotation;
         ray.dir = ray.dir.rotate(rotationAmt, new ex.Point(0, 0));
      });
      
      this.setZIndex(this.y);
   }
   
   private _detectAttackable() {
      _.forIn(HeroSpawner.getHeroes(), (hero: Hero) => {
         if (this._isHeroAttackable(hero)) {
            this._attackable.push(hero);
         }
      });
   }
   
   private _isHeroAttackable(hero: Hero) {
      var heroLines = hero.getLines();
      for (var i = 0; i < this._rays.length; i++) {
         for (var j = 0; j < heroLines.length; j++) {
            var distanceToIntersect = this._rays[i].intersect(heroLines[j]);
            if ((distanceToIntersect > 0) && (distanceToIntersect <= Config.MonsterAttackRange)) {
               return true;
            }
         }
      }
   }
   
   private _attack() {
      _.forIn(this._attackable, (hero: Hero) => {
         // hero.blink(500, 500, 5); //can't because moving already (no parallel actions support)
         game.currentScene.camera.shake(3, 3, 300);
         hero.Health--;
      });
   }
  
   public debugDraw(ctx: CanvasRenderingContext2D): void {
      super.debugDraw(ctx);
      // Debugging draw for attack rays
      _.forIn(this._rays, (ray: ex.Ray) => {
         ctx.beginPath();
         ctx.moveTo(ray.pos.x, ray.pos.y);
         var end = ray.getPoint(Config.MonsterAttackRange);
         ctx.lineTo(end.x, end.y);
         ctx.strokeStyle = ex.Color.Chartreuse.toString();
         ctx.stroke();
         ctx.closePath();
      });
   }
}