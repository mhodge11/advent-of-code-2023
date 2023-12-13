import { readData } from '../../shared.ts';
import chalk from 'chalk';
import { InputConverter } from './lib/InputConverter.ts';
import { MapObjectsCreator } from './lib/MapObjectsCreator.ts';
import { NumberOfWaysToWinFinder } from './lib/NumberOfWaysToWinFinder.ts';

export async function day6b(dataPath?: string) {
  const data = await readData(dataPath);

  const input = new InputConverter(data).convert();
  const mapObjects = new MapObjectsCreator(input).createWithOneRace();

  return new NumberOfWaysToWinFinder(mapObjects).find();
}

const answer = await day6b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
