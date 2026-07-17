'use client';

import React, { useEffect, useState } from 'react';
import { UserPlus, Plus } from 'lucide-react';
import { receptionistPatientsApi, RegisteredPatient } from './patients.api';
import { Button, Input, Alert } from '@/src/core';
import { SlideOverPanel } from '@/src/core/SlideOverPanel';
import { TableCard } from '@/src/core/table/TableCard';
import { TableToolbar } from '@/src/core/table/TableToolbar';
import { SearchInput } from '@/src/core/table/SearchInput';
import { EmptyState } from '@/src/core/table/EmptyState';
import { LoadingSpinner } from '@/src/core/table/TableLoading';
import { BRAND } from '@/src/constants/brand.constants';

export default function ReceptionistPatientsPage() {
  const [patients, setPatients] = useState<RegisteredPatient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showPanel, setShowPanel] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({ full_name: '', age: '', gender: 'MALE', phone: '' });

  const fetchAll = async (query?: string) => {
    setIsLoading(true);
    const rows = await receptionistPatientsApi.findAll(query || undefined);
    setPatients(Array.isArray(rows) ? rows : []);
    setIsLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  useEffect(() => {
    const timeout = setTimeout(() => fetchAll(search), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await receptionistPatientsApi.register({
        full_name: form.full_name,
        age: Number(form.age),
        gender: form.gender,
        phone: form.phone,
      });
      setShowPanel(false);
      setForm({ full_name: '', age: '', gender: 'MALE', phone: '' });
      await fetchAll(search);
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message ?? 'Unable to register patient.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: BRAND.colors.textDark }}>Patient Registration</h1>
          <p className="text-sm" style={{ color: BRAND.colors.textLight }}>{patients.length} patients</p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={() => setShowPanel(true)}>Register Patient</Button>
      </div>

      <TableCard>
        <TableToolbar>
          <SearchInput value={search} onChange={setSearch} placeholder="Search by name..." />
        </TableToolbar>

        {isLoading ? (
          <LoadingSpinner />
        ) : patients.length === 0 ? (
          <EmptyState icon={UserPlus} message="No patients found." />
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left" style={{ color: BRAND.colors.textLight }}>
              <tr className="border-b" style={{ borderColor: BRAND.colors.border }}>
                <th className="px-5 py-3 font-medium">MRN</th>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Age</th>
                <th className="px-5 py-3 font-medium">Gender</th>
                <th className="px-5 py-3 font-medium">Phone</th>
                <th className="px-5 py-3 font-medium">Registered</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.patient_id} className="border-b last:border-b-0" style={{ borderColor: BRAND.colors.border }}>
                  <td className="px-5 py-3 font-mono text-xs" style={{ color: BRAND.colors.textMid }}>{p.mrn}</td>
                  <td className="px-5 py-3 font-medium" style={{ color: BRAND.colors.textDark }}>{p.full_name}</td>
                  <td className="px-5 py-3">{p.age}</td>
                  <td className="px-5 py-3">{p.gender}</td>
                  <td className="px-5 py-3">{p.phone}</td>
                  <td className="px-5 py-3">{new Date(p.registered_at).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableCard>

      {showPanel && (
        <SlideOverPanel title="Register Patient" onClose={() => setShowPanel(false)} width={420}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {submitError && <Alert variant="error" message={submitError} />}
            <Input required label="Full Name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <Input required label="Age" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Gender</label>
                <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }}>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
            <Input required label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Button type="submit" fullWidth isLoading={isSubmitting}>Register Patient</Button>
          </form>
        </SlideOverPanel>
      )}
    </div>
  );
}