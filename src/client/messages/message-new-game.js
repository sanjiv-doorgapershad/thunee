import { Message } from "./message.js";

export class NewGameMessage extends Message {
   constructor() {
      super('newgame');
   }
}