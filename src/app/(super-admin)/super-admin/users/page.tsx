'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Filter, Users, Shield, CheckCircle2, XCircle, KeyRound, Building2 } from 'lucide-react';
import type { PlatformUser } from '@/src/types/super-admin.types';
import apiClient from '@/src/lib/api-client';
import { timeAgo } from '@/src/lib/format';

import { PageLayout } from '@/src/core/layout/PageLayout';
import { PageHeader } from '@/src/core/layout/PageHeader';
import { SummaryGrid, StatTileData } from '@/src/core/StatTile';
import { TableCard, TableCardFooter } from '@/src/core/table/TableCard';
import { TableToolbar } from '@/src/core/table/TableToolbar';
import { SearchInput } from '@/src/core/table/SearchInput';
import { FilterSelect } from '@/src/core/table/FilterSelect';
import { EmptyState } from '@/src/core/table/EmptyState';
import { SkeletonRows } from '@/src/core/table/TableLoading';
import { ActionMenu } from '@/src/core/table/ActionMenu';
import { Badge, DotBadge } from '@/src/core/Badge';
import { Avatar } from '@/src/core/Avatar';

// ─── Role config ──────────────────────────────────────────────────────────────

const ROLE_COLORS: Record<string, string> = {
  HOSPITAL_ADMIN:  'bg-[#E8F8FB] text-[#33ABC3]',
  DOCTOR:          'bg-violet-50 text-violet-700',
  NURSE:           'bg-pink-50 text-pink-700',
  RECEPTIONIST:    'bg-amber-50 text-amber-700',
  PHARMACIST:      'bg-emerald-50 text-emerald-700',
  BILLING_OFFICER: 'bg-blue-50 text-blue-700',
  LAB_TECHNICIAN:  'bg-orange-50 text-orange-700',
  SUPER_ADMIN:     'bg-[#0D2F36] text-white',
};

const ALL_ROLES = [
  'HOSPITAL_ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST',
  'PHARMACIST', 'BILLING_OFFICER', 'LAB_TECHNICIAN',
];

const ROLE_OPTIONS = [
  { label: 'All Roles', value: '' },
  ...ALL_ROLES.map(r => ({ label: r.replace(/_/g, ' '), value: r })),
];

const STATUS_OPTIONS = [
  { label: 'All Status', value: '' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
];

// ─── Users Page ───────────────────────────────────────────────────────────────

export default function UsersPage() {
  const [search,       setSearch]       = useState('');
  const [roleFilter,   setRoleFilter]   = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [users,        setUsers]        = useState<PlatformUser[]>([]);
  const [apiLoading,   setApiLoading]   = useState(true);
  const [apiError,     setApiError]     = useState('');

  useEffect(() => {
    setApiLoading(true);
    setApiError('');
    apiClient.get('/users')
      .then(res => setUsers(res.data?.items ?? []))
      .catch(() => setApiError('Failed to load users. Please refresh the page.'))
      .finally(() => setApiLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return users.filter(u => {
      const matchSearch = !search ||
        u.full_name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.hospital_name.toLowerCase().includes(search.toLowerCase());
      const matchRole   = !roleFilter   || u.role === roleFilter;
      const matchStatus = !statusFilter || (statusFilter === 'ACTIVE' ? u.is_active : !u.is_active);
      return matchSearch && matchRole && matchStatus;
    });
  }, [search, roleFilter, statusFilter, users]);

  const totalActive = users.filter(u => u.is_active).length;
  const mfaEnabled  = users.filter(u => u.is_mfa_enabled).length;

  const handleToggleStatus = async (u: PlatformUser) => {
    try {
      await apiClient.patch(`/users/${u.user_id}/${u.is_active ? 'deactivate' : 'activate'}`);
      setUsers(prev => prev.map(x => x.user_id === u.user_id ? { ...x, is_active: !x.is_active } : x));
    } catch {
      alert('Failed to update user status.');
    }
  };

  const tiles: StatTileData[] = [
    { label: 'Total Users', value: apiLoading ? '—' : users.length,               icon: Users,        bg: 'bg-[#E8F8FB]',  color: 'text-[#33ABC3]' },
    { label: 'Active',      value: apiLoading ? '—' : totalActive,                icon: CheckCircle2, bg: 'bg-emerald-50', color: 'text-emerald-600' },
    { label: 'Inactive',    value: apiLoading ? '—' : users.length - totalActive, icon: XCircle,      bg: 'bg-red-50',     color: 'text-red-500' },
    { label: 'MFA Enabled', value: apiLoading ? '—' : mfaEnabled,                 icon: Shield,       bg: 'bg-violet-50',  color: 'text-violet-600' },
  ];

  return (
    <PageLayout>
      <PageHeader title="Platform Users" subtitle="All staff accounts across every hospital" />

      <SummaryGrid tiles={tiles} />

      <TableCard>
        <TableToolbar>
          <SearchInput value={search} placeholder="Search name, email, hospital…" onChange={setSearch} />
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-[#8AACB3]" />
            <FilterSelect value={roleFilter} onChange={setRoleFilter} options={ROLE_OPTIONS} />
            <FilterSelect value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} />
          </div>
          <span className="ml-auto text-xs text-[#8AACB3]">
            {apiLoading ? 'Loading…' : `${filtered.length} users`}
          </span>
        </TableToolbar>

        {apiError && (
          <div className="px-5 py-4 bg-red-50 border-b border-red-100">
            <p className="text-sm text-red-600">{apiError}</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#D6EFF4] bg-[#F4FAFB]">
                {['User', 'Hospital', 'Role', 'MFA', 'Status', 'Last Login', ''].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#8AACB3] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {apiLoading ? (
                <SkeletonRows columns={7} widths={{ 0: '140px', 6: '32px' }} />
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7}>
                  <EmptyState icon={Users} message={users.length === 0 ? 'No users found' : 'No users match your filters'} />
                </td></tr>
              ) : filtered.map((u: PlatformUser) => (
                <tr key={u.user_id} className="border-b border-[#D6EFF4] hover:bg-[#F4FAFB] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={u.full_name} size="sm" bg="bg-[#E8F8FB]" color="text-[#33ABC3]" />
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
                    <Badge label={u.role.replace(/_/g, ' ')} className={ROLE_COLORS[u.role] ?? 'bg-slate-100 text-slate-600'} size="sm" />
                  </td>
                  <td className="px-5 py-4">
                    {u.is_mfa_enabled
                      ? <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium"><KeyRound size={12} />On</span>
                      : <span className="text-xs text-[#8AACB3]">Off</span>}
                  </td>
                  <td className="px-5 py-4">
                    <DotBadge active={u.is_active} />
                  </td>
                  <td className="px-5 py-4 text-xs text-[#8AACB3]">{timeAgo(u.last_login_at)}</td>
                  <td className="px-5 py-4">
                    <ActionMenu
                      items={[
                        { label: 'View profile', onClick: () => {} },
                        { label: 'Reset password', onClick: () => {} },
                        {
                          label: u.is_active ? 'Deactivate' : 'Activate',
                          onClick: () => handleToggleStatus(u),
                          variant: u.is_active ? 'danger' : 'success',
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <TableCardFooter>
          <p className="text-xs text-[#8AACB3]">
            {apiLoading ? 'Loading users…' : `Showing ${filtered.length} of ${users.length} users`}
          </p>
        </TableCardFooter>
      </TableCard>
    </PageLayout>
  );
}