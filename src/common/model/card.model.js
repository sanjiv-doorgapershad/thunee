export class Card {

   constructor(suit, rank) {
      this.suit = suit;
      this.rank = rank;
      this.id = `${this.rank}-${this.suit}`;
   }

}