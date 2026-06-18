'use client';

import React from 'react';
import {
  Building2, Users, UserSquare2, IndianRupee,
  TrendingUp, Activity, Clock, ShieldAlert,
} from 'lucide-react';
import { StatsCard } from '@/src/components/super-admin/StatsCard';
import { usePlatformStats } from '@/src/hooks/super-admin/usePlatformStats';
import { useHospitals } from '@/src/hooks/super-admin/useHospital';
import { useAuditLogs } from '@/src/hooks/super-admin/useAuditLogs';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => n.toLocaleString('en-IN');
const fmtCurrency = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function SuperAdminDashboard() {
  const { stats, isLoading } = usePlatformStats();
  const { hospitals, isLoading: hospitalsLoading } = useHospitals({ page: 1, limit: 4 });
  const { auditLogs, isLoading: auditLogsLoading } = useAuditLogs({ page: 1, limit: 5 });

  return (
    <div className="p-6 space-y-7 max-w-[1400px]">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D2F36]">Platform Overview</h1>
          <p className="text-sm text-[#8AACB3] mt-0.5">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[#D6EFF4] bg-white px-3 py-2 shadow-sm">
          <Activity size={14} className="text-[#33ABC3]" />
          <span className="text-xs font-semibold text-[#33ABC3]">System Online</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Total Hospitals"
          value={isLoading ? '—' : fmt(stats?.total_hospitals ?? 0)}
          subValue={`${stats?.active_hospitals ?? 0} active`}
          icon={Building2}
          iconBg="bg-[#E8F8FB]"
          iconColor="text-[#33ABC3]"
          growth={stats?.growth.hospitals}
        />
        <StatsCard
          label="Platform Users"
          value={isLoading ? '—' : fmt(stats?.total_users ?? 0)}
          subValue="across all hospitals"
          icon={Users}
          iconBg="bg-violet-50"
          iconColor="text-violet-500"
          growth={stats?.growth.users}
        />
        <StatsCard
          label="Total Patients"
          value={isLoading ? '—' : fmt(stats?.total_patients ?? 0)}
          subValue="registered records"
          icon={UserSquare2}
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
          growth={stats?.growth.patients}
        />
        <StatsCard
          label="Revenue (MTD)"
          value={isLoading ? '—' : fmtCurrency(stats?.revenue_this_month ?? 0)}
          subValue={`Total: ${fmtCurrency(stats?.revenue_total ?? 0)}`}
          icon={IndianRupee}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          growth={stats?.growth.revenue}
        />
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Plan Distribution */}
        <div className="rounded-2xl bg-white border border-[#D6EFF4] p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[#0D2F36] mb-4">Subscription Distribution</h3>
          <div className="space-y-4">
            {[
              { label: 'Enterprise', key: 'ENTERPRISE', color: '#0D2F36', bg: '#0D2F36' },
              { label: 'Standard',  key: 'STANDARD',  color: '#33ABC3', bg: '#33ABC3' },
              { label: 'Basic',     key: 'BASIC',     color: '#8AACB3', bg: '#8AACB3' },
            ].map(({ label, key, bg }) => {
              const count = stats?.hospitals_by_plan[key as keyof typeof stats.hospitals_by_plan] ?? 0;
              const total = stats?.total_hospitals ?? 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-[#4A7C87]">{label}</span>
                    <span className="text-xs font-bold text-[#0D2F36]">{count} <span className="text-[#8AACB3] font-normal">({pct}%)</span></span>
                  </div>
                  <div className="h-2 rounded-full bg-[#F4FAFB]">
                    <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: bg }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Status breakdown */}
          <div className="mt-5 pt-4 border-t border-[#D6EFF4] grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Active', value: stats?.active_hospitals, color: 'text-emerald-600' },
              { label: 'Trial', value: stats?.trial_hospitals, color: 'text-amber-600' },
              { label: 'Suspended', value: stats?.suspended_hospitals, color: 'text-red-500' },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <p className={`text-lg font-bold tabular-nums ${color}`}>{value ?? 0}</p>
                <p className="text-[10px] text-[#8AACB3] font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Hospitals */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-[#D6EFF4] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#0D2F36]">Recent Hospitals</h3>
            <a href="/super-admin/hospitals" className="text-xs font-medium text-[#33ABC3] hover:opacity-80">View all →</a>
          </div>
          <div className="space-y-3">
            {hospitalsLoading ? (
              <p className="py-8 text-center text-sm text-[#8AACB3]">Loading hospitals...</p>
            ) : hospitals.length === 0 ? (
              <p className="py-8 text-center text-sm text-[#8AACB3]">No hospitals found</p>
            ) : hospitals.map((h) => (
              <div key={h.hospital_id} className="flex items-center gap-3 rounded-xl p-3 hover:bg-[#F4FAFB] transition-colors">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white text-xs font-bold"
                  style={{ backgroundColor: h.primary_color }}
                >
                  {h.hospital_code.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-[#0D2F36]">{h.hospital_name}</p>
                  <p className="text-xs text-[#8AACB3]">{h.city} · {h.total_beds} beds</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-xs font-semibold rounded-lg px-2 py-0.5 ${
                    h.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' :
                    h.status === 'TRIAL' ? 'bg-amber-50 text-amber-700' :
                    'bg-red-50 text-red-600'
                  }`}>{h.status}</span>
                  <p className="text-[10px] text-[#8AACB3] mt-0.5">{h.subscription_plan}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Quick actions */}
        <div className="rounded-2xl bg-white border border-[#D6EFF4] p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[#0D2F36] mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Building2, label: 'Onboard Hospital', href: '/super-admin/hospitals', color: '#33ABC3', bg: '#E8F8FB' },
              { icon: Users, label: 'Manage Users', href: '/super-admin/users', color: '#8B5CF6', bg: '#F5F3FF' },
              { icon: TrendingUp, label: 'View Reports', href: '/super-admin/billing', color: '#059669', bg: '#ECFDF5' },
              { icon: ShieldAlert, label: 'Audit Logs', href: '/super-admin/audit', color: '#D97706', bg: '#FFFBEB' },
            ].map(({ icon: Icon, label, href, color, bg }) => (
              <a
                key={label}
                href={href}
                className="flex flex-col items-start gap-2 rounded-xl border border-[#D6EFF4] p-4 hover:border-[#33ABC3]/40 hover:shadow-sm transition-all"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: bg }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <span className="text-sm font-medium text-[#0D2F36]">{label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Audit Log preview */}
        <div className="rounded-2xl bg-white border border-[#D6EFF4] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#0D2F36]">Recent Activity</h3>
            <a href="/super-admin/audit" className="text-xs font-medium text-[#33ABC3] hover:opacity-80">View all →</a>
          </div>
          <div className="space-y-3">
            {auditLogsLoading ? (
              <p className="py-8 text-center text-sm text-[#8AACB3]">Loading activity...</p>
            ) : auditLogs.length === 0 ? (
              <p className="py-8 text-center text-sm text-[#8AACB3]">No recent activity found</p>
            ) : auditLogs.map((log) => (
              <div key={log.log_id} className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#E8F8FB] mt-0.5">
                  <Clock size={11} className="text-[#33ABC3]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#0D2F36]">
                    <span className="font-semibold">{log.action}</span>{' '}
                    <span className="text-[#4A7C87]">{log.resource}</span>{' '}
                    for <span className="font-medium">{log.hospital_name}</span>
                  </p>
                  <p className="text-[10px] text-[#8AACB3] mt-0.5">
                    {new Date(log.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}