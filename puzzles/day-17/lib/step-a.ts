import { toInt } from "helpers/toInt.ts";

export enum Direction {
	north = 1,
	south = 2,
	west = 3,
	east = 4,
}

export interface Point {
	row: number;
	col: number;
}

export interface Node {
	row: number;
	col: number;
	original: number;
	fromNorth1: number;
	fromNorth2: number;
	fromNorth3: number;
	fromSouth1: number;
	fromSouth2: number;
	fromSouth3: number;
	fromWest1: number;
	fromWest2: number;
	fromWest3: number;
	fromEast1: number;
	fromEast2: number;
	fromEast3: number;
	selectedRound: number;
}

interface Data {
	board: Array<Array<Node>>;
	height: number;
	width: number;
}

export const data: Data = {
	board: [],
	height: 0,
	width: 0,
};

export function run(input: string[]): number {
	init(input);

	const home = data.board[0]?.[0];

	if (!home) throw Error("No home, something is wrong.");

	home.fromNorth1 = 0;
	home.fromNorth2 = 0;
	home.fromNorth3 = 0;
	home.fromSouth1 = 0;
	home.fromSouth2 = 0;
	home.fromSouth3 = 0;
	home.fromWest1 = 0;
	home.fromWest2 = 0;
	home.fromWest3 = 0;
	home.fromEast1 = 0;
	home.fromEast2 = 0;
	home.fromEast3 = 0;

	walk();

	const node = data.board[data.height - 1]?.[data.width - 1];
	if (!node) throw Error("No node, something is wrong.");

	return Math.min(
		node.fromNorth1,
		node.fromNorth2,
		node.fromNorth3,
		node.fromSouth1,
		node.fromSouth2,
		node.fromSouth3,
		node.fromWest1,
		node.fromWest2,
		node.fromWest3,
		node.fromEast1,
		node.fromEast2,
		node.fromEast3,
	);
}

function init(input: string[]): void {
	data.height = input.length;
	data.width = input[0]?.length ?? 0;

	if (!data.width) throw Error("No width, something is wrong.");

	let row = -1;
	for (const line of input) {
		row++;

		const nodes: Array<Node> = [];

		let col = -1;
		for (const char of line) {
			col++;

			const node = createNode(row, col, toInt(char));
			nodes.push(node);
		}

		data.board.push(nodes);
	}
}

function createPoint(row: number, col: number): Point {
	return { row, col };
}

function findDirectionFrom(
	deltaRow: number,
	deltaCol: number,
): Direction {
	switch (deltaRow) {
		case 1:
			return Direction.north;
		case -1:
			return Direction.south;
	}

	switch (deltaCol) {
		case 1:
			return Direction.west;
		case -1:
			return Direction.east;
	}

	throw Error("No direction found, something is wrong.");
}

function createNode(row: number, col: number, original: number): Node {
	return {
		row,
		col,
		original,
		fromNorth1: Infinity,
		fromNorth2: Infinity,
		fromNorth3: Infinity,
		fromSouth1: Infinity,
		fromSouth2: Infinity,
		fromSouth3: Infinity,
		fromWest1: Infinity,
		fromWest2: Infinity,
		fromWest3: Infinity,
		fromEast1: Infinity,
		fromEast2: Infinity,
		fromEast3: Infinity,
		selectedRound: 0,
	};
}

function walk(): void {
	let futurePoints = [createPoint(0, 0)];
	let walkingRound = 0;

	while (true) {
		walkingRound++;

		const currentPoints = futurePoints;
		if (currentPoints.length === 0) return;

		futurePoints = [];

		for (const point of currentPoints) {
			processNode(point, -1, 0, futurePoints, walkingRound);
			processNode(point, 1, 0, futurePoints, walkingRound);
			processNode(point, 0, -1, futurePoints, walkingRound);
			processNode(point, 0, 1, futurePoints, walkingRound);
		}
	}
}

function processNode(
	point: Point,
	deltaRow: number,
	deltaCol: number,
	futurePoints: Array<Point>,
	walkingRound: number,
): void {
	const row = point.row + deltaRow;
	const col = point.col + deltaCol;

	if (row < 0) return;
	if (col < 0) return;

	if (row > data.height - 1) return;
	if (col > data.width - 1) return;

	const prevNode = data.board[point.row]?.[point.col];
	if (!prevNode) throw Error("No prev, something is wrong.");

	const node = data.board[row]?.[col];
	if (!node) throw Error("No node, something is wrong.");

	const direction = findDirectionFrom(deltaRow, deltaCol);

	switch (direction) {
		case Direction.north:
			handleFromNorth(node, prevNode, futurePoints, walkingRound);
			return;
		case Direction.south:
			handleFromSouth(node, prevNode, futurePoints, walkingRound);
			return;
		case Direction.west:
			handleFromWest(node, prevNode, futurePoints, walkingRound);
			return;
		case Direction.east:
			handleFromEast(node, prevNode, futurePoints, walkingRound);
	}
}

