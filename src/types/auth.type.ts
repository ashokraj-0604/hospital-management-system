// ─── Auth Types ───────────────────────────────────────────────────────────────

export type UserRole =
  | 'SUPER_ADMIN'
  | 'HOSPITAL_ADMIN'
  | 'DOCTOR'
  | 'NURSE'
  | 'RECEPTIONIST'
  | 'PHARMACIST'
  | 'LAB_TECHNICIAN'
  | 'BILLING_OFFICER'
  | 'INVENTORY_MANAGER';

export interface User {
  user_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  hospital_id: string;
  department_id?: string;
  is_mfa_enabled: boolean;
  avatar_url?: string;
  last_login_at?: string;
}

export interface TenantBranding {
  hospital_id: string;
  hospital_name: string;
  app_name: string;
  logo_url?: string;
  favicon_url?: string;
  primary_color: string;
  secondary_color: string;
  login_banner_url?: string;
  login_tagline?: string;
  support_phone?: string;
  support_email?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
  requires_mfa: boolean;
  mfa_session_token?: string;
}

export interface MfaVerifyPayload {
  mfa_session_token: string;
  otp_code: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  new_password: string;
  confirm_password: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}