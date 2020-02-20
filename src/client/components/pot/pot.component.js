import { Pot_UI } from "./pot-ui.component.js";

export class PotComponent {
   
   // potUI;
   // selectedCards = [];
   // deck;

   constructor(gameRound) {

      this.gameRound = gameRound;
      this.potUI = new Pot_UI(this);
      this.potUI.buildPot();

      this.selectedCards = [];
   }

   playCardInPot(cardID) {
      return this.gameRound.playCard(cardID);
   }

   update(cardsPlayed, winner) {
      this.potUI.updateCards(cardsPlayed, winner);
   }

   clear() {
      this.selectedCards.length = 0;
      this.potUI.clear();
   }
}