import apiClient from '@/src/lib/api-client';

export const appointmentsApi = {
  async findAll() {
    const { data } = await apiClient.get('/appointments');
    return data;
  },
  async create(payload: {
    patient_id: string; patient_name: string;
    doctor_id: string; doctor_name: string;
    department: string; type: 'OPD' | 'IPD' | 'EMERGENCY'; scheduled_at: string;
  }) {
    const { data } = await apiClient.post('/appointments', payload);
    return data;
  },
};