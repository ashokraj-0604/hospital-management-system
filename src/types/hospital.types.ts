/**
 * Hospital Management System - Super Admin Dashboard
 * Type definitions for Hospital, TenantConfig, and Module entities
 */

/**
 * Hospital / Tenant entity representing a healthcare facility on the platform
 */
export interface Hospital {
  hospital_id: string;           // UUID
  hospital_code: string;         // e.g. 'APOLLO-MUM'
  hospital_name: string;
  legal_entity_name?: string;
  gstin?: string;
  registration_no?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;               // default: 'India'
  primary_phone: string;
  primary_email: string;
  website_url?: string;
  timezone: string;              // default: 'Asia/Kolkata'
  currency: string;              // default: 'INR'
  is_active: boolean;
  subscription_plan: 'BASIC' | 'PRO' | 'ENTERPRISE';
  subscription_expires_at?: string; // ISO timestamp, null = perpetual
  created_at: string;
  updated_at: string;
}

/**
 * Tenant branding and configuration
 */
export interface TenantConfig {
  config_id: string;
  hospital_id: string;
  app_name: string;
  logo_url?: string;
  favicon_url?: string;
  primary_color: string;         // hex e.g. '#2E75B6'
  secondary_color: string;       // hex e.g. '#1B3A5C'
  font_family: string;
  login_banner_url?: string;
  login_tagline?: string;
  support_phone?: string;
  support_email?: string;
  mrn_prefix: string;
  mrn_sequence_start: number;
}

/**
 * Module flag representing feature availability per tenant
 */
export interface TenantModule {
  module_id: string;
  hospital_id: string;
  module_code: string;
  is_enabled: boolean;
  enabled_at?: string;
  enabled_by?: string;
  config_json?: Record<string, unknown>;
}

/**
 * Available module codes in the HMS platform
 */
export type ModuleCode = 
  | 'PATIENT_MGMT'
  | 'APPOINTMENT'
  | 'IPD'
  | 'OPD'
  | 'EHR'
  | 'LAB'
  | 'PHARMACY'
  | 'BILLING'
  | 'INVENTORY'
  | 'REPORTING'
  | 'EMERGENCY'
  | 'ABDM';

/**
 * Module metadata with descriptions and defaults
 */
export interface ModuleMetadata {
  code: ModuleCode;
  label: string;
  description: string;
  isCore: boolean;  // true = enabled by default on new hospitals
}

export const MODULE_CATALOG: Record<ModuleCode, ModuleMetadata> = {
  PATIENT_MGMT: {
    code: 'PATIENT_MGMT',
    label: 'Patient Management',
    description: 'Core patient registration and profile management',
    isCore: true,
  },
  APPOINTMENT: {
    code: 'APPOINTMENT',
    label: 'Appointment',
    description: 'Appointment scheduling and management',
    isCore: true,
  },
  IPD: {
    code: 'IPD',
    label: 'In-Patient Department',
    description: 'Inpatient admission and management',
    isCore: true,
  },
  OPD: {
    code: 'OPD',
    label: 'Out-Patient Department',
    description: 'Outpatient consultation management',
    isCore: true,
  },
  EHR: {
    code: 'EHR',
    label: 'Electronic Health Records',
    description: 'Comprehensive digital health records',
    isCore: true,
  },
  LAB: {
    code: 'LAB',
    label: 'Laboratory',
    description: 'Lab test orders and results management',
    isCore: false,
  },
  PHARMACY: {
    code: 'PHARMACY',
    label: 'Pharmacy',
    description: 'Medication and prescription management',
    isCore: false,
  },
  BILLING: {
    code: 'BILLING',
    label: 'Billing',
    description: 'Billing and invoicing system',
    isCore: true,
  },
  INVENTORY: {
    code: 'INVENTORY',
    label: 'Inventory',
    description: 'Medical inventory and stock management',
    isCore: false,
  },
  REPORTING: {
    code: 'REPORTING',
    label: 'Reporting',
    description: 'Analytics and reporting dashboard',
    isCore: false,
  },
  EMERGENCY: {
    code: 'EMERGENCY',
    label: 'Emergency',
    description: 'Emergency department management',
    isCore: false,
  },
  ABDM: {
    code: 'ABDM',
    label: 'ABDM',
    description: 'Ayushman Bharat Digital Mission integration',
    isCore: false,
  },
};

/**
 * API Response envelope for error handling
 */
export interface ApiErrorResponse {
  statusCode: number;
  error: string;
  message: string;
  timestamp: string;
  path: string;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

/**
 * Subscription plan configuration
 */
export interface SubscriptionPlan {
  plan: 'BASIC' | 'PRO' | 'ENTERPRISE';
  label: string;
  color: string;
}

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  BASIC: {
    plan: 'BASIC',
    label: 'Basic',
    color: 'bg-blue-100 text-blue-800',
  },
  PRO: {
    plan: 'PRO',
    label: 'Professional',
    color: 'bg-purple-100 text-purple-800',
  },
  ENTERPRISE: {
    plan: 'ENTERPRISE',
    label: 'Enterprise',
    color: 'bg-amber-100 text-amber-800',
  },
};

/**
 * Audit log entry for cross-tenant tracking
 */
export interface AuditLog {
  log_id: string;
  hospital_id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  ip_address: string;
  changes?: Record<string, unknown>;
  created_at: string;
}

/**
 * KPI metrics for the dashboard overview
 */
export interface DashboardMetrics {
  totalHospitals: number;
  activeHospitals: number;
  suspendedHospitals: number;
  expiringSubscriptions: number;
  planCounts: Record<'BASIC' | 'PRO' | 'ENTERPRISE', number>;
}
