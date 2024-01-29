import type { EmptySpace } from "../types/EmptySpace.ts";
import type { Galaxy } from "../types/Galaxy.ts";
import type { Image } from "../types/Image.ts";
import type { Map } from "../types/Map.ts";

export class ObjectFactory {
	private input: string[];

	constructor(input: string[]) {
		this.input = input;
	}

	create(): Map {
		const image = this.createImage();
		const emptySpace = this.getEmptySpace(image);
		const galaxies = this.findGalaxies(image);

		return { image, emptySpace, galaxies };
	}

	private createImage(): Image {
		return this.input.map((line) => line.split(""));
	}

	private getEmptySpace(image: Image): EmptySpace {
		const firstImage = image[0];
		if (!firstImage) throw new Error("No image found");

		return {
			rows: image.reduce((acc, row, rowIndex) => {
				if (row.every((n) => n === ".")) acc.add(rowIndex);
				return acc;
			}, new Set<number>()),
			cols: firstImage.reduce((acc, _, colIndex) => {
				if (image.every((row) => row[colIndex] === ".")) acc.add(colIndex);
				return acc;
			}, new Set<number>()),
		};
	}

	private findGalaxies(image: Image): Galaxy[] {
		const galaxies: Galaxy[] = [];

		for (let y = 0; y < image.length; y++) {
			const row = image[y];
			if (!row) throw new Error("No row found");

			for (let x = 0; x < row.length; x++) {
				const col = row[x];
				if (!col) throw new Error("No col found");

				if (col === "#") galaxies.push({ x, y });
			}
		}

		return galaxies;
	}
}
