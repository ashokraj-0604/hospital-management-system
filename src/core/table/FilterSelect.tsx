// src/core/table/FilterSelect.tsx
import React from 'react';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  className?: string;
}

export function FilterSelect({ value, onChange, options, className }: FilterSelectProps) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] px-3 py-2 text-sm
                  text-[#4A7C87] focus:outline-none focus:ring-2 focus:ring-[#33ABC3]/30 ${className ?? ''}`}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}