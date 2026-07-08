// src/core/table/Pagination.tsx
import React from 'react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-2">
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="rounded-lg border border-[#D6EFF4] px-3 py-1 text-xs text-[#4A7C87]
                   hover:bg-[#F4FAFB] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span className="text-xs text-[#8AACB3]">Page {page} of {totalPages}</span>
      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="rounded-lg border border-[#D6EFF4] px-3 py-1 text-xs text-[#4A7C87]
                   hover:bg-[#F4FAFB] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}