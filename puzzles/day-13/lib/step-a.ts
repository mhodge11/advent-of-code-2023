import { getPatterns, transpose } from './utils.ts';

export function run(input: string[]): number {
  const patterns = getPatterns(input);
  return getTotal(patterns);
}

function getTotal(patterns: string[][]): number {
  let total = 0;

  p: for (const pattern of patterns) {
    for (let i = 1; i < pattern.length; i++) {
      const check = checkHorizontal(pattern, i);

      if (check) {
        total += 100 * i;

        continue p;
      }
    }

    const transposed = transpose(pattern);
    
    for (let i = 1; i < transposed.length; i++) {
      const check = checkHorizontal(transposed, i);

      if (check) {
        total += i;

        continue p;
      }
    }
  }

  return total;
}

function checkHorizontal(pattern: string[], row: number): boolean {
  for (let i = row - 1, j = row; i >= 0 && j < pattern.length; i--, j++) {
    if (pattern[i] !== pattern[j]) {
      return false;
    }
  }

  return true;
}
