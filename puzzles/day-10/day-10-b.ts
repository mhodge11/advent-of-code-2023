import { readData } from '../../shared.ts';
import chalk from 'chalk';
import { InputConverter } from './lib/InputConverter.ts';
import { InteriorPointsTraverser } from './lib/InteriorPointsTraverser.ts';
import { PlanFactory } from './lib/PlanFactory.ts';

export async function day10b(dataPath?: string) {
  const data = await readData(dataPath);

  const input = new InputConverter(data).convert();
  const plan = new PlanFactory(input).create();

  return new InteriorPointsTraverser(plan).traverse();
}

const answer = await day10b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
