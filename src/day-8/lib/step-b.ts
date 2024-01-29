import { InputConverter } from "./classes/InputConverter.ts";
import { TreeFactory } from "./classes/TreeFactory.ts";
import { TreeStepsCalculator } from "./classes/TreeStepsCalculator.ts";

export function run(data: Array<string>): number {
	const input = new InputConverter(data).convert();
	const { instructions, nodes } = new TreeFactory(input).create();

	return new TreeStepsCalculator(instructions, nodes).calculate();
}
