import type { Metadata } from 'next';
import { Sidebar } from '@/src/components/super-admin/Sidebar';

export const metadata: Metadata = {
  title: 'Super Admin — MedSocio',
  description: 'MedSocio platform administration',
};

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F4FAFB]">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  );
}