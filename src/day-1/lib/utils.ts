import { toInt } from "@helpers/toInt";

export function addToSum(sum: number, item: string): number {
	const num = toInt(item);
	if (!Number.isNaN(num)) sum += num;
	return sum;
}

export function getFirstAndLastDigit(item: string): string {
	item = item
		.split("")
		.map((char) => {
			if (!Number.isNaN(toInt(char))) return char;
			return "";
		})
		.join("");
	item = (item[0] as string) + item[item.length - 1];
	return item;
}
