'use client';

import React, { useEffect, useState } from 'react';
import { Pill, Plus, Trash2 } from 'lucide-react';
import { prescriptionsApi, Prescription, Medicine } from './prescription.api';
import { doctorPatientsApi, DoctorPatientRow } from '../patients/patient.api';
import { Button, Input, Alert } from '@/src/core';
import { SlideOverPanel } from '@/src/core/SlideOverPanel';
import { TableCard } from '@/src/core/table/TableCard';
import { TableToolbar } from '@/src/core/table/TableToolbar';
import { EmptyState } from '@/src/core/table/EmptyState';
import { LoadingSpinner } from '@/src/core/table/TableLoading';
import { BRAND } from '@/src/constants/brand.constants';

const EMPTY_MEDICINE: Medicine = { name: '', dosage: '', frequency: '', duration: '' };

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [patients, setPatients] = useState<DoctorPatientRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPanel, setShowPanel] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    patient_id: '',
    diagnosis: '',
    notes: '',
    medicines: [{ ...EMPTY_MEDICINE }] as Medicine[],
  });

  const fetchAll = async () => {
    setIsLoading(true);
    const [rx, pts] = await Promise.all([prescriptionsApi.findAllForDoctor(), doctorPatientsApi.findAll()]);
    setPrescriptions(rx);
    setPatients(pts);
    setIsLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const updateMedicine = (index: number, field: keyof Medicine, value: string) => {
    const meds = [...form.medicines];
    meds[index] = { ...meds[index], [field]: value };
    setForm({ ...form, medicines: meds });
  };

  const addMedicineRow = () => setForm({ ...form, medicines: [...form.medicines, { ...EMPTY_MEDICINE }] });
  const removeMedicineRow = (index: number) =>
    setForm({ ...form, medicines: form.medicines.filter((_, i) => i !== index) });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const patient = patients.find((p) => p.patient_id === form.patient_id);
    if (!patient) { setSubmitError('Select a patient.'); return; }

    setIsSubmitting(true);
    try {
      await prescriptionsApi.create({
        patient_id: patient.patient_id,
        patient_name: patient.patient_name,
        diagnosis: form.diagnosis,
        medicines: form.medicines,
        notes: form.notes || undefined,
      });
      setShowPanel(false);
      setForm({ patient_id: '', diagnosis: '', notes: '', medicines: [{ ...EMPTY_MEDICINE }] });
      await fetchAll();
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message ?? 'Unable to save prescription.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: BRAND.colors.textDark }}>Prescriptions</h1>
          <p className="text-sm" style={{ color: BRAND.colors.textLight }}>{prescriptions.length} written</p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={() => setShowPanel(true)}>New Prescription</Button>
      </div>

      <TableCard>
        {isLoading ? (
          <LoadingSpinner />
        ) : prescriptions.length === 0 ? (
          <EmptyState icon={Pill} message="No prescriptions written yet." />
        ) : (
          <div className="divide-y" style={{ borderColor: BRAND.colors.border }}>
            {prescriptions.map((rx) => (
              <div key={rx.prescription_id} className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold" style={{ color: BRAND.colors.textDark }}>{rx.patient_name}</p>
                    <p className="text-sm" style={{ color: BRAND.colors.textMid }}>{rx.diagnosis}</p>
                  </div>
                  <p className="text-xs" style={{ color: BRAND.colors.textLight }}>
                    {new Date(rx.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="mt-3 space-y-1">
                  {rx.medicines.map((m, i) => (
                    <p key={i} className="text-sm" style={{ color: BRAND.colors.textMid }}>
                      • {m.name} — {m.dosage}, {m.frequency}, {m.duration}
                    </p>
                  ))}
                </div>
                {rx.notes && <p className="mt-2 text-xs italic" style={{ color: BRAND.colors.textLight }}>Note: {rx.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </TableCard>

      {showPanel && (
        <SlideOverPanel title="New Prescription" onClose={() => setShowPanel(false)} width={460}>
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

            <Input required label="Diagnosis" value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} />

            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Medicines</label>
              {form.medicines.map((med, i) => (
                <div key={i} className="rounded-xl border p-3 space-y-2" style={{ borderColor: BRAND.colors.border }}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium" style={{ color: BRAND.colors.textLight }}>Medicine {i + 1}</span>
                    {form.medicines.length > 1 && (
                      <button type="button" onClick={() => removeMedicineRow(i)} className="text-red-500">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <Input required placeholder="Name (e.g. Amoxicillin)" value={med.name} onChange={(e) => updateMedicine(i, 'name', e.target.value)} />
                  <div className="grid grid-cols-3 gap-2">
                    <Input required placeholder="Dosage (500mg)" value={med.dosage} onChange={(e) => updateMedicine(i, 'dosage', e.target.value)} />
                    <Input required placeholder="Frequency (3x/day)" value={med.frequency} onChange={(e) => updateMedicine(i, 'frequency', e.target.value)} />
                    <Input required placeholder="Duration (5 days)" value={med.duration} onChange={(e) => updateMedicine(i, 'duration', e.target.value)} />
                  </div>
                </div>
              ))}
              <button type="button" onClick={addMedicineRow}
                className="flex items-center gap-1.5 text-sm font-medium" style={{ color: BRAND.colors.primary }}>
                <Plus size={14} /> Add another medicine
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Notes (optional)</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3} className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }} />
            </div>

            <Button type="submit" fullWidth isLoading={isSubmitting}>Save Prescription</Button>
          </form>
        </SlideOverPanel>
      )}
    </div>
  );
}