import { toInt } from '~/shared.ts';
import { type Cubes } from './types.ts';

export function run(data: string[]): number {
  return data.reduce((total, game, i) => {
    if (isValidGame(game)) {
      total += i + 1;
    }
    return total;
  }, 0);
}

function isValidGame(game: string): boolean {
  return !game
    .split(': ')[1]
    .split('; ')
    .some((draws) =>
      draws.split(', ').some((draw) => {
        const [id, color] = draw.split(' ');
        return toInt(id) > cubes[color];
      })
    );
}

const cubes: Cubes = {
  red: 12,
  green: 13,
  blue: 14,
};
