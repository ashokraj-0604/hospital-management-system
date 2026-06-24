'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { IndianRupee, Search, Download, CheckCircle2, Clock, AlertCircle, XCircle, TrendingUp } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import type { Invoice, InvoiceStatus } from '@/src/types/super-admin.types';
import apiClient from '@/src/lib/api-client';

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<InvoiceStatus, { label: string; icon: React.ElementType; className: string }> = {
  PAID:      { label: 'Paid',      icon: CheckCircle2, className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  PENDING:   { label: 'Pending',   icon: Clock,        className: 'bg-amber-50 text-amber-700 border-amber-200' },
  OVERDUE:   { label: 'Overdue',   icon: AlertCircle,  className: 'bg-red-50 text-red-600 border-red-200' },
  CANCELLED: { label: 'Cancelled', icon: XCircle,      className: 'bg-slate-100 text-slate-500 border-slate-200' },
};

const fmtINR = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

// ─── Billing Page ─────────────────────────────────────────────────────────────

export default function BillingPage() {
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatus] = useState('');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
const [apiLoading, setApiLoading] = useState(true);

useEffect(() => {
  apiClient.get('/billing/invoices')
    .then(res => setInvoices(res.data.items))
    .finally(() => setApiLoading(false));
}, []);

  const filtered = useMemo(() =>
    invoices.filter(inv => {
      const q = search.toLowerCase();
      const matchQ = !search || inv.hospital_name.toLowerCase().includes(q) || inv.invoice_no.toLowerCase().includes(q);
      const matchS = !statusFilter || inv.status === statusFilter;
      return matchQ && matchS;
    }), [search, statusFilter]);

  // Summary
  const totalCollected = invoices.filter(i => i.status === 'PAID').reduce((s, i) => s + i.total, 0);
  const totalPending   = invoices.filter(i => i.status === 'PENDING').reduce((s, i) => s + i.total, 0);
  const totalOverdue   = invoices.filter(i => i.status === 'OVERDUE').reduce((s, i) => s + i.total, 0);
  const totalRevenue   = invoices.reduce((s, i) => s + (i.status !== 'CANCELLED' ? i.total : 0), 0);

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D2F36]">Billing & Invoices</h1>
          <p className="text-sm text-[#8AACB3] mt-0.5">Subscription revenue across all hospitals</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-[#D6EFF4] bg-white px-4 py-2 text-sm font-medium text-[#4A7C87] hover:bg-[#F4FAFB] shadow-sm transition-colors">
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue',   value: fmtINR(totalRevenue),   icon: TrendingUp,  bg: 'bg-[#E8F8FB]', color: 'text-[#33ABC3]' },
          { label: 'Collected',       value: fmtINR(totalCollected), icon: CheckCircle2,bg: 'bg-emerald-50',  color: 'text-emerald-600' },
          { label: 'Pending',         value: fmtINR(totalPending),   icon: Clock,       bg: 'bg-amber-50',   color: 'text-amber-600' },
          { label: 'Overdue',         value: fmtINR(totalOverdue),   icon: AlertCircle, bg: 'bg-red-50',     color: 'text-red-500' },
        ].map(({ label, value, icon: Icon, bg, color }) => (
          <div key={label} className="rounded-2xl bg-white border border-[#D6EFF4] px-5 py-4 flex items-center gap-4 shadow-sm">
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl shrink-0', bg)}>
              <Icon size={20} className={color} />
            </div>
            <div>
              <p className="text-lg font-bold text-[#0D2F36] tabular-nums">{value}</p>
              <p className="text-xs text-[#8AACB3]">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="rounded-2xl bg-white border border-[#D6EFF4] shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-[#D6EFF4]">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8AACB3]" />
            <input
              type="text"
              placeholder="Search invoice no, hospital…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] pl-9 pr-4 py-2 text-sm text-[#0D2F36] placeholder-[#8AACB3] focus:outline-none focus:ring-2 focus:ring-[#33ABC3]/30 focus:border-[#33ABC3]"
            />
          </div>
          <select value={statusFilter} onChange={e => setStatus(e.target.value)}
            className="rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] px-3 py-2 text-sm text-[#4A7C87] focus:outline-none focus:ring-2 focus:ring-[#33ABC3]/30">
            <option value="">All Status</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="OVERDUE">Overdue</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#D6EFF4] bg-[#F4FAFB]">
                {['Invoice', 'Hospital', 'Plan', 'Period', 'Amount', 'Tax (18%)', 'Total', 'Due Date', 'Status', ''].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#8AACB3] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10} className="py-16 text-center">
                  <IndianRupee size={32} className="mx-auto text-[#D6EFF4] mb-2" />
                  <p className="text-sm text-[#8AACB3]">No invoices found</p>
                </td></tr>
              ) : filtered.map((inv: Invoice) => {
                const { label, icon: Icon, className } = STATUS_CONFIG[inv.status];
                return (
                  <tr key={inv.invoice_id} className="border-b border-[#D6EFF4] hover:bg-[#F4FAFB] transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-mono text-xs font-semibold text-[#0D2F36]">{inv.invoice_no}</p>
                      <p className="text-[10px] text-[#8AACB3]">{new Date(inv.created_at).toLocaleDateString('en-IN')}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#4A7C87]">{inv.hospital_name}</td>
                    <td className="px-5 py-4">
                      <span className={cn('rounded-lg px-2 py-0.5 text-xs font-semibold',
                        inv.subscription_plan === 'ENTERPRISE' ? 'bg-[#0D2F36] text-white' :
                        inv.subscription_plan === 'STANDARD'   ? 'bg-[#E8F8FB] text-[#33ABC3]' :
                        'bg-slate-100 text-slate-600')}>
                        {inv.subscription_plan}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-[#8AACB3] whitespace-nowrap">
                      {new Date(inv.period_from).toLocaleDateString('en-IN', { day:'numeric', month:'short' })} –{' '}
                      {new Date(inv.period_to).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'2-digit' })}
                    </td>
                    <td className="px-5 py-4 font-medium text-[#0D2F36] tabular-nums">{fmtINR(inv.amount)}</td>
                    <td className="px-5 py-4 text-[#4A7C87] tabular-nums">{fmtINR(inv.tax)}</td>
                    <td className="px-5 py-4 font-bold text-[#0D2F36] tabular-nums">{fmtINR(inv.total)}</td>
                    <td className="px-5 py-4 text-xs text-[#4A7C87] whitespace-nowrap">
                      {new Date(inv.due_date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium', className)}>
                        <Icon size={11} />{label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button className="rounded-lg p-1.5 text-[#8AACB3] hover:bg-[#E8F8FB] hover:text-[#33ABC3] transition-colors">
                        <Download size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-[#D6EFF4] flex items-center justify-between">
          <p className="text-xs text-[#8AACB3]">{filtered.length} invoices</p>
          <p className="text-xs font-semibold text-[#0D2F36]">
            Filtered total: {fmtINR(filtered.filter(i => i.status !== 'CANCELLED').reduce((s, i) => s + i.total, 0))}
          </p>
        </div>
      </div>
    </div>
  );
}
