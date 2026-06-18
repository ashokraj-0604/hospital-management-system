'use client';

import { usePatientBills } from '@/src/hooks/hospital/useHospital';
import { Receipt, IndianRupee, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useState } from 'react';
import type { PatientBill } from '@/src/types/hospitals';

const STATUS_CONFIG: Record<PatientBill['status'], { label: string; color: string }> = {
  DRAFT: { label: 'Draft', color: 'text-gray-600 bg-gray-100' },
  PENDING: { label: 'Pending', color: 'text-amber-600 bg-amber-50' },
  PARTIAL: { label: 'Partial', color: 'text-orange-600 bg-orange-50' },
  PAID: { label: 'Paid', color: 'text-emerald-600 bg-emerald-50' },
  CANCELLED: { label: 'Cancelled', color: 'text-red-500 bg-red-50' },
  REFUNDED: { label: 'Refunded', color: 'text-purple-600 bg-purple-50' },
};

function formatINR(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

export default function BillingPage() {
  const { bills, loading } = usePatientBills();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filtered = filterStatus === 'ALL' ? bills : bills.filter((b) => b.status === filterStatus);

  const totalRevenue = bills.filter((b) => b.status === 'PAID').reduce((s, b) => s + b.paidAmount, 0);
  const totalPending = bills.filter((b) => b.status !== 'PAID' && b.status !== 'CANCELLED').reduce((s, b) => s + b.balance, 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Patient Billing</h1>
        <p className="text-sm text-gray-500">Invoices and payment management</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Total Revenue</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">{formatINR(totalRevenue)}</p>
          <p className="text-xs text-gray-400 mt-0.5">paid bills</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Outstanding</p>
          <p className="text-xl font-bold text-amber-600 mt-1">{formatINR(totalPending)}</p>
          <p className="text-xs text-gray-400 mt-0.5">balance due</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Total Bills</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{bills.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">all time</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {['ALL', ...Object.keys(STATUS_CONFIG)].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
              filterStatus === s ? 'text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50',
            )}
            style={filterStatus === s ? { backgroundColor: 'var(--color-primary, #33ABC3)' } : undefined}
          >
            {s === 'ALL' ? 'All' : STATUS_CONFIG[s as PatientBill['status']].label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 rounded-xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border bg-white py-16 text-center">
          <Receipt className="mx-auto h-10 w-10 text-gray-200 mb-3" />
          <p className="text-sm text-gray-400">No bills found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((bill) => {
            const cfg = STATUS_CONFIG[bill.status];
            const isExpanded = expandedId === bill.id;
            return (
              <div key={bill.id} className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedId(isExpanded ? null : bill.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{bill.patientName}</p>
                      <span className="text-xs text-gray-400 font-mono">{bill.patientMrn}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{bill.billNumber} · {new Date(bill.billDate).toLocaleDateString('en-IN')}</p>
                    {bill.insuranceClaim && (
                      <p className="text-xs text-blue-600 mt-0.5">Insurance: {bill.insuranceClaim}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-gray-900">{formatINR(bill.grandTotal)}</p>
                    {bill.balance > 0 && (
                      <p className="text-xs text-amber-600">Balance: {formatINR(bill.balance)}</p>
                    )}
                  </div>
                  <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0', cfg.color)}>
                    {cfg.label}
                  </span>
                  {bill.status === 'PENDING' || bill.status === 'PARTIAL' ? (
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-white"
                      style={{ backgroundColor: 'var(--color-primary, #33ABC3)' }}
                    >
                      Collect Payment
                    </button>
                  ) : null}
                </div>
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50 px-5 py-3 space-y-3">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-gray-400 uppercase tracking-wide">
                          <th className="pb-2 text-left font-medium">Description</th>
                          <th className="pb-2 text-left font-medium">Category</th>
                          <th className="pb-2 text-right font-medium">Qty</th>
                          <th className="pb-2 text-right font-medium">Unit Price</th>
                          <th className="pb-2 text-right font-medium">Discount</th>
                          <th className="pb-2 text-right font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {bill.items.map((item, i) => (
                          <tr key={i}>
                            <td className="py-1.5 pr-3 text-gray-700">{item.description}</td>
                            <td className="py-1.5 pr-3 text-gray-400">{item.category}</td>
                            <td className="py-1.5 pr-3 text-right text-gray-600">{item.quantity}</td>
                            <td className="py-1.5 pr-3 text-right text-gray-600">{formatINR(item.unitPrice)}</td>
                            <td className="py-1.5 pr-3 text-right text-red-500">{item.discount > 0 ? `-${formatINR(item.discount)}` : '—'}</td>
                            <td className="py-1.5 text-right font-medium text-gray-900">{formatINR(item.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="flex justify-end">
                      <div className="text-right space-y-1 text-xs">
                        <div className="flex justify-between gap-8 text-gray-500">
                          <span>Subtotal</span><span>{formatINR(bill.subtotal)}</span>
                        </div>
                        {bill.discountTotal > 0 && (
                          <div className="flex justify-between gap-8 text-red-500">
                            <span>Discount</span><span>-{formatINR(bill.discountTotal)}</span>
                          </div>
                        )}
                        <div className="flex justify-between gap-8 font-bold text-gray-900 border-t border-gray-200 pt-1">
                          <span>Grand Total</span><span>{formatINR(bill.grandTotal)}</span>
                        </div>
                        {bill.paidAmount > 0 && (
                          <div className="flex justify-between gap-8 text-emerald-600">
                            <span>Paid ({bill.paymentMode})</span><span>{formatINR(bill.paidAmount)}</span>
                          </div>
                        )}
                        {bill.balance > 0 && (
                          <div className="flex justify-between gap-8 text-amber-600 font-semibold">
                            <span>Balance Due</span><span>{formatINR(bill.balance)}</span>
                          </div>
                        )}
                      </div>
                    </div>
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