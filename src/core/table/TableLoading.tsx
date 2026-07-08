// src/core/table/TableLoading.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';

/** Centered spinner — used e.g. below the toolbar while a list loads (Audit's pattern). */
export function LoadingSpinner({ size = 24 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={size} className="animate-spin text-[#33ABC3]" />
    </div>
  );
}

interface SkeletonRowsProps {
  rows?: number;
  columns: number;
  /** Optional per-column width override, e.g. { 0: '140px', 6: '32px' } */
  widths?: Record<number, string>;
}

/** Skeleton <tbody> rows for a <table> — used in Users while data loads. */
export function SkeletonRows({ rows = 5, columns, widths = {} }: SkeletonRowsProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-[#D6EFF4]">
          {Array.from({ length: columns }).map((_, j) => (
            <td key={j} className="px-5 py-4">
              <div
                className="h-4 bg-[#E8F8FB] rounded-lg animate-pulse"
                style={{ width: widths[j] ?? '80px' }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}