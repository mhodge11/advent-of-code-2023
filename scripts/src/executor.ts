import type { PuzzleExecutorSchema } from "./schema.js";

import { execSync } from "child_process";
import * as path from "path";

export async function runExecutor(options: PuzzleExecutorSchema) {
	const tsFile = path.join(
		"src",
		getDayFromTarget(options.target),
		`${options.target}.ts`,
	);
	const dataFile = path.join(
		"src",
		getDayFromTarget(options.target),
		`${options.target}.${options.data === "sample" ? "sample-" : ""}data.txt`,
	);
	execSync(`npx tsx ${tsFile} ${dataFile}`, { stdio: "inherit" });
	return { success: true };
}

function getDayFromTarget(target: string) {
	const tokens = target.split("-");
	return `${tokens[0]}-${tokens[1]}`;
}
