import { toInt } from "@helpers/toInt";

interface Dependents {
	[id: number]: boolean;
}

interface Brick {
	id: number;
	x1: number;
	x2: number;
	y1: number;
	y2: number;
	z1: number;
	z2: number;
	holders: Array<number>;
	mounteds: Array<number>;
}

type Level = Array<Brick>;

interface Bricks {
	[id: number]: Brick;
}

interface Levels {
	[floor: number]: Level;
}

const bricks: Bricks = {};
const levels: Levels = {};

export function run(input: Array<string>): number {
	const top = init(input);
	if (!top) throw new Error("No top, something is wrong.");

	for (let i = 1; i <= top; i++) levels[i] = [];

	placeAllBricksOnLevels();
	settleAllBricks();

	return countChainReaction();
}

function init(input: Array<string>): number {
	let top = 0;
	let id = 0;

	for (const line of input) {
		id++;

		const groups = line.trim().split("~");
		const a = groups.shift();
		const b = groups.shift();

		if (!a) throw new Error("No `a`, something is wrong.");
		if (!b) throw new Error("No `b`, something is wrong.");

		const tokensA = a.split(",");
		const tokensB = b.split(",");

		const x1Str = tokensA.shift();
		const y1Str = tokensA.shift();
		const z1Str = tokensA.shift();

		const x2Str = tokensB.shift();
		const y2Str = tokensB.shift();
		const z2Str = tokensB.shift();

		if (!x1Str) throw new Error("No `x1Str`, something is wrong.");
		if (!y1Str) throw new Error("No `y1Str`, something is wrong.");
		if (!z1Str) throw new Error("No `z1Str`, something is wrong.");
		if (!x2Str) throw new Error("No `x2Str`, something is wrong.");
		if (!y2Str) throw new Error("No `y2Str`, something is wrong.");
		if (!z2Str) throw new Error("No `z2Str`, something is wrong.");

		const x1 = toInt(x1Str);
		const y1 = toInt(y1Str);
		const z1 = toInt(z1Str);

		const x2 = toInt(x2Str);
		const y2 = toInt(y2Str);
		const z2 = toInt(z2Str);

		if (x2 < x1 || y2 < y1 || z2 < z1)
			throw new Error(
				`Invalid brick: not expecting inverted coordinates { ${x1},${y1},${z1}~${x2},${y2},${z2} }`,
			);

		const brick: Brick = {
			id,
			x1,
			x2,
			y1,
			y2,
			z1,
			z2,
			holders: [],
			mounteds: [],
		};

		bricks[id] = brick;

		if (z1 > top) top = z1;
		if (z2 > top) top = z2;
	}

	return top;
}

function placeAllBricksOnLevels(): void {
	for (const brick of Object.values(bricks)) placeBrickOnLevels(brick);
}

function placeBrickOnLevels(brick: Brick): void {
	for (let i = brick.z1; i <= brick.z2; i++) {
		const level = levels[i];
		if (!level) throw new Error("No level, something is wrong.");

		level.push(brick);
	}
}

function removeBrickFromLevels(brick: Brick): void {
	for (let i = brick.z1; i <= brick.z2; i++) {
		const level = levels[i];
		if (!level) throw new Error("No level, something is wrong.");

		const j = level.indexOf(brick);
		if (j === -1) throw new Error("No brick, something is wrong.");

		level.splice(j, 1);
	}
}

function settleAllBricks(): void {
	let i = 1;

	while (true) {
		i++;

		const level = levels[i];
		if (!level) return;

		const bricks = level.slice();
		for (const brick of bricks) settleBrick(brick, i);
	}
}

function settleBrick(masterBrick: Brick, floor: number): void {
	if (masterBrick.z1 !== floor) return;

	while (true) {
		floor -= 1;

		const level = levels[floor];
		if (!level) {
			bringBrickDown(masterBrick, 1);
			return;
		}

		for (const brick of level) {
			if (!bricksMatch(masterBrick, brick)) continue;

			masterBrick.holders.push(brick.id);
			brick.mounteds.push(masterBrick.id);
		}

		if (masterBrick.holders.length === 0) continue;

		const newFloor = floor + 1;
		if (masterBrick.z1 !== newFloor) bringBrickDown(masterBrick, newFloor);

		return;
	}
}

function bringBrickDown(brick: Brick, newFloor: number): void {
	removeBrickFromLevels(brick);

	const delta = brick.z2 - brick.z1;

	brick.z1 = newFloor;
	brick.z2 = newFloor + delta;

	placeBrickOnLevels(brick);
}

function bricksMatch(a: Brick, b: Brick): boolean {
	if (a.x1 > b.x2) return false;
	if (a.x2 < b.x1) return false;

	if (a.y1 > b.y2) return false;
	if (a.y2 < b.y1) return false;

	return true;
}

function countChainReaction(): number {
	return Object.values(bricks).reduce(
		(sum, brick) => sum + countChainReactionFor(brick),
		0,
	);
}

function countChainReactionFor(masterBrick: Brick): number {
	const dependents: Dependents = {};
	let futures = masterBrick.mounteds;

	while (futures.length !== 0) {
		const currents = futures;
		futures = [];

		for (const id of currents) {
			const brick = bricks[id];
			if (!brick) throw new Error("No brick, something is wrong.");

			if (!isDependent(masterBrick, dependents, brick)) continue;

			dependents[id] = true;

			for (const mounted of brick.mounteds) futures.push(mounted);
		}
	}

	return Object.keys(dependents).length;
}

function isDependent(
	masterBrick: Brick,
	dependents: Dependents,
	brick: Brick,
): boolean {
	for (const holder of brick.holders) {
		if (holder === masterBrick.id) continue;
		if (dependents[holder] === true) continue;
		return false;
	}

	return true;
}
