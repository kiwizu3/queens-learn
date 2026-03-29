import {
    ArrowPathIcon,
    LightBulbIcon,
    LifebuoyIcon,
    QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

type GameControlsProps = {
    onHelp: () => void;
    onHint: () => void;
    onReset: () => void;
    hintDisabled: boolean;
    hintSecondsLeft: number;
    solved: boolean;
};

export default function GameControls({
    onHelp,
    onHint,
    onReset,
    hintDisabled,
    hintSecondsLeft,
    solved,
}: GameControlsProps) {
    return (
        <div className="flex w-full items-center justify-between gap-3 pt-1">
            <button
                onClick={onHelp}
                className="flex p-3 items-center justify-center rounded-2xl border border-gray-800 bg-black text-slate-200 hover:bg-gray-800 font-semibold"
                title="Help"
            >
                <LifebuoyIcon className="h-5 w-5 me-2" /> Help
            </button>

            <button
                onClick={onHint}
                disabled={hintDisabled || solved}
                className="flex ms-auto p-3 min-w-[5.5rem] items-center justify-center rounded-2xl border border-gray-800 bg-black px-3 text-slate-200 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 font-semibold"
                title={hintDisabled ? `Wait ${hintSecondsLeft}s` : "Hint"}
            >
                {hintDisabled ? (
                    <span className="text-sm font-bold text-white">
                        {hintSecondsLeft} sec
                    </span>
                ) : (
                    <>
                        <LightBulbIcon className="h-5 w-5 me-2" /> Hint
                    </>
                )}
            </button>

            <button
                onClick={onReset}
                className="flex p-3 items-center justify-center rounded-2xl border border-gray-800 bg-black text-slate-200 hover:bg-gray-800 font-semibold"
                title="Reset"
            >
                <ArrowPathIcon className="h-5 w-5 me-2" /> Reset
            </button>
        </div>
    );
}