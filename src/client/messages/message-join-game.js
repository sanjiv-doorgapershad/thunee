import { Message } from "./message.js";

export class JoinGameMessage extends Message {
   constructor() {
      super('joingame');
   }
}