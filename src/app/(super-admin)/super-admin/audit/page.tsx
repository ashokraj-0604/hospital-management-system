'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Pencil, PlusCircle,
  MinusCircle, AlertTriangle, Clock, RefreshCw,
} from 'lucide-react';
import apiClient from '@/src/lib/api-client';
import { fmtDate } from '@/src/lib/format';
import type { AuditLog } from '@/src/types/super-admin.types';
import { PageLayout } from '@/src/core/layout/PageLayout';
import { PageHeader } from '@/src/core/layout/PageHeader';
import { TableCard, TableCardFooter } from '@/src/core/table/TableCard';
import { TableToolbar } from '@/src/core/table/TableToolbar';
import { SearchInput } from '@/src/core/table/SearchInput';
import { FilterSelect } from '@/src/core/table/FilterSelect';
import { EmptyState } from '@/src/core/table/EmptyState';
import { LoadingSpinner } from '@/src/core/table/TableLoading';
import { Pagination } from '@/src/core/table/Pagination';
import { BadgeIcon } from '@/src/core/Badge';

const ACTION_CONFIG: Record<string, { icon: React.ElementType; className: string }> = {
  CREATE:   { icon: PlusCircle,    className: 'bg-emerald-50 text-emerald-600' },
  UPDATE:   { icon: Pencil,        className: 'bg-blue-50 text-blue-600' },
  DELETE:   { icon: MinusCircle,   className: 'bg-red-50 text-red-600' },
  SUSPEND:  { icon: AlertTriangle, className: 'bg-amber-50 text-amber-600' },
  ACTIVATE: { icon: ShieldCheck,   className: 'bg-[#E8F8FB] text-[#33ABC3]' },
};

const ACTION_OPTIONS = [
  { label: 'All Actions', value: '' },
  ...['CREATE', 'UPDATE', 'DELETE', 'SUSPEND', 'ACTIVATE'].map(a => ({ label: a, value: a })),
];

export default function AuditPage() {
  const [logs, setLogs]                     = useState<AuditLog[]>([]);
  const [hospitals, setHospitals]           = useState<{ hospital_id: string; hospital_name: string }[]>([]);
  const [isLoading, setIsLoading]           = useState(true);
  const [search, setSearch]                 = useState('');
  const [actionFilter, setActionFilter]     = useState('');
  const [hospitalFilter, setHospitalFilter] = useState('');
  const [page, setPage]                     = useState(1);
  const [total, setTotal]                   = useState(0);
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

  const totalPages = Math.ceil(total / LIMIT);
  const hospitalOptions = [
    { label: 'All Hospitals', value: '' },
    ...hospitals.map(h => ({ label: h.hospital_name, value: h.hospital_id })),
  ];
  return (
    <PageLayout>
      <PageHeader
        title="Audit Logs"
        subtitle={`Complete activity trail — ${total} total entries`}
        actions={
          <button
            onClick={fetchLogs}
            className="flex items-center gap-2 rounded-xl border border-[#D6EFF4] bg-white px-3 py-2 text-sm text-[#4A7C87] hover:bg-[#F4FAFB]"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        }
      />
      <TableCard>
        <TableToolbar>
          <SearchInput
            value={search}
            placeholder="Search action, resource…"
            onChange={v => { setSearch(v); setPage(1); }}
          />
          <FilterSelect
            value={actionFilter}
            onChange={v => { setActionFilter(v); setPage(1); }}
            options={ACTION_OPTIONS}
          />
          <FilterSelect
            value={hospitalFilter}
            onChange={v => { setHospitalFilter(v); setPage(1); }}
            options={hospitalOptions}
          />
          <span className="ml-auto text-xs text-[#8AACB3]">{logs.length} of {total} entries</span>
        </TableToolbar>
        <div className="divide-y divide-[#D6EFF4]">
          {isLoading ? (
            <LoadingSpinner />
          ) : logs.length === 0 ? (
            <EmptyState icon={ShieldCheck} message="No audit entries match your filters" />
          ) : logs.map((log: AuditLog) => {
            const cfg = ACTION_CONFIG[log.action] ?? { icon: ShieldCheck, className: 'bg-slate-50 text-slate-500' };
            return (
              <div key={log.log_id} className="flex items-start gap-4 px-5 py-4 hover:bg-[#F4FAFB] transition-colors">
                <BadgeIcon icon={cfg.icon} className={cfg.className} />
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
        <TableCardFooter>
          <p className="text-xs text-[#8AACB3]">Logs retained for 90 days</p>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </TableCardFooter>
      </TableCard>
    </PageLayout>
  );
}