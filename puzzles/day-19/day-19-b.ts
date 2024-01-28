import chalk from "chalk";

import { readPureData } from "shared.ts";
import { run } from "./lib/step-b.ts";

export async function day19b(dataPath?: string) {
	const data = await readPureData(dataPath);
	return run(data);
}

const answer = await day19b();
console.log(chalk.bgGreen("Your Answer:"), chalk.green(answer));
