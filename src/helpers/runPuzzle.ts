import { readData } from "./readData.ts";
import { runtimeTracker } from "./runtimeTracker.ts";

export async function runPuzzle(
	fn: (data: Array<string>, pureData: string) => number | bigint,
): Promise<void> {
	const runtime = runtimeTracker();

	let answer: number | bigint | undefined;
	let error: Error | undefined;

	try {
		const data = await readData();
		const pureData = data.join("\n");

		runtime.start();

		answer = fn(data, pureData);

		runtime.stop();
	} catch (e) {
		if (e instanceof Error) error = e;
		else if (typeof e === "string") error = new Error(e);
		else error = new Error("Something went wrong");
	}

	if (error) {
		console.error(error);
		return;
	}

	console.log("Runtime:", runtime.get());
	console.log("Answer:", answer);
}
