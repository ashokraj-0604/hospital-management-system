import { API_ENDPOINTS } from '@/src/constants/api-endpoints';
import { apiClient } from '@/src/lib/api/client';
import type { Appointment } from '@/src/types';

export const patientAppointmentsApi = {
  list: (patientId: string) => apiClient<Appointment[]>(API_ENDPOINTS.patient.appointments(patientId)),
};
