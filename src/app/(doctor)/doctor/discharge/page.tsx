'use client';

import React, { useEffect, useState } from 'react';
import { ClipboardCheck, Plus, Trash2 } from 'lucide-react';
import { dischargeSummariesApi, DischargeSummary } from './discharge.api';
import type { Medicine } from '../prescriptions/prescription.api';
import { doctorPatientsApi, DoctorPatientRow } from '../patients/patient.api';
import { Button, Input, Alert } from '@/src/core';
import { SlideOverPanel } from '@/src/core/SlideOverPanel';
import { TableCard } from '@/src/core/table/TableCard';
import { EmptyState } from '@/src/core/table/EmptyState';
import { LoadingSpinner } from '@/src/core/table/TableLoading';
import { BRAND } from '@/src/constants/brand.constants';

const EMPTY_MEDICINE: Medicine = { name: '', dosage: '', frequency: '', duration: '' };

const conditionColor: Record<string, string> = {
  STABLE: 'bg-emerald-50 text-emerald-700',
  IMPROVED: 'bg-blue-50 text-blue-600',
  REFERRED: 'bg-amber-50 text-amber-600',
  DECEASED: 'bg-gray-200 text-gray-700',
};

export default function DischargeSummaryPage() {
  const [summaries, setSummaries] = useState<DischargeSummary[]>([]);
  const [patients, setPatients] = useState<DoctorPatientRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPanel, setShowPanel] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    patient_id: '',
    admission_date: '',
    discharge_date: '',
    final_diagnosis: '',
    hospital_course: '',
    condition_at_discharge: 'STABLE',
    discharge_medications: [{ ...EMPTY_MEDICINE }] as Medicine[],
    follow_up_instructions: '',
    follow_up_date: '',
  });

  const fetchAll = async () => {
    setIsLoading(true);
    const [sums, pts] = await Promise.all([dischargeSummariesApi.findAllForDoctor(), doctorPatientsApi.findAll()]);
    setSummaries(sums);
    setPatients(pts);
    setIsLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const updateMedicine = (index: number, field: keyof Medicine, value: string) => {
    const meds = [...form.discharge_medications];
    meds[index] = { ...meds[index], [field]: value };
    setForm({ ...form, discharge_medications: meds });
  };
  const addMedicineRow = () => setForm({ ...form, discharge_medications: [...form.discharge_medications, { ...EMPTY_MEDICINE }] });
  const removeMedicineRow = (index: number) =>
    setForm({ ...form, discharge_medications: form.discharge_medications.filter((_, i) => i !== index) });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const patient = patients.find((p) => p.patient_id === form.patient_id);
    if (!patient) { setSubmitError('Select a patient.'); return; }

    const meds = form.discharge_medications.filter((m) => m.name.trim());

    setIsSubmitting(true);
    try {
      await dischargeSummariesApi.create({
        patient_id: patient.patient_id,
        patient_name: patient.patient_name,
        admission_date: form.admission_date,
        discharge_date: form.discharge_date,
        final_diagnosis: form.final_diagnosis,
        hospital_course: form.hospital_course,
        condition_at_discharge: form.condition_at_discharge,
        discharge_medications: meds.length ? meds : undefined,
        follow_up_instructions: form.follow_up_instructions || undefined,
        follow_up_date: form.follow_up_date || undefined,
      });
      setShowPanel(false);
      setForm({
        patient_id: '', admission_date: '', discharge_date: '', final_diagnosis: '', hospital_course: '',
        condition_at_discharge: 'STABLE', discharge_medications: [{ ...EMPTY_MEDICINE }],
        follow_up_instructions: '', follow_up_date: '',
      });
      await fetchAll();
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message ?? 'Unable to save discharge summary.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: BRAND.colors.textDark }}>Discharge Summaries</h1>
          <p className="text-sm" style={{ color: BRAND.colors.textLight }}>{summaries.length} summaries</p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={() => setShowPanel(true)}>New Discharge Summary</Button>
      </div>

      <TableCard>
        {isLoading ? (
          <LoadingSpinner />
        ) : summaries.length === 0 ? (
          <EmptyState icon={ClipboardCheck} message="No discharge summaries yet." />
        ) : (
          <div className="divide-y" style={{ borderColor: BRAND.colors.border }}>
            {summaries.map((s) => (
              <div key={s.summary_id} className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold" style={{ color: BRAND.colors.textDark }}>{s.patient_name}</p>
                    <p className="text-sm" style={{ color: BRAND.colors.textMid }}>
  <strong>Diagnosis:</strong> {s.final_diagnosis}
</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${conditionColor[s.condition_at_discharge]}`}>
                    {s.condition_at_discharge}
                  </span>
                </div>

                <p className="mt-2 text-xs" style={{ color: BRAND.colors.textLight }}>
                  Admitted {new Date(s.admission_date).toLocaleDateString('en-IN')} — Discharged {new Date(s.discharge_date).toLocaleDateString('en-IN')}
                </p>

                <p className="mt-2 text-sm" style={{ color: BRAND.colors.textMid }}>
  <strong>Course:</strong> {s.hospital_course}
</p>

                {s.discharge_medications && s.discharge_medications.length > 0 && (
                  <div className="mt-2 space-y-0.5">
                    {s.discharge_medications.map((m, i) => (
                      <p key={i} className="text-sm" style={{ color: BRAND.colors.textMid }}>
                        • {m.name} — {m.dosage}, {m.frequency}, {m.duration}
                      </p>
                    ))}
                  </div>
                )}

                {s.follow_up_instructions && (
                  <p className="mt-2 text-xs italic" style={{ color: BRAND.colors.textLight }}>
                    Follow-up: {s.follow_up_instructions}
                    {s.follow_up_date && ` (${new Date(s.follow_up_date).toLocaleDateString('en-IN')})`}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </TableCard>

      {showPanel && (
        <SlideOverPanel title="New Discharge Summary" onClose={() => setShowPanel(false)} width={480}>
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

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Admission Date</label>
                <input required type="date" value={form.admission_date} onChange={(e) => setForm({ ...form, admission_date: e.target.value })}
                  className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }} />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Discharge Date</label>
                <input required type="date" value={form.discharge_date} onChange={(e) => setForm({ ...form, discharge_date: e.target.value })}
                  className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }} />
              </div>
            </div>

            <Input required label="Final Diagnosis" value={form.final_diagnosis} onChange={(e) => setForm({ ...form, final_diagnosis: e.target.value })} />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Hospital Course</label>
              <textarea required value={form.hospital_course} onChange={(e) => setForm({ ...form, hospital_course: e.target.value })}
                rows={3} className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }} />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Condition at Discharge</label>
              <select value={form.condition_at_discharge} onChange={(e) => setForm({ ...form, condition_at_discharge: e.target.value })}
                className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }}>
                <option value="STABLE">Stable</option>
                <option value="IMPROVED">Improved</option>
                <option value="REFERRED">Referred</option>
                <option value="DECEASED">Deceased</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Discharge Medications (optional)</label>
              {form.discharge_medications.map((med, i) => (
                <div key={i} className="rounded-xl border p-3 space-y-2" style={{ borderColor: BRAND.colors.border }}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium" style={{ color: BRAND.colors.textLight }}>Medicine {i + 1}</span>
                    {form.discharge_medications.length > 1 && (
                      <button type="button" onClick={() => removeMedicineRow(i)} className="text-red-500"><Trash2 size={14} /></button>
                    )}
                  </div>
                  <Input placeholder="Name" value={med.name} onChange={(e) => updateMedicine(i, 'name', e.target.value)} />
                  <div className="grid grid-cols-3 gap-2">
                    <Input placeholder="Dosage" value={med.dosage} onChange={(e) => updateMedicine(i, 'dosage', e.target.value)} />
                    <Input placeholder="Frequency" value={med.frequency} onChange={(e) => updateMedicine(i, 'frequency', e.target.value)} />
                    <Input placeholder="Duration" value={med.duration} onChange={(e) => updateMedicine(i, 'duration', e.target.value)} />
                  </div>
                </div>
              ))}
              <button type="button" onClick={addMedicineRow} className="flex items-center gap-1.5 text-sm font-medium" style={{ color: BRAND.colors.primary }}>
                <Plus size={14} /> Add another medicine
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Follow-up Instructions (optional)</label>
              <textarea value={form.follow_up_instructions} onChange={(e) => setForm({ ...form, follow_up_instructions: e.target.value })}
                rows={2} className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }} />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Follow-up Date (optional)</label>
              <input type="date" value={form.follow_up_date} onChange={(e) => setForm({ ...form, follow_up_date: e.target.value })}
                className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }} />
            </div>

            <Button type="submit" fullWidth isLoading={isSubmitting}>Save Discharge Summary</Button>
          </form>
        </SlideOverPanel>
      )}
    </div>
  );
}
