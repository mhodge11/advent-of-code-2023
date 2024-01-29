export function run(input: Array<string>): number {
	let sum = 0;

	for (const card of input) {
		const [, cards] = card.split(": ");
		if (!cards) throw new Error(`Invalid card: ${card}`);

		const [winningCard, checkCard] = cards.split(" | ");
		if (!winningCard || !checkCard) throw new Error(`Invalid card: ${card}`);

		const winningNumbers = winningCard
			.split(" ")
			.map((num) => parseInt(num.trim(), 10));
		const checkNumbers = checkCard
			.split(" ")
			.map((num) => parseInt(num.trim(), 10));

		let points = 0;

		for (const num of winningNumbers) {
			let lastFoundIndex = 0;

			while (true) {
				const foundIndex = checkNumbers.indexOf(num, lastFoundIndex);

				if (foundIndex === -1) break;

				if (points > 1) points *= 2;
				else points += 1;

				lastFoundIndex = foundIndex + 1;
			}
		}

		sum += points;
	}

	return sum;
}
