import { InputConverter } from "./classes/InputConverter.ts";
import { LocationFinder } from "./classes/LocationFinder.ts";
import { MapObjectsCreator } from "./classes/MapObjectsCreator.ts";
import { SeedArrayCreator } from "./classes/SeedArrayCreator.ts";

export function run(data: Array<string>): number {
	const input = new InputConverter(data).convertArray();
	const seedArray = new SeedArrayCreator(input).createSeedsArray();
	const mapObjects = new MapObjectsCreator(input).createMapObjects();

	return new LocationFinder(seedArray, mapObjects).findClosestLocation();
}
