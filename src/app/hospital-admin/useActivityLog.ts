// src/hooks/hospital-admin/useActivityLog.ts

'use client';

import { useEffect, useState } from 'react';
import { hospitalAdminService } from './hospitalAdmin.service';
import type { ActivityLog } from '@/src/types/hospitals';

const MOCK_ACTIVITY: ActivityLog[] = [
  { log_id: 'a1', action: 'ADMIT',      description: 'ADMIT patient Ravi Kumar — Ward B',               created_at: new Date().toISOString() },
  { log_id: 'a2', action: 'DISCHARGE',  description: 'DISCHARGE patient Meena Rao — cleared',           created_at: new Date(Date.now() - 50 * 60000).toISOString() },
  { log_id: 'a3', action: 'INVOICE',    description: 'INVOICE generated — ₹18,400 · Sunita Mehta',      created_at: new Date(Date.now() - 14 * 3600000).toISOString() },
  { log_id: 'a4', action: 'LAB_RESULT', description: 'LAB critical result flagged for Dr. Kiran Raj',   created_at: new Date(Date.now() - 28 * 3600000).toISOString() },
];

export function useActivityLog(params: { page?: number; limit?: number } = {}) {
  const { page = 1, limit = 5 } = params;
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await hospitalAdminService.getActivityLog({ page, limit });
        if (mounted) setActivityLog(data);
      } catch {
        if (mounted) setActivityLog(MOCK_ACTIVITY.slice(0, limit));
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [page, limit]);

  return { activityLog, isLoading };
}
