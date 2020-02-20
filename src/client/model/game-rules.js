export class GameRules {
   constructor(game) {
      if(game === undefined) {
         throw('GameRules : game undefined')
      }

      this.game = game;
   }

   canShuffle(player) {

      if(player === undefined) {
         throw('GameRules > canShuffle: player undefined')
      }

      if (player.isDealer && this.game.state === this.game.states.start) {
         return true;
      }

      console.log('Game Rule Broken: shuffle');
      return false;
   }

   canDealCards(count, player) {
      if(player === undefined) {
         throw('GameRules > canDealCards: player undefined')
      }

      if (player.isDealer && count === 4 && this.game.state === this.game.states.start) {
         return true;
      } else if (player.isDealer && count === 2 && this.game.state === this.game.states.selectTrump) {
         return true;
      }

      console.log('Game Rule Broken: deal cards');
      return false;
   }

   canSelectTrump(player) {
      if(player === undefined) {
         throw('GameRules > canSelectTrump: player undefined')
      }

      if (player.isKeepingTrump) {
         if (this.game.state === this.game.states.deal4Cards) {
            return true;
         } else {
            console.log('Game Rule Broken: select trump : game state not ', this.game.states.deal4Cards);
         }
      } else {
         console.log('Game Rule Broken: select trump : player not keeping trump');
      }

      return false;
   }

   canPlayCard(player) {
      if(player === undefined) {
         throw('GameRules > canPlayCard: player undefined')
      }

      if (player.isActivePlayer) {
         if(this.game.state === this.game.states.deal2Cards || this.game.state === this.game.states.playCard) {
            return true;
         } else {
            console.log('Game Rule Broken: play card: incorrect game state', this.game.state);
         }
      } else {
         console.log('Game Rule Broken: play card: player not active');
      }

      return false;
   }
}