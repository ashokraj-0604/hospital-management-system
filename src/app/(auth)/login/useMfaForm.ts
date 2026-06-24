'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { mfaSchema, type MfaFormValues } from '@/src/lib/validation';

// ─── useMfaForm Hook ──────────────────────────────────────────────────────────

interface UseMfaFormOptions {
  onSubmit: (otp: string) => Promise<void>;
}

export const useMfaForm = ({ onSubmit }: UseMfaFormOptions) => {
  const form = useForm<MfaFormValues>({
    resolver: zodResolver(mfaSchema),
    defaultValues: { otp_code: '' },
    mode: 'onChange',
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values.otp_code);
  });

  return {
    form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting,
    errors: form.formState.errors,
  };
};
