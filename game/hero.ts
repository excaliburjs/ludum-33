enum HeroStates {
   Searching,
   Looting,
   Attacking,
   Fleeing
}

class HeroSpawner {
   private static _spawned: number = 0;
   
   public static spawnHero() {
      HeroSpawner._spawned++;
      
      // todo better spawning logic
      for (var i = 0; i < Math.min(Config.HeroSpawnPoolMax, HeroSpawner._spawned); i++) {
         var spawnPoints = map.getSpawnPoints();
         var spawnPoint = Util.pickRandom(spawnPoints);
         
         game.add(new Hero(spawnPoint.x, spawnPoint.y));      
      }
   }
   
}

class Hero extends ex.Actor {      
   private _treasure: number = 0;
   private _fsm: TypeState.FiniteStateMachine<HeroStates>;

   constructor(x: number, y: number) {
      super(x, y, 24, 24);
            
      this._fsm = new TypeState.FiniteStateMachine<HeroStates>(HeroStates.Searching);
      
      // declare valid state transitions
      this._fsm.from(HeroStates.Searching).to(HeroStates.Attacking, HeroStates.Looting);
      this._fsm.from(HeroStates.Looting).to(HeroStates.Fleeing);
      
      this._fsm.on(HeroStates.Searching, this.onSearching.bind(this)); 
      this._fsm.on(HeroStates.Looting, this.onLooting.bind(this));     
      this._fsm.on(HeroStates.Fleeing, this.onFleeing.bind(this));
   }
   
   onInitialize(engine: ex.Engine) {
      this.setZIndex(1);
      
      var spriteSheet = new ex.SpriteSheet(Resources.TextureHero, 3, 1, 28, 28);
      var idleAnim = spriteSheet.getAnimationForAll(engine, 300);
      idleAnim.loop = true;
      idleAnim.scale.setTo(2, 2);
      
      this.addDrawing("idle", idleAnim);
      
      this.collisionType = ex.CollisionType.Active;
      
      this.on('collision', (e?: ex.CollisionEvent) => {
         if (e.other instanceof Treasure) {
            if ((<Hero>e.actor)._treasure === 0) {
               (<Hero>e.actor)._treasure = (<Treasure>e.other).steal();
               (<Hero>e.actor)._fsm.go(HeroStates.Looting);
            }
         }
      });
     
      this.onSearching();
   }
   
   private onSearching(from?: HeroStates) {
       // find treasures
      var treasures = map.getTreasures();
      
      // random treasure for now
      var loot =  Util.pickRandom(treasures);
      
      // move to it
      this.moveTo(loot.x, loot.y, Config.HeroSpeed);
   }
   
   private onLooting(from?: HeroStates) {
      // play animation
      this.delay(2000).callMethod(() => this._fsm.go(HeroStates.Fleeing));
   }
   
   private onFleeing(from?: HeroStates) {
      
      // find an exit
      var exits = map.getSpawnPoints();
      var exit = Util.pickRandom(exits);
      
      this.moveTo(exit.x, exit.y, Config.HeroFleeingSpeed).callMethod(() => this.onExit());
   }
   
   private onAttacking(from?: HeroStates) {
      
      // stop any actions
      this.clearActions();
      
      // attack monster
      
   }
   
   private onExit() {     
      // play negative sound or something
      
      this.kill();
   }
}