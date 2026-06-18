'use client';

import { useQuery } from '@tanstack/react-query';
import type { DashboardStats } from './dashboard.types';

const defaultStats: DashboardStats = {
  totalAppointments: 0,
  pendingAppointments: 0,
};

export function useDashboard() {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async (): Promise<DashboardStats> => defaultStats,
    initialData: defaultStats,
  });
}
