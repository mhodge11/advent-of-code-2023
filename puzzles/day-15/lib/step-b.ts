import { toInt } from '~/shared.ts';
import { formatInput, hasher } from './utils.ts';

export function run(data: string[]): number {
  const map = new HashMap();
  formatInput(data).forEach(map.eval.bind(map));
  return map.getPower();
}

type Lens = {
  label: string;
  power: number;
};
type Box = Lens[] | null;
type Map = Box[];

class HashMap {
  private map: Map;

  constructor(size: number = 256) {
    this.map = new Array(size);
  }

  getPower(): number {
    return this.map.reduce((total, box, i) => {
      return (
        box?.reduce(
          (sum, { power }, j) => sum + (i + 1) * (j + 1) * power,
          total
        ) ?? total
      );
    }, 0);
  }

  eval(str: string): void {
    if (str.includes('=')) {
      const [label, value] = str.split('=');
      this.set(label, toInt(value));
    } else if (str.includes('-')) {
      const [label] = str.split('-');
      this.remove(label);
    }
  }

  private set(label: string, power: number): void {
    const hash = hasher(label);
    const box = this.map[hash];

    if (!box) {
      this.map[hash] = [{ label, power }];
      return;
    }

    const i = box.findIndex((entry) => entry.label === label);
    if (i !== -1) {
      box[i].power = power;
      return;
    }

    box.push({ label, power });
  }

  private remove(label: string): void {
    const hash = hasher(label);
    const box = this.map[hash];

    if (!box || !box.length) {
      return;
    }

    const i = box.findIndex((entry) => entry.label === label);
    if (i !== -1) {
      box.splice(i, 1);
    }
  }
}
