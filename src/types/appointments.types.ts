export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  scheduledAt: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}
