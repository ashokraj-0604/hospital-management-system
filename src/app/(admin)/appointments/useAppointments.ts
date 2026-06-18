'use client';

import { useQuery } from '@tanstack/react-query';
import { doctorAppointmentsApi } from '@/src/lib/api/doctor/appointments.api';
import type { UseAppointmentsResult } from './appointments.types';

export function useAppointments(doctorId: string): UseAppointmentsResult {
  const query = useQuery({
    queryKey: ['doctor-appointments', doctorId],
    queryFn: () => doctorAppointmentsApi.list(doctorId),
    enabled: doctorId.length > 0,
  });

  return {
    appointments: query.data ?? [],
    isLoading: query.isLoading,
  };
}
