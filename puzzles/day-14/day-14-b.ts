import { formatData, readData } from '../../shared.ts';
import chalk from 'chalk';
import { run } from './lib/step-b.ts';

export async function day14b(dataPath?: string) {
  const data = await readData(dataPath);
  const input = formatData(data);
  return run(input);
}

const answer = await day14b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
