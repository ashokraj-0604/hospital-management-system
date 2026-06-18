'use client';

import { useMemo } from 'react';
import { useAuthStore } from '@/src/store';
import { clearAccessToken, setAccessToken } from './session';

export function useAuth() {
  const { user, tokens, setAuthState, clearAuthState } = useAuthStore();

  return useMemo(
    () => ({
      user,
      tokens,
      login: setAuthState,
      logout: () => {
        clearAccessToken();
        clearAuthState();
      },
      setToken: (token: string) => setAccessToken(token),
    }),
    [clearAuthState, setAuthState, tokens, user],
  );
}
