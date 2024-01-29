export class PyramidFactory {
	private input: string[];

	constructor(input: string[]) {
		this.input = input;
	}

	create() {
		const placeholder = this.input.map((line) =>
			line
				.trim()
				.split(" ")
				.map((n) => parseInt(n, 10)),
		);

		return placeholder.map((history) => this.getPyramid(history, this));
	}

	private getPyramid(history: number[], self: PyramidFactory) {
		const diffsPyramid: number[][] = [history];
		const lastDiff = diffsPyramid[diffsPyramid.length - 1];
		if (!lastDiff) throw new Error("Invalid history");

		while (lastDiff.some((n) => n !== 0)) {
			const lastRow = diffsPyramid[diffsPyramid.length - 1];
			if (!lastRow) throw new Error("Invalid history");

			const diffs = self.getDiffs(lastRow);
			diffsPyramid.push(diffs);
		}

		return diffsPyramid;
	}

	private getDiffs(nums: number[]): number[] {
		const diffs = [];

		for (let i = 1; i < nums.length; i++) {
			const num = nums[i];
			const diff = nums[i - 1];

			if (num === undefined || diff === undefined)
				throw new Error("Invalid nums");

			diffs.push(num - diff);
		}

		return diffs;
	}
}
