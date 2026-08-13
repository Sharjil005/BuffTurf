export default function PitchDivider() {
  return (
    <div className="relative mx-auto my-4 h-px w-full max-w-5xl bg-ink-900/10">
      <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink-900/20 bg-chalk-50" />
    </div>
  );
}