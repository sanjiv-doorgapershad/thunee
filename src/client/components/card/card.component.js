import { Card_UI } from "./card-ui.component.js";
import { Card } from "../../../common/model/card.model.js";

export class CardComponent {

   // played;
   // cardUI;

   constructor(suit, rank) {
      this.card = new Card(suit, rank);
      this.cardUI = new Card_UI(this);
      this.cardUI.buildCard();
   }

   play() {
      if (this.played) {
         this.played(this);
      }
   }
}