"use client";

import { useEffect, useState } from "react";
import Board from "@/components/Board";
import { Difficulty, Puzzle } from "@/types/queens";
import { generatePuzzle } from "@/lib/generator";

function getBoardSize(difficulty: Difficulty) {
  if (difficulty === "easy") return 6;
  if (difficulty === "medium") return 7;
  return 8;
}

export default function Home() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    const size = getBoardSize(difficulty);
    const newPuzzle = generatePuzzle(size, difficulty);
    setPuzzle(newPuzzle);
  }, [difficulty, reloadCount]);

  function buttonClass(active: boolean) {
    return active
      ? "rounded-xl px-3 py-2 text-sm font-semibold bg-sky-500/100 text-white"
      : "rounded-xl px-3 py-2 text-sm font-semibold bg-gray-200 text-gray-800";
  }

  return (
    <main className="min-h-screen bg-black text-white px-3 py-4 sm:px-4 sm:py-6">
      <div className="mx-auto flex w-full max-w-md flex-col gap-4">
        <div className="flex items-center gap-2">
          <div>
            <span
              className="relative z-10 block h-10 w-10 bg-linear-to-r/srgb from-indigo-500 to-teal-400"
              style={{
                WebkitMaskImage: 'url("/icons/crown.svg")',
                maskImage: 'url("/icons/crown.svg")',
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                WebkitMaskSize: "contain",
                maskSize: "contain",
              }}
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Queens</h1>
          </div>

        </div>

          <div className="ms-auto">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setDifficulty("easy")}
                className={buttonClass(difficulty === "easy")}
              >
                Easy
              </button>

              <button
                onClick={() => setDifficulty("medium")}
                className={buttonClass(difficulty === "medium")}
              >
                Medium
              </button>

              <button
                onClick={() => setDifficulty("hard")}
                className={buttonClass(difficulty === "hard")}
              >
                Hard
              </button>
            </div>
          </div>

        <div className="border border-gray-700 rounded-2xl p-4 sm:p-3">
          {puzzle ? (
            <Board
              key={puzzle.id}
              puzzle={puzzle}
              onNewPuzzle={() => setReloadCount((old) => old + 1)}
            />
          ) : (
            <div className="rounded-2xl bg-black p-4">Loading...</div>
          )}
        </div>
 <div className="text-center">
          <small>Made with <span className="text-red-500">❤︎</span>⁠ by <a href="https://kavinda.vercel.app">Kiwi</a></small>
        </div>
      </div>
    </main>
  );
}