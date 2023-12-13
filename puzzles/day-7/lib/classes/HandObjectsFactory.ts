import { HandObject } from '../types/HandObject.ts';
import { jokerCardStrengthOrder } from '../constants/jokerCardStrengthOrder.ts';

export class HandObjectsFactory {
  private handObjects: HandObject[];
  private highCardObjects: HandObject[] = [];
  private onePairObjects: HandObject[] = [];
  private twoPairObjects: HandObject[] = [];
  private threeOfAKindObjects: HandObject[] = [];
  private fullHouseObjects: HandObject[] = [];
  private fourOfAKindObjects: HandObject[] = [];
  private fiveOfAKindObjects: HandObject[] = [];

  constructor(handObjects: HandObject[]) {
    this.handObjects = handObjects;
  }

  sort() {
    this.sortHandsByKind();
    this.locallySortHands();

    return [
      ...this.highCardObjects,
      ...this.onePairObjects,
      ...this.twoPairObjects,
      ...this.threeOfAKindObjects,
      ...this.fullHouseObjects,
      ...this.fourOfAKindObjects,
      ...this.fiveOfAKindObjects,
    ];
  }

  private sortHandsByKind() {
    for (const handObject of this.handObjects) {
      const uniqueLetters: Record<string, number> = {};

      for (const letter of handObject.hand) {
        uniqueLetters[letter] = uniqueLetters[letter]
          ? uniqueLetters[letter] + 1
          : 1;
      }

      switch (Object.keys(uniqueLetters).length) {
        case 1:
          this.fiveOfAKindObjects.push(handObject);
          break;
        case 2:
          if (Object.values(uniqueLetters).includes(2)) {
            this.fullHouseObjects.push(handObject);
          } else {
            this.fourOfAKindObjects.push(handObject);
          }
          break;
        case 3:
          if (Object.values(uniqueLetters).includes(3)) {
            this.threeOfAKindObjects.push(handObject);
          } else {
            this.twoPairObjects.push(handObject);
          }
          break;
        case 4:
          this.onePairObjects.push(handObject);
          break;
        default:
          this.highCardObjects.push(handObject);
          break;
      }
    }
  }

  private locallySortHands() {
    this.sortByHighestCard(this.highCardObjects);
    this.sortByHighestCard(this.onePairObjects);
    this.sortByHighestCard(this.twoPairObjects);
    this.sortByHighestCard(this.threeOfAKindObjects);
    this.sortByHighestCard(this.fullHouseObjects);
    this.sortByHighestCard(this.fourOfAKindObjects);
    this.sortByHighestCard(this.fiveOfAKindObjects);
  }

  private sortByHighestCard(handObjects: HandObject[]) {
    function compare(a: HandObject, b: HandObject, index = 0) {
      const aStrength = jokerCardStrengthOrder.indexOf(a.hand[index]);
      const bStrength = jokerCardStrengthOrder.indexOf(b.hand[index]);

      if (aStrength < bStrength) {
        return -1;
      } else if (aStrength > bStrength) {
        return 1;
      } else if (index === a.hand.length - 1) {
        return 0;
      } else {
        return compare(a, b, index + 1);
      }
    }

    handObjects.sort(compare);
  }
}
