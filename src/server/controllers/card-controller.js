import { thuneeCards } from "../../common/data/thunee-cards";
import { CardUtil } from "../../common/card-util";
import { Card } from "../../common/model/card.model";

export class CardController {

   constructor() {
      this.allCards = [];
      this.availableCards = [];

      Array.from(thuneeCards).forEach(card => {
         this.allCards.push(new Card(card.suit, card.rank));
      });

      this.newCards();
      this.shuffle();
   }

   getCards() { 
      return this.availableCards; 
   }

   newCards() {
      this.availableCards = Array.from(this.allCards);
   }

   shuffle() {
      this.availableCards = CardUtil.shuffle(this.availableCards, 5);
   }

   dealCards(cardCount, players) {

      const dealtCardSets = [];

      for(var playerCount = 0; playerCount < players.length; playerCount++) {

         let cards = [];

         for(var i = 0; i < cardCount; i++) {
            const card = this.removeCard();
            cards.push(card)
         }

         dealtCardSets.push({ cards: cards, player: players[playerCount] });
      }

      return dealtCardSets;
   }

   removeCard() {
      var card = this.availableCards.shift();
      return card;
   }

   createCard(cardId) {
      return this.allCards.find((card) => {
         return card.id === cardId;
      });
   }
}