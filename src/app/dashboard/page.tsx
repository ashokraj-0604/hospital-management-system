'use client';

import { useHospitalStats, useAppointments } from '@/src/hooks/hospital/useHospital';
import { DashboardStatCard } from '@/src/components/hospital/DashboardStatCard';
import {
  Users,
  BedDouble,
  IndianRupee,
  FlaskConical,
  Pill,
  Scissors,
  CalendarDays,
  UserPlus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import type { Appointment } from '@/src/types/hospitals';

const STATUS_CONFIG: Record<Appointment['status'], { label: string; color: string; icon: typeof CheckCircle2 }> = {
  SCHEDULED: { label: 'Scheduled', color: 'text-blue-600 bg-blue-50', icon: Clock },
  CHECKED_IN: { label: 'Checked In', color: 'text-amber-600 bg-amber-50', icon: AlertCircle },
  IN_PROGRESS: { label: 'In Progress', color: 'text-purple-600 bg-purple-50', icon: AlertCircle },
  COMPLETED: { label: 'Completed', color: 'text-emerald-600 bg-emerald-50', icon: CheckCircle2 },
  CANCELLED: { label: 'Cancelled', color: 'text-red-500 bg-red-50', icon: XCircle },
  NO_SHOW: { label: 'No Show', color: 'text-gray-500 bg-gray-100', icon: XCircle },
};

function formatINR(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function HospitalDashboardPage() {
  const { stats, loading: statsLoading } = useHospitalStats();
  const { appointments, loading: apptLoading } = useAppointments();

  const todayAppts = appointments.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Hospital Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Stats Grid */}
      {statsLoading || !stats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardStatCard label="Today's OPD" value={stats.todayOPD} icon={Users} delta={stats.todayOPDDelta} accent />
          <DashboardStatCard label="Bed Occupancy" value={`${stats.occupiedBeds}/${stats.totalBeds}`} icon={BedDouble} subtext={`${Math.round((stats.occupiedBeds / stats.totalBeds) * 100)}% occupied`} />
          <DashboardStatCard label="Today's Revenue" value={formatINR(stats.todayRevenue)} icon={IndianRupee} delta={stats.todayRevenueDelta} />
          <DashboardStatCard label="New Patients" value={stats.newPatients} icon={UserPlus} />
          <DashboardStatCard label="Pending Lab Tests" value={stats.pendingLabTests} icon={FlaskConical} />
          <DashboardStatCard label="Pending Prescriptions" value={stats.pendingPrescriptions} icon={Pill} />
          <DashboardStatCard label="Scheduled Surgeries" value={stats.scheduledSurgeries} icon={Scissors} />
          <DashboardStatCard label="Appointments Today" value={appointments.length} icon={CalendarDays} />
        </div>
      )}

      {/* Today's Appointments */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-900">Today's Appointments</h2>
          <a href="/dashboard/appointments" className="text-xs font-medium hover:underline" style={{ color: 'var(--color-primary, #33ABC3)' }}>
            View all →
          </a>
        </div>
        {apptLoading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 rounded-lg bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : todayAppts.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">No appointments scheduled today</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {todayAppts.map((appt) => {
              const cfg = STATUS_CONFIG[appt.status];
              const Icon = cfg.icon;
              return (
                <div key={appt.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="w-8 text-center">
                    <span className="text-xs font-bold text-gray-400">#{appt.tokenNumber}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">{appt.patientName}</p>
                    <p className="text-xs text-gray-400">{appt.patientMrn} · {appt.doctorName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{formatTime(appt.scheduledAt)}</p>
                    <p className="text-xs text-gray-400">{appt.department}</p>
                  </div>
                  <span className={cn('flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium', cfg.color)}>
                    <Icon className="h-3 w-3" />
                    {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bed status quick summary */}
      {stats && (
        <div className="rounded-xl border bg-white shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Bed Occupancy</h2>
          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(stats.occupiedBeds / stats.totalBeds) * 100}%`, backgroundColor: 'var(--color-primary, #33ABC3)' }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>{stats.occupiedBeds} occupied</span>
            <span>{stats.totalBeds - stats.occupiedBeds} available</span>
          </div>
        </div>
      )}
    </div>
  );
}