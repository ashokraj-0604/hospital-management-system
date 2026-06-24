'use client';

interface QuickAction {
  icon: any;
  label: string;
  href: string;
  color: string;
  bg: string;
}

interface QuickActionsProps {
  title?: string;
  actions: QuickAction[];
}

export function QuickActions({
  title = 'Quick Actions',
  actions,
}: QuickActionsProps) {
  return (
    <div className="rounded-2xl bg-white border border-[#D6EFF4] p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-[#0D2F36] mb-4">
        {title}
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {actions.map(
          ({ icon: Icon, label, href, color, bg }) => (
            <a
              key={label}
              href={href}
              className="flex flex-col items-start gap-2 rounded-xl border border-[#D6EFF4] p-4 hover:border-[#33ABC3]/40 hover:shadow-sm transition-all"
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ backgroundColor: bg }}
              >
                <Icon size={18} style={{ color }} />
              </div>

              {/* FIXED TYPO HERE */}
              <span className="text-sm font-medium text-[#0D2F36]">
                {label}
              </span>
            </a>
          )
        )}
      </div>
    </div>
  );
}