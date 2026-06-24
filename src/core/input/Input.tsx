'use client';

import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/src/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
}

// ─── Input Component ──────────────────────────────────────────────────────────

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-[#0D2F36]">
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#8AACB3]">
              {leftIcon}
            </div>
          )}

          <input
            suppressHydrationWarning
            ref={ref}
            type={inputType}
            className={cn(
              'w-full rounded-xl border bg-white px-4 py-3 text-sm',
              'text-[#0D2F36]',
              'placeholder:text-[#8AACB3]',
              'border-[#D6EFF4]',
              'shadow-sm transition-all duration-200',

              'focus:outline-none',
              'focus:border-[#33ABC3]',
              'focus:ring-4 focus:ring-[#33ABC3]/10',

              'disabled:cursor-not-allowed',
              'disabled:bg-[#F4FAFB]',
              'disabled:text-[#8AACB3]',

              leftIcon && 'pl-10',
              isPassword && 'pr-10',

              error
                ? 'border-red-400 focus:ring-red-100 focus:border-red-500'
                : 'hover:border-[#33ABC3]/40',

              className,
            )}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-[#8AACB3] hover:text-[#33ABC3] transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
            {error}
          </p>
        )}

        {hint && !error && (
          <p className="text-xs text-[#4A7C87]">{hint}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';