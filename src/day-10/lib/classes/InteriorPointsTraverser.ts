/**
 * Pick's theorem (https://en.wikipedia.org/wiki/Pick%27s_theorem)
 * loopArea = interiorPointsCount + (boundaryPointsCount / 2) - 1
 *
 * Part 2 answer is interiorPointsCount
 * transforming Pick's formula:
 * interiorPointsCount = loopArea - (boundaryPointsCount / 2) + 1
 *
 * boundaryPointsCount is length of loop (practically part1 answer * 2)
 *
 * loopArea can by calculated using Shoelace formula (https://en.wikipedia.org/wiki/Shoelace_formula):
 * vertices = (x1, y1) (x2, y2) (x3, y3) ...
 * 2 * loopArea = x1 * y2 - y1 * x2 + x2 * y3 - x3 * y2 + ...
 * loopArea = result / 2
 */

import type { Direction } from "../types/Direction.ts";
import type { LoopData } from "../types/LoopData.ts";
import type { Plan } from "../types/Plan.ts";
import type { Point } from "../types/Point.ts";
import type { Position } from "../types/Position.ts";

export class InteriorPointsTraverser {
	private plan: Plan;

	constructor(plan: Plan) {
		this.plan = plan;
	}

	traverse(): number {
		// boundaryPointsCount == part1Answer * 2
		const { vertices, boundaryPointsCount } = this.getLoopData();
		const loopArea = this.getAreaUsingShoelaceFormula(vertices);

		// interiorPointsCount
		return loopArea - boundaryPointsCount / 2 + 1;
	}

	private getLoopData(): LoopData {
		const startingPoint = this.getStartingPoint();
		const vertices: Point[] = [startingPoint];

		let boundaryPointsCount = 1;
		let currentPosition = this.getStartingPositions(startingPoint)[0];
		if (!currentPosition)
			throw new Error(`Invalid starting point: ${startingPoint}`);

		while (!this.areEqual(currentPosition.point, startingPoint)) {
			const val = this.getVal(currentPosition.point);

			if (["F", "7", "L", "J"].includes(val))
				vertices.push(currentPosition.point);

			currentPosition = this.getNextPosition(val, currentPosition);
			boundaryPointsCount++;
		}

		return { vertices, boundaryPointsCount };
	}

	private getAreaUsingShoelaceFormula(vertices: Point[]): number {
		let area = 0;

		for (let i = 0; i < vertices.length; i++) {
			const nextIndex = (i + 1) % vertices.length;

			const vertex = vertices[i];
			if (!vertex) throw new Error(`Invalid vertex: ${vertex}`);

			const [currentY, currentX] = vertex;

			const nextVertex = vertices[nextIndex];
			if (!nextVertex) throw new Error(`Invalid next vertex: ${nextVertex}`);

			const [nextY, nextX] = nextVertex;

			area += currentX * nextY - currentY * nextX;
		}

		area = Math.abs(area) / 2;

		return area;
	}

	private getStartingPoint(): [number, number] {
		for (let y = 0; y < this.plan.length; y++) {
			const row = this.plan[y];
			if (!row) throw new Error(`Invalid y: ${y}`);

			for (let x = 0; x < row.length; x++) {
				const col = row[x];
				if (!col) throw new Error(`Invalid x: ${x}`);

				if (col === "S") return [y, x];
			}
		}

		throw new Error("Starting point not found");
	}

	private getStartingPositions(startingPoint: Point): Position[] {
		const positions: Position[] = [];
		const topPoint = this.top(startingPoint);
		const bottomPoint = this.down(startingPoint);
		const rightPoint = this.right(startingPoint);
		const leftPoint = this.left(startingPoint);

		if (
			startingPoint[0] > 0 &&
			["|", "F", "7"].includes(this.getVal(topPoint))
		) {
			positions.push({
				direction: "top",
				point: topPoint,
			});
		}

		if (
			startingPoint[0] <= this.plan.length - 1 &&
			["|", "L", "J"].includes(this.getVal(bottomPoint))
		) {
			positions.push({
				direction: "down",
				point: bottomPoint,
			});
		}

		const row = this.plan[0];
		if (!row) throw new Error(`Invalid row: ${row}`);

		if (
			startingPoint[1] <= row.length - 1 &&
			["-", "7", "J"].includes(this.getVal(rightPoint))
		) {
			positions.push({
				direction: "right",
				point: rightPoint,
			});
		}

		if (
			startingPoint[1] > 0 &&
			["-", "F", "L"].includes(this.getVal(leftPoint))
		) {
			positions.push({
				direction: "left",
				point: leftPoint,
			});
		}

		return positions;
	}

	private getNextPosition(val: string, position: Position): Position {
		const { direction, point } = position;

		if (["-", "|"].includes(val)) {
			return this.newPosition(direction, point);
		}

		if (direction === "top") {
			if (val === "F") {
				return this.newPosition("right", point);
			}
			if (val === "7") {
				return this.newPosition("left", point);
			}
		}

		if (direction === "down") {
			if (val === "L") {
				return this.newPosition("right", point);
			}
			if (val === "J") {
				return this.newPosition("left", point);
			}
		}

		if (direction === "right") {
			if (val === "J") {
				return this.newPosition("top", point);
			}
			if (val === "7") {
				return this.newPosition("down", point);
			}
		}

		if (direction === "left") {
			if (val === "F") {
				return this.newPosition("down", point);
			}
			if (val === "L") {
				return this.newPosition("top", point);
			}
		}

		throw `unhandled next position (direction: ${direction}, val: ${val})`;
	}

	private getVal([y, x]: Point): string {
		const row = this.plan[y];
		if (!row) throw new Error(`Invalid y: ${y}`);

		const col = row[x];
		if (!col) throw new Error(`Invalid x: ${x}`);

		return col;
	}

	private newPosition(direction: Direction, point: Point): Position {
		return {
			direction,
			point: this.pointByDirection(direction, point),
		};
	}

	private pointByDirection(direction: Direction, point: Point): Point {
		return {
			top: this.top,
			down: this.down,
			right: this.right,
			left: this.left,
		}[direction](point);
	}

	private top([y, x]: Point): Point {
		return [y - 1, x];
	}

	private down([y, x]: Point): Point {
		return [y + 1, x];
	}

	private right([y, x]: Point): Point {
		return [y, x + 1];
	}

	private left([y, x]: Point): Point {
		return [y, x - 1];
	}

	private areEqual([ya, xa]: Point, [yb, xb]: Point) {
		return ya === yb && xa === xb;
	}
}
