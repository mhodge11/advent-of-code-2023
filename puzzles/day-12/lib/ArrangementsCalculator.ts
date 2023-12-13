import { getRunTime } from '../../../shared.ts';
import { type Row } from '../types/Row.ts';
import { type Step } from '../types/Step.ts';

export class ArrangementsCalculator {
  private readonly rows: Row[];
  private permutations: number = 0;

  constructor(rows: Row[]) {
    this.rows = rows;
  }

  calculate(): number {
    for (let i = 0; i < this.rows.length; i++) {
      const startTime = Date.now();

      const row: Row = this.rows[i];
      const step: Step = { group: 0, amount: 0, position: 0 };

      this.runPermutations(row, step);

      console.log(`Row ${i + 1} (${getRunTime(startTime)})`);
    }

    return this.permutations;
  }

  private runPermutations(
    { groups, line }: Row,
    { group, amount, position }: Step
  ): void {
    const maxAmount = groups[group];
    const lastGroup = groups.length - 1;

    const isMaxAmount = amount === maxAmount;
    const isLastGroup = group === lastGroup;
    const isInvalidPosition = position === line.length;

    if (isMaxAmount && isLastGroup) {
      if (!line.slice(position).includes('#')) {
        this.permutations++;
      }

      return;
    }

    if (isInvalidPosition) {
      return;
    }

    const char = line[position];

    const row = { groups, line };
    const step = { group, amount, position };

    switch (char) {
      case '.':
        return this.runPermutationForPeriod(row, step, isMaxAmount);
      case '#':
        return this.runPermutationForHashtag(row, step, isMaxAmount);
      case '?':
        return this.runPermutationForQuestionMark(row, step, isMaxAmount);
      default:
        throw new Error(`Invalid char: ${char}`);
    }
  }

  private runPermutationForPeriod(
    row: Row,
    { group, amount, position }: Step,
    isMaxAmount: boolean
  ): void {
    if (amount > 0 && !isMaxAmount) {
      return;
    }

    const nextGroup = isMaxAmount ? group + 1 : group;
    const nextStep = {
      group: nextGroup,
      amount: 0,
      position: position + 1,
    };

    this.runPermutations(row, nextStep);
  }

  private runPermutationForHashtag(
    row: Row,
    { group, amount, position }: Step,
    isMaxAmount: boolean
  ): void {
    if (isMaxAmount) {
      return;
    }

    const nextStep = {
      group,
      amount: amount + 1,
      position: position + 1,
    };

    this.runPermutations(row, nextStep);
  }

  private runPermutationForQuestionMark(
    row: Row,
    step: Step,
    isMaxAmount: boolean
  ): void {
    this.runPermutationForPeriod(row, step, isMaxAmount);
    this.runPermutationForHashtag(row, step, isMaxAmount);
  }
}
