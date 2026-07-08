// src/core/table/EmptyState.tsx
import React from 'react';

interface EmptyStateProps {
  icon: React.ElementType;
  message: string;
}

export function EmptyState({ icon: Icon, message }: EmptyStateProps) {
  return (
    <div className="py-16 text-center">
      <Icon size={32} className="mx-auto text-[#D6EFF4] mb-2" />
      <p className="text-sm text-[#8AACB3]">{message}</p>
    </div>
  );
}