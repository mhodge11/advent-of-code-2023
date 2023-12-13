import { type InstructionsObject } from '../types/InstructionsObject.ts';
import { type MapObject } from '../types/MapObject.ts';

export class StepsCalculator {
  private instructionsObject: InstructionsObject;
  private mapObject: MapObject;
  private accumulator: number = 0;

  constructor(instructionsObject: InstructionsObject, mapObject: MapObject) {
    this.instructionsObject = instructionsObject;
    this.mapObject = mapObject;
  }

  calculate() {
    let key = 'AAA';

    while (true) {
      key = this.run(key);

      if (key === 'ZZZ') {
        break;
      }
    }

    return this.accumulator;
  }

  private run(lastCheckedKey: string) {
    let key = lastCheckedKey;
    let counter = this.instructionsObject.length;

    for (let i = 0; i < this.instructionsObject.length; i++) {
      const step = this.instructionsObject.steps[i];

      key = this.mapObject[key][step];

      if (key === 'ZZZ') {
        counter = i + 1;
        break;
      }
    }

    this.accumulator += counter;

    return key;
  }
}
