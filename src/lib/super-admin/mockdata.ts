import type { Hospital, PlatformStats, AuditLog, PlatformUser, Invoice } from '@/src/types/super-admin.types';

export const MOCK_STATS: PlatformStats = {
  total_hospitals: 42,
  active_hospitals: 36,
  trial_hospitals: 4,
  suspended_hospitals: 2,
  total_users: 3847,
  total_patients: 128_450,
  new_hospitals_this_month: 5,
  revenue_this_month: 4_85_000,
  revenue_total: 38_40_000,
  hospitals_by_plan: { BASIC: 18, STANDARD: 16, ENTERPRISE: 8 },
  growth: { hospitals: 13.5, users: 8.2, patients: 22.4, revenue: 18.7 },
};

export const MOCK_HOSPITALS: Hospital[] = [
  {
    hospital_id: 'h-001', hospital_code: 'APOLLO-CHN', hospital_name: 'Apollo Hospitals Chennai',
    address: '21 Greams Lane', city: 'Chennai', state: 'Tamil Nadu', pincode: '600006',
    country: 'India', primary_phone: '+91 44 2829 0200', primary_email: 'info@apollochennai.com',
    timezone: 'Asia/Kolkata', currency: 'INR', is_active: true, status: 'ACTIVE',
    subscription_plan: 'ENTERPRISE', subscription_expires_at: '2026-12-31T00:00:00Z',
    total_beds: 560, total_users: 420, total_patients: 32000,
    primary_color: '#0057A8', secondary_color: '#003876', app_name: 'Apollo HMS',
    mrn_prefix: 'APL', created_at: '2024-01-15T09:00:00Z', updated_at: '2025-06-01T10:00:00Z',
  },
  {
    hospital_id: 'h-002', hospital_code: 'FORTIS-BLR', hospital_name: 'Fortis Hospital Bangalore',
    address: '154/9 Bannerghatta Rd', city: 'Bangalore', state: 'Karnataka', pincode: '560076',
    country: 'India', primary_phone: '+91 80 6621 4444', primary_email: 'info@fortisblr.com',
    timezone: 'Asia/Kolkata', currency: 'INR', is_active: true, status: 'ACTIVE',
    subscription_plan: 'STANDARD', subscription_expires_at: '2026-03-31T00:00:00Z',
    total_beds: 280, total_users: 195, total_patients: 18500,
    primary_color: '#E31837', secondary_color: '#8B0000', app_name: 'Fortis HMS',
    mrn_prefix: 'FOR', created_at: '2024-03-10T09:00:00Z', updated_at: '2025-05-15T10:00:00Z',
  },
  {
    hospital_id: 'h-003', hospital_code: 'NIMHANS', hospital_name: 'NIMHANS Bangalore',
    address: 'Hosur Road', city: 'Bangalore', state: 'Karnataka', pincode: '560029',
    country: 'India', primary_phone: '+91 80 2699 5000', primary_email: 'admin@nimhans.ac.in',
    timezone: 'Asia/Kolkata', currency: 'INR', is_active: true, status: 'TRIAL',
    subscription_plan: 'BASIC', subscription_expires_at: '2025-07-31T00:00:00Z',
    total_beds: 720, total_users: 68, total_patients: 4200,
    primary_color: '#2E75B6', secondary_color: '#1B3A5C', app_name: 'NIMHANS HMS',
    mrn_prefix: 'NIM', created_at: '2025-05-01T09:00:00Z', updated_at: '2025-06-01T10:00:00Z',
  },
  {
    hospital_id: 'h-004', hospital_code: 'AIIMS-DEL', hospital_name: 'AIIMS New Delhi',
    address: 'Ansari Nagar East', city: 'New Delhi', state: 'Delhi', pincode: '110029',
    country: 'India', primary_phone: '+91 11 2659 3308', primary_email: 'director@aiims.edu',
    timezone: 'Asia/Kolkata', currency: 'INR', is_active: false, status: 'SUSPENDED',
    subscription_plan: 'ENTERPRISE', subscription_expires_at: '2025-01-01T00:00:00Z',
    total_beds: 2500, total_users: 0, total_patients: 95000,
    primary_color: '#1A3C6E', secondary_color: '#0D1F3C', app_name: 'AIIMS HMS',
    mrn_prefix: 'AII', created_at: '2023-08-20T09:00:00Z', updated_at: '2025-01-05T10:00:00Z',
  },
  {
    hospital_id: 'h-005', hospital_code: 'CARE-HYD', hospital_name: 'Care Hospitals Hyderabad',
    address: 'Road No 1, Banjara Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500034',
    country: 'India', primary_phone: '+91 40 3041 8888', primary_email: 'info@carehospitals.com',
    timezone: 'Asia/Kolkata', currency: 'INR', is_active: true, status: 'ACTIVE',
    subscription_plan: 'STANDARD', subscription_expires_at: '2026-06-30T00:00:00Z',
    total_beds: 350, total_users: 210, total_patients: 22000,
    primary_color: '#006838', secondary_color: '#004225', app_name: 'Care HMS',
    mrn_prefix: 'CAR', created_at: '2024-07-01T09:00:00Z', updated_at: '2025-06-05T10:00:00Z',
  },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { log_id: 'l-001', hospital_id: 'h-001', hospital_name: 'Apollo Hospitals Chennai', user_id: 'u-001', user_name: 'Super Admin', action: 'CREATE', resource: 'hospital', resource_id: 'h-001', ip_address: '103.21.45.12', created_at: '2025-06-10T09:15:00Z' },
  { log_id: 'l-002', hospital_id: 'h-002', hospital_name: 'Fortis Hospital Bangalore', user_id: 'u-001', user_name: 'Super Admin', action: 'UPDATE', resource: 'subscription', resource_id: 'h-002', ip_address: '103.21.45.12', created_at: '2025-06-09T14:30:00Z' },
  { log_id: 'l-003', hospital_id: 'h-004', hospital_name: 'AIIMS New Delhi', user_id: 'u-001', user_name: 'Super Admin', action: 'SUSPEND', resource: 'hospital', resource_id: 'h-004', ip_address: '103.21.45.12', created_at: '2025-06-08T11:00:00Z' },
  { log_id: 'l-004', hospital_id: 'h-003', hospital_name: 'NIMHANS Bangalore', user_id: 'u-001', user_name: 'Super Admin', action: 'CREATE', resource: 'hospital', resource_id: 'h-003', ip_address: '103.21.45.12', created_at: '2025-06-07T16:45:00Z' },
  { log_id: 'l-005', hospital_id: 'h-005', hospital_name: 'Care Hospitals Hyderabad', user_id: 'u-001', user_name: 'Super Admin', action: 'UPDATE', resource: 'modules', resource_id: 'h-005', ip_address: '103.21.45.12', created_at: '2025-06-06T10:20:00Z' },
];

