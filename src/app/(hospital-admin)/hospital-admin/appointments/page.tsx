'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { CalendarCheck, CalendarPlus } from 'lucide-react';
import { appointmentsApi } from './appointment.api';
import { patientsApi } from '../patients/patient.api';
import { doctorsApi, type Doctor } from '../staff/doctors/doctor.api';
import { getApiErrorMessage } from '@/src/lib/api-error';
import { BRAND } from '@/src/constants/brand.constants';
import { HOSPITAL_APPOINTMENT_TYPES } from '@/src/constants/dashboard.constants';
import type { Appointment, AppointmentType } from '@/src/types/hospitals';
import { Button, Alert } from '@/src/core';
import { SlideOverPanel } from '@/src/core/SlideOverPanel';
import { TableCard } from '@/src/core/table/TableCard';
import { TableToolbar } from '@/src/core/table/TableToolbar';
import { SearchInput } from '@/src/core/table/SearchInput';
import { EmptyState } from '@/src/core/table/EmptyState';
import { LoadingSpinner } from '@/src/core/table/TableLoading';

interface PatientLite {
  patient_id: string;
  full_name: string;
}

interface CreateAppointmentForm {
  patient_id: string;
  doctor_id: string;
  type: AppointmentType;
  scheduled_at: string;
}

const DEFAULT_FORM: CreateAppointmentForm = {
  patient_id: '',
  doctor_id: '',
  type: 'OPD',
  scheduled_at: '',
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<PatientLite[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState('');
  const [showPanel, setShowPanel] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [form, setForm] = useState<CreateAppointmentForm>(DEFAULT_FORM);

  const fetchAll = async () => {
    setIsLoading(true);
    setQueryError(null);

    try {
      const [appointmentRows, patientRes, doctorRows] = await Promise.all([
        appointmentsApi.findAll(),
        patientsApi.list({ limit: 100 }),
        doctorsApi.findAll(),
      ]);

      setAppointments(appointmentRows as Appointment[]);
      setPatients((patientRes.data ?? []).map((patient) => ({
        patient_id: patient.patient_id,
        full_name: patient.full_name,
      })));
      setDoctors(doctorRows);
    } catch (err) {
      setQueryError(getApiErrorMessage(err, 'Unable to load appointments. Please check backend connectivity.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchAll();
  }, []);

  const filteredAppointments = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return appointments;

    return appointments.filter((appointment) =>
      [appointment.patient_name, appointment.doctor_name, appointment.department, appointment.status, appointment.type]
        .some((value) => value.toLowerCase().includes(term)),
    );
  }, [appointments, search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const patient = patients.find((entry) => entry.patient_id === form.patient_id);
    const doctor = doctors.find((entry) => entry.doctor_id === form.doctor_id);

    if (!patient || !doctor) {
      setSubmitError('Select a valid patient and doctor.');
      return;
    }

    setIsSubmitting(true);
    try {
      await appointmentsApi.create({
        patient_id: patient.patient_id,
        patient_name: patient.full_name,
        doctor_id: doctor.doctor_id,
        doctor_name: doctor.name,
        department: doctor.department,
        type: form.type,
        scheduled_at: form.scheduled_at,
      });

      setShowPanel(false);
      setForm(DEFAULT_FORM);
      await fetchAll();
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, 'Unable to book appointment.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: BRAND.colors.textDark }}>Appointments</h1>
          <p className="text-sm" style={{ color: BRAND.colors.textLight }}>{appointments.length} appointments</p>
        </div>
        <Button leftIcon={<CalendarPlus size={16} />} onClick={() => setShowPanel(true)}>Book Appointment</Button>
      </div>

      {queryError && <Alert variant="error" message={queryError} />}

      <TableCard>
        <TableToolbar>
          <SearchInput value={search} onChange={setSearch} placeholder="Search by patient, doctor, status..." />
        </TableToolbar>

        {isLoading ? (
          <LoadingSpinner />
        ) : filteredAppointments.length === 0 ? (
          <EmptyState icon={CalendarCheck} message="No appointments yet." />
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left" style={{ color: BRAND.colors.textLight }}>
              <tr className="border-b" style={{ borderColor: BRAND.colors.border }}>
                <th className="px-5 py-3 font-medium">Time</th>
                <th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">Doctor</th>
                <th className="px-5 py-3 font-medium">Department</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.appointment_id} className="border-b last:border-b-0" style={{ borderColor: BRAND.colors.border }}>
                  <td className="px-5 py-3">{new Date(appointment.scheduled_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                  <td className="px-5 py-3 font-medium" style={{ color: BRAND.colors.textDark }}>{appointment.patient_name}</td>
                  <td className="px-5 py-3">Dr. {appointment.doctor_name}</td>
                  <td className="px-5 py-3">{appointment.department}</td>
                  <td className="px-5 py-3">{appointment.type}</td>
                  <td className="px-5 py-3">{appointment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableCard>

      {showPanel && (
        <SlideOverPanel title="Book Appointment" onClose={() => setShowPanel(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {submitError && <Alert variant="error" message={submitError} />}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Patient</label>
              <select
                required
                value={form.patient_id}
                onChange={(e) => setForm({ ...form, patient_id: e.target.value })}
                className="w-full rounded-xl border px-4 py-3 text-sm"
                style={{ borderColor: BRAND.colors.border }}
              >
                <option value="">Select patient</option>
                {patients.map((patient) => (
                  <option key={patient.patient_id} value={patient.patient_id}>{patient.full_name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Doctor</label>
              <select
                required
                value={form.doctor_id}
                onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
                className="w-full rounded-xl border px-4 py-3 text-sm"
                style={{ borderColor: BRAND.colors.border }}
              >
                <option value="">Select doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.doctor_id} value={doctor.doctor_id}>Dr. {doctor.name} ({doctor.department})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as AppointmentType })}
                className="w-full rounded-xl border px-4 py-3 text-sm"
                style={{ borderColor: BRAND.colors.border }}
              >
                {HOSPITAL_APPOINTMENT_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Schedule Date & Time</label>
              <input
                required
                type="datetime-local"
                value={form.scheduled_at}
                onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
                className="w-full rounded-xl border px-4 py-3 text-sm"
                style={{ borderColor: BRAND.colors.border }}
              />
            </div>

            <Button type="submit" fullWidth isLoading={isSubmitting}>Create Appointment</Button>
          </form>
        </SlideOverPanel>
      )}
    </div>
  );
}
