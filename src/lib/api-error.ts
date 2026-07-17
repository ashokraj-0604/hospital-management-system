import { isAxiosError } from 'axios';

type ErrorResponse = {
  message?: string | string[];
  error?: string;
};

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<ErrorResponse>(error)) {
    if (!error.response && (error.code === 'ERR_NETWORK' || error.message === 'Network Error')) {
      return 'Unable to reach backend API. Make sure backend is running on http://localhost:4000.';
    }

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
