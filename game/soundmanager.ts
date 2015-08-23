class SoundManager {
   
   public static start() {
      // make sure volume is set for sounds
      _.forIn(Resources, (resource) => {
         if (resource instanceof ex.Sound) {
            (<ex.Sound>resource).setVolume(1);
         }
      });
      SoundManager.setSoundEffectLevels();
      Resources.SoundMusic.play();    
      Resources.SoundMusic.setLoop(true);
   }
   
   public static setSoundEffectLevels() {
      Resources.AxeSwingHit.setVolume(0.2);
      Resources.SoundMusic.setVolume(0.05);
   }
   
   public static toggleSoundEffects() {
      var volume;
      if (Options.music) {
         volume = 0;
      } else {
         volume = 1;
      }
      _.forIn(Resources, (resource) => {
         if (resource instanceof ex.Sound && (resource != Resources.SoundMusic)) {
            (<ex.Sound>resource).setVolume(volume);
         }
      });
      if (volume == 1) {
         SoundManager.setSoundEffectLevels();
      }
   }
   
   public static toggleMusic() {
      var volume;
      if (Options.sound) {
         volume = 0;
      } else {
         volume = 1;
      }
      Resources.SoundMusic.setVolume(volume);
   }
   
   public static stop() {
      // make sure volume is set for sounds
      _.forIn(Resources, (resource) => {
         if (resource instanceof ex.Sound) {
            (<ex.Sound>resource).setVolume(0);
            (<ex.Sound>resource).stop();
         }
      });
   }
   
   // todo save/restore settings
}