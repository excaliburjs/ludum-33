class GameOver extends ex.Scene {
   
   public onInitialize(engine: ex.Engine) {
      game.backgroundColor = ex.Color.Black;
      
      var retryButton = new ex.Actor(game.width / 2, game.height / 2, 300, 60, ex.Color.DarkGray)
      this.add(retryButton);
      // reset the game
      retryButton.on('pointerdown', (e?: ex.Input.PointerEvent) => {
         isGameOver = false;
         
         Stats.numHeroesKilled = 0;
         Stats.numHeroesEscaped = 0;
         Stats.goldLost = 0;
         Stats.damageTaken = 0;
         
         map.resetPlayer();
         
         heroTimer.cancel();
         game.remove(heroTimer);
         heroTimer = new ex.Timer(() => HeroSpawner.spawnHero(), Config.HeroSpawnInterval, true);
         game.add(heroTimer)
         
         _.forEach(map.getTreasures(), (treasure) => {
            treasure.reset();
         });
         for (var i = HeroSpawner.getHeroes().length-1; i >= 0 ; i--) {
            HeroSpawner.despawn(HeroSpawner.getHeroes()[i], false);
         }
         
         game.goToScene('map');
      });
   }
}