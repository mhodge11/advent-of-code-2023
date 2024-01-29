import type { MapObject } from "../types/MapObject.ts";

export class SeedFinder {
	private seedRanges: number[][] | undefined;
	private mapObjects: MapObject[];
	private maxSeed: number;
	private counter: number;
	private smallestSeed: number;

	constructor(seedRanges: number[][] | undefined, mapObjects: MapObject[]) {
		this.seedRanges = seedRanges;
		this.mapObjects = mapObjects;
		this.maxSeed = 0;
		this.counter = 6;
		this.smallestSeed = 0;
	}

	findClosestSeed(): number {
		const startTime = Date.now(); // Record the start time

		this.setMaxSeed();

		console.log(`maxSeed: ${this.maxSeed}`);
		console.log(`seedRanges: ${this.seedRanges}`);

		for (let i = 0; i < this.maxSeed; i++) {
			if (i % 100000 === 0) console.log("Checking next location range from", i);

			this.counter = 6;

			const checkThis = this.goThroughMapObject(i);
			const isSeedInRange = this.checkIfSeedInRage(checkThis);

			if (isSeedInRange) {
				this.smallestSeed = i;
				break;
			}
		}

		const endTime = Date.now(); // Record the end time

		console.log(`Took ${endTime - startTime}ms to find the seed`);

		return this.smallestSeed;
	}

	private setMaxSeed() {
		if (this.seedRanges != null)
			for (const range of this.seedRanges) {
				const max = range[1];
				if (max == null) throw new Error("Invalid range");
				if (max > this.maxSeed) this.maxSeed = max;
			}
	}

	private checkIfSeedInRage(seed: number) {
		if (this.seedRanges != null)
			for (const range of this.seedRanges) {
				const [min, max] = range;
				if (min == null || max == null) throw new Error("Invalid range");
				if (seed >= min && seed <= max) return true;
			}

		return false;
	}

	private goThroughMapObject(number: number): any {
		let returnValue = -1;

		const mapObject = this.mapObjects[this.counter];
		if (!mapObject) throw new Error("Invalid map object");

		for (const range of mapObject.ranges)
			if (
				number >= range.destination &&
				number <= range.destination + range.range
			) {
				returnValue = number + range.source - range.destination;
				break;
			}

		this.counter--;

		if (this.counter >= 0)
			return returnValue >= 0
				? this.goThroughMapObject(returnValue)
				: this.goThroughMapObject(number);

		this.counter < 0;
		return returnValue >= 0 ? returnValue : number;
	}
}
