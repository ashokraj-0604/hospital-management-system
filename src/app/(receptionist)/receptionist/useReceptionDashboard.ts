import { useState, useEffect, useCallback } from 'react';
import { receptionistDashboardApi, type ReceptionistAppointment } from './receptionist.api';
import { receptionistPatientsApi } from './patients/patients.api';
import { getApiErrorMessage } from '@/src/lib/api-error';

export function useReceptionDashboard() {
  const [appointments, setAppointments] = useState<ReceptionistAppointment[]>([]);
  const [patientCount, setPatientCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [appointmentRows, patientRows] = await Promise.all([
        receptionistDashboardApi.getAppointments(),
        receptionistPatientsApi.findAll(),
      ]);
      setAppointments(appointmentRows);
      setPatientCount(patientRows.length);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load receptionist dashboard.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  const todayAppointments = appointments.filter(
    (entry) => new Date(entry.scheduled_at).toDateString() === new Date().toDateString(),
  );

  const pendingAppointments = todayAppointments.filter(
    (entry) => entry.status === 'SCHEDULED' || entry.status === 'CONFIRMED',
  );

  return {
    appointments,
    todayAppointments,
    pendingAppointments,
    patientCount,
    isLoading,
    error,
    refetch: fetchAll,
  };
}
