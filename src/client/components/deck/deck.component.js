import { Deck_UI } from "./deck-ui.component.js";

export class DeckComponent {

   // shuffleComplete;
   // dealComplete;
   // deckUI;

   constructor(cards, players, gameRules) {
      if (cards === undefined) {
         throw('Deck: cards undefined')
      } else if (players === undefined) {
         throw('Deck: players undefined')
      } else if (gameRules === undefined) {
         throw('Deck: gameRules undefined')
      } else {
         this.cards = cards;
         this.players = players
         this.gameRules = gameRules;

         this.deckUI = new Deck_UI(this);
      }
   }

   getCard(cardId) {
      return this.cards.find(item => { return item.id === cardId });
   }
}