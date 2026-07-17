import { useState, useEffect, useCallback } from 'react';
import { doctorsApi, CreateDoctorPayload } from './doctor.api';
import { getApiErrorMessage } from '@/src/lib/api-error';

export function useDoctors() {
  const [doctors, setDoctors] = useState<import('./doctor.api').Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setDoctors(await doctorsApi.findAll());
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load doctors.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchDoctors(); }, [fetchDoctors]);

  const addDoctor = async (payload: CreateDoctorPayload) => {
    const created = await doctorsApi.create(payload);
    await fetchDoctors();
    return created;
  };

  return { doctors, isLoading, error, addDoctor };
}