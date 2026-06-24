'use client';

interface Props {
  stats: any;
}

export function SubscriptionDistribution({ stats }: Props) {
  return (
    <div className="rounded-2xl bg-white border border-[#D6EFF4] p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-[#0D2F36] mb-4">
        Subscription Distribution
      </h3>

      <div className="space-y-4">
        {[
          {
            label: 'Enterprise',
            key: 'ENTERPRISE',
            bg: '#0D2F36',
          },
          {
            label: 'Standard',
            key: 'STANDARD',
            bg: '#33ABC3',
          },
          {
            label: 'Basic',
            key: 'BASIC',
            bg: '#8AACB3',
          },
        ].map(({ label, key, bg }) => {
          const count =
            stats?.hospitals_by_plan?.[
              key as keyof typeof stats.hospitals_by_plan
            ] ?? 0;

          const total = stats?.total_hospitals ?? 1;

          const pct = Math.round((count / total) * 100);

          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-[#4A7C87]">
                  {label}
                </span>

                <span className="text-xs font-bold text-[#0D2F36]">
                  {count}
                  <span className="text-[#8AACB3] font-normal">
                    {' '}
                    ({pct}%)
                  </span>
                </span>
              </div>

              <div className="h-2 rounded-full bg-[#F4FAFB]">
                <div
                  className="h-2 rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: bg,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-[#D6EFF4] grid grid-cols-3 gap-2 text-center">
        {[
          {
            label: 'Active',
            value: stats?.active_hospitals,
            color: 'text-emerald-600',
          },
          {
            label: 'Trial',
            value: stats?.trial_hospitals,
            color: 'text-amber-600',
          },
          {
            label: 'Suspended',
            value: stats?.suspended_hospitals,
            color: 'text-red-500',
          },
        ].map(({ label, value, color }) => (
          <div key={label}>
            <p className={`text-lg font-bold ${color}`}>
              {value ?? 0}
            </p>

            <p className="text-[10px] text-[#8AACB3] font-medium">
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}