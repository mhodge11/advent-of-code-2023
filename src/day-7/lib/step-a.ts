import { HandObjectsCreator } from "./classes/HandObjectsCreator.ts";
import { HandObjectsFactory } from "./classes/HandObjectsFactory.ts";
import { InputConverter } from "./classes/InputConverter.ts";
import { ScoreCalculator } from "./classes/ScoreCalculator.ts";

export function run(data: Array<string>): number {
	const input = new InputConverter(data).convert();
	const handObjects = new HandObjectsCreator(input).create();
	const sortedHandObjects = new HandObjectsFactory(handObjects).sort();

	return new ScoreCalculator(sortedHandObjects).calculate();
}
