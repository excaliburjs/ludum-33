class Map extends ex.Scene {
   public static CellSize = 24;
   
   private _treasures: Treasure[];
   private _map: ex.Actor; // todo TileMap
   
   constructor(engine: ex.Engine) {
      super(engine);
      
      this._treasures = [];
   }
   
   public onInitialize() {
      this._map = new ex.Actor(0, 0, 960, 480);
      this._map.anchor.setTo(0, 0);
      this._map.addDrawing(Resources.TextureMap);
      this.add(this._map);
      
      //
      // todo load from Tiled
      //
      
      // one treasure for now
      var treasure = new Treasure(this._map.getWidth() - 50, this._map.getHeight() - 50, 50, 50, ex.Color.Yellow);
      this.addTreasure(treasure);
   }
   
   public getTreasures(): Treasure[] {
      return this._treasures;
   }
   
   public getSpawnPoints(): ex.Point[] {
      // todo get from tiled
      
      return [
         this.getCellPos(1, 1),
         this.getCellPos(39, 1),
         this.getCellPos(2, 18)
      ]
   }
   
   public getCellPos(x: number, y: number): ex.Point {
      return new ex.Point(Map.CellSize * x, Map.CellSize * y);
   }
   
   private addTreasure(t: Treasure) {
      this._treasures.push(t);
      this.add(t);
   }   
}