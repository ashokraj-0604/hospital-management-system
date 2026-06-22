// ─── MedSocio Brand ───────────────────────────────────────────────────────────
export const DASHBOARD_THEME = {
  primary: '#33ABC3',
  dark: '#0D2F36',
  light: '#4A7C87',
  border: '#D6EFF4',
  surface: '#E8F8FB',
};
export const BRAND = {
  name: 'MedSocio',
  tagline: 'Healthcare, intelligently managed.',
  logo: '/logo_colour.png',
  colors: {
    primary:      '#33ABC3',
    primaryDark:  '#1D8FA8',
    primaryLight: '#E8F8FB',
    accent:       '#0D6778',
    textDark:    '#0D2F36',
    textMid:     '#4A7C87',
    textLight:   '#8AACB3',
    surface:      '#F4FAFB',
    surfaceTint: '#F4FAFB',
    card:         '#FFFFFF',
    border:       '#D6EFF4',
    borderTint:   '#D6EFF4',
    textPrimary:  '#0D2F36',
    textSecondary:'#4A7C87',
    textMuted:    '#8AACB3',
    success:      '#16A34A',
    warning:      '#D97706',
    error:        '#DC2626',
    info:         '#33ABC3',
    iconBgTeal:   '#E8F8FB',
  },
} as const;
export type HospitalAdminNavKey =
  | 'dashboard'
  | 'patients'
  | 'appointments'
  | 'beds'
  | 'doctors'
  | 'laboratory'
  | 'pharmacy'
  | 'billing'
  | 'reports'
  | 'staff'
  | 'settings';

export const SUPER_ADMIN_ROLE = 'SUPER_ADMIN';
export const SUBSCRIPTION_TIERS = ['BASIC', 'STANDARD', 'ENTERPRISE'] as const;
export type SubscriptionTier = typeof SUBSCRIPTION_TIERS[number];
export const HOSPITAL_STATUS = ['ACTIVE', 'SUSPENDED', 'TRIAL', 'EXPIRED'] as const;
export type HospitalStatus = typeof HOSPITAL_STATUS[number];