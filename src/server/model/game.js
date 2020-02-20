import { GameConstants } from "../../common/game-constants";
import { CardController } from "../controllers/card-controller";
import { GameStatus } from "../../common/model/game-status.model";
import { GameHand } from "../../common/model/game-hand.model";
import { Card } from "../../common/model/card.model";

export class Game {
   constructor(name) {
      this.state = GameConstants.states.new;
      this.playedHands = [];
      this.playedCards = [];
      this.name = name;
      this.players = new Map();
      this.trump;
      this.winner;
      this.cardController = new CardController();
   }

   addPlayer(player, position=1) {
      if (this.players.size < GameConstants.maxPlayers) {

         player.isKeepingTrump = false;

         if (!this.players.has(position)) {
            if (!player.name) {
               player.name = `player-${position}`
            }

            this.players.set(position, player);
         } else {
            for(var count = 1; count <= GameConstants.maxPlayers; count++) {
               if (!this.players.has(count)) {
                  if (!player.name) {
                     player.name = `player-${count}`
                  }

                  this.players.set(count, player);

                  count = GameConstants.maxPlayers + 1;
               }
            }
         }

         if (player.isDealer) {
            player.isActivePlayer = true;
         }

         this.chooseTrumpPlayer();

         this.state = GameConstants.states.new;

         console.log(`${player.name}: joined game ${this.name}`);

         return true;
      } else {
         return false;
      }
   }

   removePlayer(id) {
      let key;

      this.players.forEach((val, key) => {
         if (val.id === id) {
            key = key;
         }
      });

      this.players.delete(key);
   }

   getPlayer(id) {

      let foundKey;

      this.players.forEach((val, key) => {
         if (val.id === id) {
            foundKey = key;
         }
      });

      return this.players.get(foundKey);
   }

   playerExists(id) {
      const found = this.getPlayer(id);
      return found ? true : false;
   }

   getAllPlayers() {
      let allPlayers = [];

      for(var position = 1; position <= GameConstants.maxPlayers; position++) {
         allPlayers.push(this.players.get(position));
      }

      return allPlayers;
   }

   getStatus() {
      return new GameStatus(this.state, this.getAllPlayers(), this.playedCards, this.winner);
   }

   chooseTrumpPlayer() {
      for(var index = 1; index <= GameConstants.maxPlayers; index++) {
         if (this.players.has(index)) {

            if (this.players.get(index).isDealer) {
               //Make next player the trump
               if (index < GameConstants.maxPlayers && this.players.has(index + 1)) {
                  this.players.get(index + 1).isKeepingTrump = true;
               } else 
               
               //Dealing with last player, then make 1st player the trump
               if (index === GameConstants.maxPlayers && this.players.has(1)) {
                  this.players.get(1).isKeepingTrump = true;
               }
            }
         } else {
            console.log('player does not exist......', index);
         } 
      }
   }

   getActivePlayer() {
      let activePlayer;
      let player;

      for(var position = 1; position <= GameConstants.maxPlayers; position++) {
         player = this.players.get(position);
         if (player && player.isActivePlayer) {
            activePlayer = player;
         }
      }

      return activePlayer;
   }

   setActivePlayer(player) {
      let myPlayer;

      if (player) {
         this.players.forEach((val, key) => {
            myPlayer = this.players.get(key);
            if(myPlayer) {
               myPlayer.isActivePlayer = (val.id === player.id);
            }
            
         });
      }
      
   }

   getNextPlayer(player) {
      let nextPlayer;

      for(var index = 1; index <= GameConstants.maxPlayers; index++) {
         if (this.players.has(index)) {
            if (this.players.get(index).id === player.id) {
               //next index is next player
               if (index < GameConstants.maxPlayers && this.players.has(index + 1)) {
                  nextPlayer = this.players.get(index + 1);
               } else if (index === GameConstants.maxPlayers && this.players.has(1)) {
                  //Dealing with last player, then select 1st player
                  nextPlayer = this.players.get(1);
               }
            }
         } else {
            console.log('player does not exist......', index);
         } 
      }

      return nextPlayer;
   }

