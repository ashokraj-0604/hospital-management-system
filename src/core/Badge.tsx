// src/core/Badge.tsx
import React from 'react';
import { cn } from '@/src/lib/utils';

interface BadgeProps {
  label: string;
  icon?: React.ElementType;
  className: string; // color classes, e.g. 'bg-emerald-50 text-emerald-700 border-emerald-200'
  size?: 'sm' | 'md';
  shape?: 'pill' | 'chip'; // pill = rounded-full w/ border, chip = rounded-lg no border
  iconSize?: number;
}

/**
 * Single generic badge component. Replaces:
 *  - Audit's ACTION_CONFIG icon squares (use shape="square" via BadgeIcon below)
 *  - Billing's STATUS_CONFIG pills          -> shape="pill"
 *  - Users' ROLE_COLORS badges              -> shape="chip"
 *  - Users' active/inactive dot badge       -> shape="pill" + <DotBadge />
 */
export function Badge({ label, icon: Icon, className, size = 'md', shape = 'chip', iconSize = 11 }: BadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  const shapeClasses = shape === 'pill'
    ? 'inline-flex items-center gap-1.5 rounded-full border font-medium'
    : 'inline-flex items-center gap-1.5 rounded-lg font-semibold';

  return (
    <span className={cn(shapeClasses, sizeClasses, className)}>
      {Icon && <Icon size={iconSize} />}
      {label}
    </span>
  );
}

interface BadgeIconProps {
  icon: React.ElementType;
  className: string;
  size?: number;
}

/** The 9x9 rounded-icon-square used in Audit's log entries (action type marker). */
export function BadgeIcon({ icon: Icon, className, size = 16 }: BadgeIconProps) {
  return (
    <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl mt-0.5', className)}>
      <Icon size={size} />
    </div>
  );
}

interface DotBadgeProps {
  active: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

/** The active/inactive pill-with-dot used in Users' status column. */
export function DotBadge({ active, activeLabel = 'Active', inactiveLabel = 'Inactive' }: DotBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border',
      active
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : 'bg-red-50 text-red-600 border-red-200',
    )}>
      <span className={cn('h-1.5 w-1.5 rounded-full', active ? 'bg-emerald-500' : 'bg-red-400')} />
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}