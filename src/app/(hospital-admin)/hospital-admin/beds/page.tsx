'use client';

import React, { useEffect, useState } from 'react';
import { BedDouble, CheckCircle2, User, Ban, Search, Plus, Bed as BedIcon } from 'lucide-react';
import { bedsApi, FloorGroup, Bed, BedStats } from './beds.api';
import { doctorsApi } from '../staff/doctors/doctor.api';
import { patientsApi } from '../patients/patient.api';
import { Button, Input, Alert } from '@/src/core';
import { SlideOverPanel } from '@/src/core/SlideOverPanel';
import { BRAND } from '@/src/constants/brand.constants';

type FilterKey = 'ALL' | 'AVAILABLE' | 'OCCUPIED' | 'UNUSED';

const STATUS_STYLE: Record<string, { bg: string; border: string; text: string }> = {
  AVAILABLE: { bg: '#EAF9F0', border: '#B7EBC9', text: '#1E9E52' },
  OCCUPIED:  { bg: '#FCEBEA', border: '#F5C2BE', text: '#D2483E' },
  UNUSED:    { bg: '#F1F3F5', border: '#DDE2E6', text: '#6C7680' },
};

export default function BedManagementPage() {
  const [floors, setFloors] = useState<FloorGroup[]>([]);
  const [stats, setStats] = useState<BedStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterKey>('ALL');

  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [showAssignPanel, setShowAssignPanel] = useState(false);
  const [showSetupPanel, setShowSetupPanel] = useState(false);

  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [assignForm, setAssignForm] = useState({ patient_id: '', consultant_id: '' });
  const [assignError, setAssignError] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  const [wardForm, setWardForm] = useState({ floor_name: '', ward_name: '' });
  const [bedForm, setBedForm] = useState({ ward_id: '', bed_number: '' });
  const [setupError, setSetupError] = useState<string | null>(null);

  const fetchAll = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [f, s] = await Promise.all([bedsApi.getGrouped(), bedsApi.getStats()]);
      setFloors(f);
      setStats(s);
    } catch {
      setError('Unable to load bed data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openAssignPanel = async (bed: Bed) => {
    setSelectedBed(bed);
    setAssignForm({ patient_id: '', consultant_id: '' });
    setAssignError(null);
    if (patients.length === 0 || doctors.length === 0) {
      const [pts, docs] = await Promise.all([patientsApi.list({ limit: 200 }), doctorsApi.findAll()]);
      setPatients(pts.data);
      setDoctors(docs);
    }
    setShowAssignPanel(true);
  };

  const openSetupPanel = async () => {
    const w = await bedsApi.findAllWards();
    setWards(w);
    setSetupError(null);
    setShowSetupPanel(true);
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBed) return;
    const patient = patients.find((p) => p.patient_id === assignForm.patient_id);
    const doctor = doctors.find((d) => d.doctor_id === assignForm.consultant_id);
    if (!patient) { setAssignError('Select a patient.'); return; }

    setIsAssigning(true);
    setAssignError(null);
    try {
      await bedsApi.assign(selectedBed.bed_id, {
        patient_id: patient.patient_id,
        patient_name: patient.full_name,
        patient_phone: patient.phone,
        patient_gender: patient.gender,
        consultant_id: doctor?.doctor_id,
        consultant_name: doctor ? `Dr. ${doctor.name}` : undefined,
      });
      setShowAssignPanel(false);
      await fetchAll();
    } catch (err: any) {
      setAssignError(err?.response?.data?.message ?? 'Unable to assign bed.');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleDischarge = async () => {
    if (!selectedBed) return;
    await bedsApi.discharge(selectedBed.bed_id);
    setSelectedBed(null);
    await fetchAll();
  };

  const handleCreateWard = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetupError(null);
    try {
      await bedsApi.createWard(wardForm);
      const w = await bedsApi.findAllWards();
      setWards(w);
      setWardForm({ floor_name: '', ward_name: '' });
      await fetchAll();
    } catch (err: any) {
      setSetupError(err?.response?.data?.message ?? 'Unable to create ward.');
    }
  };

  const handleCreateBed = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetupError(null);
    if (!bedForm.ward_id) { setSetupError('Select a ward.'); return; }
    try {
      await bedsApi.createBed(bedForm);
      setBedForm({ ward_id: bedForm.ward_id, bed_number: '' });
      await fetchAll();
    } catch (err: any) {
      setSetupError(err?.response?.data?.message ?? 'Unable to create bed.');
    }
  };

  const matchesFilterAndSearch = (bed: Bed) => {
    if (filter !== 'ALL' && bed.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return bed.bed_number.toLowerCase().includes(q) || bed.patient_name?.toLowerCase().includes(q);
    }
    return true;
  };

  if (error) return <div className="p-6"><Alert variant="error" message={error} /></div>;

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: BRAND.colors.textDark }}>Bed Management</h1>
          <p className="text-sm" style={{ color: BRAND.colors.textLight }}>Real-time bed occupancy across all wards</p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={openSetupPanel}>Manage Wards & Beds</Button>
      </div>

      {/* Stats bar */}
      <div className="bg-white rounded-xl border p-4 flex flex-wrap items-center gap-6" style={{ borderColor: BRAND.colors.border }}>
        <StatChip icon={BedIcon} label="Total" value={stats?.total ?? 0} color={BRAND.colors.textDark} />
        <StatChip icon={CheckCircle2} label="Available" value={stats?.available ?? 0} color="#1E9E52" />
        <StatChip icon={User} label="Occupied" value={stats?.occupied ?? 0} color="#D2483E" />
        <StatChip icon={Ban} label="Unused" value={stats?.unused ?? 0} color="#6C7680" />
        <div className="ml-auto flex items-center gap-3">
          <div className="relative w-14 h-14">
            <svg viewBox="0 0 36 36" className="w-14 h-14 -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="#EEE" strokeWidth="4" />
              <circle
                cx="18" cy="18" r="15.5" fill="none" stroke="#D2483E" strokeWidth="4"
                strokeDasharray={`${((stats?.occupied_percentage ?? 0) / 100) * 97.4} 97.4`}
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-lg font-bold" style={{ color: '#D2483E' }}>{stats?.occupied_percentage ?? 0}%</p>
            <p className="text-xs" style={{ color: BRAND.colors.textLight }}>Occupied</p>
          </div>
        </div>
      </div>

      {/* Search + filter tabs */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: BRAND.colors.textLight }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bed number or patient..."
            className="w-full rounded-lg border pl-9 pr-3 py-2 text-sm"
            style={{ borderColor: BRAND.colors.border }}
          />
        </div>
        <div className="flex gap-2">
          {(['ALL', 'AVAILABLE', 'OCCUPIED', 'UNUSED'] as FilterKey[]).map((key) => (
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
              {key === 'ALL' ? 'All' : key.charAt(0) + key.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Floor -> Ward -> Bed grid */}
      {isLoading ? (
        <p className="text-sm" style={{ color: BRAND.colors.textLight }}>Loading beds...</p>
      ) : floors.length === 0 ? (
        <div className="bg-white rounded-xl border p-10 text-center" style={{ borderColor: BRAND.colors.border }}>
          <BedIcon className="mx-auto mb-2" size={28} style={{ color: BRAND.colors.textLight }} />
          <p className="text-sm" style={{ color: BRAND.colors.textLight }}>
            No wards set up yet. Click "Manage Wards & Beds" to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {floors.map((floor) => (
            <div key={floor.floor_name} className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: BRAND.colors.border }}>
              <div className="px-4 py-3 border-b font-semibold text-sm" style={{ borderColor: BRAND.colors.border, color: BRAND.colors.textDark, backgroundColor: BRAND.colors.surface }}>
                {floor.floor_name}
              </div>
              {floor.wards.map((ward) => {
                const visibleBeds = ward.beds.filter(matchesFilterAndSearch);
                if (search.trim() || filter !== 'ALL') {
                  if (visibleBeds.length === 0) return null;
                }
                return (
                  <div key={ward.ward_id} className="p-4 border-b last:border-b-0" style={{ borderColor: BRAND.colors.border }}>
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-medium text-sm" style={{ color: BRAND.colors.textDark }}>{ward.ward_name}</p>
                      <span className="text-xs" style={{ color: BRAND.colors.textLight }}>{ward.beds.length} beds</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {(search.trim() || filter !== 'ALL' ? visibleBeds : ward.beds).map((bed: Bed) => {
                        const style = STATUS_STYLE[bed.status];
                        return (
                          <button
                            key={bed.bed_id}
                            onClick={() => (bed.status === 'OCCUPIED' ? setSelectedBed(bed) : openAssignPanel(bed))}
                            className="rounded-lg border p-3 text-left transition-transform hover:scale-[1.02]"
                            style={{ backgroundColor: style.bg, borderColor: style.border }}
                          >
                            <BedDouble size={18} style={{ color: style.text }} />
                            <p className="mt-1.5 text-sm font-semibold" style={{ color: BRAND.colors.textDark }}>{bed.bed_number}</p>
                            {bed.patient_name && (
                              <p className="text-xs truncate" style={{ color: style.text }}>{bed.patient_name}</p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Occupied bed detail popover */}
      {selectedBed && !showAssignPanel && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setSelectedBed(null)}>
          <div className="bg-white rounded-xl p-5 w-[360px] space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold" style={{ color: BRAND.colors.textDark }}>{selectedBed.bed_number}</h3>
              <button onClick={() => setSelectedBed(null)} className="text-sm" style={{ color: BRAND.colors.textLight }}>✕</button>
            </div>
            {selectedBed.patient_name ? (
              <div className="space-y-1.5 text-sm">
                <p style={{ color: BRAND.colors.textDark }} className="font-semibold">{selectedBed.patient_name}</p>
                <Detail label="Patient ID" value={selectedBed.patient_id} />
                <Detail label="Phone" value={selectedBed.patient_phone} />
                <Detail label="Gender" value={selectedBed.patient_gender} />
                <Detail label="Guardian" value={selectedBed.guardian_name} />
                <Detail label="Consultant" value={selectedBed.consultant_name} />
                <Detail label="Admitted" value={selectedBed.admitted_at ? new Date(selectedBed.admitted_at).toLocaleString('en-IN') : null} />
                <button
                  onClick={handleDischarge}
                  className="mt-3 w-full text-sm font-medium text-white px-4 py-2 rounded-lg"
                  style={{ backgroundColor: '#D2483E' }}
                >
                  Discharge & Free Bed
                </button>
              </div>
            ) : (
              <p className="text-sm" style={{ color: BRAND.colors.textLight }}>This bed is empty.</p>
            )}
          </div>
        </div>
      )}

      {/* Assign patient panel */}
      {showAssignPanel && selectedBed && (
        <SlideOverPanel title={`Assign Bed ${selectedBed.bed_number}`} onClose={() => setShowAssignPanel(false)}>
          <form onSubmit={handleAssign} className="space-y-4">
            {assignError && <Alert variant="error" message={assignError} />}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Patient</label>
              <select required value={assignForm.patient_id} onChange={(e) => setAssignForm({ ...assignForm, patient_id: e.target.value })}
                className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }}>
                <option value="">Select patient</option>
                {patients.map((p) => <option key={p.patient_id} value={p.patient_id}>{p.full_name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Consultant (optional)</label>
              <select value={assignForm.consultant_id} onChange={(e) => setAssignForm({ ...assignForm, consultant_id: e.target.value })}
                className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }}>
                <option value="">Select doctor</option>
                {doctors.map((d) => <option key={d.doctor_id} value={d.doctor_id}>Dr. {d.name} ({d.department})</option>)}
              </select>
            </div>
            <Button type="submit" fullWidth isLoading={isAssigning}>Assign Bed</Button>
          </form>
        </SlideOverPanel>
      )}

      {/* Ward/Bed setup panel */}
      {showSetupPanel && (
        <SlideOverPanel title="Manage Wards & Beds" onClose={() => setShowSetupPanel(false)}>
          <div className="space-y-6">
            {setupError && <Alert variant="error" message={setupError} />}

            <form onSubmit={handleCreateWard} className="space-y-3">
              <p className="font-medium text-sm" style={{ color: BRAND.colors.textDark }}>Add Ward</p>
              <Input required placeholder="Floor name (e.g. 4th Floor)" value={wardForm.floor_name}
                onChange={(e) => setWardForm({ ...wardForm, floor_name: e.target.value })} />
              <Input required placeholder="Ward name (e.g. Non AC, ICU)" value={wardForm.ward_name}
                onChange={(e) => setWardForm({ ...wardForm, ward_name: e.target.value })} />
              <Button type="submit" fullWidth variant="secondary">Add Ward</Button>
            </form>

            <form onSubmit={handleCreateBed} className="space-y-3 border-t pt-4" style={{ borderColor: BRAND.colors.border }}>
              <p className="font-medium text-sm" style={{ color: BRAND.colors.textDark }}>Add Bed</p>
              <select required value={bedForm.ward_id} onChange={(e) => setBedForm({ ...bedForm, ward_id: e.target.value })}
                className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }}>
                <option value="">Select ward</option>
                {wards.map((w: any) => <option key={w.ward_id} value={w.ward_id}>{w.floor_name} — {w.ward_name}</option>)}
              </select>
              <Input required placeholder="Bed number (e.g. FF-114)" value={bedForm.bed_number}
                onChange={(e) => setBedForm({ ...bedForm, bed_number: e.target.value })} />
              <Button type="submit" fullWidth variant="secondary">Add Bed</Button>
            </form>
          </div>
        </SlideOverPanel>
      )}
    </div>
  );
}

function StatChip({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={18} style={{ color }} />
      <div>
        <p className="text-lg font-bold leading-tight" style={{ color }}>{value}</p>
        <p className="text-xs" style={{ color: '#8AACB3' }}>{label}</p>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <p><span className="font-medium">{label}:</span> {value}</p>
  );
}