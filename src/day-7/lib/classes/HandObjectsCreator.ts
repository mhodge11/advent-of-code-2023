import type { HandObject } from "../types/HandObject.ts";

import { toInt } from "@helpers/toInt.ts";

export class HandObjectsCreator {
	private input: string[];

	constructor(input: string[]) {
		this.input = input;
	}

	create() {
		const handObjects: HandObject[] = [];

		for (const line of this.input) {
			const [hand, bidStr] = line.trim().split(" ");
			if (!hand || !bidStr) throw new Error("Invalid line");

			const bid = toInt(bidStr);
			handObjects.push({ hand, bid });
		}

		return handObjects;
	}
}
