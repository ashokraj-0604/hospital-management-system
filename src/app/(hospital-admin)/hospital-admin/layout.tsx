// src/app/hospital-admin/layout.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './components/Sidebar';
import { clearAuthData, userStorage } from '@/src/lib/token.utils';
import type { User } from '@/src/types';
import type { HospitalAdminProfile } from '@/src/types/hospitals';

// Maps the current pathname to the Sidebar's active nav key
function resolveActiveKey(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean); // ['hospital-admin', 'patients', ...]
  if (segments.length <= 1) return 'dashboard';
  return segments[1]; // 'patients' | 'appointments' | 'beds' | ...
}

export default function HospitalAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<HospitalAdminProfile | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      const storedUser = userStorage.get() as (User & Partial<HospitalAdminProfile>) | null;

      if (!storedUser || storedUser.role !== 'HOSPITAL_ADMIN') {
        router.replace('/');
        return;
      }

      if (!isMounted) return;

      setProfile({
        user_id: storedUser.user_id,
        full_name: storedUser.full_name,
        email: storedUser.email,
        role: 'HOSPITAL_ADMIN',
        hospital_id: storedUser.hospital_id,
        hospital_name: storedUser.hospital_name ?? 'Hospital',
        hospital_code: storedUser.hospital_code ?? 'HA',
        primary_color: storedUser.primary_color ?? '#33ABC3',
      });
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleLogout = () => {
    clearAuthData();
    router.push('/');
  };

  if (!profile) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F4FAFB]">
        <p className="text-sm text-[#8AACB3]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4FAFB]">
      <Sidebar activeKey={resolveActiveKey(pathname)} profile={profile} onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
