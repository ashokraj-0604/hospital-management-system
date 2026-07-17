import type { HospitalStatus, SubscriptionTier } from '@/src/constants/brand.constants';

export interface Hospital {
  hospital_id: string;
  hospital_code: string;
  hospital_name: string;
  legal_entity_name?: string;
  gstin?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  primary_phone: string;
  primary_email: string;
  website_url?: string;
  timezone: string;
  currency: string;
  is_active: boolean;
  status: HospitalStatus;
  subscription_plan: SubscriptionTier;
  subscription_expires_at?: string;
  total_beds?: number;
  total_users?: number;
  total_patients?: number;
  created_at: string;
  updated_at: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  app_name: string;
  mrn_prefix: string;
}

export interface HospitalCreatePayload {
  hospital_id?: string;
  hospital_name: string;
  hospital_code: string;
  legal_entity_name?: string;
  gstin?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  primary_phone: string;
  primary_email: string;
  subscription_plan: SubscriptionTier;
  subscription_expires_at?: string;
  mrn_prefix: string;
  admin_name: string;
  admin_email: string;
  admin_password: string;
  modules: string[];
}

export interface PlatformStats {
  total_hospitals: number;
  active_hospitals: number;
  trial_hospitals: number;
  suspended_hospitals: number;
  total_users: number;
  total_patients: number;
  new_hospitals_this_month: number;
  revenue_this_month: number;
  revenue_total: number;
  hospitals_by_plan: { BASIC: number; STANDARD: number; ENTERPRISE: number };
  growth: { hospitals: number; users: number; patients: number; revenue: number };
}

export interface TenantModule {
  module_key: string;
  module_name: string;
  is_enabled: boolean;
  required_plan: SubscriptionTier;
}

export interface AuditLog {
  log_id: string;
  hospital_id: string;
  hospital_name: string;
  user_id: string;
  user_name: string;
  action: string;
  resource: string;
  resource_id?: string;
  ip_address?: string;
  created_at: string;
}

export interface SuperAdminUser {
  user_id: string;
  email: string;
  full_name: string;
  role: 'SUPER_ADMIN';
  avatar_url?: string;
  last_login_at?: string;
}

export interface PlatformUser {
  user_id: string;
  full_name: string;
  email: string;
  role: string;
  hospital_id: string;
  hospital_name: string;
  is_active: boolean;
  is_mfa_enabled: boolean;
  last_login_at?: string;
  created_at: string;
}

export type InvoiceStatus = 'PAID' | 'PENDING' | 'OVERDUE' | 'CANCELLED';

export interface Invoice {
  invoice_id: string;
  invoice_no: string;
  hospital_id: string;
  hospital_name: string;
  subscription_plan: string;
  amount: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  due_date: string;
  paid_at?: string;
  period_from: string;
  period_to: string;
  created_at: string;
}

export interface AddHospitalFormValues {
  hospital_id: string;
  hospital_name: string;
  hospital_code: string;
  legal_entity_name: string;
  gstin: string;
  registration_no: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  primary_phone: string;
  primary_email: string;
  website_url: string;
  subscription_plan: string;
  subscription_expires_at: string;
  mrn_prefix: string;
  total_beds: number;
  modules: string[];
  admin_name: string;
  admin_email: string;
  admin_password: string;
  primary_color: string;
  secondary_color: string;
  app_name: string;
}