'use client';

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { usePatients } from './usePatients';
import PatientTable from './components/PatientTable';
import AddPatientModal from './components/AddPatientModal';
import styles from './patients.module.scss';

export default function PatientsPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const {
    patients,
    meta,
    isLoading,
    search,
    setSearch,
    status,
    setStatus,
    page,
    setPage,
    createPatient,
    isCreating,
    createError,
    resetCreateError,
    deactivatePatient,
  } = usePatients();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Patients</h1>
          <p className={styles.subtitle}>
            {meta?.total ?? 0} registered patient{meta?.total === 1 ? '' : 's'}
          </p>
        </div>
        <button className={styles.addButton} onClick={() => setIsAddOpen(true)}>
          <Plus size={18} />
          New Patient
        </button>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            placeholder="Search by name, MRN, or phone"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>
        <select
          className={styles.statusFilter}
          value={status ?? ''}
          onChange={(e) => {
            setPage(1);
            setStatus((e.target.value || undefined) as any);
          }}
        >
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="DECEASED">Deceased</option>
        </select>
      </div>

      <PatientTable
        patients={patients}
        isLoading={isLoading}
        meta={meta}
        page={page}
        onPageChange={setPage}
        onDeactivate={deactivatePatient}
      />

      {isAddOpen && (
        <AddPatientModal
          onClose={() => {
            setIsAddOpen(false);
            resetCreateError();
          }}
          onSubmit={createPatient}
          isSubmitting={isCreating}
          error={createError}
          onDismissError={resetCreateError}
        />
      )}
    </div>
  );
}
