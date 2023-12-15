import { formatInput, hasher } from './utils.ts';

export function run(data: string[]): number {
  return formatInput(data).reduce((acc, str) => acc + hasher(str), 0);
}
