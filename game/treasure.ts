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
      var amount = 0;
      if (this._hoard > 0) {
         if (this._hoard >= Config.TreasureStealAmount) {
            amount = Config.TreasureStealAmount;
         } else {
            amount = this._hoard;
         }
         this._hoard -= amount;
         return amount;
      } else {
         var that = this;
         //TODO steal from another non-empty chest
         _.first(map.getTreasures(), (treasure: Treasure) => {
            if (treasure != that && treasure.getAmount() > 0) {
                  amount = treasure.steal();
                  // console.log('stealing from another chest');
                  return true;
            }
            return false;
         });
         return amount;
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