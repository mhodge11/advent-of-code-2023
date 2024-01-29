import { ArrangementsCalculator } from "./classes/ArrangementsCalculator.ts";
import { RowsFactory } from "./classes/RowsFactory.ts";

export function run(data: Array<string>): number {
	const rows = new RowsFactory(data).convert();
	return new ArrangementsCalculator(rows).calculate();
}
