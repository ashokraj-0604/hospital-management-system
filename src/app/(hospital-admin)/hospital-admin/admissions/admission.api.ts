import apiClient from '@/src/lib/api-client';

export interface Admission {
  admission_id: string;
  patient_id: string;
  patient_name: string;
  bed_id: string;
  bed_number: string;
  ward_name: string;
  admitting_doctor_id: string | null;
  admitting_doctor_name: string | null;
  diagnosis: string;
  expected_discharge_date: string | null;
  status: 'ADMITTED' | 'DISCHARGED';
  admitted_at: string;
  discharged_at: string | null;
}

export interface AdmissionStats {
  currently_admitted: number;
  total_admissions: number;
  discharged_today: number;
}

export interface CreateAdmissionPayload {
  patient_id: string;
  patient_name: string;
  bed_id: string;
  admitting_doctor_id?: string;
  admitting_doctor_name?: string;
  diagnosis: string;
  expected_discharge_date?: string;
}

export const admissionsApi = {
  async findAll(status?: string) {
    const { data } = await apiClient.get('/admissions', { params: status ? { status } : {} });
    return data as Admission[];
  },
  async getStats() {
    const { data } = await apiClient.get('/admissions/stats');
    return data as AdmissionStats;
  },
  async create(payload: CreateAdmissionPayload) {
    const { data } = await apiClient.post('/admissions', payload);
    return data as Admission;
  },
  async discharge(admissionId: string) {
    const { data } = await apiClient.patch(`/admissions/${admissionId}/discharge`);
    return data;
  },
};