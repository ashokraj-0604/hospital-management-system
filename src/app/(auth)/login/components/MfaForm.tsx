'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { Alert } from '@/src/core';
import { Button } from '@/src/core';
import { Input } from '@/src/core';
import { useMfaForm } from '../useMfaForm';

// ─── Props ────────────────────────────────────────────────────────────────────

interface MfaFormProps {
  onSubmit: (otp: string) => Promise<void>;
  onBack: () => void;
  error: string | null;
}

// ─── MfaForm Component ────────────────────────────────────────────────────────

export const MfaForm: React.FC<MfaFormProps> = ({ onSubmit, onBack, error }) => {
  const { form, handleSubmit, isSubmitting, errors } = useMfaForm({ onSubmit });

  return (
    <div className="space-y-6">
      {/* Icon + Description */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10">
          <ShieldCheck size={28} className="text-[var(--color-primary)]" />
        </div>
        <p className="text-sm text-slate-600">
          Enter the 6-digit code from your authenticator app to continue.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {error && <Alert variant="error" message={error} />}

        <Controller
          name="otp_code"
          control={form.control}
          render={({ field }) => (
            <Input
              {...field}
              label="One-time password"
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              placeholder="000000"
              autoComplete="one-time-code"
              error={errors.otp_code?.message}
              className="text-center text-2xl tracking-[0.5em] font-mono"
              required
            />
          )}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isSubmitting}
        >
          {isSubmitting ? 'Verifying…' : 'Verify OTP'}
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="md"
          fullWidth
          onClick={onBack}
        >
          Back to login
        </Button>
      </form>
    </div>
  );
};
