class Hero extends ex.Actor {
   
   private _treasure: Treasure;
   
   constructor(x: number, y: number, width: number, height: number, color?: ex.Color) {
      super(x, y, width, height, color);
      
      
      
   }
   
   onInitialize(engine: ex.Engine) {
      
      var spriteSheet = new ex.SpriteSheet(Resources.TextureHero, 3, 1, 28, 28);
      var idleAnim = spriteSheet.getAnimationForAll(engine, 300);
      idleAnim.loop = true;
      idleAnim.scale.setTo(2, 2);
      
      this.addDrawing("idle", idleAnim);
      
      this.collisionType = ex.CollisionType.Active;
      
      this.on('collision', (e?: ex.CollisionEvent) => {
         if (e.other instanceof Treasure) {
            this._treasure = e.other;
            e.other.scene.remove(e.other);
         }
      });
   }
      
}