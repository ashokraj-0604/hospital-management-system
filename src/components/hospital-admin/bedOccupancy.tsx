// src/components/hospital-admin/BedOccupancyCard.tsx

'use client';

import React from 'react';
import { BRAND } from '@/src/constants/brand.constants';
import type { BedWard } from '../../types/hospitals';

function barColor(pct: number) {
  if (pct >= 90) return '#EF4444';       // red — near full
  if (pct >= 70) return BRAND.colors.primaryDark;
  return BRAND.colors.primary;
}

interface Props {
  wards: BedWard[];
  isLoading: boolean;
}

export function BedOccupancyCard({ wards, isLoading }: Props) {
  return (
    <div className="rounded-2xl bg-white border p-5 shadow-sm" style={{ borderColor: BRAND.colors.borderTint }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold" style={{ color: BRAND.colors.textDark }}>Bed Occupancy</h3>
        <a href="/hospital-admin/beds" className="text-xs font-medium hover:opacity-80" style={{ color: BRAND.colors.primary }}>
          Manage →
        </a>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <p className="py-8 text-center text-sm" style={{ color: BRAND.colors.textLight }}>Loading beds...</p>
        ) : wards.map((ward) => {
          const pct = ward.total_beds === 0 ? 0 : Math.round((ward.occupied_beds / ward.total_beds) * 100);
          return (
            <div key={ward.ward_id}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs" style={{ color: BRAND.colors.textMid }}>{ward.ward_name}</span>
                <span className="text-xs font-semibold" style={{ color: BRAND.colors.textDark }}>
                  {ward.occupied_beds} / {ward.total_beds}
                </span>
              </div>
              <div className="h-2 rounded-full" style={{ backgroundColor: BRAND.colors.surface }}>
                <div
                  className="h-2 rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, backgroundColor: barColor(pct) }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}