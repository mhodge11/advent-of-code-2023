import { HandObject } from '../types/HandObject.ts';

export class HandObjectsCreator {
  private input: string[];

  constructor(input: string[]) {
    this.input = input;
  }

  create() {
    const handObjects: HandObject[] = [];

    for (const line of this.input) {
      const [hand, bidStr] = line.trim().split(' ');
      const bid = parseInt(bidStr, 10);

      handObjects.push({ hand, bid });
    }

    return handObjects;
  }
}
