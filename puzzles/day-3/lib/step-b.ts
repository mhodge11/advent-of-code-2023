import { sum, toInt } from '~/shared.ts';
import { XYZ } from '~/utils/XYZ.ts';

type Part = {
  value: number;
  gears: XYZ[];
};

export function run(data: string[]): number {
  const parts: Part[] = [];
  data.forEach((line, y) => findParts(line, y, parts, data));
  return sum(data.map((line, y) => sum(getGearValues(line, y, parts))));
}

function findParts(
  line: string,
  y: number,
  parts: Part[],
  data: string[]
): void {
  for (const match of line.matchAll(/\d+/g)) {
    const gears: XYZ[] = findGears(match, y, data);
    if (gears.length) {
      parts.push({ value: toInt(match[0]), gears });
    }
  }
}

function findGears(match: RegExpMatchArray, y: number, data: string[]): XYZ[] {
  return match[0]
    .split('')
    .flatMap((_, i) =>
      new XYZ([match.index + i, y])
        .neighbors(true)
        .filter(
          (neighbor) => (data[neighbor.y]?.charAt(neighbor.x) ?? '.') === '*'
        )
    );
}

function getGearValues(line: string, y: number, parts: Part[]): number[] {
  return [...line.matchAll(/\*/g)].map((match) => {
    // how many neighboring part numbers does this gear have?
    const nearPartNumbers = parts.filter((part) =>
      part.gears.some((gear) => gear.eq([match.index, y]))
    );
    return nearPartNumbers.length === 2
      ? nearPartNumbers[0].value * nearPartNumbers[1].value
      : 0;
  });
}
