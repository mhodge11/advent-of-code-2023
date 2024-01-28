export enum Direction {
	north = 1,
	south = 2,
	west = 3,
	east = 4,
}

export interface Beam {
	row: number;
	col: number;
	direction: Direction;
}

interface Data {
	map: string[];
	beams: Beam[];
	height: number;
	width: number;
	tableNorth: Uint8Array;
	tableSouth: Uint8Array;
	tableWest: Uint8Array;
	tableEast: Uint8Array;
}

export const data: Data = {
	map: [],
	beams: [],
	height: 0,
	width: 0,
	tableNorth: new Uint8Array(0),
	tableSouth: new Uint8Array(0),
	tableWest: new Uint8Array(0),
	tableEast: new Uint8Array(0),
};

export function init(input: string[]): void {
	data.map = input;
	data.height = data.map.length;
	data.width = data.map[0]?.length ?? 0;

	if (!data.width) throw Error("No width, something is wrong.");

	data.tableNorth = new Uint8Array(data.height * data.width);
	data.tableSouth = new Uint8Array(data.height * data.width);
	data.tableWest = new Uint8Array(data.height * data.width);
	data.tableEast = new Uint8Array(data.height * data.width);
}

export function sumTables(): number {
	let sum = 0;
	const off = data.width * data.height;

	for (let i = 0; i < off; i++) {
		if (data.tableNorth[i] === 1) {
			sum++;
			continue;
		}
		if (data.tableSouth[i] === 1) {
			sum++;
			continue;
		}
		if (data.tableEast[i] === 1) {
			sum++;
			continue;
		}
		if (data.tableWest[i] === 1) sum++;
	}

	return sum;
}

export function createBeam(
	row: number,
	col: number,
	direction: Direction,
): Beam {
	return { row, col, direction };
}

export function walk(beam: Beam): void {
	updateBeamDirection(beam);

	switch (beam.direction) {
		case Direction.north:
			beam.row--;
			break;
		case Direction.south:
			beam.row++;
			break;
		case Direction.east:
			beam.col++;
			break;
		case Direction.west:
			beam.col--;
			break;
	}

	if (beam.row < 0) {
		data.beams.shift();
		return;
	}

	if (beam.col < 0) {
		data.beams.shift();
		return;
	}

	if (beam.row > data.height - 1) {
		data.beams.shift();
		return;
	}

	if (beam.col > data.width - 1) {
		data.beams.shift();
		return;
	}

	const table = getTable(beam.direction);
	const pos = beam.row * data.width + beam.col;

	if (table[pos] !== 0) {
		data.beams.shift();
		return;
	}

	table[pos] = 1;
}

export function getTable(direction: Direction): Uint8Array {
	switch (direction) {
		case Direction.north:
			return data.tableNorth;
		case Direction.south:
			return data.tableSouth;
		case Direction.east:
			return data.tableEast;
		case Direction.west:
			return data.tableWest;
	}
}

function updateBeamDirection(beam: Beam): void {
	const symbol = data.map[beam.row]?.[beam.col];

	if (!symbol) throw Error("No symbol, something is wrong.");

	if (symbol === ".") return;

	if (symbol === "\\")
		switch (beam.direction) {
			case Direction.north:
				beam.direction = Direction.west;
				return;
			case Direction.south:
				beam.direction = Direction.east;
				return;
			case Direction.east:
				beam.direction = Direction.south;
				return;
			case Direction.west:
				beam.direction = Direction.north;
				return;
		}

	if (symbol === "/")
		switch (beam.direction) {
			case Direction.north:
				beam.direction = Direction.east;
				return;
			case Direction.south:
				beam.direction = Direction.west;
				return;
			case Direction.east:
				beam.direction = Direction.north;
				return;
			case Direction.west:
				beam.direction = Direction.south;
				return;
		}

	if (symbol === "-")
		switch (beam.direction) {
			case Direction.east:
			case Direction.west:
				return;
			default:
				beam.direction = Direction.east;
				data.beams.push(createBeam(beam.row, beam.col, Direction.west));
		}

	if (symbol === "|")
		switch (beam.direction) {
			case Direction.north:
			case Direction.south:
				return;
			default:
				beam.direction = Direction.north;
				data.beams.push(createBeam(beam.row, beam.col, Direction.south));
		}
}
