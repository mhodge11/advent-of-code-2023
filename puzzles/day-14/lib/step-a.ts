import { type Matrix } from './types.ts';
import { calculateLoad, constructMatrix } from './utils.ts';

export function run(input: string[]): number {
  let matrix = constructMatrix(input);
  tiltNorth(matrix);
  return calculateLoad(matrix);
}

function tiltNorth(matrix: Matrix) {
  for (let x = 0; x < matrix[0].length; x++) {
    let y1 = -1;

    for (let y = 0; y < matrix.length; y++) {
      if (matrix[y][x] === 'O') {
        y1++;

        if (y1 !== y) {
          matrix[y][x] = '.';
          matrix[y1][x] = 'O';
        }
      } else if (matrix[y][x] === '#') {
        y1 = y;
      }
    }
  }
}
