class SoundManager {
   
   public static start() {
      // set all sound effect volumes
      if (Options.sound) {
         SoundManager.setSoundEffectLevels(1);
      } else {
         SoundManager.setSoundEffectLevels(0);
      }
      // set music volume
      if (Options.music) {
         Resources.SoundMusic.setVolume(0.05);
         Resources.SoundMusic.play();    
         Resources.SoundMusic.setLoop(true);
      } else {
         Resources.SoundMusic.setVolume(0);
      }
   }
   
   public static setSoundEffectLevels(volume: number) {
      _.forIn(Resources, (resource) => {
         if (resource instanceof ex.Sound && (resource != Resources.SoundMusic)) {
            (<ex.Sound>resource).setVolume(volume);
         }
      });
      // adjusting a few sound effect volume levels
      if (volume != 0) {
         Resources.AxeSwingHit.setVolume(0.2);
      }
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