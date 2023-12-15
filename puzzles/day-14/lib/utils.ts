import { type Matrix } from './types.ts';

export function calculateLoad(matrix: Matrix): number {
  return matrix.reduce(
    (acc, row, i) =>
      acc + row.filter((char) => char === 'O').length * (matrix.length - i),
    0
  );
}

export function constructMatrix(input: string[]): Matrix {
  return input.map((line) => line.split(''));
}

export function displayMatrix(matrix: Matrix): void {
  const bookend = '-'.repeat(matrix[0].length);
  console.log(bookend);
  console.log(matrix.map((row) => row.join('')).join('\n'));
  console.log(bookend);
}

export function tiltNorth(matrix: Matrix) {
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
