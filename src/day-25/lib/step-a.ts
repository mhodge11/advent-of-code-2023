interface RawData {
	[parent: string]: Array<string>;
}

interface Node {
	children: Array<Node>;
	used: boolean;
	visited: boolean;
}

type Nodes = Array<Node>;

const nodes: Nodes = [];

let countGroupA: number = 1;
let countGroupB: number = 0;

export function run(input: Array<string>): number {
	const rawData = init(input);
	fillNodes(rawData);

	const master = nodes[0] as Node;

	for (const node of nodes) if (node !== master) searchParent(node, master);

	return countGroupA * countGroupB;
}

function init(input: Array<string>): RawData {
	const rawData: RawData = {};

	for (const line of input) {
		const parts = line.trim().split(": ");
		const parent = parts.shift();
		const children = parts.shift()?.split(" ");

		if (!parent || !children) throw new Error("Something is wrong.");

		rawData[parent] = children;
	}

	processRawData(rawData);

	return rawData;
}

function processRawData(rawData: RawData): void {
	for (const parent in rawData) processRawDataForParent(rawData, parent);
}

function processRawDataForParent(
	rawData: RawData,
	parent: Extract<keyof RawData, string>,
): void {
	const children = rawData[parent] as Array<string>;

	for (const child of children) {
		if (rawData[child] == null) rawData[child] = [parent];
		else if (!rawData[child]?.includes(parent)) rawData[child]?.push(parent);
	}
}

function fillNodes(rawData: RawData): void {
	const parents = Object.keys(rawData);

	for (let i = 0; i < parents.length; i++) nodes.push(createNode());

	let i = -1;

	for (const parent of parents) {
		i++;

		const node = nodes[i] as Node;
		const rawChildren = rawData[parent] as Array<string>;

		for (const rawChild of rawChildren) {
			const childIndex = parents.indexOf(rawChild);
			node.children.push(nodes[childIndex] as Node);
		}
	}
}

function createNode(): Node {
	return { children: [], used: false, visited: false };
}

function resetUsed() {
	for (const node of nodes) node.used = false;
}

function resetVisited() {
	for (const node of nodes) node.visited = false;
}

function searchParent(target: Node, master: Node): void {
	resetUsed();

	master.used = true;

	let connections = 0;

	for (const child of master.children) {
		if (connections > 3) break;

		if (child === target) {
			connections++;
			continue;
		}

		const path = searchParent2(target, child);

		if (path != null) {
			connections++;
			updateUsed(path);
		}
	}

	if (connections > 3) countGroupA++;
	else countGroupB++;
}

function updateUsed(path: Nodes): void {
	for (const node of path) node.used = true;
}

function searchParent2(target: Node, root: Node): Nodes | null {
	resetVisited();

	root.visited = true;

	const paths = [[root]];

	while (true) {
		const path = paths.shift();

		if (!path) break;

		const lastInPath = path.at(-1) as Node;

		for (const child of lastInPath.children) {
			if (target === child) return path;

			if (child.visited) continue;
			if (child.used) continue;

			child.visited = true;

			const newPath = path.slice();

			newPath.push(child);
			paths.push(newPath);
		}
	}

	return null;
}
