import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/src/lib/api-client';

export function useHospitals(params: {
  search?: string; status?: string; plan?: string; page?: number; limit?: number;
}) {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHospitals = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.get('/hospitals', { params });
      setHospitals(data.items);
      setTotal(data.total);
    } catch {
      setHospitals([]);
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { fetchHospitals(); }, [fetchHospitals]);

  return { hospitals, total, isLoading, refetch: fetchHospitals };
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