// src/hooks/hospital-admin/useHospitalStats.ts

'use client';

import { useEffect, useState } from 'react';
import { hospitalAdminService } from '../../services/hospital-admin/hospitalAdmin.service';
import type { HospitalDashboardStats } from '../../types/hospitals';

const MOCK_STATS: HospitalDashboardStats = {
  total_patients_today: 284,
  new_registrations_today: 18,
  patients_growth_pct: 4,

  beds_available: 43,
  beds_total: 120,
  beds_occupied_delta: -2,

  appointments_today: 67,
  appointments_pending: 12,
  appointments_growth: 12,

  revenue_today: 240000,
  revenue_mtd: 4820000,
  revenue_growth_pct: 8,
};

export function useHospitalStats() {
  const [stats, setStats] = useState<HospitalDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await hospitalAdminService.getStats();
        if (mounted) setStats(data);
      } catch (err) {
        // Fall back to mock data so the dashboard is never empty during dev
        // or if the stats endpoint isn't wired up yet.
        if (mounted) {
          setStats(MOCK_STATS);
          setError(err instanceof Error ? err.message : 'Failed to load stats');
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return { stats, isLoading, error };
}