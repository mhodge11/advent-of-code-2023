import { readFile } from "fs/promises";

export async function readData(path?: string): Promise<string[]> {
	const fileName = path || process.argv[2];
	const data = (await readFile(fileName as string)).toString().split("\n");
	return formatData(data);
}

function formatData(data: string[]): string[] {
	while (data[data.length - 1]?.trim() === "") data.pop();
	return data.map((item) => item.trim());
}
