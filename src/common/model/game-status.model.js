export class GameStatus {

   constructor(state, players, playedGameHands, winner) {
      this.state = state
      this.players = players;
      this.playedGameHands = playedGameHands;
      this.winner = winner;
   }
}