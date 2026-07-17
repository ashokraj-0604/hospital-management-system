import apiClient from '@/src/lib/api-client';

export interface Vitals {
  bp?: string;
  temperature?: string;
  pulse?: string;
  weight?: string;
  height?: string;
}

export interface MedicalRecord {
  record_id: string;
  patient_id: string;
  patient_name: string;
  chief_complaint: string;
  vitals: Vitals | null;
  examination_notes: string;
  diagnosis: string;
  treatment_plan: string | null;
  created_at: string;
}

export interface CreateMedicalRecordPayload {
  patient_id: string;
  patient_name: string;
  chief_complaint: string;
  vitals?: Vitals;
  examination_notes: string;
  diagnosis: string;
  treatment_plan?: string;
}

export const medicalRecordsApi = {
  async findAllForDoctor() {
    const { data } = await apiClient.get('/medical-records/doctor');
    return data as MedicalRecord[];
  },
  async create(payload: CreateMedicalRecordPayload) {
    const { data } = await apiClient.post('/medical-records', payload);
    return data as MedicalRecord;
  },
};