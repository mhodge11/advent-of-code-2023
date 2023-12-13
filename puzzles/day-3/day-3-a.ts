import { readData } from '../../shared.ts';
import chalk from 'chalk';

function getNumberFromPosition(line: string, position: number) {
  let startingPosition = position - 1;
  let endingPosition = position + 1;

  while (true) {
    if (startingPosition < 0) {
      break;
    }

    if (!isNaN(parseInt(line[startingPosition], 10))) {
      startingPosition--;
    } else {
      break;
    }
  }

  while (true) {
    if (endingPosition >= line.length) {
      break;
    }

    if (!isNaN(parseInt(line[endingPosition], 10))) {
      endingPosition++;
    } else {
      break;
    }
  }

  const numberStr = line.slice(startingPosition + 1, endingPosition);

  const usedPositions: number[] = [];
  for (let i = startingPosition + 1; i < endingPosition; i++) {
    usedPositions.push(i);
  }

  return {
    number: parseInt(numberStr, 10),
    usedPositions,
  };
}

function checkForMatch({
  line,
  numberPositions,
  symbolPositions,
  usedPositions: oldUsedPositions,
  numbers: oldNumbers,
}: {
  line: string;
  numberPositions: number[];
  symbolPositions: number[];
  usedPositions: number[];
  numbers: number[];
}) {
  const usedPositions = [...oldUsedPositions];
  const numbers = [...oldNumbers];

  symbolPositions
    .filter((value, index, array) => array.indexOf(value) === index)
    .forEach((symbolPosition) => {
      const prevPosition = symbolPosition - 1;
      const nextPosition = symbolPosition + 1;

      if (
        !usedPositions.includes(symbolPosition) &&
        numberPositions.includes(symbolPosition)
      ) {
        const { number, usedPositions: numberUsedPositions } =
          getNumberFromPosition(line, symbolPosition);

        numbers.push(number);
        usedPositions.push(...numberUsedPositions);
      }

      if (
        !usedPositions.includes(prevPosition) &&
        numberPositions.includes(prevPosition)
      ) {
        const { number, usedPositions: numberUsedPositions } =
          getNumberFromPosition(line, prevPosition);

        numbers.push(number);
        usedPositions.push(...numberUsedPositions);
      }

      if (
        !usedPositions.includes(nextPosition) &&
        numberPositions.includes(nextPosition)
      ) {
        const { number, usedPositions: numberUsedPositions } =
          getNumberFromPosition(line, nextPosition);

        numbers.push(number);
        usedPositions.push(...numberUsedPositions);
      }
    });

  return { usedPositions, numbers };
}

function getLineProperties(line: string) {
  const numberPositions: number[] = [];
  const symbolPositions: number[] = [];

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (!isNaN(parseInt(char, 10))) {
      numberPositions.push(i);
    } else if (char !== '.') {
      symbolPositions.push(i);
    }
  }

  const { usedPositions, numbers } = checkForMatch({
    line,
    numberPositions,
    symbolPositions,
    usedPositions: [],
    numbers: [],
  });

  return {
    line,
    numberPositions,
    symbolPositions,
    usedPositions,
    numbers,
  };
}

export async function day3a(dataPath?: string) {
  const data = await readData(dataPath);

  data.pop();

  let sum = 0;

  const allLineProperties = data.map((line) => getLineProperties(line));

  for (let i = 0; i < allLineProperties.length; i++) {
    const lineProperties = allLineProperties[i];
    const { line, numberPositions, usedPositions, numbers } = lineProperties;
    const symbolPositions = [...lineProperties.symbolPositions];

    if (i > 0) {
      const prevLineProperties = allLineProperties[i - 1];
      symbolPositions.push(...prevLineProperties.symbolPositions);
    }

    if (i < allLineProperties.length - 1) {
      const nextLineProperties = allLineProperties[i + 1];
      symbolPositions.push(...nextLineProperties.symbolPositions);
    }

    const { usedPositions: newUsedPositions, numbers: newNumbers } =
      checkForMatch({
        line,
        numberPositions,
        symbolPositions,
        usedPositions,
        numbers,
      });

    allLineProperties[i].usedPositions = newUsedPositions;
    allLineProperties[i].numbers = newNumbers;
  }

  allLineProperties.forEach(({ numbers }) => {
    sum += numbers.reduce((acc, curr) => acc + curr, 0);
  });

  return sum;
}

const answer = await day3a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
