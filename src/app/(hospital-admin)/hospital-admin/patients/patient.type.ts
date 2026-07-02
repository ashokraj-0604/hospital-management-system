export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export type BloodGroup =
  | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'UNKNOWN';

export type RegistrationType = 'WALK_IN' | 'REFERRED' | 'PRE_REGISTERED';

export type PatientStatus = 'ACTIVE' | 'INACTIVE' | 'DECEASED';

export interface Patient {
  patient_id: string;
  mrn: string;
  hospital_id: string;
  full_name: string;
  date_of_birth: string;
  gender: Gender;
  blood_group: BloodGroup;
  phone: string;
  email?: string | null;
  address?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  photo_url?: string | null;
  insurance_provider?: string | null;
  insurance_policy_number?: string | null;
  registration_type: RegistrationType;
  status: PatientStatus;
  created_at: string;
  updated_at: string;
}

export interface PatientListResponse {
  data: Patient[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface PatientListParams {
  search?: string;
  status?: PatientStatus;
  gender?: Gender;
  page?: number;
  limit?: number;
}

export interface CreatePatientPayload {
  full_name: string;
  date_of_birth: string;
  gender: Gender;
  blood_group?: BloodGroup;
  phone: string;
  email?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  insurance_provider?: string;
  insurance_policy_number?: string;
  registration_type?: RegistrationType;
  duplicate_override?: boolean;
}

export type UpdatePatientPayload = Partial<CreatePatientPayload> & {
  status?: PatientStatus;
};

export interface DuplicatePatientMatch {
  patient_id: string;
  mrn: string;
  full_name: string;
  phone: string;
  date_of_birth: string;
}

// Thrown by the API layer when the backend returns 409 DUPLICATE_PATIENT
export class DuplicatePatientError extends Error {
  duplicates: DuplicatePatientMatch[];
  constructor(duplicates: DuplicatePatientMatch[]) {
    super('Possible duplicate patient found');
    this.name = 'DuplicatePatientError';
    this.duplicates = duplicates;
  }
}
