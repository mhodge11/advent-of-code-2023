export class SumFactory {
  private pyramids: number[][][];

  constructor(pyramids: number[][][]) {
    this.pyramids = pyramids;
  }

  calculate() {
    const values = this.pyramids.map((pyramid) => this.extrapolate(pyramid));

    return this.sum(values);
  }

  calculateBackwards() {
    const values = this.pyramids.map((pyramid) =>
      this.extrapolateBackwards(pyramid)
    );

    return this.sum(values);
  }

  private extrapolate(pyramid: number[][]) {
    const newPyramid = this.clone(pyramid);

    const addVal = <T>(arr: T[], val: T) => arr.push(val);

    const getVal = <T>(arr: T[]) => arr[arr.length - 1];

    for (let level = newPyramid.length - 1; level >= 0; level--) {
      const currentLevel = newPyramid[level];
      const nextLevel = newPyramid[level + 1];

      if (nextLevel === undefined) {
        addVal(currentLevel, 0);
      } else {
        const val = getVal(currentLevel);
        const nextLevelVal = getVal(nextLevel);

        addVal(currentLevel, val + nextLevelVal);
      }
    }

    return getVal(newPyramid[0]);
  }

  private extrapolateBackwards(pyramid: number[][]) {
    const newPyramid = this.clone(pyramid);

    const addVal = <T>(arr: T[], val: T) => arr.unshift(val);

    const getVal = <T>(arr: T[]) => arr[0];

    for (let level = newPyramid.length - 1; level >= 0; level--) {
      const currentLevel = newPyramid[level];
      const nextLevel = newPyramid[level + 1];

      if (nextLevel === undefined) {
        addVal(currentLevel, 0);
      } else {
        const val = getVal(currentLevel);
        const nextLevelVal = getVal(nextLevel);

        addVal(currentLevel, val - nextLevelVal);
      }
    }

    return getVal(newPyramid[0]);
  }

  private clone(pyramid: number[][]) {
    return pyramid.map((n) => [...n]);
  }

  private sum(arr: number[]) {
    return arr.reduce((a, b) => a + b);
  }
}
