import apiClient from '@/src/lib/api-client';
import type { DoctorAppointment } from '../doctor.api';

export const doctorAppointmentsApi = {
  async findByDate(date: string) {
    const { data } = await apiClient.get('/appointments/doctor/today', { params: { date } });
    return data as DoctorAppointment[];
  },
  async updateStatus(appointmentId: string, status: string) {
    const { data } = await apiClient.patch(`/appointments/${appointmentId}/status`, { status });
    return data;
  },
};