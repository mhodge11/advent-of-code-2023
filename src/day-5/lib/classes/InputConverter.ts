export class InputConverter {
	private input: string[];

	constructor(input: string[]) {
		this.input = input;
	}

	convertArray(): string[] {
		return this.input.filter((item) => item !== "");
	}
}
