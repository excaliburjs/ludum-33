enum GameOverType {
   Hoard,
   Slain
}

class GameOver extends ex.Scene {   
   private _type: ex.Actor;
   private _labelHeroesKilled: ex.Label;
   private _labelHeroesEscaped: ex.Label;
   private _labelGoldLost: ex.Label;
   private _labelDamageTaken: ex.Label;
   
   public onInitialize(engine: ex.Engine) {
      game.backgroundColor = ex.Color.Black;
      var bg = new ex.Actor(0, 0, game.getWidth(), game.getHeight());
      bg.anchor.setTo(0, 0);
      bg.addDrawing(Resources.TextureGameOverBg);      
      this.add(bg);
      
      this._type = new ex.Actor(0, 0, game.getWidth(), game.getHeight());
      this._type.anchor.setTo(0, 0);
      this._type.addDrawing("hoard", Resources.TextureGameOverHoard.asSprite());
      this._type.addDrawing("slain", Resources.TextureGameOverSlain.asSprite());
      this.add(this._type);
      
      // stats
      this._labelHeroesKilled = new ex.Label(null, 219, 340, "36px Arial");
      this._labelHeroesKilled.textAlign = ex.TextAlign.Center;
      this._labelHeroesEscaped = new ex.Label(null, 402, 340, "36px Arial");
      this._labelHeroesEscaped.textAlign = ex.TextAlign.Center;
      this._labelGoldLost = new ex.Label(null, 570, 340, "36px Arial");
      this._labelGoldLost.textAlign = ex.TextAlign.Center;
      this._labelDamageTaken = new ex.Label(null, 743, 340, "36px Arial");
      this._labelDamageTaken.textAlign = ex.TextAlign.Center;
      
      this._labelHeroesKilled.color = ex.Color.White;
      this._labelHeroesEscaped.color  = ex.Color.White;
      this._labelGoldLost.color  = ex.Color.White;
      this._labelDamageTaken.color  = ex.Color.White;
      
      this.add(this._labelHeroesKilled);
      this.add(this._labelHeroesEscaped);
      this.add(this._labelGoldLost);
      this.add(this._labelDamageTaken);
      
      var retryButton = new ex.Actor(game.width / 2, 423, 252, 56);
      retryButton.addDrawing(Resources.TextureGameOverRetry);      
      this.add(retryButton);

      retryButton.on('pointerdown', (e?: ex.Input.PointerEvent) => {
         isGameOver = false;
         
         Stats.numHeroesKilled = 0;
         Stats.numHeroesEscaped = 0;
         Stats.goldLost = 0;
         Stats.damageTaken = 0;
         
         map.resetPlayer();
         
         // heroTimer.cancel();
         // game.remove(heroTimer);
         // heroTimer = new ex.Timer(() => HeroSpawner.spawnHero(), Config.HeroSpawnInterval, true);
         // game.add(heroTimer);
         
         _.forEach(map.getTreasures(), (treasure) => {
            treasure.reset();
         });
         
         HeroSpawner.reset();
         for (var i = HeroSpawner.getHeroes().length-1; i >= 0 ; i--) {
            HeroSpawner.despawn(HeroSpawner.getHeroes()[i], false);
         }
         HeroSpawner.cleanupTombstones();
         
         game.goToScene('map');
      });
   }
   
   public onActivate(): void {
      super.onActivate();
      
      Resources.GameOver.setVolume(0.1);
      Resources.GameOver.play();
   }
   
   public onDeactivate(): void {
      super.onDeactivate();
      
      Resources.GameOver.stop();
   }
   
   public update(engine: ex.Engine, delta: number) {
      super.update(engine, delta);
      
      this._labelHeroesKilled.text = Math.floor(100 * (Stats.numHeroesKilled / HeroSpawner.getSpawnCount())).toString() + '%';
      this._labelHeroesEscaped.text = Math.floor(100 * (Stats.numHeroesEscaped / HeroSpawner.getSpawnCount())).toString() + '%';
      this._labelGoldLost.text = Math.floor(100 * (Stats.goldLost / map.getHoardAmount())).toString() + '%';
      this._labelDamageTaken.text = Math.floor(100 * (Stats.damageTaken / Config.MonsterHealth)).toString() + '%';
      
      // center labels
   }
   
   public setType(type: GameOverType): void {
      this._type.setDrawing(type === GameOverType.Hoard ? "hoard" : "slain");
   }
}