'use client';

import React, { useEffect, useState } from 'react';
import { UserPlus, Contact } from 'lucide-react';
import { receptionistsApi, Receptionist, CreateReceptionistPayload } from './receptionist.api';
import { Button, Input, Alert } from '@/src/core';
import { SlideOverPanel } from '@/src/core/SlideOverPanel';
import { TableCard } from '@/src/core/table/TableCard';
import { TableToolbar } from '@/src/core/table/TableToolbar';
import { SearchInput } from '@/src/core/table/SearchInput';
import { EmptyState } from '@/src/core/table/EmptyState';
import { LoadingSpinner } from '@/src/core/table/TableLoading';
import { BRAND } from '@/src/constants/brand.constants';
import { RECEPTIONIST_SHIFTS } from '@/src/constants/dashboard.constants';
import { getApiErrorMessage } from '@/src/lib/api-error';

export default function ReceptionistsPage() {
  const [receptionists, setReceptionists] = useState<Receptionist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showPanel, setShowPanel] = useState(false);
  const [form, setForm] = useState<CreateReceptionistPayload>({
    name: '', email: '', password: '', desk_assignment: '', shift: 'MORNING', phone: '',
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAll = async () => {
    setIsLoading(true);
    setQueryError(null);
    try {
      setReceptionists(await receptionistsApi.findAll());
    } catch (err) {
      setQueryError(getApiErrorMessage(err, 'Unable to load receptionists. Please check backend connectivity.'));
    }
    setIsLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const filtered = receptionists.filter(
    (r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await receptionistsApi.create(form);
      setShowPanel(false);
      setForm({ name: '', email: '', password: '', desk_assignment: '', shift: 'MORNING', phone: '' });
      await fetchAll();
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message ?? 'Unable to add receptionist.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: BRAND.colors.textDark }}>Receptionists</h1>
          <p className="text-sm" style={{ color: BRAND.colors.textLight }}>{receptionists.length} receptionists</p>
        </div>
        <Button leftIcon={<UserPlus size={16} />} onClick={() => setShowPanel(true)}>Add Receptionist</Button>
      </div>

      {queryError && <Alert variant="error" message={queryError} />}

      <TableCard>
        <TableToolbar>
          <SearchInput value={search} onChange={setSearch} placeholder="Search by name or email..." />
        </TableToolbar>

        {isLoading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <EmptyState icon={Contact} message="No receptionists yet." />
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left" style={{ color: BRAND.colors.textLight }}>
              <tr className="border-b" style={{ borderColor: BRAND.colors.border }}>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Desk</th>
                <th className="px-5 py-3 font-medium">Shift</th>
                <th className="px-5 py-3 font-medium">Phone</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.receptionist_id} className="border-b last:border-b-0" style={{ borderColor: BRAND.colors.border }}>
                  <td className="px-5 py-3 font-medium" style={{ color: BRAND.colors.textDark }}>{r.name}</td>
                  <td className="px-5 py-3">{r.email}</td>
                  <td className="px-5 py-3">{r.desk_assignment}</td>
                  <td className="px-5 py-3">{r.shift}</td>
                  <td className="px-5 py-3">{r.phone}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {r.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableCard>

      {showPanel && (
        <SlideOverPanel title="Add Receptionist" onClose={() => setShowPanel(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {submitError && <Alert variant="error" message={submitError} />}
            <Input required label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input required type="email" label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input required type="password" label="Set login password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <Input required label="Desk assignment" placeholder="e.g. Front Desk" value={form.desk_assignment} onChange={(e) => setForm({ ...form, desk_assignment: e.target.value })} />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Shift</label>
              <select value={form.shift} onChange={(e) => setForm({ ...form, shift: e.target.value as any })}
                className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }}>
                {RECEPTIONIST_SHIFTS.map((shift) => (
                  <option key={shift} value={shift}>{shift[0] + shift.slice(1).toLowerCase()}</option>
                ))}
              </select>
            </div>
            <Input required label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Button type="submit" fullWidth isLoading={isSubmitting}>Create Receptionist</Button>
          </form>
        </SlideOverPanel>
      )}
    </div>
  );
}