// src/core/table/ActionMenu.tsx
import React, { useEffect, useRef, useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export interface ActionMenuItem {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger' | 'success';
}

interface ActionMenuProps {
  items: ActionMenuItem[];
}

const VARIANT_CLASSES: Record<NonNullable<ActionMenuItem['variant']>, string> = {
  default: 'text-[#4A7C87]',
  danger: 'text-red-600',
  success: 'text-emerald-600',
};

/**
 * Self-contained kebab menu: owns its own open/close + outside-click state,
 * so callers don't need to track `openMenu` per-row like the original Users page did.
 */
export function ActionMenu({ items }: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="rounded-lg p-1.5 text-[#8AACB3] hover:bg-[#E8F8FB] hover:text-[#33ABC3] transition-colors"
      >
        <MoreVertical size={15} />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-1 w-44 rounded-xl border border-[#D6EFF4] bg-white shadow-lg py-1">
          {items.map(item => (
            <button
              key={item.label}
              onClick={() => { setOpen(false); item.onClick(); }}
              className={cn(
                'flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-[#F4FAFB]',
                VARIANT_CLASSES[item.variant ?? 'default'],
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}