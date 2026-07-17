import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientsApi } from './patients.api';
import {
  CreatePatientPayload,
  UpdatePatientPayload,
  PatientListParams,
  DuplicatePatientError,
} from './patients.types';

export function usePatients() {
  const qc = useQueryClient();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<PatientListParams['status']>(undefined);
  const [page, setPage] = useState(1);

  const params = useMemo(
    () => ({ search: search || undefined, status, page, limit: 20 }),
    [search, status, page],
  );

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['patients', params],
    queryFn: () => patientsApi.list(params),
  });

  const createPatient = useMutation({
    mutationFn: (payload: CreatePatientPayload) => patientsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['patients'] }),
  });

  const updatePatient = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePatientPayload }) =>
      patientsApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['patients'] }),
  });

  const deactivatePatient = useMutation({
    mutationFn: (id: string) => patientsApi.deactivate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['patients'] }),
  });

  return {
    patients: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    isFetching,
    search,
    setSearch,
    status,
    setStatus,
    page,
    setPage,
    createPatient: createPatient.mutateAsync,
    isCreating: createPatient.isPending,
    createError: createPatient.error as DuplicatePatientError | Error | null,
    resetCreateError: createPatient.reset,
    updatePatient: updatePatient.mutate,
    deactivatePatient: deactivatePatient.mutate,
  };
}
