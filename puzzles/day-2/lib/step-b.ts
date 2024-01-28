import { toInt } from '~/shared.ts';
import { type Cubes, type CubesTracker } from './types.ts';

export function run(data: string[]): number {
  return data.reduce((total, game) => {
    const cubes = getLcdCubes(game);
    return total + getPower(cubes);
  }, 0);
}

function getLcdCubes(game: string): Cubes {
  const cubesTracker: CubesTracker = {
    blue: [],
    green: [],
    red: [],
  };

  game
    .split(': ')[1]
    .split('; ')
    .forEach((draws) =>
      draws.split(', ').forEach((draw) => {
        const [id, color] = draw.split(' ');
        cubesTracker[color].push(toInt(id));
      })
    );

  return {
    blue: Math.max(...cubesTracker.blue),
    green: Math.max(...cubesTracker.green),
    red: Math.max(...cubesTracker.red),
  };
}

function getPower(cubes: Cubes): number {
  return Object.values(cubes).reduce((total, lcd) => {
    return total * lcd;
  }, 1);
}
