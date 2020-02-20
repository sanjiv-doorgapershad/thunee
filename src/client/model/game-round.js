import { GameHand } from "../../common/model/game-hand.model.js";
import { PotComponent } from "../components/pot/pot.component.js";
import { GameService } from "../services/game.service.js";

export class GameRound {

   // playedHands = [];
   // playedCards = [];
   // myPlayer;
   // game;
   // rules;
   // pot;

   constructor(game, rules) {
      if (game === undefined) {
         throw('GameRound : game undefined')
      }

      if (rules === undefined) {
         throw('GameRound : rules undefined')
      }

      this.myPlayerComponent;

      this.game = game;
      this.rules = rules;
      this.pot = new PotComponent(this);

      this.playedHands = [];
      this.playedCards = [];

      this.gameService = new GameService();
   }

   setTrump(card, player) {
      if (card === undefined) {
         throw('GameRound > setTrump : card undefined')
      }

      if (player === undefined) {
         throw('GameRound > setTrump : player undefined')
      }
      
      if(this.rules.canSelectTrump(player)) {
         this.trump = card;
         return true;
      }

      return false;
   }

   getTrump() {
      return this.trump;
   }

   playCard(cardId) {
      if (cardId === undefined) {
         throw('GameRound > playCard : cardId undefined')
      }

      const card = this.myPlayerComponent.getCardComponent(cardId).card;

      if(this.rules.canPlayCard(this.myPlayerComponent.player)) {
         
         this.gameService.playCard(this.myPlayerComponent.player, card, this.game.name);
         return true;
      }

      return false;
   }
}