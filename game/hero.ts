class Hero extends ex.Actor {
   
   private _treasure: Treasure;
   
   constructor(x: number, y: number, width: number, height: number, color?: ex.Color) {
      super(x, y, width, height, color);
      this.addDrawing(Resources.TextureHero);
   }
   
   onInitialize(engine: ex.Engine) {
      
      this.collisionType = ex.CollisionType.Active;
      
      this.on('collision', (e?: ex.CollisionEvent) => {
         if (e.other instanceof Treasure) {
            this._treasure = e.other;
            e.other.scene.remove(e.other);
         }
      });
   }
      
}