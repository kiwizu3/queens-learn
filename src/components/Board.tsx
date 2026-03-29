"use client";

import { useEffect, useMemo, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import Cell from "./Cell";
import Header from "./Header";
import Modal from "./Modal";
import GameControls from "./GameControls";
import { Puzzle, CellMark } from "@/types/queens";
import { regionColors } from "@/lib/puzzle";
import {
    isSolved,
    countQueensInRow,
    countQueensInCol,
    countQueensInRegion,
} from "@/lib/validation";

type BoardProps = {
    puzzle: Puzzle;
    onNewPuzzle: () => void;
};

function createEmptyMarks(size: number): CellMark[][] {
    return Array.from({ length: size }, () =>
        Array.from({ length: size }, () => "empty")
    );
}

function formatTime(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function Board({ puzzle, onNewPuzzle }: BoardProps) {
    const size = puzzle.size;

    const [marks, setMarks] = useState<CellMark[][]>(createEmptyMarks(size));
    const [hintSecondsLeft, setHintSecondsLeft] = useState(0);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [showHelp, setShowHelp] = useState(false);
    const [showSolvedDialog, setShowSolvedDialog] = useState(false);

    const solved = useMemo(() => {
        return isSolved(marks, puzzle.regions);
    }, [marks, puzzle.regions]);

    useEffect(() => {
        if (hintSecondsLeft <= 0) return;

        const timer = setTimeout(() => {
            setHintSecondsLeft((old) => old - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [hintSecondsLeft]);

    useEffect(() => {
        if (solved) return;

        const timer = setInterval(() => {
            setElapsedSeconds((old) => old + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [solved]);

    useEffect(() => {
        if (solved) {
            setShowSolvedDialog(true);
        }
    }, [solved]);

    function handleCellClick(row: number, col: number) {
        setMarks((oldMarks) => {
            const newMarks = oldMarks.map((r) => [...r]);
            const current = newMarks[row][col];

            if (current === "empty") {
                newMarks[row][col] = "x";
            } else if (current === "x") {
                newMarks[row][col] = "queen";
            } else {
                newMarks[row][col] = "empty";
            }

            return newMarks;
        });
    }

    function handleReset() {
        setMarks(createEmptyMarks(size));
        setHintSecondsLeft(0);
        setElapsedSeconds(0);
        setShowSolvedDialog(false);
    }

    function handleHint() {
        if (hintSecondsLeft > 0 || solved) {
            return;
        }

        setMarks((oldMarks) => {
            const newMarks = oldMarks.map((r) => [...r]);

            for (let row = 0; row < size; row++) {
                const correctCol = puzzle.solution[row];

                if (newMarks[row][correctCol] === "queen") {
                    continue;
                }

                for (let col = 0; col < size; col++) {
                    newMarks[row][col] = "empty";
                }

                newMarks[row][correctCol] = "queen";
                break;
            }

            return newMarks;
        });

        setHintSecondsLeft(5);
    }

    function rowHasConflict(row: number) {
        return countQueensInRow(marks, row) > 1;
    }

    function colHasConflict(col: number) {
        return countQueensInCol(marks, col) > 1;
    }

    function regionHasConflict(regionId: number) {
        return countQueensInRegion(marks, puzzle.regions, regionId) > 1;
    }

    function queenTouchesAnother(row: number, col: number) {
        if (marks[row][col] !== "queen") {
            return false;
        }

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

        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;

            if (
                newRow >= 0 &&
                newRow < size &&
                newCol >= 0 &&
                newCol < size &&
                marks[newRow][newCol] === "queen"
            ) {
                return true;
            }
        }

        return false;
    }

    function isQueenBreakingRule(row: number, col: number) {
        if (marks[row][col] !== "queen") {
            return false;
        }

        const regionId = puzzle.regions[row][col];

        return (
            rowHasConflict(row) ||
            colHasConflict(col) ||
            regionHasConflict(regionId) ||
            queenTouchesAnother(row, col)
        );
    }

    function shouldSoftHighlight(row: number, col: number) {
        const regionId = puzzle.regions[row][col];

        return (
            rowHasConflict(row) ||
            colHasConflict(col) ||
            regionHasConflict(regionId)
        );
    }

    return (
        <>
            <div className="w-full rounded-3xl bg-black flex flex-col items-center gap-4 shadow-lg shadow-black/20">
                <Header
                    elapsedSeconds={elapsedSeconds}
                    onNewPuzzle={onNewPuzzle}
                />

                <div
                    className="grid w-full max-w-[520px] aspect-square border-4 border-black bg-black"
                    style={{
                        gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
                    }}
                >
                    {marks.map((row, rowIndex) =>
                        row.map((mark, colIndex) => {
                            const regionId = puzzle.regions[rowIndex][colIndex];
                            const colorClass = regionColors[regionId] ?? "bg-gray-200";

                            return (
                                <Cell
                                    key={`${rowIndex}-${colIndex}`}
                                    mark={mark}
                                    colorClass={colorClass}
                                    softHighlight={shouldSoftHighlight(rowIndex, colIndex)}
                                    isMistake={isQueenBreakingRule(rowIndex, colIndex)}
                                    onClick={() => handleCellClick(rowIndex, colIndex)}
                                />
                            );
                        })
                    )}
                </div>

                <GameControls
                    onHelp={() => setShowHelp(true)}
                    onHint={handleHint}
                    onReset={handleReset}
                    hintDisabled={hintSecondsLeft > 0}
                    hintSecondsLeft={hintSecondsLeft}
                    solved={solved}
                />
            </div>

            <Modal
                open={showHelp}
                title="How to play"
                onClose={() => setShowHelp(false)}
                actions={
                    <button
                        onClick={() => setShowHelp(false)}
                        className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black"
                    >
                        Got it
                    </button>
                }
            >
                <div className="space-y-3 text-sm text-slate-200">
                    <p>1. Put exactly one queen in each row.</p>
                    <p>2. Put exactly one queen in each column.</p>
                    <p>3. Put exactly one queen in each color region.</p>
                    <p>4. Queens cannot touch, not even diagonally.</p>
                    <p>5. Tap a square to cycle: empty → X → queen → empty.</p>
                    <p>6. Use Hint to reveal one correct queen. Then wait 5 seconds.</p>
                </div>
            </Modal>

            <Modal
                open={showSolvedDialog}
                title="Puzzle solved!"
                onClose={() => setShowSolvedDialog(false)}
                actions={
                    <>
                        <button
                            onClick={() => setShowSolvedDialog(false)}
                            className="rounded-xl bg-gray-800 px-4 py-2 text-sm font-semibold text-white"
                        >
                            Close
                        </button>

                        <button
                            onClick={onNewPuzzle}
                            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm px-3 py-2 font-semibold text-black"
                        >
                            <PlusIcon className="h-4 w-4 stroke-2" />
                            <span>New</span>
                        </button>
                    </>
                }
            >
                <div className="space-y-3 text-sm text-slate-200">
                    <p className="text-base font-semibold text-white">
                        Nice work! You finished the puzzle.
                    </p>
                    <p>
                        Time:{" "}
                        <span className="font-bold text-amber-300">
                            {formatTime(elapsedSeconds)}
                        </span>
                    </p>
                </div>
            </Modal>
        </>
    );
}