export class SumFactory {
	private pyramids: number[][][];

	constructor(pyramids: number[][][]) {
		this.pyramids = pyramids;
	}

	calculate() {
		const values = this.pyramids.map((pyramid) => this.extrapolate(pyramid));
		if (!values.length) throw new Error("Invalid pyramids");

		return this.sum(values);
	}

	calculateBackwards() {
		const values = this.pyramids.map((pyramid) =>
			this.extrapolateBackwards(pyramid),
		);
		if (!values.length) throw new Error("Invalid pyramids");

		return this.sum(values);
	}

	private extrapolate(pyramid: number[][]): number {
		const newPyramid = this.clone(pyramid);

		const addVal = <T>(arr: T[], val: T) => arr.push(val);

		const getVal = <T>(arr: T[]): number => arr[arr.length - 1] as number;

		for (let level = newPyramid.length - 1; level >= 0; level--) {
			const currentLevel = newPyramid[level];
			const nextLevel = newPyramid[level + 1];

			if (!currentLevel) throw new Error("Invalid pyramid");

			if (nextLevel === undefined) {
				addVal(currentLevel, 0);
			} else {
				const val = getVal(currentLevel);
				const nextLevelVal = getVal(nextLevel);

				addVal(currentLevel, val + nextLevelVal);
			}
		}

		return getVal(newPyramid[0] as number[]);
	}

	private extrapolateBackwards(pyramid: number[][]): number {
		const newPyramid = this.clone(pyramid);

		const addVal = <T>(arr: T[], val: T) => arr.unshift(val);

		const getVal = <T>(arr: T[]): number => arr[0] as number;

		for (let level = newPyramid.length - 1; level >= 0; level--) {
			const currentLevel = newPyramid[level];
			const nextLevel = newPyramid[level + 1];

			if (!currentLevel) throw new Error("Invalid pyramid");

			if (nextLevel === undefined) {
				addVal(currentLevel, 0);
			} else {
				const val = getVal(currentLevel);
				const nextLevelVal = getVal(nextLevel);

				addVal(currentLevel, val - nextLevelVal);
			}
		}

		return getVal(newPyramid[0] as number[]);
	}

	private clone(pyramid: number[][]) {
		return pyramid.map((n) => [...n]);
	}

	private sum(arr: number[]) {
		return arr.reduce((a, b) => a + b);
	}
}
