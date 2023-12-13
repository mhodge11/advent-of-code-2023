import { MapObject } from '../types/MapObject.ts';
import { RangeObject } from '../types/RangeObject.ts';

export class ObjectFactory {
  private array: string[];

  constructor(array: string[]) {
    this.array = array;
  }

  createObject(): MapObject {
    const object: MapObject = {
      name: this.array[0],
      ranges: [],
    };

    for (let i = 1; i < this.array.length; i++) {
      const splitted = this.array[i].split(' ');
      const range: RangeObject = {
        source: parseInt(splitted[1], 10),
        destination: parseInt(splitted[0], 10),
        range: parseInt(splitted[2], 10),
      };

      object.ranges.push(range);
    }

    return object;
  }
}
