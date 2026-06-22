'use client';

import { Clock } from 'lucide-react';

interface AuditLogProps {
  auditLogs: any[];
  isLoading: boolean;
}

export function AuditLog({
  auditLogs,
  isLoading,
}: AuditLogProps) {
  return (
    <div className="rounded-2xl bg-white border border-[#D6EFF4] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#0D2F36]">
          Recent Activity
        </h3>

        <a
          href="/super-admin/audit"
          className="text-xs font-medium text-[#33ABC3] hover:opacity-80"
        >
          View all →
        </a>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <p className="py-8 text-center text-sm text-[#8AACB3]">
            Loading activity...
          </p>
        ) : auditLogs.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#8AACB3]">
            No recent activity found
          </p>
        ) : (
          auditLogs.map((log) => (
            <div
              key={log.log_id}
              className="flex items-start gap-3"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#E8F8FB] mt-0.5">
                <Clock
                  size={11}
                  className="text-[#33ABC3]"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#0D2F36]">
                  <span className="font-semibold">
                    {log.action}
                  </span>{' '}
                  <span className="text-[#4A7C87]">
                    {log.resource}
                  </span>{' '}
                  for{' '}
                  <span className="font-medium">
                    {log.hospital_name}
                  </span>
                </p>

                <p className="text-[10px] text-[#8AACB3] mt-0.5">
                  {new Date(log.created_at).toLocaleDateString(
                    'en-IN',
                    {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    }
                  )}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}