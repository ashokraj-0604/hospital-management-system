// ─── App Constants ────────────────────────────────────────────────────────────

export const APP_NAME = 'HMS Platform';
export const APP_VERSION = '2.0.0';

// API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

// Auth
export const ACCESS_TOKEN_KEY = '???';
export const REFRESH_TOKEN_KEY = '???';
export const USER_KEY = 'hms_user';
export const TENANT_KEY = 'hms_tenant';

export const TOKEN_EXPIRY_BUFFER = 60; // seconds before expiry to refresh

// Account lockout
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MINUTES = 30;

// Routes
export const ROUTES = {
  LOGIN: '/login',
  FORGOT_PASSWORD: '/login/forgot-password',
  RESET_PASSWORD: '/login/reset-password',
  MFA: '/login/mfa',
  DASHBOARD: '/dashboard',
  PATIENTS: '/dashboard/patients',
  APPOINTMENTS: '/dashboard/appointments',
  IPD: '/dashboard/ipd',
  PHARMACY: '/dashboard/pharmacy',
  LAB: '/dashboard/lab',
  BILLING: '/dashboard/billing',
  REPORTS: '/dashboard/reports',
  SETTINGS: '/dashboard/settings',
} as const;

// RBAC — which roles can access which sections
export const ROLE_ROUTE_ACCESS: Record<string, string[]> = {
  SUPER_ADMIN: ['*'],
  HOSPITAL_ADMIN: ['*'],
  DOCTOR: ['/dashboard', '/dashboard/patients', '/dashboard/appointments', '/dashboard/ipd', '/dashboard/lab'],
  NURSE: ['/dashboard', '/dashboard/patients', '/dashboard/ipd'],
  RECEPTIONIST: ['/dashboard', '/dashboard/patients', '/dashboard/appointments', '/dashboard/billing'],
  PHARMACIST: ['/dashboard', '/dashboard/pharmacy'],
  LAB_TECHNICIAN: ['/dashboard', '/dashboard/lab'],
  BILLING_OFFICER: ['/dashboard', '/dashboard/billing'],
  INVENTORY_MANAGER: ['/dashboard', '/dashboard/pharmacy'],
};

// Branding defaults (used until tenant config is loaded)
export const DEFAULT_BRANDING = {
  primary_color: '#2E75B6',
  secondary_color: '#1B3A5C',
  app_name: 'HMS Platform',
  login_tagline: 'Unified Healthcare Management',
};