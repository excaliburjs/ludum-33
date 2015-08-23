var Options = {
   public blood: true,
   public music: true,
   public sound: true
}

class Settings extends ex.Scene {
   
   public onInitialize(engine: ex.Engine) {
      
      var bloodToggle = new ex.Actor(game.width / 2, game.height / 2, 50, 50, ex.Color.Red)
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
   }
}