import {
	type Beam,
	Direction,
	data,
	createBeam,
	getTable,
	init,
	sumTables,
	walk,
} from "./utils.ts";

export function run(input: string[]): number {
	init(input);

	let best = 0;

	for (let row = 0; row < data.height; row++) {
		const fromWest = walkFrom(row, 0, Direction.east);
		if (fromWest > best) best = fromWest;

		const fromEast = walkFrom(row, data.width - 1, Direction.west);
		if (fromEast > best) best = fromEast;
	}

	for (let col = 0; col < data.width; col++) {
		const fromNorth = walkFrom(0, col, Direction.south);
		if (fromNorth > best) best = fromNorth;

		const fromSouth = walkFrom(data.height - 1, col, Direction.north);
		if (fromSouth > best) best = fromSouth;
	}

	return best;
}

function walkFrom(row: number, col: number, direction: Direction): number {
	data.tableNorth.fill(0);
	data.tableSouth.fill(0);
	data.tableWest.fill(0);
	data.tableEast.fill(0);

	const table = getTable(direction);
	const pos = row * data.width + col;

	table[pos] = 1;

	data.beams = [createBeam(row, col, direction)];

	while (data.beams.length > 0) walk(data.beams[0] as Beam);

	return sumTables();
}
