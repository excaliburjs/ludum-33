class Map extends ex.Scene {
   public static CellSize = 24;
   
   private _treasures: Treasure[];
   private _map: ex.Actor; // todo TileMap
   private _player: Monster;
   private _treasureProgress: ex.UIActor;
   
   constructor(engine: ex.Engine) {
      super(engine);
      
      this._treasures = [];
   }
   
   public onInitialize() {
      this._map = new ex.Actor(0, 0, 960, 960);
      this._map.anchor.setTo(0, 0);
      this._map.addDrawing(Resources.TextureMap);
      this.add(this._map);
      
      // show GUI
      var progressBack = new ex.UIActor(60, 23, Config.TreasureProgressSize + 4, 40);
      progressBack.color = ex.Color.Black;
      this.add(progressBack);
      
      this._treasureProgress = new ex.UIActor(60, 27, Config.TreasureProgressSize, 32);
      this._treasureProgress.color = ex.Color.fromHex("#eab600");
      this.add(this._treasureProgress);
      
      var treasureIndicator = new ex.UIActor(10, 10, 64, 64);
      treasureIndicator.addDrawing(Resources.TextureTreasureIndicator);
      this.add(treasureIndicator);
      
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
      
      var playerSpawn = this.getCellPos(19, 19);
      this._player = new Monster(playerSpawn.x, playerSpawn.y);
      
      this.add(this._player);
   }
   
   public getPlayer(): Monster {
      return this._player;
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
   
   public getCellPos(x: number, y: number): ex.Point {
      return new ex.Point(Map.CellSize * x, Map.CellSize * y);
   }
   
   private _cameraVel = new ex.Vector(0, 0);
   
   public update(engine: ex.Engine, delta: number) {
      super.update(engine, delta);
      
      // update treasure indicator
      var total = this._treasures.length * Config.TreasureHoardSize;
      var curr = _.sum(this._treasures, (x) => x.getAmount());
      var prog = (curr / total);
      this._treasureProgress.setWidth(Math.floor(prog * Config.TreasureProgressSize));
      if (curr <=0) {
         this._gameOver();
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
   
   private _gameOver() {
      //TODO
      console.log('game over');
   }
}