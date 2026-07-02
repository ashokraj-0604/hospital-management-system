// src/hooks/hospital-admin/useHospitalStats.ts

'use client';

import { useEffect, useState } from 'react';
import { hospitalAdminService } from './hospitalAdmin.api';
import { patientsApi } from '../hospital-admin/patients/patient.api';
import type { HospitalDashboardStats } from '@/src/types/hospitals';

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
      let baseStats: HospitalDashboardStats;

      try {
        baseStats = await hospitalAdminService.getStats();
      } catch (err) {
        // Fall back to mock data so the dashboard is never empty during dev
        // or if the stats endpoint isn't wired up yet.
        baseStats = MOCK_STATS;
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load stats');
        }
      }

      // The Patients module is wired to real data now, so the patient count
      // card should always reflect the actual registry rather than the
      // (possibly mocked) value from the general stats endpoint.
      try {
        const patientList = await patientsApi.list({ limit: 100 });
        const todayStr = new Date().toDateString();
        const newRegistrationsToday = patientList.data.filter(
          (p) => new Date(p.created_at).toDateString() === todayStr,
        ).length;

        baseStats = {
          ...baseStats,
          total_patients_today: patientList.meta.total,
          new_registrations_today: newRegistrationsToday,
        };
      } catch {
        // If the patients endpoint is unreachable, leave whatever
        // total_patients_today came from stats/mock above untouched.
      }

      if (mounted) {
        setStats(baseStats);
        setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return { stats, isLoading, error };
}