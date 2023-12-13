import { readData } from '../../shared.ts';
import chalk from 'chalk';

function tallyPoints(winningNumbers: number[], checkNumbers: number[]) {
  let points = 0;

  winningNumbers.forEach((num) => {
    let lastFoundIndex = 0;

    while (true) {
      const foundIndex = checkNumbers.indexOf(num, lastFoundIndex);

      if (foundIndex === -1) {
        break;
      }

      points++;
      lastFoundIndex = foundIndex + 1;
    }
  });

  return points;
}

export async function day4b(dataPath?: string) {
  const data = await readData(dataPath);

  data.pop();

  const numberOfEachCard = Array(data.length).fill(1);

  data.forEach((card, index) => {
    const [, cards] = card.split(': ');
    const [winningCard, checkCard] = cards.split(' | ');

    const winningNumbers = winningCard
      .split(' ')
      .map((num) => parseInt(num.trim(), 10));
    const checkNumbers = checkCard
      .split(' ')
      .map((num) => parseInt(num.trim(), 10));

    for (let i = 0; i < numberOfEachCard[index]; i++) {
      const points = tallyPoints(winningNumbers, checkNumbers);
      for (let j = index + 1; j <= index + points; j++) {
        numberOfEachCard[j] += 1;
      }
    }
  });

  return numberOfEachCard.reduce((acc, curr) => acc + curr, 0);
}

const answer = await day4b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
