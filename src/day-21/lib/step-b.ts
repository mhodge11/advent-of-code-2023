const STEPS: number = 26501365;
const DIM: number = 131;

let virginMap: Uint8Array = new Uint8Array(0);

let homeY: number = 0;
let homeX: number = 0;

enum PlotKind {
	FREE = 0,
	ROCK = 1,
}

export function run(input: Array<string>) {
	init(input);

	const squareA = walkAndCount(homeY, homeX, 129);
	const squareB = walkAndCount(homeY, homeX, 130);

	const smallTriangleA = walkAndCount(0, 0, 64);
	const smallTriangleB = walkAndCount(0, 130, 64);
	const smallTriangleC = walkAndCount(130, 0, 64);
	const smallTriangleD = walkAndCount(130, 130, 64);

	const bigTriangleA = walkAndCount(0, 0, 195);
	const bigTriangleB = walkAndCount(0, 130, 195);
	const bigTriangleC = walkAndCount(130, 0, 195);
	const bigTriangleD = walkAndCount(130, 130, 195);

	const tailA = walkAndCount(0, 65, 130);
	const tailB = walkAndCount(65, 0, 130);
	const tailC = walkAndCount(65, 130, 130);
	const tailD = walkAndCount(130, 65, 130);

	const branch = Math.floor(STEPS / DIM);

	let numSquaresA = 1;
	let numSquaresB = 0;
	let amount = 0;

	for (let i = 0; i < branch; i++) {
		if (i % 2 === 0) numSquaresA += amount;
		else numSquaresB += amount;

		amount += 4;
	}

	const rectangles = numSquaresA * squareA + numSquaresB * squareB;
	const bigTriangles =
		bigTriangleA + bigTriangleB + bigTriangleC + bigTriangleD;
	const smallTriangles =
		smallTriangleA + smallTriangleB + smallTriangleC + smallTriangleD;
	const tails = tailA + tailB + tailC + tailD;

	return (
		rectangles + (branch - 1) * bigTriangles + branch * smallTriangles + tails
	);
}

function init(input: Array<string>): void {
	virginMap = new Uint8Array(DIM * DIM);

	for (let y = 0; y < DIM; y++)
		for (let x = 0; x < DIM; x++) {
			const i = y * DIM + x;

			if (input[y]?.[x] === "#") {
				virginMap[i] = PlotKind.ROCK;
				continue;
			}

			if (input[y]?.[x] === "S") {
				homeY = y;
				homeX = x;
			}
		}
}

function cloneVirginMap(): Uint8Array {
	const clone = new Uint8Array(DIM * DIM);
	for (let i = 0; i < clone.length; i++) clone[i] = virginMap[i] as number;
	return clone;
}

function walkAndCount(startY: number, startX: number, maxStep: number): number {
	const map = walk(startY, startX, maxStep);
	return countPlots(map);
}

function walk(startY: number, startX: number, maxStep: number): Uint8Array {
	let target = 2;
	let future = 3;

	const map = cloneVirginMap();
	const i = startY * DIM + startX;

	map[i] = target;

	let n = 0;
	while (true) {
		n++;

		if (n % 2 === 0) {
			target = 3;
			future = 2;
		} else {
			target = 2;
			future = 3;
		}

		for (let y = 0; y < DIM; y++)
			for (let x = 0; x < DIM; x++) {
				const j = y * DIM + x;

				if (map[j] !== target) continue;

				map[j] = PlotKind.FREE;

				tryWalk(map, y - 1, x, future);
				tryWalk(map, y + 1, x, future);
				tryWalk(map, y, x - 1, future);
				tryWalk(map, y, x + 1, future);
			}

		if (n === maxStep) return map;
	}
}

function tryWalk(map: Uint8Array, y: number, x: number, future: number): void {
	if (y < 0) return;
	if (x < 0) return;
	if (y > DIM - 1) return;
	if (x > DIM - 1) return;

	const i = y * DIM + x;

	if (map[i] === PlotKind.ROCK) return;

	map[i] = future;
}

function countPlots(map: Uint8Array): number {
	let n = 0;

	for (let y = 0; y < DIM; y++)
		for (let x = 0; x < DIM; x++) {
			const i = y * DIM + x;

			if (map[i] === PlotKind.FREE) continue;
			if (map[i] === PlotKind.ROCK) continue;

			n++;
		}

	return n;
}
