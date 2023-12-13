import { formatData, readData } from '../../shared.ts';
import chalk from 'chalk';
import { step2Solution } from './utils/step2Solution.ts';

export async function day12b(dataPath?: string) {
  const data = await readData(dataPath);

  const input = formatData(data);

  return step2Solution(input);
}

const answer = await day12b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
