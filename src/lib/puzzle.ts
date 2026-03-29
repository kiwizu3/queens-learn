import { Puzzle } from "@/types/queens";

export const samplePuzzle: Puzzle = {
  id: "demo-1",
  size: 8,
  regions: [
    [0, 0, 0, 0, 1, 1, 1, 1],
    [0, 2, 2, 0, 1, 3, 3, 1],
    [0, 2, 4, 4, 1, 3, 3, 1],
    [0, 2, 2, 4, 4, 5, 5, 1],
    [6, 6, 2, 7, 4, 5, 5, 8],
    [6, 6, 7, 7, 7, 5, 8, 8],
    [6, 9, 9, 7, 10, 10, 10, 8],
    [9, 9, 9, 10, 10, 11, 11, 11],
  ],
};

export const regionColors: Record<number, string> = {
  0: "bg-purple-300",
  1: "bg-purple-200",
  2: "bg-orange-200",
  3: "bg-lime-200",
  4: "bg-blue-300",
  5: "bg-green-300",
  6: "bg-yellow-200",
  7: "bg-sky-300",
  8: "bg-red-300",
  9: "bg-lime-300",
  10: "bg-pink-300",
  11: "bg-stone-300",
};