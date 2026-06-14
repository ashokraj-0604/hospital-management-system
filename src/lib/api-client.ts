import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, ROUTES } from '@/src/constants/app.constants';
import type { AuthTokens } from '@/src/types';

// ─── Axios Instance ───────────────────────────────────────────────────────────

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor — Attach Token + Tenant ──────────────────────────────

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get(ACCESS_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Inject hospital subdomain for tenant resolution
    if (typeof window !== 'undefined') {
      const subdomain = window.location.hostname.split('.')[0];
      config.headers['X-Tenant-Subdomain'] = subdomain;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor — Token Refresh ────────────────────────────────────

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

const processRefreshQueue = (token: string) => {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = Cookies.get(REFRESH_TOKEN_KEY);

      if (!refreshToken) {
        // No refresh token — redirect to login
        if (typeof window !== 'undefined') window.location.href = ROUTES.LOGIN;
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve) => {
          refreshQueue.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post<{ data: AuthTokens }>(
          `${API_BASE_URL}/auth/refresh`,
          { refresh_token: refreshToken },
        );

        const newToken = data.data.access_token;
        Cookies.set(ACCESS_TOKEN_KEY, newToken, { secure: true, sameSite: 'strict' });
        processRefreshQueue(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return apiClient(originalRequest);
      } catch {
        Cookies.remove(ACCESS_TOKEN_KEY);
        Cookies.remove(REFRESH_TOKEN_KEY);
        if (typeof window !== 'undefined') window.location.href = ROUTES.LOGIN;
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;