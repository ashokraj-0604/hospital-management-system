export interface LoginCredentials {
  email: string;
  password: string;
}

export interface MfaVerifyPayload {
  mfa_session_token: string;
  otp_code: string;
}

export interface User {
  user_id: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: string;
  hospital_id: string;
  department_id?: string;
  is_active: boolean;
  is_mfa_enabled: boolean;
  mfa_secret?: string;
  avatar_url?: string;
  login_attempts: number;
  locked_until?: string;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface MfaSession {
  session_id: string;
  userId: string;
  email: string;
  createdAt: string;
  expiresAt: string;
}
