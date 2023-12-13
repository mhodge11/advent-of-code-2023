import { MapObject } from './types/MapObject.ts';

export class NumberOfWaysToWinFinder {
  private mapObjects: MapObject[];

  constructor(mapObjects: MapObject[]) {
    this.mapObjects = mapObjects;
  }

  find() {
    const startTime = Date.now(); // Record the start time

    const result = this.goThroughMapObject();

    const endTime = Date.now(); // Record the end time

    console.log(
      `Took ${endTime - startTime}ms to find the number of ways to win`
    );

    return result;
  }

  private goThroughMapObject() {
    let returnValue = 0;

    for (const { winConditions } of this.mapObjects) {
      const numberOfWinConditions = winConditions.length;

      if (returnValue === 0) {
        returnValue = numberOfWinConditions;
      } else {
        returnValue *= numberOfWinConditions;
      }
    }

    return returnValue;
  }
}
