'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/src/lib/utils';

// ─── StatsCard ────────────────────────────────────────────────────────────────

interface StatsCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  growth?: number;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label, value, subValue, icon: Icon, iconBg, iconColor, growth, className,
}) => {
  const isPositive = growth !== undefined && growth >= 0;

  return (
    <div className={cn(
      'rounded-2xl bg-white border border-[#D6EFF4] p-5 shadow-sm',
      'hover:shadow-md hover:border-[#33ABC3]/30 transition-all duration-200',
      className,
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-[#8AACB3] uppercase tracking-wider">{label}</p>
          <p className="mt-1.5 text-2xl font-bold text-[#0D2F36] tabular-nums">{value}</p>
          {subValue && <p className="mt-0.5 text-xs text-[#4A7C87]">{subValue}</p>}
          {growth !== undefined && (
            <div className={cn(
              'mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
              isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700',
            )}>
              {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {Math.abs(growth)}% vs last month
            </div>
          )}
        </div>
        <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', iconBg)}>
          <Icon size={22} className={iconColor} />
        </div>
      </div>
    </div>
  );
};