// src/components/hospital-admin/UpcomingAppointments.tsx

'use client';

import React from 'react';
import { BRAND } from '@/src/constants/brand.constants';
import type { Appointment, AppointmentType } from '../../types/hospitals';

const TAG_STYLES: Record<AppointmentType, { bg: string; color: string }> = {
  OPD:       { bg: BRAND.colors.iconBgTeal, color: BRAND.colors.accent },
  IPD:       { bg: '#F5F3FF', color: '#7C3AED' },
  EMERGENCY: { bg: '#FEF2F2', color: '#DC2626' },
};

const AVATAR_BG: Record<AppointmentType, { bg: string; color: string }> = {
  OPD:       { bg: BRAND.colors.iconBgTeal, color: BRAND.colors.accent },
  IPD:       { bg: '#F5F3FF', color: '#7C3AED' },
  EMERGENCY: { bg: '#FEF2F2', color: '#DC2626' },
};

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

function formatTime(iso: string) {
  return new Date(Number(iso) || iso).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

interface Props {
  appointments: Appointment[];
  isLoading: boolean;
}

export function UpcomingAppointments({ appointments, isLoading }: Props) {
  return (
    <div className="lg:col-span-2 rounded-2xl bg-white border p-5 shadow-sm" style={{ borderColor: BRAND.colors.borderTint }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold" style={{ color: BRAND.colors.textDark }}>Upcoming Appointments</h3>
        <a href="/hospital-admin/appointments" className="text-xs font-medium hover:opacity-80" style={{ color: BRAND.colors.primary }}>
          View all →
        </a>
      </div>

      <div className="space-y-1">
        {isLoading ? (
          <p className="py-8 text-center text-sm" style={{ color: BRAND.colors.textLight }}>Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p className="py-8 text-center text-sm" style={{ color: BRAND.colors.textLight }}>No upcoming appointments</p>
        ) : appointments.map((appt) => {
          const tag = TAG_STYLES[appt.type];
          const av = AVATAR_BG[appt.type];
          return (
            <div key={appt.appointment_id} className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-[#F4FAFB] transition-colors">
              <span className="w-10 shrink-0 text-xs" style={{ color: BRAND.colors.textLight }}>
                {formatTime(appt.scheduled_at)}
              </span>
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
                style={{ backgroundColor: av.bg, color: av.color }}
              >
                {initials(appt.patient_name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold" style={{ color: BRAND.colors.textDark }}>{appt.patient_name}</p>
                <p className="truncate text-xs" style={{ color: BRAND.colors.textLight }}>{appt.doctor_name} · {appt.department}</p>
              </div>
              <span
                className="shrink-0 text-[10px] font-semibold rounded-full px-2 py-0.5"
                style={{ backgroundColor: tag.bg, color: tag.color }}
              >
                {appt.type}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}