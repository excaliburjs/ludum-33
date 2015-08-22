class Treasure extends ex.Actor {
   private _hoard = Config.TreasureHoardSize;
  
   constructor(x: number, y: number) {
      super(x, y, 24, 24);
      
      this.anchor.setTo(0, 0);
   }
   
   onInitialize(engine: ex.Engine) {
      var treasure = Resources.TextureTreasure.asSprite().clone();
      this.addDrawing(treasure);
      
      this.collisionType = ex.CollisionType.Passive;
   }
   
   public getAmount(): number {
      return this._hoard;
   }
   
   public steal(): number {
      this._hoard -= Config.TreasureStealAmount;
      return Config.TreasureStealAmount; 
   }
   
   public return(amount: number) {
      this._hoard += amount;
   }
}