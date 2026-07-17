import apiClient from '@/src/lib/api-client';

export interface LabRequestRow {
  request_id: string;
  patient_name: string;
  doctor_name: string;
  test_name: string;
  test_type: string;
  urgency: 'ROUTINE' | 'URGENT';
  clinical_notes: string | null;
  status: 'PENDING' | 'COMPLETED';
  result: string | null;
  result_file_path: string | null;
  result_file_name: string | null;
  created_at: string;
  updated_at: string;
}

export const labStaffApi = {
  async findPending() {
    const { data } = await apiClient.get('/lab-requests/lab');
    return data as LabRequestRow[];
  },

  async submitResult(requestId: string, result: string, file?: File | null) {
    const formData = new FormData();
    formData.append('result', result);
    if (file) formData.append('file', file);
    // Don't set Content-Type manually — axios/browser needs to add the multipart boundary itself
    const { data } = await apiClient.patch(`/lab-requests/${requestId}/result`, formData);
    return data;
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
  },
};