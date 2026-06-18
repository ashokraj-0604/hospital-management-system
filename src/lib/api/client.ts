import { getAccessToken } from '@/src/lib/auth/session';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export async function apiClient<TResponse>(path: string, init?: RequestInit): Promise<TResponse> {
  const token = getAccessToken();
  const headers = new Headers(init?.headers);

  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', 'Bearer ' + token);
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return {} as TResponse;
  }

  return (await response.json()) as TResponse;
}
