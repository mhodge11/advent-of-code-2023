import { memoize } from "@helpers/memoize";
import { sum } from "@helpers/sum";
import { toInt } from "@helpers/toInt";

const countWays = memoize((line: string, runs: readonly number[]): number => {
	if (line.length === 0) {
		if (runs.length === 0) return 1;
		return 0;
	}

	if (runs.length === 0) {
		for (let i = 0; i < line.length; i++) if (line[i] === "#") return 0;
		return 1;
	}

	// The line is not long enough for all runs
	if (line.length < sum(runs) + runs.length - 1) return 0;

	if (line[0] === ".") return countWays(line.slice(1), runs);

	if (line[0] === "#") {
		const [run, ...leftoverRuns] = runs;
		if (run == null) throw new Error(`Invalid run: ${run}`);

		for (let i = 0; i < run; i++) if (line[i] === ".") return 0;

		if (line[run] === "#") return 0;

		return countWays(line.slice(run + 1), leftoverRuns);
	}

	// Otherwise dunno first spot, pick
	return (
		countWays(`#${line.slice(1)}`, runs) + countWays(`.${line.slice(1)}`, runs)
	);
});

export function run(input: string[]): number {
	let n = 0;

	for (const line of input) {
		const [str, numsStr] = line.split(" ");
		if (!numsStr) throw new Error(`Invalid line: ${line}`);

		const nums = numsStr.split(",").map(toInt);

		const strExpanded = [str, str, str, str, str].join("?");
		const numsExpanded = [...nums, ...nums, ...nums, ...nums, ...nums];

		n += countWays(strExpanded, numsExpanded);
	}

	return n;
}
