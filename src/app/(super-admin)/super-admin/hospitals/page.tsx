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

      <AddHospitalModal open={showModal} onClose={() => setShowModal(false)} onSubmit={handleAddHospital} />
    </PageLayout>
  );
}