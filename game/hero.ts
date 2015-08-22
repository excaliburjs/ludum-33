enum HeroStates {
   Searching,
   Looting,
   Attacking,
   Fleeing
}

class HeroSpawner {
   private static _spawned: number = 0;
   private static _heroes: Hero[] = [];
   
   public static spawnHero() {
      HeroSpawner._spawned++;
      
      // todo better spawning logic
      for (var i = 0; i < Math.min(Config.HeroSpawnPoolMax, HeroSpawner._spawned); i++) {
         var spawnPoints = map.getSpawnPoints();
         var spawnPoint = Util.pickRandom(spawnPoints);
         
         var hero  = new Hero(spawnPoint.x, spawnPoint.y);
         game.add(hero);
         this._heroes.push(hero);
      }
   }
   
   public static getHeroes(): Array<Hero> {
      return this._heroes;
   }
   
   public static despawn(h: Hero) {
      h.kill();
      _.remove(this._heroes, h);
   }
}

class Hero extends ex.Actor {
   public static Speed: number = 100;
   public static FleeingSpeed: number = 60;
   
   private _treasure: number = 0;
   private _fsm: TypeState.FiniteStateMachine<HeroStates>;
   
   constructor(x: number, y: number) {
      super(x, y, 24, 24);
      
      this.addDrawing(Resources.TextureHero);
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
   
   public getLines() {
      var lines = new Array<ex.Line>();

      var beginPoint1 = new ex.Point(this.x, this.y);
      var endPoint1 = new ex.Point(this.x + this.getWidth(), this.y);
      var newLine1 = new ex.Line(beginPoint1, endPoint1);

      // beginPoint2 is endPoint1
      var endPoint2 = new ex.Point(endPoint1.x, endPoint1.y + this.getHeight());
      var newLine2 = new ex.Line(endPoint1, endPoint2);

      // beginPoint3 is endPoint2
      var endPoint3 = new ex.Point(this.x, this.y + this.getHeight());
      var newLine3 = new ex.Line(endPoint2, endPoint3);

      // beginPoint4 is endPoint3
      // endPoint4 is beginPoint1
      var newLine4 = new ex.Line(endPoint3, beginPoint1);

      lines.push(newLine1);
      lines.push(newLine2);
      lines.push(newLine3);
      lines.push(newLine4);
      return lines;

   }
   
   private onSearching(from?: HeroStates) {
       // find treasures
      var treasures = map.getTreasures();
      
      // random treasure for now
      var loot =  Util.pickRandom(treasures);
      
      // move to it
      this.moveTo(loot.x, loot.y, Hero.Speed);
   }
   
   private onLooting(from?: HeroStates) {
      // play animation
      this.delay(2000).callMethod(() => this._fsm.go(HeroStates.Fleeing));
   }
   
   private onFleeing(from?: HeroStates) {
      // find nearest exit
      var exit = map.getCellPos(19, 1);
      
      this.moveTo(exit.x, exit.y, Hero.FleeingSpeed).callMethod(() => this.onExit());
   }
   
   private onAttacking(from?: HeroStates) {
      
      // stop any actions
      this.clearActions();
      
      // attack monster
      
   }
   
   private onExit() {     
      // play negative sound or something
      
      HeroSpawner.despawn(this);
   }
}