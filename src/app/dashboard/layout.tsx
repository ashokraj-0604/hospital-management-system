import { HospitalSidebar } from '@/src/components/hospital/Sidebar';
import type { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <HospitalSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}