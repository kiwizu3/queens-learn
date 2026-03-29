import { PlusIcon } from "@heroicons/react/24/outline";

type HeaderProps = {
  elapsedSeconds: number;
  onNewPuzzle: () => void;
};

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function Header({
  elapsedSeconds,
  onNewPuzzle,
}: HeaderProps) {
  return (
    <div className="w-full flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 rounded-2xl bg-gray-900 px-3 py-2">
        <span className="font-bold tabular-nums text-white">
          {formatTime(elapsedSeconds)}
        </span>
      </div>

      <button
        onClick={onNewPuzzle}
        className="inline-flex items-center gap-2 rounded-xl border border-gray-800 bg-black text-slate-200 hover:bg-gray-800 px-3 py-2 text-sm font-semibold"
      >
        <PlusIcon className="h-4 w-4 stroke-2" />
        <span>New</span>
      </button>
    </div>
  );
}