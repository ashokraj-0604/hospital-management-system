'use client';

interface RecentHospitalsProps {
  hospitals: any[];
  isLoading: boolean;
}

export function RecentHospitals({
  hospitals,
  isLoading,
}: RecentHospitalsProps) {
  return (
    <div className="lg:col-span-2 rounded-2xl bg-white border border-[#D6EFF4] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#0D2F36]">
          Recent Hospitals
        </h3>

        <a
          href="/super-admin/hospitals"
          className="text-xs font-medium text-[#33ABC3] hover:opacity-80"
        >
          View all →
        </a>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <p className="py-8 text-center text-sm text-[#8AACB3]">
            Loading hospitals...
          </p>
        ) : hospitals.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#8AACB3]">
            No hospitals found
          </p>
        ) : (
          hospitals.map((h) => (
            <div
              key={h.hospital_id}
              className="flex items-center gap-3 rounded-xl p-3 hover:bg-[#F4FAFB] transition-colors"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white text-xs font-bold"
                style={{ backgroundColor: h.primary_color }}
              >
                {h.hospital_code.slice(0, 2)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold text-[#0D2F36]">
                  {h.hospital_name}
                </p>

                <p className="text-xs text-[#8AACB3]">
                  {h.city} · {h.total_beds} beds
                </p>
              </div>

              <div className="text-right shrink-0">
                <span
                  className={`text-xs font-semibold rounded-lg px-2 py-0.5 ${
                    h.status === 'ACTIVE'
                      ? 'bg-emerald-50 text-emerald-700'
                      : h.status === 'TRIAL'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  {h.status}
                </span>

                <p className="text-[10px] text-[#8AACB3] mt-0.5">
                  {h.subscription_plan}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}