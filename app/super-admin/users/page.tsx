'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Users, Shield, CheckCircle2, XCircle, KeyRound, MoreVertical, Building2 } from 'lucide-react';
import { MOCK_USERS } from '@/src/lib/super-admin/mockdata';
import { cn } from '@/src/lib/utils';
import type { PlatformUser } from '@/src/types/super-admin.types';

// ─── Role config ──────────────────────────────────────────────────────────────

const ROLE_COLORS: Record<string, string> = {
  HOSPITAL_ADMIN: 'bg-[#E8F8FB] text-[#33ABC3]',
  DOCTOR:         'bg-violet-50 text-violet-700',
  NURSE:          'bg-pink-50 text-pink-700',
  RECEPTIONIST:   'bg-amber-50 text-amber-700',
  PHARMACIST:     'bg-emerald-50 text-emerald-700',
  BILLING_OFFICER:'bg-blue-50 text-blue-700',
  LAB_TECHNICIAN: 'bg-orange-50 text-orange-700',
  SUPER_ADMIN:    'bg-[#0D2F36] text-white',
};

const ALL_ROLES = ['HOSPITAL_ADMIN','DOCTOR','NURSE','RECEPTIONIST','PHARMACIST','BILLING_OFFICER','LAB_TECHNICIAN'];

function timeAgo(dateStr?: string) {
  if (!dateStr) return 'Never';
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ─── Users Page ───────────────────────────────────────────────────────────────

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return MOCK_USERS.filter(u => {
      const matchSearch = !search ||
        u.full_name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.hospital_name.toLowerCase().includes(search.toLowerCase());
      const matchRole = !roleFilter || u.role === roleFilter;
      const matchStatus = !statusFilter ||
        (statusFilter === 'ACTIVE' ? u.is_active : !u.is_active);
      return matchSearch && matchRole && matchStatus;
    });
  }, [search, roleFilter, statusFilter]);

  // Summary counts
  const totalActive = MOCK_USERS.filter(u => u.is_active).length;
  const mfaEnabled  = MOCK_USERS.filter(u => u.is_mfa_enabled).length;

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D2F36]">Platform Users</h1>
          <p className="text-sm text-[#8AACB3] mt-0.5">All staff accounts across every hospital</p>
        </div>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Users',   value: MOCK_USERS.length, icon: Users,        bg: 'bg-[#E8F8FB]', color: 'text-[#33ABC3]' },
          { label: 'Active',        value: totalActive,        icon: CheckCircle2, bg: 'bg-emerald-50', color: 'text-emerald-600' },
          { label: 'Inactive',      value: MOCK_USERS.length - totalActive, icon: XCircle, bg: 'bg-red-50', color: 'text-red-500' },
          { label: 'MFA Enabled',   value: mfaEnabled,         icon: Shield,       bg: 'bg-violet-50', color: 'text-violet-600' },
        ].map(({ label, value, icon: Icon, bg, color }) => (
          <div key={label} className="rounded-2xl bg-white border border-[#D6EFF4] px-5 py-4 flex items-center gap-4 shadow-sm">
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl shrink-0', bg)}>
              <Icon size={20} className={color} />
            </div>
            <div>
              <p className="text-xl font-bold text-[#0D2F36] tabular-nums">{value}</p>
              <p className="text-xs text-[#8AACB3]">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="rounded-2xl bg-white border border-[#D6EFF4] shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-[#D6EFF4]">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8AACB3]" />
            <input
              type="text"
              placeholder="Search name, email, hospital…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] pl-9 pr-4 py-2 text-sm text-[#0D2F36] placeholder-[#8AACB3] focus:outline-none focus:ring-2 focus:ring-[#33ABC3]/30 focus:border-[#33ABC3]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-[#8AACB3]" />
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
              className="rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] px-3 py-2 text-sm text-[#4A7C87] focus:outline-none focus:ring-2 focus:ring-[#33ABC3]/30">
              <option value="">All Roles</option>
              {ALL_ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] px-3 py-2 text-sm text-[#4A7C87] focus:outline-none focus:ring-2 focus:ring-[#33ABC3]/30">
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <span className="ml-auto text-xs text-[#8AACB3]">{filtered.length} users</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#D6EFF4] bg-[#F4FAFB]">
                {['User', 'Hospital', 'Role', 'MFA', 'Status', 'Last Login', ''].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#8AACB3] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-16 text-center">
                  <Users size={32} className="mx-auto text-[#D6EFF4] mb-2" />
                  <p className="text-sm text-[#8AACB3]">No users match your filters</p>
                </td></tr>
              ) : filtered.map((u: PlatformUser) => (
                <tr key={u.user_id} className="border-b border-[#D6EFF4] hover:bg-[#F4FAFB] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8F8FB] text-xs font-bold text-[#33ABC3]">
                        {u.full_name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-[#0D2F36]">{u.full_name}</p>
                        <p className="text-xs text-[#8AACB3]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-[#4A7C87]">
                      <Building2 size={13} className="text-[#8AACB3]" />
                      <span className="text-xs">{u.hospital_name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn('rounded-lg px-2.5 py-1 text-xs font-semibold', ROLE_COLORS[u.role] ?? 'bg-slate-100 text-slate-600')}>
                      {u.role.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {u.is_mfa_enabled
                      ? <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium"><KeyRound size={12} />On</span>
                      : <span className="text-xs text-[#8AACB3]">Off</span>}
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border',
                      u.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200')}>
                      <span className={cn('h-1.5 w-1.5 rounded-full', u.is_active ? 'bg-emerald-500' : 'bg-red-400')} />
                      {u.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-[#8AACB3]">{timeAgo(u.last_login_at)}</td>
                  <td className="px-5 py-4">
                    <div className="relative">
                      <button onClick={() => setOpenMenu(openMenu === u.user_id ? null : u.user_id)}
                        className="rounded-lg p-1.5 text-[#8AACB3] hover:bg-[#E8F8FB] hover:text-[#33ABC3] transition-colors">
                        <MoreVertical size={15} />
                      </button>
                      {openMenu === u.user_id && (
                        <div className="absolute right-0 z-50 mt-1 w-44 rounded-xl border border-[#D6EFF4] bg-white shadow-lg py-1">
                          <button onClick={() => setOpenMenu(null)} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#4A7C87] hover:bg-[#F4FAFB]">View profile</button>
                          <button onClick={() => setOpenMenu(null)} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#4A7C87] hover:bg-[#F4FAFB]">Reset password</button>
                          <button onClick={() => setOpenMenu(null)} className={cn('flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-[#F4FAFB]', u.is_active ? 'text-red-600' : 'text-emerald-600')}>
                            {u.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#D6EFF4]">
          <p className="text-xs text-[#8AACB3]">Showing {filtered.length} of {MOCK_USERS.length} users</p>
        </div>
      </div>
    </div>
  );
}