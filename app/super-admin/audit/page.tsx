'use client';

import React, { useState, useMemo } from 'react';
import { Search, ShieldCheck, Pencil, PlusCircle, MinusCircle, AlertTriangle, Clock } from 'lucide-react';
import { MOCK_AUDIT_LOGS } from '@/src/lib/super-admin/mockdata';
import { MOCK_HOSPITALS } from '@/src/lib/super-admin/mockdata';
import { cn } from '@/src/lib/utils';
import type { AuditLog } from '@/src/types/super-admin.types';

// ─── Action config ────────────────────────────────────────────────────────────

const ACTION_CONFIG: Record<string, { icon: React.ElementType; className: string }> = {
  CREATE:  { icon: PlusCircle,   className: 'bg-emerald-50 text-emerald-600' },
  UPDATE:  { icon: Pencil,       className: 'bg-blue-50 text-blue-600' },
  DELETE:  { icon: MinusCircle,  className: 'bg-red-50 text-red-600' },
  SUSPEND: { icon: AlertTriangle,className: 'bg-amber-50 text-amber-600' },
  ACTIVATE:{ icon: ShieldCheck,  className: 'bg-[#E8F8FB] text-[#33ABC3]' },
};

function fmtDate(d: string) {
  return new Date(d).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

// ─── Audit Page ───────────────────────────────────────────────────────────────

export default function AuditPage() {
  const [search,      setSearch]      = useState('');
  const [actionFilter,setActionFilter]= useState('');
  const [hospitalFilter, setHospitalFilter] = useState('');

  const filtered = useMemo(() =>
    MOCK_AUDIT_LOGS.filter(log => {
      const q = search.toLowerCase();
      const matchQ = !search ||
        log.action.toLowerCase().includes(q) ||
        log.resource.toLowerCase().includes(q) ||
        log.hospital_name.toLowerCase().includes(q) ||
        log.user_name.toLowerCase().includes(q);
      const matchA = !actionFilter   || log.action === actionFilter;
      const matchH = !hospitalFilter || log.hospital_id === hospitalFilter;
      return matchQ && matchA && matchH;
    }), [search, actionFilter, hospitalFilter]);

  const uniqueActions = [...new Set(MOCK_AUDIT_LOGS.map(l => l.action))];

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0D2F36]">Audit Logs</h1>
        <p className="text-sm text-[#8AACB3] mt-0.5">Complete activity trail for all super admin actions</p>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white border border-[#D6EFF4] shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-[#D6EFF4]">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8AACB3]" />
            <input
              type="text"
              placeholder="Search action, resource, hospital…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] pl-9 pr-4 py-2 text-sm text-[#0D2F36] placeholder-[#8AACB3] focus:outline-none focus:ring-2 focus:ring-[#33ABC3]/30 focus:border-[#33ABC3]"
            />
          </div>
          <select value={actionFilter} onChange={e => setActionFilter(e.target.value)}
            className="rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] px-3 py-2 text-sm text-[#4A7C87] focus:outline-none focus:ring-2 focus:ring-[#33ABC3]/30">
            <option value="">All Actions</option>
            {uniqueActions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={hospitalFilter} onChange={e => setHospitalFilter(e.target.value)}
            className="rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] px-3 py-2 text-sm text-[#4A7C87] focus:outline-none focus:ring-2 focus:ring-[#33ABC3]/30">
            <option value="">All Hospitals</option>
            {MOCK_HOSPITALS.map(h => <option key={h.hospital_id} value={h.hospital_id}>{h.hospital_name}</option>)}
          </select>
          <span className="ml-auto text-xs text-[#8AACB3]">{filtered.length} entries</span>
        </div>

        {/* Timeline-style table */}
        <div className="divide-y divide-[#D6EFF4]">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <ShieldCheck size={32} className="mx-auto text-[#D6EFF4] mb-2" />
              <p className="text-sm text-[#8AACB3]">No audit entries match your filters</p>
            </div>
          ) : filtered.map((log: AuditLog) => {
            const cfg = ACTION_CONFIG[log.action] ?? { icon: ShieldCheck, className: 'bg-slate-50 text-slate-500' };
            const Icon = cfg.icon;
            return (
              <div key={log.log_id} className="flex items-start gap-4 px-5 py-4 hover:bg-[#F4FAFB] transition-colors">
                {/* Action icon */}
                <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl mt-0.5', cfg.className)}>
                  <Icon size={16} />
                </div>

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="font-semibold text-sm text-[#0D2F36]">{log.action}</span>
                    <span className="text-sm text-[#4A7C87]">{log.resource}</span>
                    {log.resource_id && (
                      <span className="font-mono text-xs text-[#8AACB3]">#{log.resource_id}</span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-[#8AACB3]">
                    <span>Hospital: <span className="text-[#4A7C87] font-medium">{log.hospital_name}</span></span>
                    <span>By: <span className="text-[#4A7C87] font-medium">{log.user_name}</span></span>
                    {log.ip_address && <span>IP: {log.ip_address}</span>}
                  </div>
                </div>

                {/* Timestamp */}
                <div className="shrink-0 flex items-center gap-1.5 text-xs text-[#8AACB3] whitespace-nowrap">
                  <Clock size={11} />
                  {fmtDate(log.created_at)}
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-5 py-3 border-t border-[#D6EFF4]">
          <p className="text-xs text-[#8AACB3]">Logs are retained for 90 days</p>
        </div>
      </div>
    </div>
  );
}