   getPreviousPlayer(player) {
      let prevPlayer;

      for(var index = 1; index <= GameConstants.maxPlayers; index++) {
         if (this.players.has(index)) {
            if (this.players.get(index).id === player.id) {
               //prev index is prev player
               if (index > 1 && this.players.has(index - 1)) {
                  prevPlayer = this.players.get(index - 1);
               } else if (index === 1 && this.players.has(GameConstants.maxPlayers)) {
                  //Dealing with 1st player, then select last player
                  prevPlayer = this.players.get(GameConstants.maxPlayers);
               }
            }
         } else {
            console.log('player does not exist......', index);
         } 
      }

      return prevPlayer;
   }

   setTrump(player, cardId) {
      if (this.playerExists(player.id)) {
         const trumpPlayer = this.getPlayer(player.id);

         if (trumpPlayer.isKeepingTrump && trumpPlayer.isActivePlayer) {
            this.trump = this.cardController.createCard(cardId);
            console.log(`Trump: `, this.trump);
            this.state = GameConstants.states.selectTrump;
            this.setActivePlayer(this.getPreviousPlayer(player));
            return true;
         } else {
            console.log(`Game > setTrump : player not keeping trump or active`, player);
            return false;
         }
      } else {
         console.log(`Game > setTrump : player not found`, player);
         return false;
      }
   }

   playCard(player, card) {
      if (this.playerExists(player.id)) {
         this.playedCards.push(new GameHand(card, player));

         if (this.playedCards.length === 4) {
            this.winner = this.whoWon(this.playedCards);
            this.state = GameConstants.states.winnner;
            this.setActivePlayer(this.winner.player);

            let player = this.getPlayer(this.winner.player.id);
            player.points += this.getTotalPoints(this.playedCards);
            
         } else {
            this.winner = null;
            this.state = GameConstants.states.playCard;
            this.setActivePlayer(this.getNextPlayer(player));
         }

         return true;
      } else {
         console.log(`Game > playCard : player not found`, player);
         return false;
      }
   }

   whoWon(playedCards) {
      //who played 1st
      var handSuit = playedCards[0].card.suit;
      var winningHand = playedCards[0];
      
      //who played 2nd
      winningHand = this.getWinningHand(winningHand, playedCards[1], handSuit);

      //who played 3rd
      winningHand = this.getWinningHand(winningHand, playedCards[2], handSuit);

      //who played 4th
      winningHand = this.getWinningHand(winningHand, playedCards[3], handSuit);

      return winningHand;
   }

   getWinningHand(hand1, hand2, handSuit) {
      var winningHand;
      
      if (this.isTrump(hand1.card) && !this.isTrump(hand2.card)) {
         return hand1;
      } 
      
      if (this.isTrump(hand2.card) && !this.isTrump(hand1.card)) {
         return hand2;
      }

      if ((this.isTrump(hand2.card) && this.isTrump(hand1.card)) ||
            (hand2.card.suit !== handSuit && hand1.card.suit !== handSuit) ||
            (hand2.card.suit == handSuit && hand1.card.suit == handSuit)) {
         if (hand1.value > hand2.value) {
            return hand1;
         } else {
            return hand2;
         }
      } 
      
      if (hand2.card.suit !== handSuit ) {
         return hand1;
      } 
      
      if (hand1.card.suit !== handSuit ) {
         return hand2;
      }
   }

   isTrump(card) {
      return this.trump.suit === card.suit;
   }

   takeWinner() {
      this.playedHands.push(this.playedCards);
      this.playedCards.length = 0;
      this.state = GameConstants.states.playCard;
      this.winner = null;
   }

   getTotalPoints(playedCards) {
      var total = 0;

      playedCards.forEach(gameHand => {
         total += gameHand.value;
      });

      return total;
   }
}