import { addToSum, getFirstAndLastDigit } from "./utils.ts";

export function run(data: string[]): number {
	return data.reduce((sum, item) => {
		item = getFirstAndLastDigit(item);
		return addToSum(sum, item);
	}, 0);
}
