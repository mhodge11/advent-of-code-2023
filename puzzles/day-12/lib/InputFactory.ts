export class InputFactory {
  private readonly input: string[];

  constructor(input: string[]) {
    this.input = input;
  }

  convert(): string[] {
    return this.input.filter(this.eval).map(this.trim);
  }

  private eval(item: string): boolean {
    return item !== '';
  }

  private trim(item: string): string {
    return item.trim();
  }
}
