import { type ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-pitch-500 text-chalk-50 hover:bg-turf-700',
  secondary: 'bg-transparent border border-chalk-50/40 text-chalk-50 hover:bg-chalk-50/10',
  accent: 'bg-amber-500 text-ink-900 hover:bg-amber-500/90',
  ghost: 'bg-transparent text-ink-900 hover:bg-ink-900/5',
};

export default function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md px-6 py-3 font-display text-lg uppercase tracking-wide transition-colors duration-150 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}