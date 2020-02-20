import { Message } from './messages/message';
import { Game } from './model/game';
import { GameController } from './controllers/game-controller';
import { Player } from '../common/model/player.model';
import { GameConstants } from '../common/game-constants';

export class GameServer {
   constructor(socketServer) {
      this.gameController = new GameController();
      
      this.socketServer = socketServer;

      this.socketServer.on('connection', (socket) => {
         console.log('user connected: ', socket.id);

         socket.on('message', (message, response) => {
            console.log(message.name);

            switch (message.name) {
               case 'newgame': 
                  this.createNewGame(socket, message.data, response);
                  break;
               case 'joingame': 
                  this.joinExistingGame(socket, message.data, response);
                  this.gameStatusChanged(socket, message.data.room)
                  break;
               case 'shufflecards': 
                  this.gameController.getGame(message.data.room)
                     .cardController.shuffle();
                  response(new Message('cardsshuffled'));
                  break;
               case 'dealcards': 
                  this.dealCards(socket, message.data, response);
                  this.gameStatusChanged(socket, message.data.room)
                  break;
               case 'settrump': 
                  if (this.setTrump(socket, message.data, response)) {
                     this.gameStatusChanged(socket, message.data.room)
                  }
                  break;
               case 'playcard': 
                  if (this.playCard(socket, message.data, response)) {
                     this.gameStatusChanged(socket, message.data.room)
                  }
                  break;
               case 'takewinner': 
                  this.takeWinner(socket, message.data, response);
                  this.gameStatusChanged(socket, message.data.room);
                  break;
            }
         });

         socket.on('disconnect', () => {
            console.log('user disconnected: ', socket.id);
            this.gameController.removePlayer(socket.id);
         })
      });
   }

   createNewGame(socket, data, response) {
      if (this.gameController.addGame(new Game(data.room))) {
         console.clear();
         console.log('NEW GAME######################');

         socket.join(data.room);
         console.log(`${socket.id}: created game ${data.room}`);
         response(new Message('newgamecreated'));
      } else {
         console.log('Cant create new game');
         response(new Message('newgamefailed'));
      }
   }

   joinExistingGame(socket, data, response) {
      if (this.gameController.gameExists(data.room)) {
         console.log(`${socket.id} joining game ${data.room}`);

         const player = new Player(socket.id, data.player.name, data.player.isDealer, data.player.isKeepingTrump);
         const game = this.gameController.getGame(data.room);
         game.addPlayer(player);

         socket.join(data.room);
         console.log(`Existing users in game ${data.room}: `, this.socketServer.sockets.adapter.rooms[data.room].length);

         response(new Message('gamejoined', { name: data.room, myPlayer: player, allPlayers: game.getAllPlayers() }));
         socket.broadcast.to(data.room).emit('anotherjoinedgame', new Message('gamejoined', player));

         if (game.players.size === GameConstants.maxPlayers) {
            game.state = GameConstants.states.start;
         }
         
      } else {
         console.log(`Game does not exist ${data.room}`);
         response(new Message('gamejoinedfailed'));
      }
   }

   dealCards(socket, data, response) {

      const game = this.gameController.getGame(data.room);

      const cardSets = game.cardController.dealCards(data.cardCount, game.getAllPlayers());

      cardSets.forEach(element => {
         if (element.player) {
            this.socketServer.sockets.to(element.player.id).emit('newcards', new Message('newcards', element.cards));
         }
      });

      if (data.cardCount === 4) {
         game.state = GameConstants.states.deal4Cards;
         const activePlayer = game.getNextPlayer(game.getActivePlayer());
         game.setActivePlayer(activePlayer);
      } else {
         game.state = GameConstants.states.deal2Cards;
         const activePlayer = game.getNextPlayer(game.getNextPlayer(game.getActivePlayer()));
         game.setActivePlayer(activePlayer);
      }
   }

   setTrump(socket, data, response) {
      const game = this.gameController.getGame(data.room);
      
      if (game.setTrump(data.player, data.cardId)) {
         response(new Message('trumpset'));
         return true;
      } else {
         response(new Message('settrumpfailed'));
         return false;
      }
   }

   gameStatusChanged(socket, room) {
      console.log(`${room} status changed.`)
      const game = this.gameController.getGame(room);
      this.socketServer.to(room).emit('gamestatuschanged', new Message('gamestatuschanged', game.getStatus()));
   }

   playCard(socket, data, response) {
      const game = this.gameController.getGame(data.room);
      
      if (game.playCard(data.player, data.card)) {
         response(new Message('cardplayed'));
         return true;
      } else {
         response(new Message('playcardfailed'));
         return false;
      }
   }

   takeWinner(socket, data, response) {
      const game = this.gameController.getGame(data.room);
      game.takeWinner();
      response(new Message('winnerCompleted'));
   }
}