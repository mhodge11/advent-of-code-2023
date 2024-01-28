import chalk from 'chalk';

import { formatData, readData, trackRuntime } from '~/shared.ts';
import { run } from './lib/step-b.ts';

export async function day3b(dataPath?: string) {
  runtimeTracker.start();
  const data = await readData(dataPath);
  return run(formatData(data));
}

const runtimeTracker = trackRuntime();
const answer = await day3b();
runtimeTracker.done();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
