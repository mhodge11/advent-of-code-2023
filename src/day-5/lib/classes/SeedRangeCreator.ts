import { toInt } from "@helpers/toInt";

export class SeedRangeCreator {
	private input: string[];

	constructor(input: string[]) {
		this.input = input;
	}

	createSeedsArray() {
		const seedString = this.input.shift()?.replace("seeds: ", "").split(" ");
		const seedArray = seedString?.map(toInt);

		const seedRanges: [number, number][] = [];

		if (seedArray)
			for (let i = 0; i < seedArray.length; i += 2) {
				const curr = seedArray[i];
				const next = seedArray[i + 1];
				if (curr == null || next == null) throw new Error("Invalid seed array");

				const min = curr;
				const max = curr + next;

				seedRanges.push([min, max]);
			}

		return seedRanges;
	}
}
