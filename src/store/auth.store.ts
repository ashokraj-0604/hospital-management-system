import { create } from 'zustand';
import type { AuthTokens, UserSession } from '@/src/types';

interface AuthState {
  user: UserSession | null;
  tokens: AuthTokens | null;
  setAuthState: (payload: { user: UserSession; tokens: AuthTokens }) => void;
  clearAuthState: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  tokens: null,
  setAuthState: (payload) => set({ user: payload.user, tokens: payload.tokens }),
  clearAuthState: () => set({ user: null, tokens: null }),
}));
