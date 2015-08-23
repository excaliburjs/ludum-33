class SoundManager {
   
   public static start() {
      // make sure volume is set for sounds
      _.forIn(Resources, (resource) => {
         if (resource instanceof ex.Sound) {
            (<ex.Sound>resource).setVolume(1);
         }
      });
      
      Resources.AxeSwingHit.setVolume(0.2);
      Resources.SoundMusic.setVolume(0.05);  
      Resources.SoundMusic.play();    
      Resources.SoundMusic.setLoop(true);
   }
   
   public static stop() {
      // make sure volume is set for sounds
      _.forIn(Resources, (resource) => {
         if (resource instanceof ex.Sound) {
            (<ex.Sound>resource).setVolume(0);
         }
      });
   }
   
   // todo save/restore settings
}