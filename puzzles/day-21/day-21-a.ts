import chalk from "chalk";

import { readData } from "shared.ts";
import { run } from "./lib/step-a.ts";

export async function day21a(dataPath?: string) {
	const data = await readData(dataPath);
	return run(data);
}

const answer = await day21a();
console.log(chalk.bgGreen("Your Answer:"), chalk.green(answer));
