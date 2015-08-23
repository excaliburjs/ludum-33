

var Config = {
   MonsterHealth: 30,
   MonsterWidth: 48,
   MonsterHeight: 48,
   MonsterSpeed: 200,
   MonsterAttackRange: 80,
   MonsterProgressSize: 200,
   
   BloodMaxAmount: 300,
   BloodMinFriction: 0.15,
   BloodMaxFriction: 0.40,
   BloodXYVariation: 6,
   BloodSplatterMinAngle: ex.Util.toRadians(20),
   BloodSplatterMaxAngle: ex.Util.toRadians(20),
   BloodSplatterAngleVariation: ex.Util.toRadians(15),
   BloodVelocityMin: 10,
   BloodVelocityMax: 40,
   
   CameraElasticity: 0.1,//.01,
	CameraFriction: 0.5,//0.21,
	CameraShake: 0,//7,
	CameraShakeDuration: 0,//200,//800,      
   
   // Spawn interval
   HeroSpawnInterval: 10000, // in ms   
   // Max heroes to spawn at once
   HeroSpawnPoolMax: 5,
   // How much health a hero has
   HeroHealth: 3,  
   // Hero speed (in px/s)
   HeroSpeed: 100,
   // Hero with loot speed (in px/s)
   HeroFleeingSpeed: 80,
   // The cooldown amount for a hero's attack
   HeroAttackCooldown: 2000,
   // The maximum distance a hero will aggro to the monster
   HeroAggroDistance: 100,
   
   // Amount of gold heroes can carry
   TreasureStealAmount: 1,   
   // Amount of gold in each treasure stash
   TreasureHoardSize: 5,
   // Treasure progress indicator width (in px)
   TreasureProgressSize: 600
}