'use client';

import { useIPD } from '@/src/hooks/hospital/useHospital';
import { BedDouble, AlertTriangle, Clock } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import type { IPDAdmission } from '@/src/types/hospitals';

const WARD_COLORS: Record<IPDAdmission['ward'], string> = {
  GENERAL: 'bg-blue-50 text-blue-700',
  PRIVATE: 'bg-purple-50 text-purple-700',
  SEMI_PRIVATE: 'bg-indigo-50 text-indigo-700',
  ICU: 'bg-red-50 text-red-700',
  NICU: 'bg-pink-50 text-pink-700',
  HDU: 'bg-orange-50 text-orange-700',
};

const STATUS_COLORS: Record<IPDAdmission['status'], string> = {
  ADMITTED: 'text-blue-600 bg-blue-50',
  ICU: 'text-red-600 bg-red-50',
  SURGERY: 'text-purple-600 bg-purple-50',
  RECOVERING: 'text-emerald-600 bg-emerald-50',
  DISCHARGED: 'text-gray-500 bg-gray-100',
};

function daysSince(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default function IPDPage() {
  const { admissions, loading } = useIPD();

  const active = admissions.filter((a) => a.status !== 'DISCHARGED');
  const icuCount = admissions.filter((a) => a.ward === 'ICU').length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Inpatient Department (IPD)</h1>
        <p className="text-sm text-gray-500">{active.length} active admissions</p>
      </div>

      {/* Ward summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Object.entries(WARD_COLORS).map(([ward, color]) => {
          const count = admissions.filter((a) => a.ward === ward && a.status !== 'DISCHARGED').length;
          return (
            <div key={ward} className="rounded-xl border bg-white p-3 shadow-sm text-center">
              <p className={cn('text-xl font-bold', color.split(' ')[1])}>{count}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{ward.replace('_', ' ')}</p>
            </div>
          );
        })}
      </div>

      {icuCount > 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{icuCount} patient{icuCount > 1 ? 's' : ''} currently in ICU — high priority monitoring required.</span>
        </div>
      )}

      {/* Admissions list */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-3">
          <h2 className="font-semibold text-gray-900 text-sm">Active Admissions</h2>
        </div>
        {loading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 rounded-lg bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : active.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">No active admissions</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {active.map((adm) => {
              const days = daysSince(adm.admissionDate);
              return (
                <div key={adm.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-5 py-4">
                  {/* Ward badge */}
                  <div className="shrink-0">
                    <span className={cn('rounded-lg px-2.5 py-1 text-xs font-semibold', WARD_COLORS[adm.ward])}>
                      {adm.ward}
                    </span>
                  </div>
                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{adm.patientName}</p>
                      <span className="text-xs text-gray-400 font-mono">{adm.patientMrn}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{adm.admissionNumber} · {adm.admittingDoctorName}</p>
                    <p className="text-xs text-gray-600 mt-0.5 font-medium">{adm.diagnosis}</p>
                    {adm.notes && <p className="text-xs text-gray-400 mt-0.5 truncate">{adm.notes}</p>}
                  </div>
                  {/* Bed info */}
                  <div className="text-sm text-right shrink-0">
                    <div className="flex items-center gap-1 text-gray-700 justify-end">
                      <BedDouble className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{adm.bedNumber}</span>
                    </div>
                    <p className="text-xs text-gray-400">Room {adm.roomNumber}</p>
                  </div>
                  {/* Days & status */}
                  <div className="text-right shrink-0">
                    <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', STATUS_COLORS[adm.status])}>
                      {adm.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-1 flex items-center justify-end gap-1">
                      <Clock className="h-3 w-3" />
                      {days}d admitted
                    </p>
                    {adm.expectedDischarge && (
                      <p className="text-xs text-gray-400">
                        Exp. discharge: {new Date(adm.expectedDischarge).toLocaleDateString('en-IN')}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
