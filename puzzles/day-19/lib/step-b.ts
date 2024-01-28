import { toInt } from "helpers/toInt.ts";

type Operator = "<" | ">" | "";
type Varname<O extends Operator> = O extends "" ? "" : "x" | "m" | "a" | "s";

interface SubRange {
	low: number;
	high: number;
}

interface Range {
	x: SubRange;
	m: SubRange;
	a: SubRange;
	s: SubRange;
}

interface Condition {
	operator: Operator;
	varname: Varname<Operator>;
	operand: number;
	destination: string;
	range: Range;
}

interface Workflows {
	[name: string]: Array<Condition>;
}

const workflows: Workflows = {};

let total: number = 0;

export function run(data: string): number {
	init(data);
	walk("in", createRange());
	return total;
}

function init(data: string): void {
	const parts = data.split("\n\n");
	const wfLines = parts.shift()?.split("\n");

	if (!wfLines) throw new Error("No Workflow lines found");

	for (const wfLine of wfLines) {
		const line = wfLine.trim().replace("}", "");
		const index = wfLine.indexOf("{");
		const name = wfLine.substring(0, index);
		const rawConditions = line.substring(index + 1).split(",");

		const conditions: Array<Condition> = [];

		for (const rawCondition of rawConditions)
			conditions.push(parseCondition(rawCondition));

		workflows[name] = conditions;
	}
}

function parseCondition(rawCondition: string): Condition {
	const operator = rawCondition[1] as Operator;

	if (operator !== "<" && operator !== ">")
		return createCondition(operator, "", 0, rawCondition);

	const varname = rawCondition[0] as Varname<typeof operator>;
	const operand = toInt(rawCondition.substring(2));
	const destination = rawCondition.split(":").pop() as string;

	return createCondition(operator, varname, operand, destination);
}

function createCondition(
	operator: Operator,
	varname: Varname<typeof operator>,
	operand: number,
	destination: string,
): Condition {
	return { operator, varname, operand, destination, range: createRange() };
}

function createRange(): Range {
	return {
		x: createSubRange(),
		m: createSubRange(),
		a: createSubRange(),
		s: createSubRange(),
	};
}

function createSubRange(): SubRange {
	return { low: 1, high: 4000 };
}

function cloneRange(sourceRange: Range): Range {
	const range = createRange();

	range.x.low = sourceRange.x.low;
	range.x.high = sourceRange.x.high;

	range.m.low = sourceRange.m.low;
	range.m.high = sourceRange.m.high;

	range.a.low = sourceRange.a.low;
	range.a.high = sourceRange.a.high;

	range.s.low = sourceRange.s.low;
	range.s.high = sourceRange.s.high;

	return range;
}

function walk(name: string, range: Range): void {
	const conditions = workflows[name] as Array<Condition>;

	for (const condition of conditions) {
		processCondition(range, condition);

		range = condition.range;
	}
}

function processCondition(baseRange: Range, condition: Condition): void {
	condition.range = cloneRange(baseRange);

	const { operator, varname, operand, destination, range } = condition;
	const newRange = cloneRange(range);

	if (varname !== "")
		updateSubRanges(operator, operand, range[varname], newRange[varname]);

	if (destination === "R") return;

	if (destination === "A") {
		total += calcArrangements(newRange);
		return;
	}

	walk(destination, newRange);
}

function updateSubRanges(
	operator: Operator,
	operand: number,
	subRange: SubRange,
	newSubRange: SubRange,
): void {
	if (operator === "<") {
		newSubRange.high = operand - 1;
		subRange.low = operand;
	} else if (operator === ">") {
		newSubRange.low = operand + 1;
		subRange.high = operand;
	}
}

function calcArrangements(range: Range): number {
	return Object.keys(range).reduce((acc, key) => {
		const subRange = range[key as keyof Range];
		return acc * (subRange.high - subRange.low + 1);
	}, 1);
}
