import Cookies from 'js-cookie';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY, TENANT_KEY } from '../constants/app.constants';
import type { User, AuthTokens, TenantBranding } from '../types';

// ─── Token Helpers ────────────────────────────────────────────────────────────

const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
};

export const tokenUtils = {
  setTokens: (tokens: AuthTokens, rememberMe = false) => {
    const accessExpiry = new Date(Date.now() + tokens.expires_in * 1000);
    const refreshExpiry = rememberMe ? 7 : undefined; // days

    Cookies.set(ACCESS_TOKEN_KEY, tokens.access_token, {
      ...COOKIE_OPTIONS,
      expires: accessExpiry,
    });
    Cookies.set(REFRESH_TOKEN_KEY, tokens.refresh_token, {
      ...COOKIE_OPTIONS,
      expires: refreshExpiry,
    });
  },

  getAccessToken: (): string | null => Cookies.get(ACCESS_TOKEN_KEY) ?? null,
  getRefreshToken: (): string | null => Cookies.get(REFRESH_TOKEN_KEY) ?? null,

  clearTokens: () => {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
  },
};

// ─── User Storage ─────────────────────────────────────────────────────────────

export const userStorage = {
  set: (user: User) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },
  get: (): User | null => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = sessionStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  },
  clear: () => {
    if (typeof window !== 'undefined') sessionStorage.removeItem(USER_KEY);
  },
};

// ─── Tenant Storage ───────────────────────────────────────────────────────────

export const tenantStorage = {
  set: (branding: TenantBranding) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TENANT_KEY, JSON.stringify(branding));
    }
  },
  get: (): TenantBranding | null => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(TENANT_KEY);
      return raw ? (JSON.parse(raw) as TenantBranding) : null;
    } catch {
      return null;
    }
  },
  clear: () => {
    if (typeof window !== 'undefined') localStorage.removeItem(TENANT_KEY);
  },
};

// ─── Clear All Auth Data ──────────────────────────────────────────────────────

export const clearAuthData = () => {
  tokenUtils.clearTokens();
  Cookies.remove('hms_user_role');
  userStorage.clear();
  tenantStorage.clear();
};
