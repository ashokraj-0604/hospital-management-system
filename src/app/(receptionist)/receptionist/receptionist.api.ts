import apiClient from '@/src/lib/api-client';

export interface ReceptionistAppointment {
  appointment_id: string;
  patient_id: string;
  patient_name: string;
  doctor_id: string;
  doctor_name: string;
  department: string;
  type: 'OPD' | 'IPD' | 'EMERGENCY';
  status: 'SCHEDULED' | 'CONFIRMED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  scheduled_at: string;
}

export const receptionistDashboardApi = {
  async getAppointments() {
    const { data } = await apiClient.get('/appointments');
    return data as ReceptionistAppointment[];
  },
};