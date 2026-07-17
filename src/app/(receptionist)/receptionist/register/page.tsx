'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { patientsApi } from '@/src/app/(hospital-admin)/hospital-admin/patients/patient.api';
import AddPatientModal from '@/src/app/(hospital-admin)/hospital-admin/patients/components/AddPatientModal';
import { useMutation } from '@tanstack/react-query';

export default function RegisterPatientPage() {
  const router = useRouter();

  const createPatient = useMutation({
    mutationFn: patientsApi.create,
    onSuccess: () => {
      router.push('/receptionist/patients');
    },
  });

  return (
    <div className="p-6">
      <AddPatientModal
        onClose={() => router.push('/receptionist/patients')}
        onSubmit={createPatient.mutateAsync}
        isSubmitting={createPatient.isPending}
        error={(createPatient.error as Error | null) ?? null}
        onDismissError={() => createPatient.reset()}
      />
    </div>
  );
}