'use client';

import { useState } from 'react';
import { useLabOrders } from '@/src/hooks/hospital/useHospital';
import { FlaskConical, AlertTriangle, Download } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import type { LabTestOrder } from '@/src/types/hospitals';

const STATUS_CONFIG: Record<LabTestOrder['status'], { label: string; color: string; step: number }> = {
  ORDERED: { label: 'Ordered', color: 'text-blue-600 bg-blue-50', step: 1 },
  SAMPLE_COLLECTED: { label: 'Sample Collected', color: 'text-purple-600 bg-purple-50', step: 2 },
  IN_PROGRESS: { label: 'In Progress', color: 'text-amber-600 bg-amber-50', step: 3 },
  COMPLETED: { label: 'Completed', color: 'text-emerald-600 bg-emerald-50', step: 4 },
  CANCELLED: { label: 'Cancelled', color: 'text-red-500 bg-red-50', step: 0 },
};

const STEPS = ['Ordered', 'Sample Collected', 'In Progress', 'Completed'];

export default function LabPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const { orders, loading } = useLabOrders(statusFilter === 'ALL' ? undefined : statusFilter);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const abnormalCount = orders.reduce((sum, o) => sum + (o.tests?.filter((t) => t.isAbnormal).length ?? 0), 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Laboratory</h1>
        <p className="text-sm text-gray-500">{orders.length} test orders</p>
      </div>

      {abnormalCount > 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{abnormalCount} abnormal result{abnormalCount > 1 ? 's' : ''} require doctor attention</span>
        </div>
      )}

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
            {s === 'ALL' ? 'All' : STATUS_CONFIG[s as LabTestOrder['status']].label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 rounded-xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border bg-white py-16 text-center">
          <FlaskConical className="mx-auto h-10 w-10 text-gray-200 mb-3" />
          <p className="text-sm text-gray-400">No lab orders found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => {
            const cfg = STATUS_CONFIG[order.status];
            const isExpanded = expandedId === order.id;
            const hasAbnormal = order.tests?.some((t) => t.isAbnormal);
            return (
              <div key={order.id} className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div
                  className="flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-gray-900">{order.patientName}</p>
                      <span className="text-xs text-gray-400 font-mono">{order.patientMrn}</span>
                      {hasAbnormal && (
                        <span className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                          <AlertTriangle className="h-3 w-3" /> Abnormal
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{order.orderNumber} · {order.doctorName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {order.tests.map((t) => t.name).join(', ')}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', cfg.color)}>
                      {cfg.label}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">{new Date(order.orderedAt).toLocaleDateString('en-IN')}</p>
                  </div>
                  {order.reportUrl && order.status === 'COMPLETED' && (
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-600 hover:bg-gray-50 shrink-0"
                    >
                      <Download className="h-3 w-3" />
                      Report
                    </button>
                  )}
                </div>

                {/* Progress bar for non-cancelled */}
                {order.status !== 'CANCELLED' && (
                  <div className="px-5 pb-3">
                    <div className="flex items-center gap-0">
                      {STEPS.map((stepLabel, i) => {
                        const done = i < cfg.step;
                        const current = i === cfg.step - 1;
                        return (
                          <div key={i} className="flex-1 flex items-center">
                            <div className={cn('h-1.5 flex-1 rounded-full', done || current ? '' : 'bg-gray-100')}
                              style={done || current ? { backgroundColor: 'var(--color-primary, #33ABC3)' } : undefined} />
                            {i < STEPS.length - 1 && <div className="w-0" />}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between mt-1">
                      {STEPS.map((stepLabel, i) => (
                        <span key={i} className={cn('text-[10px]', i < cfg.step ? 'text-gray-600' : 'text-gray-300')}>
                          {stepLabel}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Results */}
                {isExpanded && order.status === 'COMPLETED' && (
                  <div className="border-t border-gray-100 bg-gray-50 px-5 py-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Results</p>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-gray-400">
                          <th className="pb-1.5 text-left font-medium">Test</th>
                          <th className="pb-1.5 text-left font-medium">Result</th>
                          <th className="pb-1.5 text-left font-medium">Reference</th>
                          <th className="pb-1.5 text-left font-medium">Unit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {order.tests.map((t, i) => (
                          <tr key={i}>
                            <td className="py-1.5 pr-3 text-gray-700">{t.name}</td>
                            <td className={cn('py-1.5 pr-3 font-medium', t.isAbnormal ? 'text-red-600' : 'text-gray-900')}>
                              {t.result ?? '—'} {t.isAbnormal && '⚠'}
                            </td>
                            <td className="py-1.5 pr-3 text-gray-400">{t.referenceRange ?? '—'}</td>
                            <td className="py-1.5 text-gray-400">{t.unit ?? '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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