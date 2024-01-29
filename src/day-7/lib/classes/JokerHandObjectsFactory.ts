import type { HandObject } from "../types/HandObject.ts";
import type { JokerHandObject } from "../types/JokerHandObject.ts";

import { jokerCardStrengthOrder } from "../constants/jokerCardStrengthOrder.ts";

export class JokerHandObjectsFactory {
	private handObjects: HandObject[];
	private highCardObjects: JokerHandObject[] = [];
	private onePairObjects: JokerHandObject[] = [];
	private twoPairObjects: JokerHandObject[] = [];
	private threeOfAKindObjects: JokerHandObject[] = [];
	private fullHouseObjects: JokerHandObject[] = [];
	private fourOfAKindObjects: JokerHandObject[] = [];
	private fiveOfAKindObjects: JokerHandObject[] = [];

	constructor(handObjects: HandObject[]) {
		this.handObjects = handObjects;
	}

	sort() {
		this.sortHandsByKind();
		this.locallySortHands();

		return [
			...this.highCardObjects,
			...this.onePairObjects,
			...this.twoPairObjects,
			...this.threeOfAKindObjects,
			...this.fullHouseObjects,
			...this.fourOfAKindObjects,
			...this.fiveOfAKindObjects,
		];
	}

	private sortHandsByKind() {
		for (const handObject of this.handObjects) {
			const uniqueLetters: Record<string, number> = {};

			for (const letter of handObject.hand) {
				uniqueLetters[letter] = uniqueLetters[letter]
					? (uniqueLetters[letter] as number) + 1
					: 1;
			}

			const {
				handObject: jokerHandObject,
				uniqueLetters: uniqueLettersWithoutJoker,
			} = this.replaceJokersWithHighestCard(handObject, uniqueLetters);

			switch (Object.keys(uniqueLettersWithoutJoker).length) {
				case 1:
					this.fiveOfAKindObjects.push(jokerHandObject);
					break;
				case 2:
					if (Object.values(uniqueLettersWithoutJoker).includes(2)) {
						this.fullHouseObjects.push(jokerHandObject);
					} else {
						this.fourOfAKindObjects.push(jokerHandObject);
					}
					break;
				case 3:
					if (Object.values(uniqueLettersWithoutJoker).includes(3)) {
						this.threeOfAKindObjects.push(jokerHandObject);
					} else {
						this.twoPairObjects.push(jokerHandObject);
					}
					break;
				case 4:
					this.onePairObjects.push(jokerHandObject);
					break;
				default:
					this.highCardObjects.push(jokerHandObject);
					break;
			}
		}
	}

