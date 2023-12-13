import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day2b(dataPath?: string) {
  const data = await readData(dataPath);

  data.pop();

  let sum = 0;

  data.forEach((item) => {
    const cubeTracker = {
      red: 0,
      green: 0,
      blue: 0,
    };

    const [, game] = item.split(': ');
    const sets = game.split('; ');

    sets.forEach((set) => {
      const draws = set.split(', ');

      draws.forEach((draw) => {
        const [id, color] = draw.split(' ');
        const cubeId = parseInt(id, 10);

        if (cubeId > cubeTracker[color]) {
          cubeTracker[color] = cubeId;
        }
      });
    });

    const cubeTotals = Object.values(cubeTracker);

    const power = cubeTotals.reduce((acc, curr) => {
      if (acc === 0) {
        return curr;
      }

      return acc * curr;
    }, 0);

    sum += power;
  });

  return sum;
}

const answer = await day2b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
