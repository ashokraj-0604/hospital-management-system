'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { authService } from '../services/auth.service';
import { tokenUtils, userStorage, clearAuthData } from '../lib/token.utils';
import { ROUTES } from '../constants/app.constants';
import type {
  User,
  LoginCredentials,
  MfaVerifyPayload,
} from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthHookState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  requiresMfa: boolean;
  mfaSessionToken: string | null;
}

interface AuthHookReturn extends AuthHookState {
  login: (credentials: LoginCredentials) => Promise<void>;
  verifyMfa: (otp: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// ─── useAuth Hook ─────────────────────────────────────────────────────────────

export const useAuth = (): AuthHookReturn => {
  const router = useRouter();

  const [state, setState] = useState<AuthHookState>({
    user: null,
    isLoading: false,
    error: null,
    requiresMfa: false,
    mfaSessionToken: null,
  });

  const setLoading = (isLoading: boolean) =>
    setState((prev) => ({ ...prev, isLoading, error: null }));

  const setError = (error: string) =>
    setState((prev) => ({ ...prev, error, isLoading: false }));

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);

      if (response.requires_mfa) {
        // MFA required — surface the challenge
        setState((prev) => ({
          ...prev,
          isLoading: false,
          requiresMfa: true,
          mfaSessionToken: response.mfa_session_token ?? null,
        }));
        return;
      }

      // Successful login without MFA
      tokenUtils.setTokens(response.tokens, credentials.remember_me);
      userStorage.set(response.user);

      setState((prev) => ({
        ...prev,
        user: response.user,
        isLoading: false,
      }));

      const destination =
        response.user.role === 'SUPER_ADMIN'
          ? '/super-admin'
          : ROUTES.DASHBOARD;
      router.replace(destination);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string; code?: string }>;
      const message =
        axiosError.response?.data?.message ??
        'Login failed. Please check your credentials.';

      // Surface account lockout message
      if (axiosError.response?.status === 423) {
        setError('Account locked due to too many failed attempts. Try again in 30 minutes.');
      } else if (axiosError.response?.status === 401) {
        setError('Invalid email or password.');
      } else {
        setError(message);
      }
    }
  }, [router]);

  // ── MFA Verify ─────────────────────────────────────────────────────────────
  const verifyMfa = useCallback(async (otp_code: string) => {
    if (!state.mfaSessionToken) {
      setError('Session expired. Please login again.');
      return;
    }

    setLoading(true);
    try {
      const payload: MfaVerifyPayload = {
        mfa_session_token: state.mfaSessionToken,
        otp_code,
      };

      const response = await authService.verifyMfa(payload);

      tokenUtils.setTokens(response.tokens);
      userStorage.set(response.user);

      setState((prev) => ({
        ...prev,
        user: response.user,
        requiresMfa: false,
        mfaSessionToken: null,
        isLoading: false,
      }));

      const destination =
        response.user.role === 'SUPER_ADMIN'
          ? '/super-admin'
          : ROUTES.DASHBOARD;
      router.replace(destination);
    } catch {
      setError('Invalid or expired OTP. Please try again.');
    }
  }, [state.mfaSessionToken, router]);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      clearAuthData();
      setState({
        user: null,
        isLoading: false,
        error: null,
        requiresMfa: false,
        mfaSessionToken: null,
      });
      router.replace(ROUTES.LOGIN);
    }
  }, [router]);

  // ── Clear Error ────────────────────────────────────────────────────────────
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return { ...state, login, verifyMfa, logout, clearError };
};