import { readData } from '../../shared.ts';
import chalk from 'chalk';
import { InputConverter } from './lib/InputConverter.ts';
import { MapObjectsCreator } from './lib/MapObjectsCreator.ts';
import { NumberOfWaysToWinFinder } from './lib/NumberOfWaysToWinFinder.ts';

export async function day6a(dataPath?: string) {
  const data = await readData(dataPath);

  const input = new InputConverter(data).convert();
  const mapObjects = new MapObjectsCreator(input).create();

  return new NumberOfWaysToWinFinder(mapObjects).find();
}

const answer = await day6a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
