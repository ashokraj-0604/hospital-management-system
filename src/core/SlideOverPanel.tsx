// src/core/SlideOverPanel.tsx
import React from 'react';

interface SlideOverPanelProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
}

export function SlideOverPanel({ title, onClose, children, width = 380 }: SlideOverPanelProps) {
  return (
    <div
      className="fixed inset-y-0 right-0 bg-white border-l border-[#D6EFF4] shadow-2xl z-50 overflow-y-auto"
      style={{ width }}
    >
      <div className="p-5 border-b border-[#D6EFF4] flex items-center justify-between">
        <h2 className="font-semibold text-[#0D2F36]">{title}</h2>
        <button onClick={onClose} className="text-[#8AACB3] hover:text-[#0D2F36] text-xl leading-none">
          &times;
        </button>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}