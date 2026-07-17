'use client';

import React, { useEffect, useState } from 'react';
import { FlaskConical, Plus } from 'lucide-react';
import { labRequestsApi, LabRequest } from './lab-request.api';
import { doctorPatientsApi, DoctorPatientRow } from '../patients/patient.api';
import { Button, Input, Alert } from '@/src/core';
import { SlideOverPanel } from '@/src/core/SlideOverPanel';
import { TableCard } from '@/src/core/table/TableCard';
import { EmptyState } from '@/src/core/table/EmptyState';
import { LoadingSpinner } from '@/src/core/table/TableLoading';
import { BRAND } from '@/src/constants/brand.constants';

const urgencyColor: Record<string, string> = {
  ROUTINE: 'bg-gray-100 text-gray-600',
  URGENT: 'bg-red-100 text-red-600',
};
const statusColor: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-600',
  COMPLETED: 'bg-emerald-50 text-emerald-700',
};

export default function LabRequestsPage() {
  const [requests, setRequests] = useState<LabRequest[]>([]);
  const [patients, setPatients] = useState<DoctorPatientRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPanel, setShowPanel] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    patient_id: '', test_name: '', test_type: 'BLOOD', urgency: 'ROUTINE', clinical_notes: '',
  });

  const fetchAll = async () => {
    setIsLoading(true);
    const [reqs, pts] = await Promise.all([labRequestsApi.findAllForDoctor(), doctorPatientsApi.findAll()]);
    setRequests(reqs);
    setPatients(pts);
    setIsLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const patient = patients.find((p) => p.patient_id === form.patient_id);
    if (!patient) { setSubmitError('Select a patient.'); return; }

    setIsSubmitting(true);
    try {
      await labRequestsApi.create({
        patient_id: patient.patient_id,
        patient_name: patient.patient_name,
        test_name: form.test_name,
        test_type: form.test_type,
        urgency: form.urgency,
        clinical_notes: form.clinical_notes || undefined,
      });
      setShowPanel(false);
      setForm({ patient_id: '', test_name: '', test_type: 'BLOOD', urgency: 'ROUTINE', clinical_notes: '' });
      await fetchAll();
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message ?? 'Unable to submit lab request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: BRAND.colors.textDark }}>Lab Requests</h1>
          <p className="text-sm" style={{ color: BRAND.colors.textLight }}>{requests.length} requests</p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={() => setShowPanel(true)}>New Lab Request</Button>
      </div>

      <TableCard>
        {isLoading ? (
          <LoadingSpinner />
        ) : requests.length === 0 ? (
          <EmptyState icon={FlaskConical} message="No lab requests yet." />
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left" style={{ color: BRAND.colors.textLight }}>
              <tr className="border-b" style={{ borderColor: BRAND.colors.border }}>
                <th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">Test</th>
                <th className="px-5 py-3 font-medium">Urgency</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Result</th>
                <th className="px-5 py-3 font-medium">File</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.request_id} className="border-b last:border-b-0" style={{ borderColor: BRAND.colors.border }}>
                  <td className="px-5 py-3 font-medium" style={{ color: BRAND.colors.textDark }}>{r.patient_name}</td>
                  <td className="px-5 py-3">{r.test_name} <span className="text-xs" style={{ color: BRAND.colors.textLight }}>({r.test_type})</span></td>
                  <td className="px-5 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${urgencyColor[r.urgency]}`}>{r.urgency}</span></td>
                  <td className="px-5 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[r.status]}`}>{r.status}</span></td>
                  <td className="px-5 py-3" style={{ color: BRAND.colors.textMid }}>
                    {r.result ?? '—'}
                  </td>
                  <td className="px-5 py-3">
                    {r.result_file_path ? (
                      <button
                        onClick={() => labRequestsApi.downloadResultFile(r.request_id, r.result_file_name ?? 'result')}
                        className="rounded-md border px-2.5 py-1 text-xs font-semibold"
                        style={{ borderColor: BRAND.colors.border, color: BRAND.colors.primary }}
                      >
                        Download
                      </button>
                    ) : (
                      <span className="text-xs" style={{ color: BRAND.colors.textLight }}>
                        No file
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableCard>

      {showPanel && (
        <SlideOverPanel title="New Lab Request" onClose={() => setShowPanel(false)} width={440}>
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

            <Input required label="Test Name" placeholder="e.g. Complete Blood Count" value={form.test_name}
              onChange={(e) => setForm({ ...form, test_name: e.target.value })} />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Test Type</label>
                <select value={form.test_type} onChange={(e) => setForm({ ...form, test_type: e.target.value })}
                  className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }}>
                  <option value="BLOOD">Blood</option>
                  <option value="URINE">Urine</option>
                  <option value="IMAGING">Imaging</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Urgency</label>
                <select value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                  className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }}>
                  <option value="ROUTINE">Routine</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Clinical Notes (optional)</label>
              <textarea value={form.clinical_notes} onChange={(e) => setForm({ ...form, clinical_notes: e.target.value })}
                rows={3} className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }} />
            </div>

            <Button type="submit" fullWidth isLoading={isSubmitting}>Submit Request</Button>
          </form>
        </SlideOverPanel>
      )}
    </div>
  );
}