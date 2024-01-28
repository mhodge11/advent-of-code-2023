import { sum, toInt } from '~/shared.ts';
import { XYZ } from '~/utils/XYZ.ts';

export function run(data: string[]): number {
  const nums: number[] = [];
  data.forEach((line, y) => findNums(line, y, nums, data));
  return sum(nums);
}

function findNums(
  line: string,
  y: number,
  nums: number[],
  data: string[]
): void {
  for (const match of line.matchAll(/\d+/g)) {
    if (hasAdjacentSymbol(match, y, data)) {
      nums.push(toInt(match[0]));
    }
  }
}

function hasAdjacentSymbol(
  match: RegExpMatchArray,
  y: number,
  data: string[]
): boolean {
  return match[0].split('').some((_, i) => {
    const neighbors = new XYZ([match.index + i, y]).neighbors(true);
    return neighbors.some(
      (neighbor) =>
        !!(data[neighbor.y]?.charAt(neighbor.x) ?? '.').match(/[^0-9.]/)
    );
  });
}
