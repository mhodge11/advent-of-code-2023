import type { Instructions } from "../types/Instructions.ts";
import type { Nodes } from "../types/Nodes.ts";

export class TreeFactory {
	private input: string[];
	private instructions: Instructions = [];
	private nodes: Nodes = {};

	constructor(input: string[]) {
		this.input = input;
	}

	create() {
		this.createInstructions();
		this.createNodes();

		return {
			instructions: this.instructions,
			nodes: this.nodes,
		};
	}

	private createInstructions() {
		const instructionsStr = this.input.shift();
		if (!instructionsStr) throw new Error("Invalid instructions");

		this.instructions = instructionsStr.split("") as Instructions;
	}

	private createNodes() {
		const regex = /\((?<left>.+),\s+(?<right>.+)\)/;

		this.nodes = this.input.reduce((acc, line) => {
			const [nodeId, connections] = line.split("=").map((x) => x.trim());
			if (!nodeId || !connections) throw new Error("Invalid line");

			const match = connections.match(regex);
			if (!match) throw new Error("Invalid line");

			const node = match.groups;
			if (!node) throw new Error("Invalid line");

			const { left, right } = node;
			if (!left || !right) throw new Error("Invalid line");

			acc[nodeId] = { L: left, R: right };

			return acc;
		}, {} as Nodes);
	}
}
