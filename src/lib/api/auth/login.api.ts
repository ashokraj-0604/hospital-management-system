import { API_ENDPOINTS } from '@/src/constants/api-endpoints';
import { apiClient } from '@/src/lib/api/client';
import type { AuthTokens, LoginPayload, UserSession } from '@/src/types';

interface LoginResponse {
  tokens: AuthTokens;
  user: UserSession;
}

export const loginApi = {
  login: (payload: LoginPayload) =>
    apiClient<LoginResponse>(API_ENDPOINTS.auth.login, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
