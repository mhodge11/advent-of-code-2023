import chalk from "chalk";

import { readPureData } from "shared.ts";
import { run } from "./lib/step-a.ts";

export async function day19a(dataPath?: string) {
	const data = await readPureData(dataPath);
	return run(data);
}

const answer = await day19a();
console.log(chalk.bgGreen("Your Answer:"), chalk.green(answer));
