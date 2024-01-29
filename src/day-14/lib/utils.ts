import type { Matrix } from "./types.ts";

export function calculateLoad(matrix: Matrix): number {
	return matrix.reduce(
		(acc, row, i) =>
			acc + row.filter((char) => char === "O").length * (matrix.length - i),
		0,
	);
}

export function constructMatrix(input: string[]): Matrix {
	return input.map((line) => line.split(""));
}

export function displayMatrix(matrix: Matrix): void {
	const row = matrix[0];
	if (!row) throw new Error("Invalid matrix");

	const bookend = "-".repeat(row.length);
	console.log(bookend);
	console.log(matrix.map((row) => row.join("")).join("\n"));
	console.log(bookend);
}
