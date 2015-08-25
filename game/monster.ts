/// <reference path="game.ts" />
/// <reference path="config.ts" />

class Monster extends ex.Actor {
   public health: number = Config.MonsterHealth;
   
   private _mouseX: number;
   private _mouseY: number;
   
   private _rotation: number = 0;
   private _rays: ex.Ray[];
   private _closeRays: ex.Ray[];
   private _attackable: Hero[]; // heroes that can be attacked during current update loop
   
   private _isAttacking: boolean = false;
   private _hasMoved: boolean = false;
   private _timeLeftAttacking: number = 0;
   private _direction: string = "none";
   private _aimSprite: ex.Sprite;
   private _lastSwing: number = 0;
   private _timeLeftDashing: number = 0;
   private _isDashing: boolean = false;
   private _canDash: boolean = false;
   public dashLevel: number = 0;
   private _shiftIndicator: ex.Actor;
   
   constructor(x, y){
      super(x, y, Config.MonsterWidth, Config.MonsterHeight);
      this.color = ex.Color.Red;
      this._mouseX = 0;
      this._mouseY = 0;
      this._rays = new Array<ex.Ray>();
      this._closeRays = new Array<ex.Ray>();
      this._attackable = new Array<Hero>();
      //this.anchor = new ex.Point(0.35, 0.35);
      this.collisionType = ex.CollisionType.Active;
   }
   
