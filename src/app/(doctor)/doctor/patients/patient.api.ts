import apiClient from '@/src/lib/api-client';

export interface DoctorPatientRow {
  patient_id: string;
  patient_name: string;
  last_visit: string;
  visit_count: string; // Postgres COUNT(*) comes back as a string
}

export interface PatientProfile {
  patient_id: string;
  mrn: string;
  hospital_id: string;
  full_name: string;
  date_of_birth: string;
  gender: string;
  blood_group: string;
  phone: string;
  email: string | null;
  address: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  insurance_provider: string | null;
  insurance_policy_number: string | null;
  status: string;
}

export interface DoctorPatientProfileResponse {
  patient: PatientProfile;
  appointments: any[];
  medical_records: any[];
  prescriptions: any[];
  lab_requests: any[];
  discharge_summaries: any[];
}

export interface UpdatePatientPayload {
  full_name?: string;
  phone?: string;
  email?: string | null;
  address?: string | null;
  blood_group?: string;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  insurance_provider?: string | null;
  insurance_policy_number?: string | null;
  status?: string;
}

export const doctorPatientsApi = {
  async findAll() {
    const { data } = await apiClient.get('/appointments/doctor/patients');
    return data as DoctorPatientRow[];
  },

  async findProfile(patientId: string) {
    const { data } = await apiClient.get(`/appointments/doctor/patients/${patientId}/profile`);
    return data as DoctorPatientProfileResponse;
  },

  async updatePatient(patientId: string, payload: UpdatePatientPayload) {
    const { data } = await apiClient.patch(`/patients/${patientId}`, payload);
    return data as PatientProfile;
  },
};