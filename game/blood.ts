class Blood extends ex.Actor {
     
   private _bleedTimer = 0;
   private _scvs: HTMLCanvasElement;
   private _sctx: CanvasRenderingContext2D;
   private _emitters: IBloodEmitter[] = [];
   public static BloodPixel: ex.Sprite;
   public static BloodPixelGreen: ex.Sprite;
   private _sprayEmitter: ex.ParticleEmitter;
   
   constructor() {
      super(0, 0);
      
      this._scvs = document.createElement('canvas');
      this._scvs.width = 960;
      this._scvs.height = 960;
      this._sctx = this._scvs.getContext('2d');
      this._sctx.globalCompositeOperation = 'source-over';     
      
      this.traits.length = 0;
      this._sprayEmitter = new ex.ParticleEmitter(0, 0, 100, 100);
            
   }
   
   public onInitialize() {
      Blood.BloodPixel = Resources.TextureBloodPixel.asSprite();
      Blood.BloodPixelGreen = Resources.TextureBloodPixelGreen.asSprite();
   }
   
   public splatter(x: number, y: number, sprite: ex.Sprite, amount: number = 0.4, force: number = 0.5, angle: number = 0) {
      
      this._emitters.push(new SplatterEmitter(x, y, sprite, amount, force, angle - Config.BloodSplatterAngleVariation, angle + Config.BloodSplatterAngleVariation));            
   }
   
   public pop(x: number, y: number, sprite: ex.Sprite, amount: number = 0.4, force: number = 0.5) {
      
      this._emitters.push(new SplatterEmitter(x, y, sprite, amount, force, 0, Math.PI * 2));            
   }
   
   public bleed(duration: number) {
      this._bleedTimer = duration;
   }
   
   public draw(ctx: CanvasRenderingContext2D, delta: number) {
      if (Options.blood) {
         super.draw(ctx, delta);
         
         // update particle positions
         var emitter: IBloodEmitter, i;
         for (i = 0; i < this._emitters.length; i++) {         
            this._emitters[i].draw(this._sctx, delta);
         }
         
         // draw shadow ctx
         ctx.drawImage(this._scvs, 0, 0);
      }
   }
   
   public update(engine: ex.Engine, delta: number) {
      super.update(engine, delta);
      if (Options.blood) {
         this._bleedTimer = Math.max(0, this._bleedTimer - delta);
         
         // update particle positions
         var emitter: IBloodEmitter, i;
         for (i = this._emitters.length -1; i >= 0; i--) {
            emitter = this._emitters[i];
            emitter.update(engine, delta);
            
            if (emitter.done) {
               this._emitters.splice(i, 1);
            }
         }
      }
   }
}

interface IBloodEmitter {
   done: boolean;
   draw(ctx: CanvasRenderingContext2D, delta: number): void;
   update(engine: ex.Engine, delta: number): void;
}

interface IBloodParticle {
   x: number;
   y: number;
   v: number;
   d: ex.Vector;
   f: number;
   av: number;
   s: number;
}

class SplatterEmitter implements IBloodEmitter {
   private _particles: IBloodParticle[] = [];      
   private _stopTimer = 200;
   public done = false;
   
   /**
    *
    */
   constructor(public x: number, public y: number, public sprite: ex.Sprite, public amount: number, public force: number, public minAngle: number, public maxAngle: number) {      
      
      var pixelAmount = amount * Config.BloodMaxAmount;
      var backsplashAmount = pixelAmount * Config.BloodSplatterBackSplashAmount;
      var vMin = Config.BloodVelocityMin;
      var vMax = force * Config.BloodVelocityMax;
      var xMin = x - Config.BloodXYVariation;
      var yMin = y - Config.BloodXYVariation;
      var xMax = x + Config.BloodXYVariation;
      var yMax = y + Config.BloodXYVariation;
            
      for (var i = 0; i < pixelAmount; i++) {
         this._particles.push({
            x: ex.Util.randomIntInRange(xMin, xMax),
            y: ex.Util.randomIntInRange(yMin, yMax),
            f: ex.Util.randomInRange(Config.BloodMinFriction, Config.BloodMaxFriction),
            d: ex.Vector.fromAngle(ex.Util.randomInRange(minAngle, maxAngle)),
            v: ex.Util.randomIntInRange(vMin, vMax),
            av: 0,
            s: ex.Util.randomInRange(1, 2)
         });
      }
      
      for (var i = 0; i < backsplashAmount; i++) {
         this._particles.push({
            x: ex.Util.randomIntInRange(xMin, xMax),
            y: ex.Util.randomIntInRange(yMin, yMax),
            f: ex.Util.randomInRange(Config.BloodMinFriction, Config.BloodMaxFriction),
            d: ex.Vector.fromAngle(ex.Util.randomInRange(minAngle, maxAngle)).scale(-1),
            v: Config.BloodSplatterBackSplashVelocityModifier * ex.Util.randomIntInRange(vMin, vMax),
            av: 0,
            s: ex.Util.randomInRange(1, 2)
         });
      }
   }
   
   public update(engine: ex.Engine, delta: number): void {
      var i: number, particle: IBloodParticle, currPos: ex.Vector, d: ex.Vector, vel: ex.Vector, f: ex.Vector;
      
      this._stopTimer -= delta;
      
      if (this._stopTimer < 0) {
         this.done = true;
         return;
      }
      
      for (i = 0; i < this._particles.length; i++) {
         particle = this._particles[i];
         
         if (particle.d.y > 0) {
            particle.av -= Config.BloodSplatterAngleModOverTime;
         } else if (particle.d.y < 0) {
            particle.av += Config.BloodSplatterAngleModOverTime;
         }
         
         currPos = new ex.Vector(particle.x, particle.y);
         d = particle.d.rotate(particle.av, ex.Vector.Zero);
         vel = d.scale(particle.v);
         f = vel.scale(-1).scale(particle.f);
         vel = vel.plus(f);
         
         currPos = currPos.plus(vel);
         
         particle.x = currPos.x;
         particle.y = currPos.y;
         particle.v = vel.distance();
      }
   }
   
   public draw(ctx: CanvasRenderingContext2D, delta: number): void {
      var i: number, particle: IBloodParticle;
      
      for (i = 0; i < this._particles.length; i++) {
         particle = this._particles[i];
         
         this.sprite.scale.setTo(particle.s, particle.s);
         this.sprite.draw(ctx, particle.x, particle.y);
      }
      
   }
   
   //TODO add a method to clean up the blood
   
}