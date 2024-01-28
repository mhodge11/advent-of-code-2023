import { toInt } from '~/shared.ts';

export function addToSum(sum: number, item: string): number {
  const num = toInt(item);
  if (!isNaN(num)) {
    sum += num;
  }
  return sum;
}

export function getFirstAndLastDigit(item: string): string {
  item = item
    .split('')
    .map((char) => {
      if (!isNaN(toInt(char))) {
        return char;
      }
      return '';
    })
    .join('');
  item = item[0] + item[item.length - 1];
  return item;
}
