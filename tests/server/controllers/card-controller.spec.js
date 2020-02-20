import { CardController } from '../../../src/server/controllers/card-controller';
import { CardUtil } from '../../../src/common/card-util';
import { Player } from '../../../src/common/model/player.model';

describe('CardController Server', () => {

   describe('constructor', () => {

      it('should create 24 cards', () => {
         const cardController = new CardController();
         expect(cardController.allCards.length).toEqual(24);
      });

      it('should invoke newCards', () => {
         const newCardsSpy = spyOn(CardController.prototype, 'newCards');

         const cardController = new CardController();
         expect(newCardsSpy).toHaveBeenCalled();
      });

      it('should invoke shuffle', () => {
         const shuffleSpy = spyOn(CardController.prototype, 'shuffle');

         const cardController = new CardController();
         expect(shuffleSpy).toHaveBeenCalled();
      });
   });

   describe('newCards', () => {
      it('should reset available cards to 24 cards', () => {
         const cardController = new CardController();
         cardController.availableCards.length = 0;

         expect(cardController.availableCards.length).toEqual(0);

         cardController.newCards();

         expect(cardController.availableCards.length).toEqual(24);
      });
   });

   describe('shuffle', () => {
      it('should invoke CardUtil SHufffle', () => {

         const shuffleSpy = spyOn(CardUtil, 'shuffle');
         const cardController = new CardController();

         cardController.shuffle();

         expect(shuffleSpy).toHaveBeenCalled();
      });
   });

   describe('dealCards', () => {
      it('should deal 5 cards to each player', () => {

         const cardController = new CardController();

         const players = [];
         players.push(new Player('1', 'player-1'));
         players.push(new Player('2', 'player-2'));

         const response = cardController.dealCards(5, players);

         expect(response.length).toBe(2);
         expect(response[0].cards.length).toBe(5);
         expect(response[1].cards.length).toBe(5);
      });

      it('should invoke removeCard 5 times', () => {

         const cardController = new CardController();

         const removeCardSpy = spyOn(cardController, 'removeCard');

         const response = cardController.dealCards(5, [new Player('1', 'player-1')]);

         expect(removeCardSpy).toHaveBeenCalledTimes(5);
      });
   });

   describe('createCard', () => {
      it('should get 1 card', () => {

         const cardController = new CardController();

         const response = cardController.createCard('J-&clubs;');

         expect(response.id).toEqual('J-&clubs;');
         expect(response.rank).toEqual('J');
         expect(response.suit).toEqual('&clubs;');

      });
   });

});
