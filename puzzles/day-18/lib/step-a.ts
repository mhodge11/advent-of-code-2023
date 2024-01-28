import { toInt } from "helpers/toInt.ts";

enum Direction {
	U = "U",
	D = "D",
	L = "L",
	R = "R",
}

interface Point {
	row: number;
	col: number;
}

interface Line {
	direction: Direction;
	amount: number;
}

interface Dict {
	[key: `${number},${number}`]: boolean;
}

interface Data {
	dict: Dict;
	map: Array<Array<string>>;
	height: number;
	width: number;
	row: number;
	col: number;
	smallestRow: number;
	smallestCol: number;
	biggestRow: number;
	biggestCol: number;
}

const lines: Array<Line> = [];

const data: Data = {
	dict: {},
	map: [],
	height: 0,
	width: 0,
	row: 0,
	col: 0,
	smallestRow: 0,
	smallestCol: 0,
	biggestRow: 0,
	biggestCol: 0,
};

export function run(input: string[]): number {
	init(input);

	digAll();
	setMap();
	rawFloodOutside();
	floodPuddles();

	return countTrenches();
}

function init(input: string[]) {
	for (const line of input) {
		const tokens = line.split(" ") as [Direction, `${number}`, ...unknown[]];
		const [direction, amount] = tokens;
		lines.push({ direction, amount: toInt(amount) });
	}
}

function createPoint(row: number, col: number): Point {
	return { row, col };
}

function digAll(): void {
	for (const line of lines) dig(line);

	data.width = data.biggestCol - data.smallestCol + 1;
	data.height = data.biggestRow - data.smallestRow + 1;
}

function dig(line: Line): void {
	for (let i = 0; i < line.amount; i++) {
		switch (line.direction) {
			case Direction.U:
				data.row--;
				break;
			case Direction.D:
				data.row++;
				break;
			case Direction.L:
				data.col--;
				break;
			case Direction.R:
				data.col++;
				break;
		}

		data.dict[`${data.row},${data.col}`] = true;

		if (data.row < data.smallestRow) data.smallestRow = data.row;
		if (data.col < data.smallestCol) data.smallestCol = data.col;

		if (data.row > data.biggestRow) data.biggestRow = data.row;
		if (data.col > data.biggestCol) data.biggestCol = data.col;
	}
}

function setMap(): void {
	for (let i = 0; i < data.height; i++)
		data.map.push(new Array(data.width).fill("."));

	for (const key in data.dict) {
		const [rawRow, rawCol] = key.split(",") as [`${number}`, `${number}`];
		const row = toInt(rawRow) - data.smallestRow;
		const col = toInt(rawCol) - data.smallestCol;

		const mapRow = data.map[row];
		if (!mapRow) throw new Error("No map row, something is wrong.");

		mapRow[col] = "#";
	}
}

function rawFloodOutside(): void {
	for (let row = 0; row < data.height; row++) {
		floodBorderPoint(row, 0, 0, 1);
		floodBorderPoint(row, data.width - 1, 0, -1);
	}

	for (let col = 0; col < data.width; col++) {
		floodBorderPoint(0, col, 1, 0);
		floodBorderPoint(data.height - 1, col, -1, 0);
	}
}

function floodBorderPoint(
	baseRow: number,
	baseCol: number,
	deltaRow: number,
	deltaCol: number,
): void {
	let row = baseRow;
	let col = baseCol;

	while (true) {
		if (row < 0) return;
		if (col < 0) return;
		if (row > data.height + 1) return;
		if (col > data.width + 1) return;
		if (data.map[row]?.[col] === "#") return;

		const mapRow = data.map[row];
		if (!mapRow) throw new Error("No map row, something is wrong.");

		mapRow[col] = "@";

		row += deltaRow;
		col += deltaCol;
	}
}

function floodPuddles(): void {
	for (let row = 0; row < data.height; row++)
		for (let col = 0; col < data.width; col++)
			if (isPuddle(row, col)) floodPuddle(row, col);
}

function isPuddle(row: number, col: number): boolean {
	if (data.map[row]?.[col] !== ".") return false;

	if (isOutsider(row, col - 1)) return true;
	if (isOutsider(row, col + 1)) return true;
	if (isOutsider(row - 1, col)) return true;
	if (isOutsider(row + 1, col)) return true;

	return false;
}

function isOutsider(row: number, col: number): boolean {
	if (row < 0) return false;
	if (col < 0) return false;
	if (row > data.height + 1) return false;
	if (col > data.width + 1) return false;
	return data.map[row]?.[col] === "@";
}

function floodPuddle(row: number, col: number): void {
	const mapRow = data.map[row];
	if (!mapRow) throw new Error("No map row, something is wrong.");

	mapRow[col] = "@";

	let futurePoints = [createPoint(row, col)];

	const processPoint = (
		point: Point,
		deltaRow: number,
		deltaCol: number,
	): void => {
		const row = point.row + deltaRow;
		const col = point.col + deltaCol;

		if (row < 0) return;
		if (col < 0) return;
		if (row > data.height + 1) return;
		if (col > data.width + 1) return;

		if (data.map[row]?.[col] !== ".") return;

		const mapRow = data.map[row];
		if (!mapRow) throw new Error("No map row, something is wrong.");

		mapRow[col] = "@";

		futurePoints.push(createPoint(row, col));
	};

	while (futurePoints.length !== 0) {
		const currentPoints = futurePoints;
		futurePoints = [];

		for (const point of currentPoints) {
			processPoint(point, 0, -1);
			processPoint(point, 0, 1);
			processPoint(point, -1, 1);
			processPoint(point, 1, 1);
		}
	}
}

function countTrenches(): number {
	let count = 0;

	for (let row = 0; row < data.height; row++)
		for (let col = 0; col < data.width; col++)
			if (data.map[row]?.[col] !== "@") count++;

	return count;
}
