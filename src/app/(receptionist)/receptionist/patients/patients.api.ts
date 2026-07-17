import apiClient from '@/src/lib/api-client';

export interface RegisteredPatient {
  patient_id: string;
  mrn: string;
  full_name: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone: string;
  registered_at: string;
}

export interface RegisterPatientPayload {
  full_name: string;
  age: number;
  gender: string;
  phone: string;
}

// See backend/src/reception-additions/README.md for the endpoints this calls.
export const receptionistPatientsApi = {
  async findAll(search?: string) {
    const { data } = await apiClient.get('/patients', { params: search ? { search } : undefined });
    if (Array.isArray(data)) {
      return data as RegisteredPatient[];
    }

    if (Array.isArray(data?.data)) {
      return data.data as RegisteredPatient[];
    }

    if (Array.isArray(data?.items)) {
      return data.items as RegisteredPatient[];
    }

    return [] as RegisteredPatient[];
  },
  async register(payload: RegisterPatientPayload) {
    const { data } = await apiClient.post('/patients', payload);
    return data as RegisteredPatient;
  },
};