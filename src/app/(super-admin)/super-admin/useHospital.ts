import { useState, useEffect, useCallback, useMemo } from 'react';
import apiClient from '@/src/lib/api-client';
import { getApiErrorMessage } from '@/src/lib/api-error';
import type { Hospital } from '@/src/types/super-admin.types';

export function useHospitals(params: {
  search?: string; status?: string; plan?: string; page?: number; limit?: number;
}) {
  const { search, status, plan, page, limit } = params;
  const requestParams = useMemo(
    () => ({ search, status, plan, page, limit }),
    [search, status, plan, page, limit],
  );
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHospitals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get('/hospitals', { params: requestParams });
      setHospitals(data.items);
      setTotal(data.total);
    } catch (error) {
      setHospitals([]);
      setTotal(0);
      setError(getApiErrorMessage(error, 'Unable to load hospitals.'));
    } finally {
      setIsLoading(false);
    }
  }, [requestParams]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchHospitals(); }, [fetchHospitals]);

  return { hospitals, total, isLoading, error, refetch: fetchHospitals };
}

export function useHospitalActions(refetch: () => void) {
  const suspend = async (id: string, reason: string) => {
    await apiClient.patch(`/hospitals/${id}/suspend`, { reason });
    refetch();
  };

  const activate = async (id: string) => {
    await apiClient.patch(`/hospitals/${id}/activate`);
    refetch();
  };

  return { suspend, activate };
}
