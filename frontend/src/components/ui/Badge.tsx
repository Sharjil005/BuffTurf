import { type ReactNode } from 'react';

export default function Badge({
  children,
  variant = 'emerald',
}: {
  children: ReactNode;
  variant?: 'emerald' | 'amber' | 'blue' | 'red' | 'slate';
}) {
  const styles = {
    emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_12px_-3px_rgba(34,197,94,0.2)]',
    amber: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
    blue: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
    red: 'border-red-500/30 bg-red-500/10 text-red-400',
    slate: 'border-slate-700 bg-slate-800/60 text-slate-300',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase ${styles[variant]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80"></span>
      {children}
    </span>
  );
}