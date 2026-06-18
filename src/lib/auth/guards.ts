import { getAccessToken } from './session';

export function isAuthenticated() {
  return Boolean(getAccessToken());
}