export const MOCK_USERS: PlatformUser[] = [
  { user_id: 'u-001', full_name: 'Dr. Ravi Kumar', email: 'ravi@apollochennai.com', role: 'HOSPITAL_ADMIN', hospital_id: 'h-001', hospital_name: 'Apollo Hospitals Chennai', is_active: true, is_mfa_enabled: true, last_login_at: '2025-06-10T08:30:00Z', created_at: '2024-01-16T09:00:00Z' },
  { user_id: 'u-002', full_name: 'Dr. Priya Sharma', email: 'priya@fortisblr.com', role: 'DOCTOR', hospital_id: 'h-002', hospital_name: 'Fortis Hospital Bangalore', is_active: true, is_mfa_enabled: false, last_login_at: '2025-06-09T14:00:00Z', created_at: '2024-03-12T09:00:00Z' },
  { user_id: 'u-003', full_name: 'Nurse Lakshmi', email: 'lakshmi@nimhans.ac.in', role: 'NURSE', hospital_id: 'h-003', hospital_name: 'NIMHANS Bangalore', is_active: true, is_mfa_enabled: false, last_login_at: '2025-06-08T10:00:00Z', created_at: '2025-05-02T09:00:00Z' },
  { user_id: 'u-004', full_name: 'Anil Receptionist', email: 'anil@carehyd.com', role: 'RECEPTIONIST', hospital_id: 'h-005', hospital_name: 'Care Hospitals Hyderabad', is_active: false, is_mfa_enabled: false, last_login_at: undefined, created_at: '2024-07-05T09:00:00Z' },
  { user_id: 'u-005', full_name: 'Dr. Mehta Billing', email: 'mehta@apollochennai.com', role: 'BILLING_OFFICER', hospital_id: 'h-001', hospital_name: 'Apollo Hospitals Chennai', is_active: true, is_mfa_enabled: true, last_login_at: '2025-06-10T07:45:00Z', created_at: '2024-02-01T09:00:00Z' },
  { user_id: 'u-006', full_name: 'Sanjay Pharma', email: 'sanjay@fortisblr.com', role: 'PHARMACIST', hospital_id: 'h-002', hospital_name: 'Fortis Hospital Bangalore', is_active: true, is_mfa_enabled: false, last_login_at: '2025-06-07T13:00:00Z', created_at: '2024-04-01T09:00:00Z' },
];

