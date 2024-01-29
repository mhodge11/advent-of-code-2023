import type { Matrix } from "./types.ts";

import { calculateLoad, constructMatrix } from "./utils.ts";

export function run(input: string[]): number {
	const matrix = constructMatrix(input);
	tiltNorth(matrix);
	return calculateLoad(matrix);
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
