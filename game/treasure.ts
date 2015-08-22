class Treasure extends ex.Actor {
   private _hoard = Config.TreasureHoardSize;
   private _label: ex.Label;
   
   constructor(x: number, y: number) {
      super(x, y, 24, 24);
      
      this.anchor.setTo(0, 0);
   }
   
   onInitialize(engine: ex.Engine) {
      var treasure = Resources.TextureTreasure.asSprite().clone();
      this.addDrawing(treasure);
      
      this.collisionType = ex.CollisionType.Passive;
      this._label = new ex.Label(this._hoard.toString(), 0, 24, "Arial 14px");
      this.addChild(this._label);
   }
   
   public steal(): number {
      this._hoard -= Config.TreasureStealAmount;
      this._label.text = this._hoard.toString();
      
      return Config.TreasureStealAmount; 
   }
}