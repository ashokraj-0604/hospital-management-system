import { Header, Sidebar } from '@/src/core/components';

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header title="Doctor" />
      <Sidebar items={[{ href: '/doctor/dashboard', label: 'Dashboard' }, { href: '/doctor/appointments', label: 'Appointments' }]} />
      <main>{children}</main>
    </div>
  );
}
