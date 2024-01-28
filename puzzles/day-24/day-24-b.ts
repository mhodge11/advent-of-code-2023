import chalk from "chalk";

import { readData } from "shared.ts";
import { run } from "./lib/step-b.ts";

export async function day24b(dataPath?: string) {
	const data = await readData(dataPath);

	try {
		return run(data);
	} catch (e) {
		console.error(e);
		return "ERROR";
	}
}

const answer = await day24b();
console.log(chalk.bgGreen("Your Answer:"), chalk.green(answer));
