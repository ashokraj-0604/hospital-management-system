'use client';

import { useState } from 'react';
import { usePrescriptions } from '@/src/hooks/hospital/useHospital';
import { Pill, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import type { Prescription } from '@/src/types/hospitals';

const STATUS_CONFIG: Record<Prescription['status'], { label: string; color: string; icon: typeof CheckCircle2 }> = {
  PENDING: { label: 'Pending', color: 'text-amber-600 bg-amber-50', icon: Clock },
  PARTIAL: { label: 'Partial', color: 'text-orange-600 bg-orange-50', icon: AlertCircle },
  DISPENSED: { label: 'Dispensed', color: 'text-emerald-600 bg-emerald-50', icon: CheckCircle2 },
  CANCELLED: { label: 'Cancelled', color: 'text-red-500 bg-red-50', icon: AlertCircle },
};

function formatINR(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

export default function PharmacyPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const { prescriptions, loading, dispense } = usePrescriptions(statusFilter === 'ALL' ? undefined : statusFilter);
  const [dispensingId, setDispensingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleDispense = async (id: string) => {
    setDispensingId(id);
    await dispense(id);
    setDispensingId(null);
  };

  const pendingCount = prescriptions.filter((p) => p.status === 'PENDING' || p.status === 'PARTIAL').length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Pharmacy</h1>
        <p className="text-sm text-gray-500">{pendingCount} prescription{pendingCount !== 1 ? 's' : ''} pending dispensing</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {['ALL', ...Object.keys(STATUS_CONFIG)].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
              statusFilter === s ? 'text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50',
            )}
            style={statusFilter === s ? { backgroundColor: 'var(--color-primary, #33ABC3)' } : undefined}
          >
            {s === 'ALL' ? 'All' : STATUS_CONFIG[s as Prescription['status']].label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 rounded-xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="rounded-xl border bg-white py-16 text-center">
          <Pill className="mx-auto h-10 w-10 text-gray-200 mb-3" />
          <p className="text-sm text-gray-400">No prescriptions found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {prescriptions.map((rx) => {
            const cfg = STATUS_CONFIG[rx.status];
            const Icon = cfg.icon;
            const isExpanded = expandedId === rx.id;
            return (
              <div key={rx.id} className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedId(isExpanded ? null : rx.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{rx.patientName}</p>
                      <span className="text-xs text-gray-400 font-mono">{rx.patientMrn}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{rx.prescriptionNumber} · {rx.doctorName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{rx.items.length} item{rx.items.length !== 1 ? 's' : ''} · {formatINR(rx.totalAmount)}</p>
                  </div>
                  <span className={cn('flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0', cfg.color)}>
                    <Icon className="h-3 w-3" />
                    {cfg.label}
                  </span>
                  {(rx.status === 'PENDING' || rx.status === 'PARTIAL') && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDispense(rx.id); }}
                      disabled={dispensingId === rx.id}
                      className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                      style={{ backgroundColor: 'var(--color-primary, #33ABC3)' }}
                    >
                      {dispensingId === rx.id ? 'Dispensing…' : 'Dispense All'}
                    </button>
                  )}
                </div>
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50 px-5 py-3">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-gray-400 uppercase tracking-wide">
                          <th className="pb-2 text-left font-medium">Drug</th>
                          <th className="pb-2 text-left font-medium">Dosage</th>
                          <th className="pb-2 text-left font-medium">Freq.</th>
                          <th className="pb-2 text-left font-medium">Duration</th>
                          <th className="pb-2 text-right font-medium">Qty</th>
                          <th className="pb-2 text-right font-medium">Dispensed</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {rx.items.map((item, i) => (
                          <tr key={i}>
                            <td className="py-1.5 pr-3 font-medium text-gray-700">{item.drugName}</td>
                            <td className="py-1.5 pr-3 text-gray-500">{item.dosage}</td>
                            <td className="py-1.5 pr-3 text-gray-500">{item.frequency}</td>
                            <td className="py-1.5 pr-3 text-gray-500">{item.duration}</td>
                            <td className="py-1.5 text-right text-gray-700">{item.quantity}</td>
                            <td className="py-1.5 text-right">
                              <span className={cn(item.dispensedQuantity === item.quantity ? 'text-emerald-600' : 'text-amber-600')}>
                                {item.dispensedQuantity}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {rx.items[0]?.instructions && (
                      <p className="mt-2 text-xs text-gray-400">Instructions: {rx.items[0].instructions}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}