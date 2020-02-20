export class GameConstants {

   static get maxPlayers() { return 4; }
   static get maxCards() { return 6; }
   
   static get states() { 
      return {
         new: 'new',
         start: 'start',
         deal4Cards: 'deal4Cards',
         selectTrump: 'selectTrump',
         deal2Cards: 'deal2Cards',
         playCard: 'playCard',
         winnner: 'winnner'
      }; 
   }

}