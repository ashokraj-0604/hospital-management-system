import { useState, useEffect, useCallback } from 'react';
import { doctorDashboardApi, DoctorStats, DoctorAppointment, DoctorPatient } from './doctor.api';
import { getApiErrorMessage } from '@/src/lib/api-error';

export function useDoctorDashboard() {
  const [stats, setStats] = useState<DoctorStats | null>(null);
  const [queue, setQueue] = useState<DoctorAppointment[]>([]);
  const [patients, setPatients] = useState<DoctorPatient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [s, q, p] = await Promise.all([
        doctorDashboardApi.getStats(),
        doctorDashboardApi.getTodayQueue(),
        doctorDashboardApi.getMyPatients(),
      ]);
      setStats(s);
      setQueue(q);
      setPatients(p);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load your dashboard.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const markStatus = async (appointmentId: string, status: string) => {
    await doctorDashboardApi.updateStatus(appointmentId, status);
    await fetchAll();
  };

  return { stats, queue, patients, isLoading, error, markStatus };
}