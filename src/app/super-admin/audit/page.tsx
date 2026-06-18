'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, ShieldCheck, Pencil, PlusCircle,
  MinusCircle, AlertTriangle, Clock, RefreshCw, Loader2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import apiClient from '@/src/lib/api-client';
import type { AuditLog } from '@/src/types/super-admin.types';

const ACTION_CONFIG: Record<string, { icon: React.ElementType; className: string }> = {
  CREATE:   { icon: PlusCircle,    className: 'bg-emerald-50 text-emerald-600' },
  UPDATE:   { icon: Pencil,        className: 'bg-blue-50 text-blue-600' },
  DELETE:   { icon: MinusCircle,   className: 'bg-red-50 text-red-600' },
  SUSPEND:  { icon: AlertTriangle, className: 'bg-amber-50 text-amber-600' },
  ACTIVATE: { icon: ShieldCheck,   className: 'bg-[#E8F8FB] text-[#33ABC3]' },
};

function fmtDate(d: string) {
  return new Date(d).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function AuditPage() {
  const [logs, setLogs]               = useState<AuditLog[]>([]);
  const [hospitals, setHospitals]     = useState<{ hospital_id: string; hospital_name: string }[]>([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [search, setSearch]           = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [hospitalFilter, setHospitalFilter] = useState('');
  const [page, setPage]               = useState(1);
  const [total, setTotal]             = useState(0);
  const LIMIT = 25;

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const params: any = { page, limit: LIMIT };
      if (search)         params.search      = search;
      if (actionFilter)   params.action      = actionFilter;
      if (hospitalFilter) params.hospital_id = hospitalFilter;

      const { data } = await apiClient.get('/audit', { params });
      setLogs(data.items ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch hospital list for filter dropdown
  const fetchHospitals = async () => {
    try {
      const { data } = await apiClient.get('/hospitals', { params: { limit: 100 } });
      setHospitals(data.items ?? []);
    } catch {
      setHospitals([]);
    }
  };

  useEffect(() => { fetchHospitals(); }, []);
  useEffect(() => { fetchLogs(); }, [search, actionFilter, hospitalFilter, page]);

  const uniqueActions = ['CREATE', 'UPDATE', 'DELETE', 'SUSPEND', 'ACTIVATE'];
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D2F36]">Audit Logs</h1>
          <p className="text-sm text-[#8AACB3] mt-0.5">
            Complete activity trail — {total} total entries
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="flex items-center gap-2 rounded-xl border border-[#D6EFF4] bg-white px-3 py-2 text-sm text-[#4A7C87] hover:bg-[#F4FAFB] transition-colors"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Table card */}
      <div className="rounded-2xl bg-white border border-[#D6EFF4] shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-[#D6EFF4]">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8AACB3]" />
            <input
              type="text"
              placeholder="Search action, resource, hospital…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] pl-9 pr-4 py-2 text-sm text-[#0D2F36] placeholder-[#8AACB3] focus:outline-none focus:ring-2 focus:ring-[#33ABC3]/30 focus:border-[#33ABC3]"
            />
          </div>
          <select
            value={actionFilter}
            onChange={e => { setActionFilter(e.target.value); setPage(1); }}
            className="rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] px-3 py-2 text-sm text-[#4A7C87] focus:outline-none focus:ring-2 focus:ring-[#33ABC3]/30"
          >
            <option value="">All Actions</option>
            {uniqueActions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <select
            value={hospitalFilter}
            onChange={e => { setHospitalFilter(e.target.value); setPage(1); }}
            className="rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] px-3 py-2 text-sm text-[#4A7C87] focus:outline-none focus:ring-2 focus:ring-[#33ABC3]/30"
          >
            <option value="">All Hospitals</option>
            {hospitals.map(h => (
              <option key={h.hospital_id} value={h.hospital_id}>{h.hospital_name}</option>
            ))}
          </select>
          <span className="ml-auto text-xs text-[#8AACB3]">{logs.length} of {total} entries</span>
        </div>

        {/* Log entries */}
        <div className="divide-y divide-[#D6EFF4]">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={24} className="animate-spin text-[#33ABC3]" />
            </div>
          ) : logs.length === 0 ? (
            <div className="py-16 text-center">
              <ShieldCheck size={32} className="mx-auto text-[#D6EFF4] mb-2" />
              <p className="text-sm text-[#8AACB3]">No audit entries match your filters</p>
            </div>
          ) : logs.map((log: AuditLog) => {
            const cfg = ACTION_CONFIG[log.action] ?? { icon: ShieldCheck, className: 'bg-slate-50 text-slate-500' };
            const Icon = cfg.icon;
            return (
              <div key={log.log_id} className="flex items-start gap-4 px-5 py-4 hover:bg-[#F4FAFB] transition-colors">
                <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl mt-0.5', cfg.className)}>
                  <Icon size={16} />
                </div>
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
                <div className="shrink-0 flex items-center gap-1.5 text-xs text-[#8AACB3] whitespace-nowrap">
                  <Clock size={11} />
                  {fmtDate(log.created_at)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-[#D6EFF4] flex items-center justify-between">
          <p className="text-xs text-[#8AACB3]">Logs retained for 90 days</p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="rounded-lg border border-[#D6EFF4] px-3 py-1 text-xs text-[#4A7C87] hover:bg-[#F4FAFB] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-xs text-[#8AACB3]">Page {page} of {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="rounded-lg border border-[#D6EFF4] px-3 py-1 text-xs text-[#4A7C87] hover:bg-[#F4FAFB] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}