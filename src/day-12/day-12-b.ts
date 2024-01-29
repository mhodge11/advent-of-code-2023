import chalk from "chalk";

import { readData } from "@helpers/readData.ts";
import { run } from "./lib/step-b.ts";

export async function day12b(dataPath?: string) {
	try {
		const data = await readData(dataPath);
		return run(data);
	} catch (e) {
		console.error(e);
		return "ERROR";
	}
}

const answer = await day12b();
console.log(chalk.bgGreen("Your Answer:"), chalk.green(answer));
