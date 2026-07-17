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
  const [hospitals,    setHospitals]    = useState<Array<{ hospital_id: string; hospital_name: string }>>([]);
  const [apiLoading,   setApiLoading]   = useState(true);
  const [apiError,     setApiError]     = useState('');
  const [editingUser,  setEditingUser]  = useState<PlatformUser | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);
  const [editHospitalId, setEditHospitalId] = useState('');
  const [isSavingUser, setIsSavingUser] = useState(false);

  useEffect(() => {
    setApiLoading(true);
    setApiError('');
    apiClient.get('/users')
      .then(res => setUsers(res.data?.items ?? []))
      .catch(() => setApiError('Failed to load users. Please refresh the page.'))
      .finally(() => setApiLoading(false));
  }, []);

  useEffect(() => {
    apiClient.get('/hospitals?limit=500')
      .then((res) => {
        const items = res.data?.items ?? [];
        setHospitals(items.map((h: any) => ({ hospital_id: h.hospital_id, hospital_name: h.hospital_name })));
      })
      .catch(() => {
        setHospitals([]);
      });
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
      await apiClient.patch(`/users/${u.user_id}`, { isActive: !u.is_active });
      setUsers(prev => prev.map(x => x.user_id === u.user_id ? { ...x, is_active: !x.is_active } : x));
    } catch {
      alert('Failed to update user status.');
    }
  };

  const handleEditUser = (u: PlatformUser) => {
    setEditingUser(u);
    setEditName(u.full_name);
    setEditRole(u.role);
    setEditIsActive(u.is_active);
    setEditHospitalId(u.hospital_id ?? '');
  };

  const handleSaveUserEdit = async () => {
    if (!editingUser) return;

    setIsSavingUser(true);
    try {
      await apiClient.patch(`/users/${editingUser.user_id}`, {
        name: editName.trim(),
        role: editRole,
        isActive: editIsActive,
        hospitalId: editHospitalId.trim() || null,
      });
      setUsers((prev) =>
        prev.map((x) =>
          x.user_id === editingUser.user_id
            ? {
                ...x,
                full_name: editName.trim(),
                role: editRole,
                is_active: editIsActive,
                hospital_id: editHospitalId.trim(),
                hospital_name:
                  hospitals.find((h) => h.hospital_id === editHospitalId.trim())?.hospital_name ?? x.hospital_name,
              }
            : x,
        ),
      );
      setEditingUser(null);
    } catch {
      alert('Failed to update user.');
    } finally {
      setIsSavingUser(false);
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
                  <td className="px-5 py-4 text-xs text-[#8AACB3]" title={u.last_login_at ?? 'Never logged in'}>
                    {u.last_login_at ? `${timeAgo(u.last_login_at)} (${new Date(u.last_login_at).toLocaleString('en-IN')})` : 'Never'}
                  </td>
                  <td className="px-5 py-4">
                    <ActionMenu
                      items={[
                        { label: 'View profile', onClick: () => {} },
                        { label: 'Edit', onClick: () => handleEditUser(u) },
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

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#D6EFF4] bg-white p-5 shadow-xl">
            <h3 className="text-base font-bold text-[#0D2F36]">Edit User</h3>
            <p className="mt-1 text-xs text-[#8AACB3]">{editingUser.full_name} ({editingUser.email})</p>

            <label className="mt-4 block text-sm text-[#4A7C87]">
              Full Name
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] px-3 py-2 text-sm text-[#0D2F36]"
              />
            </label>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="block text-sm text-[#4A7C87]">
                Role
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] px-3 py-2 text-sm text-[#0D2F36]"
                >
                  {ALL_ROLES.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </label>

              <label className="block text-sm text-[#4A7C87]">
                Status
                <select
                  value={editIsActive ? 'ACTIVE' : 'INACTIVE'}
                  onChange={(e) => setEditIsActive(e.target.value === 'ACTIVE')}
                  className="mt-1 w-full rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] px-3 py-2 text-sm text-[#0D2F36]"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </label>
            </div>

            <label className="mt-3 block text-sm text-[#4A7C87]">
              Hospital ID (UUID)
              <select
                value={editHospitalId}
                onChange={(e) => setEditHospitalId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] px-3 py-2 text-sm text-[#0D2F36]"
              >
                <option value="">No hospital assigned</option>
                {hospitals.map((h) => (
                  <option key={h.hospital_id} value={h.hospital_id}>
                    {h.hospital_name} ({h.hospital_id})
                  </option>
                ))}
              </select>
            </label>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setEditingUser(null)}
                className="rounded-xl border border-[#D6EFF4] bg-white px-4 py-2 text-sm font-medium text-[#4A7C87]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUserEdit}
                disabled={isSavingUser}
                className="rounded-xl bg-[#33ABC3] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {isSavingUser ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}