import { formatData, readData } from '../../shared.ts';
import chalk from 'chalk';
import { run } from './lib/step-a.ts';

export async function day14a(dataPath?: string) {
  const data = await readData(dataPath);
  const input = formatData(data);
  return run(input);
}

const answer = await day14a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
