// src/core/DetailList.tsx
import React from 'react';

export type DetailRow = [label: string, value: React.ReactNode];

interface DetailListProps {
  rows: DetailRow[];
}

/** Renders label/value pairs, e.g. [['Email', h.primary_email], ['Plan', h.subscription_plan]]. */
export function DetailList({ rows }: DetailListProps) {
  return (
    <>
      {rows.map(([label, value]) => (
        <div key={label} className="flex justify-between items-center py-2 border-b border-[#F4FAFB]">
          <span className="text-xs text-[#8AACB3]">{label}</span>
          <span className="text-sm font-medium text-[#0D2F36]">{value ?? '—'}</span>
        </div>
      ))}
    </>
  );
}