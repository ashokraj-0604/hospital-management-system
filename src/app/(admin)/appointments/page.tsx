'use client';

import styles from './page.module.scss';
import { useAppointments } from './useAppointments';

export default function AdminAppointmentsPage() {
  const { appointments, isLoading } = useAppointments('doctor-1');

  return (
    <section className={styles.wrapper}>
      <h1>Appointments</h1>
      {isLoading ? <p>Loading...</p> : <p>Rows: {appointments.length}</p>}
    </section>
  );
}
