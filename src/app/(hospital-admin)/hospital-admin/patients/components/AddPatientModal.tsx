'use client';

import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import {
  CreatePatientPayload,
  DuplicatePatientError,
  Gender,
  BloodGroup,
  RegistrationType,
} from '../patient.type';
import styles from './AddPatientModal.module.scss';

interface Props {
  onClose: () => void;
  onSubmit: (payload: CreatePatientPayload) => Promise<unknown>;
  isSubmitting: boolean;
  error: DuplicatePatientError | Error | null;
  onDismissError: () => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'UNKNOWN'];
const REGISTRATION_TYPES: { value: RegistrationType; label: string }[] = [
  { value: 'WALK_IN', label: 'Walk-in' },
  { value: 'REFERRED', label: 'Referred' },
  { value: 'PRE_REGISTERED', label: 'Pre-registered' },
];
const OPTIONAL_STRING_FIELDS: (keyof CreatePatientPayload)[] = [
  'email',
  'address',
  'emergency_contact_name',
  'emergency_contact_phone',
  'insurance_provider',
  'insurance_policy_number',
];

const emptyForm: CreatePatientPayload = {
  full_name: '',
  date_of_birth: '',
  gender: 'MALE' as Gender,
  blood_group: 'UNKNOWN',
  phone: '',
  email: '',
  address: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  insurance_provider: '',
  insurance_policy_number: '',
  registration_type: 'WALK_IN',
};

export default function AddPatientModal({
  onClose,
  onSubmit,
  isSubmitting,
  error,
  onDismissError,
}: Props) {
  const [form, setForm] = useState<CreatePatientPayload>(emptyForm);

  const isDuplicateError = error instanceof DuplicatePatientError;

  const update = (field: keyof CreatePatientPayload, value: string) => {
    if (error) onDismissError();
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
    forceOverride = false,
  ) => {
    e.preventDefault();
    try {
      const payload: CreatePatientPayload = {
        ...form,
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        duplicate_override: forceOverride,
      };

      OPTIONAL_STRING_FIELDS.forEach((field) => {
        const value = payload[field];
        if (typeof value !== 'string') return;
        const trimmed = value.trim();
        if (!trimmed) {
          delete payload[field];
          return;
        }
        payload[field] = trimmed;
      });

      await onSubmit(payload);
      onClose();
    } catch {
      // error surfaces via the `error` prop from the mutation
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>New Patient Registration</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={(e) => handleSubmit(e, false)} className={styles.form}>
          {isDuplicateError && (
            <div className={styles.duplicateWarning}>
              <AlertTriangle size={18} />
              <div>
                <strong>Possible duplicate patient</strong>
                <ul>
                  {(error as DuplicatePatientError).duplicates.map((d) => (
                    <li key={d.patient_id}>
                      {d.full_name} — {d.mrn} — {d.phone}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className={styles.overrideButton}
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={isSubmitting}
                >
                  Register anyway
                </button>
              </div>
            </div>
          )}

          {error && !isDuplicateError && (
            <div className={styles.errorBanner}>
              Something went wrong. Please try again.
            </div>
          )}

          <div className={styles.sectionTitle}>Demographics</div>
          <div className={styles.grid}>
            <label className={styles.fullWidth}>
              Full Name *
              <input
                required
                value={form.full_name}
                onChange={(e) => update('full_name', e.target.value)}
              />
            </label>

            <label>
              Date of Birth *
              <input
                required
                type="date"
                value={form.date_of_birth}
                onChange={(e) => update('date_of_birth', e.target.value)}
              />
            </label>

            <label>
              Gender *
              <select value={form.gender} onChange={(e) => update('gender', e.target.value)}>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </label>

            <label>
              Blood Group
              <select
                value={form.blood_group}
                onChange={(e) => update('blood_group', e.target.value)}
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Registration Type
              <select
                value={form.registration_type}
                onChange={(e) => update('registration_type', e.target.value)}
              >
                {REGISTRATION_TYPES.map((rt) => (
                  <option key={rt.value} value={rt.value}>
                    {rt.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className={styles.sectionTitle}>Contact</div>
          <div className={styles.grid}>
            <label>
              Phone *
              <input
                required
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
              />
            </label>
            <label className={styles.fullWidth}>
              Address
              <input value={form.address} onChange={(e) => update('address', e.target.value)} />
            </label>
            <label>
              Emergency Contact Name
              <input
                value={form.emergency_contact_name}
                onChange={(e) => update('emergency_contact_name', e.target.value)}
              />
            </label>
            <label>
              Emergency Contact Phone
              <input
                value={form.emergency_contact_phone}
                onChange={(e) => update('emergency_contact_phone', e.target.value)}
              />
            </label>
          </div>

          <div className={styles.sectionTitle}>Insurance (optional)</div>
          <div className={styles.grid}>
            <label>
              Insurance Provider
              <input
                value={form.insurance_provider}
                onChange={(e) => update('insurance_provider', e.target.value)}
              />
            </label>
            <label>
              Policy Number
              <input
                value={form.insurance_policy_number}
                onChange={(e) => update('insurance_policy_number', e.target.value)}
              />
            </label>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? 'Registering…' : 'Register Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
