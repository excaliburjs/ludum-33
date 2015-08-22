class Hero extends ex.Actor {
   
   constructor(x: number, y: number, width: number, height: number, color?: ex.Color) {
      super(x, y, width, height, color);
      // this.addDrawing(Resources.TextureHero);
   }
   
   onInitialize() {
      this.addDrawing(Resources.TextureHero);
   }
      
}