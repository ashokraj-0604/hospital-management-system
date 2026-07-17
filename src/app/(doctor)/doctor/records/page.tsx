'use client';

import React, { useEffect, useState } from 'react';
import { FileText, Plus } from 'lucide-react';
import { medicalRecordsApi, MedicalRecord, Vitals } from './record.api';
import { doctorPatientsApi, DoctorPatientRow } from '../patients/patient.api';
import { Button, Input, Alert } from '@/src/core';
import { SlideOverPanel } from '@/src/core/SlideOverPanel';
import { TableCard } from '@/src/core/table/TableCard';
import { EmptyState } from '@/src/core/table/EmptyState';
import { LoadingSpinner } from '@/src/core/table/TableLoading';
import { BRAND } from '@/src/constants/brand.constants';

const EMPTY_VITALS: Vitals = { bp: '', temperature: '', pulse: '', weight: '', height: '' };

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [patients, setPatients] = useState<DoctorPatientRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPanel, setShowPanel] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    patient_id: '',
    chief_complaint: '',
    vitals: { ...EMPTY_VITALS },
    examination_notes: '',
    diagnosis: '',
    treatment_plan: '',
  });

  const fetchAll = async () => {
    setIsLoading(true);
    const [rec, pts] = await Promise.all([medicalRecordsApi.findAllForDoctor(), doctorPatientsApi.findAll()]);
    setRecords(rec);
    setPatients(pts);
    setIsLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const patient = patients.find((p) => p.patient_id === form.patient_id);
    if (!patient) { setSubmitError('Select a patient.'); return; }

    // Drop empty vitals fields rather than saving blank strings
    const vitals = Object.fromEntries(Object.entries(form.vitals).filter(([, v]) => v)) as Vitals;

    setIsSubmitting(true);
    try {
      await medicalRecordsApi.create({
        patient_id: patient.patient_id,
        patient_name: patient.patient_name,
        chief_complaint: form.chief_complaint,
        vitals: Object.keys(vitals).length ? vitals : undefined,
        examination_notes: form.examination_notes,
        diagnosis: form.diagnosis,
        treatment_plan: form.treatment_plan || undefined,
      });
      setShowPanel(false);
      setForm({ patient_id: '', chief_complaint: '', vitals: { ...EMPTY_VITALS }, examination_notes: '', diagnosis: '', treatment_plan: '' });
      await fetchAll();
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message ?? 'Unable to save record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: BRAND.colors.textDark }}>Medical Records</h1>
          <p className="text-sm" style={{ color: BRAND.colors.textLight }}>{records.length} records</p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={() => setShowPanel(true)}>New Record</Button>
      </div>

      <TableCard>
        {isLoading ? (
          <LoadingSpinner />
        ) : records.length === 0 ? (
          <EmptyState icon={FileText} message="No medical records yet." />
        ) : (
          <div className="divide-y" style={{ borderColor: BRAND.colors.border }}>
            {records.map((r) => (
              <div key={r.record_id} className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold" style={{ color: BRAND.colors.textDark }}>{r.patient_name}</p>
                    <p className="text-sm" style={{ color: BRAND.colors.textMid }}>
  <strong>Complaint:</strong> {r.chief_complaint}
</p>
                  </div>
                  <p className="text-xs" style={{ color: BRAND.colors.textLight }}>
                    {new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                {r.vitals && Object.keys(r.vitals).length > 0 && (
                  <div className="mt-2 flex gap-4 text-xs" style={{ color: BRAND.colors.textMid }}>
                    {r.vitals.bp && <span>BP: {r.vitals.bp}</span>}
                    {r.vitals.temperature && <span>Temp: {r.vitals.temperature}</span>}
                    {r.vitals.pulse && <span>Pulse: {r.vitals.pulse}</span>}
                    {r.vitals.weight && <span>Weight: {r.vitals.weight}</span>}
                    {r.vitals.height && <span>Height: {r.vitals.height}</span>}
                  </div>
                )}

                <p className="mt-2 text-sm" style={{ color: BRAND.colors.textDark }}><strong>Diagnosis:</strong> {r.diagnosis}</p>
                <p className="mt-1 text-sm" style={{ color: BRAND.colors.textMid }}>
  <strong>Notes:</strong> {r.examination_notes}
</p>
                {r.treatment_plan && (
                  <p className="mt-1 text-sm italic" style={{ color: BRAND.colors.textLight }}>Plan: {r.treatment_plan}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </TableCard>

      {showPanel && (
        <SlideOverPanel title="New Medical Record" onClose={() => setShowPanel(false)} width={460}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {submitError && <Alert variant="error" message={submitError} />}

            <div className="space-y-1.5">
              <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Patient</label>
              <select required value={form.patient_id} onChange={(e) => setForm({ ...form, patient_id: e.target.value })}
                className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }}>
                <option value="">Select patient</option>
                {patients.map((p) => <option key={p.patient_id} value={p.patient_id}>{p.patient_name}</option>)}
              </select>
            </div>

            <Input required label="Chief Complaint" placeholder="e.g. Chest pain for 2 days"
              value={form.chief_complaint} onChange={(e) => setForm({ ...form, chief_complaint: e.target.value })} />

            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Vitals (optional)</label>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="BP (120/80)" value={form.vitals.bp} onChange={(e) => setForm({ ...form, vitals: { ...form.vitals, bp: e.target.value } })} />
                <Input placeholder="Temp (98.6°F)" value={form.vitals.temperature} onChange={(e) => setForm({ ...form, vitals: { ...form.vitals, temperature: e.target.value } })} />
                <Input placeholder="Pulse (72 bpm)" value={form.vitals.pulse} onChange={(e) => setForm({ ...form, vitals: { ...form.vitals, pulse: e.target.value } })} />
                <Input placeholder="Weight (68 kg)" value={form.vitals.weight} onChange={(e) => setForm({ ...form, vitals: { ...form.vitals, weight: e.target.value } })} />
                <Input placeholder="Height (170 cm)" value={form.vitals.height} onChange={(e) => setForm({ ...form, vitals: { ...form.vitals, height: e.target.value } })} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Examination Notes</label>
              <textarea required value={form.examination_notes} onChange={(e) => setForm({ ...form, examination_notes: e.target.value })}
                rows={3} className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }} />
            </div>

            <Input required label="Diagnosis" value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Treatment Plan (optional)</label>
              <textarea value={form.treatment_plan} onChange={(e) => setForm({ ...form, treatment_plan: e.target.value })}
                rows={2} className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }} />
            </div>

            <Button type="submit" fullWidth isLoading={isSubmitting}>Save Record</Button>
          </form>
        </SlideOverPanel>
      )}
    </div>
  );
}