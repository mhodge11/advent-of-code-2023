import chalk from "chalk";

import { readData } from "shared.ts";
import { run } from "./lib/step-b.ts";

export async function day23b(dataPath?: string) {
	const data = await readData(dataPath);

	try {
		return run(data);
	} catch (e) {
		console.error(e);
		return "ERROR";
	}
}

const answer = await day23b();
console.log(chalk.bgGreen("Your Answer:"), chalk.green(answer));
