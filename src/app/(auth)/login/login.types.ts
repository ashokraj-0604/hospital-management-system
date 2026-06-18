import type { FormEvent } from 'react';

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface UseLoginResult {
  values: LoginFormValues;
  isLoading: boolean;
  errorMessage: string | null;
  setFieldValue: (name: keyof LoginFormValues, value: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  submitLogin: (values: LoginFormValues) => Promise<void>;
}
