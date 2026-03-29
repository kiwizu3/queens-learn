import { Difficulty, Puzzle } from "@/types/queens";

type Solution = number[];

type CellPos = {
  row: number;
  col: number;
};

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function shuffle<T>(items: T[]) {
  const arr = [...items];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

function canPlaceQueen(solution: Solution, row: number, col: number) {
  for (let prevRow = 0; prevRow < row; prevRow++) {
    const prevCol = solution[prevRow];

    if (prevCol === col) {
      return false;
    }

    const rowDiff = Math.abs(prevRow - row);
    const colDiff = Math.abs(prevCol - col);

    // queens cannot touch
    if (rowDiff <= 1 && colDiff <= 1) {
      return false;
    }
  }

  return true;
}

function buildQueenSolution(size: number): Solution | null {
  const solution: Solution = Array(size).fill(-1);

  function backtrack(row: number): boolean {
    if (row === size) {
      return true;
    }

    const columns = shuffle([...Array(size)].map((_, i) => i));

    for (const col of columns) {
      if (!canPlaceQueen(solution, row, col)) {
        continue;
      }

      solution[row] = col;

      if (backtrack(row + 1)) {
        return true;
      }

      solution[row] = -1;
    }

    return false;
  }

  const ok = backtrack(0);
  return ok ? solution : null;
}

function createEmptyGrid(size: number, value: number) {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => value)
  );
}

function getNeighbors(size: number, row: number, col: number) {
  return [
    { row: row - 1, col },
    { row: row + 1, col },
    { row, col: col - 1 },
    { row, col: col + 1 },
  ].filter(
    (cell) =>
      cell.row >= 0 &&
      cell.row < size &&
      cell.col >= 0 &&
      cell.col < size
  );
}

function cellKey(cell: CellPos) {
  return `${cell.row}-${cell.col}`;
}

function uniqueCells(cells: CellPos[]) {
  const map = new Map<string, CellPos>();

  for (const cell of cells) {
    map.set(cellKey(cell), cell);
  }

  return Array.from(map.values());
}

function manhattanDistance(a: CellPos, b: CellPos) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

function pickCellByDifficulty(
  candidates: CellPos[],
  seed: CellPos,
  difficulty: Difficulty
) {
  const sorted = [...candidates].sort(
    (a, b) => manhattanDistance(a, seed) - manhattanDistance(b, seed)
  );

  if (difficulty === "easy") {
    const limit = Math.min(2, sorted.length);
    return sorted[randomInt(limit)];
  }

  if (difficulty === "medium") {
    const limit = Math.min(
      sorted.length,
      Math.max(3, Math.ceil(sorted.length / 2))
    );
    return sorted[randomInt(limit)];
  }

  return sorted[randomInt(sorted.length)];
}

function buildRegionsFromSolution(
  solution: Solution,
  difficulty: Difficulty
) {
  const size = solution.length;
  const regions = createEmptyGrid(size, -1);

  const regionCells: CellPos[][] = [];
  const seeds: CellPos[] = [];

  for (let row = 0; row < size; row++) {
    const col = solution[row];
    regions[row][col] = row;
    regionCells[row] = [{ row, col }];
    seeds[row] = { row, col };
  }

  let changed = true;

  while (changed) {
    changed = false;

    const regionOrder = shuffle([...Array(size)].map((_, i) => i));

    for (const regionId of regionOrder) {
      const possibleCells: CellPos[] = [];

      for (const cell of regionCells[regionId]) {
        const neighbors = getNeighbors(size, cell.row, cell.col);

        for (const neighbor of neighbors) {
          if (regions[neighbor.row][neighbor.col] === -1) {
            possibleCells.push(neighbor);
          }
        }
      }

      const uniquePossibleCells = uniqueCells(possibleCells);

      if (uniquePossibleCells.length > 0) {
        const picked = pickCellByDifficulty(
          uniquePossibleCells,
          seeds[regionId],
          difficulty
        );

        regions[picked.row][picked.col] = regionId;
        regionCells[regionId].push(picked);
        changed = true;
      }
    }
  }

  return regions;
}

export function generatePuzzle(size: number, difficulty: Difficulty): Puzzle {
  for (let attempt = 0; attempt < 300; attempt++) {
    const solution = buildQueenSolution(size);

    if (!solution) {
      continue;
    }

    const regions = buildRegionsFromSolution(solution, difficulty);

    return {
      id: `${difficulty}-${Date.now()}-${attempt}`,
      size,
      regions,
      solution,
    };
  }

  throw new Error("Could not generate puzzle");
}