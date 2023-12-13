import { readData } from '../../shared.ts';
import chalk from 'chalk';

const numbersAsWords = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
];

const numbersAsWordsReplacements = [
  'o1e',
  't2o',
  't3e',
  'f4r',
  'f5e',
  's6x',
  's7v',
  'e8t',
  'n9e',
];

export async function day1b(dataPath?: string) {
  const data = await readData(dataPath);

  let sum = 0;

  data.forEach((item) => {
    let formattedItem = item;

    numbersAsWords.forEach((word, index) => {
      const regex = new RegExp(word, 'g');
      formattedItem = formattedItem.replace(
        regex,
        numbersAsWordsReplacements[index]
      );
    });

    let numStr = '';

    for (let i = 0; i < formattedItem.length; i++) {
      const char = formattedItem[i];
      if (!isNaN(parseInt(char, 10))) {
        numStr += char;
      }
    }

    const trimmedNumStr = `${numStr[0]}${numStr[numStr.length - 1]}`;
    const num = parseInt(trimmedNumStr, 10);

    if (!isNaN(num)) {
      sum += num;
    }
  });

  return sum;
}

const answer = await day1b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
