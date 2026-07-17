'use client';

import React, { useEffect, useState } from 'react';
import { UserPlus, FlaskConical } from 'lucide-react';
import { labTechniciansApi, LabTechnician, CreateLabTechnicianPayload } from './lab-technician.api';
import { Button, Input, Alert } from '@/src/core';
import { SlideOverPanel } from '@/src/core/SlideOverPanel';
import { TableCard } from '@/src/core/table/TableCard';
import { TableToolbar } from '@/src/core/table/TableToolbar';
import { SearchInput } from '@/src/core/table/SearchInput';
import { EmptyState } from '@/src/core/table/EmptyState';
import { LoadingSpinner } from '@/src/core/table/TableLoading';
import { BRAND } from '@/src/constants/brand.constants';

export default function LabStaffPage() {
  const [staff, setStaff] = useState<LabTechnician[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showPanel, setShowPanel] = useState(false);
  const [form, setForm] = useState<CreateLabTechnicianPayload>({ name: '', email: '', password: '', lab_section: '', phone: '' });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAll = async () => {
    setIsLoading(true);
    setStaff(await labTechniciansApi.findAll());
    setIsLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const filtered = staff.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await labTechniciansApi.create(form);
      setShowPanel(false);
      setForm({ name: '', email: '', password: '', lab_section: '', phone: '' });
      await fetchAll();
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message ?? 'Unable to add lab staff.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: BRAND.colors.textDark }}>Lab Staff</h1>
          <p className="text-sm" style={{ color: BRAND.colors.textLight }}>{staff.length} lab technicians</p>
        </div>
        <Button leftIcon={<UserPlus size={16} />} onClick={() => setShowPanel(true)}>Add Lab Staff</Button>
      </div>

      <TableCard>
        <TableToolbar>
          <SearchInput value={search} onChange={setSearch} placeholder="Search by name or email..." />
        </TableToolbar>
        {isLoading ? <LoadingSpinner /> : filtered.length === 0 ? (
          <EmptyState icon={FlaskConical} message="No lab staff yet." />
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left" style={{ color: BRAND.colors.textLight }}>
              <tr className="border-b" style={{ borderColor: BRAND.colors.border }}>
                <th className="px-5 py-3 font-medium">Name</th><th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Section</th><th className="px-5 py-3 font-medium">Phone</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.lab_technician_id} className="border-b last:border-b-0" style={{ borderColor: BRAND.colors.border }}>
                  <td className="px-5 py-3 font-medium" style={{ color: BRAND.colors.textDark }}>{s.name}</td>
                  <td className="px-5 py-3">{s.email}</td>
                  <td className="px-5 py-3">{s.lab_section}</td>
                  <td className="px-5 py-3">{s.phone}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {s.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableCard>

      {showPanel && (
        <SlideOverPanel title="Add Lab Staff" onClose={() => setShowPanel(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {submitError && <Alert variant="error" message={submitError} />}
            <Input required label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input required type="email" label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input required type="password" label="Set login password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <Input required label="Lab Section" placeholder="e.g. Pathology" value={form.lab_section} onChange={(e) => setForm({ ...form, lab_section: e.target.value })} />
            <Input required label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Button type="submit" fullWidth isLoading={isSubmitting}>Create Lab Staff</Button>
          </form>
        </SlideOverPanel>
      )}
    </div>
  );
}