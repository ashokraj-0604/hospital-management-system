'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CalendarCheck } from 'lucide-react';
import { doctorAppointmentsApi } from './appointment.api';
import { TableCard } from '@/src/core/table/TableCard';
import { TableToolbar } from '@/src/core/table/TableToolbar';
import { EmptyState } from '@/src/core/table/EmptyState';
import { LoadingSpinner } from '@/src/core/table/TableLoading';
import { BRAND } from '@/src/constants/brand.constants';

const typeColor: Record<string, string> = {
  OPD: 'bg-blue-100 text-blue-600',
  IPD: 'bg-purple-100 text-purple-600',
  EMERGENCY: 'bg-red-100 text-red-600',
};

export default function DoctorAppointmentsPage() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    setAppointments(await doctorAppointmentsApi.findByDate(date));
    setIsLoading(false);
  }, [date]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const markStatus = async (id: string, status: string) => {
    await doctorAppointmentsApi.updateStatus(id, status);
    await fetchAppointments();
  };

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: BRAND.colors.textDark }}>Appointments</h1>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-xl border px-3 py-2 text-sm"
          style={{ borderColor: BRAND.colors.border }}
        />
      </div>

      <TableCard>
        <TableToolbar>
          <span className="font-semibold" style={{ color: BRAND.colors.textDark }}>
            {new Date(date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </TableToolbar>

        {isLoading ? (
          <LoadingSpinner />
        ) : appointments.length === 0 ? (
          <EmptyState icon={CalendarCheck} message="No appointments for this date." />
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left" style={{ color: BRAND.colors.textLight }}>
              <tr className="border-b" style={{ borderColor: BRAND.colors.border }}>
                <th className="px-5 py-3 font-medium">Time</th>
                <th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.appointment_id} className="border-b last:border-b-0" style={{ borderColor: BRAND.colors.border }}>
                  <td className="px-5 py-3">{new Date(a.scheduled_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="px-5 py-3 font-medium" style={{ color: BRAND.colors.textDark }}>{a.patient_name}</td>
                  <td className="px-5 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${typeColor[a.type]}`}>{a.type}</span></td>
                  <td className="px-5 py-3">{a.status}</td>
                  <td className="px-5 py-3 text-right">
                    {(a.status === 'SCHEDULED' || a.status === 'CONFIRMED') && (
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => markStatus(a.appointment_id, 'COMPLETED')} className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg font-semibold">Complete</button>
                        <button onClick={() => markStatus(a.appointment_id, 'NO_SHOW')} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg font-semibold">No Show</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableCard>
    </div>
  );
}