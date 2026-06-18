'use client';

import { useState } from 'react';
import { useAppointments } from '@/src/hooks/hospital/useHospital';
import { CalendarDays, Clock, CheckCircle2, XCircle, AlertCircle, ChevronDown } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import type { Appointment } from '@/src/types/hospitals';

const STATUS_MAP: Record<Appointment['status'], { label: string; color: string; dot: string }> = {
  SCHEDULED: { label: 'Scheduled', color: 'text-blue-600 bg-blue-50', dot: 'bg-blue-400' },
  CHECKED_IN: { label: 'Checked In', color: 'text-amber-600 bg-amber-50', dot: 'bg-amber-400' },
  IN_PROGRESS: { label: 'In Progress', color: 'text-purple-600 bg-purple-50', dot: 'bg-purple-400' },
  COMPLETED: { label: 'Completed', color: 'text-emerald-600 bg-emerald-50', dot: 'bg-emerald-400' },
  CANCELLED: { label: 'Cancelled', color: 'text-red-500 bg-red-50', dot: 'bg-red-400' },
  NO_SHOW: { label: 'No Show', color: 'text-gray-500 bg-gray-100', dot: 'bg-gray-400' },
};

const TYPE_LABELS: Record<Appointment['type'], string> = {
  NEW_VISIT: 'New Visit',
  FOLLOW_UP: 'Follow-up',
  EMERGENCY: 'Emergency',
  TELECONSULT: 'Teleconsult',
};

const NEXT_STATUS: Partial<Record<Appointment['status'], Appointment['status']>> = {
  SCHEDULED: 'CHECKED_IN',
  CHECKED_IN: 'IN_PROGRESS',
  IN_PROGRESS: 'COMPLETED',
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function AppointmentsPage() {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const { appointments, loading, updateStatus } = useAppointments(selectedDate);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = filterStatus === 'ALL' ? appointments : appointments.filter((a) => a.status === filterStatus);

  const handleProgress = async (appt: Appointment) => {
    const next = NEXT_STATUS[appt.status];
    if (!next) return;
    setUpdatingId(appt.id);
    await updateStatus(appt.id, next);
    setUpdatingId(null);
  };

  const stats = {
    total: appointments.length,
    completed: appointments.filter((a) => a.status === 'COMPLETED').length,
    checkedIn: appointments.filter((a) => a.status === 'CHECKED_IN').length,
    cancelled: appointments.filter((a) => a.status === 'CANCELLED').length,
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Appointments</h1>
          <p className="text-sm text-gray-500">OPD scheduling & queue management</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--color-primary,#33ABC3)]"
          />
        </div>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'text-gray-900' },
          { label: 'Checked In', value: stats.checkedIn, color: 'text-amber-600' },
          { label: 'Completed', value: stats.completed, color: 'text-emerald-600' },
          { label: 'Cancelled', value: stats.cancelled, color: 'text-red-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border bg-white p-4 shadow-sm text-center">
            <p className={cn('text-2xl font-bold', color)}>{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['ALL', ...Object.keys(STATUS_MAP)].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
              filterStatus === s ? 'text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50',
            )}
            style={filterStatus === s ? { backgroundColor: 'var(--color-primary, #33ABC3)' } : undefined}
          >
            {s === 'ALL' ? 'All' : STATUS_MAP[s as Appointment['status']].label}
          </button>
        ))}
      </div>

      {/* Appointment cards */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border bg-white py-16 text-center">
          <CalendarDays className="mx-auto h-10 w-10 text-gray-200 mb-3" />
          <p className="text-sm text-gray-400">No appointments for this filter</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((appt) => {
            const cfg = STATUS_MAP[appt.status];
            const nextStatus = NEXT_STATUS[appt.status];
            return (
              <div key={appt.id} className="flex items-center gap-4 rounded-xl border bg-white px-5 py-4 shadow-sm">
                {/* Token */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white text-sm font-bold"
                  style={{ backgroundColor: 'var(--color-primary, #33ABC3)' }}>
                  {appt.tokenNumber}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-gray-900">{appt.patientName}</p>
                    <span className="text-xs text-gray-400 font-mono">{appt.patientMrn}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{appt.doctorName} · {appt.department}</p>
                  {appt.chiefComplaint && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate">"{appt.chiefComplaint}"</p>
                  )}
                </div>
                {/* Time & type */}
                <div className="hidden md:block text-right">
                  <p className="text-sm text-gray-700 font-medium">{formatTime(appt.scheduledAt)}</p>
                  <p className="text-xs text-gray-400">{TYPE_LABELS[appt.type]} · {appt.duration} min</p>
                </div>
                {/* Status */}
                <span className={cn('rounded-full px-3 py-1 text-xs font-medium shrink-0', cfg.color)}>
                  <span className={cn('inline-block h-1.5 w-1.5 rounded-full mr-1.5 align-middle', cfg.dot)} />
                  {cfg.label}
                </span>
                {/* Action */}
                {nextStatus && (
                  <button
                    onClick={() => handleProgress(appt)}
                    disabled={updatingId === appt.id}
                    className="shrink-0 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    {updatingId === appt.id ? '...' : `Mark ${STATUS_MAP[nextStatus].label}`}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}