import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-xs font-semibold tracking-wider uppercase text-slate-400">
          {label}
        </label>
        <input
          ref={ref}
          className={`rounded-xl border bg-[#0C1410] px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all focus:border-emerald-400 focus:bg-[#111C17] focus:ring-2 focus:ring-emerald-500/20 ${
            error ? 'border-red-500/60 ring-2 ring-red-500/10' : 'border-emerald-500/20 hover:border-emerald-500/40'
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs font-medium text-red-400">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';