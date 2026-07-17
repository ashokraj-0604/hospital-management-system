'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { userStorage, clearAuthData } from '@/src/lib/token.utils';
import type { User } from '@/src/types';
import { BRAND } from '@/src/constants/brand.constants';
import { Sidebar } from './components/Sidebar';

export default function LaboratoryLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = userStorage.get() as User | null;
    if (!storedUser || storedUser.role !== 'LAB_TECHNICIAN') {
      router.replace('/');
      return;
    }
    setProfile(storedUser);
  }, [router]);

  const handleLogout = () => {
    clearAuthData();
    router.replace('/');
  };

  if (!profile) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ backgroundColor: BRAND.colors.surface }}>
        <p className="text-sm" style={{ color: BRAND.colors.textLight }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen" style={{ backgroundColor: BRAND.colors.surface }}>
      <Sidebar profile={profile} onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}