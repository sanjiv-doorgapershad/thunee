export class Deck_UI {
   constructor(deck) {
      if(deck.cards === undefined || deck.cards.length === 0) {
         throw('Deck_UI: No cards available');
      } else {
         this.deck = deck;
         this.deck_div = document.getElementById('deck');

         if (this.deck_div) {
            this.deck.shuffleComplete = this.buildDeck.bind(this);
         }
         
      };
   }

   buildDeck() {
      if (this.deck_div) {
         var parentFrag = document.createDocumentFragment();
         
         this.deck_div.innerHTML = "";

         this.deck.cards.forEach(card => {
            parentFrag.appendChild(card.cardUI.cardContainer)
         });

         this.deck_div.appendChild(parentFrag);
      }
   }
}