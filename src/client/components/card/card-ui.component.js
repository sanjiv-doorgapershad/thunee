export class Card_UI {

   // cardContainer;
   
   constructor(cardComponent) {
      if (cardComponent.card.suit === undefined) {
         throw('Card_UI: suit undefined');
      } else if (cardComponent.card.rank === undefined) {
         throw('Card_UI: rank undefined');
      } else {
         this.cardComponent = cardComponent;
   
         this.cardContainer = document.createElement('div');
         this.cardContainer.className += 'card-container';
   
         this.cardFront = document.createElement('div');
         this.cardFront.className += 'card-front';

         if (cardComponent.card.suit === '&hearts;' || cardComponent.card.suit === '&diams;') {
            this.cardFront.classList.add('card-red');
         }
      }
   }

   buildCard(parentFrag) {

      var flipDiv = document.createElement('div'),
      frontValDiv = document.createElement('span'),
      categoryDiv = document.createElement('span');

      flipDiv.className += 'flip';
      frontValDiv.className += 'front-val';
      categoryDiv.className += 'cat-val';

      // val
      frontValDiv.innerHTML = this.cardComponent.card.rank;

      // suit
      categoryDiv.innerHTML = this.cardComponent.card.suit;

      this.cardFront.appendChild(frontValDiv);
      this.cardFront.appendChild(categoryDiv);

      flipDiv.appendChild(this.cardFront);

      this.cardContainer.id = this.cardComponent.card.id;
      this.cardContainer.appendChild(flipDiv);

      // flip
      this.setDrag(false);
      // this.cardContainer.draggable = true;
      // this.cardContainer.ondragstart = this.cardDragStarted.bind(this);

      if (parentFrag) {
         parentFrag.appendChild(this.cardContainer);
      }
   }

   cardDragStarted(e) {
      e.dataTransfer.setData("text/plain", e.currentTarget.id);
   }

   setDrag(draggable=true) {
      this.cardContainer.draggable = draggable;

      if (draggable) {
         this.cardContainer.ondragstart = this.cardDragStarted.bind(this);
      } else {
         this.cardContainer.ondragstart = null;
      }
   }
}