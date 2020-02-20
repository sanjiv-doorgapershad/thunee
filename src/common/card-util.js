export class CardUtil {
   
   static shuffle(cards, shuffleCounter=1) {

      if(!cards) {
         throw('CardUtil > shuffle : cards are not defined');
      }

      const maxCount = Math.floor(Math.random() * shuffleCounter * 5) + 1;

      for(var counter = 0; counter <= maxCount; counter++) {
         var cardsToShuffle = cards;
         var m = cardsToShuffle.length,
            t,
            i;
   
         while(m) {
            i = Math.floor(Math.random() * m--);
            t = cardsToShuffle[m];
            cardsToShuffle[m] = cardsToShuffle[i];
            cardsToShuffle[i] = t;
         }
   
         cards = cardsToShuffle;
      }
      
      return cards;
   }
}