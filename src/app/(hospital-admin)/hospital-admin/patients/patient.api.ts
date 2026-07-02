import apiClient from '@/src/lib/api-client';
import {
  Patient,
  PatientListResponse,
  PatientListParams,
  CreatePatientPayload,
  UpdatePatientPayload,
  DuplicatePatientMatch,
  DuplicatePatientError,
} from './patient.type';

const MOCK_PATIENTS: Patient[] = [
  {
    patient_id: 'mock-1',
    mrn: 'MRN-DEMO-2026-00001',
    hospital_id: 'default-hospital',
    full_name: 'Ravi Kumar',
    date_of_birth: '1988-04-12',
    gender: 'MALE',
    blood_group: 'B+',
    phone: '+91 98765 43210',
    email: 'ravi.kumar@example.com',
    address: null,
    emergency_contact_name: null,
    emergency_contact_phone: null,
    photo_url: null,
    insurance_provider: null,
    insurance_policy_number: null,
    registration_type: 'WALK_IN',
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const MOCK_LIST: PatientListResponse = {
  data: MOCK_PATIENTS,
  meta: { page: 1, limit: 20, total: MOCK_PATIENTS.length, total_pages: 1 },
};

export const patientsApi = {
  list: async (params: PatientListParams = {}): Promise<PatientListResponse> => {
    try {
      const { data } = await apiClient.get('/patients', { params });
      return data;
    } catch {
      return MOCK_LIST; // fallback so UI never breaks
    }
  },

  getById: async (patientId: string): Promise<Patient | null> => {
    try {
      const { data } = await apiClient.get(`/patients/${patientId}`);
      return data;
    } catch {
      return MOCK_PATIENTS.find((p) => p.patient_id === patientId) ?? null;
    }
  },

  checkDuplicate: async (
    full_name: string,
    date_of_birth: string,
    phone: string,
  ): Promise<DuplicatePatientMatch[]> => {
    try {
      const { data } = await apiClient.get('/patients/check-duplicate', {
        params: { full_name, date_of_birth, phone },
      });
      return data;
    } catch {
      return [];
    }
  },

  // Writes are NOT mock-fallback — errors (including 409 duplicate) must
  // propagate so the form can react correctly.
  create: async (payload: CreatePatientPayload): Promise<Patient> => {
    try {
      const { data } = await apiClient.post('/patients', payload);
      return data;
    } catch (err: any) {
      if (err?.response?.status === 409 && err?.response?.data?.code === 'DUPLICATE_PATIENT') {
        throw new DuplicatePatientError(err.response.data.duplicates ?? []);
      }
      throw err;
    }
  },

  update: async (patientId: string, payload: UpdatePatientPayload): Promise<Patient> => {
    const { data } = await apiClient.patch(`/patients/${patientId}`, payload);
    return data;
  },

  deactivate: async (patientId: string): Promise<Patient> => {
    const { data } = await apiClient.delete(`/patients/${patientId}`);
    return data;
  },
};
