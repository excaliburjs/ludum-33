class Treasure extends ex.Actor {
   private _hoard = Config.TreasureHoardSize;
  
   constructor(x: number, y: number) {
      super(x, y, 24, 24);
      
      this.anchor.setTo(0, 0);
   }
   
   onInitialize(engine: ex.Engine) {
      
      this.addDrawing("notempty", Resources.TextureTreasure.asSprite());
      this.addDrawing("empty", Resources.TextureTreasureEmpty.asSprite());
      
      this.collisionType = ex.CollisionType.Passive;
   }
   
   public getAmount(): number {
      return this._hoard;
   }
   
   public steal(): number {
      if (this._hoard > 0) {
         this._hoard -= Config.TreasureStealAmount;
         
         return Config.TreasureStealAmount; 
      } else {
         return 0;
      }
   }
   
   public return(amount: number) {
      this._hoard += amount;
   }
   
   public reset() {
      this._hoard = Config.TreasureHoardSize;
   }
   
   public update(engine: ex.Engine, delta: number) {
      super.update(engine, delta);
      
      if (this._hoard <= 0) {
         this.setDrawing("empty");
      } else {
         this.setDrawing("notempty");
      }
   }
}