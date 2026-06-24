'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { Alert } from '@/src/core';
import { Button } from '@/src/core';
import { Input } from '@/src/core';
import { useLoginForm } from '../useLoginForm';
import { ROUTES } from '@/src/constants/app.constants';
import type { LoginFormValues } from '@/src/lib/validation';

// ─── Props ────────────────────────────────────────────────────────────────────

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
  error: string | null;
  onClearError: () => void;
}

// ─── LoginForm Component ──────────────────────────────────────────────────────

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, error, onClearError }) => {
  const { form, handleSubmit, isSubmitting, errors } = useLoginForm({ onSubmit });

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Server Error */}
      {error && (
        <Alert
          variant="error"
          message={error}
          onClose={onClearError}
        />
      )}

      {/* Email */}
      <Controller
        name="email"
        control={form.control}
        render={({ field }) => (
          <Input
            {...field}
            label="Email address"
            type="email"
            placeholder="doctor@hospital.com"
            autoComplete="email"
            leftIcon={<Mail size={16} />}
            error={errors.email?.message}
            required
          />
        )}
      />

      {/* Password */}
      <Controller
        name="password"
        control={form.control}
        render={({ field }) => (
          <Input
            {...field}
            label="Password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            leftIcon={<Lock size={16} />}
            error={errors.password?.message}
            required
          />
        )}
      />

      {/* Remember me + Forgot */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer group">
          <Controller
            name="remember_me"
            control={form.control}
            render={({ field }) => (
              <input
                type="checkbox"
                checked={field.value}
                onChange={field.onChange}
                className="h-4 w-4 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]/30 cursor-pointer"
              />
            )}
          />
          <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">
            Remember me
          </span>
        </label>

        <Link
          href={ROUTES.FORGOT_PASSWORD}
          className="text-sm font-medium text-[var(--color-primary)] hover:opacity-80 transition-opacity"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isSubmitting}
      >
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
};
