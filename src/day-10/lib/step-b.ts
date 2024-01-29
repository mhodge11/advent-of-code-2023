import { InputConverter } from "./classes/InputConverter.ts";
import { InteriorPointsTraverser } from "./classes/InteriorPointsTraverser.ts";
import { PlanFactory } from "./classes/PlanFactory.ts";

export function run(data: Array<string>): number {
	const input = new InputConverter(data).convert();
	const plan = new PlanFactory(input).create();

	return new InteriorPointsTraverser(plan).traverse();
}
