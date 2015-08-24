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
         Resources.SoundMusic.setVolume(0.03);
         if (!Resources.SoundMusic.isPlaying()) {
            Resources.SoundMusic.play();    
            Resources.SoundMusic.setLoop(true);
         }
         Resources.GameOver.setVolume(0.1);
      } else {
         Resources.SoundMusic.setVolume(0);
         Resources.GameOver.setVolume(0);
      }
   }
   
   public static setSoundEffectLevels(volume: number) {
      _.forIn(Resources, (resource) => {
         if (resource instanceof ex.Sound && (resource != Resources.SoundMusic) && (resource != Resources.GameOver)) {
            (<ex.Sound>resource).setVolume(volume);
         }
         Resources.Fireball.setVolume(0.5);
      });
   }
   
   public static stop() {
      // make sure volume is set for sounds
      _.forIn(Resources, (resource) => {
         if (resource instanceof ex.Sound) {
            (<ex.Sound>resource).setVolume(0);
            if (resource != Resources.SoundMusic) {
               (<ex.Sound>resource).stop();
            }
         }
      });
   }
   
   // todo save/restore settings
}