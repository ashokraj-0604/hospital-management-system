'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FlaskConical, Users } from 'lucide-react';
import { adminLabApi, AdminLabRequest, LabHospitalStats } from './laboratory.api';
import { DashboardHeader, StatsCard, Alert } from '@/src/core';
import { TableCard } from '@/src/core/table/TableCard';
import { TableToolbar } from '@/src/core/table/TableToolbar';
import { EmptyState } from '@/src/core/table/EmptyState';
import { LoadingSpinner } from '@/src/core/table/TableLoading';
import { BRAND } from '@/src/constants/brand.constants';

const urgencyColor: Record<string, string> = { ROUTINE: 'bg-gray-100 text-gray-600', URGENT: 'bg-red-100 text-red-600' };
const statusColor: Record<string, string> = { PENDING: 'bg-amber-50 text-amber-600', COMPLETED: 'bg-emerald-50 text-emerald-700' };

export default function AdminLaboratoryPage() {
  const [stats, setStats] = useState<LabHospitalStats | null>(null);
  const [requests, setRequests] = useState<AdminLabRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [s, r] = await Promise.all([
        adminLabApi.getStats(),
        adminLabApi.findAll({ status: statusFilter || undefined, urgency: urgencyFilter || undefined }),
      ]);
      setStats(s);
      setRequests(r);
    } catch {
      setError('Unable to load laboratory data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [statusFilter, urgencyFilter]);

  if (error) return <div className="p-6"><Alert variant="error" message={error} /></div>;

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <DashboardHeader title="Laboratory" primaryColor={BRAND.colors.primary} />
        <Link href="/hospital-admin/staff/lab" className="flex items-center gap-1.5 text-sm font-medium" style={{ color: BRAND.colors.primary }}>
          <Users size={16} /> Manage Lab Staff
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatsCard label="Total Requests" value={isLoading ? '—' : stats?.total_requests ?? 0} icon={FlaskConical} iconBg={BRAND.colors.iconBgTeal} iconColor={BRAND.colors.primary} />
        <StatsCard label="Pending" value={isLoading ? '—' : stats?.pending ?? 0} icon={FlaskConical} iconBg="bg-amber-50" iconColor="text-amber-500" />
        <StatsCard label="Completed" value={isLoading ? '—' : stats?.completed ?? 0} icon={FlaskConical} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <StatsCard label="Urgent Pending" value={isLoading ? '—' : stats?.urgent_pending ?? 0} icon={FlaskConical} iconBg="bg-red-50" iconColor="text-red-500" />
      </div>

      <TableCard>
        <TableToolbar>
          <div className="flex gap-2">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: BRAND.colors.border }}>
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <select value={urgencyFilter} onChange={(e) => setUrgencyFilter(e.target.value)}
              className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: BRAND.colors.border }}>
              <option value="">All Urgency</option>
              <option value="ROUTINE">Routine</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </TableToolbar>

        {isLoading ? <LoadingSpinner /> : requests.length === 0 ? (
          <EmptyState icon={FlaskConical} message="No lab requests found." />
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left" style={{ color: BRAND.colors.textLight }}>
              <tr className="border-b" style={{ borderColor: BRAND.colors.border }}>
                <th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">Test</th>
                <th className="px-5 py-3 font-medium">Doctor</th>
                <th className="px-5 py-3 font-medium">Urgency</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Requested</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.request_id} className="border-b last:border-b-0" style={{ borderColor: BRAND.colors.border }}>
                  <td className="px-5 py-3 font-medium" style={{ color: BRAND.colors.textDark }}>{r.patient_name}</td>
                  <td className="px-5 py-3">{r.test_name} <span className="text-xs" style={{ color: BRAND.colors.textLight }}>({r.test_type})</span></td>
                  <td className="px-5 py-3">{r.doctor_name}</td>
                  <td className="px-5 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${urgencyColor[r.urgency]}`}>{r.urgency}</span></td>
                  <td className="px-5 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[r.status]}`}>{r.status}</span></td>
                  <td className="px-5 py-3 text-xs" style={{ color: BRAND.colors.textLight }}>
                    {new Date(r.created_at).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableCard>
    </div>
  );
}