import { toInt } from "helpers/toInt.ts";

interface Xmas {
	x: number;
	m: number;
	a: number;
	s: number;
}

type Operator = "<" | ">" | "";

interface Condition {
	operator: Operator;
	varname: Operator extends "" ? "" : keyof Xmas;
	operand: number;
	destination: string;
}

interface Workflows {
	[name: string]: Array<Condition>;
}

const xmases: Array<Xmas> = [];

const workflows: Workflows = {};

const accepted: Array<Xmas> = [];

export function run(data: string) {
	init(data);

	for (const xmas of xmases) processXmas(xmas);

	return accepted.reduce((acc, { x, m, a, s }) => acc + x + m + a + s, 0);
}

function init(data: string): void {
	const parts = data.split("\n\n");

	const xmasLines = parts.pop()?.split("\n");
	if (!xmasLines) throw new Error("No Xmas lines found");

	initXmases(xmasLines);

	const wfLines = parts.pop()?.split("\n");
	if (!wfLines) throw new Error("No Workflow lines found");

	initWorflows(wfLines);
}

function initXmases(xmasLines: Array<string>): void {
	for (const line of xmasLines) {
		const tokens = line.trim().replace("{", "").replace("}", "").split(",");

		const x = tokens.shift()?.substring(2);
		if (!x) throw new Error("No X found");

		const m = tokens.shift()?.substring(2);
		if (!m) throw new Error("No M found");

		const a = tokens.shift()?.substring(2);
		if (!a) throw new Error("No A found");

		const s = tokens.shift()?.substring(2);
		if (!s) throw new Error("No S found");

		xmases.push({ x: toInt(x), m: toInt(m), a: toInt(a), s: toInt(s) });
	}
}

function initWorflows(wfLines: Array<string>): void {
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

function parseCondition(rawCondition: string) {
	const operator = rawCondition[1] as string;
	if (operator !== "<" && operator !== ">")
		return createCondition("", 0, rawCondition);

	const operand = toInt(rawCondition.substring(2));
	const varname = rawCondition[0] as keyof Xmas;
	const destination = rawCondition.split(":").pop() as string;

	return createCondition(operator, operand, destination, varname);
}

function createCondition(
	operator: Operator,
	operand: number,
	destination: string,
	varname = "" as keyof Xmas,
): Condition {
	return { operator, varname, operand, destination };
}

function processXmas(xmas: Xmas): void {
	processWorkflow(xmas, "in");
}

function processWorkflow(xmas: Xmas, name: string): boolean {
	const conditions = workflows[name] as Array<Condition>;

	for (const condition of conditions)
		if (processCondition(xmas, condition)) return true;

	return false;
}

function processCondition(xmas: Xmas, condition: Condition): boolean {
	const { varname, operator, operand, destination } = condition;

	if (operator === "<") {
		if (xmas[varname] < operand) return go(xmas, destination);
		return false;
	}

	if (operator === ">") {
		if (xmas[varname] > operand) return go(xmas, destination);
		return false;
	}

	return go(xmas, destination);
}

function go(xmas: Xmas, destination: string) {
	if (destination === "A") {
		accepted.push(xmas);
		return true;
	}

	if (destination === "R") return true;

	return processWorkflow(xmas, destination);
}
