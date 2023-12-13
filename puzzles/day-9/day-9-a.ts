import { readData } from '../../shared.ts';
import chalk from 'chalk';
import { InputConverter } from './lib/InputConverter.ts';
import { PyramidFactory } from './lib/PyramidFactory.ts';
import { SumFactory } from './lib/SumFactory.ts';

export async function day9a(dataPath?: string) {
  const data = await readData(dataPath);

  const input = new InputConverter(data).convert();
  const pyramids = new PyramidFactory(input).create();

  return new SumFactory(pyramids).calculate();
}

const answer = await day9a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
