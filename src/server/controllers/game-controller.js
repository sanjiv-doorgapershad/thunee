export class GameController {

   constructor() {
      this.games = [];
      this.changeGameStatus;
   }

   addGame(game) {
      if (!this.gameExists(game.name)) {
         this.games.push(game);
         return true;
      } else {
         return false;
      }
   }

   removePlayer(id) {
      this.games.forEach((game) => {
         if (game.playerExists(id)) {
            game.removePlayer(id);
         }
      })
   }

   getGame(gameName) {
      const game = this.games.find((item) => {
         return item.name === gameName;
      });
      
      return game;
   }

   gameExists(gameName) {
      const found = this.getGame(gameName);
      return found ? true : false;
   }
}