'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/src/lib/validation';
import { authService } from './login.api';

// ─── useForgotPassword Hook ───────────────────────────────────────────────────

export const useForgotPassword = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setError(null);
    try {
      await authService.forgotPassword(values);
      setIsSuccess(true);
    } catch {
      setError('Failed to send reset email. Please try again.');
    }
  });

  return {
    form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting,
    errors: form.formState.errors,
    isSuccess,
    error,
  };
};
