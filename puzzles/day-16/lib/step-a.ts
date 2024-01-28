import {
	type Beam,
	Direction,
	data,
	createBeam,
	init,
	sumTables,
	walk,
} from "./utils.ts";

data.beams = [createBeam(0, 0, Direction.east)];

export function run(input: string[]): number {
	init(input);

	data.tableEast[0] = 1;

	while (data.beams.length > 0) walk(data.beams[0] as Beam);

	return sumTables();
}
