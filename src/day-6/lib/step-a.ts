import { InputConverter } from "./classes/InputConverter.ts";
import { MapObjectsCreator } from "./classes/MapObjectsCreator.ts";
import { NumberOfWaysToWinFinder } from "./classes/NumberOfWaysToWinFinder.ts";

export function run(data: Array<string>): number {
	const input = new InputConverter(data).convert();
	const mapObjects = new MapObjectsCreator(input).create();

	return new NumberOfWaysToWinFinder(mapObjects).find();
}
