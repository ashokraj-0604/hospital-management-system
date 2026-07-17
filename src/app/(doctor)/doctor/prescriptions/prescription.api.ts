import apiClient from '@/src/lib/api-client';

export interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface Prescription {
  prescription_id: string;
  patient_id: string;
  patient_name: string;
  diagnosis: string;
  medicines: Medicine[];
  notes: string | null;
  created_at: string;
}

export interface CreatePrescriptionPayload {
  patient_id: string;
  patient_name: string;
  diagnosis: string;
  medicines: Medicine[];
  notes?: string;
}

export const prescriptionsApi = {
  async findAllForDoctor() {
    const { data } = await apiClient.get('/prescriptions/doctor');
    return data as Prescription[];
  },
  async create(payload: CreatePrescriptionPayload) {
    const { data } = await apiClient.post('/prescriptions', payload);
    return data as Prescription;
  },
};