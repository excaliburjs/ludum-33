class BloodEmitter extends ex.Actor {
     
   public amount: number = 0.5;
   public force: number = 0.5;
   public angle: number = 0;
   private _bleedTimer = 0;
   private _splatterTimer = 0;
   private _particles: {x: number, y: number, v: number, d: ex.Vector}[] = [];
   
   constructor(x: number, y: number) {
      super(x, y);
      
   }
   
   public splatter() {
      this._splatterTimer = 200;
      this._particles.length = 0;
      
      var pixelAmount = this.amount * 500;
      var vMin = 5;
      var vMax = 100;
      
      for (var i = 0; i < pixelAmount; i++) {
         this._particles.push({
            x: this.x,
            y: this.y,
            d: ex.Vector.fromAngle(this.angle + ex.Util.randomInRange(-Math.PI / 4, Math.PI / 4)),
            v: ex.Util.randomIntInRange(vMin, vMax)
         });
      }
   }
   
   public bleed(duration: number) {
      this._bleedTimer = duration;
   }
   
   public draw(ctx: CanvasRenderingContext2D, delta: number) {
      super.draw(ctx, delta);
      
      // todo
   }
   
   public update(engine: ex.Engine, delta: number) {
      
      this._bleedTimer = Math.max(0, this._bleedTimer - delta);
      this._splatterTimer = Math.max(0, this._splatterTimer - delta);
      
      // update particle positions
      var particle, i, ray;
      for (i = 0; i < this._particles.length; i++) {
         
         particle = this._particles[i];
         
         ray = new ex.Ray(new ex.Point(particle.x, particle.y), ex.Vector.fromAngle(particle.d));
         
         particle.x = (this.force * (this._splatterTimer * particle.v));
      }
   }
}