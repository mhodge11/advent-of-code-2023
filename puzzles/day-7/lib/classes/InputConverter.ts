export class InputConverter {
  private input: string[];

  constructor(input: string[]) {
    this.input = input;
  }

  convert(): string[] {
    return this.input.filter((item) => item !== '');
  }
}
