enum Direction {
	N = "N",
	S = "S",
	W = "W",
	E = "E",
}

interface Node {
	y: number;
	x: number;
}

interface Nodes {
	[id: `${number}~${number}`]: Node;
}

interface Path {
	begin: Node;
	end: Node | null;
	length: number;
}

interface Paths {
	[id: `${number}~${number}`]: Array<Path>;
}

interface Travel {
	visited: Array<`${number}~${number}`>;
	distance: number;
}

let map: Array<string> = [];
let height = 0;
let width = 0;

const nodes: Nodes = {};
const paths: Paths = {};

export function run(input: Array<string>): number {
	init(input);
	createAllNodes();
	walkPathsBetweenNodes();
	return findLengthOfLongestTravel();
}

function init(input: Array<string>) {
	map = input;
	height = map.length;
	width = map[0]?.length ?? 0;

	if (!width) throw Error("No width, something is wrong.");
}

function createNode(y: number, x: number): Node {
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

	const a = isFreeOrValve(y - 1, x);
	const b = isFreeOrValve(y + 1, x);
	const c = isFreeOrValve(y, x - 1);
	const d = isFreeOrValve(y, x + 1);

	if (a + b + c + d < 3) return;

	createAndRegisterNode(y, x);
}

function isFreeOrValve(y: number, x: number): number {
	if (y < 0) return 0;
	if (x < 0) return 0;
	if (y > height - 1) return 0;
	if (x > width - 1) return 0;
	if (map[y]?.[x] === "#") return 0;
	return 1;
}

function createAndRegisterNode(y: number, x: number): void {
	const node = createNode(y, x);
	nodes[`${y}~${x}`] = node;
}

function walkPathsBetweenNodes(): void {
	for (const node of Object.values(nodes)) walkPathsFromNode(node);
}

function walkPathsFromNode(node: Node): void {
	const { y, x } = node;

	walkPathFromNode(node, y - 1, x, Direction.N);
	walkPathFromNode(node, y + 1, x, Direction.S);
	walkPathFromNode(node, y, x - 1, Direction.W);
	walkPathFromNode(node, y, x + 1, Direction.E);
}

function walkPathFromNode(
	node: Node,
	y: number,
	x: number,
	direction: Direction,
): void {
	if (y < 0) return;
	if (x < 0) return;
	if (y > height - 1) return;
	if (x > width - 1) return;

	const symbol = map[y]?.[x];
	if (!symbol) throw new Error("No symbol, something is wrong.");

	if (symbol === "#") return;
	if (symbol === "v" && direction === Direction.N) return;
	if (symbol === ">" && direction === Direction.W) return;
	if (symbol === "<" && direction === Direction.E) return;

	walkPathFromNode2(node, y, x);
}

function walkPathFromNode2(begin: Node, y: number, x: number): void {
	const walked = new Uint8Array(width * height);
	const i = begin.y * width + begin.x;

	walked[i] = 2;

	const futurePoints = [createNode(y, x)];
	let length = 0;

	while (true) {
		if (futurePoints.length === 0) {
			createAndRegisterPath(begin, null, length);
			return;
		}

		length++;

		const currentPoint = futurePoints.shift();
		if (!currentPoint) throw new Error("No point, something is wrong.");

		const { y: currY, x: currX } = currentPoint;
		const i = currY * width + currX;

		walked[i] = 1;

		const end = nodes[`${currY}~${currX}`];

		if (end) {
			createAndRegisterPath(begin, end, length);
			return;
		}

		walkPoint(currY - 1, currX, Direction.N, walked, futurePoints);
		walkPoint(currY + 1, currX, Direction.S, walked, futurePoints);
		walkPoint(currY, currX - 1, Direction.W, walked, futurePoints);
		walkPoint(currY, currX + 1, Direction.E, walked, futurePoints);
	}
}

function walkPoint(
	y: number,
	x: number,
	direction: Direction,
	walked: Uint8Array,
	futurePoints: Array<Node>,
): void {
	if (y < 0) return;
	if (x < 0) return;
	if (y > height - 1) return;
	if (x > width - 1) return;

	const i = y * width + x;
	if (walked[i] !== 0) return;

	const symbol = map[y]?.[x];
	if (!symbol) throw new Error("No symbol, something is wrong.");

	if (symbol === "#") return;
	if (symbol === "v" && direction === Direction.N) return;
	if (symbol === ">" && direction === Direction.W) return;
	if (symbol === "<" && direction === Direction.E) return;

	walked[i] = 1;

	futurePoints.push(createNode(y, x));
}

function createAndRegisterPath(
	begin: Node,
	end: Node | null,
	length: number,
): void {
	const path = { begin, end, length };
	const id = `${begin.y}~${begin.x}` as `${number}~${number}`;

	if (!paths[id]) paths[id] = [path];
	else (paths[id] as Array<Path>).push(path);
}

function findLengthOfLongestTravel(): number {
	let best = 0;
	const exit: `${number}~${number}` = `${height - 1}~${width - 2}`;
	const currentTravels = [createTravel(["0~1"], 0)];

	while (true) {
		const currentTravel = currentTravels.pop();
		if (!currentTravel) break;

		const lastVisited = currentTravel.visited.at(-1);
		if (!lastVisited) throw new Error("No last, something is wrong.");

		const p = paths[lastVisited];
		if (!p) throw new Error("No paths, something is wrong.");

		for (const path of p) {
			if (path.end == null) continue;

			const endId = `${path.end.y}~${path.end.x}` as `${number}~${number}`;
			const distance = currentTravel.distance + path.length;
			const visited = currentTravel.visited.slice();

			if (visited.includes(endId)) continue;

			visited.push(endId);

			const travel = createTravel(visited, distance);

			if (endId !== exit) {
				currentTravels.push(travel);
				continue;
			}

			if (travel.distance > best) best = travel.distance;
		}
	}

	return best;
}

function createTravel(
	visited: Array<`${number}~${number}`>,
	distance: number,
): Travel {
	return { visited, distance };
}
