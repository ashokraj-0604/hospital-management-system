'use client';

import React, { useEffect, useState } from 'react';
import { CalendarCheck } from 'lucide-react';
import apiClient from '@/src/lib/api-client';
import { TableCard } from '@/src/core/table/TableCard';
import { EmptyState } from '@/src/core/table/EmptyState';
import { LoadingSpinner } from '@/src/core/table/TableLoading';
import { BRAND } from '@/src/constants/brand.constants';

export default function ReceptionAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/appointments').then((r) => {
      setAppointments(r.data);
      setIsLoading(false);
    });
  }, []);

  const today = appointments.filter(
    (a) => new Date(a.scheduled_at).toDateString() === new Date().toDateString(),
  );

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <h1 className="text-2xl font-bold" style={{ color: BRAND.colors.textDark }}>Today's Appointments</h1>
      <TableCard>
        {isLoading ? <LoadingSpinner /> : today.length === 0 ? (
          <EmptyState icon={CalendarCheck} message="No appointments today." />
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left" style={{ color: BRAND.colors.textLight }}>
              <tr className="border-b" style={{ borderColor: BRAND.colors.border }}>
                <th className="px-5 py-3 font-medium">Time</th><th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">Doctor</th><th className="px-5 py-3 font-medium">Type</th><th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {today.map((a) => (
                <tr key={a.appointment_id} className="border-b last:border-b-0" style={{ borderColor: BRAND.colors.border }}>
                  <td className="px-5 py-3">{new Date(a.scheduled_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="px-5 py-3 font-medium" style={{ color: BRAND.colors.textDark }}>{a.patient_name}</td>
                  <td className="px-5 py-3">{a.doctor_name}</td>
                  <td className="px-5 py-3">{a.type}</td>
                  <td className="px-5 py-3">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableCard>
    </div>
  );
}