'use client';

import React from 'react';
import { CalendarCheck, ClipboardList, Users } from 'lucide-react';
import { useDoctorDashboard } from './useDoctorDashboard';
import { DashboardHeader, StatsCard } from '@/src/core';
import { BRAND } from '@/src/constants/brand.constants';

const typeColor: Record<string, string> = {
  OPD: 'bg-blue-100 text-blue-600',
  IPD: 'bg-purple-100 text-purple-600',
  EMERGENCY: 'bg-red-100 text-red-600',
};

export default function DoctorDashboardPage() {
  const { stats, queue, patients, isLoading, error, markStatus } = useDoctorDashboard();

  if (error) {
    return <div className="p-6 text-red-500 text-sm">{error}</div>;
  }

  return (
    <div className="p-6 space-y-7 max-w-[1400px]">
      {/* Header — same component as hospital-admin */}
      <DashboardHeader title="My Dashboard" primaryColor={BRAND.colors.primary} />

      {/* Stats — same StatsCard component as hospital-admin */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          label="Today's Appointments"
          value={isLoading ? '—' : stats?.appointments_today ?? 0}
          icon={CalendarCheck}
          iconBg={BRAND.colors.iconBgTeal}
          iconColor={BRAND.colors.primary}
        />
        <StatsCard
          label="Pending"
          value={isLoading ? '—' : stats?.pending_today ?? 0}
          icon={ClipboardList}
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
        />
        <StatsCard
          label="Total Patients"
          value={isLoading ? '—' : stats?.total_patients ?? 0}
          icon={Users}
          iconBg="bg-violet-50"
          iconColor="text-violet-500"
        />
      </div>

      {/* Middle row — same card shell (rounded-2xl, border, shadow-sm) as BedOccupancy/UpcomingAppointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Today's Queue */}
        <div className="rounded-2xl bg-white border border-[#D6EFF4] p-5 shadow-sm">
          <h2 className="font-bold text-[#0D2F36] mb-3">Today&apos;s Queue</h2>
          {isLoading ? (
            <p className="text-sm text-[#8AACB3] py-4 text-center">Loading...</p>
          ) : queue.length === 0 ? (
            <p className="text-sm text-[#8AACB3] py-4 text-center">No appointments scheduled for today.</p>
          ) : (
            <div className="space-y-2">
              {queue.map((appt) => (
                <div
                  key={appt.appointment_id}
                  className="flex items-center justify-between border-b border-[#F4FAFB] py-3 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-[#8AACB3] w-16">
                      {new Date(appt.scheduled_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div>
                      <p className="font-medium text-[#0D2F36]">{appt.patient_name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${typeColor[appt.type]}`}>{appt.type}</span>
                    </div>
                  </div>
                  {appt.status === 'SCHEDULED' || appt.status === 'CONFIRMED' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => markStatus(appt.appointment_id, 'COMPLETED')}
                        className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg font-semibold"
                      >
                        Mark Completed
                      </button>
                      <button
                        onClick={() => markStatus(appt.appointment_id, 'NO_SHOW')}
                        className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg font-semibold"
                      >
                        No Show
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-[#8AACB3]">{appt.status}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Patients */}
        <div className="rounded-2xl bg-white border border-[#D6EFF4] p-5 shadow-sm">
          <h2 className="font-bold text-[#0D2F36] mb-3">My Patients</h2>
          {isLoading ? (
            <p className="text-sm text-[#8AACB3] py-4 text-center">Loading...</p>
          ) : patients.length === 0 ? (
            <p className="text-sm text-[#8AACB3] py-4 text-center">No patients yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-[#8AACB3] text-left">
                <tr>
                  <th className="py-2 font-medium">Name</th>
                  <th className="py-2 font-medium">Last Visit</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.patient_id} className="border-t border-[#F4FAFB]">
                    <td className="py-2 font-medium text-[#0D2F36]">{p.patient_name}</td>
                    <td className="py-2 text-[#8AACB3]">{new Date(p.last_visit).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}