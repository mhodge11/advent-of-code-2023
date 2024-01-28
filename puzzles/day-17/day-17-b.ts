import chalk from "chalk";

import { formatData, readData } from "shared.ts";
import { run } from "./lib/step-b.ts";

export async function day17b(dataPath?: string) {
	const data = await readData(dataPath);
	const input = formatData(data);
	return run(input);
}

const answer = await day17b();
console.log(chalk.bgGreen("Your Answer:"), chalk.green(answer));
