export class Player {
   constructor(id, name, isDealer=false, isKeepingTrump=false) {
      this.id = id;
      this.name = name;
      this.isDealer = isDealer;
      this.isKeepingTrump = isKeepingTrump;
      this.isActivePlayer = false;
      this.isMyPlayer = false;
      this.points = 0;
   }
}