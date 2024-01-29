import { InputConverter } from "./classes/InputConverter.ts";
import { PyramidFactory } from "./classes/PyramidFactory.ts";
import { SumFactory } from "./classes/SumFactory.ts";

export function run(data: Array<string>): number {
	const input = new InputConverter(data).convert();
	const pyramids = new PyramidFactory(input).create();

	return new SumFactory(pyramids).calculateBackwards();
}
