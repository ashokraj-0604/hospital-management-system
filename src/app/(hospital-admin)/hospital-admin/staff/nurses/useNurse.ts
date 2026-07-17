import { useState, useEffect, useCallback } from 'react';
import { nursesApi, CreateNursePayload } from './nurse.api';
import { getApiErrorMessage } from '@/src/lib/api-error';

export function useNurses() {
  const [nurses, setNurses] = useState<import('./nurse.api').Nurse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNurses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setNurses(await nursesApi.findAll());
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load nurses.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchNurses(); }, [fetchNurses]);

  const addNurse = async (payload: CreateNursePayload) => {
    const created = await nursesApi.create(payload);
    await fetchNurses();
    return created;
  };

  return { nurses, isLoading, error, addNurse };
}