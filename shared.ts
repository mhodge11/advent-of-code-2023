import { readFile } from 'fs/promises';

export async function readData(path?: string): Promise<string[]> {
  const fileName = path || process.argv[2];
  const data = (await readFile(fileName)).toString().split('\n');
  return data;
}

export function formatData(data: string[]): string[] {
  return data.filter((item) => item !== '').map((item) => item.trim());
}

export function formatDataWithGaps(data: string[]): string[] {
  while (data[data.length - 1].trim() === '') {
    data.pop();
  }

  return data.map((item) => item.trim());
}

export function getRunTime(startTimeMs: number): string {
  const time = Date.now() - startTimeMs;

  if (time < 1000) {
    return `${time}ms`;
  } else if (time < 60000) {
    return `${Math.round(time / 1000)}s`;
  }

  return `${Math.floor(time / 60000)}m ${Math.round((time % 60000) / 1000)}s`;
}

export function memoize<Args extends unknown[], Result>(
  func: (...args: Args) => Result
): (...args: Args) => Result {
  const stored = new Map<string, Result>();

  return (...args) => {
    const k = JSON.stringify(args);

    if (stored.has(k)) {
      return stored.get(k)!;
    }

    const result = func(...args);
    stored.set(k, result);

    return result;
  };
}

export function sum(...nums: number[] | (readonly number[])[]): number {
  let n = 0;

  for (const x of nums) {
    if (typeof x === 'number') {
      n += x;
    } else {
      for (const y of x) {
        n += y;
      }
    }
  }
  return n;
}

export function toInt(x: string): number {
  return parseInt(x, 10);
}
