import { readData } from '../../shared.ts';
import chalk from 'chalk';
import { InputConverter } from './lib/classes/InputConverter.ts';
import { LocationFinder } from './lib/classes/LocationFinder.ts';
import { MapObjectsCreator } from './lib/classes/MapObjectsCreator.ts';
import { SeedArrayCreator } from './lib/classes/SeedArrayCreator.ts';

export async function day5a(dataPath?: string) {
  const data = await readData(dataPath);

  const input = new InputConverter(data).convertArray();
  const seedArray = new SeedArrayCreator(input).createSeedsArray();
  const mapObjects = new MapObjectsCreator(input).createMapObjects();

  return new LocationFinder(seedArray, mapObjects).findClosestLocation();

  // const seedString = data.shift();
  // const [, seeds] = seedString.split(': ');

  // const seedMatrix: number[][] = seeds
  //   .split(' ')
  //   .map((seed) => [parseInt(seed, 10)]);

  // data.shift();

  // let currentMatrixIndex = 1;

  // data.forEach((item) => {
  //   item = item.trim();

  //   if (item === '') {
  //     for (let i = 0; i < seedMatrix.length; i++) {
  //       if (seedMatrix[i].length === currentMatrixIndex) {
  //         seedMatrix[i].push(seedMatrix[i][currentMatrixIndex - 1]);
  //       }
  //     }

  //     currentMatrixIndex++;
  //   } else if (!isNaN(parseInt(item[0], 10))) {
  //     const [destRangeStart, srcRangeStart, range] = item
  //       .split(' ')
  //       .map((num) => parseInt(num.trim(), 10));
  //     const srcRangeEnd = srcRangeStart + range;

  //     for (let i = 0; i < seedMatrix.length; i++) {
  //       if (seedMatrix[i].length === currentMatrixIndex) {
  //         const previousValue = seedMatrix[i][currentMatrixIndex - 1];

  //         if (previousValue >= srcRangeStart && previousValue <= srcRangeEnd) {
  //           const difference = previousValue - srcRangeStart;
  //           seedMatrix[i].push(destRangeStart + difference);
  //         }
  //       }
  //     }
  //   }
  // });

  // return seedMatrix.reduce((acc, curr) => {
  //   const lastValue = curr[curr.length - 1];
  //   return lastValue < acc ? lastValue : acc;
  // }, Infinity)
}

const answer = await day5a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
