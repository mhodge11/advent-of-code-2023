export function getPatterns(input: string[]): string[][] {
	const patterns: string[][] = [];

	let i = 0;
	while (i !== -1) {
		const j = input.indexOf("", i);
		const pattern = input.slice(i, j === -1 ? undefined : j);

		patterns.push(pattern);

		i = j === -1 ? -1 : j + 1;
	}

	return patterns;
}

export function transpose(pattern: string[]): string[] {
	const current = pattern[0];
	if (!current) throw new Error(`Invalid pattern: ${pattern}`);

	const result = Array(current.length).fill("");
	for (const row of pattern) [...row].forEach((c, i) => (result[i] += c));

	return result;
}
