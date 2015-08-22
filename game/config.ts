

var Config = {
   MonsterWidth: 48,
   MonsterHeight: 48,
   MonsterSpeed: 200,
   MonsterAttackRange: 80,
   
   CameraElasticity: 0.05,//.01,
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
   
   // Amount of gold heroes can carry
   TreasureStealAmount: 1,   
   // Amount of gold in each treasure stash
   TreasureHoardSize: 5,
   // Treasure progress indicator width (in px)
   TreasureProgressSize: 600
}