'use client';

import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { patientsApi } from '@/src/app/(hospital-admin)/hospital-admin/patients/patient.api';
import { TableCard } from '@/src/core/table/TableCard';
import { SearchInput } from '@/src/core/table/SearchInput';
import { TableToolbar } from '@/src/core/table/TableToolbar';
import { EmptyState } from '@/src/core/table/EmptyState';
import { BRAND } from '@/src/constants/brand.constants';

export default function PatientSearchPage() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (!search.trim()) { setResults([]); return; }
    const t = setTimeout(() => {
      patientsApi.list({ search, limit: 20 }).then((r) => setResults(r.data));
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <h1 className="text-2xl font-bold" style={{ color: BRAND.colors.textDark }}>Patient Search</h1>
      <TableCard>
        <TableToolbar>
          <SearchInput value={search} onChange={setSearch} placeholder="Search by name, phone, or MRN..." />
        </TableToolbar>
        {search.trim() && results.length === 0 ? (
          <EmptyState icon={Search} message="No matching patients." />
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {results.map((p) => (
                <tr key={p.patient_id} className="border-b last:border-b-0" style={{ borderColor: BRAND.colors.border }}>
                  <td className="px-5 py-3 font-medium" style={{ color: BRAND.colors.textDark }}>{p.full_name}</td>
                  <td className="px-5 py-3">{p.phone}</td>
                  <td className="px-5 py-3">{p.mrn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableCard>
    </div>
  );
}