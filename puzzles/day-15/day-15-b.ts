import chalk from 'chalk';

import { formatData, getRunTime, readData } from '~/shared.ts';
import { run } from './lib/step-b.ts';

export async function day15b(dataPath?: string) {
  const startTimeMs = Date.now();
  
  const data = await readData(dataPath);
  const power = run(formatData(data));

  console.log(
    chalk.bgBlue('Run Time:'),
    chalk.bold.blueBright(getRunTime(startTimeMs))
  );

  return power;
}

const answer = await day15b();
console.log(chalk.bgGreen('Your Answer:'), chalk.bold.green(answer));
