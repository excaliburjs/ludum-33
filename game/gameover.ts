class GameOver extends ex.Scene {
   
   public onInitialize(engine: ex.Engine) {
      game.backgroundColor = ex.Color.Black;
      
      var retryButton = new ex.Actor(game.width / 2, game.height / 2, 300, 60, ex.Color.DarkGray)
      this.add(retryButton);
      retryButton.on('pointerdown', (e?: ex.Input.PointerEvent) => {
         isGameOver = false;
         //TODO reset game
      });
   }
}