import { type ReactNode } from 'react';

export default function Card({
  children,
  className = '',
  hoverEffect = true,
}: {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl border border-emerald-500/10 bg-[#101A15]/90 backdrop-blur-md p-6 text-slate-100 shadow-xl ${
        hoverEffect ? 'glass-panel-hover' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}