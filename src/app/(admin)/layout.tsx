import { Header, Sidebar } from '@/src/core/components';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header title="Admin" />
      <div>
        <Sidebar items={[{ href: '/dashboard', label: 'Dashboard' }, { href: '/appointments', label: 'Appointments' }]} />
        <main>{children}</main>
      </div>
    </div>
  );
}
