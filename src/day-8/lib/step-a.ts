import { InputConverter } from "./classes/InputConverter.ts";
import { ObjectFactory } from "./classes/ObjectFactory.ts";
import { StepsCalculator } from "./classes/StepsCalculator.ts";

export function run(data: Array<string>): number {
	const input = new InputConverter(data).convert();
	const { instructionsObject, mapObject } = new ObjectFactory(input).create();

	return new StepsCalculator(instructionsObject, mapObject).calculate();
}
