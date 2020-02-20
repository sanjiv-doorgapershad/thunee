import { Player_UI } from "./player-ui.component.js";
import { DeckService } from "../../services/deck.service.js";
import { GameService } from "../../services/game.service.js";
import { CardComponent } from "../card/card.component.js";

export class PlayerComponent {

   // activated;
   // nextPlayer;
   // previousPlayer;
   // isActivePlayer;
   // playerUI;
   // winningHands;

   constructor(player, gameRound) {
      this.player = player;
      this.cardComponents = [];
      this.trump;
      this.winningHands = [];
      this.gameRound = gameRound;
      this.playerUI = new Player_UI(this);
      this.deckService = new DeckService();
      this.gameService = new GameService();

      if (this.player.isMyPlayer) {
         this.deckService.newCardsReceived().then(this.takeCards.bind(this));
      }
   }

   takeCards(newCards) {
      newCards.forEach((newCard) => {
         let card = new CardComponent(newCard.suit, newCard.rank);
         card.played = this.cardPlayed.bind(this);

         this.cardComponents.push(card);
      });

      this.playerUI.buildPlayer();
   }

   takeDeck(deck) {
      if (this.player.isDealer) {
         this.deck = deck;
      } else {
         throw(`${this.name} is not the dealer`)
      }
   }

   cardPlayed(selectedCard) {
      console.log(`${this.name} selected card ${selectedCard.id}`);
      if (this.gameRound.playCard(selectedCard, this)) {
         selectedCard.cardUI.cardContainer.classList.add(this.playerUI.playerNumberClassName);
      }
   }

   shuffle() {
      if (this.player.isDealer) {
         this.deckService.shuffle(this.gameRound.game.name);
      } else {
         throw(`${this.name} is not the dealer`)
      }
   }

   deal() {
      if (!this.player.isDealer) {
         throw(`${this.player.name} is not the dealer`)
      } else if (!this.player.isActivePlayer) {
         throw(`${this.player.name} is not the active player`)
      } else {

         if (this.cardComponents.length === 0) {
            this.deckService.deal(this.gameRound.game.name, 4);
         } else {
            this.deckService.deal(this.gameRound.game.name, 2);
         }
      }
   }

   selectTrump(cardId, callback) {
      if (this.player.isKeepingTrump) {
         this.gameService.setTrump(this.player, cardId, this.gameRound.game.name).then(response => {
            if (callback) {
               if (response.name === 'trumpset') {
                  this.gameRound.setTrump(this.getCardComponent(cardId), this.player);
               }

               callback(response.name === 'trumpset')
            }
         });
      } else {
         throw(`${this.player.name} is not keeping trump`)
      }
   }

   getTrump() {
      if (this.player.isKeepingTrump) {
         return this.gameRound.getTrump();
      } else {
         throw(`${this.player.name} is not keeping trump`)
      }
   }

   setWinner(playedCards) {
      this.winningHands.push(playedCards);
      this.playerUI.setWinner();
   }

   takeWinner() {
      this.gameService.takeWinner(this.gameRound.game.name);
   }

   getCardComponent(cardId) {
      return this.cardComponents.find(item => { return item.card.id === cardId });
   }
}