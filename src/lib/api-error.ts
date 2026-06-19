import { isAxiosError } from 'axios';

type ErrorResponse = {
  message?: string | string[];
  error?: string;
};

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<ErrorResponse>(error)) {
    const message = error.response?.data?.message;

    if (Array.isArray(message)) {
      return message.join(' ');
    }

    if (message) {
      return message;
    }

    if (error.response?.data?.error) {
      return error.response.data.error;
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
