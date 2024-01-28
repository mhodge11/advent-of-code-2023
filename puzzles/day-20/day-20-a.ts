import chalk from "chalk";

import { readData } from "shared.ts";
import { run } from "./lib/step-a.ts";

export async function day20a(dataPath?: string) {
	const data = await readData(dataPath);
	return run(data);
}

const answer = await day20a();
console.log(chalk.bgGreen("Your Answer:"), chalk.green(answer));
