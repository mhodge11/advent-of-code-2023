import type { Plan } from "../types/Plan.ts";

export class PlanFactory {
	private input: string[];

	constructor(input: string[]) {
		this.input = input;
	}

	create(): Plan {
		const plan = this.input.map((line) => line.split(""));
		this.display(plan);

		return plan;
	}

	private display(plan: Plan) {
		console.log(plan.map((x) => x.join("")).join("\n"));
	}
}
