import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day4a(dataPath?: string) {
  const data = await readData(dataPath);

  data.pop();

  let sum = 0;

  data.forEach((card) => {
    const [, cards] = card.split(': ');
    const [winningCard, checkCard] = cards.split(' | ');

    const winningNumbers = winningCard
      .split(' ')
      .map((num) => parseInt(num.trim(), 10));
    const checkNumbers = checkCard
      .split(' ')
      .map((num) => parseInt(num.trim(), 10));

    let points = 0;

    winningNumbers.forEach((num) => {
      let lastFoundIndex = 0;

      while (true) {
        const foundIndex = checkNumbers.indexOf(num, lastFoundIndex);

        if (foundIndex === -1) {
          break;
        }

        if (points > 1) {
          points *= 2;
        } else {
          points += 1;
        }

        lastFoundIndex = foundIndex + 1;
      }
    });

    sum += points;
  });

  return sum;
}

const answer = await day4a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
