import type { MapObject } from "../types/MapObject.ts";

export class NumberOfWaysToWinFinder {
	private mapObjects: MapObject[];

	constructor(mapObjects: MapObject[]) {
		this.mapObjects = mapObjects;
	}

	find() {
		return this.goThroughMapObject();
	}

	private goThroughMapObject() {
		let returnValue = 0;

		for (const { winConditions } of this.mapObjects) {
			const numberOfWinConditions = winConditions.length;

			if (returnValue === 0) returnValue = numberOfWinConditions;
			else returnValue *= numberOfWinConditions;
		}

		return returnValue;
	}
}
