import chalk from "chalk";

import { formatData, readData } from "shared.ts";
import { run } from "./lib/step-a.ts";

export async function day18a(dataPath?: string) {
	const data = await readData(dataPath);
	const input = formatData(data);
	return run(input);
}

const answer = await day18a();
console.log(chalk.bgGreen("Your Answer:"), chalk.green(answer));
