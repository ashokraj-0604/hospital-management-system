// Hospital-level stats
export interface HospitalStats {
  todayOPD: number;
  todayOPDDelta: number; // % vs yesterday
  occupiedBeds: number;
  totalBeds: number;
  todayRevenue: number; // INR
  todayRevenueDelta: number;
  pendingLabTests: number;
  pendingPrescriptions: number;
  scheduledSurgeries: number;
  newPatients: number;
}

// Patient
export type PatientGender = 'MALE' | 'FEMALE' | 'OTHER';
export type PatientStatus = 'ACTIVE' | 'DISCHARGED' | 'DECEASED';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface Patient {
  id: string;
  mrn: string; // e.g. MRN-2024-00123
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO
  gender: PatientGender;
  bloodGroup?: BloodGroup;
  phone: string;
  email?: string;
  address: string;
  city: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  status: PatientStatus;
  registeredAt: string;
  lastVisit?: string;
}

export interface RegisterPatientDto {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: PatientGender;
  bloodGroup?: BloodGroup;
  phone: string;
  email?: string;
  address: string;
  city: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

// Appointments
export type AppointmentStatus = 'SCHEDULED' | 'CHECKED_IN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
export type AppointmentType = 'NEW_VISIT' | 'FOLLOW_UP' | 'EMERGENCY' | 'TELECONSULT';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  doctorId: string;
  doctorName: string;
  department: string;
  scheduledAt: string; // ISO datetime
  duration: number; // minutes
  type: AppointmentType;
  status: AppointmentStatus;
  chiefComplaint?: string;
  notes?: string;
  tokenNumber?: number;
}

export interface CreateAppointmentDto {
  patientId: string;
  doctorId: string;
  scheduledAt: string;
  duration: number;
  type: AppointmentType;
  chiefComplaint?: string;
}

// IPD
export type IPDStatus = 'ADMITTED' | 'ICU' | 'SURGERY' | 'RECOVERING' | 'DISCHARGED';
export type WardType = 'GENERAL' | 'PRIVATE' | 'SEMI_PRIVATE' | 'ICU' | 'NICU' | 'HDU';

export interface IPDAdmission {
  id: string;
  admissionNumber: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  admittingDoctorId: string;
  admittingDoctorName: string;
  admissionDate: string;
  expectedDischarge?: string;
  actualDischarge?: string;
  ward: WardType;
  bedNumber: string;
  roomNumber: string;
  status: IPDStatus;
  diagnosis: string;
  notes?: string;
}

// Pharmacy
export type PrescriptionStatus = 'PENDING' | 'PARTIAL' | 'DISPENSED' | 'CANCELLED';
export interface PrescriptionItem {
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  dispensedQuantity: number;
  instructions?: string;
}
export interface Prescription {
  id: string;
  prescriptionNumber: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  doctorName: string;
  issuedAt: string;
  status: PrescriptionStatus;
  items: PrescriptionItem[];
  totalAmount: number;
}

// Lab
export type LabTestStatus = 'ORDERED' | 'SAMPLE_COLLECTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export interface LabTestOrder {
  id: string;
  orderNumber: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  doctorName: string;
  orderedAt: string;
  completedAt?: string;
  status: LabTestStatus;
  tests: Array<{
    name: string;
    category: string;
    result?: string;
    unit?: string;
    referenceRange?: string;
    isAbnormal?: boolean;
  }>;
  reportUrl?: string;
}

// Billing
export type BillStatus = 'DRAFT' | 'PENDING' | 'PARTIAL' | 'PAID' | 'CANCELLED' | 'REFUNDED';
export type PaymentMode = 'CASH' | 'CARD' | 'UPI' | 'NETBANKING' | 'INSURANCE' | 'CREDIT';
export interface BillItem {
  description: string;
  category: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
}
export interface PatientBill {
  id: string;
  billNumber: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  billDate: string;
  dueDate?: string;
  status: BillStatus;
  items: BillItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  paidAmount: number;
  balance: number;
  paymentMode?: PaymentMode;
  insuranceClaim?: string;
}

// Doctor / Staff
export interface Doctor {
  id: string;
  name: string;
  department: string;
  specialization: string;
  qualification: string;
  phone: string;
  email: string;
  isAvailable: boolean;
}