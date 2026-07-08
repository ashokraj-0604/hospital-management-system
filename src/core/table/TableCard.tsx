// src/core/table/TableCard.tsx
import React from 'react';
import { cn } from '@/src/lib/utils';

interface TableCardProps {
  children: React.ReactNode;
  className?: string;
}

export function TableCard({ children, className }: TableCardProps) {
  return (
    <div className={cn('rounded-2xl bg-white border border-[#D6EFF4] shadow-sm overflow-hidden', className)}>
      {children}
    </div>
  );
}

interface TableCardFooterProps {
  children: React.ReactNode;
  className?: string;
}

/** Bottom bar: e.g. "Logs retained for 90 days" + pagination controls. */
export function TableCardFooter({ children, className }: TableCardFooterProps) {
  return (
    <div className={cn('px-5 py-3 border-t border-[#D6EFF4] flex items-center justify-between', className)}>
      {children}
    </div>
  );
}