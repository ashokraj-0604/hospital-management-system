'use client';

import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

// ─── Variant Styles ───────────────────────────────────────────────────────────

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    'bg-[var(--color-primary)] text-white shadow-sm',
    'hover:opacity-90 active:opacity-80',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
  secondary: [
    'bg-white text-[var(--color-primary)] border border-[var(--color-primary)]',
    'hover:bg-[var(--color-primary)]/5 active:bg-[var(--color-primary)]/10',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
  ghost: [
    'bg-transparent text-slate-600',
    'hover:bg-slate-100 active:bg-slate-200',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
  danger: [
    'bg-red-600 text-white shadow-sm',
    'hover:bg-red-700 active:bg-red-800',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs rounded-lg',
  md: 'h-10 px-4 text-sm rounded-xl',
  lg: 'h-12 px-6 text-sm rounded-xl',
};

// ─── Button Component ─────────────────────────────────────────────────────────

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      className,
      disabled,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:ring-offset-1',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  ),
);

Button.displayName = 'Button';