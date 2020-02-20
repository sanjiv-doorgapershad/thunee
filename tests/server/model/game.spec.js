import { Game } from "../../../src/server/model/game";
import { GameHand } from "../../../src/common/model/game-hand.model";
import { Card } from "../../../src/common/model/card.model";
import { Player } from '../../../src/common/model/player.model';

describe('Game Server Model', () => {

   let game;
   let playerDealer;
   let playerTrump;
   let player3;
   let player4;

   beforeEach(() => {
      game = new Game('new test game');

      playerDealer = new Player('t', 'trump-player-1', true);
      playerTrump = new Player('t', 'trump-player-1');
      player3 = new Player('3', 'test-player-3');
      player4 = new Player('4', 'test-player-4');
   });

   it('should create new game object', () => {
      game = new Game('new test game');
      expect(game).toBeDefined();
   });

   describe('Set Trump', () => {
      it('should set trump J-&clubs;', () => {
         game.addPlayer(playerDealer);
         game.addPlayer(playerTrump);
         playerTrump.isActivePlayer = true;

         const trumpCard = new Card('&clubs;', 'J');

         game.setTrump(playerTrump, trumpCard.id);

         expect(game.trump).toEqual(trumpCard);
      })
   })

   describe('Get Winning Hand', () => {
      describe('when 1 hand is trump', () => {
         it('should have trump hand1 as winner', () => {
            game.addPlayer(playerDealer);
            game.addPlayer(playerTrump);
            game.addPlayer(player3);
            game.addPlayer(player4);
   
            playerTrump.isActivePlayer = true;
   
            game.setTrump(playerTrump, new Card('&hearts;', 'A').id);
   
            const card1 = new Card('&hearts;', 'K');
            const hand1 = new GameHand(card1, player3);
   
            const card2 = new Card('&spades;', 'A');
            const hand2 = new GameHand(card2, player4);
   
            const winningHand = game.getWinningHand(hand1, hand2, '&diams;');
   
            expect(winningHand).toEqual(hand1);
         });

         it('should have trump hand2 as winner', () => {
            game.addPlayer(playerDealer);
            game.addPlayer(playerTrump);
            game.addPlayer(player3);
            game.addPlayer(player4);
   
            playerTrump.isActivePlayer = true;
   
            game.setTrump(playerTrump, new Card('&hearts;', 'A').id);
   
            const card1 = new Card('&spades;', 'A');
            const hand1 = new GameHand(card1, player3);
   
            const card2 = new Card('&hearts;', 'K');
            const hand2 = new GameHand(card2, player4);
   
            const winningHand = game.getWinningHand(hand1, hand2, '&diams;');
   
            expect(winningHand).toEqual(hand2);
         });
      });

      describe('when both hands are trump', () => {
         it('should have hand1 as winner', () => {
            game.addPlayer(playerDealer);
            game.addPlayer(playerTrump);
            game.addPlayer(player3);
            game.addPlayer(player4);
   
            playerTrump.isActivePlayer = true;
   
            game.setTrump(playerTrump, new Card('&hearts;', 'A').id);
   
            const card1 = new Card('&hearts;', 'J');
            const hand1 = new GameHand(card1, player3);
   
            const card2 = new Card('&hearts;', 'A');
            const hand2 = new GameHand(card2, player4);
   
            const winningHand = game.getWinningHand(hand1, hand2, '&diams;');
   
            expect(winningHand).toEqual(hand1);
         });

         it('should have hand2 as winner', () => {
            game.addPlayer(playerDealer);
            game.addPlayer(playerTrump);
            game.addPlayer(player3);
            game.addPlayer(player4);
   
            playerTrump.isActivePlayer = true;
   
            game.setTrump(playerTrump, new Card('&hearts;', 'A').id);
   
            const card1 = new Card('&hearts;', 'Q');
            const hand1 = new GameHand(card1, player3);
   
            const card2 = new Card('&hearts;', 'A');
            const hand2 = new GameHand(card2, player4);
   
            const winningHand = game.getWinningHand(hand1, hand2, '&diams;');
   
            expect(winningHand).toEqual(hand2);
         });
      })

      describe('when both hands are following suit', () => {
         it('should have hand1 as winner', () => {
            game.addPlayer(playerDealer);
            game.addPlayer(playerTrump);
            game.addPlayer(player3);
            game.addPlayer(player4);
   
            playerTrump.isActivePlayer = true;
   
            game.setTrump(playerTrump, new Card('&hearts;', 'A').id);
   
            const card1 = new Card('&diams;', 'J');
            const hand1 = new GameHand(card1, player3);
   
            const card2 = new Card('&diams;', 'A');
            const hand2 = new GameHand(card2, player4);
   
            const winningHand = game.getWinningHand(hand1, hand2, '&diams;');
   
            expect(winningHand).toEqual(hand1);
         });

         it('should have hand2 as winner', () => {
            game.addPlayer(playerDealer);
            game.addPlayer(playerTrump);
            game.addPlayer(player3);
            game.addPlayer(player4);
   
            playerTrump.isActivePlayer = true;
   
            game.setTrump(playerTrump, new Card('&hearts;', 'A').id);
   
            const card1 = new Card('&diams;', 'Q');
            const hand1 = new GameHand(card1, player3);
   
            const card2 = new Card('&diams;', 'A');
            const hand2 = new GameHand(card2, player4);
   
            const winningHand = game.getWinningHand(hand1, hand2, '&diams;');
   
            expect(winningHand).toEqual(hand2);
         });
      })
      
      describe('when both hands are not following suit', () => {
         it('should have hand1 as winner', () => {
            game.addPlayer(playerDealer);
            game.addPlayer(playerTrump);
            game.addPlayer(player3);
            game.addPlayer(player4);
   
            playerTrump.isActivePlayer = true;
   
            game.setTrump(playerTrump, new Card('&hearts;', 'A').id);
   
            const card1 = new Card('&spades;', 'J');
            const hand1 = new GameHand(card1, player3);
   
            const card2 = new Card('&spades;', 'A');
            const hand2 = new GameHand(card2, player4);
   
            const winningHand = game.getWinningHand(hand1, hand2, '&diams;');
   
            expect(winningHand).toEqual(hand1);
         });

         it('should have hand2 as winner', () => {
            game.addPlayer(playerDealer);
            game.addPlayer(playerTrump);
            game.addPlayer(player3);
            game.addPlayer(player4);
   
            playerTrump.isActivePlayer = true;
   
            game.setTrump(playerTrump, new Card('&hearts;', 'A').id);
   
            const card1 = new Card('&spades;', 'Q');
            const hand1 = new GameHand(card1, player3);
   
            const card2 = new Card('&spades;', 'A');
            const hand2 = new GameHand(card2, player4);
   
            const winningHand = game.getWinningHand(hand1, hand2, '&diams;');
   
            expect(winningHand).toEqual(hand2);
         });
      })

      describe('when 1 hand is following suit', () => {
         it('should have hand1 as winner', () => {
            game.addPlayer(playerDealer);
            game.addPlayer(playerTrump);
            game.addPlayer(player3);
            game.addPlayer(player4);
   
            playerTrump.isActivePlayer = true;
   
            game.setTrump(playerTrump, new Card('&hearts;', 'A').id);
   
            const card1 = new Card('&diams;', 'K');
            const hand1 = new GameHand(card1, player3);
   
            const card2 = new Card('&spades;', 'A');
            const hand2 = new GameHand(card2, player4);
   
            const winningHand = game.getWinningHand(hand1, hand2, '&diams;');
   
            expect(winningHand).toEqual(hand1);
         });

         it('should have hand2 as winner', () => {
            game.addPlayer(playerDealer);
            game.addPlayer(playerTrump);
            game.addPlayer(player3);
            game.addPlayer(player4);
   
            playerTrump.isActivePlayer = true;
   
            game.setTrump(playerTrump, new Card('&hearts;', 'A').id);
   
            const card1 = new Card('&spades;', 'J');
            const hand1 = new GameHand(card1, player3);
   
            const card2 = new Card('&diams;', 'A');
            const hand2 = new GameHand(card2, player4);
   
            const winningHand = game.getWinningHand(hand1, hand2, '&diams;');
   
            expect(winningHand).toEqual(hand2);
         });
      })
   })
});