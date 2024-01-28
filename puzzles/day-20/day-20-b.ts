import chalk from "chalk";

import { readData } from "shared.ts";
import { run } from "./lib/step-b.ts";

export async function day20b(dataPath?: string) {
	const data = await readData(dataPath);
	return run(data);
}

const answer = await day20b();
console.log(chalk.bgGreen("Your Answer:"), chalk.green(answer));
