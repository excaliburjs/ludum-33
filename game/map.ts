class Map extends ex.Scene {
   public static CellSize = 24;
   public static MapSize = 40;
   
   private _treasures: Treasure[];
   private _map: ex.Actor; // todo TileMap
   public _player: Monster;
   private _treasureProgress: ex.UIActor;
   private _lootProgress: ex.UIActor;
   private _monsterProgress: ex.UIActor;
   private _monsterSpecialProgress: ex.UIActor;
   
   constructor(engine: ex.Engine) {
      super(engine);
      
      this._treasures = [];
   }
   
   public onInitialize() {
      this._map = new ex.Actor(0, 0, 960, 960);
      this._map.anchor.setTo(0, 0);
      this._map.addDrawing(Resources.TextureMap);
      this.add(this._map);
      
      // vignette
      var vg = new ex.UIActor(0, 0, game.getWidth(), game.getHeight());
      vg.addDrawing(Resources.TextureVignette);
      this.add(vg);

      // Initialize blood
      this.add(blood);
      this.buildWalls();
      
      // show GUI
      var progressBack = new ex.UIActor(60, 23, Config.TreasureProgressSize + 4, 40);
      progressBack.anchor.setTo(0, 0);
      progressBack.color = ex.Color.Black;
      this.add(progressBack);
      
      this._treasureProgress = new ex.UIActor(60, 27, Config.TreasureProgressSize, 32);
      this._treasureProgress.anchor.setTo(0, 0);
      this._treasureProgress.color = ex.Color.fromHex("#eab600");
      this.add(this._treasureProgress);
      
      this._lootProgress = new ex.UIActor(60, 27, 0, 32);
      this._lootProgress.anchor.setTo(0, 0);
      this._lootProgress.color = ex.Color.fromHex("#f25500");
      this.add(this._lootProgress);
      
      var treasureIndicator = new ex.UIActor(10, 10, 64, 64);
      treasureIndicator.addDrawing(Resources.TextureTreasureIndicator);
      this.add(treasureIndicator);
      
      var monsterProgressBack = new ex.UIActor(game.getWidth() - 66, 23, Config.MonsterProgressSize + 4, 40);
      monsterProgressBack.anchor.setTo(1, 0);
      monsterProgressBack.color = ex.Color.Black;
      this.add(monsterProgressBack);
      
      this._monsterProgress = new ex.UIActor(game.getWidth() - 66, 27, Config.MonsterProgressSize, 32);
      this._monsterProgress.anchor.setTo(1, 0);
      this._monsterProgress.color = ex.Color.fromHex("#ab2800");
      this.add(this._monsterProgress);
      
      var specialProgressBack = new ex.UIActor(game.getWidth() - 50, 46, Config.MonsterSpecialProgressSize + 4, 24);
      specialProgressBack.anchor.setTo(1, 0);
      specialProgressBack.color = ex.Color.Black;
      this.add(specialProgressBack);
      
      this._monsterSpecialProgress = new ex.UIActor(game.getWidth() - 50, 50, Config.MonsterSpecialProgressSize, 16);
      this._monsterSpecialProgress.anchor.setTo(1, 0);
      this._monsterSpecialProgress.color = ex.Color.fromHex("#6b1191");
      this.add(this._monsterSpecialProgress);
      
      var monsterIndicator = new ex.UIActor(game.getWidth() - 74, 10, 64, 64);
      monsterIndicator.addDrawing(Resources.TextureMonsterIndicator);
      this.add(monsterIndicator);
           
      
      //
      // todo load from Tiled
      //     
      var treasures = [
         this.getCellPos(19, 2),
         this.getCellPos(20, 2),
         this.getCellPos(19, 37),
         this.getCellPos(20, 37)
      ];
      
      for (var i = 0; i < treasures.length; i++) {
         var treasure = new Treasure(treasures[i].x, treasures[i].y);
         this.addTreasure(treasure);
      }
      
      var playerSpawn = this.getCellPos(Config.PlayerCellSpawnX, Config.PlayerCellSpawnY);
      this._player = new Monster(playerSpawn.x, playerSpawn.y);
      
      this.add(this._player);
   }
   
   public onActivate() {
      // start sounds
      SoundManager.start();
      
      game.canvas.className = "playing";
   }
   
   public onDeactivate() {
      SoundManager.stop();
      
      game.canvas.className = "";
   }
   
   public getPlayer(): Monster {
      return this._player;
   }
   
   public resetPlayer() {
      this._player.health = Config.MonsterHealth;
      var playerSpawn = this.getCellPos(Config.PlayerCellSpawnX, Config.PlayerCellSpawnY);
      this._player.x = playerSpawn.x;
      this._player.y = playerSpawn.y;
   }
   
   public getTreasures(): Treasure[] {
      return this._treasures;
   }
   
   public getSpawnPoints(): ex.Point[] {
      // todo get from tiled
      
      return [
         this.getCellPos(0, 19),
         this.getCellPos(39, 19)
      ]
   }
   
   public buildWalls() {
      
      var x, y, cell, wall: ex.Actor;
      for (x = 0; x < Map.MapSize; x++) {
         for (y = 0; y < Map.MapSize; y++) {
            cell = this._walls[x + y * Map.MapSize];
            
            if (cell !== 0) { // wall tile
               wall = new ex.Actor(x * Map.CellSize, y * Map.CellSize, Map.CellSize, Map.CellSize);
               wall.traits.length = 0;
               wall.traits.push(new ex.Traits.OffscreenCulling());
               wall.anchor.setTo(0, 0);               
               wall.collisionType = ex.CollisionType.Fixed;
               
               this.add(wall);
            }
         }
      }
   }
   
   public isWall(x: number, y: number) {
      var cellX = Math.floor(x / Map.CellSize)
      var cellY = Math.floor(y / Map.CellSize);
      
      // oob
      if (cellX < 0 || cellX > Map.MapSize || cellY < 0 || cellY > Map.MapSize) return true;
      
      return this._walls[cellX + cellY * Map.MapSize] !== 0;
   }
   
   public getCellPos(x: number, y: number): ex.Point {
      return new ex.Point(Map.CellSize * x, Map.CellSize * y);
   }
   
   private _cameraVel = new ex.Vector(0, 0);
   
   public update(engine: ex.Engine, delta: number) {
      super.update(engine, delta);
      
      // update treasure indicator
      var total = this.getHoardAmount();
      var looting = _.sum(HeroSpawner.getHeroes(), x => x.getLootAmount());
      var curr = _.sum(this._treasures, (x) => x.getAmount());
      
      // % being looted right now
      var lootProgress = looting / total;
      
      // % level of hoard, if looting succeeds
      var lossProgress = curr / total;
      
      var progressWidth = Math.floor(lossProgress * Config.TreasureProgressSize);
      var lootWidth = Math.floor(lootProgress * Config.TreasureProgressSize);
      
      this._treasureProgress.setWidth(progressWidth);
      this._lootProgress.x = this._treasureProgress.getRight();
      this._lootProgress.setWidth(lootWidth);
      
      // update monster health bar
      var monsterHealth = this._player.health;
      var progress = monsterHealth / Config.MonsterHealth;
      
      this._monsterProgress.setWidth(Math.floor(progress * Config.MonsterProgressSize));
      // todo set special
      this._monsterSpecialProgress.setWidth((this._player.dashLevel/ Config.MonsterDashCooldown) * Config.MonsterSpecialProgressSize);
            
      if ((curr + looting) <= 0) {
         this._gameOver(GameOverType.Hoard);
      }

      var focus = game.currentScene.camera.getFocus().toVector();
      var position = new ex.Vector(this._player.x, this._player.y);
      var stretch = position.minus(focus).scale(Config.CameraElasticity);
      this._cameraVel = this._cameraVel.plus(stretch);
      var friction = this._cameraVel.scale(-1).scale(Config.CameraFriction);
      this._cameraVel = this._cameraVel.plus(friction);
      focus = focus.plus(this._cameraVel);
      game.currentScene.camera.setFocus(focus.x, focus.y);
   }
   
   private addTreasure(t: Treasure) {
      this._treasures.push(t);
      this.add(t);
   }   
   
   public getHoardAmount() {
      return this._treasures.length * Config.TreasureHoardSize;
   }
   
   public _gameOver(type: GameOverType) {
      //TODO
      console.log('game over');
      isGameOver = true;
      game.goToScene('gameover');
      gameOver.setType(type);
   }
   
   
   
   // exported from Tiled JSON
   private _walls: number[] = [179, 179, 179, 179, 179, 179, 179, 179, 179, 186, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 187, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 179, 179, 179, 179, 292, 293, 293, 179, 179, 179, 179, 179, 179, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 179, 179, 179, 179, 179, 179, 179, 179, 509, 179, 179, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 179, 179, 179, 179, 179, 179, 179, 179, 179, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 179, 179, 179, 179, 179, 179, 509, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 291, 179, 179, 179, 179, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 179, 179, 179, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 291, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 185, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 185, 739, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1131, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 739, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1131, 183, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 183, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 179, 179, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 291, 179, 179, 179, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 179, 179, 179, 179, 179, 179, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 179, 179, 179, 179, 509, 179, 179, 179, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 291, 179, 179, 179, 179, 179, 179, 179, 179, 179, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 179, 179, 179, 179, 295, 179, 179, 179, 179, 179, 179, 179, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 179, 179, 179, 179, 179, 296, 179, 179, 179, 179, 179, 179, 179, 179, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 179, 179, 179, 179, 179, 179, 300, 179, 179, 179, 179, 298, 299, 179, 179, 179, 188, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 189, 179, 179, 179, 179, 179, 179, 179, 179, 179];
}