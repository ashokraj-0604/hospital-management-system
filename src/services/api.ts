/**
 * Axios HTTP client instance with Platform Admin authentication
 * Includes request/response interceptors for bearer token auth and error handling
 */

import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { ApiErrorResponse } from '../types/hospital.types';

// Store for the platform admin token (in-memory, not localStorage for security)
let platformAdminToken: string | null = null;

/**
 * Set the platform admin token (called after login/auth)
 */
export const setPlatformAdminToken = (token: string): void => {
  platformAdminToken = token;
};

/**
 * Get the currently stored platform admin token
 */
export const getPlatformAdminToken = (): string | null => {
  return platformAdminToken;
};

/**
 * Clear the platform admin token (on logout)
 */
export const clearPlatformAdminToken = (): void => {
  platformAdminToken = null;
};

/**
 * Create and configure Axios instance with auth interceptors
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  /**
   * Request interceptor: Add Authorization header with platform admin token
   */
  client.interceptors.request.use(
    (config) => {
      if (platformAdminToken) {
        config.headers.Authorization = `Bearer ${platformAdminToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  /**
   * Response interceptor: Handle errors and redirect on 401
   */
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const apiError = error.response?.data as ApiErrorResponse | undefined;

      // Handle 401 Unauthorized - redirect to login
      if (error.response?.status === 401) {
        clearPlatformAdminToken();
        // Emit event or dispatch action to redirect to login page
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        return Promise.reject({
          statusCode: 401,
          message: 'Unauthorized. Please log in again.',
          originalError: error,
        });
      }

      // Handle 403 Forbidden
      if (error.response?.status === 403) {
        return Promise.reject({
          statusCode: 403,
          message: 'Insufficient permissions. Platform Admin access required.',
          originalError: error,
        });
      }

      // Handle 404 Not Found
      if (error.response?.status === 404) {
        return Promise.reject({
          statusCode: 404,
          message: apiError?.message || 'Resource not found.',
          originalError: error,
        });
      }

      // Handle 409 Conflict
      if (error.response?.status === 409) {
        return Promise.reject({
          statusCode: 409,
          message: apiError?.message || 'Conflict: Resource already exists or constraint violated.',
          originalError: error,
        });
      }

      // Handle 5xx Server Errors
      if (error.response?.status && error.response.status >= 500) {
        return Promise.reject({
          statusCode: error.response.status,
          message: apiError?.message || 'Server error. Please try again later.',
          originalError: error,
        });
      }

      // Generic error handling
      return Promise.reject({
        statusCode: error.response?.status || 0,
        message: apiError?.message || error.message || 'An unexpected error occurred.',
        originalError: error,
      });
    }
  );

  return client;
};

// Create singleton instance
const apiClient = createApiClient();

export default apiClient;

/**
 * Custom hook for handling API errors in components
 */
export const useApiErrorHandler = () => {
  const handleError = (error: unknown): { message: string; statusCode: number } => {
    if (axios.isAxiosError(error)) {
      const apiError = error.response?.data as ApiErrorResponse | undefined;
      return {
        message: apiError?.message || error.message || 'An error occurred',
        statusCode: error.response?.status || 500,
      };
    }

    if (typeof error === 'object' && error !== null && 'message' in error) {
      return {
        message: (error as { message: string }).message,
        statusCode: (error as { statusCode?: number }).statusCode || 500,
      };
    }

    return {
      message: 'An unexpected error occurred',
      statusCode: 500,
    };
  };

  return { handleError };
};
