// src/types/hospital-admin.types.ts

export type AppointmentType = 'OPD' | 'IPD' | 'EMERGENCY';
export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface Appointment {
  appointment_id: string;
  patient_id: string;
  patient_name: string;
  doctor_id: string;
  doctor_name: string;
  department: string;
  type: AppointmentType;
  status: AppointmentStatus;
  scheduled_at: string; // ISO timestamp
}

export interface Patient {
  patient_id: string;
  mrn: string;
  full_name: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone: string;
  registered_at: string;
}

export type BedWardType = 'GENERAL' | 'ICU' | 'MATERNITY' | 'PAEDIATRICS' | 'PRIVATE';

export interface BedWard {
  ward_id: string;
  ward_name: string;
  ward_type: BedWardType;
  total_beds: number;
  occupied_beds: number;
}

export interface HospitalDashboardStats {
  total_patients_today: number;
  new_registrations_today: number;
  patients_growth_pct: number;

  beds_available: number;
  beds_total: number;
  beds_occupied_delta: number; // negative = fewer available than yesterday

  appointments_today: number;
  appointments_pending: number;
  appointments_growth: number;

  revenue_today: number;
  revenue_mtd: number;
  revenue_growth_pct: number;
}

export type ActivityAction =
  | 'ADMIT' | 'DISCHARGE' | 'INVOICE' | 'LAB_RESULT'
  | 'APPOINTMENT_BOOKED' | 'APPOINTMENT_CANCELLED';

export interface ActivityLog {
  log_id: string;
  action: ActivityAction;
  description: string;
  created_at: string; // ISO timestamp
}

export interface HospitalAdminProfile {
  user_id: string;
  full_name: string;
  email: string;
  role: 'HOSPITAL_ADMIN';
  hospital_id: string;
  hospital_name: string;
  hospital_code: string;
  primary_color: string;
}