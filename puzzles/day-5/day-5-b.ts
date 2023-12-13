import { readData } from '../../shared.ts';
import chalk from 'chalk';
import { InputConverter } from './lib/classes/InputConverter.ts';
import { MapObjectsCreator } from './lib/classes/MapObjectsCreator.ts';
import { SeedRangeCreator } from './lib/classes/SeedRangeCreator.ts';
import { SeedFinder } from './lib/classes/SeedFinder.ts';

export async function day5b(dataPath?: string) {
  const data = await readData(dataPath);

  const input = new InputConverter(data).convertArray();
  const seedRanges = new SeedRangeCreator(input).createSeedsArray();
  const mapObjects = new MapObjectsCreator(input).createMapObjects();

  return new SeedFinder(seedRanges, mapObjects).findClosestSeed();
}

const answer = await day5b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
