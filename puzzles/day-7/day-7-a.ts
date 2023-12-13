import { readData } from '../../shared.ts';
import chalk from 'chalk';
import { HandObjectsCreator } from './lib/classes/HandObjectsCreator.ts';
import { HandObjectsFactory } from './lib/classes/HandObjectsFactory.ts';
import { InputConverter } from './lib/classes/InputConverter.ts';
import { ScoreCalculator } from './lib/classes/ScoreCalculator.ts';

export async function day7a(dataPath?: string) {
  const data = await readData(dataPath);

  const input = new InputConverter(data).convert();
  const handObjects = new HandObjectsCreator(input).create();
  const sortedHandObjects = new HandObjectsFactory(handObjects).sort();

  return new ScoreCalculator(sortedHandObjects).calculate();
}

const answer = await day7a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
