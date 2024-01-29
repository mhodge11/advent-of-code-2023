import type { MapObject } from "../types/MapObject.ts";
import type { WinConditionObject } from "../types/WinConditionObject.ts";

import { toInt } from "@helpers/toInt.ts";

export class MapObjectsCreator {
	private input: string[];

	constructor(input: string[]) {
		this.input = input;
	}

	create() {
		const times: number[] = [];
		const distances: number[] = [];

		for (const line of this.input)
			if (line.startsWith("Time:")) {
				let [, timesStr] = line.split(":");
				if (!timesStr) throw new Error("Invalid line");

				timesStr = timesStr.trim();

				for (const time of timesStr.split(" ").filter((str) => str !== ""))
					times.push(toInt(time));
			} else if (line.startsWith("Distance:")) {
				let [, distancesStr] = line.split(":");
				if (!distancesStr) throw new Error("Invalid line");
				distancesStr = distancesStr.trim();

				for (const distance of distancesStr
					.split(" ")
					.filter((str) => str !== ""))
					distances.push(toInt(distance));
			}

		return this.createMapObjects(times, distances);
	}

	createWithOneRace() {
		const regex = / /g;

		const times: number[] = [];
		const distances: number[] = [];

		for (const line of this.input)
			if (line.startsWith("Time:")) {
				let [, timesStr] = line.split(":");
				if (!timesStr) throw new Error("Invalid line");

				timesStr = timesStr.replace(regex, "");
				times.push(toInt(timesStr));
			} else if (line.startsWith("Distance:")) {
				let [, distancesStr] = line.split(":");
				if (!distancesStr) throw new Error("Invalid line");

				distancesStr = distancesStr.replace(regex, "");
				distances.push(toInt(distancesStr));
			}

		return this.createMapObjects(times, distances);
	}

	private createMapObjects(times: number[], distances: number[]) {
		const mapObjects: MapObject[] = [];

		console.log("Times:", times);
		console.log("Distances:", distances);

		for (let i = 0; i < times.length; i++) {
			const time = times[i];
			const distance = distances[i];

			if (time == null || distance == null)
				throw new Error("Invalid map object");

			const winConditions = this.findWinConditions(time, distance);
			const mapObject: MapObject = { time, distance, winConditions };

			mapObjects.push(mapObject);
		}

		return mapObjects;
	}

	private findWinConditions(time: number, distance: number) {
		const winConditions: WinConditionObject[] = [];

		for (let holdTime = 1; holdTime < time; holdTime++) {
			const timeLeft = time - holdTime;
			const travelDistance = holdTime * timeLeft;

			if (travelDistance > distance) {
				const winCondition: WinConditionObject = {
					holdTime,
					travelDistance,
				};

				winConditions.push(winCondition);
			}
		}

		return winConditions;
	}
}
