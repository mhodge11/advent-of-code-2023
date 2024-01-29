import chalk from "chalk";

import { readData } from "./readData.ts";

export async function runPuzzle(
	fn: (data: Array<string>, pureData: string) => number | bigint,
): Promise<void> {
	let answer: number | bigint | undefined;
	let error: Error | undefined;

	try {
		const data = await readData();
		const pureData = data.join("\n");
		answer = fn(data, pureData);
	} catch (e) {
		if (e instanceof Error) error = e;
		else if (typeof e === "string") error = new Error(e);
		else error = new Error("Something went wrong");
	}

	if (error) console.error(chalk.red(error));
	else console.log(chalk.green("Answer:"), chalk.bold.green(answer));
}
