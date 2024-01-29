/**
 * Stores original heat losses and *BEFORE TURNING* heat loss.
 * The magic of storing only before turning data is twofold:
 *
 * 1) The path is basically made by (many) turning nodes.
 * 2) When a turn is made, it does not matter how many
 *    steps (4 to 10) the previous segment of the path had,
 *    we only need to memorize onde value per direction
 */

import { toInt } from "@helpers/toInt";

type Forbidden = "any" | "horizontal" | "vertical";

interface Point {
	row: number;
	col: number;
	forbidden: Forbidden;
}

interface Node {
	row: number;
	col: number;
	heatLoss: number;
	fromNorth: number;
	fromSouth: number;
	fromWest: number;
	fromEast: number;
}

interface Data {
	board: Array<Array<Node>>;
	height: number;
	width: number;
}

const data: Data = {
	board: [],
	height: 0,
	width: 0,
};

export function run(input: string[]) {
	init(input);

	const home = data.board[0]?.[0];
	if (!home) throw new Error("No home, something is wrong.");

	home.fromNorth = 0;
	home.fromSouth = 0;
	home.fromWest = 0;
	home.fromEast = 0;

	walk();

	const target = data.board[data.height - 1]?.[data.width - 1];
	if (!target) throw new Error("No target, something is wrong.");

	return Math.min(
		target.fromNorth,
		target.fromSouth,
		target.fromWest,
		target.fromEast,
	);
}

function init(input: string[]) {
	data.height = input.length;
	data.width = input[0]?.length ?? 0;

	if (!data.width) throw new Error("No width, something is wrong.");

	let row = -1;
	for (const line of input) {
		row++;

		const boardLine: Array<Node> = [];

		let col = -1;
		for (const char of line) {
			col++;

			const node = createNode(row, col, toInt(char));
			boardLine.push(node);
		}

		data.board.push(boardLine);
	}
}

function createNode(row: number, col: number, heatLoss: number): Node {
	return {
		row,
		col,
		heatLoss,
		fromNorth: Infinity,
		fromSouth: Infinity,
		fromWest: Infinity,
		fromEast: Infinity,
	};
}

function createPoint(row: number, col: number, forbidden: Forbidden): Point {
	return { row, col, forbidden };
}

function walk(): void {
	let futurePoints = [createPoint(0, 0, "any")];

	while (true) {
		const currentPoints = futurePoints;
		if (currentPoints.length === 0) return;

		futurePoints = [];

		for (const point of currentPoints) {
			if (point.forbidden !== "vertical") {
				walkToNorth(point.row, point.col, futurePoints);
				walkToSouth(point.row, point.col, futurePoints);
			}

			if (point.forbidden !== "horizontal") {
				walkToWest(point.row, point.col, futurePoints);
				walkToEast(point.row, point.col, futurePoints);
			}
		}
	}
}

function walkToNorth(
	baseRow: number,
	baseCol: number,
	futurePoints: Array<Point>,
): void {
	const baseNode = data.board[baseRow]?.[baseCol];
	if (!baseNode) throw new Error("No base node, something is wrong.");

	const col = baseCol;
	let h1 = Math.min(baseNode.fromWest, baseNode.fromEast);

	for (let i = 1; i <= 10; i++) {
		const row = baseRow - i;
		if (row < 0) return;

		const node = data.board[row]?.[col];
		if (!node) throw new Error("No node, something is wrong.");

		h1 += node.heatLoss;

		if (i < 4) continue;

		if (node.fromSouth <= h1) continue;

		node.fromSouth = h1;
		futurePoints.push(createPoint(row, col, "vertical"));
	}
}

function walkToSouth(
	baseRow: number,
	baseCol: number,
	futurePoints: Array<Point>,
): void {
	const baseNode = data.board[baseRow]?.[baseCol];
	if (!baseNode) throw new Error("No base node, something is wrong.");

	const col = baseCol;
	let h1 = Math.min(baseNode.fromWest, baseNode.fromEast);

	for (let i = 1; i <= 10; i++) {
		const row = baseRow + i;
		if (row > data.height - 1) return;

		const node = data.board[row]?.[col];
		if (!node) throw new Error("No node, something is wrong.");

		h1 += node.heatLoss;

		if (i < 4) continue;

		if (node.fromNorth <= h1) continue;

		node.fromNorth = h1;
		futurePoints.push(createPoint(row, col, "vertical"));
	}
}

function walkToWest(
	baseRow: number,
	baseCol: number,
	futurePoints: Array<Point>,
): void {
	const baseNode = data.board[baseRow]?.[baseCol];
	if (!baseNode) throw new Error("No base node, something is wrong.");

	const row = baseRow;
	let h1 = Math.min(baseNode.fromNorth, baseNode.fromSouth);

	for (let i = 1; i <= 10; i++) {
		const col = baseCol - i;
		if (col < 0) return;

		const node = data.board[row]?.[col];
		if (!node) throw new Error("No node, something is wrong.");

		h1 += node.heatLoss;

		if (i < 4) continue;

		if (node.fromEast <= h1) continue;

		node.fromEast = h1;
		futurePoints.push(createPoint(row, col, "horizontal"));
	}
}

function walkToEast(
	baseRow: number,
	baseCol: number,
	futurePoints: Array<Point>,
): void {
	const baseNode = data.board[baseRow]?.[baseCol];
	if (!baseNode) throw new Error("No base node, something is wrong.");

	const row = baseRow;
	let h1 = Math.min(baseNode.fromNorth, baseNode.fromSouth);

	for (let i = 1; i <= 10; i++) {
		const col = baseCol + i;
		if (col > data.width - 1) return;

		const node = data.board[row]?.[col];
		if (!node) throw new Error("No node, something is wrong.");

		h1 += node.heatLoss;

		if (i < 4) continue;

		if (node.fromWest <= h1) continue;

		node.fromWest = h1;
		futurePoints.push(createPoint(row, col, "horizontal"));
	}
}
