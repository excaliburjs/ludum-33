class Blood extends ex.UIActor {
     
   private _bleedTimer = 0;
   private _scvs: HTMLCanvasElement;
   private _sctx: CanvasRenderingContext2D;
   private _emitters: IBloodEmitter[] = [];
   public static BloodPixel: ex.Sprite;
   
   constructor() {
      super(0, 0);
      
      this.opacity = 0;
      this._scvs = document.createElement('canvas');
      this._scvs.width = game.getWidth();
      this._scvs.height = game.getHeight();
      this._sctx = this._scvs.getContext('2d');
      this._sctx.globalCompositeOperation = 'source-over';
      this._sctx.fillStyle = 'transparent';
      this._sctx.fillRect(0, 0, this._scvs.width, this._scvs.height);
      this._sctx.fillStyle = 'red';
      this._sctx.fillRect(200, 200, 200, 200);     
   }
   
   public onInitialize(engine: ex.Engine) {
      super.onInitialize(engine);
      
      Blood.BloodPixel = Resources.TextureBloodPixel.asSprite();
   }
   
   public splatter(x: number, y: number, amount: number = 0.4, force: number = 0.5, angle: number = 0) {
      
      this._emitters.push(new SplatterEmitter(x, y, amount, force, angle - Math.PI / 4, angle + Math.PI / 4));            
   }
   
   public pop(x: number, y: number, amount: number = 0.4, force: number = 0.5) {
      
      this._emitters.push(new SplatterEmitter(x, y, amount, force, 0, Math.PI * 2));            
   }
   
   public bleed(duration: number) {
      this._bleedTimer = duration;
   }
   
   public draw(ctx: CanvasRenderingContext2D, delta: number) {
      super.draw(ctx, delta);
      
      // update particle positions
      var emitter: IBloodEmitter, i;
      for (i = 0; i < this._emitters.length; i++) {         
         this._emitters[i].draw(this._sctx, delta);
      }
      
      // draw shadow ctx
      ctx.drawImage(this._scvs, 0, 0);
   }
   
   public update(engine: ex.Engine, delta: number) {
      super.update(engine, delta);
      
      this._bleedTimer = Math.max(0, this._bleedTimer - delta);
      
      // update particle positions
      var emitter: IBloodEmitter, i;
      for (i = 0; i < this._emitters.length; i++) {
         this._emitters[i].update(engine, delta);
      }
   }
}

interface IBloodEmitter {
   draw(ctx: CanvasRenderingContext2D, delta: number): void;
   update(engine: ex.Engine, delta: number): void;
}

interface IBloodParticle {
   x: number;
   y: number;
   v: number;
   d: ex.Vector;
   f: number;
}

class SplatterEmitter implements IBloodEmitter {
   private _particles: IBloodParticle[] = [];      
   
   /**
    *
    */
   constructor(public x: number, public y: number, public amount: number, public force: number, public minAngle: number, public maxAngle: number) {      
      
      var pixelAmount = amount * 100;
      var vMin = 5;
      var vMax = force * 100;
      
      for (var i = 0; i < pixelAmount; i++) {
         this._particles.push({
            x: x,
            y: y,
            f: 0.8,
            d: ex.Vector.fromAngle(ex.Util.randomInRange(minAngle, maxAngle)),
            v: ex.Util.randomIntInRange(vMin, vMax)
         });
      }
   }
   
   public update(engine: ex.Engine, delta: number): void {
      var i: number, particle: IBloodParticle, currPos: ex.Vector, vel: ex.Vector, f: ex.Vector;
      
      for (i = 0; i < this._particles.length; i++) {
         particle = this._particles[i];
         
         currPos = new ex.Vector(particle.x, particle.y);
         vel = particle.d.scale(particle.v);
         f = vel.scale(-1).scale(particle.f);
         vel = vel.plus(f);
         
         currPos = currPos.plus(vel);
         
         particle.x = currPos.x;
         particle.y = currPos.y;
      }
   }
   
   public draw(ctx: CanvasRenderingContext2D, delta: number): void {
      var i: number, particle: IBloodParticle;
      
      for (i = 0; i < this._particles.length; i++) {
         particle = this._particles[i];
         
         Blood.BloodPixel.draw(ctx, particle.x, particle.y);
      }
      
   }
   
}