   onInitialize(engine: ex.Engine): void {
      var that = this;
      
      // set the rotation of the actor when the mouse moves
      engine.input.pointers.primary.on('move', (ev: PointerEvent) => {
         this._mouseX = ev.x;
         this._mouseY = ev.y;
         
      });
      
      this._aimSprite = Resources.TextureMonsterAim.asSprite();
      this._aimSprite.scale.setTo(2,2);
      this._aimSprite.anchor = new ex.Point(.25, .25);
      this._aimSprite.opacity(.7);
      this._aimSprite.colorize(ex.Color.Green);
      this._aimSprite.colorize(ex.Color.Green);
      
      
      var shiftButton = new ex.SpriteSheet(Resources.TextureShift, 3, 1, 48, 48);
      var shiftAnimation = shiftButton.getAnimationForAll(engine, 100);
      shiftAnimation.loop = true;
      shiftAnimation.scale.setTo(1,1);
      this._shiftIndicator = new ex.Actor(7, 70, 24, 24);
      this._shiftIndicator.addDrawing("shift", shiftAnimation);
      
      var chargeSpriteSheet = new ex.SpriteSheet(Resources.TextureMonsterCharge, 3, 1, 96, 96);
      var chargeAnim = chargeSpriteSheet.getAnimationForAll(engine, 100);
      chargeAnim.loop = true;
      chargeAnim.scale.setTo(2, 2);
      this.addDrawing("charge", chargeAnim);      
      
      var downSpriteSheet = new ex.SpriteSheet(Resources.TextureMonsterDown, 14, 1, 96, 96);
      var rightSpriteSheet = new ex.SpriteSheet(Resources.TextureMonsterRight, 14, 1, 96, 96);
      var upSpriteSheet = new ex.SpriteSheet(Resources.TextureMonsterUp, 14, 1, 96, 96);
      
      var attackDownAnim = downSpriteSheet.getAnimationBetween(engine, 9, 13, Config.MonsterAttackTime/4);
      attackDownAnim.scale.setTo(2, 2);
      attackDownAnim.loop = true;
      this.addDrawing("attackDown", attackDownAnim);
      
      var walkDownAnim = downSpriteSheet.getAnimationByIndices(engine, [2, 3, 4, 5, 6, 7], Config.MonsterWalkFrameSpeed);
      walkDownAnim.scale.setTo(2, 2);
      walkDownAnim.loop = true;
      this.addDrawing("walkDown", walkDownAnim);
      
      var attackUpAnim = upSpriteSheet.getAnimationBetween(engine, 9, 13, Config.MonsterAttackTime/4);
      attackUpAnim.scale.setTo(2, 2);
      attackUpAnim.loop = true;
      this.addDrawing("attackUp", attackUpAnim);
      
      var walkUpAnim = upSpriteSheet.getAnimationByIndices(engine, [2, 3, 4, 5, 6, 7], Config.MonsterWalkFrameSpeed);
      walkUpAnim.scale.setTo(2, 2);
      walkUpAnim.loop = true;
      this.addDrawing("walkUp", walkUpAnim);
      
      var attackRightAnim = rightSpriteSheet.getAnimationBetween(engine, 9, 13, Config.MonsterAttackTime/4);
      attackRightAnim.scale.setTo(2, 2);
      attackRightAnim.loop = true;
      this.addDrawing("attackRight", attackRightAnim);
      
      var walkRightAnim = rightSpriteSheet.getAnimationByIndices(engine, [2, 3, 4, 5, 6, 7], Config.MonsterWalkFrameSpeed);
      walkRightAnim.scale.setTo(2, 2);
      walkRightAnim.loop = true;
      this.addDrawing("walkRight", walkRightAnim);
      
      var attackLeftAnim = rightSpriteSheet.getAnimationBetween(engine, 9, 13, Config.MonsterAttackTime/4);
      attackLeftAnim.flipHorizontal = true;
      attackLeftAnim.scale.setTo(2, 2);
      attackLeftAnim.loop = true;
      this.addDrawing("attackLeft", attackLeftAnim);
      
      var walkLeftAnim = rightSpriteSheet.getAnimationByIndices(engine, [2, 3, 4, 5, 6, 7], Config.MonsterWalkFrameSpeed);
      walkLeftAnim.flipHorizontal = true;
      walkLeftAnim.scale.setTo(2, 2);
      walkLeftAnim.loop = true;
      this.addDrawing("walkLeft", walkLeftAnim);
      
      var idleAnim = downSpriteSheet.getAnimationBetween(engine, 0, 2, 400);
      idleAnim.loop = true;
      idleAnim.scale.setTo(2, 2);
      this.addDrawing("idleDown", idleAnim);
      
      var idleUpAnim = upSpriteSheet.getAnimationBetween(engine, 0, 2, 400);
      idleUpAnim.loop = true;
      idleUpAnim.scale.setTo(2, 2);
      this.addDrawing("idleUp", idleUpAnim);
      
      var idleRightAnim = rightSpriteSheet.getAnimationBetween(engine, 0, 2, 400);
      idleRightAnim.scale.setTo(2, 2);
      idleRightAnim.loop = true;
      this.addDrawing("idleRight", idleRightAnim);
      
      var idleLeftAnim = rightSpriteSheet.getAnimationBetween(engine, 0, 2, 400);
      idleLeftAnim.flipHorizontal = true;
      idleLeftAnim.scale.setTo(2, 2);
      idleLeftAnim.loop = true;
      this.addDrawing("idleLeft", idleLeftAnim);
      
      
      var sprite = Resources.TextureMonsterRight.asSprite().clone();
      sprite.scale.setTo(2, 2);
      this.addDrawing("idleRight", sprite);
      this.setDrawing("idleDown");
      
      var yValues = new Array<number>(-0.62, -0.25, 0, 0.25, 0.62);
      _.forIn(yValues, (yValue) => {
         var rayVector = new ex.Vector(1, yValue);
         var rayPoint = new ex.Point(this.x, this.y);
         var ray = new ex.Ray(rayPoint, rayVector);
         that._rays.push(ray);
      });
      var closeXValues = new Array<number>(1, 0.71, 0, -0.71, -1);//(1, 0.86, 0.71, 0.5, 0, -0.5, -0.71, -0.86, -1)
      var closeYValues = new Array<number>(0, 0.71, 1, -0.71, 0);
      _.forIn(closeYValues, (closeYValue) => {
         _.forIn(closeXValues, (closeXValue) => {
            var rayVector = new ex.Vector(closeXValue, closeYValue);
            var rayPoint = new ex.Point(this.x, this.y);
            var ray = new ex.Ray(rayPoint, rayVector);
            that._closeRays.push(ray);
         }); 
      });
      
      // attack
      engine.input.pointers.primary.on("down", function (evt) {
         var currentTime = Date.now();
         if(currentTime - that._lastSwing > Config.MonsterAttackCooldown){
            that._attack();
            that._isAttacking = true;
            that._timeLeftAttacking = Config.MonsterAttackTime;
            that._lastSwing = currentTime;
         }
      });
      
      // keyboad
      engine.input.keyboard.on("down", function(evt: ex.Input.KeyEvent){
         if(evt.key === ex.Input.Keys.Shift){
            that.dash();
         }
      });
      
   }
   
   private _findFirstValidPad(engine: ex.Engine): ex.Input.Gamepad {
      var gamePad;
      for(var i = 1; i < 5; i++) {
         gamePad = engine.input.gamepads.at(i);
         if(gamePad && gamePad._buttons && gamePad._buttons.length > 0){
            return gamePad;
         }
      }
   }
   
