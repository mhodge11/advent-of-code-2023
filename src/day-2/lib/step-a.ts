import type { Cubes } from "./types.ts";

import { toInt } from "@helpers/toInt.ts";

export function run(data: string[]): number {
	return data.reduce((total, game, i) => {
		if (isValidGame(game)) total += i + 1;
		return total;
	}, 0);
}

function isValidGame(game: string): boolean {
	const [_, list] = game.split(": ");
	if (!list) throw new Error(`Invalid game: ${game}`);

	const allDraws = list.split("; ");
	if (!allDraws) throw new Error(`Invalid game: ${game}`);

	return !allDraws.some((draws) => {
		return draws.split(", ").some((draw) => {
			const [id, color] = draw.split(" ");
			if (!id || !color) throw new Error(`Invalid game: ${game}`);
			return toInt(id) > cubes[color as "blue" | "green" | "red"];
		});
	});
}

const cubes: Cubes = {
	red: 12,
	green: 13,
	blue: 14,
};
