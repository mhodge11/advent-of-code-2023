import type { Cubes, CubesTracker } from "./types.ts";

import { toInt } from "@helpers/toInt.ts";

export function run(data: string[]): number {
	return data.reduce((total, game) => {
		const cubes = getLcdCubes(game);
		return total + getPower(cubes);
	}, 0);
}

function getLcdCubes(game: string): Cubes {
	const cubesTracker: CubesTracker = {
		blue: [],
		green: [],
		red: [],
	};

	const [_, list] = game.split(": ");
	if (!list) throw new Error(`Invalid game: ${game}`);

	const allDraws = list.split("; ");
	if (!allDraws) throw new Error(`Invalid game: ${game}`);

	for (const draws of allDraws)
		for (const draw of draws) {
			const [id, color] = draw.split(" ");
			if (!id || !color) throw new Error(`Invalid game: ${game}`);
			cubesTracker[color as "blue" | "green" | "red"].push(toInt(id));
		}

	return {
		blue: Math.max(...cubesTracker.blue),
		green: Math.max(...cubesTracker.green),
		red: Math.max(...cubesTracker.red),
	};
}

function getPower(cubes: Cubes): number {
	return Object.values(cubes).reduce((total, lcd) => {
		return total * lcd;
	}, 1);
}
