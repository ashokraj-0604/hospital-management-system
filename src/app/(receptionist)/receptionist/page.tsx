'use client';

import React from 'react';
import { CalendarCheck, ClipboardList, Users } from 'lucide-react';
import { DashboardHeader, StatsCard, Alert } from '@/src/core';
import { TableCard } from '@/src/core/table/TableCard';
import { TableToolbar } from '@/src/core/table/TableToolbar';
import { EmptyState } from '@/src/core/table/EmptyState';
import { LoadingSpinner } from '@/src/core/table/TableLoading';
import { BRAND } from '@/src/constants/brand.constants';
import { useReceptionDashboard } from './useReceptionDashboard';

export default function ReceptionDashboardPage() {
  const {
    todayAppointments,
    pendingAppointments,
    patientCount,
    isLoading,
    error,
  } = useReceptionDashboard();

  if (error) return <div className="p-6"><Alert variant="error" message={error} /></div>;

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <DashboardHeader title="Reception Dashboard" primaryColor={BRAND.colors.primary} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard label="Today's Appointments" value={isLoading ? '—' : todayAppointments.length} icon={CalendarCheck} iconBg={BRAND.colors.iconBgTeal} iconColor={BRAND.colors.primary} />
        <StatsCard label="Pending Check-in" value={isLoading ? '—' : pendingAppointments.length} icon={ClipboardList} iconBg="bg-amber-50" iconColor="text-amber-500" />
        <StatsCard label="Registered Patients" value={isLoading ? '—' : patientCount} icon={Users} iconBg="bg-violet-50" iconColor="text-violet-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl bg-white border border-[#D6EFF4] p-5 shadow-sm">
          <h2 className="font-bold text-[#0D2F36] mb-3">Today's Queue</h2>
          {isLoading ? (
            <p className="text-sm text-[#8AACB3] py-4 text-center">Loading...</p>
          ) : todayAppointments.length === 0 ? (
            <p className="text-sm text-[#8AACB3] py-4 text-center">No appointments scheduled for today.</p>
          ) : (
            <div className="space-y-2">
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment.appointment_id}
                  className="flex items-center justify-between border-b border-[#F4FAFB] py-3 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-[#8AACB3] w-16">
                      {new Date(appointment.scheduled_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div>
                      <p className="font-medium text-[#0D2F36]">{appointment.patient_name}</p>
                      <p className="text-xs text-[#8AACB3]">Dr. {appointment.doctor_name}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-[#8AACB3]">{appointment.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <TableCard>
          <TableToolbar>
            <span className="font-semibold" style={{ color: BRAND.colors.textDark }}>Pending Check-in</span>
          </TableToolbar>
          {isLoading ? (
            <LoadingSpinner />
          ) : pendingAppointments.length === 0 ? (
            <EmptyState icon={ClipboardList} message="No pending check-ins." />
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left" style={{ color: BRAND.colors.textLight }}>
                <tr className="border-b" style={{ borderColor: BRAND.colors.border }}>
                  <th className="px-5 py-3 font-medium">Patient</th>
                  <th className="px-5 py-3 font-medium">Doctor</th>
                  <th className="px-5 py-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {pendingAppointments.map((appointment) => (
                  <tr key={appointment.appointment_id} className="border-b last:border-b-0" style={{ borderColor: BRAND.colors.border }}>
                    <td className="px-5 py-3 font-medium" style={{ color: BRAND.colors.textDark }}>{appointment.patient_name}</td>
                    <td className="px-5 py-3">Dr. {appointment.doctor_name}</td>
                    <td className="px-5 py-3">{new Date(appointment.scheduled_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </TableCard>
      </div>
    </div>
  );
}