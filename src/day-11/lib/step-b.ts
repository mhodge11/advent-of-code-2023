import { InputConverter } from "./classes/InputConverter.ts";
import { ObjectFactory } from "./classes/ObjectFactory.ts";
import { ShortestDistancesCalculator } from "./classes/ShortestDistancesCalculator.ts";

export function run(data: Array<string>): number {
	const input = new InputConverter(data).convert();
	const map = new ObjectFactory(input).create();

	return new ShortestDistancesCalculator(map, 1000000).calculate();
}
