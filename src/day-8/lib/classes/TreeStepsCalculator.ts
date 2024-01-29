import type { Instructions } from "../types/Instructions.ts";
import type { Nodes } from "../types/Nodes.ts";

export class TreeStepsCalculator {
	private instructions: Instructions;
	private nodes: Nodes;

	constructor(instructions: Instructions, nodes: Nodes) {
		this.instructions = instructions;
		this.nodes = nodes;
	}

	calculate() {
		const startingNodes: string[] = Object.keys(this.nodes).filter(
			([, , endLetter]) => endLetter === "A",
		);

		const cycles = startingNodes.map((startingNode) =>
			this.getSteps({
				startingNode,
				endingCondition: (node) => node[2] === "Z",
			}),
		);

		return this.lcm(cycles);
	}

	private getSteps({
		startingNode,
		endingCondition,
	}: {
		startingNode: string;
		endingCondition: (node: string) => boolean;
	}) {
		const getNextInstruction = this.createInstructionIterator();

		let stepsCount = 0;
		let currentNode = startingNode;
		let currentInstruction: "L" | "R" | undefined;

		while (!endingCondition(currentNode)) {
			currentInstruction = getNextInstruction();
			if (!currentInstruction) throw new Error("Invalid instruction");

			const node = this.nodes[currentNode];
			if (!node) throw new Error("Invalid node");

			currentNode = node[currentInstruction];
			stepsCount++;
		}

		return stepsCount;
	}

	private createInstructionIterator() {
		let currentIndex = 0;

		return () => this.instructions[currentIndex++ % this.instructions.length];
	}

	private lcm(arr: number[]): number {
		return arr.reduce((acc, n) => (acc * n) / this.gcd(acc, n));
	}

	private gcd(a: number, b: number): number {
		return b === 0 ? a : this.gcd(b, a % b);
	}
}
