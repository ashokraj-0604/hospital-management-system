'use client';

import { Users, Building2, IndianRupee, Activity } from 'lucide-react';
import { StatsCard } from './StatsCard';

interface StatsSectionProps {
  stats: any;
  isLoading: boolean;
}

const fmt = (n: number) => n.toLocaleString('en-IN');

const fmtCurrencyShort = (n: number) => {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
};

export function StatsSection({
  stats,
  isLoading,
}: StatsSectionProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

      <StatsCard
        label="Total Hospitals"
        value={isLoading ? '—' : fmt(stats?.total_hospitals ?? 0)}
        icon={Building2}
        iconBg="bg-cyan-50"
        iconColor="text-cyan-600"
      />

      <StatsCard
        label="Total Users"
        value={isLoading ? '—' : fmt(stats?.total_users ?? 0)}
        icon={Users}
        iconBg="bg-violet-50"
        iconColor="text-violet-600"
      />

      <StatsCard
        label="Revenue"
        value={
          isLoading
            ? '—'
            : fmtCurrencyShort(stats?.revenue ?? 0)
        }
        icon={IndianRupee}
        iconBg="bg-green-50"
        iconColor="text-green-600"
      />

      <StatsCard
        label="Active Subscriptions"
        value={
          isLoading
            ? '—'
            : fmt(stats?.active_subscriptions ?? 0)
        }
        icon={Activity}
        iconBg="bg-amber-50"
        iconColor="text-amber-600"
      />

    </div>
  );
}
