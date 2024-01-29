import chalk from "chalk";

import { readData } from "@helpers/readData.ts";
import { ArrangementsCalculator } from "./lib/classes/ArrangementsCalculator.ts";
import { RowsFactory } from "./lib/classes/RowsFactory.ts";

// Answers
// 11815 (too high)
// 12547 (too high)
// 7713 (too high)
// 7379 (CORRECT)

export async function day12a(dataPath?: string) {
	try {
		const data = await readData(dataPath);

		const rows = new RowsFactory(data).convert();

		return new ArrangementsCalculator(rows).calculate();
	} catch (e) {
		console.error(e);
		return "ERROR";
	}
}

const answer = await day12a();
console.log(chalk.bgGreen("Your Answer:"), chalk.green(answer));
