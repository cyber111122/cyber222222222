import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brand-600 text-white shadow-glow hover:bg-brand-700',
  secondary: 'bg-stone-100 text-stone-900 border border-stone-200 hover:bg-stone-100 hover:border-brand-200',
  ghost: 'text-brand-700 hover:bg-stone-100',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: ReactNode;
  block?: boolean;
}

export function Button({ variant = 'primary', icon, block = false, className = '', children, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${block ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
