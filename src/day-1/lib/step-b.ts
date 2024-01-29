import { addToSum, getFirstAndLastDigit } from "./utils.ts";

export function run(data: string[]): number {
	return data.reduce((sum, item) => {
		item = replaceNumbers(item);
		item = getFirstAndLastDigit(item);
		return addToSum(sum, item);
	}, 0);
}

function replaceNumbers(str: string): string {
	for (const [word, replacement] of Object.entries(replacements)) {
		const regex = new RegExp(word, "g");
		str = str.replace(regex, replacement);
	}
	return str;
}

const replacements = {
	one: "o1e",
	two: "t2o",
	three: "t3e",
	four: "f4r",
	five: "f5e",
	six: "s6x",
	seven: "s7v",
	eight: "e8t",
	nine: "n9e",
} as const;
