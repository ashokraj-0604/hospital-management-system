import type { Appointment } from '@/src/types';

export interface UseAppointmentsResult {
  appointments: Appointment[];
  isLoading: boolean;
}
