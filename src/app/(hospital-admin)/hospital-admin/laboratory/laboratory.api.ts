import apiClient from '@/src/lib/api-client';

export interface AdminLabRequest {
  request_id: string;
  patient_name: string;
  doctor_name: string;
  test_name: string;
  test_type: string;
  urgency: 'ROUTINE' | 'URGENT';
  status: 'PENDING' | 'COMPLETED';
  result: string | null;
  created_at: string;
}

export interface LabHospitalStats {
  total_requests: number;
  pending: number;
  completed: number;
  urgent_pending: number;
}

export const adminLabApi = {
  async getStats() {
    const { data } = await apiClient.get('/lab-requests/admin/stats');
    return data as LabHospitalStats;
  },
  async findAll(filters: { status?: string; urgency?: string }) {
    const { data } = await apiClient.get('/lab-requests/admin', { params: filters });
    return data as AdminLabRequest[];
  },
};