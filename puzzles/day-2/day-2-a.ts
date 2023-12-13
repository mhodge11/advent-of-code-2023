import { readData } from '../../shared.ts';
import chalk from 'chalk';

const cubes = {
  red: 12,
  green: 13,
  blue: 14,
};

export async function day2a(dataPath?: string) {
  const data = await readData(dataPath);

  data.pop();

  let sum = 0;

  data.forEach((item) => {
    let validGame = true;

    const [gameTitle, game] = item.split(': ');
    const gameId = parseInt(gameTitle.split(' ')[1], 10);
    const sets = game.split('; ');

    for (let i = 0; i < sets.length; i++) {
      const draws = sets[i].split(', ');

      for (let j = 0; j < draws.length; j++) {
        const [id, color] = draws[j].split(' ');
        const cubeTotal = cubes[color];
        const cubeId = parseInt(id, 10);

        if (cubeId > cubeTotal) {
          validGame = false;
          break;
        }
      }

      if (!validGame) {
        break;
      }
    }

    if (validGame) {
      sum += gameId;
    }
  });

  return sum;
}

const answer = await day2a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
