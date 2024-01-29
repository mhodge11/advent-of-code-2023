import { $ } from "bun";

const args = process.argv.slice(2);

async function main() {
	const [target, data] = args;

	if (!target) throw new Error("No target specified");

	const tsFile = `src/${getDayFromTarget(target)}/${target}.ts`;

	const dataFile = `src/${getDayFromTarget(target)}/${target}.${
		data === "sample" ? "sample-" : ""
	}data.txt`;

	await $`bun run ${tsFile} ${dataFile}`;
}

function getDayFromTarget(target: string) {
	const tokens = target.split("-");
	return `${tokens[0]}-${tokens[1]}`;
}

main();
