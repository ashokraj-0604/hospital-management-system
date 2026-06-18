'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { loginApi } from '@/src/lib/api/auth/login.api';
import type { LoginFormValues, UseLoginResult } from './login.types';
import type { FormEvent } from 'react';

export function useLogin(): UseLoginResult {
  const [values, setValues] = useState<LoginFormValues>({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (values: LoginFormValues) => loginApi.login(values),
    onError: (error: Error) => {
      setErrorMessage(error.message);
    },
  });

  const submitLogin = async (values: LoginFormValues) => {
    setErrorMessage(null);
    await mutation.mutateAsync(values);
  };

  const setFieldValue = (name: keyof LoginFormValues, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submitLogin(values);
  };

  return {
    values,
    isLoading: mutation.isPending,
    errorMessage,
    setFieldValue,
    handleSubmit,
    submitLogin,
  };
}
