import type { EmptySpace } from "./EmptySpace.ts";
import type { Galaxy } from "./Galaxy.ts";
import type { Image } from "./Image.ts";

export type Map = {
	image: Image;
	emptySpace: EmptySpace;
	galaxies: Galaxy[];
};
