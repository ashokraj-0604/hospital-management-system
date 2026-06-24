'use client';

import { Clock } from 'lucide-react';
import { BRAND } from '@/src/constants/brand.constants';

interface Props {
  logs: any[];
  isLoading: boolean;
}

export function ActivityLog({
  logs,
  isLoading,
}: Props) {
  return (
    <div
      className="rounded-2xl bg-white border p-5 shadow-sm"
      style={{ borderColor: BRAND.colors.borderTint }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-sm font-semibold"
          style={{ color: BRAND.colors.textDark }}
        >
          Recent Activity
        </h3>

        <a
          href="/hospital-admin/activity"
          className="text-xs font-medium hover:opacity-80"
          style={{ color: BRAND.colors.primary }}
        >
          View all →
        </a>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <p
            className="py-8 text-center text-sm"
            style={{ color: BRAND.colors.textLight }}
          >
            Loading activity...
          </p>
        ) : logs.length === 0 ? (
          <p
            className="py-8 text-center text-sm"
            style={{ color: BRAND.colors.textLight }}
          >
            No recent activity found
          </p>
        ) : (
          logs.map((log) => (
            <div
              key={log.log_id}
              className="flex items-start gap-3"
            >
              <div
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg mt-0.5"
                style={{
                  backgroundColor:
                    BRAND.colors.iconBgTeal,
                }}
              >
                <Clock
                  size={11}
                  style={{
                    color: BRAND.colors.primary,
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className="text-xs"
                  style={{
                    color: BRAND.colors.textDark,
                  }}
                >
                  {log.description}
                </p>

                <p
                  className="text-[10px] mt-0.5"
                  style={{
                    color: BRAND.colors.textLight,
                  }}
                >
                  {new Date(
                    log.created_at
                  ).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}