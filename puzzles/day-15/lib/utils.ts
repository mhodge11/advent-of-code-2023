export function formatInput(data: string[]): string[] {
  return data[0].trim().split(',');
}

export function hasher(str: string) {
  return str.split('').reduce((val, char) => {
    val += char.charCodeAt(0);
    val *= 17;
    val %= 256;
    return val;
  }, 0);
}
