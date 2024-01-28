import { readFile } from "fs/promises";
import chalk from "chalk";

export async function readData(path?: string): Promise<string[]> {
	const fileName = path || process.argv[2];
	const data = (await readFile(fileName as string)).toString().split("\n");
	return data;
}

export async function readPureData(path?: string): Promise<string> {
	const fileName = (path ?? process.argv[2]) as string;
	const data = await readFile(fileName);
	return data.toString();
}

export function formatData(data: string[]): string[] {
	return data.filter((item) => item !== "").map((item) => item.trim());
}

export function formatDataWithGaps(data: string[]): string[] {
	while ((data[data.length - 1] as string).trim() === "") data.pop();
	return data.map((item) => item.trim());
}

export function memoize<Args extends unknown[], Result>(
	func: (...args: Args) => Result,
): (...args: Args) => Result {
	const stored = new Map<string, Result>();

	return (...args) => {
		const k = JSON.stringify(args);

		if (stored.has(k)) return stored.get(k) as Result;

		const result = func(...args);
		stored.set(k, result);

		return result;
	};
}

export function sum(...nums: number[] | (readonly number[])[]): number {
	return nums.reduce<number>((total, num) => {
		if (typeof num === "number") {
			return total + num;
		}
		return total + sum(...num);
	}, 0);
}

export function toInt(x: string): number {
	return parseInt(x, 10);
}

export function trackRuntime(): { start: () => void; done: () => void } {
	let startTime: number;

	return {
		start() {
			startTime = performance.now();
		},
		done() {
			const runtime = performance.now() - startTime;

			let log = "";
			if (runtime < 1000) {
				log = `${Math.round(runtime)}ms`;
			} else if (runtime < 60000) {
				log = `${Math.round(runtime / 1000)}s`;
			} else {
				log = `${Math.floor(runtime / 60000)}m ${Math.round(
					(runtime % 60000) / 1000,
				)}s`;
			}

			console.log(chalk.bgBlue("Run Time:"), chalk.bold.blueBright(log));
		},
	};
}
