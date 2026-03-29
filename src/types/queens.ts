export type CellMark = "empty" | "x" | "queen";

export type Puzzle = {
  id: string;
  size: number;
  regions: number[][];
  solution: number[]; // row -> queen column
};

export type CellPosition = {
  row: number;
  col: number;
};

export type Difficulty = "easy" | "medium" | "hard";