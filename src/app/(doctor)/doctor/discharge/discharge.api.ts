import apiClient from '@/src/lib/api-client';
import type { Medicine } from '../prescriptions/prescription.api';

export interface DischargeSummary {
  summary_id: string;
  patient_id: string;
  patient_name: string;
  admission_date: string;
  discharge_date: string;
  final_diagnosis: string;
  hospital_course: string;
  condition_at_discharge: 'STABLE' | 'IMPROVED' | 'REFERRED' | 'DECEASED';
  discharge_medications: Medicine[] | null;
  follow_up_instructions: string | null;
  follow_up_date: string | null;
  created_at: string;
}

export interface CreateDischargeSummaryPayload {
  patient_id: string;
  patient_name: string;
  admission_date: string;
  discharge_date: string;
  final_diagnosis: string;
  hospital_course: string;
  condition_at_discharge: string;
  discharge_medications?: Medicine[];
  follow_up_instructions?: string;
  follow_up_date?: string;
}

export const dischargeSummariesApi = {
  async findAllForDoctor() {
    const { data } = await apiClient.get('/discharge-summaries/doctor');
    return data as DischargeSummary[];
  },
  async create(payload: CreateDischargeSummaryPayload) {
    const { data } = await apiClient.post('/discharge-summaries', payload);
    return data as DischargeSummary;
  },
};