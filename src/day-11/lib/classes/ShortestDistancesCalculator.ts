import type { EmptySpace } from "../types/EmptySpace.ts";
import type { Galaxy } from "../types/Galaxy.ts";
import type { Map } from "../types/Map.ts";

export class ShortestDistancesCalculator {
	private emptySpace: EmptySpace;
	private galaxies: Galaxy[];
	private expansionRate: number;

	constructor(map: Map, expansionRate: number) {
		this.emptySpace = map.emptySpace;
		this.galaxies = map.galaxies;
		this.expansionRate = expansionRate;
	}

	calculate(): number {
		const distances = this.getDistances();

		return this.sum(distances);
	}

	private getDistances(): number[] {
		const distances: number[] = [];

		for (let i = 0; i < this.galaxies.length; i++) {
			for (let j = i + 1; j < this.galaxies.length; j++) {
				const galaxy = this.galaxies[i];
				const nextGalaxy = this.galaxies[j];
				if (!galaxy || !nextGalaxy) throw new Error("No galaxy found");

				distances.push(this.getDistance(galaxy, nextGalaxy));
			}
		}

		return distances;
	}

	private getDistance(a: Galaxy, b: Galaxy) {
		const baseDistance = this.getBaseDistance(a, b);

		const emptySpaceCount = [
			{ emptyIndicesSet: this.emptySpace.rows, dimension: "y" as const },
			{ emptyIndicesSet: this.emptySpace.cols, dimension: "x" as const },
		].reduce(
			(sum, { emptyIndicesSet, dimension }) =>
				sum + this.countEmptySpaceBetween(a, b, emptyIndicesSet, dimension),
			0,
		);

		return baseDistance + emptySpaceCount * (this.expansionRate - 1);
	}

	private getBaseDistance(a: Galaxy, b: Galaxy) {
		return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
	}

	private countEmptySpaceBetween(
		a: Galaxy,
		b: Galaxy,
		emptyIndicesSet: Set<number>,
		dimension: "x" | "y",
	) {
		const minIdx = Math.min(a[dimension], b[dimension]);
		const maxIdx = Math.max(a[dimension], b[dimension]);
		let count = 0;

		for (let idx = minIdx + 1; idx < maxIdx; idx++) {
			if (emptyIndicesSet.has(idx)) {
				count++;
			}
		}

		return count;
	}

	private sum(arr: number[]): number {
		return arr.reduce((a, b) => a + b, 0);
	}
}
