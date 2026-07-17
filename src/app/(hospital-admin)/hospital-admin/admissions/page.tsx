'use client';

import React, { useEffect, useState } from 'react';
import { BedDouble, Plus, Users, LogOut } from 'lucide-react';
import { admissionsApi, Admission, AdmissionStats, CreateAdmissionPayload } from './admission.api';
import { bedsApi, FloorGroup, Bed } from '../beds/beds.api';
import { doctorsApi } from '../staff/doctors/doctor.api';
import { patientsApi } from '../patients/patient.api';
import { Button, Input, Alert } from '@/src/core';
import { SlideOverPanel } from '@/src/core/SlideOverPanel';
import { TableCard } from '@/src/core/table/TableCard';
import { TableToolbar } from '@/src/core/table/TableToolbar';
import { EmptyState } from '@/src/core/table/EmptyState';
import { LoadingSpinner } from '@/src/core/table/TableLoading';
import { BRAND } from '@/src/constants/brand.constants';

type FilterKey = 'ALL' | 'ADMITTED' | 'DISCHARGED';

export default function AdmissionsPage() {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [stats, setStats] = useState<AdmissionStats | null>(null);
  const [filter, setFilter] = useState<FilterKey>('ADMITTED');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showPanel, setShowPanel] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [availableBeds, setAvailableBeds] = useState<(Bed & { ward_name: string })[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    patient_id: '', bed_id: '', admitting_doctor_id: '', diagnosis: '', expected_discharge_date: '',
  });

  const fetchAll = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [a, s] = await Promise.all([
        admissionsApi.findAll(filter === 'ALL' ? undefined : filter),
        admissionsApi.getStats(),
      ]);
      setAdmissions(a);
      setStats(s);
    } catch {
      setError('Unable to load admissions.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [filter]);

  const openPanel = async () => {
    setSubmitError(null);
    setForm({ patient_id: '', bed_id: '', admitting_doctor_id: '', diagnosis: '', expected_discharge_date: '' });

    const [pts, docs, floors] = await Promise.all([
      patientsApi.list({ limit: 200 }),
      doctorsApi.findAll(),
      bedsApi.getGrouped(),
    ]);
    setPatients(pts.data);
    setDoctors(docs);

    const free: (Bed & { ward_name: string })[] = [];
    for (const floor of floors as FloorGroup[]) {
      for (const ward of floor.wards) {
        for (const bed of ward.beds) {
          if (bed.status === 'AVAILABLE') free.push({ ...bed, ward_name: ward.ward_name });
        }
      }
    }
    setAvailableBeds(free);
    setShowPanel(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const patient = patients.find((p) => p.patient_id === form.patient_id);
    const doctor = doctors.find((d) => d.doctor_id === form.admitting_doctor_id);
    if (!patient || !form.bed_id) { setSubmitError('Select a patient and an available bed.'); return; }

    setIsSubmitting(true);
    try {
      const payload: CreateAdmissionPayload = {
        patient_id: patient.patient_id,
        patient_name: patient.full_name,
        bed_id: form.bed_id,
        diagnosis: form.diagnosis,
        admitting_doctor_id: doctor?.doctor_id,
        admitting_doctor_name: doctor ? `Dr. ${doctor.name}` : undefined,
        expected_discharge_date: form.expected_discharge_date || undefined,
      };
      await admissionsApi.create(payload);
      setShowPanel(false);
      await fetchAll();
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message ?? 'Unable to create admission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDischarge = async (admissionId: string) => {
    await admissionsApi.discharge(admissionId);
    await fetchAll();
  };

  if (error) return <div className="p-6"><Alert variant="error" message={error} /></div>;

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: BRAND.colors.textDark }}>Admissions</h1>
          <p className="text-sm" style={{ color: BRAND.colors.textLight }}>Patient admission and discharge records</p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={openPanel}>New Admission</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Users} label="Currently Admitted" value={stats?.currently_admitted ?? 0} color={BRAND.colors.primary} bg={BRAND.colors.iconBgTeal} />
        <StatCard icon={BedDouble} label="Total Admissions" value={stats?.total_admissions ?? 0} color={BRAND.colors.textDark} bg="#F1F3F5" />
        <StatCard icon={LogOut} label="Discharged Today" value={stats?.discharged_today ?? 0} color="#1E9E52" bg="#EAF9F0" />
      </div>

      <TableCard>
        <TableToolbar>
          <div className="flex gap-2">
            {(['ADMITTED', 'DISCHARGED', 'ALL'] as FilterKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border"
                style={{
                  borderColor: filter === key ? BRAND.colors.primary : BRAND.colors.border,
                  backgroundColor: filter === key ? BRAND.colors.iconBgTeal : 'white',
                  color: filter === key ? BRAND.colors.primary : BRAND.colors.textMid,
                }}
              >
                {key.charAt(0) + key.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </TableToolbar>

        {isLoading ? (
          <LoadingSpinner />
        ) : admissions.length === 0 ? (
          <EmptyState icon={BedDouble} message="No admissions found." />
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left" style={{ color: BRAND.colors.textLight }}>
              <tr className="border-b" style={{ borderColor: BRAND.colors.border }}>
                <th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">Bed</th>
                <th className="px-5 py-3 font-medium">Doctor</th>
                <th className="px-5 py-3 font-medium">Diagnosis</th>
                <th className="px-5 py-3 font-medium">Admitted</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {admissions.map((a) => (
                <tr key={a.admission_id} className="border-b last:border-b-0" style={{ borderColor: BRAND.colors.border }}>
                  <td className="px-5 py-3 font-medium" style={{ color: BRAND.colors.textDark }}>{a.patient_name}</td>
                  <td className="px-5 py-3">{a.bed_number} <span className="text-xs" style={{ color: BRAND.colors.textLight }}>({a.ward_name})</span></td>
                  <td className="px-5 py-3">{a.admitting_doctor_name ?? '—'}</td>
                  <td className="px-5 py-3">{a.diagnosis}</td>
                  <td className="px-5 py-3 text-xs" style={{ color: BRAND.colors.textLight }}>
                    {new Date(a.admitted_at).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: a.status === 'ADMITTED' ? '#FCEBEA' : '#EAF9F0',
                        color: a.status === 'ADMITTED' ? '#D2483E' : '#1E9E52',
                      }}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    {a.status === 'ADMITTED' && (
                      <button onClick={() => handleDischarge(a.admission_id)} className="text-xs font-medium" style={{ color: BRAND.colors.primary }}>
                        Discharge
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableCard>

      {showPanel && (
        <SlideOverPanel title="New Admission" onClose={() => setShowPanel(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {submitError && <Alert variant="error" message={submitError} />}

            <div className="space-y-1.5">
              <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Patient</label>
              <select required value={form.patient_id} onChange={(e) => setForm({ ...form, patient_id: e.target.value })}
                className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }}>
                <option value="">Select patient</option>
                {patients.map((p) => <option key={p.patient_id} value={p.patient_id}>{p.full_name}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Available Bed</label>
              <select required value={form.bed_id} onChange={(e) => setForm({ ...form, bed_id: e.target.value })}
                className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }}>
                <option value="">Select bed</option>
                {availableBeds.map((b) => (
                  <option key={b.bed_id} value={b.bed_id}>{b.bed_number} — {b.ward_name}</option>
                ))}
              </select>
              {availableBeds.length === 0 && (
                <p className="text-xs" style={{ color: BRAND.colors.textLight }}>No available beds right now.</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Admitting Doctor (optional)</label>
              <select value={form.admitting_doctor_id} onChange={(e) => setForm({ ...form, admitting_doctor_id: e.target.value })}
                className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }}>
                <option value="">Select doctor</option>
                {doctors.map((d) => <option key={d.doctor_id} value={d.doctor_id}>Dr. {d.name} ({d.department})</option>)}
              </select>
            </div>

            <Input required label="Diagnosis" value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Expected Discharge Date (optional)</label>
              <input type="date" value={form.expected_discharge_date} onChange={(e) => setForm({ ...form, expected_discharge_date: e.target.value })}
                className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }} />
            </div>

            <Button type="submit" fullWidth isLoading={isSubmitting} disabled={availableBeds.length === 0}>
              Admit Patient
            </Button>
          </form>
        </SlideOverPanel>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, bg }: { icon: React.ElementType; label: string; value: number; color: string; bg: string }) {
  return (
    <div className="bg-white rounded-xl border p-4 flex items-center gap-3" style={{ borderColor: BRAND.colors.border }}>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: bg }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p className="text-lg font-bold" style={{ color: BRAND.colors.textDark }}>{value}</p>
        <p className="text-xs" style={{ color: BRAND.colors.textLight }}>{label}</p>
      </div>
    </div>
  );
}