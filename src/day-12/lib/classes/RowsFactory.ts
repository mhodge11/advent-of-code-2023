import type { Row } from "../types/Row.ts";

export class RowsFactory {
	private readonly input: string[];
	private readonly multiplier: number;

	constructor(input: string[], multiplier: number = 1) {
		this.input = input;
		this.multiplier = multiplier;
	}

	convert(): Row[] {
		return this.input.map(this.convertToRow.bind(this));
	}

	private convertToRow(item: string): Row {
		const [lineStr, groupsStr] = item.split(" ");
		if (!lineStr || !groupsStr) throw new Error(`Invalid row: ${item}`);

		const line = this.convertToLine(lineStr);
		const groups = this.convertToGroups(groupsStr);

		const row = { line, groups };

		return row;
	}

	private convertToLine(lineStr: string): string {
		return Array(this.multiplier).fill(lineStr.trim()).join("?");
	}

	private convertToGroups(groupsStr: string): number[] {
		return Array(this.multiplier)
			.fill(groupsStr.trim())
			.join(",")
			.split(",")
			.map((group) => parseInt(group, 10));
	}
}
