'use client';

import {
  Users,
  BedDouble,
  CalendarCheck,
  IndianRupee,
} from 'lucide-react';

import { StatsCard } from '@/src/core';
import { BRAND } from '@/src/constants/brand.constants';
import { fmt, fmtCurrencyShort } from '@/src/utils/formatters';

interface Props {
  stats: any;
  isLoading: boolean;
}


export function HospitalStatsSection({
  stats,
  isLoading,
}: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        label="Total Patients Today"
        value={isLoading ? '—' : fmt(stats?.total_patients_today ?? 0)}
        subValue={`${stats?.new_registrations_today ?? 0} new registrations`}
        icon={Users}
        iconBg={BRAND.colors.iconBgTeal}
        iconColor={BRAND.colors.primary}
        growth={stats?.patients_growth_pct}
      />

      <StatsCard
        label="Beds Available"
        value={
          isLoading
            ? '—'
            : `${fmt(stats?.beds_available ?? 0)} / ${fmt(
                stats?.beds_total ?? 0
              )}`
        }
        subValue={`${
          (stats?.beds_total ?? 0) -
          (stats?.beds_available ?? 0)
        } occupied`}
        icon={BedDouble}
        iconBg="bg-amber-50"
        iconColor="text-amber-500"
        growth={stats?.beds_occupied_delta}
      />

      <StatsCard
        label="Appointments Today"
        value={isLoading ? '—' : fmt(stats?.appointments_today ?? 0)}
        subValue={`${stats?.appointments_pending ?? 0} pending confirmation`}
        icon={CalendarCheck}
        iconBg="bg-violet-50"
        iconColor="text-violet-500"
        growth={stats?.appointments_growth}
      />

      <StatsCard
        label="Revenue (Today)"
        value={
          isLoading
            ? '—'
            : fmtCurrencyShort(stats?.revenue_today ?? 0)
        }
        subValue={`Total MTD: ${fmtCurrencyShort(
          stats?.revenue_mtd ?? 0
        )}`}
        icon={IndianRupee}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-600"
        growth={stats?.revenue_growth_pct}
      />
    </div>
  );
}
