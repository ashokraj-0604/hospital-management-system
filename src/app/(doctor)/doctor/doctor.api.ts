import apiClient from '@/src/lib/api-client';

export interface DoctorAppointment {
  appointment_id: string;
  patient_id: string;
  patient_name: string;
  department: string;
  type: 'OPD' | 'IPD' | 'EMERGENCY';
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  scheduled_at: string;
}

export interface DoctorStats {
  appointments_today: number;
  pending_today: number;
  total_patients: number;
}

export interface DoctorPatient {
  patient_id: string;
  patient_name: string;
  last_visit: string;
}

export const doctorDashboardApi = {
  async getStats() {
    const { data } = await apiClient.get('/appointments/doctor/stats');
    return data as DoctorStats;
  },
  async getTodayQueue() {
    const { data } = await apiClient.get('/appointments/doctor/today');
    return data as DoctorAppointment[];
  },
  async getMyPatients() {
    const { data } = await apiClient.get('/appointments/doctor/patients');
    return data as DoctorPatient[];
  },
  async updateStatus(appointmentId: string, status: string) {
    const { data } = await apiClient.patch(`/appointments/${appointmentId}/status`, { status });
    return data;
  },
};