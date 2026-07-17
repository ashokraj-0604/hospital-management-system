import { useState, useEffect, useCallback } from 'react';
import { labStaffApi, CreateLabStaffPayload } from './labstaff.api';
import { getApiErrorMessage } from '@/src/lib/api-error';

export function useLabStaff() {
  const [labStaff, setLabStaff] = useState<import('./labstaff.api').LabStaff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLabStaff = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setLabStaff(await labStaffApi.findAll());
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load lab staff.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchLabStaff(); }, [fetchLabStaff]);

  const addLabStaff = async (payload: CreateLabStaffPayload) => {
    const created = await labStaffApi.create(payload);
    await fetchLabStaff();
    return created;
  };

  return { labStaff, isLoading, error, addLabStaff };
}