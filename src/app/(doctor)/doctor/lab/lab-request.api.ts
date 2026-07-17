import apiClient from '@/src/lib/api-client';

export interface LabRequest {
  request_id: string;
  patient_id: string;
  patient_name: string;
  test_name: string;
  test_type: 'BLOOD' | 'URINE' | 'IMAGING' | 'OTHER';
  urgency: 'ROUTINE' | 'URGENT';
  clinical_notes: string | null;
  status: 'PENDING' | 'COMPLETED';
  result: string | null;
  result_file_path: string | null;
  result_file_name: string | null;
  created_at: string;
}

export interface CreateLabRequestPayload {
  patient_id: string;
  patient_name: string;
  test_name: string;
  test_type: string;
  urgency: string;
  clinical_notes?: string;
}

export const labRequestsApi = {
  async findAllForDoctor() {
    const { data } = await apiClient.get('/lab-requests/doctor');
    return data as LabRequest[];
  },
  async create(payload: CreateLabRequestPayload) {
    const { data } = await apiClient.post('/lab-requests', payload);
    return data as LabRequest;
  },
  async downloadResultFile(requestId: string, fileName: string) {
    const response = await apiClient.get(`/lab-requests/${requestId}/result-file`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'lab-result';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};