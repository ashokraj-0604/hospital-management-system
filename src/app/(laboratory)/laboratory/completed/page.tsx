'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { labStaffApi, LabRequestRow } from '../lab.api';
import { TableCard } from '@/src/core/table/TableCard';
import { TableToolbar } from '@/src/core/table/TableToolbar';
import { SearchInput } from '@/src/core/table/SearchInput';
import { EmptyState } from '@/src/core/table/EmptyState';
import { LoadingSpinner } from '@/src/core/table/TableLoading';
import { BRAND } from '@/src/constants/brand.constants';

export default function CompletedResultsPage() {
  const [requests, setRequests] = useState<LabRequestRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    labStaffApi.findPending().then((data) => {
      setRequests(data.filter((r) => r.status === 'COMPLETED'));
      setIsLoading(false);
    });
  }, []);

  const filtered = requests.filter(
    (r) =>
      r.patient_name.toLowerCase().includes(search.toLowerCase()) ||
      r.test_name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: BRAND.colors.textDark }}>Completed Results</h1>
        <p className="text-sm" style={{ color: BRAND.colors.textLight }}>{requests.length} completed</p>
      </div>

      <TableCard>
        <TableToolbar>
          <SearchInput value={search} onChange={setSearch} placeholder="Search by patient or test..." />
        </TableToolbar>

        {isLoading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <EmptyState icon={CheckCircle2} message="No completed results yet." />
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left" style={{ color: BRAND.colors.textLight }}>
              <tr className="border-b" style={{ borderColor: BRAND.colors.border }}>
                <th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">Test</th>
                <th className="px-5 py-3 font-medium">Doctor</th>
                <th className="px-5 py-3 font-medium">Result</th>
                <th className="px-5 py-3 font-medium">Completed</th>
<th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.request_id} className="border-b last:border-b-0" style={{ borderColor: BRAND.colors.border }}>
                  <td className="px-5 py-3 font-medium" style={{ color: BRAND.colors.textDark }}>{r.patient_name}</td>
                  <td className="px-5 py-3">{r.test_name} <span className="text-xs" style={{ color: BRAND.colors.textLight }}>({r.test_type})</span></td>
                  <td className="px-5 py-3">{r.doctor_name}</td>
                  <td className="px-5 py-3" style={{ color: BRAND.colors.textMid }}>{r.result}</td>
                  <td className="px-5 py-3 text-xs" style={{ color: BRAND.colors.textLight }}>
                    {new Date((r as any).updated_at ?? r.created_at).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: BRAND.colors.textLight }}>
                    {new Date(r.updated_at ?? r.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-5 py-3">
                    {r.result_file_path && (
                        <button
                        onClick={() => labStaffApi.downloadResultFile(r.request_id, r.result_file_name ?? 'result')}
                        className="text-xs font-medium"
                        style={{ color: BRAND.colors.primary }}
                        >
                        Download
                        </button>
                    )}
                    </td>
                </tr>
                
              ))}
            </tbody>
          </table>
        )}
      </TableCard>
    </div>
  );
}