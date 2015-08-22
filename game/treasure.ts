class Treasure extends ex.Actor {
   
   constructor(x: number, y: number, width: number, height: number, color?: ex.Color) {
      super(x, y, width, height, color);
      this.addDrawing(Resources.TextureTreasure);
   }
   
}