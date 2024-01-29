import { XYZ } from "@helpers/XYZ";
import { sum } from "@helpers/sum";
import { toInt } from "@helpers/toInt";

type Part = {
	value: number;
	gears: XYZ[];
};

export function run(data: string[]): number {
	const parts: Part[] = [];
	data.forEach((line, y) => findParts(line, y, parts, data));
	return sum(data.map((line, y) => sum(getGearValues(line, y, parts))));
}

function findParts(
	line: string,
	y: number,
	parts: Part[],
	data: string[],
): void {
	for (const match of line.matchAll(/\d+/g)) {
		const gears: XYZ[] = findGears(match, y, data);
		if (gears.length) parts.push({ value: toInt(match[0]), gears });
	}
}

function findGears(match: RegExpMatchArray, y: number, data: string[]): XYZ[] {
	return match[0].split("").flatMap((_, i) => {
		if (!match.index) throw new Error(`Invalid match: ${match}`);

		return new XYZ(match.index + i, y)
			.neighbors(true)
			.filter(
				(neighbor) => (data[neighbor.y]?.charAt(neighbor.x) ?? ".") === "*",
			);
	});
}

function getGearValues(line: string, y: number, parts: Part[]): number[] {
	return [...line.matchAll(/\*/g)].map((match) => {
		const matchIndex = match.index;
		if (!matchIndex) throw new Error(`Invalid match: ${match}`);

		// how many neighboring part numbers does this gear have?
		const nearPartNumbers = parts.filter((part) =>
			part.gears.some((gear) => gear.eq([matchIndex, y])),
		);

		const nearPartNumber1 = nearPartNumbers[0];
		const nearPartNumber2 = nearPartNumbers[1];

		if (!nearPartNumber1 || !nearPartNumber2)
			throw new Error(`Invalid match: ${match}`);

		return nearPartNumbers.length === 2
			? nearPartNumber1.value * nearPartNumber2.value
			: 0;
	});
}
