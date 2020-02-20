import { NewGameMessage } from '../messages/message-new-game.js';
import { JoinGameMessage } from '../messages/message-join-game.js';
import { ConnectionService } from "./connection.service.js";
import { Message } from "../messages/message.js";

export class GameService {

   constructor() {
      this.socket = ConnectionService.getConnection();
   }
 
   createNewGame(name=1) {
      const newGame = new NewGameMessage();
      newGame.data = {room: name};

      console.log('Creatign new game: ', newGame.data.room);

      return new Promise((resolve) => {
         this.socket.emit('message', newGame, (response) => {
            console.log(response);
            resolve(response);
         });
      });
   }

   joinExistingGame(player, name = 1) {
      const joinGame = new JoinGameMessage();
      joinGame.data = {
         room: name,
         player: player
      };

      console.log('Joining game: ', name);

      return new Promise(resolve => {
         this.socket.emit('message', joinGame, (response) => {
            resolve(response);
         });
      });
   }

   setTrump(player, cardId, gameName) {
      const message = new Message('settrump');
      message.data = { 
         room: gameName,
         player: player,
         cardId: cardId
      };

      return new Promise(resolve => {
         this.socket.emit('message', message, (response) => {
            resolve(response);
         });
      });
   }

   gameStatusUpdate(callback) {
      this.socket.on('gamestatuschanged', (message) => {
         console.log('game status changed: ', message.data);
         if (callback) {
            callback(message.data);
         }
      });
   }

   playCard(player, card, gameName) {
      const message = new Message('playcard');
      message.data = { 
         room: gameName,
         player: player,
         card: card
      };

      return new Promise(resolve => {
         this.socket.emit('message', message, (response) => {
            resolve(response);
         });
      });
   }

   takeWinner(gameName) {
      const message = new Message('takewinner');
      message.data = { 
         room: gameName,
      };

      return new Promise(resolve => {
         this.socket.emit('message', message, (response) => {
            resolve(response);
         });
      });
   }
}