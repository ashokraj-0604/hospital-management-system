'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FlaskConical } from 'lucide-react';
import { labStaffApi, LabRequestRow } from './lab.api';
import { DashboardHeader, StatsCard, Alert } from '@/src/core';
import { TableCard } from '@/src/core/table/TableCard';
import { TableToolbar } from '@/src/core/table/TableToolbar';
import { EmptyState } from '@/src/core/table/EmptyState';
import { LoadingSpinner } from '@/src/core/table/TableLoading';
import { BRAND } from '@/src/constants/brand.constants';

const urgencyColor: Record<string, string> = { ROUTINE: 'bg-gray-100 text-gray-600', URGENT: 'bg-red-100 text-red-600' };

export default function LaboratoryDashboardPage() {
  const [requests, setRequests] = useState<LabRequestRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        setRequests(await labStaffApi.findPending());
      } catch {
        setError('Unable to load lab requests.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const pending = requests.filter((r) => r.status === 'PENDING');
  const urgentCount = pending.filter((r) => r.urgency === 'URGENT').length;
  const recentPending = pending.slice(0, 5);

  if (error) return <div className="p-6"><Alert variant="error" message={error} /></div>;

  return (
    <div className="p-6 space-y-6 max-w-[1200px]">
      <DashboardHeader title="Lab Dashboard" primaryColor={BRAND.colors.primary} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatsCard label="Pending Requests" value={isLoading ? '—' : pending.length} icon={FlaskConical} iconBg={BRAND.colors.iconBgTeal} iconColor={BRAND.colors.primary} />
        <StatsCard label="Urgent" value={isLoading ? '—' : urgentCount} icon={FlaskConical} iconBg="bg-red-50" iconColor="text-red-500" />
      </div>

      <TableCard>
        <TableToolbar>
          <span className="font-semibold" style={{ color: BRAND.colors.textDark }}>Recent Pending Requests</span>
          <Link href="/laboratory/pending" className="text-sm font-medium" style={{ color: BRAND.colors.primary }}>
            View all →
          </Link>
        </TableToolbar>

        {isLoading ? <LoadingSpinner /> : recentPending.length === 0 ? (
          <EmptyState icon={FlaskConical} message="No pending lab requests." />
        ) : (
          <div className="divide-y" style={{ borderColor: BRAND.colors.border }}>
            {recentPending.map((r) => (
              <div key={r.request_id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm" style={{ color: BRAND.colors.textDark }}>{r.patient_name}</p>
                  <p className="text-xs" style={{ color: BRAND.colors.textMid }}>{r.test_name} — {r.doctor_name}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${urgencyColor[r.urgency]}`}>{r.urgency}</span>
              </div>
            ))}
          </div>
        )}
      </TableCard>
    </div>
  );
}