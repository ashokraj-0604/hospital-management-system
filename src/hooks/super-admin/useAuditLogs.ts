import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/src/lib/api-client';

export function useAuditLogs(params: {
  search?: string; action?: string; hospital_id?: string; page?: number; limit?: number;
}) {
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.get('/audit', { params });
      setAuditLogs(data.items);
      setTotal(data.total);
    } catch {
      setAuditLogs([]);
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  return { auditLogs, total, isLoading, refetch: fetchLogs };
}