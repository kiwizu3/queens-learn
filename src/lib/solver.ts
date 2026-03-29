import { Puzzle } from "@/types/queens";

function isTouching(
  queens: number[],
  nextRow: number,
  nextCol: number
) {
  for (let row = 0; row < nextRow; row++) {
    const col = queens[row];

    if (col === -1) continue;

    const rowDiff = Math.abs(row - nextRow);
    const colDiff = Math.abs(col - nextCol);

    if (rowDiff <= 1 && colDiff <= 1) {
      return true;
    }
  }

  return false;
}

export function countSolutions(puzzle: Puzzle, limit = 2) {
  const size = puzzle.size;
  const queens = Array(size).fill(-1);

  const usedCols = new Set<number>();
  const usedRegions = new Set<number>();

  let solutions = 0;

  function backtrack(row: number) {
    if (solutions >= limit) {
      return;
    }

    if (row === size) {
      solutions++;
      return;
    }

    for (let col = 0; col < size; col++) {
      const regionId = puzzle.regions[row][col];

      if (usedCols.has(col)) {
        continue;
      }

      if (usedRegions.has(regionId)) {
        continue;
      }

      if (isTouching(queens, row, col)) {
        continue;
      }

      queens[row] = col;
      usedCols.add(col);
      usedRegions.add(regionId);

      backtrack(row + 1);

      queens[row] = -1;
      usedCols.delete(col);
      usedRegions.delete(regionId);
    }
  }

  backtrack(0);

  return solutions;
}