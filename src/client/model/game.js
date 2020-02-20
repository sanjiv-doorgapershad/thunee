import { GameConstants } from "../../common/game-constants.js";
import { GameRules } from "./game-rules.js";
import { GameRound } from "./game-round.js";
import { PlayerComponent } from "../components/player/player.component.js";
import { GameService } from "../services/game.service.js";
import { Player } from "../../common/model/player.model.js";

export class Game {

   constructor() {

      this.gameService = new GameService();
      this.gameService.gameStatusUpdate(this.updateStatus.bind(this));
      
      this.states = GameConstants.states;

      this.cleanup();

      this.isDealer = true;

      this.setState(this.states.start);

      this.players = [];
      this.playerUI = [];

      this.gameRules = new GameRules(this);

      this.gameRound = new GameRound(this, this.gameRules);
   }

   newGame() {
      this.myPlayer = new Player('', '', true, false);

      this.gameService.createNewGame().then((response) => {
         if (response.name === 'newgamecreated') {
            console.log('You created a new game');;
         }
      });
   }

   joinGame() {
      if(!this.myPlayer) {
         this.myPlayer = new Player();
      }
      
      if (!this.playerExists(this.myPlayer)) {
         this.gameService.joinExistingGame(this.myPlayer).then((response) => {
            if (response.name === 'gamejoined') {
               this.myPlayer = response.data.myPlayer;
               this.name = response.data.name;
               document.title = `Thunee (${this.myPlayer.name})`;
               this.gameRound.myPlayer = this.myPlayer;

               console.log('You joined game: ', this.name);
            }
         });
      } else {
         document.title = `Thunee (${this.myPlayer.name})`;
      }
   }

   playerExists(player) {
      let exists = false;

      const found = this.players.find((item) => {
         return item.player.name === player.name
      });

      if (found) {
         exists = true;
      }

      return exists;
   }

   addPlayer(player) {

      player.isMyPlayer =  (player.id === this.myPlayer.id);

      let playerComponent = new PlayerComponent(player, this.gameRound);

      if (player.isMyPlayer && this.myPlayer.cards) {
         playerComponent.takeCards(this.myPlayer.cards);
         this.gameRound.myPlayerComponent = playerComponent;
      }

      if (player.isDealer) {
         playerComponent.takeDeck(this.deck);
      }
      
      this.players.push(playerComponent);
      this.playerUI.push(playerComponent.playerUI);

      return playerComponent;
   }

   buildPlayers() {
      const playerContainer = document.getElementsByClassName('player-container');

      while(playerContainer.length > 0) {
         playerContainer[0].parentNode.removeChild(playerContainer[0]);
      }

      this.playerUI.forEach((ui) => {
         ui.buildPlayer();
      })
   }

   cleanup() {
      this.game_div = document.getElementById('game');
      this.game_div.innerHTML = "";
   }

   setState(state) {
      console.log('New state: ', state);
      this.state = state;
   }

   updateStatus(gameStatus) {
      this.setState(gameStatus.state);
      // this.gameRound.playedCards = gameStatus.playedCards;

      let playedGameHand = gameStatus.playedGameHands.find((hand) => {
         return hand.player.id === this.myPlayer.id;
      });

      //backup myplayer
      this.players.forEach((playerComponent) => {
         if (playerComponent.player.id === this.myPlayer.id) {
            this.myPlayer.cards = [];

            playerComponent.cardComponents.forEach(cardComponent => {
               if (!playedGameHand || playedGameHand.card.id !== cardComponent.card.id) {
                  this.myPlayer.cards.push(cardComponent.card);
               }
            });
         }
      });

      //add players
      gameStatus.players.forEach((player) => {
         if (player) {
            let playerComponent = this.addPlayer(player);

            if (gameStatus.winner && gameStatus.winner.player.id === player.id) {
               playerComponent.setWinner(gameStatus.playedGameHands);
            }
         }
      });

      //update pot
      this.gameRound.pot.update(gameStatus.playedGameHands, gameStatus.winner);
   }
}