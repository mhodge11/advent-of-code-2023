import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day1a(dataPath?: string) {
  const data = await readData(dataPath);

  let sum = 0;

  data.forEach((item) => {
    let numStr = '';

    for (let i = 0; i < item.length; i++) {
      const char = item[i];
      if (!isNaN(parseInt(char, 10))) {
        numStr += char;
      }
    }

    numStr = `${numStr[0]}${numStr[numStr.length - 1]}`;
    const num = parseInt(numStr, 10);

    if (!isNaN(num)) {
      sum += num;
    }
  });

  return sum;
}

const answer = await day1a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