   public dash(): void {
      if(this._canDash){
         this.removeChild(this._shiftIndicator);
         this._canDash = false;
         this.dashLevel = 0;
         var dashVector = ex.Vector.fromAngle(this._rotation).scale(Config.MonsterDashSpeed);
         this._isDashing = true;
         this._timeLeftDashing = Config.MonsterDashDuration;
         this.dx = dashVector.x;
         this.dy = dashVector.y;
         this.setDrawing("charge");
         //this.currentDrawing.anchor = new ex.Point(.35, .35);
         this.rotation = this._rotation;
      }
   }
   
   public update(engine: ex.Engine, delta: number): void {
      super.update(engine, delta);
      
      if (this.health <= 0) {
         map._gameOver(GameOverType.Slain);
      }
      
      
      this._attackable.length = 0;
      this._detectAttackable();
      
      if(this._isDashing){
         this._attack();
         this._timeLeftDashing -= delta;
         if(this._timeLeftDashing <= 0){
            this._isDashing = false;
            this.rotation = 0;
         }
      }
      
      var prevRotation = this._rotation;
      this._rotation = ex.Util.canonicalizeAngle(new ex.Vector(this._mouseX - this.x, this._mouseY - this.y).toAngle());
      
      // updating attack rays
      _.forIn(this._rays, (ray: ex.Ray) =>{
         ray.pos = new ex.Point(this.x, this.y);
         var rotationAmt = this._rotation - prevRotation;
         ray.dir = ray.dir.rotate(rotationAmt, new ex.Point(0, 0));
      });
      _.forIn(this._closeRays, (ray: ex.Ray) =>{
         ray.pos = new ex.Point(this.x, this.y);
         var rotationAmt = this._rotation - prevRotation;
         ray.dir = ray.dir.rotate(rotationAmt, new ex.Point(0, 0));
      });
         
      if(!this._isDashing){
         // add to dash cooldown
         this.dashLevel = Math.min(this.dashLevel + delta, Config.MonsterDashCooldown);
         if(this.dashLevel >= Config.MonsterDashCooldown){
            this._canDash = true;
            this.addChild(this._shiftIndicator);
         }
         
         // clear move
         this.dx = 0;
         this.dy = 0;
                  
         // Controller input
         var pad = this._findFirstValidPad(engine);
         if(pad) {
            // sticks
            var leftAxisY = pad.getAxes(ex.Input.Axes.LeftStickY);
            var leftAxisX = pad.getAxes(ex.Input.Axes.LeftStickX);
            var rightAxisX = pad.getAxes(ex.Input.Axes.RightStickX);
            var rightAxisY = pad.getAxes(ex.Input.Axes.RightStickY);
            
            var leftVector = new ex.Vector(leftAxisX, leftAxisY);
            var rightVector = new ex.Vector(rightAxisX, rightAxisY);
            
            if(pad.getButton(ex.Input.Buttons.RightTrigger) > .2 || 
               pad.getButton(ex.Input.Buttons.Face1) > 0) {
               this._attack();
               this._isAttacking = true;
               this._timeLeftAttacking = Config.MonsterAttackTime;
            }
            
            
            if(leftVector.distance() > .2) {
               this._rotation = ex.Util.canonicalizeAngle(leftVector.normalize().toAngle());
               if(!this._isAttacking){
                  var speed = leftVector.scale(Config.MonsterSpeed);
                  this.dx = speed.x;
                  this.dy = speed.y;
                  
                  if(Math.abs(this.dx) > Math.abs(this.dy) && this.dx > 0) {
                     if(this._direction !== "walkRight") {
                        this.setDrawing("walkRight");
                        this._direction = "walkRight"
                     }
                  }
                  if(Math.abs(this.dy) > Math.abs(this.dx) && this.dy < 0) {
                     if(this._direction !== "walkUp") {
                        this.setDrawing("walkUp");
                        this._direction = "walkUp";
                     }
                  }
                  
                  if(Math.abs(this.dx) > Math.abs(this.dy) && this.dx < 0) {
                     if(this._direction !== "walkLeft") {
                        this.setDrawing("walkLeft");
                        this._direction = "walkLeft";
                     }
                  }
                  if(Math.abs(this.dy) > Math.abs(this.dx) && this.dy > 0) {
                     if(this._direction !== "walkDown") {
                        this.setDrawing("walkDown");
                        this._direction = "walkDown";
                     }
                  }
                  
               }
            }
         }
         
         
         // WASD
         if(engine.input.keyboard.isKeyPressed(ex.Input.Keys.W) || 
            engine.input.keyboard.isKeyPressed(ex.Input.Keys.Up)) {
               if (!this._hasMoved) {
                  Analytics.trackGameStart();
                  this._hasMoved = true;
               }
               if(!this._isAttacking){
                  this.dy = -Config.MonsterSpeed;
                  this.setDrawing("walkUp");
               }
         }
         
         if(engine.input.keyboard.isKeyPressed(ex.Input.Keys.S) ||
            engine.input.keyboard.isKeyPressed(ex.Input.Keys.Down)) {
               if (!this._hasMoved) {
                  Analytics.trackGameStart();
                  this._hasMoved = true;
               }
               if(!this._isAttacking) {
                  this.dy = Config.MonsterSpeed;
                  this.setDrawing("walkDown");
               }
         }
         
         if(engine.input.keyboard.isKeyPressed(ex.Input.Keys.A) ||
            engine.input.keyboard.isKeyPressed(ex.Input.Keys.Left)) {
            if (!this._hasMoved) {
               Analytics.trackGameStart();
               this._hasMoved = true;
            }
            if(!this._isAttacking) {
               this.dx = -Config.MonsterSpeed;
               if(this.dy === 0) {
                  this.setDrawing("walkLeft");
               }
            }
         }
         
         if((engine.input.keyboard.isKeyPressed(ex.Input.Keys.D) ||
            engine.input.keyboard.isKeyPressed(ex.Input.Keys.Right))) {
            if (!this._hasMoved) {
               Analytics.trackGameStart();
               this._hasMoved = true;
            }
            if(!this._isAttacking) {
               this.dx = Config.MonsterSpeed;
               if(this.dy === 0) {
                  this.setDrawing("walkRight");
               }
            }
         }
   
         if(this.dx == 0 && this.dy == 0 && !this._isAttacking){
            this.setDrawing("idleDown");
         }
   
         
         if(this._isAttacking) {
            if(this._rotation < Math.PI/4 || this._rotation > Math.PI * (7/4)) {
               this.setDrawing("attackRight");
            }
            
            if(this._rotation > Math.PI/4 && this._rotation < Math.PI * (3/4)) {
               this.setDrawing("attackDown");
            }
            
            if(this._rotation > Math.PI * (3/4) && this._rotation < Math.PI * (5/4)){
               this.setDrawing("attackLeft");
            }
         
            if(this._rotation > Math.PI * (5/4) && this._rotation < Math.PI * (7/4)){
               this.setDrawing("attackUp");
            }
            this._direction = "attack";
            this._timeLeftAttacking -= delta;
            if(this._timeLeftAttacking <= 0){
               this._isAttacking = false;            
            }
         }      
      }
      
      
      
      this.setZIndex(this.y);
   }
   
