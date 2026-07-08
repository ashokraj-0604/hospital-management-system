'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { IndianRupee, Download, CheckCircle2, Clock, AlertCircle, XCircle, TrendingUp } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import type { Invoice, InvoiceStatus } from '@/src/types/super-admin.types';
import apiClient from '@/src/lib/api-client';
import { fmtINR, fmtDateShort } from '@/src/lib/format';

import { PageLayout } from '@/src/core/layout/PageLayout';
import { PageHeader } from '@/src/core/layout/PageHeader';
import { SummaryGrid, StatTileData } from '@/src/core/StatTile';
import { TableCard, TableCardFooter } from '@/src/core/table/TableCard';
import { TableToolbar } from '@/src/core/table/TableToolbar';
import { SearchInput } from '@/src/core/table/SearchInput';
import { FilterSelect } from '@/src/core/table/FilterSelect';
import { EmptyState } from '@/src/core/table/EmptyState';
import { LoadingSpinner } from '@/src/core/table/TableLoading';
import { Badge } from '@/src/core/Badge';

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<InvoiceStatus, { label: string; icon: React.ElementType; className: string }> = {
  PAID:      { label: 'Paid',      icon: CheckCircle2, className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  PENDING:   { label: 'Pending',   icon: Clock,        className: 'bg-amber-50 text-amber-700 border-amber-200' },
  OVERDUE:   { label: 'Overdue',   icon: AlertCircle,  className: 'bg-red-50 text-red-600 border-red-200' },
  CANCELLED: { label: 'Cancelled', icon: XCircle,      className: 'bg-slate-100 text-slate-500 border-slate-200' },
};

const STATUS_OPTIONS = [
  { label: 'All Status', value: '' },
  { label: 'Paid', value: 'PAID' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Overdue', value: 'OVERDUE' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

// ─── Billing Page ─────────────────────────────────────────────────────────────

export default function BillingPage() {
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatus] = useState('');
  const [invoices, setInvoices]   = useState<Invoice[]>([]);
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
    }), [invoices, search, statusFilter]);

  const totalCollected = invoices.filter(i => i.status === 'PAID').reduce((s, i) => s + i.total, 0);
  const totalPending   = invoices.filter(i => i.status === 'PENDING').reduce((s, i) => s + i.total, 0);
  const totalOverdue   = invoices.filter(i => i.status === 'OVERDUE').reduce((s, i) => s + i.total, 0);
  const totalRevenue   = invoices.reduce((s, i) => s + (i.status !== 'CANCELLED' ? i.total : 0), 0);

  const tiles: StatTileData[] = [
    { label: 'Total Revenue', value: fmtINR(totalRevenue),   icon: TrendingUp,   bg: 'bg-[#E8F8FB]', color: 'text-[#33ABC3]' },
    { label: 'Collected',     value: fmtINR(totalCollected), icon: CheckCircle2, bg: 'bg-emerald-50', color: 'text-emerald-600' },
    { label: 'Pending',       value: fmtINR(totalPending),   icon: Clock,        bg: 'bg-amber-50',   color: 'text-amber-600' },
    { label: 'Overdue',       value: fmtINR(totalOverdue),   icon: AlertCircle,  bg: 'bg-red-50',     color: 'text-red-500' },
  ];

  return (
    <PageLayout>
      <PageHeader
        title="Billing & Invoices"
        subtitle="Subscription revenue across all hospitals"
        actions={
          <button className="flex items-center gap-2 rounded-xl border border-[#D6EFF4] bg-white px-4 py-2 text-sm font-medium text-[#4A7C87] hover:bg-[#F4FAFB] shadow-sm transition-colors">
            <Download size={15} /> Export CSV
          </button>
        }
      />

      <SummaryGrid tiles={tiles} />

      <TableCard>
        <TableToolbar>
          <SearchInput
            value={search}
            placeholder="Search invoice no, hospital…"
            onChange={setSearch}
          />
          <FilterSelect value={statusFilter} onChange={setStatus} options={STATUS_OPTIONS} />
        </TableToolbar>

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
              {apiLoading ? (
                <tr><td colSpan={10}><LoadingSpinner /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={10}>
                  <EmptyState icon={IndianRupee} message="No invoices found" />
                </td></tr>
              ) : filtered.map((inv: Invoice) => {
                const { label, icon: Icon, className } = STATUS_CONFIG[inv.status];
                return (
                  <tr key={inv.invoice_id} className="border-b border-[#D6EFF4] hover:bg-[#F4FAFB] transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-mono text-xs font-semibold text-[#0D2F36]">{inv.invoice_no}</p>
                      <p className="text-[10px] text-[#8AACB3]">{fmtDateShort(inv.created_at)}</p>
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
                      {new Date(inv.period_from).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} –{' '}
                      {new Date(inv.period_to).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </td>
                    <td className="px-5 py-4 font-medium text-[#0D2F36] tabular-nums">{fmtINR(inv.amount)}</td>
                    <td className="px-5 py-4 text-[#4A7C87] tabular-nums">{fmtINR(inv.tax)}</td>
                    <td className="px-5 py-4 font-bold text-[#0D2F36] tabular-nums">{fmtINR(inv.total)}</td>
                    <td className="px-5 py-4 text-xs text-[#4A7C87] whitespace-nowrap">{fmtDateShort(inv.due_date)}</td>
                    <td className="px-5 py-4">
                      <Badge label={label} icon={Icon} className={className} shape="pill" size="sm" />
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

        <TableCardFooter>
          <p className="text-xs text-[#8AACB3]">{filtered.length} invoices</p>
          <p className="text-xs font-semibold text-[#0D2F36]">
            Filtered total: {fmtINR(filtered.filter(i => i.status !== 'CANCELLED').reduce((s, i) => s + i.total, 0))}
          </p>
        </TableCardFooter>
      </TableCard>
    </PageLayout>
  );
}