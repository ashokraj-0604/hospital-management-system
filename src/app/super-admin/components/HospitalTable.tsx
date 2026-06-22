'use client';

import React, { useState } from 'react';
import { Search, Filter, Plus, MoreVertical, Building2, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '@/src/components/ui/Button';
import type { Hospital } from '@/src/types/super-admin.types';
import type { HospitalStatus } from '@/src/constants/brand.constants';

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<HospitalStatus, { label: string; icon: React.ElementType; className: string }> = {
  ACTIVE:    { label: 'Active',    icon: CheckCircle,   className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  TRIAL:     { label: 'Trial',     icon: Clock,         className: 'bg-amber-50 text-amber-700 border-amber-200' },
  SUSPENDED: { label: 'Suspended', icon: XCircle,       className: 'bg-red-50 text-red-700 border-red-200' },
  EXPIRED:   { label: 'Expired',   icon: AlertCircle,   className: 'bg-slate-50 text-slate-600 border-slate-200' },
};

const PLAN_BADGE: Record<string, string> = {
  BASIC:      'bg-slate-100 text-slate-600',
  STANDARD:   'bg-[#E8F8FB] text-[#33ABC3]',
  ENTERPRISE: 'bg-[#0D2F36] text-white',
};

const StatusBadge: React.FC<{ status: HospitalStatus }> = ({ status }) => {
  const { label, icon: Icon, className } = STATUS_CONFIG[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium', className)}>
      <Icon size={11} />
      {label}
    </span>
  );
};

// ─── HospitalTable ────────────────────────────────────────────────────────────

interface HospitalTableProps {
  hospitals: Hospital[];
  isLoading?: boolean;
  onSearch: (q: string) => void;
  onFilterStatus: (s: string) => void;
  onFilterPlan: (p: string) => void;
  onAddNew: () => void;
  onView: (h: Hospital) => void;
  onSuspend: (h: Hospital) => void;
  onActivate: (h: Hospital) => void;
}

export const HospitalTable: React.FC<HospitalTableProps> = ({
  hospitals, isLoading, onSearch, onFilterStatus, onFilterPlan,
  onAddNew, onView, onSuspend, onActivate,
}) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <div className="rounded-2xl bg-white border border-[#D6EFF4] shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-[#D6EFF4]">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8AACB3]" />
          <input
            type="text"
            placeholder="Search hospitals, cities…"
            onChange={(e) => onSearch(e.target.value)}
            className="w-full rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] pl-9 pr-4 py-2 text-sm text-[#0D2F36] placeholder-[#8AACB3] focus:outline-none focus:ring-2 focus:ring-[#33ABC3]/30 focus:border-[#33ABC3]"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[#8AACB3]" />
          <select
            onChange={(e) => onFilterStatus(e.target.value)}
            className="rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] px-3 py-2 text-sm text-[#4A7C87] focus:outline-none focus:ring-2 focus:ring-[#33ABC3]/30"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="TRIAL">Trial</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="EXPIRED">Expired</option>
          </select>
          <select
            onChange={(e) => onFilterPlan(e.target.value)}
            className="rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] px-3 py-2 text-sm text-[#4A7C87] focus:outline-none focus:ring-2 focus:ring-[#33ABC3]/30"
          >
            <option value="">All Plans</option>
            <option value="BASIC">Basic</option>
            <option value="STANDARD">Standard</option>
            <option value="ENTERPRISE">Enterprise</option>
          </select>
        </div>

        <Button onClick={onAddNew} size="sm" className="bg-[#33ABC3] text-white hover:bg-[#1D8FA8] ml-auto">
          <Plus size={14} /> Add Hospital
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#D6EFF4] bg-[#F4FAFB]">
              {['Hospital', 'Location', 'Plan', 'Status', 'Beds', 'Users', 'Patients', ''].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#8AACB3] uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-b border-[#D6EFF4]">
                  {Array.from({ length: 8 }).map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 rounded-md bg-[#F4FAFB] animate-pulse" style={{ width: `${60 + j * 10}%` }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : hospitals.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <Building2 size={32} className="mx-auto text-[#D6EFF4] mb-2" />
                  <p className="text-sm text-[#8AACB3]">No hospitals found</p>
                </td>
              </tr>
            ) : hospitals.map((h) => (
              <tr
                key={h.hospital_id}
                className="border-b border-[#D6EFF4] hover:bg-[#F4FAFB] transition-colors cursor-pointer"
                onClick={() => onView(h)}
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white text-xs font-bold"
                      style={{ backgroundColor: h.primary_color }}
                    >
                      {h.hospital_code.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-[#0D2F36]">{h.hospital_name}</p>
                      <p className="text-xs text-[#8AACB3]">{h.hospital_code}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-[#4A7C87]">{h.city}, {h.state}</td>
                <td className="px-5 py-4">
                  <span className={cn('rounded-lg px-2.5 py-1 text-xs font-semibold', PLAN_BADGE[h.subscription_plan])}>
                    {h.subscription_plan}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={h.status} />
                </td>
                <td className="px-5 py-4 text-[#4A7C87] tabular-nums">{h.total_beds?.toLocaleString() ?? '—'}</td>
                <td className="px-5 py-4 text-[#4A7C87] tabular-nums">{h.total_users?.toLocaleString() ?? '—'}</td>
                <td className="px-5 py-4 text-[#4A7C87] tabular-nums">{h.total_patients?.toLocaleString() ?? '—'}</td>
                <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === h.hospital_id ? null : h.hospital_id)}
                      className="rounded-lg p-1.5 text-[#8AACB3] hover:bg-[#E8F8FB] hover:text-[#33ABC3] transition-colors"
                    >
                      <MoreVertical size={15} />
                    </button>
                    {openMenu === h.hospital_id && (
                      <div className="absolute right-0 z-50 mt-1 w-40 rounded-xl border border-[#D6EFF4] bg-white shadow-lg py-1">
                        <button onClick={() => { onView(h); setOpenMenu(null); }} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#4A7C87] hover:bg-[#F4FAFB]">View details</button>
                        {h.status === 'SUSPENDED'
                          ? <button onClick={() => { onActivate(h); setOpenMenu(null); }} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-emerald-600 hover:bg-[#F4FAFB]">Activate</button>
                          : <button onClick={() => { onSuspend(h); setOpenMenu(null); }} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-[#F4FAFB]">Suspend</button>
                        }
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-[#D6EFF4] flex items-center justify-between">
        <p className="text-xs text-[#8AACB3]">{hospitals.length} hospitals shown</p>
        <div className="flex gap-1">
          {[1, 2, 3].map((p) => (
            <button key={p} className={cn('h-7 w-7 rounded-lg text-xs font-medium', p === 1 ? 'bg-[#33ABC3] text-white' : 'text-[#8AACB3] hover:bg-[#F4FAFB]')}>
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
