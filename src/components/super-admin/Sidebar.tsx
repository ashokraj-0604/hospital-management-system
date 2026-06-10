'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, Users, Settings, CreditCard, FileText, ChevronLeft, ChevronRight, LogOut, ShieldCheck, Bell } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { BRAND } from '@/src/constants/brand.constants';

interface NavItem { href: string; icon: React.ElementType; label: string; exact?: boolean }

const NAV_ITEMS: NavItem[] = [
  { href: '/super-admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/super-admin/hospitals', icon: Building2, label: 'Hospitals' },
  { href: '/super-admin/users', icon: Users, label: 'Users' },
  { href: '/super-admin/billing', icon: CreditCard, label: 'Billing' },
  { href: '/super-admin/audit', icon: FileText, label: 'Audit Logs' },
  { href: '/super-admin/settings', icon: Settings, label: 'Settings' },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const isActive = (href: string, exact?: boolean) => exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className={cn('flex flex-col h-screen sticky top-0 transition-all duration-300 border-r border-[#D6EFF4] bg-white shadow-sm z-40', collapsed ? 'w-[72px]' : 'w-[240px]')}>
      <div className={cn('flex items-center gap-3 px-4 py-5 border-b border-[#D6EFF4]', collapsed && 'justify-center px-0')}>
        <div className="relative shrink-0 h-8 w-8">
          <Image src={BRAND.logo} alt="MedSocio" fill className="object-contain" priority />
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-bold text-[#0D2F36] leading-none">{BRAND.name}</p>
            <p className="text-[10px] text-[#8AACB3] font-medium tracking-wide mt-0.5">SUPER ADMIN</p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-0.5 px-2">
          {NAV_ITEMS.map(({ href, icon: Icon, label, exact }) => {
            const active = isActive(href, exact);
            return (
              <li key={href}>
                <Link href={href} title={collapsed ? label : undefined}
                  className={cn('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                    active ? 'bg-[#E8F8FB] text-[#33ABC3]' : 'text-[#4A7C87] hover:bg-[#F4FAFB] hover:text-[#0D2F36]',
                    collapsed && 'justify-center px-0')}>
                  <Icon size={18} className={cn('shrink-0', active ? 'text-[#33ABC3]' : 'text-[#8AACB3]')} />
                  {!collapsed && <span>{label}</span>}
                  {active && !collapsed && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#33ABC3]" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-[#D6EFF4] p-3 space-y-1">
        {!collapsed && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#4A7C87] hover:bg-[#F4FAFB] cursor-pointer transition-colors">
            <Bell size={16} className="text-[#8AACB3]" />
            <span>Notifications</span>
            <span className="ml-auto flex h-4 w-4 items-center justify-center rounded-full bg-[#33ABC3] text-[9px] font-bold text-white">3</span>
          </div>
        )}
        <div className={cn('flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer hover:bg-[#F4FAFB] transition-colors', collapsed && 'justify-center px-0')}>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#33ABC3]">
            <ShieldCheck size={14} className="text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-[#0D2F36]">Super Admin</p>
              <p className="truncate text-[10px] text-[#8AACB3]">admin@medsocio.com</p>
            </div>
          )}
          {!collapsed && <LogOut size={13} className="shrink-0 text-[#8AACB3]" />}
        </div>
        <button onClick={() => setCollapsed(v => !v)}
          className={cn('flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-[#8AACB3] hover:bg-[#F4FAFB] hover:text-[#4A7C87] transition-colors', collapsed && 'justify-center px-0')}>
          {collapsed ? <ChevronRight size={14} /> : <><ChevronLeft size={14} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
};