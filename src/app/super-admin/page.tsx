'use client';

import { usePlatformStats } from './usePlatformStats';
import { useHospitals } from './useHospital';
import { useAuditLogs } from './useAuditLogs';
import { QuickActions } from '@/src/components/QuickAction'
import {DashboardHeader} from '../hospital-admin/components/DashboardHeader';
import { StatsSection } from './components/StatsSection';
import { SubscriptionDistribution } from './components/SubscriptionDistribution';
import { RecentHospitals } from './components/RecentHospital';
import { AuditLog } from './components/AuditLog';
import { QUICK_ACTIONS } from '@/src/constants/dashboard.constants';
// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function SuperAdminDashboard() {
  const { stats, isLoading } = usePlatformStats();
  const { hospitals, isLoading: hospitalsLoading } = useHospitals({ page: 1, limit: 4 });
  const { auditLogs, isLoading: auditLogsLoading } = useAuditLogs({ page: 1, limit: 5 });
  return (
    <div className="p-6 space-y-7 max-w-[1400px]">
      <DashboardHeader title="Platform Overview"/>
      {/* Stats Grid */}
      <StatsSection stats={stats} isLoading={isLoading}/>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <SubscriptionDistribution stats={stats} />
        <RecentHospitals hospitals={hospitals} isLoading={hospitalsLoading} />
      </div>
      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Quick actions */}
        <QuickActions actions={QUICK_ACTIONS} />        {/* Audit Log preview */}
        <AuditLog auditLogs={auditLogs} isLoading={auditLogsLoading} />
      </div>
    </div>
  );
}
