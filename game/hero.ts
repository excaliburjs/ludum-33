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
   public Health: number = Config.HeroHealth;
   
   private _treasure: number = 0;
   private _fsm: TypeState.FiniteStateMachine<HeroStates>;
   private _attackCooldown: number = Config.HeroAttackCooldown;

   constructor(x: number, y: number) {
      super(x, y, 24, 24);
            
      this._fsm = new TypeState.FiniteStateMachine<HeroStates>(HeroStates.Searching);
      
      // declare valid state transitions
      this._fsm.from(HeroStates.Searching).to(HeroStates.Attacking, HeroStates.Looting);
      this._fsm.from(HeroStates.Attacking).to(HeroStates.Searching);
      this._fsm.from(HeroStates.Looting).to(HeroStates.Fleeing);
      
      this._fsm.on(HeroStates.Searching, this.onSearching.bind(this)); 
      this._fsm.on(HeroStates.Looting, this.onLooting.bind(this));     
      this._fsm.on(HeroStates.Fleeing, this.onFleeing.bind(this));
      this._fsm.on(HeroStates.Attacking, this.onAttacking.bind(this));
   }
   
   onInitialize(engine: ex.Engine) {
      this.setZIndex(1);
      
      var spriteSheet = new ex.SpriteSheet(Resources.TextureHero, 3, 1, 28, 28);
      var idleAnim = spriteSheet.getAnimationForAll(engine, 300);
      idleAnim.loop = true;
      idleAnim.scale.setTo(2, 2);
      
      this.addDrawing("idle", idleAnim);
      
      this.collisionType = ex.CollisionType.Passive;
      
      this.on('collision', (e?: ex.CollisionEvent) => {
         if (e.other instanceof Treasure) {
            if ((<Hero>e.actor)._treasure === 0) {
               (<Hero>e.actor)._treasure = (<Treasure>e.other).steal();
               (<Hero>e.actor)._fsm.go(HeroStates.Looting);
            }
         } else if (e.other instanceof Monster) {
            if (this._attackCooldown == 0) {
               var monster = <Monster>e.other;
               monster.health--;
               this._attackCooldown = Config.HeroAttackCooldown;
            }
         }
      });

      this.onSearching();

   }
   
   public update(engine: ex.Engine, delta: number) {
      super.update(engine, delta);
      
      if (this.Health <= 0) {
            map.getTreasures()[0].return(this._treasure);
            HeroSpawner.despawn(this);
      }
      this.setZIndex(this.y);
      this._attackCooldown = Math.max(this._attackCooldown - delta, 0);
      
      var heroVector = new ex.Vector(this.x, this.y);
      var monsterVector = new ex.Vector(map._player.x, map._player.y);
      
      switch (this._fsm.currentState) {
         case HeroStates.Searching:
         if (heroVector.distance(monsterVector) < Config.HeroAggroDistance) {
            this._fsm.go(HeroStates.Attacking);
            // console.log('switching to attack');
         }
         break;
         case HeroStates.Attacking:
         if (heroVector.distance(monsterVector) > Config.HeroAggroDistance)
            this._fsm.go(HeroStates.Searching);
            // console.log('stopping attack');
         break;
      }
   }

   public getLootAmount(): number {
      return this._treasure;
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
      
      // TODO attack monster
      this.meet(map._player, Config.HeroSpeed);
   }
   
   private onExit() {     
      // play negative sound or something
      
      HeroSpawner.despawn(this);
   }
}