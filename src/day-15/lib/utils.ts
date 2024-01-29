export function formatInput(data: string[]): string[] {
	const line = data[0];
	if (!line) throw new Error(`Invalid line: ${line}`);

	return line.trim().split(",");
}

export function hasher(str: string) {
	return str.split("").reduce((val, char) => {
		val += char.charCodeAt(0);
		val *= 17;
		val %= 256;
		return val;
	}, 0);
}
