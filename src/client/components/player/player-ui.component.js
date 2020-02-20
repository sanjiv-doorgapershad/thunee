import { GameConstants } from "../../../common/game-constants.js";

export class Player_UI {

   // playerContainer;
   // takeWinnerButton;
   // playerActiveClassName = 'player-active';
   // playerNumberClassName;

   constructor(playerComponent) {
      if (playerComponent === undefined) {
         throw('Player_UI: player is undefined');
      } else {
         this.playerComponent = playerComponent;
         this.game_div = document.getElementById('game');
         this.buildPlayer();

         this.playerComponent.activated = this.playerActivate.bind(this);

      }
   }

   buildPlayer() {
      var parentFrag = document.createDocumentFragment();
      
      var playerContainerClassName = 'player-container';
      this.playerNumberClassName = `${this.playerComponent.player.name}`;

      this.cleanUp();
      
      this.playerContainer = document.createElement('div');
      this.playerContainer.classList.add(playerContainerClassName);
      this.playerContainer.classList.add(this.playerNumberClassName);

      var playerDiv = document.createElement('div');
      playerDiv.className += 'player-name'
      playerDiv.innerHTML = this.playerComponent.player.name;
      this.playerContainer.appendChild(playerDiv)

      parentFrag.appendChild(this.playerContainer);

      if (this.playerComponent.player.isMyPlayer) {
         if (this.playerComponent.player.isDealer) {
            this.buildDealer(this.playerContainer);
         }

         this.playerComponent.cardComponents.forEach(card => {
            this.playerContainer.appendChild(card.cardUI.cardContainer);
         });
         
         if (this.playerComponent.player.isKeepingTrump && this.playerComponent.player.isMyPlayer) {
            this.buildTrump(this.playerContainer);
         }

         this.playerContainer.classList.add('player-me');
      }

      this.buildPoints(this.playerContainer);

      //Winning hand button
      this.buildTakeWinner();

      this.game_div.appendChild(parentFrag);

      this.playerActivate();
   }

   buildTrump(playerContainer) {
      var trumpContainer = document.createElement('div');
      trumpContainer.className += 'trump-container'

      var trumpContainerLabel = document.createElement('div');
      trumpContainerLabel.innerHTML = 'Trump';
      trumpContainer.appendChild(trumpContainerLabel)

      var trumpContainerHolder = document.createElement('div');
      trumpContainerHolder.className += 'holder';

      trumpContainerHolder.ondragover = function(e) {
         e.preventDefault();
      }

      trumpContainer.appendChild(trumpContainerHolder)

      trumpContainerHolder.ondrop = this.cardTrumpDrop.bind(this);

      playerContainer.appendChild(trumpContainer);

      const trumpCard = this.playerComponent.getTrump();

      if (trumpCard) {
         trumpContainerHolder.appendChild(trumpCard.cardUI.cardContainer);
      }
   }

   buildDealer(playerContainer) {
      var shuffle = document.createElement('button');
      shuffle.className += 'player-shuffle'
      shuffle.innerHTML = 'Shuffle';
      shuffle.onclick = this.playerComponent.shuffle.bind(this.playerComponent);
      playerContainer.appendChild(shuffle)

      var deal = document.createElement('button');
      deal.className += 'player-dealer'
      deal.innerHTML = 'Deal';
      deal.onclick = this.deal.bind(this);
      playerContainer.appendChild(deal)
   }

   buildTakeWinner() {
      if (this.playerComponent.player.isMyPlayer) {
         this.takeWinnerCtrl = document.createElement('button');
         this.takeWinnerCtrl.classList.add('player-take-winner');
         this.takeWinnerCtrl.classList.add('hidden');
         this.takeWinnerCtrl.innerHTML = 'Take Hand';
         this.takeWinnerCtrl.onclick = this.takeWinner.bind(this);
         this.playerContainer.appendChild(this.takeWinnerCtrl);
      } else {
         this.takeWinnerCtrl = document.createElement('div');
         this.takeWinnerCtrl.classList.add('player-take-winner');
         this.takeWinnerCtrl.classList.add('hidden');
         this.takeWinnerCtrl.innerHTML = 'WINNER';
         this.playerContainer.appendChild(this.takeWinnerCtrl)
      }
   }

   buildPoints() {
      this.pointsDiv = document.createElement('div');
      this.pointsDiv.className += 'player-points'
      this.pointsDiv.innerHTML = this.playerComponent.player.points;
      this.playerContainer.appendChild(this.pointsDiv)
   }

   deal() {
      this.playerComponent.deal();
   }

   cleanUp() {
      if (this.playerComponent.player.isKeepingTrump) {
         const trumpContainer = document.getElementsByClassName('trump-container');
         for (var count = 0; count < trumpContainer.length; count++) {
            trumpContainer[count].parentNode.removeChild(trumpContainer[count]);
         };
      }

      const playerContainer = document.getElementsByClassName(this.playerComponent.player.name);
      for (var count = 0; count < playerContainer.length; count++) {
         playerContainer[count].remove();
      };
   }

   cardTrumpDrop (e) {
      let evt = e;
      e.preventDefault();
      this.cardTrumpDropCurrentTarget = evt.currentTarget;
      this.cardTrumpDropCardID = e.dataTransfer.getData('text/plain');

      this.playerComponent.selectTrump(this.cardTrumpDropCardID, this.setTrump.bind(this));
   }

   setTrump(response) {
      if (response) {
         var trumpCard = document.getElementById(this.cardTrumpDropCardID);
         this.cardTrumpDropCurrentTarget.appendChild(trumpCard);
      }
   }

   playerActivate() {
      const playerActiveClassName = 'player-active';

      if (this.playerComponent.player.isActivePlayer) {
         this.playerContainer.classList.add(playerActiveClassName);

         this.playerComponent.cardComponents.forEach(card => {
            card.cardUI.setDrag(true);
         });
      } else {
         this.playerContainer.classList.remove(playerActiveClassName);

         this.playerComponent.cardComponents.forEach(card => {
            card.cardUI.setDrag(false);
         });
      }
   }

   setWinner() {
      this.takeWinnerCtrl.classList.remove('hidden');
   }

   takeWinner() {
      this.playerComponent.takeWinner();
      this.takeWinnerCtrl.classList.add('hidden');
   }


}