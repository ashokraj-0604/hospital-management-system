'use client';

import React, { useState } from 'react';
import { useHospitals, useHospitalActions } from '../useHospital';
import { HospitalTable } from '../components/HospitalTable';
import { AddHospitalModal } from '../components/AddHospitalModal';
import { Alert, Button } from '@/src/core';
import type { Hospital, AddHospitalFormValues } from '@/src/types/super-admin.types';
import apiClient from '@/src/lib/api-client';
import { getApiErrorMessage } from '@/src/lib/api-error';
import { fmtDateShort } from '@/src/lib/format';

import { PageLayout } from '@/src/core/layout/PageLayout';
import { PageHeader } from '@/src/core/layout/PageHeader';
import { SlideOverPanel } from '@/src/core/SlideOverPanel';
import { DetailList } from '@/src/core/DetailList';
import { Avatar } from '@/src/core/Avatar';

export default function HospitalsPage() {
  const [search, setSearch]   = useState('');
  const [status, setStatus]   = useState('');
  const [plan, setPlan]       = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    hospital_name: '',
    primary_phone: '',
    primary_email: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
    mrn_prefix: '',
    status: 'ACTIVE' as Hospital['status'],
    total_beds: 0,
    subscription_plan: 'BASIC' as Hospital['subscription_plan'],
  });
  const [actionError, setActionError] = useState<string | null>(null);

  const { hospitals, isLoading, error: loadError, refetch } = useHospitals({ search, status, plan });
  const { suspend, activate } = useHospitalActions(refetch);

  const handleAddHospital = async (values: AddHospitalFormValues) => {
    await apiClient.post('/hospitals', values);
    await refetch();
  };

  const handleSuspend = async (hospital: Hospital) => {
    const reason = prompt(`Reason for suspending ${hospital.hospital_name}?`);
    if (!reason) return;

    setActionError(null);
    try {
      await suspend(hospital.hospital_id, reason);
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Unable to suspend hospital.'));
    }
  };

  const handleActivate = async (hospital: Hospital) => {
    setActionError(null);
    try {
      await activate(hospital.hospital_id);
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Unable to activate hospital.'));
    }
  };

  const handleEdit = (hospital: Hospital) => {
    setEditForm({
      hospital_name: hospital.hospital_name,
      primary_phone: hospital.primary_phone,
      primary_email: hospital.primary_email,
      address: hospital.address,
      pincode: hospital.pincode,
      city: hospital.city,
      state: hospital.state,
      mrn_prefix: hospital.mrn_prefix,
      status: hospital.status,
      total_beds: hospital.total_beds ?? 0,
      subscription_plan: hospital.subscription_plan,
    });
    setEditingHospital(hospital);
  };

  const handleSaveEdit = async () => {
    if (!editingHospital) return;

    setActionError(null);
    setIsSavingEdit(true);
    try {
      await apiClient.patch(`/hospitals/${editingHospital.hospital_id}`, {
        hospital_name: editForm.hospital_name,
        primary_phone: editForm.primary_phone,
        primary_email: editForm.primary_email,
        address: editForm.address,
        pincode: editForm.pincode,
        city: editForm.city,
        state: editForm.state,
        mrn_prefix: editForm.mrn_prefix,
        status: editForm.status,
        total_beds: Number(editForm.total_beds || 0),
        subscription_plan: editForm.subscription_plan,
      });

      setEditingHospital(null);
      await refetch();
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Unable to update hospital.'));
    } finally {
      setIsSavingEdit(false);
    }
  };

  return (
    <PageLayout>
      <PageHeader
        title="Hospitals"
        subtitle="Manage all tenant hospitals"
        actions={<Button onClick={() => setShowModal(true)}>Add Hospital</Button>}
      />

      {(loadError || actionError) && (
        <Alert
          variant="error"
          title={actionError ? 'Action failed' : 'Could not load hospitals'}
          message={actionError ?? loadError ?? ''}
          onClose={actionError ? () => setActionError(null) : undefined}
        />
      )}

      <HospitalTable
        hospitals={hospitals}
        isLoading={isLoading}
        onSearch={setSearch}
        onFilterStatus={setStatus}
        onFilterPlan={setPlan}
        onAddNew={() => setShowModal(true)}
        onView={setSelectedHospital}
        onEdit={handleEdit}
        onSuspend={handleSuspend}
        onActivate={handleActivate}
      />

      {selectedHospital && (
        <SlideOverPanel title="Hospital Details" onClose={() => setSelectedHospital(null)}>
          <div className="flex items-center gap-3">
            <Avatar
              label={selectedHospital.hospital_code.slice(0, 2)}
              shape="square"
              size="lg"
              style={{ backgroundColor: selectedHospital.primary_color }}
            />
            <div>
              <p className="font-bold text-[#0D2F36]">{selectedHospital.hospital_name}</p>
              <p className="text-xs text-[#8AACB3]">{selectedHospital.hospital_code}</p>
            </div>
          </div>

          <DetailList
            rows={[
              ['Email', selectedHospital.primary_email],
              ['Phone', selectedHospital.primary_phone],
              ['City', `${selectedHospital.city}, ${selectedHospital.state}`],
              ['Plan', selectedHospital.subscription_plan],
              ['Status', selectedHospital.status],
              ['MRN Prefix', selectedHospital.mrn_prefix],
              ['Beds', selectedHospital.total_beds?.toLocaleString()],
              ['Users', selectedHospital.total_users?.toLocaleString()],
              ['Patients', selectedHospital.total_patients?.toLocaleString()],
              ['Created', fmtDateShort(selectedHospital.created_at)],
            ]}
          />
        </SlideOverPanel>
      )}

      {editingHospital && (
        <SlideOverPanel title="Edit Hospital" onClose={() => setEditingHospital(null)}>
          <div className="space-y-4">
            <label className="block text-sm text-[#4A7C87]">
              Hospital Name
              <input
                value={editForm.hospital_name}
                onChange={(e) => setEditForm((prev) => ({ ...prev, hospital_name: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] px-3 py-2 text-sm text-[#0D2F36]"
              />
            </label>

            <label className="block text-sm text-[#4A7C87]">
              Primary Phone
              <input
                value={editForm.primary_phone}
                onChange={(e) => setEditForm((prev) => ({ ...prev, primary_phone: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] px-3 py-2 text-sm text-[#0D2F36]"
              />
            </label>

            <label className="block text-sm text-[#4A7C87]">
              Primary Email
              <input
                value={editForm.primary_email}
                onChange={(e) => setEditForm((prev) => ({ ...prev, primary_email: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] px-3 py-2 text-sm text-[#0D2F36]"
              />
            </label>

            <label className="block text-sm text-[#4A7C87]">
              Address
              <input
                value={editForm.address}
                onChange={(e) => setEditForm((prev) => ({ ...prev, address: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] px-3 py-2 text-sm text-[#0D2F36]"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm text-[#4A7C87]">
                City
                <input
                  value={editForm.city}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, city: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] px-3 py-2 text-sm text-[#0D2F36]"
                />
              </label>
              <label className="block text-sm text-[#4A7C87]">
                State
                <input
                  value={editForm.state}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, state: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] px-3 py-2 text-sm text-[#0D2F36]"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm text-[#4A7C87]">
                Pincode
                <input
                  value={editForm.pincode}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, pincode: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] px-3 py-2 text-sm text-[#0D2F36]"
                />
              </label>

              <label className="block text-sm text-[#4A7C87]">
                MRN Prefix
                <input
                  value={editForm.mrn_prefix}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, mrn_prefix: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] px-3 py-2 text-sm text-[#0D2F36]"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm text-[#4A7C87]">
                Beds
                <input
                  type="number"
                  min={0}
                  value={editForm.total_beds}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, total_beds: Number(e.target.value || 0) }))}
                  className="mt-1 w-full rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] px-3 py-2 text-sm text-[#0D2F36]"
                />
              </label>

              <label className="block text-sm text-[#4A7C87]">
                Plan
                <select
                  value={editForm.subscription_plan}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, subscription_plan: e.target.value as Hospital['subscription_plan'] }))}
                  className="mt-1 w-full rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] px-3 py-2 text-sm text-[#0D2F36]"
                >
                  <option value="BASIC">BASIC</option>
                  <option value="STANDARD">STANDARD</option>
                  <option value="ENTERPRISE">ENTERPRISE</option>
                </select>
              </label>

              <label className="block text-sm text-[#4A7C87]">
                Status
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value as Hospital['status'] }))}
                  className="mt-1 w-full rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] px-3 py-2 text-sm text-[#0D2F36]"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="TRIAL">TRIAL</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                  <option value="EXPIRED">EXPIRED</option>
                </select>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setEditingHospital(null)}>Cancel</Button>
              <Button onClick={handleSaveEdit} disabled={isSavingEdit}>
                {isSavingEdit ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </SlideOverPanel>
      )}

      <AddHospitalModal open={showModal} onClose={() => setShowModal(false)} onSubmit={handleAddHospital} />
    </PageLayout>
  );
}