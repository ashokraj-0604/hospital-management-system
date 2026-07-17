'use client';

import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import {
  doctorPatientsApi,
  DoctorPatientRow,
  DoctorPatientProfileResponse,
  UpdatePatientPayload,
} from './patient.api';
import { TableCard } from '@/src/core/table/TableCard';
import { TableToolbar } from '@/src/core/table/TableToolbar';
import { SearchInput } from '@/src/core/table/SearchInput';
import { EmptyState } from '@/src/core/table/EmptyState';
import { LoadingSpinner } from '@/src/core/table/TableLoading';
import { BRAND } from '@/src/constants/brand.constants';

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<DoctorPatientRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [profile, setProfile] = useState<DoctorPatientProfileResponse | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<UpdatePatientPayload>({});

  useEffect(() => {
    doctorPatientsApi.findAll().then((data) => {
      setPatients(data);
      setIsLoading(false);
    });
  }, []);

  const loadPatientProfile = async (patientId: string) => {
    setSelectedPatientId(patientId);
    setIsProfileLoading(true);
    setProfileError(null);
    setSaveError(null);
    setIsEditing(false);

    try {
      const data = await doctorPatientsApi.findProfile(patientId);
      setProfile(data);
      setEditForm({
        full_name: data.patient.full_name,
        phone: data.patient.phone,
        email: data.patient.email,
        address: data.patient.address,
        blood_group: data.patient.blood_group,
        emergency_contact_name: data.patient.emergency_contact_name,
        emergency_contact_phone: data.patient.emergency_contact_phone,
        insurance_provider: data.patient.insurance_provider,
        insurance_policy_number: data.patient.insurance_policy_number,
        status: data.patient.status,
      });
    } catch (err: any) {
      setProfileError(err?.response?.data?.message ?? 'Unable to load patient profile.');
      setProfile(null);
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedPatientId || !profile) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const updated = await doctorPatientsApi.updatePatient(selectedPatientId, editForm);
      setProfile({ ...profile, patient: updated });
      setPatients((current) =>
        current.map((item) =>
          item.patient_id === selectedPatientId
            ? { ...item, patient_name: updated.full_name }
            : item,
        ),
      );
      setIsEditing(false);
    } catch (err: any) {
      setSaveError(err?.response?.data?.message ?? 'Unable to update patient.');
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = patients.filter((p) => p.patient_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: BRAND.colors.textDark }}>My Patients</h1>
        <p className="text-sm" style={{ color: BRAND.colors.textLight }}>{patients.length} patients seen</p>
      </div>

      <TableCard>
        <TableToolbar>
          <SearchInput value={search} onChange={setSearch} placeholder="Search by patient name..." />
        </TableToolbar>

        {isLoading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <EmptyState icon={Users} message="No patients found." />
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left" style={{ color: BRAND.colors.textLight }}>
              <tr className="border-b" style={{ borderColor: BRAND.colors.border }}>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Last Visit</th>
                <th className="px-5 py-3 font-medium">Total Visits</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.patient_id} className="border-b last:border-b-0" style={{ borderColor: BRAND.colors.border }}>
                  <td className="px-5 py-3 font-medium" style={{ color: BRAND.colors.textDark }}>{p.patient_name}</td>
                  <td className="px-5 py-3">{new Date(p.last_visit).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="px-5 py-3">{p.visit_count}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => loadPatientProfile(p.patient_id)}
                      className="rounded-md border px-3 py-1.5 text-xs font-medium"
                      style={{ borderColor: BRAND.colors.border, color: BRAND.colors.primary }}
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableCard>

      {(isProfileLoading || profileError || profile) && (
        <TableCard>
          <div className="p-5">
            {isProfileLoading && <LoadingSpinner />}

            {!isProfileLoading && profileError && (
              <p className="text-sm" style={{ color: '#DC2626' }}>{profileError}</p>
            )}

            {!isProfileLoading && profile && (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold" style={{ color: BRAND.colors.textDark }}>
                      {profile.patient.full_name}
                    </h2>
                    <p className="text-sm" style={{ color: BRAND.colors.textLight }}>
                      MRN: {profile.patient.mrn} | DOB: {new Date(profile.patient.date_of_birth).toLocaleDateString('en-IN')} | Gender: {profile.patient.gender}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditing((v) => !v)}
                    className="rounded-md border px-3 py-1.5 text-xs font-medium"
                    style={{ borderColor: BRAND.colors.border, color: BRAND.colors.primary }}
                  >
                    {isEditing ? 'Cancel Edit' : 'Edit Patient'}
                  </button>
                </div>

                {isEditing ? (
                  <div className="space-y-3 rounded-xl border p-4" style={{ borderColor: BRAND.colors.border }}>
                    {saveError && <p className="text-sm" style={{ color: '#DC2626' }}>{saveError}</p>}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <input
                        value={editForm.full_name ?? ''}
                        onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                        placeholder="Full name"
                        className="rounded-lg border px-3 py-2 text-sm"
                        style={{ borderColor: BRAND.colors.border }}
                      />
                      <input
                        value={editForm.phone ?? ''}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        placeholder="Phone"
                        className="rounded-lg border px-3 py-2 text-sm"
                        style={{ borderColor: BRAND.colors.border }}
                      />
                      <input
                        value={editForm.email ?? ''}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value || null })}
                        placeholder="Email"
                        className="rounded-lg border px-3 py-2 text-sm"
                        style={{ borderColor: BRAND.colors.border }}
                      />
                      <input
                        value={editForm.blood_group ?? ''}
                        onChange={(e) => setEditForm({ ...editForm, blood_group: e.target.value })}
                        placeholder="Blood Group"
                        className="rounded-lg border px-3 py-2 text-sm"
                        style={{ borderColor: BRAND.colors.border }}
                      />
                      <input
                        value={editForm.emergency_contact_name ?? ''}
                        onChange={(e) => setEditForm({ ...editForm, emergency_contact_name: e.target.value || null })}
                        placeholder="Emergency Contact Name"
                        className="rounded-lg border px-3 py-2 text-sm"
                        style={{ borderColor: BRAND.colors.border }}
                      />
                      <input
                        value={editForm.emergency_contact_phone ?? ''}
                        onChange={(e) => setEditForm({ ...editForm, emergency_contact_phone: e.target.value || null })}
                        placeholder="Emergency Contact Phone"
                        className="rounded-lg border px-3 py-2 text-sm"
                        style={{ borderColor: BRAND.colors.border }}
                      />
                      <input
                        value={editForm.insurance_provider ?? ''}
                        onChange={(e) => setEditForm({ ...editForm, insurance_provider: e.target.value || null })}
                        placeholder="Insurance Provider"
                        className="rounded-lg border px-3 py-2 text-sm"
                        style={{ borderColor: BRAND.colors.border }}
                      />
                      <input
                        value={editForm.insurance_policy_number ?? ''}
                        onChange={(e) => setEditForm({ ...editForm, insurance_policy_number: e.target.value || null })}
                        placeholder="Insurance Policy Number"
                        className="rounded-lg border px-3 py-2 text-sm"
                        style={{ borderColor: BRAND.colors.border }}
                      />
                    </div>
                    <textarea
                      value={editForm.address ?? ''}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value || null })}
                      placeholder="Address"
                      rows={2}
                      className="w-full rounded-lg border px-3 py-2 text-sm"
                      style={{ borderColor: BRAND.colors.border }}
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="rounded-md px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
                        style={{ backgroundColor: BRAND.colors.primary }}
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 rounded-xl border p-4 text-sm md:grid-cols-2" style={{ borderColor: BRAND.colors.border }}>
                    <p><strong>Phone:</strong> {profile.patient.phone}</p>
                    <p><strong>Email:</strong> {profile.patient.email || '-'}</p>
                    <p><strong>Blood Group:</strong> {profile.patient.blood_group}</p>
                    <p><strong>Status:</strong> {profile.patient.status}</p>
                    <p><strong>Emergency Contact:</strong> {profile.patient.emergency_contact_name || '-'} ({profile.patient.emergency_contact_phone || '-'})</p>
                    <p><strong>Address:</strong> {profile.patient.address || '-'}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="rounded-xl border p-4" style={{ borderColor: BRAND.colors.border }}>
                    <h3 className="font-semibold" style={{ color: BRAND.colors.textDark }}>Medical Records ({profile.medical_records.length})</h3>
                    <div className="mt-2 space-y-2 text-sm">
                      {profile.medical_records.slice(0, 5).map((record: any) => (
                        <p key={record.record_id}>
                          {new Date(record.created_at).toLocaleDateString('en-IN')}: {record.diagnosis}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border p-4" style={{ borderColor: BRAND.colors.border }}>
                    <h3 className="font-semibold" style={{ color: BRAND.colors.textDark }}>Prescriptions ({profile.prescriptions.length})</h3>
                    <div className="mt-2 space-y-2 text-sm">
                      {profile.prescriptions.slice(0, 5).map((rx: any) => (
                        <p key={rx.prescription_id}>
                          {new Date(rx.created_at).toLocaleDateString('en-IN')}: {rx.diagnosis}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border p-4" style={{ borderColor: BRAND.colors.border }}>
                    <h3 className="font-semibold" style={{ color: BRAND.colors.textDark }}>Lab Requests ({profile.lab_requests.length})</h3>
                    <div className="mt-2 space-y-2 text-sm">
                      {profile.lab_requests.slice(0, 5).map((lab: any) => (
                        <p key={lab.request_id}>
                          {new Date(lab.created_at).toLocaleDateString('en-IN')}: {lab.test_name} ({lab.status})
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border p-4" style={{ borderColor: BRAND.colors.border }}>
                    <h3 className="font-semibold" style={{ color: BRAND.colors.textDark }}>Discharge Summaries ({profile.discharge_summaries.length})</h3>
                    <div className="mt-2 space-y-2 text-sm">
                      {profile.discharge_summaries.slice(0, 5).map((summary: any) => (
                        <p key={summary.summary_id}>
                          {new Date(summary.discharge_date).toLocaleDateString('en-IN')}: {summary.final_diagnosis}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TableCard>
      )}
    </div>
  );
}