// ─── MedSocio Brand ───────────────────────────────────────────────────────────

export const BRAND = {
  name: 'MedSocio',
  tagline: 'Healthcare, intelligently managed.',
  logo: '/logo_colour.png',
  colors: {
    primary:      '#33ABC3',
    primaryDark:  '#1D8FA8',
    primaryLight: '#E8F8FB',
    accent:       '#0D6778',
    surface:      '#F4FAFB',
    card:         '#FFFFFF',
    border:       '#D6EFF4',
    textPrimary:  '#0D2F36',
    textSecondary:'#4A7C87',
    textMuted:    '#8AACB3',
    success:      '#16A34A',
    warning:      '#D97706',
    error:        '#DC2626',
    info:         '#33ABC3',
  },
} as const;

export const SUPER_ADMIN_ROLE = 'SUPER_ADMIN';
export const SUBSCRIPTION_TIERS = ['BASIC', 'STANDARD', 'ENTERPRISE'] as const;
export type SubscriptionTier = typeof SUBSCRIPTION_TIERS[number];
export const HOSPITAL_STATUS = ['ACTIVE', 'SUSPENDED', 'TRIAL', 'EXPIRED'] as const;
export type HospitalStatus = typeof HOSPITAL_STATUS[number];