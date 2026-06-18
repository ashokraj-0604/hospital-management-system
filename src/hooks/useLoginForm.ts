'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '../lib/validation';

// ─── useLoginForm Hook ────────────────────────────────────────────────────────

interface UseLoginFormOptions {
  onSubmit: (values: LoginFormValues) => Promise<void>;
}

export const useLoginForm = ({ onSubmit }: UseLoginFormOptions) => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember_me: false,
    },
    mode: 'onTouched',
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return {
    form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting,
    errors: form.formState.errors,
  };
};