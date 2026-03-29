import { CellMark } from "@/types/queens";

export function countQueensInRow(marks: CellMark[][], row: number) {
  return marks[row].filter((cell) => cell === "queen").length;
}

export function countQueensInCol(marks: CellMark[][], col: number) {
  let count = 0;

  for (let row = 0; row < marks.length; row++) {
    if (marks[row][col] === "queen") {
      count++;
    }
  }

  return count;
}

export function countQueensInRegion(
  marks: CellMark[][],
  regions: number[][],
  regionId: number
) {
  let count = 0;

  for (let row = 0; row < marks.length; row++) {
    for (let col = 0; col < marks[row].length; col++) {
      if (regions[row][col] === regionId && marks[row][col] === "queen") {
        count++;
      }
    }
  }

  return count;
}

export function queensAreTouching(marks: CellMark[][]) {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (let row = 0; row < marks.length; row++) {
    for (let col = 0; col < marks[row].length; col++) {
      if (marks[row][col] !== "queen") continue;

      for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;

        if (
          newRow >= 0 &&
          newRow < marks.length &&
          newCol >= 0 &&
          newCol < marks[row].length &&
          marks[newRow][newCol] === "queen"
        ) {
          return true;
        }
      }
    }
  }

  return false;
}

export function isSolved(marks: CellMark[][], regions: number[][]) {
  const size = marks.length;

  for (let row = 0; row < size; row++) {
    if (countQueensInRow(marks, row) !== 1) {
      return false;
    }
  }

  for (let col = 0; col < size; col++) {
    if (countQueensInCol(marks, col) !== 1) {
      return false;
    }
  }

  const uniqueRegions = new Set(regions.flat());

  for (const regionId of uniqueRegions) {
    if (countQueensInRegion(marks, regions, regionId) !== 1) {
      return false;
    }
  }

  if (queensAreTouching(marks)) {
    return false;
  }

  return true;
}