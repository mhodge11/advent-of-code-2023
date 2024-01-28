import chalk from 'chalk';

import { formatData, readData, trackRuntime } from '~/shared.ts';
import { run } from './lib/step-a.ts';

export async function day1a(dataPath?: string) {
  runtimeTracker.start();
  const data = await readData(dataPath);
  return run(formatData(data));
}

const runtimeTracker = trackRuntime();
const answer = await day1a();
runtimeTracker.done();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
