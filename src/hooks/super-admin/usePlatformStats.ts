import { useState, useEffect } from 'react';
import apiClient from '@/src/lib/api-client';

export function usePlatformStats() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/hospitals/stats')
      .then(res => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setIsLoading(false));
  }, []);

  return { stats, isLoading };
}