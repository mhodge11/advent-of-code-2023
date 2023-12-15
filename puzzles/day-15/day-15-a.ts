import chalk from 'chalk';

import { formatData, readData } from '~/shared.ts';
import { run } from './lib/step-a.ts';

export async function day15a(dataPath?: string) {
  const data = await readData(dataPath);
  return run(formatData(data));
}

const answer = await day15a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
