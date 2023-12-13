import { type Direction } from '../types/Direction.ts';
import { type Plan } from '../types/Plan.ts';
import { type Point } from '../types/Point.ts';
import { type Position } from '../types/Position.ts';

export class LoopTraverser {
  private plan: Plan;

  constructor(plan: Plan) {
    this.plan = plan;
  }

  traverse(): number {
    const startingPoint = this.getStartingPoint();

    let currentPositions = this.getStartingPositions(startingPoint);
    if (currentPositions.length !== 2) {
      throw 'there should be 2 starting positions';
    }

    let stepsCount = 1;

    while (
      !this.areEqual(currentPositions[0].point, currentPositions[1].point)
    ) {
      currentPositions = currentPositions.map((position) =>
        this.getNextPosition(this.getVal(position.point), position)
      );
      stepsCount++;
    }

    return stepsCount;
  }

  private getStartingPoint(): [number, number] {
    for (let y = 0; y < this.plan.length; y++) {
      for (let x = 0; x < this.plan[y].length; x++) {
        if (this.plan[y][x] === 'S') {
          return [y, x];
        }
      }
    }

    throw 'no starting point';
  }

  private getStartingPositions(startingPoint: Point): Position[] {
    const positions: Position[] = [];
    const topPoint = this.top(startingPoint);
    const bottomPoint = this.down(startingPoint);
    const rightPoint = this.right(startingPoint);
    const leftPoint = this.left(startingPoint);

    if (
      startingPoint[0] > 0 &&
      ['|', 'F', '7'].includes(this.getVal(topPoint))
    ) {
      positions.push({
        direction: 'top',
        point: topPoint,
      });
    }

    if (
      startingPoint[0] <= this.plan.length - 1 &&
      ['|', 'L', 'J'].includes(this.getVal(bottomPoint))
    ) {
      positions.push({
        direction: 'down',
        point: bottomPoint,
      });
    }

    if (
      startingPoint[1] <= this.plan[0].length - 1 &&
      ['-', '7', 'J'].includes(this.getVal(rightPoint))
    ) {
      positions.push({
        direction: 'right',
        point: rightPoint,
      });
    }

    if (
      startingPoint[1] > 0 &&
      ['-', 'F', 'L'].includes(this.getVal(leftPoint))
    ) {
      positions.push({
        direction: 'left',
        point: leftPoint,
      });
    }

    return positions;
  }

  private getNextPosition(val: string, position: Position): Position {
    const { direction, point } = position;

    if (['-', '|'].includes(val)) {
      return this.newPosition(direction, point);
    }

    if (direction === 'top') {
      if (val === 'F') {
        return this.newPosition('right', point);
      }
      if (val === '7') {
        return this.newPosition('left', point);
      }
    }

    if (direction === 'down') {
      if (val === 'L') {
        return this.newPosition('right', point);
      }
      if (val === 'J') {
        return this.newPosition('left', point);
      }
    }

    if (direction === 'right') {
      if (val === 'J') {
        return this.newPosition('top', point);
      }
      if (val === '7') {
        return this.newPosition('down', point);
      }
    }

    if (direction === 'left') {
      if (val === 'F') {
        return this.newPosition('down', point);
      }
      if (val === 'L') {
        return this.newPosition('top', point);
      }
    }

    throw `unhandled next position (direction: ${direction}, val: ${val})`;
  }

  private getVal([y, x]: Point) {
    return this.plan[y][x];
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
