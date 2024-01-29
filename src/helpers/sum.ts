export function sum(...nums: number[] | (readonly number[])[]): number {
	return nums.reduce<number>((total, num) => {
		if (typeof num === "number") return total + num;
		return total + sum(...num);
	}, 0);
}
