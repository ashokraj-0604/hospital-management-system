'use client';

import React, { useEffect, useState } from 'react';
import { FlaskConical } from 'lucide-react';
import { labStaffApi, LabRequestRow } from '../lab.api';
import { Alert } from '@/src/core';
import { TableCard } from '@/src/core/table/TableCard';
import { TableToolbar } from '@/src/core/table/TableToolbar';
import { SearchInput } from '@/src/core/table/SearchInput';
import { EmptyState } from '@/src/core/table/EmptyState';
import { LoadingSpinner } from '@/src/core/table/TableLoading';
import { BRAND } from '@/src/constants/brand.constants';

const urgencyColor: Record<string, string> = {
  ROUTINE: 'bg-gray-100 text-gray-600',
  URGENT: 'bg-red-100 text-red-600',
};

export default function PendingRequestsPage() {
  const [requests, setRequests] = useState<LabRequestRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [resultDrafts, setResultDrafts] = useState<Record<string, string>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const fetchAll = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await labStaffApi.findPending();
      setRequests(data.filter((r) => r.status === 'PENDING'));
    } catch {
      setError('Unable to load lab requests.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const filtered = requests.filter(
    (r) =>
      r.patient_name.toLowerCase().includes(search.toLowerCase()) ||
      r.test_name.toLowerCase().includes(search.toLowerCase()) ||
      r.doctor_name.toLowerCase().includes(search.toLowerCase()),
  );
const [fileDrafts, setFileDrafts] = useState<Record<string, File | null>>({});
  const handleSubmitResult = async (requestId: string) => {
  const result = resultDrafts[requestId]?.trim();
  if (!result) return;
  setSubmittingId(requestId);
  try {
    await labStaffApi.submitResult(requestId, result, fileDrafts[requestId]);
    await fetchAll();
    setResultDrafts((prev) => { const n = { ...prev }; delete n[requestId]; return n; });
    setFileDrafts((prev) => { const n = { ...prev }; delete n[requestId]; return n; });
  } finally {
    setSubmittingId(null);
  }
};

  if (error) return <div className="p-6"><Alert variant="error" message={error} /></div>;

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: BRAND.colors.textDark }}>Pending Requests</h1>
        <p className="text-sm" style={{ color: BRAND.colors.textLight }}>{requests.length} awaiting results</p>
      </div>

      <TableCard>
        <TableToolbar>
          <SearchInput value={search} onChange={setSearch} placeholder="Search by patient, test, or doctor..." />
        </TableToolbar>

        {isLoading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <EmptyState icon={FlaskConical} message="No pending lab requests." />
        ) : (
          <div className="divide-y" style={{ borderColor: BRAND.colors.border }}>
            {filtered.map((r) => (
              <div key={r.request_id} className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold" style={{ color: BRAND.colors.textDark }}>{r.patient_name}</p>
                    <p className="text-sm" style={{ color: BRAND.colors.textMid }}>
                      {r.test_name} ({r.test_type}) — ordered by {r.doctor_name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: BRAND.colors.textLight }}>
                      {new Date(r.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${urgencyColor[r.urgency]}`}>
                    {r.urgency}
                  </span>
                </div>

                {r.clinical_notes && (
                  <p className="mt-2 text-xs italic" style={{ color: BRAND.colors.textLight }}>
                    Note: {r.clinical_notes}
                  </p>
                )}

                <div className="mt-3 space-y-2">
  <div className="flex gap-2">
    <input
      placeholder="Enter result..."
      value={resultDrafts[r.request_id] ?? ''}
      onChange={(e) => setResultDrafts({ ...resultDrafts, [r.request_id]: e.target.value })}
      className="flex-1 rounded-lg border px-3 py-2 text-sm"
      style={{ borderColor: BRAND.colors.border }}
    />
    <button
      onClick={() => handleSubmitResult(r.request_id)}
      disabled={submittingId === r.request_id || !resultDrafts[r.request_id]?.trim()}
      className="text-sm font-medium text-white px-4 py-2 rounded-lg disabled:opacity-50"
      style={{ backgroundColor: BRAND.colors.primary }}
    >
      {submittingId === r.request_id ? 'Submitting...' : 'Submit'}
    </button>
  </div>
  <input
    type="file"
    accept=".pdf,.jpg,.jpeg,.png"
    onChange={(e) => setFileDrafts({ ...fileDrafts, [r.request_id]: e.target.files?.[0] ?? null })}
    className="text-xs"
  />
  {fileDrafts[r.request_id] && (
    <p className="text-xs" style={{ color: BRAND.colors.textLight }}>
      Attached: {fileDrafts[r.request_id]!.name}
    </p>
  )}
</div>
              </div>
            ))}
          </div>
        )}
      </TableCard>
    </div>
  );
}