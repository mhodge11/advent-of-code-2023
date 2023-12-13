import { MapObject } from '../types/MapObject.ts';

export class LocationFinder {
  private seedArray: number[] | undefined;
  private mapObjects: MapObject[];
  private counter: number;
  private locationArray: number[];

  constructor(seedArray: number[] | undefined, mapObjects: MapObject[]) {
    this.seedArray = seedArray;
    this.mapObjects = mapObjects;
    this.counter = 0;
    this.locationArray = [];
  }

  findClosestLocation(): number {
    if (this.seedArray != undefined) {
      for (let seed of this.seedArray) {
        const nextNumber = this.goThroughMapObject(seed);

        if (nextNumber >= 0) {
          this.locationArray.push(nextNumber);
        }
      }
    }
    
    return Math.min(...this.locationArray);
  }

  goThroughMapObject(number: number | undefined): any {
    if (number == undefined) {
      return;
    }

    let returnValue = -1;

    for (let range of this.mapObjects[this.counter].ranges) {
      if (number >= range.source && number <= range.source + range.range) {
        returnValue = number + range.destination - range.source;
        break;
      }
    }

    this.counter++;

    if (this.counter < this.mapObjects.length) {
      return returnValue >= 0
        ? this.goThroughMapObject(returnValue)
        : this.goThroughMapObject(number);
    } else {
      this.counter = 0;
      return returnValue >= 0 ? returnValue : number;
    }
  }
}
