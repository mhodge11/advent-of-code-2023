export function run(input: Array<string>): number {
	const numberOfEachCard = Array(input.length).fill(1);

	let index = -1;
	for (const card of input) {
		index++;

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

		for (let i = 0; i < numberOfEachCard[index]; i++) {
			const points = tallyPoints(winningNumbers, checkNumbers);
			for (let j = index + 1; j <= index + points; j++)
				numberOfEachCard[j] += 1;
		}
	}

	return numberOfEachCard.reduce((acc, curr) => acc + curr, 0);
}

function tallyPoints(winningNumbers: number[], checkNumbers: number[]) {
	let points = 0;

	for (const num of winningNumbers) {
		let lastFoundIndex = 0;

		while (true) {
			const foundIndex = checkNumbers.indexOf(num, lastFoundIndex);

			if (foundIndex === -1) break;

			points++;
			lastFoundIndex = foundIndex + 1;
		}
	}

	return points;
}
