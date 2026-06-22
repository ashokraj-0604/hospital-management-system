import apiClient from '../lib/api-client';
import { userStorage } from '../lib/token.utils';
import type {
  LoginCredentials,
  LoginResponse,
  MfaVerifyPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  TenantBranding,
  AuthTokens,
} from '../types';
import type { ApiResponse } from '../types';

// ─── Auth Service ─────────────────────────────────────────────────────────────

export const authService = {
  /**
   * Authenticate user — returns user + tokens, or MFA challenge
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>(
    '/auth/login',
    credentials,
  );
  return data; // ← was data.data, now just data
},

  /**
   * Verify TOTP / OTP for MFA
   */
  verifyMfa: async (payload: MfaVerifyPayload): Promise<LoginResponse> => {
    const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
      '/auth/mfa/verify',
      payload,
    );
    return data.data;
  },

  /**
   * Refresh access token using refresh token
   */
  refreshToken: async (refresh_token: string): Promise<AuthTokens> => {
    const { data } = await apiClient.post<ApiResponse<AuthTokens>>(
      '/auth/refresh',
      { refresh_token },
    );
    return data.data;
  },

  /**
   * Send forgot-password reset email
   */
  forgotPassword: async (payload: ForgotPasswordPayload): Promise<void> => {
    await apiClient.post('/auth/forgot-password', payload);
  },

  /**
   * Reset password with token from email
   */
  resetPassword: async (payload: ResetPasswordPayload & { email?: string }): Promise<void> => {
  await apiClient.post('/auth/reset-password', payload);
},

  /**
   * Logout — invalidate server-side session
   */
  logout: async (): Promise<void> => {
    const user = userStorage.get();

    // Backend expects userId in the request body for logout invalidation.
    if (!user?.user_id) return;

    await apiClient.post('/auth/logout', { userId: user.user_id });
  },
};

// ─── Tenant Service ───────────────────────────────────────────────────────────

export const tenantService = {
  /**
   * Resolve tenant branding from subdomain (called on login page load)
   */
  resolveBranding: async (subdomain: string): Promise<TenantBranding> => {
    const { data } = await apiClient.get<ApiResponse<TenantBranding>>(
      `/tenants/branding?subdomain=${subdomain}`,
    );
    return data.data;
  },
};