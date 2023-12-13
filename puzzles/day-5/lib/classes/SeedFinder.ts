import { MapObject } from '../types/MapObject.ts';

export class SeedFinder {
  private seedRanges: number[][] | undefined;
  private mapObjects: MapObject[];
  private maxSeed: number;
  private counter: number;
  private smallestSeed: number;

  constructor(seedRanges: number[][] | undefined, mapObjects: MapObject[]) {
    this.seedRanges = seedRanges;
    this.mapObjects = mapObjects;
    this.maxSeed = 0;
    this.counter = 6;
    this.smallestSeed = 0;
  }

  findClosestSeed(): number {
    const startTime = Date.now(); // Record the start time

    this.setMaxSeed();

    console.log(`maxSeed: ${this.maxSeed}`);
    console.log(`seedRanges: ${this.seedRanges}`);

    for (let i = 0; i < this.maxSeed; i++) {
      if (i % 100000 == 0) console.log('Checking next location range from', i);

      this.counter = 6;

      const checkThis = this.goThroughMapObject(i);
      const isSeedInRange = this.checkIfSeedInRage(checkThis);

      if (isSeedInRange) {
        this.smallestSeed = i;
        break;
      }
    }

    const endTime = Date.now(); // Record the end time

    console.log(`Took ${endTime - startTime}ms to find the seed`);
    
    return this.smallestSeed;
  }

  private setMaxSeed() {
    if (this.seedRanges != undefined) {
      for (let range of this.seedRanges) {
        if (range[1] > this.maxSeed) {
          this.maxSeed = range[1];
        }
      }
    }
  }

  private checkIfSeedInRage(seed: number) {
    if (this.seedRanges != undefined) {
      for (let range of this.seedRanges) {
        if (seed >= range[0] && seed <= range[1]) {
          return true;
        }
      }
    }

    return false;
  }

  private goThroughMapObject(number: number): any {
    let returnValue = -1;

    for (let range of this.mapObjects[this.counter].ranges) {
      if (
        number >= range.destination &&
        number <= range.destination + range.range
      ) {
        returnValue = number + range.source - range.destination;
        break;
      }
    }

    this.counter--;

    if (this.counter >= 0) {
      return returnValue >= 0
        ? this.goThroughMapObject(returnValue)
        : this.goThroughMapObject(number);
    } else {
      this.counter < 0;
      return returnValue >= 0 ? returnValue : number;
    }
  }
}
