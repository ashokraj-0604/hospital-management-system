'use client';

import React, { useMemo, useState } from 'react';
import { Stethoscope, UserPlus } from 'lucide-react';
import { useDoctors } from './useDoctors';
import { getApiErrorMessage } from '@/src/lib/api-error';
import { BRAND } from '@/src/constants/brand.constants';
import { Button, Input, Alert } from '@/src/core';
import { SlideOverPanel } from '@/src/core/SlideOverPanel';
import { TableCard } from '@/src/core/table/TableCard';
import { TableToolbar } from '@/src/core/table/TableToolbar';
import { SearchInput } from '@/src/core/table/SearchInput';
import { EmptyState } from '@/src/core/table/EmptyState';
import { LoadingSpinner } from '@/src/core/table/TableLoading';

export default function DoctorsPage() {
  const { doctors, isLoading, error, addDoctor } = useDoctors();
  const [search, setSearch] = useState('');
  const [showPanel, setShowPanel] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    department: '',
    qualification: '',
    experience_years: '',
    phone: '',
  });

  const filteredDoctors = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return doctors;

    return doctors.filter((doctor) =>
      [doctor.name, doctor.email, doctor.specialization, doctor.department]
        .some((value) => value.toLowerCase().includes(term)),
    );
  }, [doctors, search]);

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      password: '',
      specialization: '',
      department: '',
      qualification: '',
      experience_years: '',
      phone: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await addDoctor({
        ...form,
        experience_years: form.experience_years ? Number(form.experience_years) : 0,
      });
      setShowPanel(false);
      resetForm();
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, 'Unable to add doctor.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: BRAND.colors.textDark }}>Doctors</h1>
          <p className="text-sm" style={{ color: BRAND.colors.textLight }}>{doctors.length} doctors</p>
        </div>
        <Button leftIcon={<UserPlus size={16} />} onClick={() => setShowPanel(true)}>Add Doctor</Button>
      </div>

      {error && <Alert variant="error" message={error} />}

      <TableCard>
        <TableToolbar>
          <SearchInput value={search} onChange={setSearch} placeholder="Search by name, email, specialization..." />
        </TableToolbar>

        {isLoading ? (
          <LoadingSpinner />
        ) : filteredDoctors.length === 0 ? (
          <EmptyState icon={Stethoscope} message="No doctors found." />
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left" style={{ color: BRAND.colors.textLight }}>
              <tr className="border-b" style={{ borderColor: BRAND.colors.border }}>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Specialization</th>
                <th className="px-5 py-3 font-medium">Department</th>
                <th className="px-5 py-3 font-medium">Experience</th>
                <th className="px-5 py-3 font-medium">Phone</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doctor) => (
                <tr key={doctor.doctor_id} className="border-b last:border-b-0" style={{ borderColor: BRAND.colors.border }}>
                  <td className="px-5 py-3 font-medium" style={{ color: BRAND.colors.textDark }}>Dr. {doctor.name}</td>
                  <td className="px-5 py-3">{doctor.email}</td>
                  <td className="px-5 py-3">{doctor.specialization}</td>
                  <td className="px-5 py-3">{doctor.department}</td>
                  <td className="px-5 py-3">{doctor.experience_years} yrs</td>
                  <td className="px-5 py-3">{doctor.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableCard>

      {showPanel && (
        <SlideOverPanel title="Add Doctor" onClose={() => setShowPanel(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {submitError && <Alert variant="error" message={submitError} />}
            <Input required label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input required type="email" label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input required type="password" label="Set login password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <Input required label="Specialization" placeholder="e.g. Cardiology" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
            <Input required label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            <Input label="Qualification" placeholder="optional" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} />
            <Input type="number" min={0} label="Years of experience" value={form.experience_years} onChange={(e) => setForm({ ...form, experience_years: e.target.value })} />
            <Input required label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Button type="submit" fullWidth isLoading={isSubmitting}>Create Doctor</Button>
          </form>
        </SlideOverPanel>
      )}
    </div>
  );
}
