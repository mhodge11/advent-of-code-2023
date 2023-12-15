import { type Matrix } from './types.ts';
import { calculateLoad, constructMatrix } from './utils.ts';

export function run(input: string[]): number {
  let matrix = constructMatrix(input);
  const stored = new Map<string, number>();

  while (true) {
    cycle(matrix);

    const key = matrix.map((row) => row.join('')).join(':');

    if (stored.has(key)) {
      if (stored.get(key) === 2) {
        break;
      }

      stored.set(key, 2);
    } else {
      stored.set(key, 1);
    }
  }

  const cycles: string[] = [];

  for (const [key, value] of stored) {
    if (value === 2) {
      cycles.push(key);
    }
  }

  const offset = stored.size - cycles.length;
  const i = (1000000000 - offset) % cycles.length;

  matrix = constructMatrix(cycles[i - 1].split(':'));
  return calculateLoad(matrix);
}

function cycle(matrix: Matrix) {
  tiltNorth(matrix);
  tiltWest(matrix);
  tiltSouth(matrix);
  tiltEast(matrix);
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

function tiltWest(matrix: Matrix) {
  for (let y = 0; y < matrix.length; y++) {
    let x1 = -1;

    for (let x = 0; x < matrix[0].length; x++) {
      if (matrix[y][x] === 'O') {
        x1++;

        if (x1 !== x) {
          matrix[y][x] = '.';
          matrix[y][x1] = 'O';
        }
      } else if (matrix[y][x] === '#') {
        x1 = x;
      }
    }
  }
}

function tiltSouth(matrix: Matrix) {
  for (let x = 0; x < matrix[0].length; x++) {
    let y1 = matrix.length;

    for (let y = matrix.length - 1; y >= 0; y--) {
      if (matrix[y][x] === 'O') {
        y1--;

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

function tiltEast(matrix: Matrix) {
  for (let y = 0; y < matrix.length; y++) {
    let x1 = matrix[0].length;

    for (let x = matrix[0].length - 1; x >= 0; x--) {
      if (matrix[y][x] === 'O') {
        x1--;

        if (x1 !== x) {
          matrix[y][x] = '.';
          matrix[y][x1] = 'O';
        }
      } else if (matrix[y][x] === '#') {
        x1 = x;
      }
    }
  }
}
