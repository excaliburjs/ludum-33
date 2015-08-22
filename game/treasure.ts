class Treasure extends ex.Actor {
   private _hoard = Config.TreasureHoardSize;
   private _label: ex.Label;
   
   constructor(x: number, y: number, width: number, height: number, color?: ex.Color) {
      super(x, y, width, height, color);
      this.addDrawing(Resources.TextureTreasure);
   }
   
   onInitialize(engine: ex.Engine) {
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