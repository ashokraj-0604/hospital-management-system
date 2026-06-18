'use client';

import styles from './page.module.scss';
import { useDashboard } from './useDashboard';

export default function AdminDashboardPage() {
  const { data } = useDashboard();

  return (
    <section className={styles.wrapper}>
      <h1>Admin Dashboard</h1>
      <p>Total appointments: {data.totalAppointments}</p>
      <p>Pending appointments: {data.pendingAppointments}</p>
    </section>
  );
}
