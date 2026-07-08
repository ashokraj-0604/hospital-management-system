// src/core/layout/PageLayout.tsx
import React from 'react';
import { cn } from '@/src/lib/utils';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/** Standard page shell: padding, vertical rhythm, max content width. */
export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div className={cn('p-6 space-y-6 max-w-[1400px]', className)}>
      {children}
    </div>
  );
}