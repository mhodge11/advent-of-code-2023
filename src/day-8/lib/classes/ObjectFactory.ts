import type { InstructionsObject } from "../types/InstructionsObject.ts";
import type { MapObject } from "../types/MapObject.ts";

export class ObjectFactory {
	private input: string[];
	private instructionsObject: InstructionsObject = {
		steps: [],
		length: 0,
		startingKey: "",
	};
	private mapObject: MapObject = {};

	constructor(input: string[]) {
		this.input = input;
	}

	create() {
		this.createInstructionsObject();
		this.createMapObjects();

		return {
			instructionsObject: this.instructionsObject,
			mapObject: this.mapObject,
		};
	}

	private createInstructionsObject() {
		const stepsStr = this.input.shift();
		if (!stepsStr) throw new Error("Invalid steps");

		const steps = stepsStr.split("");

		this.instructionsObject.steps = steps;
		this.instructionsObject.length = steps.length;
	}

	private createMapObjects() {
		this.input.forEach((item, index) => {
			const [key, values] = item.split(" = ");
			if (!key || !values) throw new Error("Invalid line");

			const [L, R] = values.slice(1, values.length - 1).split(", ");
			if (!L || !R) throw new Error("Invalid line");

			if (index === 0) this.instructionsObject.startingKey = key;

			this.mapObject[key] = { L, R };
		});
	}
}
