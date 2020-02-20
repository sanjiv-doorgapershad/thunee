import { ConnectionService } from "./connection.service.js";
import { Message } from "../messages/message.js";


export class DeckService {

   constructor() {
      this.socket = ConnectionService.getConnection();
   }

   shuffle(gameName) {
      this.socket.emit('message', new Message('shufflecards', { room: gameName } ), (response) => {
      });
   }

   deal(gameName, cardCount) {
      this.socket.emit('message', new Message('dealcards', { room: gameName, cardCount: cardCount }));
   }

   newCardsReceived() {
      return new Promise((resolve) => {
         this.socket.on('newcards', (message) => {
            const cards = message.data;
            console.log('newcards recieved: ', cards);
            resolve(cards)
         });
      }) 
   }
}