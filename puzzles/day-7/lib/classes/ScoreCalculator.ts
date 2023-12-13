import { HandObject } from '../types/HandObject.ts';

export class ScoreCalculator {
  private handObjects: HandObject[];

  constructor(handObjects: HandObject[]) {
    this.handObjects = handObjects;
  }

  calculate() {
    return this.handObjects.reduce((acc, handObject, index) => {
      const bid = handObject.bid;
      const multiplier = index + 1;
      const score = bid * multiplier;

      return acc + score;
    }, 0);
  }
}
