import { type ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-emerald-500 to-green-500 text-black font-semibold shadow-[0_0_20px_-3px_rgba(34,197,94,0.4)] hover:shadow-[0_0_25px_0px_rgba(34,197,94,0.6)] hover:from-emerald-400 hover:to-green-400 active:scale-[0.98]',
  secondary:
    'bg-[#121E19]/80 border border-emerald-500/25 text-slate-200 hover:bg-[#1A2B24] hover:border-emerald-500/50 hover:text-white active:scale-[0.98]',
  accent:
    'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold shadow-[0_0_20px_-3px_rgba(245,158,11,0.35)] hover:from-amber-400 hover:to-orange-400 active:scale-[0.98]',
  ghost:
    'bg-transparent text-slate-300 hover:text-white hover:bg-white/5 active:scale-[0.98]',
  danger:
    'bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 hover:border-red-500/50 active:scale-[0.98]',
};

const sizeStyles = {
  sm: 'px-3.5 py-1.5 text-xs rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-xl font-bold tracking-wide',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-display transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed cursor-pointer ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}