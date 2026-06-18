import { apiClient } from '@/src/lib/api/client';
import type { AuthTokens } from '@/src/types';

export const refreshApi = {
  refresh: () => apiClient<AuthTokens>('/auth/refresh', { method: 'POST' }),
};
