import { type Instructions } from '../types/Instructions.ts';
import { type Nodes } from '../types/Nodes.ts';

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
    this.instructions = instructionsStr.split('') as Instructions;
  }

  private createNodes() {
    const regex = /\((?<left>.+),\s+(?<right>.+)\)/;

    this.nodes = this.input.reduce((acc, line) => {
      const [nodeId, connections] = line.split('=').map((x) => x.trim());
      const match = connections.match(regex);
      const { left, right } = match!.groups!;

      acc[nodeId] = { L: left, R: right };

      return acc;
    }, {} as Nodes);
  }
}
