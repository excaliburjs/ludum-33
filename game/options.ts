var Options = {
   public blood: true,
   public music: true,
   public sound: true
}

class Settings extends ex.Scene {
   
   public onInitialize(engine: ex.Engine) {
      
      var bloodToggle = new ex.Actor(game.width / 2, 100 + game.height / 2, 50, 50, ex.Color.Red)
      this.add(bloodToggle);
      bloodToggle.on('pointerdown', (e?: ex.Input.PointerEvent) => {
         if (Options.blood) {
            Options.blood = false;
            bloodToggle.color = ex.Color.DarkGray;
         } else {
            Options.blood = true;
            bloodToggle.color = ex.Color.Red;
         }
      });
      
      var musicToggle = new ex.Actor(game.width / 2, game.height / 2, 50, 50, ex.Color.Red)
      this.add(musicToggle);
      musicToggle.on('pointerdown', (e?: ex.Input.PointerEvent) => {
         if (Options.music) {
            Options.music = false;
            musicToggle.color = ex.Color.DarkGray;
         } else {
            Options.music = true;
            musicToggle.color = ex.Color.Red;
         }
      });
      
      var soundToggle = new ex.Actor(game.width / 2, -100 + game.height / 2, 50, 50, ex.Color.Red)
      this.add(soundToggle);
      soundToggle.on('pointerdown', (e?: ex.Input.PointerEvent) => {
         if (Options.sound) {
            Options.sound = false;
            soundToggle.color = ex.Color.DarkGray;
         } else {
            Options.sound = true;
            soundToggle.color = ex.Color.Red;
         }
      });
   }
   
   public onDeactivate() {
      HeroSpawner.toggleTombstones(Options.blood);
   }
}