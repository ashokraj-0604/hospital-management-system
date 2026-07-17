// src/components/hospital-admin/Sidebar.tsx

'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard, Users, CalendarCheck, BedDouble, Stethoscope,
  FlaskConical, Pill, Receipt, BarChart3, Settings, Building2,
  Building, Contact, HeartPulse, Package,
  Bell, LogOut, ChevronsLeft, ChevronsRight,
} from 'lucide-react';
import { BRAND } from '@/src/constants/brand.constants';
import type { HospitalAdminProfile } from '@/src/types/hospitals';

interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

interface NavSection {
  section: string;
  items: NavItem[];
}

const NAV: NavSection[] = [
  {
    section: '',
    items: [
      { key: 'dashboard', label: 'Dashboard', href: '/hospital-admin', icon: LayoutDashboard },
    ],
  },
  {
    section: 'Hospital Management',
    items: [
      { key: 'hospital-profile', label: 'Hospital Profile', href: '/hospital-admin/profile',     icon: Building2 },
      { key: 'departments',      label: 'Departments',      href: '/hospital-admin/departments', icon: Building },
      { key: 'rooms-beds',       label: 'Rooms & Beds',     href: '/hospital-admin/beds',         icon: BedDouble, badge: 12 },
    ],
  },
  {
    section: 'Staff',
    items: [
      { key: 'staff-doctors',       label: 'Doctors',           href: '/hospital-admin/staff/doctors',       icon: Stethoscope },
      { key: 'staff-receptionists', label: 'Receptionists',     href: '/hospital-admin/staff/receptionists', icon: Contact },
      { key: 'staff-nurses',        label: 'Nurses',            href: '/hospital-admin/staff/nurses',        icon: HeartPulse },
      { key: 'staff-lab',           label: 'Lab Staff',         href: '/hospital-admin/staff/lab',           icon: FlaskConical },
      { key: 'staff-billing',       label: 'Billing Officers',  href: '/hospital-admin/staff/billing',       icon: Receipt },
      { key: 'staff-inventory',     label: 'Inventory Managers',href: '/hospital-admin/staff/inventory',     icon: Package },
    ],
  },
  {
    section: 'Patients',
    items: [
      { key: 'patients',   label: 'Patient List', href: '/hospital-admin/patients',            icon: Users },
      { key: 'admissions', label: 'Admissions',   href: '/hospital-admin/admissions', icon: BedDouble },
    ],
  },
  {
    section: '',
    items: [
      { key: 'appointments', label: 'Appointments', href: '/hospital-admin/appointments', icon: CalendarCheck, badge: 5 },
      { key: 'laboratory',   label: 'Laboratory',   href: '/hospital-admin/laboratory',   icon: FlaskConical },
      { key: 'pharmacy',     label: 'Pharmacy',     href: '/hospital-admin/pharmacy',     icon: Pill },
      { key: 'billing',      label: 'Billing',      href: '/hospital-admin/billing',      icon: Receipt },
      { key: 'inventory',    label: 'Inventory',    href: '/hospital-admin/inventory',    icon: Package },
      { key: 'reports',      label: 'Reports',      href: '/hospital-admin/reports',      icon: BarChart3 },
    ],
  },
  {
    section: 'Manage',
    items: [
      { key: 'settings', label: 'Settings', href: '/hospital-admin/settings', icon: Settings },
    ],
  },
];

interface SidebarProps {
  activeKey: string;
  profile: HospitalAdminProfile;
  onLogout: () => void;
}

export function Sidebar({ activeKey, profile, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex h-full flex-col border-r border-[${BRAND.colors.borderTint}] bg-white transition-all duration-200 ${
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
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white"
          style={{ backgroundColor: BRAND.colors.primary }}
        >
          {profile.hospital_code.slice(0, 2).toUpperCase()}
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold" style={{ color: BRAND.colors.textDark }}>
              {profile.hospital_name}
            </p>
            <p className="text-[10px] font-semibold tracking-wide" style={{ color: BRAND.colors.primary }}>
              HOSPITAL ADMIN
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2">
        {NAV.map((group, idx) => (
          <div key={group.section || `root-${idx}`}>
            {group.section && !collapsed && (
              <p
                className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: BRAND.colors.textLight }}
              >
                {group.section}
              </p>
            )}
            {group.items.map(({ key, label, href, icon: Icon, badge }) => {
              const active = key === activeKey;
              return (
                <a
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
                  {!collapsed && badge !== undefined && (
                    <span
                      className="ml-auto rounded-full px-1.5 text-[10px] font-semibold text-white"
                      style={{ backgroundColor: '#F59E0B' }}
                    >
                      {badge}
                    </span>
                  )}
                </a>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t p-3" style={{ borderColor: BRAND.colors.borderTint }}>
        <button className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-sm hover:bg-[#F4FAFB]">
          <Bell size={16} style={{ color: BRAND.colors.textMid }} />
          {!collapsed && <span className="flex-1 text-left" style={{ color: BRAND.colors.textMid }}>Notifications</span>}
          {!collapsed && (
            <span className="rounded-full px-1.5 text-[10px] font-semibold text-white" style={{ backgroundColor: '#F59E0B' }}>
              3
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
            {profile.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-xs font-semibold" style={{ color: BRAND.colors.textDark }}>
                {profile.full_name}
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