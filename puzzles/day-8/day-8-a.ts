import { readData } from '../../shared.ts';
import chalk from 'chalk';
import { InputConverter } from './lib/InputConverter.ts';
import { ObjectFactory } from './lib/ObjectFactory.ts';
import { StepsCalculator } from './lib/StepsCalculator.ts';

export async function day8a(dataPath?: string) {
  const data = await readData(dataPath);

  const input = new InputConverter(data).convert();
  const { instructionsObject, mapObject } = new ObjectFactory(input).create();

  return new StepsCalculator(instructionsObject, mapObject).calculate();
}

const answer = await day8a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
