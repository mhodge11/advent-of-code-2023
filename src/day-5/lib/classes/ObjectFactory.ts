import type { MapObject } from "../types/MapObject.ts";
import type { RangeObject } from "../types/RangeObject.ts";

import { toInt } from "@helpers/toInt.ts";

export class ObjectFactory {
	private array: string[];

	constructor(array: string[]) {
		this.array = array;
	}

	createObject(): MapObject {
		if (!this.array[0]) throw new Error("Invalid array");

		const object: MapObject = {
			name: this.array[0],
			ranges: [],
		};

		for (const line of this.array) {
			const [destination, source, range] = line.split(" ");
			if (!destination || !source || !range) throw new Error("Invalid line");

			const rangeObject: RangeObject = {
				source: toInt(source),
				destination: toInt(destination),
				range: toInt(range),
			};

			object.ranges.push(rangeObject);
		}

		return object;
	}
}
