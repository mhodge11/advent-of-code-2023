import { formatData, readData } from '../../shared.ts';
import chalk from 'chalk';
import { ArrangementsCalculator } from './lib/ArrangementsCalculator.ts';
import { RowsFactory } from './lib/RowsFactory.ts';

// Answers
// 11815 (too high)
// 12547 (too high)
// 7713 (too high)
// 7379 (CORRECT)

export async function day12a(dataPath?: string) {
  const data = await readData(dataPath);

  const input = formatData(data);
  const rows = new RowsFactory(input).convert();

  return new ArrangementsCalculator(rows).calculate();
}

const answer = await day12a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
