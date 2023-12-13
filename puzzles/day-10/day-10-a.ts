import { readData } from '../../shared.ts';
import chalk from 'chalk';
import { InputConverter } from './lib/InputConverter.ts';
import { LoopTraverser } from './lib/LoopTraverser.ts';
import { PlanFactory } from './lib/PlanFactory.ts';

export async function day10a(dataPath?: string) {
  const data = await readData(dataPath);

  const input = new InputConverter(data).convert();
  const plan = new PlanFactory(input).create();

  return new LoopTraverser(plan).traverse();
}

const answer = await day10a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
