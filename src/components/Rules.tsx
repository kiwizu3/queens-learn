export default function Rules() {
  return (
    <div className="w-full rounded-2xl bg-black p-4 text-sm text-slate-200 space-y-3">
      <h2 className="text-base font-bold text-white">How to play</h2>

      <p>1. Put exactly one queen in each row.</p>
      <p>2. Put exactly one queen in each column.</p>
      <p>3. Put exactly one queen in each color region.</p>
      <p>4. Queens cannot touch each other, not even diagonally.</p>
    </div>
  );
}