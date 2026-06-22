// src/hooks/hospital-admin/useAppointments.ts

'use client';

import { useEffect, useState } from 'react';
import { hospitalAdminService } from '../../services/hospital-admin/hospitalAdmin.service';
import type { Appointment } from '../../types/hospitals';

const MOCK_APPOINTMENTS: Appointment[] = [
  { appointment_id: '1', patient_id: 'p1', patient_name: 'Ravi Kumar', doctor_id: 'd1', doctor_name: 'Dr. Priya Nair', department: 'Cardiology', type: 'OPD', status: 'CONFIRMED', scheduled_at: new Date().setHours(9, 0, 0, 0).toString() },
  { appointment_id: '2', patient_id: 'p2', patient_name: 'Sunita Mehta', doctor_id: 'd2', doctor_name: 'Dr. Arjun Das', department: 'Orthopaedics', type: 'IPD', status: 'SCHEDULED', scheduled_at: new Date().setHours(9, 30, 0, 0).toString() },
  { appointment_id: '3', patient_id: 'p3', patient_name: 'Venu Pillai', doctor_id: 'd3', doctor_name: 'Emergency Triage', department: 'Emergency', type: 'EMERGENCY', status: 'CONFIRMED', scheduled_at: new Date().setHours(10, 0, 0, 0).toString() },
  { appointment_id: '4', patient_id: 'p4', patient_name: 'Anita Lakshmi', doctor_id: 'd1', doctor_name: 'Dr. Priya Nair', department: 'Cardiology', type: 'OPD', status: 'SCHEDULED', scheduled_at: new Date().setHours(10, 30, 0, 0).toString() },
  { appointment_id: '5', patient_id: 'p5', patient_name: 'Thiru Murugan', doctor_id: 'd4', doctor_name: 'Dr. Kiran Raj', department: 'Neurology', type: 'OPD', status: 'SCHEDULED', scheduled_at: new Date().setHours(11, 0, 0, 0).toString() },
];

export function useAppointments(params: { limit?: number } = {}) {
  const { limit = 5 } = params;
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await hospitalAdminService.getUpcomingAppointments(limit);
        if (mounted) setAppointments(data);
      } catch {
        if (mounted) setAppointments(MOCK_APPOINTMENTS.slice(0, limit));
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [limit]);

  return { appointments, isLoading };
}