'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { userStorage, clearAuthData } from '@/src/lib/token.utils';
import type { User } from '@/src/types';
import { Sidebar } from './components/Sidebar';

export default function ReceptionLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = userStorage.get() as User | null;
    if (!storedUser || storedUser.role !== 'RECEPTIONIST') {
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
      <div className="flex h-screen items-center justify-center bg-[#F4FAFB]">
        <p className="text-sm text-[#8AACB3]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4FAFB]">
      <Sidebar profile={profile} onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}