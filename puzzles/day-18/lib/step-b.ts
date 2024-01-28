/**
 * Solving using shoelace formula.
 */

import { toInt } from "helpers/toInt.ts";

enum Direction {
	R = "R",
	D = "D",
	L = "L",
	U = "U",
}

interface Line {
	direction: Direction;
	amount: number;
}

const lines: Array<Line> = [];

export function run(input: string[]): number {
	init(input);
	return calcArea();
}

function init(input: string[]): void {
	for (const line of input) {
		const tokens = line.split(" ") as [string, string, string];

		tokens.shift();
		tokens.shift();

		const info = tokens.shift()?.substring(2, 8) as string;
		const amount = Number.parseInt(info.substring(0, 5), 16);
		const direction = "RDLU"[toInt(info.substring(5, 6))] as Direction;

		lines.push({ direction, amount });
	}
}

function calcArea() {
	let area = 0;
	let prevRow = 0;
	let prevCol = 0;

	for (const line of lines) {
		const { direction, amount } = line;
		let row = prevRow;
		let col = prevCol;

		switch (direction) {
			case Direction.R:
				col += amount;
				break;
			case Direction.D:
				row += amount;
				break;
			case Direction.L:
				col -= amount;
				break;
			case Direction.U:
				row -= amount;
		}

		// shoelace formula
		area += prevCol * row - prevRow * col + amount;

		prevRow = row;
		prevCol = col;
	}

	return area / 2 + 1;
}