   public draw(ctx: CanvasRenderingContext2D, delta: number): void{
      super.draw(ctx, delta);
      
      this._aimSprite.rotation = this._rotation;
      
      this._aimSprite.draw(ctx, this.x, this.y);
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
      for (var i = 0; i < this._closeRays.length; i++) {
         for (var j = 0; j < heroLines.length; j++) {
            var distanceToIntersect = this._closeRays[i].intersect(heroLines[j]);
            if ((distanceToIntersect > 0) && (distanceToIntersect <= Config.CloseMonsterAttackRange)) {
               return true;
            }
         }
      }
   }
   
   private _attack() {
      var hitHero = false;
      _.forIn(this._attackable, (hero: Hero) => {
         // hero.blink(500, 500, 5); //can't because moving already (no parallel actions support)
         game.currentScene.camera.shake(5, 5, 200);
         hero.Health--;
         hitHero = true;

         var origin = new ex.Vector(hero.x, hero.y);
         var dest = new ex.Vector(this.x, this.y);
         var vectorBetween = origin.subtract(dest);
         
         hero.stun(vectorBetween);
         
         blood.splatter(hero.x, hero.y, Blood.BloodPixel, hero.Health <= 0 ? 0.7 : 0.4, hero.Health <= 0 ? 0.8 : 0.3, vectorBetween.toAngle());
      });
      if(!this._isDashing) {
         if (hitHero) {
            Resources.AxeSwingHit.play();
         } else {
            Resources.AxeSwing.play();
         }
      }
   }
  
   public getRotation(): number {
      return this._rotation;
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
      _.forIn(this._closeRays, (ray: ex.Ray) => {
         ctx.beginPath();
         ctx.moveTo(ray.pos.x, ray.pos.y);
         var end = ray.getPoint(Config.CloseMonsterAttackRange);
         ctx.lineTo(end.x, end.y);
         ctx.strokeStyle = ex.Color.Azure.toString();
         ctx.stroke();
         ctx.closePath();
      });
   }
}