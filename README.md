# @advent-of-code/2023

## Description

This repository houses the solutions to [Advent of Code, 2023](https://adventofcode.com). It is modeled after [ts-aoc-starter's](https://github.com/nrwl/ts-aoc-starter/tree/main/packages/ts-aoc-starter) implementation of [Nx](https://nx.dev) to easily read the data to run the puzzles without having any overhead.

## Usage

To initialize the project, follow these steps:

1. Pull down the repo.
2. Run `pnpm i` from the root of the project.
3. Then, run `pnpm i && pnpm build` inside the `scripts` folder.

To see where to place your data files, take a look at this example:

```file-tree
├── src
│   ├── day-1
│   │   ├── day-1-a.data.txt
│   │   ├── day-1-a.sample-data.txt
│   │   ├── day-1-a.ts
│   │   ├── day-1-b.data.txt
│   │   ├── day-1-b.sample-data.txt
│   │   └── day-1-b.ts
│   ├── day-2
│   ├── day-3
```

To run a puzzle using sample data:

```shell
pnpm day-1-a:sample
```

To run a puzzle using real data:

```shell
pnpm day-1-a
```
