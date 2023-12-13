import { MapObject } from './types/MapObject.ts';
import { WinConditionObject } from './types/WinConditionObject.ts';

export class MapObjectsCreator {
  private input: string[];

  constructor(input: string[]) {
    this.input = input;
  }

  create() {
    const times: number[] = [];
    const distances: number[] = [];

    this.input.forEach((line) => {
      if (line.startsWith('Time:')) {
        let [, timesStr] = line.split(':');
        timesStr = timesStr.trim();

        timesStr
          .split(' ')
          .filter((str) => str !== '')
          .forEach((time) => {
            times.push(parseInt(time, 10));
          });
      } else if (line.startsWith('Distance:')) {
        let [, distancesStr] = line.split(':');
        distancesStr = distancesStr.trim();

        distancesStr
          .split(' ')
          .filter((str) => str !== '')
          .forEach((distance) => {
            distances.push(parseInt(distance, 10));
          });
      }
    });

    return this.createMapObjects(times, distances);
  }

  createWithOneRace() {
    const regex = new RegExp(' ', 'g');

    const times: number[] = [];
    const distances: number[] = [];

    this.input.forEach((line) => {
      if (line.startsWith('Time:')) {
        let [, timesStr] = line.split(':');
        timesStr = timesStr.replace(regex, '');
        times.push(parseInt(timesStr, 10));
      } else if (line.startsWith('Distance:')) {
        let [, distancesStr] = line.split(':');
        distancesStr = distancesStr.replace(regex, '');
        distances.push(parseInt(distancesStr, 10));
      }
    });

    return this.createMapObjects(times, distances);
  }

  private createMapObjects(times: number[], distances: number[]) {
    const mapObjects: MapObject[] = [];

    console.log('Times:', times);
    console.log('Distances:', distances);

    for (let i = 0; i < times.length; i++) {
      const time = times[i];
      const distance = distances[i];

      const winConditions = this.findWinConditions(time, distance);

      const mapObject: MapObject = { time, distance, winConditions };

      mapObjects.push(mapObject);
    }

    return mapObjects;
  }

  private findWinConditions(time: number, distance: number) {
    const winConditions: WinConditionObject[] = [];

    for (let holdTime = 1; holdTime < time; holdTime++) {
      const timeLeft = time - holdTime;
      const travelDistance = holdTime * timeLeft;

      if (travelDistance > distance) {
        const winCondition: WinConditionObject = {
          holdTime,
          travelDistance,
        };

        winConditions.push(winCondition);
      }
    }

    return winConditions;
  }
}
