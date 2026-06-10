'use client';

import { useState, useEffect, useCallback } from 'react';
import { superAdminService } from '@/src/services/super-admin/superAdmin.service';
import { MOCK_STATS } from '@/src/lib/super-admin/mockdata';
import type { PlatformStats } from '@/src/types/super-admin.types';

// ─── usePlatformStats Hook ────────────────────────────────────────────────────

interface UsePlatformStatsReturn {
  stats: PlatformStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const usePlatformStats = (): UsePlatformStatsReturn => {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await superAdminService.getStats();
      setStats(data);
    } catch {
      // Use mock data in development
      setStats(MOCK_STATS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  return { stats, isLoading, error, refetch: fetchStats };
};