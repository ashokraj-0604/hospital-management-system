import { apiClient } from '@/src/lib/api/client';

export const logoutApi = {
  logout: () => apiClient<void>('/auth/logout', { method: 'POST' }),
};
