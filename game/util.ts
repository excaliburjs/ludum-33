class Util {
   
   public static pickRandom<T>(arr: Array<T>): T {
      return arr[ex.Util.randomIntInRange(0, arr.length - 1)];
   }
   
}