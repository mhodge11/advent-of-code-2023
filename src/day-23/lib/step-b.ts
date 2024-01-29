import { toInt } from "@helpers/toInt";

interface Point {
	y: number;
	x: number;
}

interface Trip {
	endIndex: number;
	distance: number;
}

interface Node {
	y: number;
	x: number;
	trips: Array<Trip>;
}

const map: Array<Array<string>> = [];
const nodes: Array<Node> = [];

let height: number = 0;
let width: number = 0;

export function run(input: Array<string>): number {
	init(input);
	createAllNodes();
	walkBetweenNodes();
	return findLengthOfLongestTravel();
}

function init(input: Array<string>) {
	for (const line of input) map.push(line.split(""));
	height = map.length;
	width = map[0]?.length ?? 0;

	if (!width) throw Error("No width, something is wrong.");

	for (let y = 0; y < height; y++)
		for (let x = 0; x < width; x++)
			if (map[y]?.[x] !== "#") (map[y] as Array<string>)[x] = ".";
}

function createPoint(y: number, x: number): Point {
	return { y, x };
}

function createAllNodes(): void {
	createAndRegisterNode(0, 1);

	for (let y = 0; y < height; y++)
		for (let x = 0; x < width; x++) tryCreateNode(y, x);

	createAndRegisterNode(height - 1, width - 2);
}

function tryCreateNode(y: number, x: number): void {
	if (map[y]?.[x] === "#") return;

	const a = isFree(y - 1, x);
	const b = isFree(y + 1, x);
	const c = isFree(y, x - 1);
	const d = isFree(y, x + 1);

	if (a + b + c + d < 3) return;

	createAndRegisterNode(y, x);
}

function isFree(y: number, x: number): number {
	if (y < 0) return 0;
	if (x < 0) return 0;
	if (y > height - 1) return 0;
	if (x > width - 1) return 0;
	if (map[y]?.[x] === "#") return 0;
	return 1;
}

function createAndRegisterNode(y: number, x: number): void {
	const node = { y, x, trips: [] };
	nodes.push(node);
	(map[y] as Array<string>)[x] = `${nodes.length - 1}`;
}

function walkBetweenNodes(): void {
	for (const node of nodes) walkFromNode(node);
}

function walkFromNode(node: Node): void {
	const { y, x } = node;

	walkFromNode2(node, y - 1, x);
	walkFromNode2(node, y + 1, x);
	walkFromNode2(node, y, x - 1);
	walkFromNode2(node, y, x + 1);
}

function walkFromNode2(node: Node, y: number, x: number): void {
	if (y < 0) return;
	if (x < 0) return;
	if (y > height - 1) return;
	if (x > width - 1) return;
	if (map[y]?.[x] === "#") return;

	walkFromNode3(node, y, x);
}

function walkFromNode3(begin: Node, y1: number, x1: number): void {
	const walked = new Uint8Array(height * width);

	const i = begin.y * width + begin.x;
	walked[i] = 1;

	const i1 = y1 * width + x1;
	walked[i1] = 1;

	const futurePoints = [createPoint(y1, x1)];
	let distance = 0;

	while (true) {
		if (futurePoints.length === 0) throw new Error("Not expecting dead end.");

		distance++;

		const currentPoint = futurePoints.shift();
		if (!currentPoint) throw new Error("No point, something is wrong.");

		const { y: currY, x: currX } = currentPoint;

		if (map[currY]?.[currX] !== ".") {
			const row = map[currY];
			if (!row) throw Error("No row, something is wrong.");

			const col = row[currX];
			if (!col) throw Error("No col, something is wrong.");

			const endIndex = toInt(col);
			begin.trips.push(createTrip(endIndex, distance));
			return;
		}

		walkFromNode4(currY - 1, currX, walked, futurePoints);
		walkFromNode4(currY + 1, currX, walked, futurePoints);
		walkFromNode4(currY, currX - 1, walked, futurePoints);
		walkFromNode4(currY, currX + 1, walked, futurePoints);
	}
}

function walkFromNode4(
	y: number,
	x: number,
	walked: Uint8Array,
	futurePoints: Array<Point>,
): void {
	if (y < 0) return;
	if (x < 0) return;
	if (y > height - 1) return;
	if (x > width - 1) return;

	const i = y * width + x;

	if (walked[i] !== 0) return;
	if (map[y]?.[x] === "#") return;

	walked[i] = 1;

	futurePoints.push(createPoint(y, x));
}

function createTrip(endIndex: number, distance: number): Trip {
	return { endIndex, distance };
}

function findLengthOfLongestTravel(): number {
	const indexOfTarget = nodes.length - 1;
	const walked = new Uint8Array(nodes.length);
	return dfs(0, indexOfTarget, walked);
}

function dfs(
	indexOfCurrentNode: number,
	indexOfTarget: number,
	walked: Uint8Array,
): number {
	if (indexOfCurrentNode === indexOfTarget) return 0;
	if (shouldAbortPath(indexOfTarget, walked)) return -Infinity;

	let best = -Infinity;

	walked[indexOfCurrentNode] = 1;

	const node = nodes[indexOfCurrentNode];
	if (!node) throw new Error("No node, something is wrong.");

	for (const trip of node.trips) {
		const indexOfNextNode = trip.endIndex;
		if (walked[indexOfNextNode] === 1) continue;

		const distance =
			trip.distance + dfs(indexOfNextNode, indexOfTarget, walked);
		best = Math.max(best, distance);
	}

	walked[indexOfCurrentNode] = 0;

	return best;
}

function shouldAbortPath(indexOfTarget: number, walked: Uint8Array): boolean {
	const target = nodes[indexOfTarget];
	if (!target) throw new Error("No target, something is wrong.");

	for (const trip of target.trips) {
		const indexOfNextNode = trip.endIndex;
		if (!walked[indexOfNextNode]) return false;
	}

	return true;
}
