// src/core/table/SearchInput.tsx
import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Search…', className }: SearchInputProps) {
  return (
    <div className={`relative flex-1 min-w-[200px] ${className ?? ''}`}>
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8AACB3]" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] pl-9 pr-4 py-2 text-sm
                   text-[#0D2F36] placeholder-[#8AACB3] focus:outline-none
                   focus:ring-2 focus:ring-[#33ABC3]/30 focus:border-[#33ABC3]"
      />
    </div>
  );
}