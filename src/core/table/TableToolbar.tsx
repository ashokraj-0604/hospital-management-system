// src/core/table/TableToolbar.tsx
import React from 'react';
import { cn } from '@/src/lib/utils';

interface TableToolbarProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps search input, filter selects, and a trailing count/label.
 * Put `ml-auto` on the last child (e.g. entry count) to push it right,
 * matching the existing pages' pattern.
 */
export function TableToolbar({ children, className }: TableToolbarProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-3 px-5 py-4 border-b border-[#D6EFF4]', className)}>
      {children}
    </div>
  );
}