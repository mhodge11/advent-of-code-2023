export class SeedArrayCreator {
  private input: string[];

  constructor(input: string[]) {
    this.input = input;
  }

  createSeedsArray(): number[] | undefined {
    const seedString = this.input.shift()?.replace('seeds: ', '').split(' ');
    const seedArray = seedString?.map((seed) => parseInt(seed));

    return seedArray;
  }
}
