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

export interface BookAppointmentPayload {
  patient_id: string;
  patient_name: string;
  doctor_id: string;
  doctor_name: string;
  department: string;
  type: string;
  scheduled_at: string;
}

// See backend/src/reception-additions/README.md for the endpoints this calls.
export const receptionistAppointmentsApi = {
  async findByDate(date: string) {
    const { data } = await apiClient.get('/appointments/receptionist/today', { params: { date } });
    return data as ReceptionistAppointment[];
  },
  async book(payload: BookAppointmentPayload) {
    const { data } = await apiClient.post('/appointments', payload);
    return data as ReceptionistAppointment;
  },
  async updateStatus(appointmentId: string, status: string) {
    const { data } = await apiClient.patch(`/appointments/${appointmentId}/status`, { status });
    return data;
  },
  async checkIn(appointmentId: string) {
    const { data } = await apiClient.patch(`/appointments/${appointmentId}/checkin`);
    return data;
  },
};