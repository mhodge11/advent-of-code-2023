interface Plot {
	y: number;
	x: number;
}

let map: Array<string> = [];
let futurePlots: Array<Plot> = [];

let width: number = 0;
let height: number = 0;

export function run(input: Array<string>): number {
	init(input);

	fillFuturePlotsWithHome();

	walk(64);

	return futurePlots.length;
}

function init(input: Array<string>): void {
	map = input;

	height = map.length;

	const y = map[0];
	if (!y) throw Error("No row, something is wrong.");

	width = y.length;
}

function createPlot(y: number, x: number): Plot {
	return { y, x };
}

function fillFuturePlotsWithHome(): void {
	for (let y = 0; y < height; y++)
		for (let x = 0; x < width; x++) {
			if (map[y]?.[x] !== "S") continue;

			futurePlots.push(createPlot(y, x));
			return;
		}
}

function walk(maxStep: number): void {
	let i = 0;
	while (true) {
		i++;

		const currentPlots = futurePlots;
		futurePlots = [];

		const walking = new Uint8Array(height * width);

		for (const plot of currentPlots) walkPlot(plot, walking);

		if (i === maxStep) return;
	}
}

function walkPlot({ y, x }: Plot, walking: Uint8Array): void {
	tryWalk(y - 1, x, walking);
	tryWalk(y + 1, x, walking);
	tryWalk(y, x - 1, walking);
	tryWalk(y, x + 1, walking);
}

function tryWalk(y: number, x: number, walking: Uint8Array): void {
	if (y < 0) return;
	if (x < 0) return;
	if (y > height - 1) return;
	if (x > width - 1) return;
	if (map[y]?.[x] === "#") return;

	const i = y * width + x;

	if (walking[i] !== 0) return;

	walking[i] = 1;

	futurePlots.push(createPlot(y, x));
}
