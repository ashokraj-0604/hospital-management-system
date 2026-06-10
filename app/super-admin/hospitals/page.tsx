'use client';

import React, { useState } from 'react';
import { useHospitals, useHospitalActions } from '@/src/hooks/super-admin/useHospital';
import { HospitalTable } from '@/src/components/super-admin/HospitalTable';
import { AddHospitalModal } from '@/src/components/super-admin/AddHospitalModal';
import type { Hospital, AddHospitalFormValues } from '@/src/types/super-admin.types';

export default function HospitalsPage() {
  const [search, setSearch]   = useState('');
  const [status, setStatus]   = useState('');
  const [plan, setPlan]       = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  const { hospitals, isLoading, refetch } = useHospitals({ search, status, plan });
  const { suspend, activate } = useHospitalActions(refetch);

  const handleAddHospital = async (values: AddHospitalFormValues) => {
    // Wire to: await superAdminService.createHospital(values);
    console.log('Creating hospital:', values);
    await new Promise(r => setTimeout(r, 1200)); // simulate API
    refetch();
  };

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-bold text-[#0D2F36]">Hospitals</h1>
        <p className="text-sm text-[#8AACB3] mt-0.5">Manage all tenant hospitals on the platform</p>
      </div>

      <HospitalTable
        hospitals={hospitals}
        isLoading={isLoading}
        onSearch={setSearch}
        onFilterStatus={setStatus}
        onFilterPlan={setPlan}
        onAddNew={() => setShowModal(true)}
        onView={setSelectedHospital}
        onSuspend={h => {
          const reason = prompt(`Reason for suspending ${h.hospital_name}?`);
          if (reason) suspend(h.hospital_id, reason);
        }}
        onActivate={h => activate(h.hospital_id)}
      />

      {/* Slide-out detail panel */}
      {selectedHospital && (
        <div className="fixed inset-y-0 right-0 w-[380px] bg-white border-l border-[#D6EFF4] shadow-2xl z-50 overflow-y-auto">
          <div className="p-5 border-b border-[#D6EFF4] flex items-center justify-between">
            <h2 className="font-semibold text-[#0D2F36]">Hospital Details</h2>
            <button onClick={() => setSelectedHospital(null)} className="text-[#8AACB3] hover:text-[#0D2F36] text-xl leading-none">&times;</button>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: selectedHospital.primary_color }}>
                {selectedHospital.hospital_code.slice(0, 2)}
              </div>
              <div>
                <p className="font-bold text-[#0D2F36]">{selectedHospital.hospital_name}</p>
                <p className="text-xs text-[#8AACB3]">{selectedHospital.hospital_code}</p>
              </div>
            </div>
            {[
              ['Email',    selectedHospital.primary_email],
              ['Phone',    selectedHospital.primary_phone],
              ['City',     `${selectedHospital.city}, ${selectedHospital.state}`],
              ['Plan',     selectedHospital.subscription_plan],
              ['Status',   selectedHospital.status],
              ['MRN Prefix', selectedHospital.mrn_prefix],
              ['Beds',     selectedHospital.total_beds?.toLocaleString()],
              ['Users',    selectedHospital.total_users?.toLocaleString()],
              ['Patients', selectedHospital.total_patients?.toLocaleString()],
              ['Created',  new Date(selectedHospital.created_at).toLocaleDateString('en-IN')],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-[#F4FAFB]">
                <span className="text-xs text-[#8AACB3]">{label}</span>
                <span className="text-sm font-medium text-[#0D2F36]">{value ?? '—'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Hospital modal */}
      <AddHospitalModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddHospital}
      />
    </div>
  );
}