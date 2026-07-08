// src/core/Avatar.tsx
import React from 'react';
import { cn } from '@/src/lib/utils';
import { initials } from '@/src/lib/format';

interface AvatarProps {
  /** Full name — first letters of each word are used, e.g. "Jane Doe" -> "JD" */
  name?: string;
  /** Raw text to display as-is (already-short codes, e.g. hospital_code "AP") — takes priority over `name` */
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'square';
  bg?: string;    // e.g. 'bg-[#E8F8FB]' or a hex via style
  color?: string; // text color class, ignored if `style` background is a raw hex needing white text
  style?: React.CSSProperties;
}

const SIZE_CLASSES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-lg',
};

/**
 * Covers both:
 *  - Users' round initials badge: <Avatar name={u.full_name} size="sm" bg="bg-[#E8F8FB]" color="text-[#33ABC3]" />
 *  - Hospitals' square brand-colored avatar: <Avatar label={h.hospital_code.slice(0, 2)} shape="square" size="lg"
 *      style={{ backgroundColor: h.primary_color }} color="text-white" />
 */
export function Avatar({ name, label, size = 'md', shape = 'circle', bg, color = 'text-white', style }: AvatarProps) {
  const text = label ?? (name ? initials(name) : '');
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center font-bold',
        SIZE_CLASSES[size],
        shape === 'circle' ? 'rounded-full' : 'rounded-xl',
        bg,
        color,
      )}
      style={style}
    >
      {text.toUpperCase()}
    </div>
  );
}