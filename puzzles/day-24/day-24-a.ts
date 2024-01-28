import chalk from "chalk";

import { readData } from "shared.ts";
import { run } from "./lib/step-a.ts";

export async function day24a(dataPath?: string) {
	const data = await readData(dataPath);

	try {
		return run(data);
	} catch (e) {
		console.error(e);
		return "ERROR";
	}
}

const answer = await day24a();
console.log(chalk.bgGreen("Your Answer:"), chalk.green(answer));