export const MOCK_INVOICES: Invoice[] = [
  { invoice_id: 'inv-001', invoice_no: 'INV-2025-0041', hospital_id: 'h-001', hospital_name: 'Apollo Hospitals Chennai', subscription_plan: 'ENTERPRISE', amount: 120000, tax: 21600, total: 141600, status: 'PAID', due_date: '2025-06-01', paid_at: '2025-05-28', period_from: '2025-06-01', period_to: '2025-06-30', created_at: '2025-05-25T09:00:00Z' },
  { invoice_id: 'inv-002', invoice_no: 'INV-2025-0042', hospital_id: 'h-002', hospital_name: 'Fortis Hospital Bangalore', subscription_plan: 'STANDARD', amount: 60000, tax: 10800, total: 70800, status: 'PAID', due_date: '2025-06-01', paid_at: '2025-05-30', period_from: '2025-06-01', period_to: '2025-06-30', created_at: '2025-05-25T09:00:00Z' },
  { invoice_id: 'inv-003', invoice_no: 'INV-2025-0043', hospital_id: 'h-003', hospital_name: 'NIMHANS Bangalore', subscription_plan: 'BASIC', amount: 20000, tax: 3600, total: 23600, status: 'PENDING', due_date: '2025-06-15', period_from: '2025-06-01', period_to: '2025-06-30', created_at: '2025-06-01T09:00:00Z' },
  { invoice_id: 'inv-004', invoice_no: 'INV-2025-0038', hospital_id: 'h-004', hospital_name: 'AIIMS New Delhi', subscription_plan: 'ENTERPRISE', amount: 120000, tax: 21600, total: 141600, status: 'OVERDUE', due_date: '2025-05-01', period_from: '2025-05-01', period_to: '2025-05-31', created_at: '2025-04-25T09:00:00Z' },
  { invoice_id: 'inv-005', invoice_no: 'INV-2025-0044', hospital_id: 'h-005', hospital_name: 'Care Hospitals Hyderabad', subscription_plan: 'STANDARD', amount: 60000, tax: 10800, total: 70800, status: 'PAID', due_date: '2025-06-01', paid_at: '2025-06-01', period_from: '2025-06-01', period_to: '2025-06-30', created_at: '2025-05-25T09:00:00Z' },
  { invoice_id: 'inv-006', invoice_no: 'INV-2025-0035', hospital_id: 'h-002', hospital_name: 'Fortis Hospital Bangalore', subscription_plan: 'STANDARD', amount: 60000, tax: 10800, total: 70800, status: 'CANCELLED', due_date: '2025-04-01', period_from: '2025-04-01', period_to: '2025-04-30', created_at: '2025-03-25T09:00:00Z' },
];