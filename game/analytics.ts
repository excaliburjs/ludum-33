class Analytics {
   
   static trackGameOver() {
      var survivalTime = map.getSurvivalTime();
      
      Analytics._trackEvent('GameOver', {
         SurvivalTime: survivalTime,
         HeroesKilled: Stats.numHeroesKilled,
         HeroesEscaped: Stats.numHeroesEscaped,
         TotalHeroes: HeroSpawner.getSpawnCount(),
         GoldLost: (Stats.goldLost / map.getHoardAmount()),
         TotalGold: map.getHoardAmount(),
         DamageTaken: (Stats.damageTaken / Config.MonsterHealth),
         
         GoreEnabled: Options.blood,
         MusicEnabled: Options.music,
         SoundEnabled: Options.sound
      }, survivalTime);
      
      Analytics._trackTiming('Survival', survivalTime);
   }
   
   static trackGameStart() {
      Analytics._trackEvent('GameStart');
   }
   
   static trackGameRestart() {
      Analytics._trackEvent('GameRestart');
   }
   
   private static _trackTiming(name: string, value: number) {
      
      try {
         var ga = (<any>window).ga;
         
         ga && ga('send', 'timing', 'Game', name, value);
      
      } catch (ex) {
         ex.Logger.getInstance().error("Error while sending Google analytics timing", ex);
      }
      
      try {
         var ai = (<any>window).appInsights;
                  
         ai && ai.trackMetric(name, value);
               
      } catch (ex) {
         ex.Logger.getInstance().error("Error while sending Google analytics timing", ex);
      }
   }
   
   private static _trackEvent(name: string, data: {} = null, stat: number = -1) {
      try {
         var ga = (<any>window).ga;
                  
         // google
         if (ga && stat > -1) {
            ga('send', {
               hitType: 'event',
               eventCategory: 'Game',
               eventAction: name,
               eventValue: stat
            });
         } else if (ga) {
            ga('send', {
               hitType: 'event',
               eventCategory: 'Game',
               eventAction: name
            });
         }
      } catch (ex) {
         ex.Logger.getInstance().error("Error while sending Google analytics", ex);
      }
      
      try {
         var ai = (<any>window).appInsights;
         
         // appinsights
         if (ai && data) {
            ai.trackEvent(name, data);
         } else if (ai) {
            ai.trackEvent(name);
         }
      } catch (ex) {
         ex.Logger.getInstance().error("Error while sending App Insights analytics", ex);
      }
   }
}