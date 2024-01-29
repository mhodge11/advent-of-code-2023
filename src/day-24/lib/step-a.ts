import { toInt } from "@helpers/toInt";

interface Datum {
	x: number;
	y: number;
	dx: number;
	dy: number;
	yBase: number;
}

type Data = Array<Datum>;

const data: Data = [];

const lowerLimit: number = 200000000000000;
const upperLimit: number = 400000000000000;

export function run(input: Array<string>): number {
	init(input);
	return compareAll();
}

function init(input: Array<string>): void {
	for (const line of input) {
		const parts = line.trim().split(" @ ");
		const positions = parts.shift()?.split(",");

		if (!positions) throw new Error("No positions, something is wrong.");

		const xStr = positions.shift();
		const yStr = positions.shift();

		if (!xStr) throw new Error("No xStr, something is wrong.");
		if (!yStr) throw new Error("No yStr, something is wrong.");

		const speeds = parts.shift()?.split(",");

		if (!speeds) throw new Error("No speeds, something is wrong.");

		const dxStr = speeds.shift();
		const dyStr = speeds.shift();

		if (!dxStr) throw new Error("No dxStr, something is wrong.");
		if (!dyStr) throw new Error("No dyStr, something is wrong.");

		const x = toInt(xStr);
		const y = toInt(yStr);
		const dx = toInt(dxStr);
		const dy = toInt(dyStr);

		data.push(createDatum(x, y, dx, dy));
	}
}

function createDatum(x: number, y: number, dx: number, dy: number): Datum {
	const xTimeFromZero = x / dx;
	const yBase = y - xTimeFromZero * dy;
	return { x, y, dx, dy, yBase };
}

function compareAll(): number {
	let n = 0;
	const off = data.length;

	for (let i = 0; i < off; i++)
		for (let j = i + 1; j < off; j++)
			if (match(data[i] as Datum, data[j] as Datum)) n++;

	return n;
}

function match(a: Datum, b: Datum): boolean {
	const aDeltaYPerXUnit = (a.y - a.yBase) / (a.x - 0);
	const bDeltaYPerXUnit = (b.y - b.yBase) / (b.x - 0);

	const crossedDeltaYPerXUnit = bDeltaYPerXUnit - aDeltaYPerXUnit;
	const crossedDeltaY = a.yBase - b.yBase;
	const crossedDeltaX = crossedDeltaY / crossedDeltaYPerXUnit;

	const x = crossedDeltaX - 0;
	const y = x * aDeltaYPerXUnit + a.yBase;

	if (x < lowerLimit) return false;
	if (y < lowerLimit) return false;

	if (x > upperLimit) return false;
	if (y > upperLimit) return false;

	if (a.dy > 0 && y < a.y) return false;
	if (a.dy < 0 && y > a.y) return false;

	if (b.dy > 0 && y < b.y) return false;
	if (b.dy < 0 && y > b.y) return false;

	return true;
}
