import { formatDataWithGaps, readData } from '../../shared.ts';
import chalk from 'chalk';
import { run } from './lib/step-a.ts';

export async function day13a(dataPath?: string) {
  const data = await readData(dataPath);
  const input = formatDataWithGaps(data);
  return run(input);
}

const answer = await day13a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
