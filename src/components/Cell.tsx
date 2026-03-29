import clsx from "clsx";
import type { CSSProperties } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { CellMark } from "@/types/queens";

type CellProps = {
  mark: CellMark;
  colorClass: string;
  onClick: () => void;
  isMistake?: boolean;
  softHighlight?: boolean;
};

const crownMaskStyle: CSSProperties = {
  WebkitMaskImage: 'url("/icons/crown.svg")',
  maskImage: 'url("/icons/crown.svg")',
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
  WebkitMaskSize: "contain",
  maskSize: "contain",
};

function CrownIcon({ isMistake }: { isMistake: boolean }) {
  return (
    <span
      className={clsx(
        "relative z-10 block h-7 w-7 sm:h-8 sm:w-8",
        isMistake ? "bg-red-800" : "bg-amber-700"
      )}
      style={crownMaskStyle}
    />
  );
}

export default function Cell({
  mark,
  colorClass,
  onClick,
  isMistake = false,
  softHighlight = false,
}: CellProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "relative aspect-square select-none border border-black/20 transition active:scale-95",
        "flex items-center justify-center",
        colorClass
      )}
    >
      {softHighlight && (
        <div className="absolute inset-0 pointer-events-none bg-red-500/15" />
      )}

      {isMistake && (
        <div className="absolute inset-0 pointer-events-none bg-red-500/35" />
      )}

      {mark === "x" && (
        <XMarkIcon className="relative z-10 h-6 w-6 text-slate-600 sm:h-7 sm:w-7" />
      )}

      {mark === "queen" && <CrownIcon isMistake={isMistake} />}
    </button>
  );
}