function handleFromNorth(
	node: Node,
	prevNode: Node,
	futurePoints: Array<Point>,
	walkingRound: number,
): void {
	const h1 = node.original;
	let changed = false;

	const best = Math.min(
		prevNode.fromWest1,
		prevNode.fromWest2,
		prevNode.fromWest3,
		prevNode.fromEast1,
		prevNode.fromEast2,
		prevNode.fromEast3,
	);

	if (h1 + best < node.fromNorth1) {
		node.fromNorth1 = h1 + best;
		changed = true;
	}

	if (h1 + prevNode.fromNorth1 < node.fromNorth2) {
		node.fromNorth2 = h1 + prevNode.fromNorth1;
		changed = true;
	}

	if (h1 + prevNode.fromNorth2 < node.fromNorth3) {
		node.fromNorth3 = h1 + prevNode.fromNorth2;
		changed = true;
	}

	pushToFuturePoints(futurePoints, walkingRound, node, changed);
}

function handleFromSouth(
	node: Node,
	prevNode: Node,
	futurePoints: Array<Point>,
	walkingRound: number,
): void {
	const h1 = node.original;
	let changed = false;

	const best = Math.min(
		prevNode.fromWest1,
		prevNode.fromWest2,
		prevNode.fromWest3,
		prevNode.fromEast1,
		prevNode.fromEast2,
		prevNode.fromEast3,
	);

	if (h1 + best < node.fromSouth1) {
		node.fromSouth1 = h1 + best;
		changed = true;
	}

	if (h1 + prevNode.fromSouth1 < node.fromSouth2) {
		node.fromSouth2 = h1 + prevNode.fromSouth1;
		changed = true;
	}

	if (h1 + prevNode.fromSouth2 < node.fromSouth3) {
		node.fromSouth3 = h1 + prevNode.fromSouth2;
		changed = true;
	}

	pushToFuturePoints(futurePoints, walkingRound, node, changed);
}

function handleFromWest(
	node: Node,
	prevNode: Node,
	futurePoints: Array<Point>,
	walkingRound: number,
): void {
	const h1 = node.original;
	let changed = false;

	const best = Math.min(
		prevNode.fromNorth1,
		prevNode.fromNorth2,
		prevNode.fromNorth3,
		prevNode.fromSouth1,
		prevNode.fromSouth2,
		prevNode.fromSouth3,
	);

	if (h1 + best < node.fromWest1) {
		node.fromWest1 = h1 + best;
		changed = true;
	}

	if (h1 + prevNode.fromWest1 < node.fromWest2) {
		node.fromWest2 = h1 + prevNode.fromWest1;
		changed = true;
	}

	if (h1 + prevNode.fromWest2 < node.fromWest3) {
		node.fromWest3 = h1 + prevNode.fromWest2;
		changed = true;
	}

	pushToFuturePoints(futurePoints, walkingRound, node, changed);
}

function handleFromEast(
	node: Node,
	prevNode: Node,
	futurePoints: Array<Point>,
	walkingRound: number,
): void {
	const h1 = node.original;
	let changed = false;

	const best = Math.min(
		prevNode.fromNorth1,
		prevNode.fromNorth2,
		prevNode.fromNorth3,
		prevNode.fromSouth1,
		prevNode.fromSouth2,
		prevNode.fromSouth3,
	);

	if (h1 + best < node.fromEast1) {
		node.fromEast1 = h1 + best;
		changed = true;
	}

	if (h1 + prevNode.fromEast1 < node.fromEast2) {
		node.fromEast2 = h1 + prevNode.fromEast1;
		changed = true;
	}

	if (h1 + prevNode.fromEast2 < node.fromEast3) {
		node.fromEast3 = h1 + prevNode.fromEast2;
		changed = true;
	}

	pushToFuturePoints(futurePoints, walkingRound, node, changed);
}

function pushToFuturePoints(
	futurePoints: Array<Point>,
	walkingRound: number,
	node: Node,
	changed: boolean,
): void {
	if (!changed) return;
	if (node.selectedRound === walkingRound) return;

	node.selectedRound = walkingRound;
	futurePoints.push(createPoint(node.row, node.col));
}