	private replaceJokersWithHighestCard(
		handObject: HandObject,
		uniqueLetters: Record<string, number>,
	) {
		const jokerHandObject: JokerHandObject = {
			hand: handObject.hand,
			originalHand: handObject.hand,
			bid: handObject.bid,
		};
		const newUniqueLetters = { ...uniqueLetters };

		if (!newUniqueLetters.J) {
			return { handObject: jokerHandObject, uniqueLetters: newUniqueLetters };
		}

		const regex = /J/g;

		switch (Object.keys(newUniqueLetters).length) {
			case 1:
				newUniqueLetters[
					jokerCardStrengthOrder[jokerCardStrengthOrder.length - 1] as string
				] = newUniqueLetters.J;
				jokerHandObject.hand = jokerHandObject.hand.replace(
					"J",
					jokerCardStrengthOrder[jokerCardStrengthOrder.length - 1] as string,
				);

				break;
			case 2:
				const key = Object.keys(newUniqueLetters).find((k) => k !== "J");
				if (!key) throw new Error("Invalid key");

				newUniqueLetters[key] += newUniqueLetters.J;
				jokerHandObject.hand = jokerHandObject.hand.replace(regex, key);

				break;
			case 3:
				if (newUniqueLetters.J === 3) {
					const highestCard = this.getHighestCard(newUniqueLetters);
					if (!highestCard) throw new Error("Invalid highest card");

					newUniqueLetters[highestCard] += newUniqueLetters.J;
					jokerHandObject.hand = jokerHandObject.hand.replace(
						regex,
						highestCard,
					);
				} else if (newUniqueLetters.J === 2) {
					const key = Object.keys(newUniqueLetters).find(
						(k) => newUniqueLetters[k] === 2 && k !== "J",
					);
					if (!key) throw new Error("Invalid key");

					newUniqueLetters[key] += newUniqueLetters.J;
					jokerHandObject.hand = jokerHandObject.hand.replace(regex, key);
				} else if (Object.values(newUniqueLetters).includes(2)) {
					const highestCard = this.getHighestCard(newUniqueLetters);
					if (!highestCard) throw new Error("Invalid highest card");

					newUniqueLetters[highestCard] += newUniqueLetters.J;
					jokerHandObject.hand = jokerHandObject.hand.replace(
						regex,
						highestCard,
					);
				} else {
					const key = Object.keys(newUniqueLetters).find(
						(k) => newUniqueLetters[k] === 3,
					);
					if (!key) throw new Error("Invalid key");

					newUniqueLetters[key] += newUniqueLetters.J;
					jokerHandObject.hand = jokerHandObject.hand.replace(regex, key);
				}

				break;
			case 4:
				if (newUniqueLetters.J === 1) {
					const key = Object.keys(newUniqueLetters).find(
						(k) => newUniqueLetters[k] === 2,
					);
					if (!key) throw new Error("Invalid key");

					newUniqueLetters[key] += newUniqueLetters.J;
					jokerHandObject.hand = jokerHandObject.hand.replace(regex, key);
				} else {
					const highestCard = this.getHighestCard(newUniqueLetters);
					if (!highestCard) throw new Error("Invalid highest card");

					newUniqueLetters[highestCard] += newUniqueLetters.J;
					jokerHandObject.hand = jokerHandObject.hand.replace(
						regex,
						highestCard,
					);
				}

				break;
			default:
				const highestCard = this.getHighestCard(newUniqueLetters);
				if (!highestCard) throw new Error("Invalid highest card");

				newUniqueLetters[highestCard] += newUniqueLetters.J;
				jokerHandObject.hand = jokerHandObject.hand.replace(regex, highestCard);

				break;
		}

		// biome-ignore lint/performance/noDelete: Delete properties to save memory
		delete newUniqueLetters.J;

		return { handObject: jokerHandObject, uniqueLetters: newUniqueLetters };
	}

	private getHighestCard(uniqueLetters: Record<string, number>) {
		let highestCard = jokerCardStrengthOrder[0];
		if (!highestCard) throw new Error("Invalid highest card");

		for (const letter of Object.keys(uniqueLetters))
			if (
				jokerCardStrengthOrder.indexOf(letter) >
				jokerCardStrengthOrder.indexOf(highestCard)
			)
				highestCard = letter;

		return highestCard;
	}

	private locallySortHands() {
		this.sortByHighestCard(this.highCardObjects);
		this.sortByHighestCard(this.onePairObjects);
		this.sortByHighestCard(this.twoPairObjects);
		this.sortByHighestCard(this.threeOfAKindObjects);
		this.sortByHighestCard(this.fullHouseObjects);
		this.sortByHighestCard(this.fourOfAKindObjects);
		this.sortByHighestCard(this.fiveOfAKindObjects);
	}

	private sortByHighestCard(handObjects: JokerHandObject[]) {
		function compare(a: JokerHandObject, b: JokerHandObject, index = 0) {
			const aCard = a.originalHand[index];
			const bCard = b.originalHand[index];
			if (!aCard || !bCard) throw new Error("Invalid card");

			const aStrength = jokerCardStrengthOrder.indexOf(aCard);
			const bStrength = jokerCardStrengthOrder.indexOf(bCard);

			if (aStrength < bStrength) return -1;
			if (aStrength > bStrength) return 1;
			if (index === a.hand.length - 1) return 0;

			return compare(a, b, index + 1);
		}

		handObjects.sort(compare);
	}
}
