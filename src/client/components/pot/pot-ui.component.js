import { CardComponent } from "../card/card.component.js";

export class Pot_UI {

   // potClassName = 'card-pot';
   // potContainer;
   // pot

   constructor(pot) {
      this.pot = pot;
      this.game_div = document.getElementById('game');

      this.potClassName = 'card-pot';
   }

   buildPot() {
      var parentFrag = document.createDocumentFragment();

      this.potContainer = document.createElement('div');
      this.potContainer.classList.add(this.potClassName);
      this.potContainer.classList.add('grid');

      parentFrag.appendChild(this.potContainer);
      this.game_div.appendChild(parentFrag);

      this.potContainer.ondragover = function(e) {
         e.preventDefault();
      }

      this.potContainer.ondrop = this.cardDrop.bind(this);
   }

   cardDrop(e) {
      e.preventDefault();
      
      var cardID = e.dataTransfer.getData('text/plain');

      if(this.pot.playCardInPot(cardID)) {
         var cardUI = document.getElementById(cardID);
         e.currentTarget.appendChild(cardUI);
      }
   }

   updateCards(cardsPlayed, winner) {
      let cardContainer;

      cardsPlayed.forEach(element => {
         cardContainer = document.getElementById(element.card.id);

         if(!cardContainer) {
            cardContainer = new CardComponent(element.card.suit, element.card.rank).cardUI.cardContainer;
         }

         if (winner && winner.card.id === element.card.id) {
            cardContainer.classList.add('winning-hand');
         }

         cardContainer.classList.add(element.player.name);


         this.potContainer.appendChild(cardContainer);
      });
   }

   clear() {
      var child = this.potContainer.lastChild;

      while(child) {
         this.potContainer.removeChild(child);
         child = this.potContainer.lastChild;
      }
   }
}