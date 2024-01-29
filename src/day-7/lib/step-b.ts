import { HandObjectsCreator } from "./classes/HandObjectsCreator.ts";
import { InputConverter } from "./classes/InputConverter.ts";
import { JokerHandObjectsFactory } from "./classes/JokerHandObjectsFactory.ts";
import { ScoreCalculator } from "./classes/ScoreCalculator.ts";

export function run(data: Array<string>): number {
	const input = new InputConverter(data).convert();
	const handObjects = new HandObjectsCreator(input).create();
	const sortedHandObjects = new JokerHandObjectsFactory(handObjects).sort();

	return new ScoreCalculator(sortedHandObjects).calculate();
}
