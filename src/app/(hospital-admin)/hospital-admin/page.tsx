'use client';

import { UpcomingAppointments } from './components/UpcomingAppointment';
import { BedOccupancyCard } from './components/BedOccupancy';
import { useHospitalStats } from './useHospitalStats';
import { useAppointments } from './useAppointment';
import { useBedWards } from './useBedWards';
import { useActivityLog } from './useActivityLog';
import { BRAND } from '@/src/constants/brand.constants';
import { DashboardHeader } from '@/src/core';
import { HospitalStatsSection } from './components/StatsSection';
import { HOSPITAL_QUICK_ACTIONS } from '@/src/constants/dashboard.constants';
import { QuickActions } from '@/src/core';
import { ActivityLog } from './components/ActivityLog';


// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function HospitalAdminDashboard() {
  const { stats, isLoading } = useHospitalStats();
  const { appointments, isLoading: appointmentsLoading } = useAppointments({ limit: 5 });
  const { wards, isLoading: wardsLoading } = useBedWards();
  const { activityLog, isLoading: activityLoading } = useActivityLog({ page: 1, limit: 4 });

  return (
    <div className="p-6 space-y-7 max-w-[1400px]">

      {/* Header */}
      <DashboardHeader title="Hospital Overview" primaryColor={BRAND.colors.primary} />
      {/* Stats Grid */}
      <HospitalStatsSection stats={stats} isLoading={isLoading} />

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <BedOccupancyCard wards={wards} isLoading={wardsLoading} />
        <UpcomingAppointments appointments={appointments} isLoading={appointmentsLoading} />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Quick actions */}
        <QuickActions actions={HOSPITAL_QUICK_ACTIONS} />

        {/* Activity preview */}
        <ActivityLog logs={activityLog} isLoading={activityLoading} />
      </div>
    </div>
  );
}
