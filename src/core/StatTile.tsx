// src/core/StatTile.tsx
import React from 'react';
import { cn } from '@/src/lib/utils';

export interface StatTileData {
  label: string;
  value: React.ReactNode;
  icon: React.ElementType;
  bg: string;    // icon background color class, e.g. 'bg-emerald-50'
  color: string; // icon color class, e.g. 'text-emerald-600'
}

interface StatTileProps extends StatTileData {}

export function StatTile({ label, value, icon: Icon, bg, color }: StatTileProps) {
  return (
    <div className="rounded-2xl bg-white border border-[#D6EFF4] px-5 py-4 flex items-center gap-4 shadow-sm">
      <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl shrink-0', bg)}>
        <Icon size={20} className={color} />
      </div>
      <div>
        <p className="text-lg font-bold text-[#0D2F36] tabular-nums">{value}</p>
        <p className="text-xs text-[#8AACB3]">{label}</p>
      </div>
    </div>
  );
}

interface SummaryGridProps {
  tiles: StatTileData[];
  columns?: 2 | 4;
}

/** Grid of StatTiles — pass the same {label, value, icon, bg, color}[] array both pages already build. */
export function SummaryGrid({ tiles, columns = 4 }: SummaryGridProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-4', columns === 4 && 'lg:grid-cols-4 sm:grid-cols-4')}>
      {tiles.map(tile => <StatTile key={tile.label} {...tile} />)}
    </div>
  );
}