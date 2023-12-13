export class PyramidFactory {
  private input: string[];

  constructor(input: string[]) {
    this.input = input;
  }

  create() {
    const placeholder = this.input.map((line) =>
      line
        .trim()
        .split(' ')
        .map((n) => parseInt(n, 10))
    );

    return placeholder.map((history) => this.getPyramid(history, this));
  }

  private getPyramid(history: number[], self: PyramidFactory) {
    const diffsPyramid: number[][] = [history];

    while (diffsPyramid[diffsPyramid.length - 1].some((n) => n !== 0)) {
      const lastRow = diffsPyramid[diffsPyramid.length - 1];
      const diffs = self.getDiffs(lastRow);

      diffsPyramid.push(diffs);
    }

    return diffsPyramid;
  }

  private getDiffs(nums: number[]): number[] {
    const diffs = [];

    for (let i = 1; i < nums.length; i++) {
      diffs.push(nums[i] - nums[i - 1]);
    }

    return diffs;
  }
}
