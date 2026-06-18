'use client';

import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type AlertVariant = 'error' | 'success' | 'info' | 'warning';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

// ─── Variant Config ───────────────────────────────────────────────────────────

const config: Record<AlertVariant, { icon: React.ElementType; classes: string }> = {
  error: { icon: AlertCircle, classes: 'bg-red-50 border-red-200 text-red-800' },
  success: { icon: CheckCircle2, classes: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
  info: { icon: Info, classes: 'bg-blue-50 border-blue-200 text-blue-800' },
  warning: { icon: AlertCircle, classes: 'bg-amber-50 border-amber-200 text-amber-800' },
};

// ─── Alert Component ──────────────────────────────────────────────────────────

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  message,
  onClose,
  className,
}) => {
  const { icon: Icon, classes } = config[variant];

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border p-4 text-sm',
        classes,
        className,
      )}
      role="alert"
    >
      <Icon size={18} className="mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold">{title}</p>}
        <p className={title ? 'mt-0.5 opacity-90' : ''}>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="shrink-0 rounded-md p-0.5 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};