import { readData } from '../../shared.ts';
import chalk from 'chalk';
import { InputConverter } from './lib/InputConverter.ts';
import { TreeFactory } from './lib/TreeFactory.ts';
import { TreeStepsCalculator } from './lib/TreeStepsCalculator.ts';

export async function day8b(dataPath?: string) {
  const data = await readData(dataPath);

  const input = new InputConverter(data).convert();
  const { instructions, nodes } = new TreeFactory(input).create();

  return new TreeStepsCalculator(instructions, nodes).calculate();
}

const answer = await day8b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
