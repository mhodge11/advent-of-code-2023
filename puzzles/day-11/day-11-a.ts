import { readData } from '../../shared.ts';
import chalk from 'chalk';
import { InputConverter } from './lib/InputConverter.ts';
import { ObjectFactory } from './lib/ObjectFactory.ts';
import { ShortestDistancesCalculator } from './lib/ShortestDistancesCalculator.ts';

export async function day11a(dataPath?: string) {
  const data = await readData(dataPath);

  const input = new InputConverter(data).convert();
  const map = new ObjectFactory(input).create();

  return new ShortestDistancesCalculator(map, 2).calculate();
}

const answer = await day11a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
