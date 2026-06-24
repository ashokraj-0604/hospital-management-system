'use client';

import { Activity } from 'lucide-react';

interface Props {
  title: string;
  primaryColor?: string;
}

export function DashboardHeader({
  title,
  primaryColor = '#33ABC3',
}: Props) {
  return (
    <div className="flex items-center justify-between">

      <div>
        <h1
          className="text-2xl font-bold"
          style={{ color: '#0D2F36' }}
        >
          {title}
        </h1>

        <p className="text-sm text-[#8AACB3]">
          {new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 shadow-sm">
        <Activity size={14} style={{ color: primaryColor }} />
        <span
          className="text-xs font-semibold"
          style={{ color: primaryColor }}
        >
          System Online
        </span>
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>

    </div>
  );
}