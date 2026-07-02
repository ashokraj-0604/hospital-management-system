'use client';

import { MoreVertical, UserX } from 'lucide-react';
import { useState } from 'react';
import { Patient, PatientListResponse } from '../patient.type';
import styles from './PatientTable.module.scss';

interface Props {
  patients: Patient[];
  isLoading: boolean;
  meta?: PatientListResponse['meta'];
  page: number;
  onPageChange: (page: number) => void;
  onDeactivate: (patientId: string) => void;
}

function calculateAge(dob: string): number {
  const birth = new Date(dob);
  const diff = Date.now() - birth.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

export default function PatientTable({
  patients,
  isLoading,
  meta,
  page,
  onPageChange,
  onDeactivate,
}: Props) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  if (isLoading) {
    return <div className={styles.emptyState}>Loading patients…</div>;
  }

  if (patients.length === 0) {
    return <div className={styles.emptyState}>No patients found.</div>;
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>MRN</th>
            <th>Name</th>
            <th>Age / Gender</th>
            <th>Blood Group</th>
            <th>Phone</th>
            <th>Registered</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.patient_id}>
              <td className={styles.mono}>{patient.mrn}</td>
              <td className={styles.nameCell}>{patient.full_name}</td>
              <td>
                {calculateAge(patient.date_of_birth)} yrs · {patient.gender.charAt(0)}
              </td>
              <td>{patient.blood_group}</td>
              <td>{patient.phone}</td>
              <td>{new Date(patient.created_at).toLocaleDateString()}</td>
              <td>
                <span className={`${styles.badge} ${styles[patient.status.toLowerCase()]}`}>
                  {patient.status}
                </span>
              </td>
              <td className={styles.actionsCell}>
                <button
                  className={styles.menuButton}
                  onClick={() =>
                    setOpenMenuId(openMenuId === patient.patient_id ? null : patient.patient_id)
                  }
                >
                  <MoreVertical size={16} />
                </button>
                {openMenuId === patient.patient_id && (
                  <div className={styles.menu}>
                    <button
                      onClick={() => {
                        onDeactivate(patient.patient_id);
                        setOpenMenuId(null);
                      }}
                      disabled={patient.status === 'INACTIVE'}
                    >
                      <UserX size={14} />
                      Deactivate
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {meta && meta.total_pages > 1 && (
        <div className={styles.pagination}>
          <button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            Previous
          </button>
          <span>
            Page {meta.page} of {meta.total_pages}
          </span>
          <button disabled={page >= meta.total_pages} onClick={() => onPageChange(page + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
