import type { Matrix } from "./types.ts";

import { calculateLoad, constructMatrix } from "./utils.ts";

export function run(input: string[]): number {
	let matrix = constructMatrix(input);
	const stored = new Map<string, number>();

	while (true) {
		runCycle(matrix);

		const key = matrix.map((row) => row.join("")).join(":");

		if (stored.has(key)) {
			if (stored.get(key) === 2) {
				break;
			}

			stored.set(key, 2);
		} else {
			stored.set(key, 1);
		}
	}

	const cycles: string[] = [];

	for (const [key, value] of stored) {
		if (value === 2) {
			cycles.push(key);
		}
	}

	const offset = stored.size - cycles.length;
	const i = (1000000000 - offset) % cycles.length;

	const cycle = cycles[i - 1];
	if (!cycle) throw new Error("Invalid cycle");

	matrix = constructMatrix(cycle.split(":"));
	return calculateLoad(matrix);
}

function runCycle(matrix: Matrix) {
	tiltNorth(matrix);
	tiltWest(matrix);
	tiltSouth(matrix);
	tiltEast(matrix);
}

function tiltNorth(matrix: Matrix) {
	const row = matrix[0];
	if (!row) throw new Error("Invalid matrix");

	for (let x = 0; x < row.length; x++) {
		let y1 = -1;

		for (let y = 0; y < matrix.length; y++) {
			const rowY = matrix[y];
			if (!rowY) throw new Error("Invalid matrix");

			const col = rowY[x];
			if (!col) throw new Error("Invalid matrix");

			if (col === "O") {
				y1++;

				if (y1 !== y) {
					const rowY1 = matrix[y1];
					if (!rowY1) throw new Error("Invalid matrix");

					rowY[x] = ".";
					rowY1[x] = "O";
				}
			} else if (col === "#") y1 = y;
		}
	}
}

function tiltWest(matrix: Matrix) {
	for (let y = 0; y < matrix.length; y++) {
		let x1 = -1;

		const row = matrix[0];
		if (!row) throw new Error("Invalid matrix");

		for (let x = 0; x < row.length; x++) {
			const rowY = matrix[y];
			if (!rowY) throw new Error("Invalid matrix");

			const col = rowY[x];
			if (!col) throw new Error("Invalid matrix");

			if (col === "O") {
				x1++;

				if (x1 !== x) {
					rowY[x] = ".";
					rowY[x1] = "O";
				}
			} else if (col === "#") x1 = x;
		}
	}
}

function tiltSouth(matrix: Matrix) {
	const row = matrix[0];
	if (!row) throw new Error("Invalid matrix");

	for (let x = 0; x < row.length; x++) {
		let y1 = matrix.length;

		for (let y = matrix.length - 1; y >= 0; y--) {
			const rowY = matrix[y];
			if (!rowY) throw new Error("Invalid matrix");

			const col = rowY[x];
			if (!col) throw new Error("Invalid matrix");

			if (col === "O") {
				y1--;

				if (y1 !== y) {
					const rowY1 = matrix[y1];
					if (!rowY1) throw new Error("Invalid matrix");

					rowY[x] = ".";
					rowY1[x] = "O";
				}
			} else if (col === "#") y1 = y;
		}
	}
}

function tiltEast(matrix: Matrix) {
	for (let y = 0; y < matrix.length; y++) {
		const row = matrix[0];
		if (!row) throw new Error("Invalid matrix");

		let x1 = row.length;

		for (let x = row.length - 1; x >= 0; x--) {
			const rowY = matrix[y];
			if (!rowY) throw new Error("Invalid matrix");

			const col = rowY[x];
			if (!col) throw new Error("Invalid matrix");

			if (col === "O") {
				x1--;

				if (x1 !== x) {
					rowY[x] = ".";
					rowY[x1] = "O";
				}
			} else if (col === "#") x1 = x;
		}
	}
}
