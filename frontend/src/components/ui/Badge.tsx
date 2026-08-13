import { type ReactNode } from 'react';

export default function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-pitch-500/30 bg-pitch-500/5 px-4 py-1.5 text-sm font-medium text-turf-700">
      {children}
    </span>
  );
}