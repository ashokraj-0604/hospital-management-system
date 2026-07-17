'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid, CalendarCheck, Users, Pill, FileText, FlaskConical,
  ClipboardCheck, Bell, LogOut, ChevronsLeft, ChevronsRight, Stethoscope,
} from 'lucide-react';
import { BRAND } from '@/src/constants/brand.constants';
import type { User } from '@/src/types';

interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: React.ElementType;
}

const NAV: NavItem[] = [
  { key: 'dashboard',     label: 'Dashboard',            href: '/doctor',               icon: LayoutGrid },
  { key: 'appointments',  label: "Today's Appointments", href: '/doctor/appointments',  icon: CalendarCheck },
  { key: 'patients',      label: 'My Patients',          href: '/doctor/patients',      icon: Users },
  { key: 'prescriptions', label: 'Prescriptions',        href: '/doctor/prescriptions', icon: Pill },
  { key: 'records',       label: 'Medical Records',      href: '/doctor/records',       icon: FileText },
  { key: 'lab',           label: 'Lab Requests',         href: '/doctor/lab',           icon: FlaskConical },
  { key: 'discharge',     label: 'Discharge Summary',    href: '/doctor/discharge',     icon: ClipboardCheck },
];

interface SidebarProps {
  profile: User;
  onLogout: () => void;
}

export function Sidebar({ profile, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const initials =
    profile.full_name?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || 'DR';

  return (
    <aside
      className={`flex h-full flex-col border-r bg-white transition-all duration-200 ${
        collapsed ? 'w-[72px]' : 'w-[220px]'
      }`}
      style={{ borderColor: BRAND.colors.borderTint }}
    >
      {/* Brand */}
      <div
        className="flex items-center gap-2.5 border-b px-4 py-4"
        style={{ borderColor: BRAND.colors.borderTint }}
      >
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
          style={{ backgroundColor: BRAND.colors.primary }}
        >
          <Stethoscope size={16} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold" style={{ color: BRAND.colors.textDark }}>
              Dr. {profile.full_name}
            </p>
            <p className="text-[10px] font-semibold tracking-wide" style={{ color: BRAND.colors.primary }}>
              DOCTOR
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2">
        {NAV.map(({ key, label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={key}
              href={href}
              className="relative flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
              style={{
                color: active ? BRAND.colors.primary : BRAND.colors.textMid,
                backgroundColor: active ? BRAND.colors.iconBgTeal : 'transparent',
                fontWeight: active ? 600 : 400,
              }}
            >
              {active && (
                <span
                  className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r"
                  style={{ backgroundColor: BRAND.colors.primary }}
                />
              )}
              <Icon size={17} className="shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t p-3" style={{ borderColor: BRAND.colors.borderTint }}>
        <button className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-sm hover:bg-[#F4FAFB]">
          <Bell size={16} style={{ color: BRAND.colors.textMid }} />
          {!collapsed && (
            <span className="flex-1 text-left" style={{ color: BRAND.colors.textMid }}>
              Notifications
            </span>
          )}
        </button>

        <button
          onClick={onLogout}
          className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-[#F4FAFB]"
        >
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
            style={{ backgroundColor: BRAND.colors.accent }}
          >
            {initials}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-xs font-semibold" style={{ color: BRAND.colors.textDark }}>
                Dr. {profile.full_name}
              </p>
              <p className="truncate text-[11px]" style={{ color: BRAND.colors.textLight }}>
                {profile.email}
              </p>
            </div>
          )}
          {!collapsed && <LogOut size={15} style={{ color: BRAND.colors.textLight }} />}
        </button>

        <button
          onClick={() => setCollapsed((c) => !c)}
          className="mt-1.5 flex w-full items-center gap-1.5 border-t pt-2 text-xs"
          style={{ borderColor: BRAND.colors.borderTint, color: BRAND.colors.textMid }}
        >
          {collapsed ? <ChevronsRight size={14} /> : <ChevronsLeft size={14} />}
          {!collapsed && 'Collapse'}
        </button>
      </div>
    </aside>
  );
}