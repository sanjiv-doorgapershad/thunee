export class GameHand {
   // card;
   // player;

   constructor(card, player) {
      if (!card) {
         throw('card is not defined');
      }

      if (!player) {
         throw('player is not defined');
      }

      this.card = card;
      this.player = player;
      this.value = this.getValue();
   }

   getValue() {
      switch (this.card.rank) {
         case 'A':
            return 11;
         case '9':
            return 20;
         case '10':
            return 10;
         case 'J':
            return 30;
         case 'K':
            return 3;
         case 'Q':
            return 2;
      }
   }
}