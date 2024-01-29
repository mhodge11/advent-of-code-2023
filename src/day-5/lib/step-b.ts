import { InputConverter } from "./classes/InputConverter.ts";
import { MapObjectsCreator } from "./classes/MapObjectsCreator.ts";
import { SeedFinder } from "./classes/SeedFinder.ts";
import { SeedRangeCreator } from "./classes/SeedRangeCreator.ts";

export function run(data: Array<string>): number {
	const input = new InputConverter(data).convertArray();
	const seedRanges = new SeedRangeCreator(input).createSeedsArray();
	const mapObjects = new MapObjectsCreator(input).createMapObjects();

	return new SeedFinder(seedRanges, mapObjects).findClosestSeed();
}
